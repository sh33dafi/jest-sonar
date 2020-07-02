const fs = require('fs');
const path = require('path');
const RelativePathReporter = require('../src/reporter/relative-path-reporter');
const AbsolutePathReporter = require('../src/reporter/absolute-path-reporter');
const JestSonarSpec = require('../src/jest-sonar.js');
jest.mock('fs');
jest.mock('../src/reporter/relative-path-reporter');
jest.mock('../src/reporter/absolute-path-reporter');

const coverageBaseDir = __dirname.replace('__test__', '');

describe('jest-sonar', () => {
    afterEach(() => {
        RelativePathReporter.mockClear();
        fs.existsSync.mockClear();
        fs.mkdirSync.mockClear();
        fs.writeFileSync.mockClear();
    });

    describe('When no options are set ', () => {
        it('should use the default options to generate a report', () => {
            const testResults = {};
            const jestSonar = new JestSonarSpec({}, {});

            fs.existsSync.mockReturnValue(false);

            jestSonar.onRunComplete({}, testResults);

            const mockReporter = RelativePathReporter.mock.instances[0];
            mockReporter.toSonarReport.mockReturnValue('report');
            expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                testResults
            );

            expect(fs.mkdirSync).toHaveBeenLastCalledWith(coverageBaseDir);
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                `${coverageBaseDir}sonar-report.xml`,
                undefined,
                'utf8'
            );
        });
    });

    describe('When the options are changed with a config file ', () => {
        it('should use those options to generate a report', () => {
            const testResults = {};
            const jestSonar = new JestSonarSpec(
                {},
                {
                    outputDirectory: 'coverage',
                    outputName: 'test-report.xml'
                }
            );

            fs.existsSync.mockReturnValue(false);

            jestSonar.onRunComplete({}, testResults);

            const mockReporter = RelativePathReporter.mock.instances[0];
            mockReporter.toSonarReport.mockReturnValue('report');
            expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                testResults
            );

            expect(fs.mkdirSync).toHaveBeenLastCalledWith(
                `${coverageBaseDir}coverage/`
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                `${coverageBaseDir}coverage/test-report.xml`,
                undefined,
                'utf8'
            );
        });
    });

    describe('When the coverageDirectory is passed as parameter', () => {
        it('should use those options to generate a report', () => {
            const testResults = {};
            const jestSonar = new JestSonarSpec({
                coverageDirectory: `${coverageBaseDir}coverage-as-param`
            });

            fs.existsSync.mockReturnValue(false);

            jestSonar.onRunComplete({}, testResults);

            const mockReporter = RelativePathReporter.mock.instances[0];
            mockReporter.toSonarReport.mockReturnValue('report');
            expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                testResults
            );

            expect(fs.mkdirSync).toHaveBeenLastCalledWith(
                `${coverageBaseDir}coverage-as-param/`
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                `${coverageBaseDir}coverage-as-param/sonar-report.xml`,
                undefined,
                'utf8'
            );
        });
    });

    describe('When reportedFilePath is set', () => {
        const testResults = {};
        beforeEach(() => {
            fs.existsSync.mockReturnValue(false);
        });

        describe('Given the option is set to absolute', () => {
            it('should use an the absolute path reporter options to generate a report', () => {
                const jestSonar = new JestSonarSpec(
                    {},
                    {
                        reportedFilePath: 'absolute'
                    }
                );

                jestSonar.onRunComplete({}, testResults);

                const mockReporter = AbsolutePathReporter.mock.instances[0];
                mockReporter.toSonarReport.mockReturnValue('report');
                expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                    testResults
                );
            });
        });

        describe('Given the option is set to relative', () => {
            it('should use an the relative path reporter options to generate a report', () => {
                const jestSonar = new JestSonarSpec(
                    {},
                    {
                        reportedFilePath: 'relative'
                    }
                );
                jestSonar.onRunComplete({}, testResults);

                const mockReporter = RelativePathReporter.mock.instances[0];
                mockReporter.toSonarReport.mockReturnValue('report');
                expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                    testResults
                );
            });
        });

        describe('Given the option is set to an unkown value', () => {
            it('should use the relative path reporter', () => {
                const jestSonar = new JestSonarSpec(
                    {},
                    {
                        reportedFilePath: 'foo'
                    }
                );
                jestSonar.onRunComplete({}, testResults);

                const mockReporter = RelativePathReporter.mock.instances[0];
                mockReporter.toSonarReport.mockReturnValue('report');
                expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                    testResults
                );
            });
        });
    });
});
