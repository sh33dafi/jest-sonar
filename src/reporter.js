const Mustache = require('Mustache');
const template = require('./template');
const path = require('path');

class Reporter {
    constructor(rootDir){
        this.rootDir = rootDir;
    }

    toSonarReport(results) {
        const testResults = {testResults:results.testResults.map(testResult => ({
            path : path.relative(this.rootDir, testResult.testFilePath),
            testCases: testResult.testResults.map(testCase => ({
                name: testCase.fullName,
                duration: testCase.duration
            }))
        }))};

        return Mustache.render(template, testResults).trim();
    }
}

module.exports = Reporter;
