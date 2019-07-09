const Sqrl = require('Squirrelly');
const template = require('./template');
const path = require('path');

class Reporter {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    toSonarReport(results) {
        const testResults = {
            testResults: results.testResults.map(testResult => ({
                path: path.relative(this.rootDir, testResult.testFilePath),
                testCases: testResult.testResults.map(testCase => {
                    return {
                        name: testCase.fullName,
                        duration: testCase.duration,
                        failures: testCase.failureMessages
                    };
                })
            }))
        };

        return Sqrl.Render(template, testResults).trim();
    }
}

module.exports = Reporter;
