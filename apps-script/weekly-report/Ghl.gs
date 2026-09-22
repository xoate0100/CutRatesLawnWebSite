var Ghl = (function () {
  var BASE = 'https://services.leadconnectorhq.com';

  function headers(token) {
    return {
      Authorization: 'Bearer ' + token,
      Version: '2021-07-28',
      Accept: 'application/json',
    };
  }

  /**
   * Best-effort: search contacts updated/created in range with website-lead tag.
   * GHL search APIs vary by plan; failures return empty and surface in health.
   */
  function websiteLeads(token, locationId, start, endExclusive) {
    var url = BASE + '/contacts/search';
    var body = {
      locationId: locationId,
      pageLimit: 100,
      filters: [
        { field: 'tags', operator: 'contains', value: 'website-lead' },
      ],
    };
    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: headers(token),
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() >= 300) {
      Logger.log('GHL search ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
      return { complete: 0, partial: 0, estimateSum: 0, error: String(res.getResponseCode()), contacts: [] };
    }
    var data = JSON.parse(res.getContentText());
    var contacts = data.contacts || data || [];
    var complete = 0, partial = 0, estimateSum = 0;
    var startMs = start.getTime();
    var endMs = endExclusive.getTime();
    var kept = [];
    (contacts || []).forEach(function (c) {
      var created = c.dateAdded || c.dateCreated || c.createdAt;
      var t = created ? new Date(created).getTime() : 0;
      if (t && (t < startMs || t >= endMs)) return;
      var tags = (c.tags || []).map(String);
      if (tags.indexOf('lead-status:partial') >= 0) partial++;
      else complete++;
      kept.push(c);
    });
    return { complete: complete, partial: partial, estimateSum: estimateSum, contacts: kept };
  }

  return { websiteLeads: websiteLeads };
})();
