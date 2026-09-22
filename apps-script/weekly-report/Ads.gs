var Ads = (function () {
  /**
   * Optional Google Ads spend. Requires Advanced Google Ads service + login customer.
   * If not configured, returns null and email shows "Ads: not connected".
   */
  function spendUsd(start, endExclusive) {
    var customerId = Config.prop('GOOGLE_ADS_CUSTOMER_ID');
    if (!customerId) return null;
    try {
      // Placeholder: many accounts use AdsApp / Ads API differently.
      // Return null unless a custom query is wired — do not invent spend.
      Logger.log('GOOGLE_ADS_CUSTOMER_ID set but Ads query not wired; spend omitted.');
      return null;
    } catch (e) {
      Logger.log('Ads spend error: ' + e);
      return null;
    }
  }
  return { spendUsd: spendUsd };
})();
