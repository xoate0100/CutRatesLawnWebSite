/**
 * Entry points for triggers and manual runs.
 * After push: set Script Properties, run dryRunWeeklyReport, then createWeeklyTrigger.
 */

function runWeeklyReport() {
  try {
    var r = Report.send(0);
    Logger.log('Sent week ' + r.label + ' contacts=' + r.contacts + ' to ' + r.recipient);
  } catch (e) {
    var to = Config.prop('ALERT_TO', '') || Session.getEffectiveUser().getEmail();
    MailApp.sendEmail({
      to: to,
      subject: 'FAILED: Cut Rates weekly report',
      body: 'The Monday report did not send.\n\n' + (e && e.stack ? e.stack : String(e)),
    });
    throw e;
  }
}

/** Preview HTML in Logs without sending email (still upserts the Sheet row). */
function dryRunWeeklyReport() {
  var r = Report.build(0);
  Logger.log(Report.html(r));
  return r;
}

/** Sends last week's report ONLY to ALERT_TO (you) so you can eyeball it before Chris/Jason see one. */
function testSendToMe() {
  var r = Report.build(0);
  var to = Config.prop('ALERT_TO', '') || Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: to, subject: '[TEST] Cut Rates weekly report — ' + r.label, htmlBody: Report.html(r) });
  Logger.log('Test sent to ' + to);
}

function createWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'runWeeklyReport') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('runWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .inTimezone(Config.TZ)
    .create();
  Logger.log('Weekly trigger created for Mondays 7am ' + Config.TZ);
}

function setupProperties() {
  var props = PropertiesService.getScriptProperties();
  var keys = {
    GA4_PROPERTY_ID: '',
    GSC_SITE_URL: '',
    GHL_LOCATION_ID: '',
    GHL_PRIVATE_TOKEN: '',
    REPORT_RECIPIENT: '',
    ALERT_TO: '',
    EVT_LEAD: 'conversion_lead',
    EVT_PHONE: 'phone_click',
    EVT_QUOTE_START: 'form_start',
    EVT_QUOTE_COMPLETE: 'conversion_lead',
    GA4_SERVICE_DIM: 'customEvent:service_id',
  };
  var out = {};
  Object.keys(keys).forEach(function (k) { out[k] = props.getProperty(k) || keys[k]; });
  props.setProperties(out, false);
  Logger.log('Seeded: ' + JSON.stringify(Object.keys(out)) + ' — fill blanks in Project Settings.');
}
