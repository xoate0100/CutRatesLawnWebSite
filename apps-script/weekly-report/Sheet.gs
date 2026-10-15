/**
 * weekly_kpis — one row per Mon–Sun week for longitudinal website marketing KPIs.
 *
 * System of record boundaries:
 * - This sheet: website demand (traffic, forms, GHL website-lead counts, SEO).
 * - FieldRoutes: sales-team lead SOURCE / disposition (Chris confirmed 2026-10-15).
 *   Do not try to reconstruct sales attribution columns here.
 */
var Sheet = (function () {
  var TAB = 'weekly_kpis';

  // Append-only column growth. Never reorder existing names — migrateHeaders pads right.
  var HEADERS = [
    'week_key',                 // 0  Monday YYYY-MM-DD
    'label',                    // 1  "YYYY-MM-DD → YYYY-MM-DD"
    'contacts',                 // 2  Sales leads (GHL website-lead minus careers/newsletter)
    'leads_complete',           // 3
    'leads_partial',            // 4
    'leads_quote',              // 5  GA4 conversion_lead lead_source=quote (may be blank)
    'leads_contact',            // 6  reserved / GA4 contact when available
    'newsletter_signups',       // 7  GA4 newsletter_signup
    'phone_clicks',             // 8
    'quote_starts',             // 9
    'quote_completes',          // 10
    'sessions',                 // 11
    'users',                    // 12
    'cost_per_contact',         // 13  Ads spend / contacts (blank until Ads wired)
    'tracking_cost_per_contact',// 14  MONTHLY_FEE*12/52 / contacts
    'gsc_clicks',               // 15
    'gsc_impressions',          // 16
    'conversion_lead_ga4',      // 17  raw GA4 conversion_lead (incl. dark periods)
    'estimate_sum',             // 18  null until contact CF exists
    'updated_at',               // 19
    // --- longitudinal additions (2026-10-15) ---
    'week_end',                 // 20 Sunday YYYY-MM-DD
    'engaged_sessions',         // 21
    'engaged_rate',             // 22 0–1
    'new_users',                // 23
    'gsc_ctr',                  // 24 0–1
    'gsc_position',             // 25 impression-weighted
    'applicants_excluded',      // 26 careers tagged website-lead
    'newsletter_ghl_excluded',  // 27 newsletter tagged website-lead
    'won_jobs',                 // 28 website-lead opps won in window
    'won_value',                // 29
    'quote_complete_rate',      // 30 completes/starts when both known
    'mobile_sessions',          // 31
    'desktop_sessions',         // 32
    'in_area_users',            // 33 GA4 cities in service area
    'geo_users_known',          // 34
    'tracking_dark',            // 35 1 if sessions but zero custom events
    'health_flags',             // 36 short pipe-joined notes (not full essay)
  ];

  var COL = {};
  HEADERS.forEach(function (h, i) { COL[h] = i; });

  function headersMatch(row) {
    if (!row || row.length < HEADERS.length) return false;
    for (var i = 0; i < HEADERS.length; i++) {
      if (String(row[i]) !== HEADERS[i]) return false;
    }
    return true;
  }

  function padRow(row) {
    var out = [];
    for (var i = 0; i < HEADERS.length; i++) {
      out[i] = row[i] != null ? row[i] : '';
    }
    return out;
  }

  function migrateHeaders(sh, data) {
    if (!data.length) {
      sh.appendRow(HEADERS);
      freezeHeader(sh);
      return [HEADERS.slice()];
    }
    if (headersMatch(data[0])) return data;

    // Expand or rename header in place; pad existing rows so column indexes stay stable.
    var width = Math.max(HEADERS.length, data[0].length);
    sh.getRange(1, 1, 1, width).clearContent();
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    data[0] = HEADERS.slice();
    for (var r = 1; r < data.length; r++) {
      data[r] = padRow(data[r]);
      sh.getRange(r + 1, 1, 1, HEADERS.length).setValues([data[r]]);
    }
    freezeHeader(sh);
    Logger.log('Sheet headers migrated to ' + HEADERS.length + ' columns');
    return data;
  }

  function freezeHeader(sh) {
    try {
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    } catch (e) { /* ignore */ }
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
      freezeHeader(sh);
    } else {
      var existing = sh.getDataRange().getValues();
      migrateHeaders(sh, existing);
    }
    return { ss: ss, sh: sh };
  }

  function blankToEmpty(v) {
    return v == null ? '' : v;
  }

  function rate(num, den) {
    if (num == null || den == null || !den) return '';
    return Number(num) / Number(den);
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

    var values = padRow([]);
    values[COL.week_key] = row.week_key;
    values[COL.label] = row.label;
    values[COL.contacts] = blankToEmpty(row.contacts);
    values[COL.leads_complete] = blankToEmpty(row.leads_complete);
    values[COL.leads_partial] = blankToEmpty(row.leads_partial);
    values[COL.leads_quote] = blankToEmpty(row.leads_quote);
    values[COL.leads_contact] = blankToEmpty(row.leads_contact);
    values[COL.newsletter_signups] = blankToEmpty(row.newsletter_signups);
    values[COL.phone_clicks] = blankToEmpty(row.phone_clicks);
    values[COL.quote_starts] = blankToEmpty(row.quote_starts);
    values[COL.quote_completes] = blankToEmpty(row.quote_completes);
    values[COL.sessions] = blankToEmpty(row.sessions);
    values[COL.users] = blankToEmpty(row.users);
    values[COL.cost_per_contact] = blankToEmpty(row.cost_per_contact);
    values[COL.tracking_cost_per_contact] = blankToEmpty(row.tracking_cost_per_contact);
    values[COL.gsc_clicks] = blankToEmpty(row.gsc_clicks);
    values[COL.gsc_impressions] = blankToEmpty(row.gsc_impressions);
    values[COL.conversion_lead_ga4] = blankToEmpty(row.conversion_lead_ga4);
    values[COL.estimate_sum] = blankToEmpty(row.estimate_sum);
    values[COL.updated_at] = new Date().toISOString();
    values[COL.week_end] = blankToEmpty(row.week_end);
    values[COL.engaged_sessions] = blankToEmpty(row.engaged_sessions);
    values[COL.engaged_rate] = blankToEmpty(row.engaged_rate);
    values[COL.new_users] = blankToEmpty(row.new_users);
    values[COL.gsc_ctr] = blankToEmpty(row.gsc_ctr);
    values[COL.gsc_position] = blankToEmpty(row.gsc_position);
    values[COL.applicants_excluded] = blankToEmpty(row.applicants_excluded);
    values[COL.newsletter_ghl_excluded] = blankToEmpty(row.newsletter_ghl_excluded);
    values[COL.won_jobs] = blankToEmpty(row.won_jobs);
    values[COL.won_value] = blankToEmpty(row.won_value);
    values[COL.quote_complete_rate] = blankToEmpty(
      row.quote_complete_rate != null ? row.quote_complete_rate : rate(row.quote_completes, row.quote_starts)
    );
    values[COL.mobile_sessions] = blankToEmpty(row.mobile_sessions);
    values[COL.desktop_sessions] = blankToEmpty(row.desktop_sessions);
    values[COL.in_area_users] = blankToEmpty(row.in_area_users);
    values[COL.geo_users_known] = blankToEmpty(row.geo_users_known);
    values[COL.tracking_dark] = row.tracking_dark ? 1 : 0;
    values[COL.health_flags] = blankToEmpty(row.health_flags);

    if (found > 0) sh.getRange(found, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
    return pack.ss.getUrl();
  }

  /** Prior weeks sorted by week_key ascending (not sheet append order). */
  function lastN(n) {
    var pack = getOrCreate();
    var data = pack.sh.getDataRange().getValues();
    if (data.length <= 1) return [];
    var rows = data.slice(1).map(padRow).filter(function (r) { return r[0]; });
    rows.sort(function (a, b) { return String(a[0]) < String(b[0]) ? -1 : 1; });
    return rows.slice(Math.max(0, rows.length - (n || 4)));
  }

  function cell(row, name) {
    var i = COL[name];
    return i == null ? '' : row[i];
  }

  return {
    getOrCreate: getOrCreate,
    upsertWeek: upsertWeek,
    lastN: lastN,
    HEADERS: HEADERS,
    COL: COL,
    cell: cell,
  };
})();
