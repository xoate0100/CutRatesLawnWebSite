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

  function build(offsetWeeks) {
    var cfg = Config.requireConfigured();
    var win = weekWindow(offsetWeeks || 0);
    var start = win.start;
    var end = win.endExclusive;
    var label = Ga4.ymd(start) + ' → ' + Ga4.ymd(new Date(end.getTime() - 86400000));

    var ov = Ga4.overview(cfg.ga4PropertyId, start, end);
    var channels = Ga4.byChannel(cfg.ga4PropertyId, start, end);
    var landings = Ga4.topLandings(cfg.ga4PropertyId, start, end, 8);
    var leadGa4 = Ga4.eventCount(cfg.ga4PropertyId, start, end, 'conversion_lead');
    var phoneClicks = Ga4.eventCount(cfg.ga4PropertyId, start, end, 'conversion_phone_click');
    var quoteStarts = Ga4.eventCount(cfg.ga4PropertyId, start, end, 'funnel_quote_start');
    var quoteCompletes = Ga4.eventCount(cfg.ga4PropertyId, start, end, 'funnel_quote_complete');
    var leadsByService = Ga4.eventByDim(cfg.ga4PropertyId, start, end, 'conversion_lead', 'customEvent:service');

    var gsc = SearchConsole.totals(cfg.gscSiteUrl, start, end);
    var gscTop = SearchConsole.topQueries(cfg.gscSiteUrl, start, end, 10);
    var gscTracked = SearchConsole.tracked(cfg.gscSiteUrl, start, end, cfg.trackedQueries);

    var ghl = { complete: 0, partial: 0, error: 'token_missing' };
    if (cfg.ghlToken && cfg.ghlLocationId) {
      ghl = Ghl.websiteLeads(cfg.ghlToken, cfg.ghlLocationId, start, end);
    }

    var contacts = (ghl.complete || 0) + (ghl.partial || 0);
    if (!contacts && leadGa4) contacts = leadGa4; // fallback when GHL API unavailable
    var spend = Ads.spendUsd(start, end);
    var cpc = spend != null && contacts ? (spend / contacts) : null;

    var health = [];
    if (ghl.error) health.push('GHL: ' + ghl.error + ' (using GA4 lead count as contact proxy if needed)');
    if (!ov.sessions && !leadGa4) health.push('GA4: zero sessions/leads — check property ID + Analytics Data API');
    if (!gsc.impressions && !gsc.clicks) health.push('GSC: zero clicks/impressions — verify site URL property + Search Console API');
    if (spend == null) health.push('Ads: spend not connected (optional)');

    var sheetUrl = Sheet.upsertWeek({
      week_key: Ga4.ymd(start),
      label: label,
      contacts: contacts,
      leads_complete: ghl.complete || 0,
      leads_partial: ghl.partial || 0,
      phone_clicks: phoneClicks,
      sessions: ov.sessions,
      users: ov.users,
      cost_per_contact: cpc,
      gsc_clicks: gsc.clicks,
      gsc_impressions: gsc.impressions,
      conversion_lead_ga4: leadGa4,
    });

    return {
      label: label,
      start: start,
      endExclusive: end,
      overview: ov,
      channels: channels,
      landings: landings,
      leadGa4: leadGa4,
      phoneClicks: phoneClicks,
      quoteStarts: quoteStarts,
      quoteCompletes: quoteCompletes,
      leadsByService: leadsByService,
      gsc: gsc,
      gscTop: gscTop,
      gscTracked: gscTracked,
      ghl: ghl,
      contacts: contacts,
      spend: spend,
      costPerContact: cpc,
      health: health,
      sheetUrl: sheetUrl,
      recipient: cfg.recipient,
    };
  }

  function pct(n) {
    return (Math.round((n || 0) * 1000) / 10) + '%';
  }

  function html(r) {
    function li(arr, fmt) {
      return '<ul>' + (arr || []).map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>';
    }
    var channelLines = Object.keys(r.channels || {}).map(function (k) {
      return k + ': ' + r.channels[k];
    });
    return [
      '<h2>Cut Rates Lawn — Weekly Website Report</h2>',
      '<p><b>Week:</b> ' + r.label + '</p>',
      '<h3>North-star</h3>',
      '<ul>',
      '<li>Contacts (GHL website-lead / GA4 fallback): <b>' + r.contacts + '</b></li>',
      '<li>GA4 conversion_lead: ' + r.leadGa4 + '</li>',
      '<li>Phone clicks: ' + r.phoneClicks + '</li>',
      '<li>Quote start → complete: ' + r.quoteStarts + ' → ' + r.quoteCompletes + '</li>',
      r.costPerContact != null ? '<li>Cost / contact: $' + r.costPerContact.toFixed(2) + '</li>' : '',
      '</ul>',
      '<h3>Traffic</h3>',
      '<ul>',
      '<li>Sessions: ' + r.overview.sessions + '</li>',
      '<li>Users: ' + r.overview.users + ' (new ' + r.overview.newUsers + ')</li>',
      '<li>Engaged rate: ' + pct(r.overview.engagedRate) + '</li>',
      '</ul>',
      '<p><b>Channels</b></p>' + li(channelLines, function (x) { return x; }),
      '<p><b>Top landings</b></p>' + li(r.landings, function (x) { return x.page + ' — ' + x.sessions; }),
      '<h3>Search Console</h3>',
      '<ul>',
      '<li>Clicks: ' + r.gsc.clicks + '</li>',
      '<li>Impressions: ' + r.gsc.impressions + '</li>',
      '<li>CTR: ' + pct(r.gsc.ctr) + '</li>',
      '<li>Avg position: ' + (Math.round((r.gsc.position || 0) * 10) / 10) + '</li>',
      '</ul>',
      '<p><b>Top queries</b></p>' + li(r.gscTop, function (x) {
        return x.query + ' — clicks ' + x.clicks + ', pos ' + (Math.round(x.position * 10) / 10);
      }),
      '<p><b>Tracked queries</b></p>' + li(r.gscTracked, function (x) {
        return x.query + (x.missing ? ' (not in top 250)' : ' — clicks ' + x.clicks + ', pos ' + (Math.round(x.position * 10) / 10));
      }),
      '<h3>Leads by service (GA4)</h3>',
      li(r.leadsByService, function (x) { return x.key + ': ' + x.count; }),
      '<h3>Health</h3>',
      li(r.health.length ? r.health : ['OK'], function (x) { return x; }),
      '<p>Sheet: <a href="' + r.sheetUrl + '">' + r.sheetUrl + '</a></p>',
      '<p style="color:#666;font-size:12px">Generated by Apps Script weekly report · Cut Rates Lawn Care</p>',
    ].join('\n');
  }

  function send(offsetWeeks) {
    var r = build(offsetWeeks || 0);
    MailApp.sendEmail({
      to: r.recipient,
      subject: 'Cut Rates weekly report — ' + r.label,
      htmlBody: html(r),
    });
    return r;
  }

  return { build: build, send: send, weekWindow: weekWindow, html: html };
})();
