var SearchConsole = (function () {
  function query(siteUrl, startDate, endDate, dimensions, rowLimit) {
    var encoded = encodeURIComponent(siteUrl);
    var url = 'https://searchconsole.googleapis.com/webmasters/v3/sites/' + encoded + '/searchAnalytics/query';
    var body = {
      startDate: startDate,
      endDate: endDate,
      dimensions: dimensions || ['query'],
      rowLimit: rowLimit || 25,
      dataState: 'final',
    };
    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() >= 300) {
      Logger.log('GSC error ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
      return { rows: [] };
    }
    return JSON.parse(res.getContentText()) || { rows: [] };
  }

  function totals(siteUrl, start, endExclusive) {
    var startS = Ga4.ymd(start);
    var endS = Ga4.ymd(new Date(endExclusive.getTime() - 86400000));
    var res = query(siteUrl, startS, endS, ['date'], 100);
    var clicks = 0, impressions = 0, positionSum = 0, n = 0;
    (res.rows || []).forEach(function (r) {
      clicks += r.clicks || 0;
      impressions += r.impressions || 0;
      positionSum += (r.position || 0);
      n++;
    });
    return {
      clicks: clicks,
      impressions: impressions,
      ctr: impressions ? clicks / impressions : 0,
      position: n ? positionSum / n : 0,
    };
  }

  function topQueries(siteUrl, start, endExclusive, limit) {
    var res = query(
      siteUrl,
      Ga4.ymd(start),
      Ga4.ymd(new Date(endExclusive.getTime() - 86400000)),
      ['query'],
      limit || 10
    );
    return (res.rows || []).map(function (r) {
      return {
        query: r.keys[0],
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: r.position || 0,
      };
    });
  }

  function tracked(siteUrl, start, endExclusive, terms) {
    var all = topQueries(siteUrl, start, endExclusive, 250);
    var map = {};
    all.forEach(function (r) { map[String(r.query).toLowerCase()] = r; });
    return (terms || []).map(function (t) {
      var hit = map[t.toLowerCase()];
      return hit || { query: t, clicks: 0, impressions: 0, ctr: 0, position: 0, missing: true };
    });
  }

  return { totals: totals, topQueries: topQueries, tracked: tracked };
})();
