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
      groupSeparator: '',
      sign: ''
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
      groupSeparator: '',
      sign: ''
    });

    expect(parseCurrency('100$')).to.deep.equal({
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

  it('should parse strings with currency ISO code', () => {
    expect(parseCurrency('160,000.00 EUR')).to.deep.equal({
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

    expect(parseCurrency('100 USD')).to.deep.equal({
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

    expect(parseCurrency('USD 100')).to.deep.equal({
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

    expect(parseCurrency('$100 USD')).to.deep.equal({
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

    expect(parseCurrency('USD $100')).to.deep.equal({
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

  it('should parse large numbers with an optional thousands separator', () => {
    expect(parseCurrency('100000000')).to.deep.equal({
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

    expect(parseCurrency('100,000,000')).to.deep.equal({
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

    expect(parseCurrency('€10,000.00 EUR')).to.deep.equal({
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

  it('should work with different kinds of decimal separator', () => {
    expect(parseCurrency('$99.99 USD')).to.deep.equal({
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

    expect(parseCurrency('€10.000,00 EUR')).to.deep.equal({
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

    expect(parseCurrency('PLN 10 000,00zł')).to.deep.equal({
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

  it('should work with non breaking space separator', () => {
    expect(parseCurrency('1 234,57 zł')).to.deep.equal({
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

  it('should distinguish decimal / group separator', () => {
    expect(parseCurrency('100,00')).to.deep.equal({
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

    expect(parseCurrency('100,000')).to.deep.equal({
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

  it('should work with real world examples', () => {
    expect(parseCurrency('¥578,349,027')).to.deep.equal({
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

    expect(parseCurrency('Fr. 578’349’026.76')).to.deep.equal({
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

    expect(parseCurrency('10\'000 CHF')).to.deep.equal({
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

  it('should parse Indian numbering system', () => {
    expect(parseCurrency('₹1,50,000.00')).to.deep.equal({
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

  it('should work with leading + trailing spaces', () => {
    expect(parseCurrency(' 100,00 ')).to.deep.equal({
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

  it('should invalidate non matching number grouping', () => {
    expect(parseCurrency('$ 100,000,0,00.00')).to.equal(null);
  });

  it('should fail to parse currencies with 3 decimal points (BHD, IQD, JOD, KWD, OMR, TND)', () => {
    expect(parseCurrency('1,234.567')).to.equal(null);
  });

  it('should fail to parse 2 character group separator (Swaziland, Lilangeni)', () => {
    expect(parseCurrency('1, 000.00')).to.equal(null);
  });

  it('should not match invalid currency numbers', () => {
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

  it('should work with leading positive sign (+)', () => {
    expect(parseCurrency('+100,00')).to.deep.equal({
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

  it('should work with leading positive sign (+) + symbol', () => {
    expect(parseCurrency('+R$100,00')).to.deep.equal({
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

  it('should work with leading positive sign (+) + symbol(US$)', () => {
    expect(parseCurrency('+US$100,00')).to.deep.equal({
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

  it('should work with leading positive sign (+) + space', () => {
    expect(parseCurrency('+ 100,00')).to.deep.equal({
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

  it('should work with leading space + positive sign (+)', () => {
    expect(parseCurrency(' +100,00')).to.deep.equal({
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

  it('should work with leading space + positive sign (+) + space', () => {
    expect(parseCurrency(' + 100,00')).to.deep.equal({
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

  it('should work with leading negative sign (-)', () => {
    expect(parseCurrency('-100,00')).to.deep.equal({
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

  it('should work with leading negative sign (-) + symbol', () => {
    expect(parseCurrency('-R$100,00')).to.deep.equal({
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

  it('should work with leading negative sign (-) + symbol(US$)', () => {
    expect(parseCurrency('-US$100,00')).to.deep.equal({
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

  it('should work with leading negative sign (-) + space', () => {
    expect(parseCurrency('- 100,00')).to.deep.equal({
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

  it('should work with negative sign (-) post sybmol space', () => {
    expect(parseCurrency('€ -1,500.00 EUR')).to.deep.equal({
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

  it('should work with leading space + negative sign (+) + space', () => {
    expect(parseCurrency(' - 100,00')).to.deep.equal({
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


  it('should work with real world positive (¥) example', () => {
    expect(parseCurrency('+¥578,349,027')).to.deep.equal({
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

  it('should work with real world negative (¥) example', () => {
    expect(parseCurrency('-¥578,349,027')).to.deep.equal({
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

  it('should work with real world negative (Fr.) example', () => {
    expect(parseCurrency('-Fr. 578’349’026.76')).to.deep.equal({
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

  it('should work with real world positive (Fr.) example', () => {
    expect(parseCurrency('+Fr. 578’349’026.76')).to.deep.equal({
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

  it('should work with real world negative (CHF) example', () => {
    expect(parseCurrency('-10\'000 CHF')).to.deep.equal({
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

  it('should work with real world positive (CHF) example', () => {
    expect(parseCurrency('+10\'000 CHF')).to.deep.equal({
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

  it('should parse strings with currency symbol (negative)', () => {
    expect(parseCurrency('-$100')).to.deep.equal({
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

    expect(parseCurrency('-100$')).to.deep.equal({
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

  it('should parse strings with currency ISO code (negative)', () => {
    expect(parseCurrency('-160,000.00 EUR')).to.deep.equal({
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

    expect(parseCurrency('-100 USD')).to.deep.equal({
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

    expect(parseCurrency('-USD 100')).to.deep.equal({
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

    expect(parseCurrency('-$100 USD')).to.deep.equal({
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

    expect(parseCurrency('-USD $100')).to.deep.equal({
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

  
  it('should parse strings with currency symbol (positive)', () => {
    expect(parseCurrency('+$100')).to.deep.equal({
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

    expect(parseCurrency('+100$')).to.deep.equal({
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

  it('should parse strings with currency ISO code (positive)', () => {
    expect(parseCurrency('+160,000.00 EUR')).to.deep.equal({
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

    expect(parseCurrency('+100 USD')).to.deep.equal({
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

    expect(parseCurrency('+USD 100')).to.deep.equal({
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

    expect(parseCurrency('+$100 USD')).to.deep.equal({
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

    expect(parseCurrency('+USD $100')).to.deep.equal({
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

  it('should parse french number format', () => {
    expect(parseCurrency('1 234,56 $US')).to.deep.equal({
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

  it('should parse brazilian format USD', () => {
    expect(parseCurrency('1 234,56 $ SU')).to.deep.equal({
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
