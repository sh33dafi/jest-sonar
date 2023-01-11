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

            const jestSonar = JestSonarBuilder.create().build();

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

            const jestSonar = JestSonarBuilder.create()
                .withOptions({
                    outputDirectory: 'coverage',
                    outputName: 'test-report.xml'
                })
                .build();

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

    describe('When the output directory contains <rootDir>', () => {
        it('should be resolved relative to the jest root directory', () => {
            const testResults = {};

            const jestSonar = JestSonarBuilder.create()
                .withOptions({
                    outputDirectory: '<rootDir>/coverage',
                    outputName: 'test-report.xml'
                })
                .withGlobalConfig({
                    rootDir: coverageBaseDir + 'test-dir'
                })
                .build();

            fs.existsSync.mockReturnValue(false);

            jestSonar.onRunComplete({}, testResults);

            const mockReporter = RelativePathReporter.mock.instances[0];
            mockReporter.toSonarReport.mockReturnValue('report');
            expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                testResults
            );

            expect(fs.mkdirSync).toHaveBeenLastCalledWith(
                `${coverageBaseDir}test-dir/coverage/`
            );
            expect(fs.writeFileSync).toHaveBeenCalledWith(
                `${coverageBaseDir}test-dir/coverage/test-report.xml`,
                undefined,
                'utf8'
            );
        });
    });

    describe('When the coverageDirectory is passed as parameter', () => {
        it('should use those options to generate a report', () => {
            const testResults = {};

            const jestSonar = JestSonarBuilder.create()
                .withGlobalConfig({
                    coverageDirectory: `${coverageBaseDir}coverage-as-param`
                })
                .build();

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
                const jestSonar = JestSonarBuilder.create()
                    .withOptions({
                        reportedFilePath: 'absolute'
                    })
                    .build();

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
                const jestSonar = JestSonarBuilder.create()
                    .withOptions({
                        reportedFilePath: 'relative'
                    })
                    .build();
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
                const jestSonar = JestSonarBuilder.create()
                    .withOptions({
                        reportedFilePath: 'foo'
                    })
                    .build();
                jestSonar.onRunComplete({}, testResults);

                const mockReporter = RelativePathReporter.mock.instances[0];
                mockReporter.toSonarReport.mockReturnValue('report');
                expect(mockReporter.toSonarReport).toHaveBeenCalledWith(
                    testResults
                );
            });
        });
    });

    describe('When the options are overriden with a env options', () => {
        it('should use those options to generate a report', () => {
            const testResults = {};

            process.env['JEST_SONAR_OUTPUT_DIR'] = 'coverage';
            process.env['JEST_SONAR_OUTPUT_NAME'] = 'test-report-env.xml';

            const jestSonar = JestSonarBuilder.create().build();

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
                `${coverageBaseDir}coverage/test-report-env.xml`,
                undefined,
                'utf8'
            );
        });
    });
});

class JestSonarBuilder {
    constructor() {
        this.options = {};
        this.globalConfig = {};
    }

    static create() {
        return new JestSonarBuilder();
    }

    withOptions(options) {
        this.options = options;
        return this;
    }

    withGlobalConfig(globalConfig) {
        this.globalConfig = globalConfig;
        return this;
    }

    build() {
        return new JestSonarSpec(this.globalConfig, this.options);
    }
}
