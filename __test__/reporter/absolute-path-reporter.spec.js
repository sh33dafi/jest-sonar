const AbsolutePathReporter = require('../../src/reporter/absolute-path-reporter');

describe('AbsolutePathReporter', () => {
    let reporter;

    beforeEach(() => {
        reporter = new AbsolutePathReporter('/the/root');
    });

    describe('When calling toSonarReport', () => {
        test('should map a test result file to a sonar report', () => {
            const testResults = {
                testResults: [
                    {
                        testFilePath: '/the/root/my-test/my-test.spec.js',
                        testResults: [
                            {
                                fullName: 'When doing this should "be" ok',
                                duration: 30,
                                failureMessages: []
                            },
                            {
                                fullName:
                                    'When this is failing the sonar report should contain the failure',
                                duration: 10,
                                failureMessages: ['A failure']
                            }
                        ]
                    },
                    {
                        testFilePath: '/the/root/my-test/my-test.spec.js',
                        testResults: [
                            {
                                fullName: `Some crazy title with ${String.fromCharCode(
                                    27
                                )}[31;1m red color ${String.fromCharCode(
                                    27
                                )}[0m and 🔥`,
                                duration: 30,
                                failureMessages: []
                            },
                            {
                                fullName:
                                    'When this is failing the sonar report should contain the failure',
                                duration: 10,
                                failureMessages: [
                                    `A crazy failure ${String.fromCharCode(
                                        27
                                    )}[0m and 🔥`
                                ]
                            }
                        ]
                    },
                    {
                        testFilePath: '/the/root/my-second-test.spec.js',
                        testResults: [
                            {
                                fullName: 'When doing this should be ok',
                                duration: 35,
                                failureMessages: []
                            }
                        ]
                    },
                    {
                        testFilePath: '/the/root/my-skipped-test.spec.js',
                        testResults: [
                            {
                                fullName: 'Skipped "this test is skipped"',
                                duration: 10,
                                failureMessages: [],
                                status: 'pending'
                            }
                        ]
                    },
                    {
                        testFilePath: '/the/root/my-skipped-test.spec.js',
                        testResults: [
                            {
                                fullName: 'Skipped "this test is skipped"',
                                duration: null,
                                failureMessages: [],
                                status: 'pending'
                            }
                        ]
                    }
                ]
            };

            expect(reporter.toSonarReport(testResults)).toMatchSnapshot();
        });
    });
});
