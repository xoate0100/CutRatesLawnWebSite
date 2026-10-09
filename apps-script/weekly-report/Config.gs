/**
 * Script Properties (Project Settings → Script properties):
 *   GA4_PROPERTY_ID          e.g. 123456789 (numeric only, no "properties/")
 *   GSC_SITE_URL             e.g. sc-domain:cutrateslawn.com or https://cutrateslawn.com/
 *   GHL_LOCATION_ID          GHL sub-account location id
 *   GHL_PRIVATE_TOKEN        Private Integration token (Contacts Read)
 *     aliases: GHL_PRIVATE_INTEGRATION_TOKEN (same as site .env), GHL_TOKEN
 *   REPORT_RECIPIENT         required; comma-separated Chris,Jason emails
 *   ALERT_TO                 failure alerts
 *   TRACKED_QUERIES          comma-separated queries (optional)
 *   SHEET_ID                 created automatically on first run
 *   GOOGLE_ADS_CUSTOMER_ID   optional; spend omitted until Ads query wired
 *   MONTHLY_FEE_USD          default 449
 *   LAST_SENT_WEEK           set automatically after a successful send
 *   GTM_ROLLBACK_VERSION     set by ensureGtmEventForwarding before publish
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

  /** Strip quotes / Bearer prefix / zero-width chars from pasted PIT values. */
  function sanitizeSecret(raw) {
    var v = String(raw || '')
      .replace(/^\uFEFF/, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim();
    if ((v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') ||
        (v.charAt(0) === "'" && v.charAt(v.length - 1) === "'")) {
      v = v.slice(1, -1).trim();
    }
    if (/^bearer\s+/i.test(v)) v = v.replace(/^bearer\s+/i, '').trim();
    return v;
  }

  function ghlToken() {
    return sanitizeSecret(
      prop('GHL_PRIVATE_TOKEN', '') ||
      prop('GHL_PRIVATE_INTEGRATION_TOKEN', '') ||
      prop('GHL_TOKEN', '')
    );
  }

  function requireConfigured() {
    return {
      ga4PropertyId: required('GA4_PROPERTY_ID'),
      gscSiteUrl: prop('GSC_SITE_URL', 'https://cutrateslawn.com/'),
      ghlLocationId: prop('GHL_LOCATION_ID', ''),
      ghlToken: ghlToken(),
      recipient: required('REPORT_RECIPIENT'),
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
    sanitizeSecret: sanitizeSecret,
    ghlToken: ghlToken,
    monthlyFee: function () {
      return Number(prop('MONTHLY_FEE_USD', '449')) || 449;
    },
  };
})();
