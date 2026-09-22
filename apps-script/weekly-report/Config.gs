/**
 * Script Properties (Project Settings → Script properties):
 *   GA4_PROPERTY_ID          e.g. 123456789 (numeric only, no "properties/")
 *   GSC_SITE_URL             e.g. https://cutrateslawn.com/
 *   GHL_LOCATION_ID          GHL sub-account location id
 *   GHL_PRIVATE_TOKEN        Private Integration token (Contacts Read)
 *   REPORT_RECIPIENT         email for Monday report
 *   TRACKED_QUERIES          comma-separated queries (optional)
 *   SHEET_ID                 created automatically on first run
 *   GOOGLE_ADS_CUSTOMER_ID   optional; spend omitted until Ads query wired
 *   MONTHLY_FEE_USD          optional display only
 */
var Config = (function () {
  var TZ = 'America/Chicago';

  function prop(key, fallback) {
    var v = PropertiesService.getScriptProperties().getProperty(key);
    if (v == null || String(v).trim() === '') return fallback != null ? fallback : '';
    return String(v).trim();
  }

  function required(key) {
    var v = prop(key);
    if (!v) throw new Error('Missing Script Property: ' + key);
    return v;
  }

  function requireConfigured() {
    return {
      ga4PropertyId: required('GA4_PROPERTY_ID'),
      gscSiteUrl: prop('GSC_SITE_URL', 'https://cutrateslawn.com/'),
      ghlLocationId: prop('GHL_LOCATION_ID', ''),
      ghlToken: prop('GHL_PRIVATE_TOKEN', '') || prop('GHL_TOKEN', ''),
      recipient: prop('REPORT_RECIPIENT', '') || prop('REPORT_TO', 'info@cutrateslawn.com'),
      trackedQueries: (prop('TRACKED_QUERIES', '') || trackedTerms().join(','))
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean),
    };
  }

  function trackedTerms() {
    return [
      'lawn care wichita',
      'lawn mowing wichita',
      'landscaping wichita',
      'pest control wichita',
      'snow removal wichita',
      'lawn care derby ks',
      'holiday lights wichita',
    ];
  }

  return {
    TZ: TZ,
    prop: prop,
    required: required,
    requireConfigured: requireConfigured,
    trackedTerms: trackedTerms,
    monthlyFee: function () {
      return Number(prop('MONTHLY_FEE_USD', '449')) || 449;
    },
  };
})();
