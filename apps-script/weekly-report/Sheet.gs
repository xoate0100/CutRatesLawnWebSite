var Sheet = (function () {
  var TAB = 'weekly_kpis';
  var HEADERS = [
    'week_key', 'label', 'contacts', 'leads_complete', 'leads_partial',
    'leads_quote', 'leads_contact', 'newsletter_signups',
    'phone_clicks', 'quote_starts', 'quote_completes',
    'sessions', 'users', 'cost_per_contact', 'tracking_cost_per_contact',
    'gsc_clicks', 'gsc_impressions', 'conversion_lead_ga4', 'estimate_sum',
    'updated_at',
  ];

  function headersMatch(row) {
    if (!row || row.length < HEADERS.length) return false;
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(row[i]) !== HEADERS[i]) return false;
    }
    return true;
  }

  function migrateHeaders(sh, data) {
    if (data.length && headersMatch(data[0])) return data;
    if (!data.length) {
      sh.appendRow(HEADERS);
      return [HEADERS];
    }
    // Rewrite header row in place; keep existing data columns left-aligned.
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    data[0] = HEADERS;
    Logger.log('Sheet headers migrated to ' + HEADERS.length + ' columns');
    return data;
  }

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
      sh.appendRow(HEADERS);
    } else {
      var existing = sh.getDataRange().getValues();
      migrateHeaders(sh, existing);
    }
    return { ss: ss, sh: sh };
  }

  function upsertWeek(row) {
    var pack = getOrCreate();
    var sh = pack.sh;
    var data = migrateHeaders(sh, sh.getDataRange().getValues());
    var found = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(row.week_key)) {
        found = i + 1;
        break;
      }
    }
    var values = [
      row.week_key, row.label, row.contacts, row.leads_complete, row.leads_partial,
      row.leads_quote, row.leads_contact, row.newsletter_signups,
      row.phone_clicks, row.quote_starts, row.quote_completes,
      row.sessions, row.users, row.cost_per_contact, row.tracking_cost_per_contact,
      row.gsc_clicks, row.gsc_impressions, row.conversion_lead_ga4, row.estimate_sum,
      new Date().toISOString(),
    ];
    if (found > 0) sh.getRange(found, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
    return pack.ss.getUrl();
  }

  function lastN(n) {
    var pack = getOrCreate();
    var data = pack.sh.getDataRange().getValues();
    if (data.length <= 1) return [];
    return data.slice(Math.max(1, data.length - (n || 4)));
  }

  return { getOrCreate: getOrCreate, upsertWeek: upsertWeek, lastN: lastN, HEADERS: HEADERS };
})();
