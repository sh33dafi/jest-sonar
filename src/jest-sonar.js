const fs = require('fs');
const path = require('path');

const REPORTED_FILEPATH_RELATIVE = 'relative';
const REPORTED_FILEPATH_ABSOLUTE = 'absolute';

class JestSonar {
    constructor(globalConfig, options) {
        this.config = this.getConfig(globalConfig);
        this.options = this.getOptions(options, this.config);
    }

    onRunComplete(contexts, results) {
        let Reporter;
        if (this.options.reportedFilePath === REPORTED_FILEPATH_ABSOLUTE) {
            Reporter = require('./reporter/absolute-path-reporter');
        } else {
            Reporter = require('./reporter/relative-path-reporter');
        }

        const reporter = new Reporter(this.config.rootDir || '');
        const fileName = this.getFileName();
        this.createDirectory(path.dirname(fileName));
        fs.writeFileSync(fileName, reporter.toSonarReport(results), 'utf8');
    }

    getFileName() {
        return path.resolve(
            this.options.outputDirectory,
            this.options.outputName
        );
    }

    getConfig(config) {
        return Object.assign({}, config);
    }

    getOptions(options, config) {
        const mergedOptions = Object.assign(
            {},
            {
                outputName: 'sonar-report.xml',
                outputDirectory: config.coverageDirectory || '',
                reportedFilePath: REPORTED_FILEPATH_RELATIVE
            },
            options
        );
        return mergedOptions;
    }

    createDirectory(pathToCreate) {
        pathToCreate.split(path.sep).reduce((prevPath, folder) => {
            const currentPath = path.join(prevPath, folder, path.sep);
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
    }
}

module.exports = JestSonar;
