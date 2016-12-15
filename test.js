/* eslint-env mocha */
const expect = require('chai').expect;
const parseCurrency = require('./index');

describe('utils/parseCurrency', () => {
  it('should parse simple currency strings', () => {
    expect(parseCurrency('100')).to.deep.equal({
      raw: '100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ''
    });
  });

  it('should parse strings with currency symbol', () => {
    expect(parseCurrency('$100')).to.deep.equal({
      raw: '$100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: ''
    });

    expect(parseCurrency('100$')).to.deep.equal({
      raw: '100$',
      value: 100,
      integer: '100',
      decimals: '',
      currency: '',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: ''
    });
  });

  it('should parse strings with currency iso code', () => {
    expect(parseCurrency('160,000.00 EUR')).to.deep.equal({
      raw: '160,000.00 EUR',
      value: 160000.00,
      integer: '160,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '',
      decimalSeparator: '.',
      groupSeparator: ','
    });

    expect(parseCurrency('100 USD')).to.deep.equal({
      raw: '100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ''
    });

    expect(parseCurrency('USD 100')).to.deep.equal({
      raw: 'USD 100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ''
    });

    expect(parseCurrency('$100 USD')).to.deep.equal({
      raw: '$100 USD',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: ''
    });

    expect(parseCurrency('USD $100')).to.deep.equal({
      raw: 'USD $100',
      value: 100,
      integer: '100',
      decimals: '',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '',
      groupSeparator: ''
    });
  });

  it('should parse large numbers with an optional thousands separator', () => {
    expect(parseCurrency('100000000')).to.deep.equal({
      raw: '100000000',
      value: 100000000,
      integer: '100000000',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ''
    });

    expect(parseCurrency('100,000,000')).to.deep.equal({
      raw: '100,000,000',
      value: 100000000,
      integer: '100,000,000',
      decimals: '',
      currency: '',
      symbol: '',
      decimalSeparator: '',
      groupSeparator: ','
    });

    expect(parseCurrency('€10,000.00 EUR')).to.deep.equal({
      raw: '€10,000.00 EUR',
      value: 10000.00,
      integer: '10,000',
      decimals: '.00',
      currency: 'EUR',
      symbol: '€',
      decimalSeparator: '.',
      groupSeparator: ','
    });
  });

  it('should work with different kinds of decimal separator', () => {
    expect(parseCurrency('$99.99 USD')).to.deep.equal({
      raw: '$99.99 USD',
      value: 99.99,
      integer: '99',
      decimals: '.99',
      currency: 'USD',
      symbol: '$',
      decimalSeparator: '.',
      groupSeparator: ''
    });

    expect(parseCurrency('€10.000,00 EUR')).to.deep.equal({
      raw: '€10.000,00 EUR',
      value: 10000.00,
      integer: '10.000',
      decimals: ',00',
      currency: 'EUR',
      symbol: '€',
      decimalSeparator: ',',
      groupSeparator: '.'
    });

    expect(parseCurrency('PLN 10 000,00zł')).to.deep.equal({
      raw: 'PLN 10 000,00zł',
      value: 10000.00,
      integer: '10 000',
      decimals: ',00',
      currency: 'PLN',
      symbol: 'zł',
      decimalSeparator: ',',
      groupSeparator: ' '
    });
  });

  it('should work with real world examples', () => {
    expect(parseCurrency('¥578,349,027')).to.deep.equal({
      raw: '¥578,349,027',
      value: 578349027,
      integer: '578,349,027',
      decimals: '',
      currency: '',
      symbol: '¥',
      decimalSeparator: '',
      groupSeparator: ','
    });

    expect(parseCurrency('Fr. 578’349’026.76')).to.deep.equal({
      raw: 'Fr. 578’349’026.76',
      value: 578349026.76,
      integer: '578’349’026',
      decimals: '.76',
      currency: '',
      symbol: 'Fr.',
      decimalSeparator: '.',
      groupSeparator: '’'
    });
  });

  it('should parse indian numbering system', () => {
    expect(parseCurrency('₹1,50,000')).to.deep.equal({
      currency: '',
      decimalSeparator: '',
      decimals: '',
      groupSeparator: ',',
      integer: '1,50,000',
      raw: '₹1,50,000',
      symbol: '₹',
      value: 150000
    });
  });

  it('shoud not match invalid currency numbers', () => {
    expect(parseCurrency('')).to.equal(null);
    expect(parseCurrency('1000.0000')).to.equal(null);
    expect(parseCurrency('10000,00000.00')).to.equal(null);
    expect(parseCurrency('100,000,00')).to.equal(null);
    expect(parseCurrency('tea')).to.equal(null);
    expect(parseCurrency('$ USD 100')).to.equal(null);
    expect(parseCurrency('IOU')).to.equal(null);
    expect(parseCurrency('100..00')).to.equal(null);
    expect(parseCurrency('1,000.000')).to.equal(null);
    expect(parseCurrency('1,000.000,00')).to.equal(null);
  });
});
