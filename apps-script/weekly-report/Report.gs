var Report = (function () {
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
      serviceDim: Config.prop('GA4_SERVICE_DIM', 'customEvent:service_id'),
      leadSourceDim: Config.prop('GA4_LEAD_SOURCE_DIM', 'customEvent:lead_source'),
      clickLocDim: Config.prop('GA4_CLICK_LOC_DIM', 'customEvent:click_location'),
      formIdDim: Config.prop('GA4_FORM_ID_DIM', 'customEvent:form_id'),
      stepNameDim: Config.prop('GA4_STEP_NAME_DIM', 'customEvent:step_name'),
    };
  }

  function dimOrFallback(propertyId, start, end, eventName, dim, health, label, totalFallback) {
    try {
      return { rows: Ga4.eventByDim(propertyId, start, end, eventName, dim), split: true };
    } catch (e) {
      health.push(
        'GA4: "' + dim + '" not registered as a custom dimension — ' + label +
        ' unsplit; run ensureGa4CustomDimensions(). Splits only collect after registration ' +
        '(expected incomplete for the first wired week).'
      );
      return {
        rows: totalFallback != null ? [{ key: '(unsplit)', count: totalFallback }] : [],
        split: false,
      };
    }
  }

  function countKey(rows, key) {
    for (var i = 0; i < (rows || []).length; i++) {
      if (String(rows[i].key) === key) return Number(rows[i].count) || 0;
    }
    return 0;
  }

  function filteredCount(propertyId, start, end, eventName, dimFilters, health, dimLabel) {
    try {
      return Ga4.eventCountFiltered(propertyId, start, end, eventName, dimFilters);
    } catch (e) {
      health.push(
        'GA4: filter on "' + dimLabel + '" failed — using unsplit total; run ensureGa4CustomDimensions()'
      );
      return null;
    }
  }

  function build(offsetWeeks) {
    var cfg = Config.requireConfigured();
    var n = names();
    var win = weekWindow(offsetWeeks || 0);
    var start = win.start;
    var end = win.endExclusive;
    var label = Ga4.ymd(start) + ' → ' + Ga4.ymd(new Date(end.getTime() - 86400000));
    var health = [];

    var ov = Ga4.overview(cfg.ga4PropertyId, start, end);
    var channels = Ga4.byChannel(cfg.ga4PropertyId, start, end);
    var landings = Ga4.topLandings(cfg.ga4PropertyId, start, end, 8);

    var leadGa4 = Ga4.eventCount(cfg.ga4PropertyId, start, end, n.lead);
    var phoneClicks = Ga4.eventCount(cfg.ga4PropertyId, start, end, n.phone);
    var newsletterSignups = Ga4.eventCount(cfg.ga4PropertyId, start, end, n.newsletter);

    var leadSource = dimOrFallback(
      cfg.ga4PropertyId, start, end, n.lead, n.leadSourceDim, health,
      'leads by lead_source', leadGa4
    );
    var leadsQuote = leadSource.split ? countKey(leadSource.rows, 'quote') : null;
    var leadsContact = leadSource.split ? countKey(leadSource.rows, 'contact') : null;

    var phoneByLoc = dimOrFallback(
      cfg.ga4PropertyId, start, end, n.phone, n.clickLocDim, health,
      'phone clicks by click_location', phoneClicks
    );

    var quoteStartsFiltered = filteredCount(
      cfg.ga4PropertyId, start, end, n.quoteStart,
      [{ field: n.formIdDim, value: 'quote' }],
      health, n.formIdDim
    );
    var quoteStartsUnsplit = Ga4.eventCount(cfg.ga4PropertyId, start, end, n.quoteStart);
    var quoteStarts = quoteStartsFiltered != null ? quoteStartsFiltered : quoteStartsUnsplit;

    var quoteCompletesFiltered = filteredCount(
      cfg.ga4PropertyId, start, end, n.quoteComplete,
      [{ field: n.leadSourceDim, value: 'quote' }],
      health, n.leadSourceDim
    );
    var quoteCompletes = quoteCompletesFiltered != null ? quoteCompletesFiltered : leadGa4;

    var funnelSteps = dimOrFallback(
      cfg.ga4PropertyId, start, end, n.funnelStep, n.stepNameDim, health,
      'funnel_step_view by step_name', null
    );

    var leadsByService = [];
    try {
      leadsByService = Ga4.eventByDim(cfg.ga4PropertyId, start, end, n.lead, n.serviceDim);
    } catch (e) {
      health.push(
        'GA4: "' + n.serviceDim + '" not registered as a custom dimension — leads-by-service skipped; ' +
        'run ensureGa4CustomDimensions()'
      );
    }

    var gsc = SearchConsole.totals(cfg.gscSiteUrl, start, end);
    var gscTop = SearchConsole.topQueries(cfg.gscSiteUrl, start, end, 10);
    var gscTracked = SearchConsole.tracked(cfg.gscSiteUrl, start, end, cfg.trackedQueries);

    var ghl = { complete: 0, partial: 0, estimateSum: null, error: 'token_missing' };
    if (cfg.ghlToken && cfg.ghlLocationId) {
      try {
        ghl = Ghl.websiteLeads(cfg.ghlToken, cfg.ghlLocationId, start, end);
      } catch (e) {
        ghl = { complete: 0, partial: 0, estimateSum: null, error: 'api_error ' + String(e).slice(0, 120) };
      }
    }

    var contacts = (ghl.complete || 0) + (ghl.partial || 0);
    if (!contacts && leadGa4) contacts = leadGa4;
    var spend = Ads.spendUsd(start, end);
    var cpc = spend != null && contacts ? (spend / contacts) : null;

    var fee = Config.monthlyFee();
    var weeklyFee = (fee * 12) / 52;
    var trackingCostPerContact = contacts > 0 ? weeklyFee / contacts : null;

    var history = [];
    try { history = Sheet.lastN(4); } catch (e) { history = []; }
    var priorContacts = null;
    var avg4 = null;
    if (history.length) {
      var sums = 0, nHist = 0;
      for (var hi = 0; hi < history.length; hi++) {
        var c = Number(history[hi][2]) || 0;
        sums += c;
        nHist++;
        if (hi === history.length - 1) priorContacts = c;
      }
      if (nHist) avg4 = sums / nHist;
    }

    if (ghl.error) health.push('GHL: ' + ghl.error + ' (using GA4 lead count as contact proxy if needed)');
    if (!ov.sessions && !leadGa4) health.push('GA4: zero sessions/leads — check property ID + Analytics Data API');
    if (gsc.error) {
      health.push(
        'GSC: HTTP ' + gsc.error + ' for GSC_SITE_URL="' + cfg.gscSiteUrl +
        '" — use the exact property string from Search Console (sc-domain:… vs https://…/)'
      );
    } else if (!gsc.impressions && !gsc.clicks) {
      health.push('GSC: zero clicks/impressions — verify GSC_SITE_URL matches the property exactly');
    }
    if (spend == null) health.push('Ads: spend not connected (optional)');

    var sheetUrl = Sheet.upsertWeek({
      week_key: Ga4.ymd(start),
      label: label,
      contacts: contacts,
      leads_complete: ghl.complete || 0,
      leads_partial: ghl.partial || 0,
      leads_quote: leadsQuote != null ? leadsQuote : '',
      leads_contact: leadsContact != null ? leadsContact : '',
      newsletter_signups: newsletterSignups,
      phone_clicks: phoneClicks,
      quote_starts: quoteStarts,
      quote_completes: quoteCompletes,
      sessions: ov.sessions,
      users: ov.users,
      cost_per_contact: cpc,
      tracking_cost_per_contact: trackingCostPerContact,
      gsc_clicks: gsc.clicks,
      gsc_impressions: gsc.impressions,
      conversion_lead_ga4: leadGa4,
      estimate_sum: ghl.estimateSum,
    });

    return {
      label: label,
      weekKey: Ga4.ymd(start),
      start: start,
      endExclusive: end,
      overview: ov,
      channels: channels,
      landings: landings,
      leadGa4: leadGa4,
      leadsQuote: leadsQuote,
      leadsContact: leadsContact,
      leadSourceSplit: leadSource.split,
      phoneClicks: phoneClicks,
      phoneByLocation: phoneByLoc.rows,
      phoneSplit: phoneByLoc.split,
      newsletterSignups: newsletterSignups,
      quoteStarts: quoteStarts,
      quoteCompletes: quoteCompletes,
      funnelSteps: funnelSteps.rows,
      funnelSplit: funnelSteps.split,
      leadsByService: leadsByService,
      gsc: gsc,
      gscTop: gscTop,
      gscTracked: gscTracked,
      ghl: ghl,
      contacts: contacts,
      spend: spend,
      costPerContact: cpc,
      trackingCostPerContact: trackingCostPerContact,
      weeklyFee: weeklyFee,
      priorContacts: priorContacts,
      avg4Contacts: avg4,
      health: health,
      sheetUrl: sheetUrl,
      recipient: cfg.recipient,
    };
  }

  function pct(n) {
    return (Math.round((n || 0) * 1000) / 10) + '%';
  }

  function td(label, value) {
    return '<tr><td style="padding:4px 12px 4px 0;color:#444">' + label +
      '</td><td style="padding:4px 0;font-weight:600">' + value + '</td></tr>';
  }

  function valueBlock(r) {
    var q = r.leadsQuote != null ? r.leadsQuote : '?';
    var c = r.leadsContact != null ? r.leadsContact : '?';
    var p = r.phoneClicks != null ? r.phoneClicks : 0;
    if (!r.contacts || r.trackingCostPerContact == null) {
      var reason = !r.contacts
        ? 'no website contacts this week'
        : 'missing fee or contact inputs';
      return '<p style="margin:0 0 12px;padding:12px;background:#f7f7f4;border-left:4px solid #2f5d3a">' +
        'Not yet measurable: ' + reason + '.</p>';
    }
    var line = 'This week: ' + r.contacts + ' website contacts (Q ' + q +
      ' quote, C ' + c + ' contact, P ' + p + ' phone taps). Tracking cost per contact: $' +
      r.trackingCostPerContact.toFixed(2) + '.';
    if (r.ghl && r.ghl.estimateSum != null) {
      line += ' $' + Number(r.ghl.estimateSum).toFixed(0) + ' in estimates requested.';
    }
    var deltas = '';
    if (r.priorContacts != null) {
      var d = r.contacts - r.priorContacts;
      deltas += ' WoW: ' + (d >= 0 ? '+' : '') + d + '.';
    }
    if (r.avg4Contacts != null) {
      deltas += ' 4-week avg: ' + (Math.round(r.avg4Contacts * 10) / 10) + '.';
    }
    return '<p style="margin:0 0 12px;padding:12px;background:#f7f7f4;border-left:4px solid #2f5d3a">' +
      line + deltas + '</p>';
  }

  function funnelHtml(r) {
    var steps = r.funnelSteps || [];
    if (!steps.length) {
      return '<p style="color:#666">Funnel steps unavailable' +
        (r.funnelSplit === false ? ' (dimension missing — see Health)' : '') + '.</p>';
    }
    var lines = [];
    for (var i = 0; i < steps.length; i++) {
      var drop = '';
      if (i > 0 && steps[i - 1].count) {
        var rate = steps[i].count / steps[i - 1].count;
        drop = ' (from prior: ' + pct(rate) + ')';
      }
      lines.push('<li>' + steps[i].key + ': ' + steps[i].count + drop + '</li>');
    }
    lines.push('<li>Quote completes (lead_source=quote): ' + r.quoteCompletes + '</li>');
    return '<ul>' + lines.join('') + '</ul>';
  }

  function html(r) {
    function li(arr, fmt) {
      return '<ul>' + (arr || []).map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>';
    }
    var channelLines = Object.keys(r.channels || {}).map(function (k) {
      return k + ': ' + r.channels[k];
    });
    var phoneLoc = (r.phoneByLocation || []).map(function (x) {
      return x.key + ': ' + x.count;
    });

    return [
      '<div style="font-family:Georgia,serif;color:#1a1a1a;max-width:640px">',
      '<h2 style="margin:0 0 4px">Cut Rates Lawn — Weekly Website Report</h2>',
      '<p style="margin:0 0 16px;color:#555"><b>Week:</b> ' + r.label + '</p>',
      valueBlock(r),
      '<h3 style="margin:20px 0 8px">North-star</h3>',
      '<table style="border-collapse:collapse">',
      td('Contacts (GHL / GA4 fallback)', '<b>' + r.contacts + '</b>'),
      td('Quote leads (lead_source=quote)', r.leadsQuote != null ? r.leadsQuote : 'unsplit — see Health'),
      td('Contact leads (lead_source=contact)', r.leadsContact != null ? r.leadsContact : 'unsplit — see Health'),
      td('Phone clicks', r.phoneClicks + (phoneLoc.length ? ' — ' + phoneLoc.join(', ') : '')),
      td('Newsletter signups (not a lead)', r.newsletterSignups),
      td('Quote start → complete', r.quoteStarts + ' → ' + r.quoteCompletes),
      r.costPerContact != null ? td('Ads cost / contact', '$' + r.costPerContact.toFixed(2)) : '',
      '</table>',
      '<h3 style="margin:20px 0 8px">Quote funnel</h3>',
      '<p style="margin:0 0 4px;color:#555">form_start (form_id=quote) → funnel_step_view → conversion_lead (lead_source=quote)</p>',
      funnelHtml(r),
      '<h3 style="margin:20px 0 8px">Traffic</h3>',
      '<table style="border-collapse:collapse">',
      td('Sessions', r.overview.sessions),
      td('Users', r.overview.users + ' (new ' + r.overview.newUsers + ')'),
      td('Engaged rate', pct(r.overview.engagedRate)),
      '</table>',
      '<p style="margin:12px 0 4px"><b>Channels</b></p>' + li(channelLines, function (x) { return x; }),
      '<p style="margin:12px 0 4px"><b>Top landings</b></p>' + li(r.landings, function (x) { return x.page + ' — ' + x.sessions; }),
      '<h3 style="margin:20px 0 8px">Search Console</h3>',
      '<table style="border-collapse:collapse">',
      td('Clicks', r.gsc.clicks),
      td('Impressions', r.gsc.impressions),
      td('CTR', pct(r.gsc.ctr)),
      td('Avg position (impression-weighted)', Math.round((r.gsc.position || 0) * 10) / 10),
      '</table>',
      '<p style="margin:12px 0 4px"><b>Top queries</b></p>' + li(r.gscTop, function (x) {
        return x.query + ' — clicks ' + x.clicks + ', pos ' + (Math.round(x.position * 10) / 10);
      }),
      '<p style="margin:12px 0 4px"><b>Tracked queries</b></p>' + li(r.gscTracked, function (x) {
        return x.query + (x.missing ? ' (not in top 250)' : ' — clicks ' + x.clicks + ', pos ' + (Math.round(x.position * 10) / 10));
      }),
      '<h3 style="margin:20px 0 8px">Leads by service (GA4)</h3>',
      li(r.leadsByService.length ? r.leadsByService : [{ key: 'n/a', count: '—' }], function (x) { return x.key + ': ' + x.count; }),
      '<h3 style="margin:20px 0 8px">Health</h3>',
      li(r.health.length ? r.health : ['OK'], function (x) { return x; }),
      '<p style="margin:16px 0 0">Sheet: <a href="' + r.sheetUrl + '">' + r.sheetUrl + '</a></p>',
      '<p style="color:#666;font-size:12px;margin:8px 0 0">Generated by Apps Script weekly report · Cut Rates Lawn Care</p>',
      '</div>',
    ].join('\n');
  }

  function subjectLine(r) {
    var mon = Utilities.formatDate(
      r.start,
      Session.getScriptTimeZone() || 'America/Chicago',
      'MMM d, yyyy'
    );
    return 'Cut Rates website: ' + r.contacts + ' contacts, week of ' + mon;
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
    MailApp.sendEmail({
      to: r.recipient,
      subject: subjectLine(r),
      htmlBody: html(r),
    });
    PropertiesService.getScriptProperties().setProperty('LAST_SENT_WEEK', r.weekKey);
    return r;
  }

  return {
    build: build,
    send: send,
    weekWindow: weekWindow,
    html: html,
    subjectLine: subjectLine,
  };
})();
