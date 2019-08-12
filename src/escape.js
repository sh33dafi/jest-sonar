const map = {
    '>': '&gt;',
    '<': '&lt;',
    "'": '&apos;',
    '"': '&quot;',
    '&': '&amp;'
};

module.exports = function(value) {
    if (value === null || value === undefined) return;

    return value.replace(new RegExp('([&"<>\'])', 'g'), (str, item) => {
        return map[item];
    });
};
