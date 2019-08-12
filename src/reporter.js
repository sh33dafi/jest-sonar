const path = require('path');
const xml = require('xml');
const escape = require('./escape');

class Reporter {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    toSonarReport(results) {
        const testResults = results.testResults.map(testResult => ({
            path: path.relative(this.rootDir, testResult.testFilePath),
            testCases: testResult.testResults.map(testCase => {
                return {
                    name: testCase.fullName,
                    duration: '' + testCase.duration,
                    failures: testCase.failureMessages,
                    status: testCase.status
                };
            })
        }));

        return this.render(testResults);
    }

    render(results) {
        let render = ['<testExecutions version="1">'];

        function failedTest(testCase) {
            return testCase.failures && testCase.failures.length > 0;
        }

        function skippedTest(testCase) {
            return testCase.status === 'pending';
        }

        function successFullTest(testCase) {
            return !failedTest(testCase) && !skippedTest(testCase);
        }

        results.forEach(testFile => {
            const buildTestCase = testCase =>
                `<testCase name="${escape(testCase.name)}" duration="${escape(
                    testCase.duration
                )}"`;
            const buildFailure = failure =>
                `<failure message="Error"><![CDATA[${failure}]]></failure>`;
            const buildFile = testFile => `<file path="${testFile.path}">`;

            render.push(buildFile(testFile));
            testFile.testCases.forEach(testCase => {
                if (successFullTest(testCase)) {
                    render.push(`${buildTestCase(testCase)} />`);
                } else {
                    render.push(`${buildTestCase(testCase)}>`);

                    if (failedTest(testCase)) {
                        render.push(testCase.failures.map(buildFailure));
                    }

                    if (skippedTest(testCase)) {
                        render.push(`<skipped message="${testCase.name}"/>`);
                    }

                    render.push(`</testCase>`);
                }
            });
            render.push(`</file>`);
        });
        render.push('</testExecutions>');
        return render.join('\n').trim();
    }
}

module.exports = Reporter;
