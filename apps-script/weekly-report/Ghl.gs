var Ghl = (function () {
  var BASE = 'https://services.leadconnectorhq.com';

  // Official Search Contacts (advanced filters + searchAfter pagination):
  // https://marketplace.gohighlevel.com/docs/ghl/contacts/search-contacts-advanced
  //
  // dateAdded does NOT accept top-level gte/lt filters. Use operator "range" with
  // value { gte|gt, lte|lt } (ISO or epoch ms). Verified live 2026-10-11.
  //
  // lib/ghl.ts writes estimateAmount to opportunity monetaryValue only — there is
  // no contact custom-field key for estimates, so estimateSum stays null (not 0).
  var ESTIMATE_FIELD_KEY = null;

  function headers(token) {
    return {
      Authorization: 'Bearer ' + token,
      Version: '2021-07-28',
      Accept: 'application/json',
    };
  }

  function websiteLeads(token, locationId, start, endExclusive) {
    var url = BASE + '/contacts/search';
    var pageLimit = 100;
    var complete = 0, partial = 0;
    var estimateSum = ESTIMATE_FIELD_KEY ? 0 : null;
    var kept = [];
    var searchAfter = null;
    var pages = 0;
    var maxPages = 50;

    while (pages < maxPages) {
      pages++;
      var body = {
        locationId: locationId,
        pageLimit: pageLimit,
        filters: [
          { field: 'tags', operator: 'contains', value: 'website-lead' },
          {
            field: 'dateAdded',
            operator: 'range',
            value: {
              gte: start.toISOString(),
              lt: endExclusive.toISOString(),
            },
          },
        ],
      };
      if (searchAfter) body.searchAfter = searchAfter;

      var res = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        headers: headers(token),
        payload: JSON.stringify(body),
        muteHttpExceptions: true,
      });
      if (res.getResponseCode() >= 300) {
        Logger.log('GHL search ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
        return {
          complete: 0,
          partial: 0,
          estimateSum: null,
          error: String(res.getResponseCode()),
          contacts: [],
        };
      }

      var data = JSON.parse(res.getContentText());
      var contacts = data.contacts || [];
      var startMs = start.getTime();
      var endMs = endExclusive.getTime();

      for (var i = 0; i < contacts.length; i++) {
        var c = contacts[i];
        var created = c.dateAdded || c.dateCreated || c.createdAt;
        if (!created) continue; // skip undated contacts
        var t = new Date(created).getTime();
        if (t < startMs || t >= endMs) continue;
        var tags = (c.tags || []).map(String);
        if (tags.indexOf('lead-status:partial') >= 0) partial++;
        else complete++;
        if (ESTIMATE_FIELD_KEY && c.customFields) {
          // no-op until a contact custom field exists in lib/ghl.ts
        }
        kept.push(c);
      }

      var meta = data.meta || {};
      var next = meta.startAfter || data.searchAfter || null;
      if (!contacts.length || contacts.length < pageLimit || !next) break;
      searchAfter = next;
    }

    return {
      complete: complete,
      partial: partial,
      estimateSum: estimateSum,
      contacts: kept,
    };
  }

  return { websiteLeads: websiteLeads, ESTIMATE_FIELD_KEY: ESTIMATE_FIELD_KEY };
})();
