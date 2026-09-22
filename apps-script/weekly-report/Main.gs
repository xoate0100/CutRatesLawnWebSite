/**
 * Entry points for triggers and manual runs.
 * After clasp push: run setupProperties once, then createWeeklyTrigger.
 */

function runWeeklyReport() {
  var r = Report.send(0);
  Logger.log('Sent week ' + r.label + ' contacts=' + r.contacts);
}

/** Preview HTML in Logs without sending email. */
function dryRunWeeklyReport() {
  var r = Report.build(0);
  Logger.log(Report.html(r));
  return r;
}

function createWeeklyTrigger() {
  // Monday 7:00 America/Chicago — adjust as needed
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
  // Fill real values in Project Settings → Script properties, or edit below once then clear.
  var props = PropertiesService.getScriptProperties();
  var defaults = {
    GA4_PROPERTY_ID: props.getProperty('GA4_PROPERTY_ID') || '',
    GSC_SITE_URL: props.getProperty('GSC_SITE_URL') || 'https://cutrateslawn.com/',
    GHL_LOCATION_ID: props.getProperty('GHL_LOCATION_ID') || '',
    GHL_PRIVATE_TOKEN: props.getProperty('GHL_PRIVATE_TOKEN') || '',
    REPORT_RECIPIENT: props.getProperty('REPORT_RECIPIENT') || 'info@cutrateslawn.com',
    TRACKED_QUERIES: props.getProperty('TRACKED_QUERIES') || 'lawn mowing wichita,lawn care derby ks,snow removal wichita',
  };
  props.setProperties(defaults, false);
  Logger.log('Properties present. Set empty ones in Project Settings → Script properties.');
  Logger.log(JSON.stringify(Object.keys(defaults)));
}
