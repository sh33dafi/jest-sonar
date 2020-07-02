const AbstractReporter = require('./abstract-reporter');
const path = require('path');

class RelativePathReporter extends AbstractReporter {
    constructor(rootDir) {
        super(rootDir);
    }

    mapFilePath(filePath) {
        return path.relative(this.rootDir, filePath);
    }
}

module.exports = RelativePathReporter;
