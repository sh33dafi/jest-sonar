const stripAnsi = require('strip-ansi');

module.exports = value => {
    if (typeof value !== 'string') return '';
    return stripAnsi(value);
};
