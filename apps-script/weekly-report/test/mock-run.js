/**
 * Offline mock run of the weekly report. No Google APIs are called.
 * Usage (pwsh):  node apps-script/weekly-report/test/mock-run.js
 * Exits non-zero on any failed assertion. Extend the cases as the report grows.
 */
process.env.TZ = 'America/Chicago';
const fs = require('fs'); const path = require('path'); const vm = require('vm'); const assert = require('assert');
const DIR = path.join(__dirname, '..');
const ORDER = ['Config', 'Ga4', 'SearchConsole', 'Ghl', 'Sheet', 'Ads', 'Report', 'Main'];

function makeCtx(props, opts = {}) {
  const sent = [], calls = [], rows = []; let sh = null;
  const sheet = () => ({ getId: () => 'SID', getUrl: () => 'https://docs.google.com/spreadsheets/d/SID',
    getSheetByName: () => sh,
    insertSheet: () => (sh = { appendRow: r => rows.push(r), getDataRange: () => ({ getValues: () => rows }),
      getRange: r => ({ setValues: v => (rows[r - 1] = v[0]) }) }) });
  const ctx = { console, Date, JSON, Math, Number, String, Object, Array, Error,
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] ?? null, setProperty: (k, v) => (props[k] = v), setProperties: o => Object.assign(props, o) }) },
    Logger: { log: () => {} },
    Session: { getScriptTimeZone: () => 'America/Chicago', getEffectiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    Utilities: { formatDate: d => d.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }) },
    AnalyticsData: { Properties: { runReport: body => {
      calls.push({ ga4: body });
      const dims = body.dimensions.map(d => d.name);
      if (opts.badDim && dims.includes(opts.badDim)) throw new Error('Field ' + opts.badDim + ' is not a valid dimension');
      if (!dims.length) return { rows: [{ metricValues: [{ value: '200' }, { value: '150' }, { value: '120' }, { value: '110' }] }] };
      if (dims[0] === 'landingPagePlusQueryString') return { rows: [
        { dimensionValues: [{ value: '/a' }], metricValues: [{ value: '5' }] },
        { dimensionValues: [{ value: '/' }], metricValues: [{ value: '90' }] }] };
      if (dims[0] === 'sessionDefaultChannelGroup') return { rows: [{ dimensionValues: [{ value: 'Organic Search' }], metricValues: [{ value: '120' }] }] };
      if (dims.length === 2) return { rows: [{ dimensionValues: [{ value: 'x' }, { value: 'landscaping' }], metricValues: [{ value: '3' }] }] };
      return { rows: [{ dimensionValues: [{ value: 'x' }], metricValues: [{ value: '4' }] }] };
    } } },
    UrlFetchApp: { fetch: (url, o) => {
      calls.push({ url, payload: o.payload });
      if (url.includes('leadconnector')) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ contacts: opts.ghlContacts || [] }) };
      return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ rows: [{ keys: ['lawn care wichita'], clicks: 3, impressions: 100, ctr: 0.03, position: 7.2 }] }) };
    } },
    ScriptApp: { getOAuthToken: () => 't', getProjectTriggers: () => [], WeekDay: { MONDAY: 'MON' },
      newTrigger: h => { const b = { timeBased: () => b, onWeekDay: () => b, atHour: () => b, inTimezone: () => b, create: () => (ctx.__trigger = h) }; return b; } },
    MailApp: { sendEmail: m => sent.push(m) },
    SpreadsheetApp: { create: sheet, openById: sheet },
  };
  vm.createContext(ctx);
  for (const f of ORDER) vm.runInContext(fs.readFileSync(path.join(DIR, f + '.gs'), 'utf8'), ctx, { filename: f + '.gs' });
  return { ctx, sent, calls, rows, run: code => vm.runInContext(code, ctx) };
}

const base = () => ({ GA4_PROPERTY_ID: '123', GSC_SITE_URL: 'sc-domain:cutrateslawn.com',
  REPORT_RECIPIENT: 'chris@example.com,jason@example.com', ALERT_TO: 'andy@example.com' });
let pass = 0; const t = (name, fn) => { fn(); pass++; console.log('PASS', name); };

t('manifest is valid JSON with send_mail scope', () => {
  const m = JSON.parse(fs.readFileSync(path.join(DIR, 'appsscript.json'), 'utf8'));
  assert(m.oauthScopes.includes('https://www.googleapis.com/auth/script.send_mail'));
  assert.strictEqual(m.timeZone, 'America/Chicago');
});
t('sends to Chris+Jason for the prior Mon-Sun week', () => {
  const h = makeCtx(base()); h.run('runWeeklyReport()');
  assert.strictEqual(h.sent.length, 1);
  assert.strictEqual(h.sent[0].to, 'chris@example.com,jason@example.com');
  const m = h.sent[0].subject.match(/(\d{4}-\d\d-\d\d) → (\d{4}-\d\d-\d\d)/);
  const s = new Date(m[1] + 'T12:00:00'), e = new Date(m[2] + 'T12:00:00');
  assert.strictEqual(s.getDay(), 1); assert.strictEqual(e.getDay(), 0);
});
t('queries the event names the site actually emits', () => {
  const h = makeCtx(base()); h.run('dryRunWeeklyReport()');
  const evs = h.calls.filter(c => c.ga4 && c.ga4.dimensionFilter).map(c => JSON.stringify(c.ga4.dimensionFilter));
  for (const e of ['conversion_lead', 'phone_click', 'form_start']) assert(evs.some(x => x.includes('"' + e + '"')), 'missing ' + e);
});
t('top landing pages sorted by sessions desc', () => {
  const h = makeCtx(base()); h.run('runWeeklyReport()');
  assert(/Top landings<\/b><\/p><ul><li>\/ — 90/.test(h.sent[0].htmlBody));
});
t('unregistered custom dimension degrades to a Health note, still sends', () => {
  const h = makeCtx(base(), { badDim: 'customEvent:service_id' }); h.run('runWeeklyReport()');
  assert.strictEqual(h.sent.length, 1); assert(/not registered/.test(h.sent[0].htmlBody));
});
t('missing GA4_PROPERTY_ID emails a FAILED alert to ALERT_TO', () => {
  const p = base(); delete p.GA4_PROPERTY_ID; const h = makeCtx(p);
  assert.throws(() => h.run('runWeeklyReport()'));
  assert.strictEqual(h.sent[0].to, 'andy@example.com'); assert(/^FAILED/.test(h.sent[0].subject));
});
t('re-running the same week updates the Sheet row instead of appending', () => {
  const h = makeCtx(base()); h.run('runWeeklyReport()'); h.run('dryRunWeeklyReport()');
  assert.strictEqual(h.rows.length, 2);
});
t('createWeeklyTrigger targets runWeeklyReport', () => {
  const h = makeCtx(base()); h.run('createWeeklyTrigger()'); assert.strictEqual(h.ctx.__trigger, 'runWeeklyReport');
});
console.log('\n' + pass + ' checks passed');
