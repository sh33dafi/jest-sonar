const Reporter = require('./reporter');
const fs = require('fs');
const path = require('path');

const DEFAULT_OPTIONS = {
    outputDirectory: null,
    outputName: 'sonar-report'
};

class JestSonar {

    constructor(globalConfig, options) {
        this.options = this.getOptions(options);
    }

    getOptions(options) {
        return Object.assign({}, DEFAULT_OPTIONS, options);
    }

    onRunComplete(contexts, results) {
        const reporter = new Reporter();
        const report = reporter.toSonarReport(results);
        const fileName = this.getFileName();
        fs.mkdirSync(path.dirname(fileName), { recursive: true });
        fs.writeFileSync(fileName, report);

    }

    getFileName() {
        return path.resolve(this.options.outputDirectory,this.options.outputName);
    }
}

module.exports = JestSonar;
