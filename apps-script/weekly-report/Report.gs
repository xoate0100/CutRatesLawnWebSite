/**
 * Weekly website report for Chris + Jason.
 *
 * Chris's email answers his five questions in plain English (where people came from,
 * what they looked at and for how long, quote form use, where they are, what leads/jobs
 * came in) plus a short "Worth knowing" block of things he didn't ask for but should act on.
 *
 * Anything technical (missing dimensions, API errors, tracking gaps) never goes to Chris.
 * It is sent to ALERT_TO as a separate "[Tech notes]" email.
 */
var Report = (function () {
  var DEFAULT_TZ = 'America/Chicago';
  var GREEN = '#1f4d2b';
  var MUTED = '#5f6b62';
  var LINE = '#e3e8e1';
  var SOFT = '#f4f7f2';

  var DEFAULT_SERVICE_AREA = [
    'wichita', 'valley center', 'andover', 'derby', 'maize', 'park city', 'bel aire', 'haysville',
    'goddard', 'mulvane', 'rose hill', 'kechi', 'newton', 'augusta', 'el dorado', 'clearwater',
    'kansas city', 'overland park', 'olathe', 'lenexa', 'shawnee', 'leawood', 'prairie village',
    'merriam', 'mission', "lee's summit", 'independence', 'parkville', 'riverside', 'gladstone',
    'liberty', 'north kansas city', 'leavenworth', 'lansing', 'bonner springs', 'platte city',
    'blue springs', 'raytown', 'grandview', 'basehor', 'tonganoxie',
  ];

  function tz() { return Session.getScriptTimeZone() || DEFAULT_TZ; }
  function fmt(d, pattern) { return Utilities.formatDate(d, tz(), pattern); }

  function mondayOf(d) {
    var x = new Date(d);
    var day = x.getDay();
    var diff = day === 0 ? -6 : 1 - day;
    x.setDate(x.getDate() + diff);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function weekWindow(offsetWeeks) {
    offsetWeeks = offsetWeeks || 0;
    var end = mondayOf(new Date());
    end.setDate(end.getDate() + offsetWeeks * 7);
    var start = new Date(end);
    start.setDate(start.getDate() - 7);
    return { start: start, endExclusive: end };
  }

  function names() {
    return {
      lead: Config.prop('EVT_LEAD', 'conversion_lead'),
      phone: Config.prop('EVT_PHONE', 'phone_click'),
      quoteStart: Config.prop('EVT_QUOTE_START', 'form_start'),
      quoteComplete: Config.prop('EVT_QUOTE_COMPLETE', 'conversion_lead'),
      newsletter: Config.prop('EVT_NEWSLETTER', 'newsletter_signup'),
      funnelStep: Config.prop('EVT_FUNNEL_STEP', 'funnel_step_view'),
      leadSourceDim: Config.prop('GA4_LEAD_SOURCE_DIM', 'customEvent:lead_source'),
      formIdDim: Config.prop('GA4_FORM_ID_DIM', 'customEvent:form_id'),
      stepNameDim: Config.prop('GA4_STEP_NAME_DIM', 'customEvent:step_name'),
    };
  }

  /** Run fn; on error record a tech note and return the fallback. */
  function safe(health, label, fn, fallback) {
    try {
      return fn();
    } catch (e) {
      health.push(label + ': ' + String((e && e.message) || e).slice(0, 200));
      return fallback;
    }
  }

  // ---------------------------------------------------------------- friendly labels

  function titleCase(s) {
    return String(s || '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function friendlySource(channel, source) {
    var ch = String(channel || '');
    var src = String(source || '').toLowerCase();
    if (/chatgpt|openai|perplexity|gemini|copilot|claude\.ai/.test(src) || /ai assistant/i.test(ch)) {
      return 'AI assistants (ChatGPT, etc.)';
    }
    if (src === 'gbp' || /business\.google/.test(src)) return 'Google Business Profile';
    if (/paid search/i.test(ch)) return 'Google Ads';
    if (/paid social/i.test(ch)) return /instagram/.test(src) ? 'Instagram ads' : 'Facebook ads';
    if (/facebook|^fb$/.test(src)) return 'Facebook';
    if (/instagram/.test(src)) return 'Instagram';
    if (/nextdoor/.test(src)) return 'Nextdoor';
    if (/organic social/i.test(ch)) return 'Other social media';
    if (/organic search/i.test(ch)) {
      if (/google/.test(src)) return 'Google search';
      if (/bing/.test(src)) return 'Bing search';
      return 'Other search engines';
    }
    if (/direct/i.test(ch)) return 'Typed the address / saved link';
    if (/email/i.test(ch)) return 'Email';
    if (/referral/i.test(ch)) return /yelp/.test(src) ? 'Yelp' : 'Other websites';
    return 'Other / unknown';
  }

  function friendlyPage(path) {
    var p = String(path || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    if (p === '(not set)') return null;
    var fixed = {
      '/': 'Home page',
      '/quote': 'Quote form',
      '/contact': 'Contact page',
      '/services': 'All services',
      '/about': 'About us',
      '/our-work': 'Our work (photos)',
      '/bundles': 'Bundles & pricing',
      '/service-areas': 'Service areas',
      '/reviews': 'Reviews',
      '/blog': 'Blog',
      '/careers': 'Careers',
      '/faq': 'FAQ',
    };
    if (fixed[p]) return fixed[p];
    if (/thank/i.test(p)) return 'Thank-you page (sent a request)';
    var seg = p.split('/').filter(Boolean);
    if (seg[0] === 'services' && seg[1]) return titleCase(seg[1]) + ' (service)';
    if (/^(service-areas|areas|locations)$/.test(seg[0]) && seg[1]) return titleCase(seg[1]) + ' (area page)';
    if (seg[0] === 'blog' && seg[1]) return 'Blog: ' + titleCase(seg[seg.length - 1]);
    return titleCase(seg[seg.length - 1] || p);
  }

  function duration(sec) {
    sec = Math.round(sec || 0);
    if (sec < 60) return sec + ' sec';
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ' min' + (s ? ' ' + s + ' sec' : '');
  }

  function pctText(part, whole) {
    if (!whole) return '0%';
    return Math.round((part / whole) * 100) + '%';
  }

  function money(n) {
    return '$' + Math.round(n || 0).toLocaleString('en-US');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function serviceAreaCities() {
    var v = Config.prop('SERVICE_AREA_CITIES', '');
    var list = v ? v.split(',') : DEFAULT_SERVICE_AREA;
    return list.map(function (s) { return String(s).trim().toLowerCase(); }).filter(Boolean);
  }

  // ---------------------------------------------------------------- GHL lead list

  function tagValue(tags, prefix) {
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].indexOf(prefix + ':') === 0) return tags[i].slice(prefix.length + 1);
    }
    return '';
  }

  function shortName(c) {
    var first = c.firstName || c.firstNameRaw || String(c.contactName || c.name || '').split(' ')[0] || 'Unknown';
    var last = c.lastName || c.lastNameRaw || '';
    if (/^lead$/i.test(last)) last = '';
    return titleCase(String(first).toLowerCase()) + (last ? ' ' + String(last).charAt(0).toUpperCase() + '.' : '');
  }

  /**
   * Sort the week's website-lead contacts into real sales leads vs. things the site also sends to GHL.
   * The site tags EVERY /api/lead and /api/newsletter submission "website-lead" (lib/ghl.ts),
   * including job applications (source:careers) and newsletter signups (source:newsletter).
   */
  function contactKind(tags) {
    var src = tagValue(tags, 'source');
    var svc = tagValue(tags, 'service');
    if (src === 'careers' || svc === 'careers' || svc === 'job-application') return 'applicant';
    if (src === 'newsletter' || svc === 'newsletter') return 'newsletter';
    return 'lead';
  }

  function customFieldValue(c, fieldId) {
    if (!fieldId) return '';
    var list = c.customFields || c.customField || [];
    for (var i = 0; i < list.length; i++) {
      var f = list[i] || {};
      if (f.id === fieldId) return f.value != null ? f.value : (f.fieldValue != null ? f.fieldValue : f.field_value);
    }
    return '';
  }

  function parseTouch(raw) {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(String(raw)); } catch (e) { return null; }
  }

  /** Plain-English channel for one visit's first/last touch captured by the site (lib/analytics/gtm.ts). */
  function touchChannel(t) {
    if (!t) return '';
    var src = String(t.utm_source || '').toLowerCase();
    var med = String(t.utm_medium || '').toLowerCase();
    var ref = String(t.referrer || '').toLowerCase();
    var paid = /cpc|ppc|paid|ads?$|display|retarget/.test(med);
    if (t.gclid || t.gbraid || t.wbraid) return 'Google Ads';
    if (src === 'gbp' || /business/.test(src) && /google/.test(src)) return 'Google Business Profile';
    if (/facebook|^fb$|instagram|^ig$|meta/.test(src)) return paid ? 'Facebook or Instagram ad' : 'Facebook or Instagram post';
    if (t.fbclid || /facebook\.|instagram\./.test(ref)) return 'Facebook or Instagram (ad or post)';
    if (/google/.test(src)) return paid ? 'Google Ads' : 'Google';
    if (t.msclkid || (/bing/.test(src) && paid)) return 'Bing Ads';
    if (src) return titleCase(src) + (paid ? ' ad' : '');
    if (/google\./.test(ref)) return 'Google search';
    if (/bing\./.test(ref)) return 'Bing search';
    if (/chatgpt|openai|perplexity|gemini|copilot/.test(ref)) return 'AI assistant';
    if (/nextdoor/.test(ref)) return 'Nextdoor';
    if (ref && ref.indexOf('cutrateslawn.com') < 0) return 'Another website';
    return 'Typed the address / saved link';
  }

  function leadList(contacts) {
    var firstId = Config.prop('GHL_CF_FIRST_TOUCH_ID', '');
    var lastId = Config.prop('GHL_CF_LAST_TOUCH_ID', '');
    var heardId = Config.prop('GHL_CF_SOURCE_SELF_ID', '');
    var out = { leads: [], applicants: 0, newsletter: 0 };
    (contacts || []).forEach(function (c) {
      var tags = (c.tags || []).map(String);
      var kind = contactKind(tags);
      if (kind === 'applicant') { out.applicants++; return; }
      if (kind === 'newsletter') { out.newsletter++; return; }
      var touch = parseTouch(customFieldValue(c, firstId)) || parseTouch(customFieldValue(c, lastId));
      var heard = customFieldValue(c, heardId);
      out.leads.push({
        id: c.id,
        name: shortName(c),
        service: titleCase(tagValue(tags, 'service') || 'General request'),
        area: titleCase(tagValue(tags, 'area') || c.city || ''),
        form: tagValue(tags, 'source') || '',
        partial: tags.indexOf('lead-status:partial') >= 0,
        outOfArea: tags.indexOf('unqualified:out-of-area') >= 0,
        foundVia: touchChannel(touch),
        heard: heard ? String(heard) : '',
        added: c.dateAdded || c.dateCreated || c.createdAt || '',
      });
    });
    out.leads.sort(function (a, b) { return String(a.added) < String(b.added) ? -1 : 1; });
    return out;
  }

  function statusLabel(lead, opp) {
    if (opp) {
      if (opp.status === 'won') return 'Won' + (opp.value ? ' (' + money(opp.value) + ')' : '');
      if (opp.status === 'lost') return 'Lost';
      if (opp.status === 'abandoned') return 'Did not book';
      return 'Open' + (opp.value ? ' (est. ' + money(opp.value) + ')' : '');
    }
    if (lead.partial) return 'Started a quote, didn’t finish — call them';
    return 'New';
  }

  // ---------------------------------------------------------------- build

  function build(offsetWeeks) {
    var cfg = Config.requireConfigured();
    var n = names();
    var pid = cfg.ga4PropertyId;
    var win = weekWindow(offsetWeeks || 0);
    var start = win.start;
    var end = win.endExclusive;
    var weekKey = Ga4.ymd(start);
    var lastDay = new Date(end.getTime() - 86400000);
    var label = Ga4.ymd(start) + ' → ' + Ga4.ymd(lastDay);
    var prevStart = new Date(start.getTime());
    prevStart.setDate(prevStart.getDate() - 7);
    var health = [];

    // --- totals
    var ov = Ga4.overview(pid, start, end);
    var prevOv = safe(health, 'GA4 prior-week overview', function () {
      return Ga4.overview(pid, prevStart, start);
    }, null);

    var leadGa4 = Ga4.eventCount(pid, start, end, n.lead);
    var phoneClicks = Ga4.eventCount(pid, start, end, n.phone);
    var newsletterSignups = safe(health, 'GA4 newsletter', function () {
      return Ga4.eventCount(pid, start, end, n.newsletter);
    }, 0);
    var prevPhone = safe(health, 'GA4 prior-week phone', function () {
      return Ga4.eventCount(pid, prevStart, start, n.phone);
    }, null);

    // --- quote form
    var quoteStarts = safe(health, 'GA4 "' + n.formIdDim + '" (run ensureGa4CustomDimensions)', function () {
      return Ga4.eventCountFiltered(pid, start, end, n.quoteStart, [{ field: n.formIdDim, value: 'quote' }]);
    }, null);
    var quoteCompletes = safe(health, 'GA4 "' + n.leadSourceDim + '" (run ensureGa4CustomDimensions)', function () {
      return Ga4.eventCountFiltered(pid, start, end, n.quoteComplete, [{ field: n.leadSourceDim, value: 'quote' }]);
    }, null);
    var funnelSteps = safe(health, 'GA4 "' + n.stepNameDim + '" (run ensureGa4CustomDimensions)', function () {
      return Ga4.eventByDim(pid, start, end, n.funnelStep, n.stepNameDim)
        .filter(function (s) { return s.key && s.key !== '(not set)'; })
        .sort(function (a, b) { return b.count - a.count; });
    }, []);

    // GA4 receives page views but zero custom events while real people visit:
    // tracking for taps/forms isn't live. Show "not counted yet" instead of a false 0.
    var customEventTotal = leadGa4 + phoneClicks + (quoteStarts || 0) + newsletterSignups +
      (funnelSteps || []).reduce(function (s, x) { return s + x.count; }, 0);
    var trackingDark = ov.sessions >= 20 && customEventTotal === 0;
    if (trackingDark) {
      health.push('GA4 received ' + ov.sessions + ' sessions but zero custom events (phone_click, form_start, ' +
        'conversion_lead...). GTM is not forwarding site events: run runAllWiring() and confirm the GTM version published.');
    }

    // --- where people came from
    var leadEvents = [n.lead, n.phone];
    var sources = safe(health, 'GA4 sources', function () {
      var by = {};
      function bucket(k) { return (by[k] = by[k] || { name: k, visits: 0, leads: 0 }); }
      Ga4.rows(pid, start, end, ['sessionDefaultChannelGroup', 'sessionSource'], ['sessions'])
        .forEach(function (r) { bucket(friendlySource(r.d[0], r.d[1])).visits += r.m[0]; });
      safe(health, 'GA4 leads by source', function () {
        Ga4.rows(pid, start, end, ['sessionDefaultChannelGroup', 'sessionSource'], ['eventCount'],
          Ga4.inList('eventName', leadEvents))
          .forEach(function (r) { bucket(friendlySource(r.d[0], r.d[1])).leads += r.m[0]; });
      }, null);
      return Object.keys(by).map(function (k) { return by[k]; })
        .filter(function (s) { return s.visits > 0 || s.leads > 0; })
        .sort(function (a, b) { return b.visits - a.visits; });
    }, []);

    // --- what people looked at
    var pages = safe(health, 'GA4 pages', function () {
      var by = {};
      Ga4.rows(pid, start, end, ['pagePath'], ['screenPageViews', 'userEngagementDuration'], null, {
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 100,
      }).forEach(function (r) {
        var name = friendlyPage(r.d[0]);
        if (!name) return;
        var b = (by[name] = by[name] || { name: name, views: 0, secs: 0 });
        b.views += r.m[0];
        b.secs += r.m[1];
      });
      return Object.keys(by).map(function (k) {
        var p = by[k];
        p.avg = p.views ? p.secs / p.views : 0;
        return p;
      }).sort(function (a, b) { return b.views - a.views; }).slice(0, 8);
    }, []);

    var visit = safe(health, 'GA4 visit length', function () {
      var r = Ga4.rows(pid, start, end, [],
        ['averageSessionDuration', 'screenPageViewsPerSession', 'userEngagementDuration', 'sessions'])[0];
      if (!r) return null;
      return { pagesPerVisit: r.m[1], activePerVisit: r.m[3] ? r.m[2] / r.m[3] : 0 };
    }, null);

    // --- where visitors are
    var geo = safe(health, 'GA4 cities', function () {
      var area = serviceAreaCities();
      var list = [];
      var unknown = 0;
      Ga4.rows(pid, start, end, ['city', 'region'], ['activeUsers'], null, {
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 50,
      }).forEach(function (r) {
        if (!r.d[0] || r.d[0] === '(not set)') { unknown += r.m[0]; return; }
        list.push({
          city: r.d[0],
          region: r.d[1],
          users: r.m[0],
          inArea: area.indexOf(String(r.d[0]).toLowerCase()) >= 0 && /kansas|missouri/i.test(r.d[1] || ''),
        });
      });
      var total = 0, inArea = 0;
      list.forEach(function (c) { total += c.users; if (c.inArea) inArea += c.users; });
      return { top: list.slice(0, 8), total: total, inArea: inArea, unknown: unknown, all: list };
    }, null);

    var devices = safe(health, 'GA4 devices', function () {
      var out = { mobile: 0, desktop: 0, tablet: 0, total: 0 };
      Ga4.rows(pid, start, end, ['deviceCategory'], ['sessions']).forEach(function (r) {
        var k = String(r.d[0]).toLowerCase();
        if (out[k] != null) out[k] += r.m[0];
        out.total += r.m[0];
      });
      return out;
    }, null);

    var leadDays = safe(health, 'GA4 lead days', function () {
      return Ga4.rows(pid, start, end, ['dayOfWeekName'], ['eventCount'], Ga4.inList('eventName', leadEvents))
        .map(function (r) { return { day: r.d[0], count: r.m[0] }; })
        .sort(function (a, b) { return b.count - a.count; });
    }, []);

    // --- Google searches (Search Console)
    var gsc = SearchConsole.totals(cfg.gscSiteUrl, start, end);
    var gscTop = gsc.error ? [] : SearchConsole.topQueries(cfg.gscSiteUrl, start, end, 10);
    if (gsc.error) {
      health.push('Search Console HTTP ' + gsc.error + ' for GSC_SITE_URL="' + cfg.gscSiteUrl +
        '". Use the exact property string from Search Console: "sc-domain:cutrateslawn.com" for a domain ' +
        'property or "https://cutrateslawn.com/" for a URL-prefix property, and make sure the script owner is a user on it.');
    }

    // --- leads & jobs (GoHighLevel is the source of truth for leads)
    var ghl = { complete: 0, partial: 0, estimateSum: null, contacts: [], error: 'token_missing' };
    if (cfg.ghlToken && cfg.ghlLocationId) {
      ghl = safe(health, 'GHL contacts', function () {
        return Ghl.websiteLeads(cfg.ghlToken, cfg.ghlLocationId, start, end);
      }, { complete: 0, partial: 0, estimateSum: null, contacts: [], error: 'api_error' });
    }
    if (ghl.error) {
      health.push('GHL: ' + ghl.error + ' — lead count fell back to GA4 conversion_lead, lead list omitted.');
    }
    var sorted = leadList(ghl.contacts);
    var leads = sorted.leads;
    if (!ghl.error && leads.length && !leads.some(function (l) { return l.foundVia; })) {
      health.push('Lead attribution: set Script Properties GHL_CF_FIRST_TOUCH_ID and GHL_CF_LAST_TOUCH_ID ' +
        '(same values as the Vercel env vars) so each lead shows how it found the site (Google Ads, Facebook, search...). ' +
        'If those GHL custom fields do not exist yet, create them and set the env vars in Vercel too. ' +
        'Note: only the quote form sends first/last touch today; the contact form does not.');
    }
    var opps = { byContact: {}, errors: 0 };
    var won = null;
    if (!ghl.error && cfg.ghlToken && cfg.ghlLocationId) {
      if (leads.length) {
        opps = safe(health, 'GHL opportunity status', function () {
          return Ghl.opportunityStatuses(cfg.ghlToken, cfg.ghlLocationId, leads.map(function (l) { return l.id; }));
        }, opps);
        if (opps.errors) health.push('GHL: ' + opps.errors + ' opportunity lookups failed (lead status shows "New").');
      }
      won = safe(health, 'GHL won jobs', function () {
        return Ghl.wonInWindow(cfg.ghlToken, cfg.ghlLocationId, start, end);
      }, null);
      if (won && won.unknown) {
        health.push('GHL won jobs: ' + won.reason);
        won = null;
      }
    }
    leads.forEach(function (l) { l.status = statusLabel(l, opps.byContact[l.id]); });

    var leadCount = ghl.error ? leadGa4 : leads.length;
    var partialCount = leads.filter(function (l) { return l.partial; }).length;

    // --- history (prior weeks only, so a re-run never compares a week to itself)
    var prior = safe(health, 'Sheet history', function () {
      var rows = Sheet.lastN(8).filter(function (r) { return String(Sheet.cell(r, 'week_key')) < weekKey; });
      var last = rows.length ? rows[rows.length - 1] : null;
      if (!last) return null;
      var qc = Sheet.cell(last, 'quote_completes');
      return {
        leads: Number(Sheet.cell(last, 'contacts')) || 0,
        quoteCompletes: qc === '' || qc == null ? null : Number(qc),
      };
    }, null);

    var spend = Ads.spendUsd(start, end);
    var fee = Config.monthlyFee();
    var weeklyFee = (fee * 12) / 52;
    var healthFlags = (health || []).slice(0, 4).map(function (h) {
      return String(h).replace(/\|/g, '/').slice(0, 80);
    }).join(' | ');

    var sheetUrl = Sheet.upsertWeek({
      week_key: weekKey,
      week_end: Ga4.ymd(lastDay),
      label: label,
      contacts: leadCount,
      leads_complete: ghl.error ? 0 : leadCount - partialCount,
      leads_partial: ghl.error ? 0 : partialCount,
      leads_quote: quoteCompletes != null ? quoteCompletes : '',
      // Contact-form GA4 split lives in FieldRoutes for sales disposition; leave blank unless dim live.
      leads_contact: '',
      newsletter_signups: newsletterSignups,
      phone_clicks: trackingDark ? '' : phoneClicks,
      quote_starts: quoteStarts != null ? quoteStarts : '',
      quote_completes: quoteCompletes != null ? quoteCompletes : '',
      sessions: ov.sessions,
      users: ov.users,
      engaged_sessions: ov.engagedSessions,
      engaged_rate: ov.engagedRate,
      new_users: ov.newUsers,
      cost_per_contact: spend != null && leadCount ? spend / leadCount : '',
      tracking_cost_per_contact: leadCount ? weeklyFee / leadCount : '',
      gsc_clicks: gsc.error ? '' : gsc.clicks,
      gsc_impressions: gsc.error ? '' : gsc.impressions,
      gsc_ctr: gsc.error ? '' : gsc.ctr,
      gsc_position: gsc.error ? '' : gsc.position,
      conversion_lead_ga4: leadGa4,
      estimate_sum: ghl.estimateSum,
      applicants_excluded: sorted.applicants,
      newsletter_ghl_excluded: sorted.newsletter,
      won_jobs: won ? won.count : '',
      won_value: won ? won.value : '',
      mobile_sessions: devices ? devices.mobile : '',
      desktop_sessions: devices ? devices.desktop : '',
      in_area_users: geo ? geo.inArea : '',
      geo_users_known: geo ? geo.total : '',
      tracking_dark: trackingDark,
      health_flags: healthFlags,
    });

    return {
      label: label,
      weekKey: weekKey,
      start: start,
      endExclusive: end,
      lastDay: lastDay,
      overview: ov,
      prevOverview: prevOv,
      trackingDark: trackingDark,
      leadCount: leadCount,
      contacts: leadCount,
      leadGa4: leadGa4,
      phoneClicks: phoneClicks,
      prevPhone: prevPhone,
      newsletterSignups: newsletterSignups,
      quoteStarts: quoteStarts,
      quoteCompletes: quoteCompletes,
      funnelSteps: funnelSteps,
      sources: sources,
      pages: pages,
      visit: visit,
      geo: geo,
      devices: devices,
      leadDays: leadDays,
      gsc: gsc,
      gscTop: gscTop,
      ghl: ghl,
      leads: leads,
      applicants: sorted.applicants,
      newsletterContacts: sorted.newsletter,
      won: won,
      prior: prior,
      weeklyFee: weeklyFee,
      monthlyFee: fee,
      health: health,
      sheetUrl: sheetUrl,
      recipient: cfg.recipient,
    };
  }

  // ---------------------------------------------------------------- insights

  /** Plain-English observations Chris didn't ask for but can act on. Max 4, most useful first. */
  function insights(r) {
    var out = [];
    var partial = r.leads.filter(function (l) { return l.partial && l.status.indexOf('call them') >= 0; });
    if (partial.length) {
      out.push(partial.length + (partial.length === 1 ? ' person' : ' people') +
        ' started a quote and left their phone number but didn’t finish. They’re listed at the bottom — ' +
        'a quick call the same day is the easiest win in this report.');
    }

    if (!r.trackingDark && r.quoteStarts != null && r.quoteStarts >= 3 && r.quoteCompletes != null) {
      var line = 'Of ' + r.quoteStarts + ' people who opened the quote form, ' + r.quoteCompletes +
        ' finished (' + pctText(r.quoteCompletes, r.quoteStarts) + ').';
      var steps = r.funnelSteps || [];
      var worst = null;
      for (var i = 1; i < steps.length; i++) {
        var drop = steps[i - 1].count - steps[i].count;
        if (drop > 0 && (!worst || drop > worst.drop)) worst = { drop: drop, step: steps[i - 1].key };
      }
      if (worst) line += ' The most people quit on the “' + titleCase(worst.step) + '” step.';
      out.push(line);
    }

    var g = r.geo;
    if (g && g.total >= 15) {
      var share = g.inArea / g.total;
      var outside = g.all.filter(function (c) { return !c.inArea; })[0];
      if (share < 0.6 && outside) {
        out.push('Only ' + pctText(g.inArea, g.total) + ' of visitors were in your service area (top outside city: ' +
          outside.city + '). Visits from far away can’t become jobs — worth checking where posts or ads are being shown.');
      } else if (share >= 0.6) {
        out.push(pctText(g.inArea, g.total) + ' of visitors were in your service area, so the site is reaching the right people.');
      }
    }

    var src = (r.sources || []).slice();
    var totalSrcLeads = src.reduce(function (s, x) { return s + x.leads; }, 0);
    if (src.length) {
      var topVisits = src[0];
      var topLeads = src.slice().sort(function (a, b) { return b.leads - a.leads; })[0];
      if (!r.trackingDark && totalSrcLeads >= 2 && topLeads.name !== topVisits.name) {
        out.push(topVisits.name + ' sent the most visitors, but ' + topLeads.name +
          ' sent the most calls and quote requests. Visitors aren’t the same as customers.');
      } else if (r.overview.sessions >= 10) {
        out.push('Most visits came from ' + topVisits.name + ' (' + topVisits.visits + ' of ' + r.overview.sessions + ').');
      }
    }

    if (r.prevOverview && r.prevOverview.users >= 10) {
      var ch = (r.overview.users - r.prevOverview.users) / r.prevOverview.users;
      if (Math.abs(ch) >= 0.15) {
        out.push('Visitors were ' + (ch > 0 ? 'up ' : 'down ') + Math.round(Math.abs(ch) * 100) +
          '% from the week before (' + r.prevOverview.users + ' → ' + r.overview.users + ').');
      }
    }

    var d = r.devices;
    if (d && d.total >= 10 && d.mobile / d.total >= 0.6) {
      out.push(pctText(d.mobile, d.total) + ' of visits were on a phone. Most people will call or text rather than ' +
        'fill out a form, so answering or returning calls quickly matters more than anything on the site.');
    }

    if (!r.trackingDark && r.leadDays && r.leadDays.length) {
      var dayTotal = r.leadDays.reduce(function (s, x) { return s + x.count; }, 0);
      if (dayTotal >= 3) out.push('Most calls and quote requests came in on ' + r.leadDays[0].day + '.');
    }

    var q = (r.gscTop || []).filter(function (x) { return x.impressions > 0; })[0];
    if (q) out.push('People are finding you on Google by searching “' + q.query + '”.');

    return out.slice(0, 4);
  }

  // ---------------------------------------------------------------- html helpers

  function h2(text) {
    return '<h2 style="margin:28px 0 8px;font-size:17px;color:' + GREEN + ';font-weight:700">' + text + '</h2>';
  }

  function note(text) {
    return '<p style="margin:6px 0 0;font-size:13px;line-height:1.5;color:' + MUTED + '">' + text + '</p>';
  }

  function table(headers, rowsHtml, alignRightFrom) {
    var th = headers.map(function (h, i) {
      var right = alignRightFrom != null && i >= alignRightFrom;
      return '<th style="text-align:' + (right ? 'right' : 'left') + ';padding:6px 8px;font-size:12px;' +
        'font-weight:600;color:' + MUTED + ';border-bottom:1px solid ' + LINE + '">' + h + '</th>';
    }).join('');
    return '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">' +
      '<tr>' + th + '</tr>' + rowsHtml.join('') + '</table>';
  }

  function tr(cells, alignRightFrom) {
    return '<tr>' + cells.map(function (c, i) {
      var right = alignRightFrom != null && i >= alignRightFrom;
      return '<td style="padding:7px 8px;border-bottom:1px solid ' + LINE + ';text-align:' + (right ? 'right' : 'left') +
        ';vertical-align:top">' + c + '</td>';
    }).join('') + '</tr>';
  }

  function change(now, before) {
    if (before == null || now == null || typeof now !== 'number') return '';
    var d = now - before;
    if (d === 0) return '<div style="font-size:12px;color:' + MUTED + '">same as last week</div>';
    var up = d > 0;
    return '<div style="font-size:12px;color:' + (up ? GREEN : '#9a4a1f') + '">' + (up ? '▲ ' : '▼ ') +
      Math.abs(d) + ' vs last week</div>';
  }

  function tile(labelText, value, sub, key) {
    return '<td style="width:25%;padding:12px 8px;background:' + SOFT + ';border:4px solid #ffffff;vertical-align:top">' +
      '<!--tile:' + key + '=' + value + '-->' +
      '<div style="font-size:26px;font-weight:700;color:' + GREEN + ';line-height:1.1">' + value + '</div>' +
      '<div style="font-size:12px;color:#2b2b2b;margin-top:4px">' + labelText + '</div>' + sub + '</td>';
  }

  // ---------------------------------------------------------------- email

  function weekText(r) {
    var a = fmt(r.start, 'MMM d');
    var sameMonth = fmt(r.start, 'MMM') === fmt(r.lastDay, 'MMM');
    return a + '–' + (sameMonth ? fmt(r.lastDay, 'd') : fmt(r.lastDay, 'MMM d'));
  }

  function html(r) {
    var parts = [];
    var dash = '—';
    parts.push('<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1d1d1d;' +
      'max-width:620px;margin:0 auto;line-height:1.45">');
    parts.push('<p style="margin:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:' + MUTED +
      '">Cut Rates Lawn Care · Website report</p>');
    parts.push('<h1 style="margin:4px 0 4px;font-size:22px;color:#1d1d1d">Week of ' + weekText(r) + '</h1>');

    var headline;
    if (r.leadCount > 0) {
      headline = 'The website brought in <b>' + r.leadCount + ' new lead' + (r.leadCount === 1 ? '' : 's') +
        '</b> from <b>' + r.overview.users + '</b> visitors.';
    } else {
      headline = 'No new leads came through the website this week. <b>' + r.overview.users + '</b> people visited.';
    }
    parts.push('<p style="margin:0 0 12px;font-size:15px">' + headline + '</p>');

    // --- tiles
    var priorLeads = r.prior ? r.prior.leads : null;
    var phoneVal = r.trackingDark ? dash : r.phoneClicks;
    var quoteVal = r.trackingDark || r.quoteCompletes == null ? dash : r.quoteCompletes;
    parts.push('<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse"><tr>' +
      tile('New leads', r.leadCount, change(r.leadCount, priorLeads), 'leads') +
      tile('Phone taps', phoneVal, r.trackingDark ? '' : change(r.phoneClicks, r.prevPhone), 'phone') +
      tile('Quote requests', quoteVal, r.trackingDark ? '' : change(r.quoteCompletes, r.prior && r.prior.quoteCompletes), 'quotes') +
      tile('Visitors', r.overview.users, change(r.overview.users, r.prevOverview && r.prevOverview.users), 'visitors') +
      '</tr></table>');
    if (r.trackingDark) {
      parts.push(note('Phone taps and quote-form steps aren’t being counted yet — that’s being fixed and ' +
        'they’ll appear in an upcoming report. The lead count above comes straight from GoHighLevel, so it’s accurate.'));
    }
    if (Config.prop('SHOW_COST_LINE', 'true') !== 'false' && r.leadCount > 0) {
      parts.push(note('That works out to about ' + money(r.weeklyFee / r.leadCount) + ' per lead for the ' +
        money(r.monthlyFee) + '/mo tracking & reporting service.'));
    }

    // --- worth knowing
    var tips = insights(r);
    if (tips.length) {
      parts.push(h2('Worth knowing this week'));
      parts.push('<ul style="margin:0;padding-left:20px;font-size:14px">' + tips.map(function (t) {
        return '<li style="margin:0 0 6px">' + esc(t) + '</li>';
      }).join('') + '</ul>');
    }

    // --- 1. where people came from
    parts.push(h2('Where visitors came from'));
    var src = r.sources || [];
    if (src.length) {
      var showLeads = !r.trackingDark && src.some(function (s) { return s.leads > 0; });
      var totalVisits = src.reduce(function (s, x) { return s + x.visits; }, 0);
      parts.push(table(
        showLeads ? ['Source', 'Visits', 'Share', 'Calls + quotes'] : ['Source', 'Visits', 'Share'],
        src.slice(0, 8).map(function (s) {
          var cells = [esc(s.name), s.visits, pctText(s.visits, totalVisits)];
          if (showLeads) cells.push(s.leads || dash);
          return tr(cells, 1);
        }), 1));
    } else {
      parts.push(note('No visit data for this week.'));
    }
    var searches = (r.gscTop || []).filter(function (x) { return x.impressions > 0; }).slice(0, 5);
    if (searches.length) {
      parts.push('<p style="margin:14px 0 4px;font-size:14px;font-weight:600">What people searched on Google</p>');
      parts.push(table(['Search', 'Times shown', 'Clicks'], searches.map(function (x) {
        return tr([esc(x.query), x.impressions, x.clicks], 1);
      }), 1));
    }

    // --- 2. what people looked at
    parts.push(h2('What people looked at'));
    if (r.pages && r.pages.length) {
      parts.push(table(['Page', 'Views', 'Avg. time on page'], r.pages.map(function (p) {
        return tr([esc(p.name), p.views, duration(p.avg)], 1);
      }), 1));
      if (r.visit) {
        parts.push(note('A typical visit lasted ' + duration(r.visit.activePerVisit) + ' of active browsing and covered ' +
          (Math.round(r.visit.pagesPerVisit * 10) / 10) + ' pages.'));
      }
    } else {
      parts.push(note('No page data for this week.'));
    }

    // --- 3. quote form
    parts.push(h2('Quote form'));
    if (r.trackingDark || r.quoteStarts == null) {
      parts.push(note('Not counted yet — quote-form tracking is being switched on. Finished quote requests still ' +
        'show up in the lead list below.'));
    } else if (!r.quoteStarts && !r.quoteCompletes) {
      parts.push(note('Nobody opened the quote form this week.'));
    } else {
      var qRows = [tr(['Opened the quote form', r.quoteStarts, ''], 1)];
      (r.funnelSteps || []).forEach(function (s) {
        qRows.push(tr(['Reached “' + esc(titleCase(s.key)) + '”', s.count, pctText(s.count, r.quoteStarts)], 1));
      });
      qRows.push(tr(['<b>Sent the request</b>', '<b>' + r.quoteCompletes + '</b>',
        '<b>' + pctText(r.quoteCompletes, r.quoteStarts) + '</b>'], 1));
      parts.push(table(['Step', 'People', 'Of those who opened'], qRows, 1));
    }

    // --- 4. where visitors are
    parts.push(h2('Where visitors are'));
    var g = r.geo;
    if (g && g.top.length) {
      parts.push(table(['City', 'Visitors', 'Service area?'], g.top.map(function (c) {
        return tr([esc(c.city) + (c.region ? '<span style="color:' + MUTED + '">, ' + esc(c.region) + '</span>' : ''),
          c.users, c.inArea ? 'Yes' : '<span style="color:' + MUTED + '">No</span>'], 1);
      }), 1));
      parts.push(note(pctText(g.inArea, g.total) + ' of visitors with a known location were in your service area.' +
        (g.unknown ? ' ' + g.unknown + ' visitor' + (g.unknown === 1 ? '’s' : 's’') + ' location was hidden by their browser.' : '')));
    } else {
      parts.push(note('No location data for this week.'));
    }

    // --- 5. leads & jobs
    parts.push(h2('Leads and jobs from the website'));
    parts.push('<p style="margin:0 0 8px;font-size:13px;color:' + MUTED + '">These are people who filled out the quote or ' +
      'contact form on cutrateslawn.com. Leads from Google Local Services ads and Facebook lead forms come in through ' +
      'those platforms, not the website, so they\u2019re not counted here.</p>');
    if (r.leads.length) {
      var showVia = r.leads.some(function (l) { return l.foundVia; });
      parts.push(table(['Name', 'Service', 'Area', 'Status'], r.leads.map(function (l) {
        var who = '<span style="white-space:nowrap">' + esc(l.name) + '</span>';
        if (showVia) {
          who += '<br><span style="font-size:12px;color:' + MUTED + '">via ' + esc(l.foundVia || 'not recorded') + '</span>';
        }
        return tr([who, esc(l.service),
          esc(l.area || dash) + (l.outOfArea ? ' <span style="color:#9a4a1f">(outside area)</span>' : ''),
          esc(l.status)]);
      })));
    } else if (r.leadCount > 0) {
      parts.push(note(r.leadCount + ' lead' + (r.leadCount === 1 ? '' : 's') + ' came in; open GoHighLevel and filter by the ' +
        '“website-lead” tag for names.'));
    } else {
      parts.push(note('No new website leads this week.'));
    }
    var excluded = [];
    if (r.applicants) excluded.push(r.applicants + ' job application' + (r.applicants === 1 ? '' : 's'));
    if (r.newsletterContacts) excluded.push(r.newsletterContacts + ' newsletter signup' + (r.newsletterContacts === 1 ? '' : 's'));
    if (excluded.length) parts.push(note('Not counted as leads: ' + excluded.join(' and ') + '.'));
    if (r.won && r.won.count > 0) {
      parts.push('<p style="margin:10px 0 0;font-size:14px"><b>Jobs won from website leads this week: ' + r.won.count +
        (r.won.value ? ' (' + money(r.won.value) + ')' : '') + '</b></p>');
    } else if (r.won) {
      parts.push(note('No website leads were marked <b>Won</b> in GoHighLevel this week. Marking a lead Won when the job ' +
        'books is what lets this report show which jobs the website paid for.'));
    }

    parts.push('<p style="margin:28px 0 0;padding-top:12px;border-top:1px solid ' + LINE + ';font-size:12px;color:' + MUTED + '">' +
      'Week-by-week history: <a href="' + esc(r.sheetUrl) + '" style="color:' + GREEN + '">open the tracking sheet</a>. ' +
      'Questions about anything here? Just reply to this email.</p>');
    parts.push('</div>');
    return parts.join('\n');
  }

  function techNotesHtml(r) {
    return '<div style="font-family:Consolas,Menlo,monospace;font-size:13px">' +
      '<p>Week ' + esc(r.label) + ' — these did not appear in the client email.</p><ul>' +
      r.health.map(function (h) { return '<li style="margin:0 0 6px">' + esc(h) + '</li>'; }).join('') +
      '</ul><p>Sheet: <a href="' + esc(r.sheetUrl) + '">' + esc(r.sheetUrl) + '</a></p></div>';
  }

  function subjectLine(r) {
    var what = r.leadCount > 0
      ? r.leadCount + ' new lead' + (r.leadCount === 1 ? '' : 's')
      : r.overview.users + ' visitors';
    return 'Cut Rates website: ' + what + ' (week of ' + weekText(r) + ')';
  }

  function sendTechNotes(r, prefix) {
    if (!r.health.length) return;
    var to = Config.prop('ALERT_TO', '') || Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to: to,
      subject: (prefix || '') + '[Tech notes] Cut Rates weekly report — ' + r.label,
      htmlBody: techNotesHtml(r),
    });
  }

  function send(offsetWeeks, opts) {
    opts = opts || {};
    var win = weekWindow(offsetWeeks || 0);
    var weekKey = Ga4.ymd(win.start);
    if (!opts.force) {
      var last = PropertiesService.getScriptProperties().getProperty('LAST_SENT_WEEK');
      if (last === weekKey) {
        Logger.log('Skip: already sent week ' + weekKey + ' (use forceResend to override)');
        return { skipped: true, label: weekKey, contacts: 0, recipient: '', weekKey: weekKey };
      }
    }
    var r = build(offsetWeeks || 0);
    MailApp.sendEmail({ to: r.recipient, subject: subjectLine(r), htmlBody: html(r) });
    PropertiesService.getScriptProperties().setProperty('LAST_SENT_WEEK', r.weekKey);
    sendTechNotes(r);
    return r;
  }

  return {
    build: build,
    send: send,
    weekWindow: weekWindow,
    html: html,
    subjectLine: subjectLine,
    techNotesHtml: techNotesHtml,
    sendTechNotes: sendTechNotes,
    insights: insights,
    friendlySource: friendlySource,
    friendlyPage: friendlyPage,
    duration: duration,
  };
})();
