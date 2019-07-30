const Reporter = require('./reporter');
const fs = require('fs');
const path = require('path');

const DEFAULT_OPTIONS = {
    outputDirectory: '',
    outputName: 'sonar-report.xml'
};

class JestSonar {
    constructor(globalConfig, options) {
        this.config = this.getConfig(globalConfig);
        this.options = this.getOptions(options);
    }

    onTestResult(contexts, info, results) {
        const rootDir =
            contexts.context.config.cwd || this.config.rootDir || '';
        const reporter = new Reporter(rootDir);
        this.report = reporter.toSonarReport(results);
    }

    onRunComplete() {
        const fileName = this.getFileName();
        this.createDirectory(path.dirname(fileName));
        fs.writeFileSync(fileName, this.report, 'utf8');
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

    getOptions(options) {
        return Object.assign({}, DEFAULT_OPTIONS, options);
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
