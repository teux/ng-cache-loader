var loaderUtils = require("loader-utils");

module.exports = function () {
    var query = loaderUtils.parseQuery(this.query),
        resource = this.resource.split('/'),
        fileName = resource.pop(),
        prefix,
        dir,
        i;

    if (!query.prefix) {
        return fileName;
    }
    resource.reverse();
    prefix = query.prefix.split('/');
    i = prefix.length;
    while (i--) {
        dir = prefix.pop();
        if (dir !== '[dir]') {
            resource[0] = dir;
        }
        dir = resource.shift();
        if (dir || !i) {
            prefix.unshift(dir);
        }
    }
    prefix.push(fileName);
    return prefix.join('/');
};
