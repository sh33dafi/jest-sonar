# jest-sonar

jest-sonar is a custom test reporter for [Jest](https://jestjs.io/).
It converts the generated report into Sonar's [Generic Execution format](https://docs.sonarqube.org/latest/analysis/generic-test/#header-2).

[![Build Status](https://travis-ci.org/sh33dafi/jest-sonar.svg?branch=master)](https://travis-ci.org/sh33dafi/jest-sonar)
[![Maintainability](https://api.codeclimate.com/v1/badges/5d705f505c5aeca0a732/maintainability)](https://codeclimate.com/github/sh33dafi/jest-sonar/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5d705f505c5aeca0a732/test_coverage)](https://codeclimate.com/github/sh33dafi/jest-sonar/test_coverage)

## Installation

Using yarn:
```bash
$ yarn install -D jest-sonar
```

Using npm:
```bash
$ npm i -D jest-sonar
```

## Configuration

Configure Jest in your `jest.config` file and add `jest-sonar` to the list of reporters.
```javascript
module.exports = {
    ...
    reporters: ['default',  'jest-sonar'],
    ...
};

```

### Customize the reporter

The following options can be set to customize the reporter:

 | Option          | Description                                         | Default               |
 |-----------------|-----------------------------------------------------|-----------------------|
 | outputDirectory | The directory to which the report should be written | The projects root dir |
 | outputName      | The name of the report                              | sonar-report.xml      |
 
 You can set these options when defining the reporter in `jest.config`:
 
 ```javascript
 module.exports = {
     ...
     reporters: ['default',  ['jest-sonar', {
         outputDirectory: 'my/custom/directory',
         outputName: 'my-new-report-name.xml'
     }]],
     ...
 };

 ```

## Contribution

[Contribution guidelines for this project](CONTRIBUTING.md)

Contributions to this project are welcome, either by submitting bug reports, submitting feature requests or submitting pull requests.

### Creating a pull request 
1. Fork the repo on GitHub
2. Clone and make changes on your own machine
3. Commit and Push the changes to your fork
4. Submit a Pull request so that we can review your changes

NOTE: Be sure to merge the latest change from "upstream" before making a pull request!

## Licence

This project uses the [MIT](LICENSE) licence.
