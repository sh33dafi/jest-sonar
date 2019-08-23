const entities = require('entities');
const stripAnsi = require('strip-ansi');

module.exports = value => {
    if (typeof value !== 'string') return '';
    return entities.encodeXML(stripAnsi(value));
};
