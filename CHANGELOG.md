# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2026-10-27

### Added

- LICENSE file to the published package (license remains MIT)

### Changed

- Dev dependency updates
- Dropped dependency on mocha/chai, replaced with node builtins `assert` and `node:test`, CI now tests on node 4+

## [1.1.1] - 2025-02-18

### Added

- Support for positive/negative between currency symbol and integer value https://github.com/mktj/parsecurrency/pull/13

### Changed

- Dev dependency updates

## [1.1.0] - 2022-11-06

### Added

- Support for positive/negative number prefix https://github.com/mktj/parsecurrency/pull/11
- Support for french number format (narrow no-break space group separator)
- Support for brazilian format

### Changed

- Dev dependency updates

## [1.0.1] - 2021-11-17

### Changed

- Dev dependency updates

### Fixed

- Parse currency strings with trailing spaces https://github.com/mktj/parsecurrency/pull/7

## [1.0.0] - 2019-07-11

### Added

- Stable release of parseCurrency
