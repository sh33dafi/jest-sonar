const Reporter = require('../src/reporter');

describe('reporter', () => {
    let reporter;

    beforeEach(() => {
        reporter = new Reporter('/the/root');
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
                    }
                ]
            };

            expect(reporter.toSonarReport(testResults)).toMatchSnapshot();
        });
    });
});
