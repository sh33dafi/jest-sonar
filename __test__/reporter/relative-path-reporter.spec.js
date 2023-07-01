const fs = require('fs');
const RelativePathReporter = require('../../src/reporter/relative-path-reporter');
const { existsSync, readFileSync } = fs;

describe('RelativePathReporter', () => {
    let reporter;
    let existsSyncSpy;
    let readFileSyncSpy;

    beforeEach(() => {
        reporter = new RelativePathReporter('/the/root');
        existsSyncSpy = jest.spyOn(fs, 'existsSync');
        readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    });

    afterEach(() => {
        existsSyncSpy.mockRestore();
        readFileSyncSpy.mockRestore();
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
                    }
                ]
            };

            expect(reporter.toSonarReport(testResults)).toMatchSnapshot();
        });

        test('should map to the source file if a sourcemap was found', () => {
            existsSyncSpy.mockImplementation(
                filename =>
                    filename === '/the/root/lib/my-test/my-test.spec.js.map' ||
                    existsSync(filename)
            );
            readFileSyncSpy.mockImplementation(filename =>
                filename === '/the/root/lib/my-test/my-test.spec.js.map'
                    ? JSON.stringify({
                          sources: ['../../src/my-test/my-test.spec.ts']
                      })
                    : readFileSync(filename)
            );
            const testResults = {
                testResults: [
                    {
                        testFilePath: `/the/root/lib/my-test/my-test.spec.js`,
                        testResults: [
                            {
                                fullName: 'When doing this should "be" ok',
                                duration: 30,
                                failureMessages: []
                            }
                        ]
                    }
                ]
            };

            expect(reporter.toSonarReport(testResults)).toMatchSnapshot();
        });
    });
});
