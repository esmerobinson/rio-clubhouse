var SHEET_NAME = 'Responses';

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();
    appendRow(sheet, payload);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e.parameter && e.parameter.action === 'getAll') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var headers = data[0];
    var rows = data.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    writeHeaders(sheet);
  }
  return sheet;
}

var COLUMNS = [
  'Timestamp','Name','Email','Location','Work Setup',
  'Investment','Tier Fairness','Priority','Neighbourhood','Real Constraint',
  'PTO','Workcation','Work Needs','Stay Length','Nights','Buy Days',
  'Usage','Season','Hesitation','Questions','Commitment',
  'Feature: Walking distance to the beach','Feature: Sea or beach view',
  'Feature: Pool access','Feature: Large terrace / outdoor space',
  'Feature: Fast, reliable WiFi','Feature: Dedicated desk / workspace',
  'Feature: Quiet space for calls','Feature: Doorman / portaria',
  'Feature: Air conditioning throughout','Feature: Modern / renovated fit-out',
  'Feature: High-end kitchen','Feature: Parking',
  'Feature: No restrictive HOA / rental rules','Feature: Lift / elevator access'
];

function writeHeaders(sheet) {
  sheet.appendRow(COLUMNS);
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function appendRow(sheet, p) {
  var features = p.features || {};

  function arr(v) {
    return Array.isArray(v) ? v.join(', ') : (v || '');
  }

  var row = [
    p.timestamp, p.name, p.email, p.location, p.work_setup,
    p.investment, p.tier_fairness, p.priority, p.neighbourhood, p.real_constraint,
    p.pto, p.workcation, arr(p.work_needs), p.stay_length, p.nights, p.buy_days,
    arr(p.usage), arr(p.season), p.hesitation, p.questions, p.commitment,
    features['Walking distance to the beach'], features['Sea or beach view'],
    features['Pool access'], features['Large terrace / outdoor space'],
    features['Fast, reliable WiFi'], features['Dedicated desk / workspace'],
    features['Quiet space for calls'], features['Doorman / portaria'],
    features['Air conditioning throughout'], features['Modern / renovated fit-out'],
    features['High-end kitchen'], features['Parking'],
    features['No restrictive HOA / rental rules'], features['Lift / elevator access']
  ].map(function(v) { return v === undefined ? '' : v; });

  sheet.appendRow(row);
}
