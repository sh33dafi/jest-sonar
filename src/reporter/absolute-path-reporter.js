const AbstractReporter = require('./abstract-reporter');

class AbsolutePathReporter extends AbstractReporter {
    constructor(rootDir) {
        super(rootDir);
    }

    mapFilePath(filePath) {
        return filePath;
    }
}

module.exports = AbsolutePathReporter;
