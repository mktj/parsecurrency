var currencyMatcher = /^(?:([-+]{1}) ?)?(?:([A-Z]{3}) ?)?(?:([^\d ]+?) ?)?(((?:\d{1,3}([,. ’'\u00A0\u202F]))*?\d{1,})(([,.])\d{1,2})?)(?: ?([^\d]+?))??(?: ?([A-Z]{3}))?$/;
var gr = /^\d{1,3}([,. ’'\u00A0\u202F]\d{3})*$/; // validate groups
var ind = /^\d{1,2}(,\d{2})*(,\d{3})?$/; // exception for Indian number format

module.exports = function parseCurrency(priceStr) {
  if (!priceStr || !priceStr.match) return null;
  priceStr = priceStr.trim();
  var match = priceStr.match(currencyMatcher);
  if (!match) return null;
  var groupSeparator = match[6] || '';
  var decimalSeparator = match[8] || '';
  if (groupSeparator === decimalSeparator && decimalSeparator) {
    return null;
  }
  var integer = match[1] === '-' ? '-' + match[5] : match[5];
  if (groupSeparator && !match[5].match(gr) && !match[5].match(ind)) {
    return null;
  }
  var value = match[4];
  if (!value) return null;
  if (groupSeparator) {
    value = value.replace(RegExp('\\' + groupSeparator, 'g'), '');
  }
  if (decimalSeparator) {
    value = value.replace(decimalSeparator, '.');
  }
  var numericVal = match[1] === '-' ? value * -1 : +value;
  if (typeof numericVal !== 'number' || isNaN(numericVal)) {
    return null;
  }
  return {
    raw: priceStr,
    value: numericVal,
    integer: integer || '',
    decimals: match[7] || '',
    currency: match[2] || match[10] || '',
    symbol: match[3] || match[9] || '',
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator,
    sign: match[1] || ''
  };
};
