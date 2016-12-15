# parsecurrency
[![Build Status](https://travis-ci.org/mktj/parsecurrency.svg?branch=master)](https://travis-ci.org/mktj/parsecurrency)

Node / browser currency parser.

## Install

```
npm i parsecurrency --save
```

## Usage

```js
const parseCurrency = require('parsecurrency');

const parsedCurrency = parseCurrency('$123,456.99USD');
// parsedCurrency =>
{
  "raw": "$123,456.99USD",
  "value": 123456.99,
  "integer": "123,456",
  "decimals": ".99",
  "currency": "USD",
  "symbol": "$",
  "decimalSeparator": ".",
  "groupSeparator": ","
}

```
