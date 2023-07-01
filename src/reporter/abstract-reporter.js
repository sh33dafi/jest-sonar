const escape = require('./escape');
const fs = require('fs');
const path = require('path');

class AbstractReporter {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    toSonarReport(results) {
        const testResults = results.testResults.map(testResult => ({
            path: this.mapFilePath(this.mapToSource(testResult.testFilePath)),
            testCases: testResult.testResults.map(testCase => {
                return {
                    name: testCase.fullName,
                    duration: `${testCase.duration || 0}`,
                    failures: testCase.failureMessages,
                    status: testCase.status
                };
            })
        }));

        return this.render(testResults);
    }

    mapToSource(filePath) {
        const sourceMapPath = `${filePath}.map`;
        if (!fs.existsSync(sourceMapPath)) {
            return filePath;
        }
        const sourceMap = JSON.parse(fs.readFileSync(sourceMapPath, 'utf-8'));
        const sources = sourceMap.sources.map(source => path.resolve(path.dirname(filePath), source));
        return sources[0];
    }

    mapFilePath(filePath) {
        throw new TypeError(
            'Do not call abstract method mapFilePath from child.'
        );
    }

    render(results) {
        let render = ['<testExecutions version="1">'];

        results.forEach(testFile => {
            const buildFile = testFile => `<file path="${testFile.path}">`;

            render.push(buildFile(testFile));
            this.renderTestCases(testFile, render);
            render.push(`</file>`);
        });
        render.push('</testExecutions>');
        return render.join('\n').trim();
    }

    renderTestCases(testFile, render) {
        const buildTestCase = testCase =>
            `<testCase name="${escape(testCase.name)}" duration="${escape(
                testCase.duration
            )}"`;

        testFile.testCases.forEach(testCase => {
            if (this.successFullTest(testCase)) {
                render.push(`${buildTestCase(testCase)} />`);
            } else {
                this.renderSkippedOrFailedTest(render, testCase);
            }
        });
    }

    renderSkippedOrFailedTest(render, testCase) {
        const buildTestCase = testCase =>
            `<testCase name="${escape(testCase.name)}" duration="${escape(
                testCase.duration
            )}"`;
        const buildFailure = failure =>
            `<failure message="Error"><![CDATA[${escape(failure)}]]></failure>`;

        render.push(`${buildTestCase(testCase)}>`);

        if (this.failedTest(testCase)) {
            render.push(testCase.failures.map(buildFailure));
        }

        if (this.skippedTest(testCase)) {
            render.push(`<skipped message="${escape(testCase.name)}"/>`);
        }

        render.push(`</testCase>`);
    }

    failedTest(testCase) {
        return testCase.failures && testCase.failures.length > 0;
    }

    skippedTest(testCase) {
        return testCase.status === 'pending';
    }

    successFullTest(testCase) {
        return !this.failedTest(testCase) && !this.skippedTest(testCase);
    }
}

module.exports = AbstractReporter;
