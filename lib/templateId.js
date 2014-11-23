/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Andrey Koperskiy @teux
 */
var loaderUtils = require("loader-utils");
var path = require('path');

module.exports = function () {
    var query = loaderUtils.parseQuery(this.query),
        resource = this.resource.split(path.sep),
        fileName = resource.pop(),
        prefix,
        dir,
        i;

    if (!query.prefix) {
        return fileName;
    }
    resource.reverse();
    prefix = query.prefix.split(path.sep);
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
