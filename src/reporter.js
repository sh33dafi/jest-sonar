const path = require('path');

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
                    duration: testCase.duration,
                    failures: testCase.failureMessages
                };
            })
        }));

        return this.render(testResults);
    }

    render(results) {
        let render = ['<testExecutions version="1">'];

        results.forEach(testFile => {
            const buildTestCase = testCase =>
                `<testCase name="${testCase.name}" duration="${testCase.duration}"`;
            const buildFailure = failure =>
                `<failure message="Error"><![CDATA[${failure}]]></failure>`;
            const buildFile = testFile => `<file path="${testFile.path}">`;

            render.push(buildFile(testFile));
            testFile.testCases.forEach(testCase => {
                if (!testCase.failures || testCase.failures.length === 0) {
                    render.push(`${buildTestCase(testCase)} />`);
                } else {
                    render.push(`${buildTestCase(testCase)}>`);
                    render.push(testCase.failures.map(buildFailure));
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
