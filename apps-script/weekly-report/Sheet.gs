var Sheet = (function () {
  var TAB = 'weekly_kpis';

  function getOrCreate() {
    var id = Config.prop('SHEET_ID');
    var ss;
    if (id) {
      ss = SpreadsheetApp.openById(id);
    } else {
      ss = SpreadsheetApp.create('Cut Rates Website Weekly KPIs');
      PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
    }
    var sh = ss.getSheetByName(TAB);
    if (!sh) {
      sh = ss.insertSheet(TAB);
      sh.appendRow([
        'week_key', 'label', 'contacts', 'leads_complete', 'leads_partial', 'phone_clicks',
        'sessions', 'users', 'cost_per_contact', 'gsc_clicks', 'gsc_impressions',
        'conversion_lead_ga4', 'updated_at',
      ]);
    }
    return { ss: ss, sh: sh };
  }

  function upsertWeek(row) {
    var pack = getOrCreate();
    var sh = pack.sh;
    var data = sh.getDataRange().getValues();
    var found = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(row.week_key)) {
        found = i + 1;
        break;
      }
    }
    var values = [
      row.week_key, row.label, row.contacts, row.leads_complete, row.leads_partial, row.phone_clicks,
      row.sessions, row.users, row.cost_per_contact, row.gsc_clicks, row.gsc_impressions,
      row.conversion_lead_ga4, new Date().toISOString(),
    ];
    if (found > 0) sh.getRange(found, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
    return pack.ss.getUrl();
  }

  function lastN(n) {
    var pack = getOrCreate();
    var data = pack.sh.getDataRange().getValues();
    return data.slice(Math.max(1, data.length - (n || 4)));
  }

  return { getOrCreate: getOrCreate, upsertWeek: upsertWeek, lastN: lastN };
})();
