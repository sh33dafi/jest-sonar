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
        fs.mkdirSync(path.dirname(fileName), { recursive: true });
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
}

module.exports = JestSonar;
