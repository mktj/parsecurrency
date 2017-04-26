var currencyMatcher = /^(?:([A-Z]{3}) ?)?(?:([^\d ]+?) ?)?(((?:\d{1,3}([,. ’]))*?\d{1,})(([,.])\d{1,2})?)(?: ?([^\d ]+?))??(?: ?([A-Z]{3}))?$/;
var gr = /^\d{1,3}([,. ’]\d{3})*$/; // validate groups
var ind = /^\d{1,2}(,\d{2})*(,\d{3})?$/; // exception for indina number format

module.exports = function parseCurrency (priceStr) {
  if (!priceStr || !priceStr.match) return null;
  var match = priceStr.match(currencyMatcher);
  if (!match) return null;
  var groupSeparator = match[5] || '';
  var decimalSeparator = match[7] || '';
  if (groupSeparator === decimalSeparator && decimalSeparator) {
    return null;
  }
  var integer = match[4];
  if (groupSeparator && !integer.match(gr) && !integer.match(ind)) {
    return null;
  }
  var value = match[3];
  if (!value) return null;
  if (groupSeparator) {
    value = value.replace(RegExp('\\' + groupSeparator, 'g'), '');
  }
  if (decimalSeparator) {
    value = value.replace(decimalSeparator, '.');
  }
  var numericVal = +value;
  if (typeof numericVal !== 'number' || isNaN(numericVal)) {
    return null;
  }
  return {
    raw: priceStr,
    value: numericVal,
    integer: integer || '',
    decimals: match[6] || '',
    currency: match[1] || match[9] || '',
    symbol: match[2] || match[8] || '',
    decimalSeparator: decimalSeparator,
    groupSeparator: groupSeparator
  };
};
