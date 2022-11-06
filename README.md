# parsecurrency
![Build Status](https://github.com/mktj/parsecurrency/actions/workflows/test.yml/badge.svg)
[![npm version](http://img.shields.io/npm/v/parsecurrency.svg?style=flat)](https://npmjs.org/package/parsecurrency "View this project on npm")


Node / browser currency parser.

Extensive currency parsing utility designed to extract value, decimal separator, group separator, currency symbol, iso code and sign from currency string. It should work with most world [currency formats][1] except:
- currencies with 3 decimals
- currency with 2 character group separator (Swaziland Lilangeni)

Works with:
- international currency formatting (SFr 12'345.67 or 10 000,00zł)
- indian number system (₹1,50,000.00)
- parsing CHF Swiss Franc (9'000.00 CHF)
- currency symbols as a prefix / suffix with or without a space
- currency code before or after the value, with or without space
- positive and negative signs (before the currency)

## Install

```
npm i parsecurrency --save
```

## Example

```javascript
const parseCurrency = require('parsecurrency');

const example1 = parseCurrency('$123,456.99USD');
// example1 =>
{
  "raw": "$123,456.99USD",
  "value": 123456.99,
  "integer": "123,456",
  "decimals": ".99",
  "currency": "USD",
  "symbol": "$",
  "decimalSeparator": ".",
  "groupSeparator": ",",
  "sign": ""
}
const example2 = parseCurrency('-¥578,349,027');
// example2 =>
{
  "raw": '-¥578,349,027',
  "value": -578349027,
  "integer": '-578,349,027',
  "decimals": '',
  "currency": '',
  "symbol": '¥',
  "decimalSeparator": '',
  "groupSeparator": ',',
  "sign": '-'
}

```
[More examples](./test.js)

[1]: http://www.thefinancials.com/Default.aspx?SubSectionID=curformat
