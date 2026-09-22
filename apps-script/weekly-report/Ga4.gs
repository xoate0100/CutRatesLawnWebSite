var Ga4 = (function () {
  function runReport(propertyId, startDate, endDate, dimensions, metrics, dimensionFilter) {
    var body = {
      dateRanges: [{ startDate: startDate, endDate: endDate }],
      dimensions: (dimensions || []).map(function (n) { return { name: n }; }),
      metrics: (metrics || []).map(function (n) { return { name: n }; }),
      limit: 10000,
    };
    if (dimensionFilter) body.dimensionFilter = dimensionFilter;
    var res = AnalyticsData.Properties.runReport(body, 'properties/' + propertyId);
    return res || { rows: [] };
  }

  function ymd(d) {
    return Utilities.formatDate(d, Session.getScriptTimeZone() || 'America/Chicago', 'yyyy-MM-dd');
  }

  function metricSum(report, metricIndex) {
    metricIndex = metricIndex || 0;
    var rows = report.rows || [];
    var sum = 0;
    for (var i = 0; i < rows.length; i++) {
      sum += Number(rows[i].metricValues[metricIndex].value) || 0;
    }
    return sum;
  }

  function eventCount(propertyId, start, endExclusive, eventName) {
    var report = runReport(
      propertyId,
      ymd(start),
      ymd(new Date(endExclusive.getTime() - 86400000)),
      ['eventName'],
      ['eventCount'],
      {
        filter: {
          fieldName: 'eventName',
          stringFilter: { matchType: 'EXACT', value: eventName },
        },
      }
    );
    return metricSum(report, 0);
  }

  function overview(propertyId, start, endExclusive) {
    var end = ymd(new Date(endExclusive.getTime() - 86400000));
    var startS = ymd(start);
    var base = runReport(propertyId, startS, end, [], [
      'sessions', 'totalUsers', 'newUsers', 'engagedSessions',
    ]);
    var row = (base.rows && base.rows[0] && base.rows[0].metricValues) || [];
    function m(i) { return Number((row[i] && row[i].value) || 0); }
    return {
      sessions: m(0),
      users: m(1),
      newUsers: m(2),
      engagedSessions: m(3),
      engagedRate: m(0) ? m(3) / m(0) : 0,
    };
  }

  function byChannel(propertyId, start, endExclusive) {
    var report = runReport(
      propertyId,
      ymd(start),
      ymd(new Date(endExclusive.getTime() - 86400000)),
      ['sessionDefaultChannelGroup'],
      ['sessions']
    );
    var out = {};
    (report.rows || []).forEach(function (r) {
      out[r.dimensionValues[0].value] = Number(r.metricValues[0].value) || 0;
    });
    return out;
  }

  function topLandings(propertyId, start, endExclusive, limit) {
    var report = runReport(
      propertyId,
      ymd(start),
      ymd(new Date(endExclusive.getTime() - 86400000)),
      ['landingPagePlusQueryString'],
      ['sessions']
    );
    return (report.rows || []).slice(0, limit || 10).map(function (r) {
      return { page: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value) || 0 };
    });
  }

  function eventByDim(propertyId, start, endExclusive, eventName, dim) {
    var report = runReport(
      propertyId,
      ymd(start),
      ymd(new Date(endExclusive.getTime() - 86400000)),
      ['eventName', dim],
      ['eventCount'],
      {
        filter: {
          fieldName: 'eventName',
          stringFilter: { matchType: 'EXACT', value: eventName },
        },
      }
    );
    return (report.rows || []).map(function (r) {
      return { key: r.dimensionValues[1].value, count: Number(r.metricValues[0].value) || 0 };
    });
  }

  return {
    eventCount: eventCount,
    overview: overview,
    byChannel: byChannel,
    topLandings: topLandings,
    eventByDim: eventByDim,
    ymd: ymd,
  };
})();
