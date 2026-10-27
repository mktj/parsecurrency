var assert = require('assert');
var parseCurrency = require('./index');

// node:test is only available on newer Node versions; fall back to a minimal
// runner so the same suite can verify the library on old Node releases too.
var nodeTest;
try { nodeTest = require('node:test'); } catch (e) { nodeTest = null; }
var describe = nodeTest ? nodeTest.describe : function (name, fn) {
  console.log(name);
  fn();
};
var it = nodeTest ? nodeTest.it : function (name, fn) {
  try {
    fn();
    console.log('  ok - ' + name);
  } catch (e) {
    console.log('  not ok - ' + name + '\n' + e.stack);
    process.exitCode = 1;
  }
};

describe('utils/parseCurrency', function () {
  it('should parse simple currency strings', function () {
    assert.deepStrictEqual(parseCurrency('100'), {
      raw: '100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });
  });

  it('should parse strings with currency symbol', function () {
    assert.deepStrictEqual(parseCurrency('$100'), {
      raw: '$100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('100$'), {
      raw: '100$',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });
  });

  it('should parse strings with currency ISO code', function () {
    assert.deepStrictEqual(parseCurrency('160,000.00 EUR'), {
      raw: '160,000.00 EUR',
      value: 160000.00,
      integer: '160,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('100 USD'), {
      raw: '100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('USD 100'), {
      raw: 'USD 100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('$100 USD'), {
      raw: '$100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('USD $100'), {
      raw: 'USD $100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });
  });

  it('should parse large numbers with an optional thousands separator', function () {
    assert.deepStrictEqual(parseCurrency('100000000'), {
      raw: '100000000',
      value: 100000000,
      integer: '100000000',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('100,000,000'), {
      raw: '100,000,000',
      value: 100000000,
      integer: '100,000,000',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ',',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('€10,000.00 EUR'), {
      raw: '€10,000.00 EUR',
      value: 10000.00,
      integer: '10,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '€',
      decimalSeparator: '.',
      groupSeparator: ',',
      sign: ''
    });
  });

  it('should work with different kinds of decimal separator', function () {
    assert.deepStrictEqual(parseCurrency('$99.99 USD'), {
      raw: '$99.99 USD',
      value: 99.99,
      integer: '99',
      decimals: '.99',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '.',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('€10.000,00 EUR'), {
      raw: '€10.000,00 EUR',
      value: 10000.00,
      integer: '10.000',
      decimals: ',00',
      currency: 'EUR',
      symbol: '€',
      decimalSeparator: ',',
      groupSeparator: '.',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('PLN 10 000,00zł'), {
      raw: 'PLN 10 000,00zł',
      value: 10000.00,
      integer: '10 000',
      decimals: ',00',
      currency: 'PLN',
      symbol: 'zł',
      decimalSeparator: ',',
      groupSeparator: ' ',
      sign: ''
    });
  });

  it('should work with non breaking space separator', function () {
    assert.deepStrictEqual(parseCurrency('1 234,57 zł'), {
      raw: '1 234,57 zł',
      value: 1234.57,
      integer: '1 234',
      decimals: ',57',
      currency: '',
      symbol: ' zł',
      decimalSeparator: ',',
      groupSeparator: ' ',
      sign: ''
    });
  });

  it('should distinguish decimal / group separator', function () {
    assert.deepStrictEqual(parseCurrency('100,00'), {
      raw: '100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('100,000'), {
      raw: '100,000',
      value: 100000,
      integer: '100,000',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ',',
      sign: ''
    });
  });

  it('should work with real world examples', function () {
    assert.deepStrictEqual(parseCurrency('¥578,349,027'), {
      raw: '¥578,349,027',
      value: 578349027,
      integer: '578,349,027',
      decimals: '',
      currency: '',
      symbol: '¥',
      decimalSeparator: '',
      groupSeparator: ',',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('Fr. 578’349’026.76'), {
      raw: 'Fr. 578’349’026.76',
      value: 578349026.76,
      integer: '578’349’026',
      decimals: '.76',
      currency: '',
      symbol: 'Fr.',
      decimalSeparator: '.',
      groupSeparator: '’',
      sign: ''
    });

    assert.deepStrictEqual(parseCurrency('10\'000 CHF'), {
      raw: '10\'000 CHF',
      value: 10000,
      integer: '10\'000',
      decimals: '',
      currency: 'CHF',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '\'',
      sign: ''
    });
  });

  it('should parse Indian numbering system', function () {
    assert.deepStrictEqual(parseCurrency('₹1,50,000.00'), {
      currency: '',
      decimalSeparator: '.',
      decimals: '.00',
      groupSeparator: ',',
      integer: '1,50,000',
      raw: '₹1,50,000.00',
      symbol: '₹',
      value: 150000,
      sign: ''
    });
  });

  it('should work with leading + trailing spaces', function () {
    assert.deepStrictEqual(parseCurrency(' 100,00 '), {
      raw: '100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: ''
    });
  });

  it('should invalidate non matching number grouping', function () {
    assert.strictEqual(parseCurrency('$ 100,000,0,00.00'), null);
  });

  it('should fail to parse currencies with 3 decimal points (BHD, IQD, JOD, KWD, OMR, TND)', function () {
    assert.strictEqual(parseCurrency('1,234.567'), null);
  });

  it('should fail to parse 2 character group separator (Swaziland, Lilangeni)', function () {
    assert.strictEqual(parseCurrency('1, 000.00'), null);
  });

  it('should not match invalid currency numbers', function () {
    assert.strictEqual(parseCurrency(''), null);
    assert.strictEqual(parseCurrency('1000.0000'), null);
    assert.strictEqual(parseCurrency('10000,00000.00'), null);
    assert.strictEqual(parseCurrency('100,000,00'), null);
    assert.strictEqual(parseCurrency('tea'), null);
    assert.strictEqual(parseCurrency('$ USD 100'), null);
    assert.strictEqual(parseCurrency('IOU'), null);
    assert.strictEqual(parseCurrency('100..00'), null);
    assert.strictEqual(parseCurrency('1,000.000'), null);
    assert.strictEqual(parseCurrency('1,000.000,00'), null);
  });

  it('should work with leading positive sign (+)', function () {
    assert.deepStrictEqual(parseCurrency('+100,00'), {
      raw: '+100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading positive sign (+) + symbol', function () {
    assert.deepStrictEqual(parseCurrency('+R$100,00'), {
      raw: '+R$100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: 'R$',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading positive sign (+) + symbol(US$)', function () {
    assert.deepStrictEqual(parseCurrency('+US$100,00'), {
      raw: '+US$100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: 'US$',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading positive sign (+) + space', function () {
    assert.deepStrictEqual(parseCurrency('+ 100,00'), {
      raw: '+ 100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading space + positive sign (+)', function () {
    assert.deepStrictEqual(parseCurrency(' +100,00'), {
      raw: '+100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading space + positive sign (+) + space', function () {
    assert.deepStrictEqual(parseCurrency(' + 100,00'), {
      raw: '+ 100,00',
      value: 100,
      integer: '100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should work with leading negative sign (-)', function () {
    assert.deepStrictEqual(parseCurrency('-100,00'), {
      raw: '-100,00',
      value: -100,
      integer: '-100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '-'
    });
  });

  it('should work with leading negative sign (-) + symbol', function () {
    assert.deepStrictEqual(parseCurrency('-R$100,00'), {
      raw: '-R$100,00',
      value: -100,
      integer: '-100',
      decimals: ',00',
      currency: '',
      symbol: 'R$',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '-'
    });
  });

  it('should work with leading negative sign (-) + symbol(US$)', function () {
    assert.deepStrictEqual(parseCurrency('-US$100,00'), {
      raw: '-US$100,00',
      value: -100,
      integer: '-100',
      decimals: ',00',
      currency: '',
      symbol: 'US$',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '-'
    });
  });

  it('should work with leading negative sign (-) + space', function () {
    assert.deepStrictEqual(parseCurrency('- 100,00'), {
      raw: '- 100,00',
      value: -100,
      integer: '-100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '-'
    });
  });

  it('should work with negative sign (-) post sybmol space', function () {
    assert.deepStrictEqual(parseCurrency('€ -1,500.00 EUR'), {
      raw: '€ -1,500.00 EUR',
      value: -1500,
      integer: '-1,500',
      decimals: '.00',
      currency: 'EUR',
      symbol: '€',
      decimalSeparator: '.',
      groupSeparator: ',',
      sign: '-'
    });
  });

  it('should work with leading space + negative sign (+) + space', function () {
    assert.deepStrictEqual(parseCurrency(' - 100,00'), {
      raw: '- 100,00',
      value: -100,
      integer: '-100',
      decimals: ',00',
      currency: '',
      symbol: '',
      decimalSeparator: ',',
      groupSeparator: '',
      sign: '-'
    });
  });


  it('should work with real world positive (¥) example', function () {
    assert.deepStrictEqual(parseCurrency('+¥578,349,027'), {
      raw: '+¥578,349,027',
      value: 578349027,
      integer: '578,349,027',
      decimals: '',
      currency: '',
      symbol: '¥',
      decimalSeparator: '',
      groupSeparator: ',',
      sign: '+'
    });
  });

  it('should work with real world negative (¥) example', function () {
    assert.deepStrictEqual(parseCurrency('-¥578,349,027'), {
      raw: '-¥578,349,027',
      value: -578349027,
      integer: '-578,349,027',
      decimals: '',
      currency: '',
      symbol: '¥',
      decimalSeparator: '',
      groupSeparator: ',',
      sign: '-'
    });
  });

  it('should work with real world negative (Fr.) example', function () {
    assert.deepStrictEqual(parseCurrency('-Fr. 578’349’026.76'), {
      raw: '-Fr. 578’349’026.76',
      value: -578349026.76,
      integer: '-578’349’026',
      decimals: '.76',
      currency: '',
      symbol: 'Fr.',
      decimalSeparator: '.',
      groupSeparator: '’',
      sign: '-'
    });
  });

  it('should work with real world positive (Fr.) example', function () {
    assert.deepStrictEqual(parseCurrency('+Fr. 578’349’026.76'), {
      raw: '+Fr. 578’349’026.76',
      value: 578349026.76,
      integer: '578’349’026',
      decimals: '.76',
      currency: '',
      symbol: 'Fr.',
      decimalSeparator: '.',
      groupSeparator: '’',
      sign: '+'
    });
  });

  it('should work with real world negative (CHF) example', function () {
    assert.deepStrictEqual(parseCurrency('-10\'000 CHF'), {
      raw: '-10\'000 CHF',
      value: -10000,
      integer: '-10\'000',
      decimals: '',
      currency: 'CHF',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '\'',
      sign: '-'
    });
  });

  it('should work with real world positive (CHF) example', function () {
    assert.deepStrictEqual(parseCurrency('+10\'000 CHF'), {
      raw: '+10\'000 CHF',
      value: 10000,
      integer: '10\'000',
      decimals: '',
      currency: 'CHF',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '\'',
      sign: '+'
    });
  });

  it('should parse strings with currency symbol (negative)', function () {
    assert.deepStrictEqual(parseCurrency('-$100'), {
      raw: '-$100',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });

    assert.deepStrictEqual(parseCurrency('-100$'), {
      raw: '-100$',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });
  });

  it('should parse strings with currency ISO code (negative)', function () {
    assert.deepStrictEqual(parseCurrency('-160,000.00 EUR'), {
      raw: '-160,000.00 EUR',
      value: -160000.00,
      integer: '-160,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      sign: '-'
    });

    assert.deepStrictEqual(parseCurrency('-100 USD'), {
      raw: '-100 USD',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });

    assert.deepStrictEqual(parseCurrency('-USD 100'), {
      raw: '-USD 100',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });

    assert.deepStrictEqual(parseCurrency('-$100 USD'), {
      raw: '-$100 USD',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });

    assert.deepStrictEqual(parseCurrency('-USD $100'), {
      raw: '-USD $100',
      value: -100,
      integer: '-100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '-'
    });
  });

  
  it('should parse strings with currency symbol (positive)', function () {
    assert.deepStrictEqual(parseCurrency('+$100'), {
      raw: '+$100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });

    assert.deepStrictEqual(parseCurrency('+100$'), {
      raw: '+100$',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should parse strings with currency ISO code (positive)', function () {
    assert.deepStrictEqual(parseCurrency('+160,000.00 EUR'), {
      raw: '+160,000.00 EUR',
      value: 160000.00,
      integer: '160,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      sign: '+'
    });

    assert.deepStrictEqual(parseCurrency('+100 USD'), {
      raw: '+100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });

    assert.deepStrictEqual(parseCurrency('+USD 100'), {
      raw: '+USD 100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });

    assert.deepStrictEqual(parseCurrency('+$100 USD'), {
      raw: '+$100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });

    assert.deepStrictEqual(parseCurrency('+USD $100'), {
      raw: '+USD $100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: '',
      sign: '+'
    });
  });

  it('should parse french number format', function () {
    assert.deepStrictEqual(parseCurrency('1 234,56 $US'), {
      raw: '1 234,56 $US',
      value: 1234.56,
      integer: '1 234',
      decimals: ',56',
      currency: '',
      symbol: ' $US',
      decimalSeparator: ',',
      groupSeparator: ' ',
      sign: ''
    });
  });

  it('should parse brazilian format USD', function () {
    assert.deepStrictEqual(parseCurrency('1 234,56 $ SU'), {
      raw: '1 234,56 $ SU',
      value: 1234.56,
      integer: '1 234',
      decimals: ',56',
      currency: '',
      symbol: ' $ SU',
      decimalSeparator: ',',
      groupSeparator: ' ',
      sign: ''
    });
  });
});
