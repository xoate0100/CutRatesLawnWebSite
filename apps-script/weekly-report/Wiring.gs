/**
 * Idempotent GA4 + GTM wiring for the weekly report.
 * Run once via runAllWiring() after Advanced Services are enabled.
 * Targets measurement G-5X2990G1ZP and container GTM-KGVZJ93G.
 */

var Wiring = (function () {
  var MEASUREMENT_ID = 'G-5X2990G1ZP';
  var CONTAINER_PUBLIC_ID = 'GTM-KGVZJ93G';
  var WORKSPACE_NAME = 'weekly-report-wiring';
  var TRIGGER_NAME = 'CE - CRL site events';
  var TAG_NAME = 'GA4 Event - CRL site events';
  var TRIGGER_REGEX =
    '^(phone_click|conversion_lead|newsletter_signup|form_start|form_step_complete|form_abandon|partial_form_fill|form_error|funnel_step_view|service_view|area_view)$';

  var DLV_KEYS = [
    'service_id', 'service_name', 'area_slug', 'area_name', 'form_id',
    'click_location', 'lead_source', 'funnel_id', 'step_name', 'step_number',
    'transaction_id', 'conversion_value', 'currency', 'traffic_type',
    'utm_source', 'utm_medium', 'utm_campaign', 'gclid',
  ];

  var DIMENSIONS = [
    'service_id', 'area_slug', 'form_id', 'click_location',
    'lead_source', 'funnel_id', 'step_name',
  ];

  var KEY_EVENTS = ['conversion_lead', 'phone_click'];

  function propertyParent() {
    return 'properties/' + Config.required('GA4_PROPERTY_ID');
  }

  function findContainer() {
    var accounts = TagManager.Accounts.list() || {};
    var accountList = accounts.account || [];
    for (var i = 0; i < accountList.length; i++) {
      var accPath = 'accounts/' + accountList[i].accountId;
      var containers = TagManager.Accounts.Containers.list(accPath) || {};
      var list = containers.container || [];
      for (var j = 0; j < list.length; j++) {
        if (list[j].publicId === CONTAINER_PUBLIC_ID) {
          return {
            accountId: accountList[i].accountId,
            containerId: list[j].containerId,
            path: accPath + '/containers/' + list[j].containerId,
          };
        }
      }
    }
    throw new Error('GTM container ' + CONTAINER_PUBLIC_ID + ' not found');
  }

  function ensureWorkspace(containerPath) {
    var listed = TagManager.Accounts.Containers.Workspaces.list(containerPath) || {};
    var workspaces = listed.workspace || [];
    for (var i = 0; i < workspaces.length; i++) {
      if (workspaces[i].name === WORKSPACE_NAME) {
        Logger.log('workspace already_present ' + WORKSPACE_NAME);
        return workspaces[i];
      }
    }
    var created = TagManager.Accounts.Containers.Workspaces.create(
      { name: WORKSPACE_NAME, description: 'Cut Rates weekly report event forwarding' },
      containerPath
    );
    Logger.log('workspace created ' + WORKSPACE_NAME);
    return created;
  }

  function listBy(fn, parent) {
    var res = fn(parent) || {};
    return res.variable || res.trigger || res.tag || res.customDimension ||
      res.keyEvent || res.conversionEvent || [];
  }

  function dlvResource(key) {
    return {
      name: 'DLV - ' + key,
      type: 'v',
      parameter: [
        { type: 'integer', key: 'dataLayerVersion', value: '2' },
        { type: 'boolean', key: 'setDefaultValue', value: 'false' },
        { type: 'template', key: 'name', value: key },
      ],
    };
  }

  function ensureVariables(workspacePath) {
    var existing = TagManager.Accounts.Containers.Workspaces.Variables.list(workspacePath) || {};
    var vars = existing.variable || [];
    var byName = {};
    vars.forEach(function (v) { byName[v.name] = v; });
    DLV_KEYS.forEach(function (key) {
      var name = 'DLV - ' + key;
      if (byName[name]) {
        Logger.log('variable already_present ' + name);
        return;
      }
      TagManager.Accounts.Containers.Workspaces.Variables.create(dlvResource(key), workspacePath);
      Logger.log('variable created ' + name);
    });
  }

  function triggerResource() {
    return {
      name: TRIGGER_NAME,
      type: 'customEvent',
      customEventFilter: [
        {
          type: 'matchRegex',
          parameter: [
            { type: 'template', key: 'arg0', value: '{{_event}}' },
            { type: 'template', key: 'arg1', value: TRIGGER_REGEX },
          ],
        },
      ],
    };
  }

  function ensureTrigger(workspacePath) {
    var existing = TagManager.Accounts.Containers.Workspaces.Triggers.list(workspacePath) || {};
    var triggers = existing.trigger || [];
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].name === TRIGGER_NAME) {
        var want = JSON.stringify(triggerResource().customEventFilter);
        var have = JSON.stringify(triggers[i].customEventFilter || []);
        if (want !== have) {
          var updated = triggerResource();
          updated.triggerId = triggers[i].triggerId;
          TagManager.Accounts.Containers.Workspaces.Triggers.update(
            updated,
            workspacePath + '/triggers/' + triggers[i].triggerId
          );
          Logger.log('trigger updated ' + TRIGGER_NAME);
          return triggers[i].triggerId;
        }
        Logger.log('trigger already_present ' + TRIGGER_NAME);
        return triggers[i].triggerId;
      }
    }
    var created = TagManager.Accounts.Containers.Workspaces.Triggers.create(
      triggerResource(),
      workspacePath
    );
    Logger.log('trigger created ' + TRIGGER_NAME);
    return created.triggerId;
  }

  function eventParam(name, value) {
    return {
      type: 'map',
      map: [
        { type: 'template', key: 'name', value: name },
        { type: 'template', key: 'value', value: value },
      ],
    };
  }

  function tagResource(triggerId) {
    var eventParameters = DLV_KEYS.filter(function (k) {
      return k !== 'currency' && k !== 'conversion_value';
    }).map(function (key) {
      return eventParam(key, '{{DLV - ' + key + '}}');
    });
    return {
      name: TAG_NAME,
      type: 'gaawe',
      firingTriggerId: [String(triggerId)],
      consentSettings: {
        consentStatus: 'NEEDED',
        consentType: {
          type: 'list',
          list: [{ type: 'template', value: 'analytics_storage' }],
        },
      },
      parameter: [
        { type: 'boolean', key: 'sendEcommerceData', value: 'false' },
        { type: 'template', key: 'measurementIdOverride', value: MEASUREMENT_ID },
        { type: 'template', key: 'eventName', value: '{{Event}}' },
        { type: 'template', key: 'eventSettingsTable', value: '[["currency","{{DLV - currency}}"],["value","{{DLV - conversion_value}}"]]' },
        {
          type: 'list',
          key: 'eventParameters',
          list: eventParameters.concat([
            eventParam('currency', '{{DLV - currency}}'),
            eventParam('value', '{{DLV - conversion_value}}'),
          ]),
        },
      ],
    };
  }

  function tagSignature(tag) {
    var params = (tag.parameter || []).slice().sort(function (a, b) {
      return String(a.key).localeCompare(String(b.key));
    });
    return JSON.stringify({
      type: tag.type,
      firingTriggerId: tag.firingTriggerId,
      consentSettings: tag.consentSettings,
      parameter: params,
    });
  }

  function ensureTag(workspacePath, triggerId) {
    var desired = tagResource(triggerId);
    var existing = TagManager.Accounts.Containers.Workspaces.Tags.list(workspacePath) || {};
    var tags = existing.tag || [];
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].name === TAG_NAME || (tags[i].type === 'gaawe' && tags[i].name.indexOf('CRL site events') >= 0)) {
        if (tagSignature(tags[i]) === tagSignature(desired)) {
          Logger.log('tag already_present ' + TAG_NAME);
          return tags[i];
        }
        desired.tagId = tags[i].tagId;
        TagManager.Accounts.Containers.Workspaces.Tags.update(
          desired,
          workspacePath + '/tags/' + tags[i].tagId
        );
        Logger.log('tag updated ' + TAG_NAME);
        return desired;
      }
    }
    var created = TagManager.Accounts.Containers.Workspaces.Tags.create(desired, workspacePath);
    Logger.log('tag created ' + TAG_NAME);
    return created;
  }

  function publishWorkspace(container, workspace) {
    var containerPath = container.path;
    var workspacePath = workspace.path || (containerPath + '/workspaces/' + workspace.workspaceId);
    var live = null;
    try {
      live = TagManager.Accounts.Containers.Versions.live(containerPath);
    } catch (e) {
      Logger.log('no live version yet: ' + e);
    }
    if (live && live.containerVersionId) {
      PropertiesService.getScriptProperties().setProperty(
        'GTM_ROLLBACK_VERSION',
        String(live.containerVersionId)
      );
      Logger.log('GTM_ROLLBACK_VERSION=' + live.containerVersionId);
    }
    var stamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || 'America/Chicago',
      'yyyy-MM-dd HH:mm'
    );
    var versionName = 'weekly-report-wiring ' + stamp;
    var created = TagManager.Accounts.Containers.Workspaces.create_version(
      { name: versionName, notes: 'CRL site event forwarding for weekly report' },
      workspacePath
    );
    var version = created.containerVersion || created;
    var versionPath = version.path ||
      (containerPath + '/versions/' + version.containerVersionId);
    TagManager.Accounts.Containers.Versions.publish(versionPath);
    var url = 'https://tagmanager.google.com/#/container/accounts/' +
      container.accountId + '/containers/' + container.containerId +
      '/versions/' + version.containerVersionId;
    Logger.log('published GTM version ' + version.containerVersionId + ' url=' + url);
    return { versionId: version.containerVersionId, url: url };
  }

  function ensureGa4CustomDimensions() {
    var parent = propertyParent();
    var listed = AnalyticsAdmin.Properties.CustomDimensions.list(parent) || {};
    var existing = listed.customDimensions || [];
    var present = {};
    existing.forEach(function (d) {
      if (d.parameterName) present[d.parameterName] = d;
    });
    var summary = [];
    DIMENSIONS.forEach(function (name) {
      if (present[name]) {
        Logger.log('dimension already_present ' + name);
        summary.push({ name: name, status: 'already_present' });
        return;
      }
      AnalyticsAdmin.Properties.CustomDimensions.create({
        parameterName: name,
        displayName: name,
        scope: 'EVENT',
        description: 'CRL weekly report dimension',
      }, parent);
      Logger.log('dimension created ' + name);
      summary.push({ name: name, status: 'created' });
    });
    return summary;
  }

  function ensureGa4KeyEvents() {
    var parent = propertyParent();
    var apiUsed = 'keyEvents';
    var summary = [];
    KEY_EVENTS.forEach(function (eventName) {
      try {
        var listed = AnalyticsAdmin.Properties.KeyEvents.list(parent) || {};
        var events = listed.keyEvents || [];
        var found = events.some(function (e) { return e.eventName === eventName; });
        if (found) {
          Logger.log('keyEvent already_present ' + eventName + ' api=keyEvents');
          summary.push({ eventName: eventName, status: 'already_present', api: 'keyEvents' });
          return;
        }
        AnalyticsAdmin.Properties.KeyEvents.create({ eventName: eventName }, parent);
        Logger.log('keyEvent created ' + eventName + ' api=keyEvents');
        summary.push({ eventName: eventName, status: 'created', api: 'keyEvents' });
      } catch (e) {
        apiUsed = 'conversionEvents';
        try {
          var listed2 = AnalyticsAdmin.Properties.ConversionEvents.list(parent) || {};
          var events2 = listed2.conversionEvents || [];
          var found2 = events2.some(function (ev) { return ev.eventName === eventName; });
          if (found2) {
            Logger.log('keyEvent already_present ' + eventName + ' api=conversionEvents');
            summary.push({ eventName: eventName, status: 'already_present', api: 'conversionEvents' });
            return;
          }
          AnalyticsAdmin.Properties.ConversionEvents.create({ eventName: eventName }, parent);
          Logger.log('keyEvent created ' + eventName + ' api=conversionEvents');
          summary.push({ eventName: eventName, status: 'created', api: 'conversionEvents' });
        } catch (e2) {
          Logger.log('keyEvent failed ' + eventName + ' ' + e2);
          summary.push({ eventName: eventName, status: 'error', error: String(e2) });
        }
      }
    });
    Logger.log('ensureGa4KeyEvents api_used=' + apiUsed);
    return summary;
  }

  function ensureGtmEventForwarding() {
    var container = findContainer();
    var workspace = ensureWorkspace(container.path);
    var workspacePath = workspace.path ||
      (container.path + '/workspaces/' + workspace.workspaceId);
    ensureVariables(workspacePath);
    var triggerId = ensureTrigger(workspacePath);
    ensureTag(workspacePath, triggerId);
    var published = publishWorkspace(container, workspace);
    return {
      container: CONTAINER_PUBLIC_ID,
      measurementId: MEASUREMENT_ID,
      triggerRegex: TRIGGER_REGEX,
      versionId: published.versionId,
      url: published.url,
    };
  }

  function rollbackGtm() {
    var versionId = PropertiesService.getScriptProperties().getProperty('GTM_ROLLBACK_VERSION');
    if (!versionId) throw new Error('Missing Script Property: GTM_ROLLBACK_VERSION');
    var container = findContainer();
    var versionPath = container.path + '/versions/' + versionId;
    TagManager.Accounts.Containers.Versions.publish(versionPath);
    Logger.log('rolled back GTM to version ' + versionId);
    return { versionId: versionId };
  }

  return {
    MEASUREMENT_ID: MEASUREMENT_ID,
    CONTAINER_PUBLIC_ID: CONTAINER_PUBLIC_ID,
    TRIGGER_REGEX: TRIGGER_REGEX,
    ensureGa4CustomDimensions: ensureGa4CustomDimensions,
    ensureGa4KeyEvents: ensureGa4KeyEvents,
    ensureGtmEventForwarding: ensureGtmEventForwarding,
    rollbackGtm: rollbackGtm,
  };
})();

function ensureGa4CustomDimensions() {
  return Wiring.ensureGa4CustomDimensions();
}

function ensureGa4KeyEvents() {
  return Wiring.ensureGa4KeyEvents();
}

function ensureGtmEventForwarding() {
  return Wiring.ensureGtmEventForwarding();
}

function rollbackGtm() {
  return Wiring.rollbackGtm();
}

function runAllWiring() {
  var dims = ensureGa4CustomDimensions();
  dims.forEach(function (d) {
    Logger.log('summary dimension ' + d.name + '=' + d.status);
  });
  var keys = ensureGa4KeyEvents();
  keys.forEach(function (k) {
    Logger.log('summary keyEvent ' + k.eventName + '=' + k.status);
  });
  var gtm = ensureGtmEventForwarding();
  Logger.log('summary gtm version=' + gtm.versionId + ' url=' + gtm.url);
  return { dimensions: dims, keyEvents: keys, gtm: gtm };
}
