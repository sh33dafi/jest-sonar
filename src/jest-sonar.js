const Reporter = require('./reporter');
const fs = require('fs');

class JestSonar {

    constructor(globalConfig, options) {
        this.globalConfig = globalConfig;
        this.options = options;
    }

    onRunComplete(contexts, results) {
        const reporter = new Reporter();
        const report = reporter.toSonarReport(results);
        fs.writeFileSync('sonar.xml', report);
    };
}

module.exports = JestSonar;
