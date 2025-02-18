var currencyMatcher = /^(?:([-+]{1}) ?)?(?:([A-Z]{3}) ?)?(?:([^\d ]+?) ?)?(?:([-+]{1}) ?)?(((?:\d{1,3}([,. ’'\u00A0\u202F]))*?\d{1,})(([,.])\d{1,2})?)(?: ?([^\d]+?))??(?: ?([A-Z]{3}))?$/;
var gr = /^\d{1,3}([,. ’'\u00A0\u202F]\d{3})*$/; // validate groups
var ind = /^\d{1,2}(,\d{2})*(,\d{3})?$/; // exception for Indian number format

module.exports = function parseCurrency(priceStr) {
  if (!priceStr || !priceStr.match) return null;
  priceStr = priceStr.trim();
  var match = priceStr.match(currencyMatcher);
  if (!match) return null;
  var groupSeparator = match[7] || '';
  var decimalSeparator = match[9] || '';
  if (groupSeparator === decimalSeparator && decimalSeparator) {
    return null;
  }
  var isNeg = match[1] === '-' || match[4] === '-';
  var integer = isNeg ? '-' + match[6] : match[6];
  if (groupSeparator && !match[6].match(gr) && !match[6].match(ind)) {
    return null;
  }
  var value = match[5];
  if (!value) return null;
  if (groupSeparator) {
    value = value.replace(RegExp('\\' + groupSeparator, 'g'), '');
  }
  if (decimalSeparator) {
    value = value.replace(decimalSeparator, '.');
  }
  var numericVal = isNeg ? value * -1 : +value;
  if (typeof numericVal !== 'number' || isNaN(numericVal)) {
    return null;
  }
  return {
    raw: priceStr,
    value: numericVal,
    integer: integer || '',
    decimals: match[8] || '',
    currency: match[2] || match[11] || '',
    symbol: match[3] || match[10] || '',
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    sign: match[1] || match[4] || ''
  };
};
