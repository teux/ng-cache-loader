/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var loaderUtils = require("loader-utils");

function stripEnding(filename)
{
   return filename.replace(/\.[^/.]+$/, "");
}

module.exports = function () {
    var sep = '/';
    var rootSep = ':';
    var dirPh = ['*', '[dir]'];
    var dirsPh = ['**', '[dirs]'];

    var query = loaderUtils.parseQuery(this.query);
    var pref = query.prefix || '';
    var stripEndings = query.stripEndings || false;
    var path = this.resource;
    var root, file, dir, isAbsolute, i;
    // Change separators to unix style
    pref = pref.replace(/\\/g, sep);
    path = path.replace(/\\/g, sep);

    // No prefix defined - return file name
    if (!pref) {
        if(stripEndings) {
           return stripEnding(path.split(sep).pop());
        }
        else {
           return path.split(sep).pop();
        }
    }

    // Strip root from path and pref
    if (~pref.indexOf(rootSep)) {
        root = pref.split(rootSep);
        pref = root.pop();
        root = root.join(rootSep);
        path = path.split(root).pop().replace(/^\//, '');
    }

    // Split and reverse path, get file name
    path = path.split(sep);
    // Remove first empty chunk
    if (!path[0]) {
        path.shift();
    }
    path.reverse();
    file = path.shift();
    if (stripEndings === true)
    {
       file = stripEnding(file)
    }

    // Split prefix and replace `[dirs]` by `**` for consistency
    pref = pref.split(sep).map(function (dir) {
        return ~dirsPh.indexOf(dir) ? dirsPh[0] : dir;
    });

    // Remove empty first chunk if prefix starts with slash
    if (!pref[0]) {
        isAbsolute = true;
        pref.shift();
    }
    // Remove empty last chunk if prefix ends with slash
    if (!pref[pref.length - 1]) {
        pref.pop();
    }

    // Replace `**` by a number of `*` in accordance with the path length
    pref = pref.reduce(function (res, dir, i) {
        var n = 1;

        if (dir === dirsPh[0]) {
            // extend only first appearance
            if (pref.indexOf(dir) === i) {
                n += Math.max(0, path.length - pref.length);
            }
            dir = dirPh[0];
        }
        while (n--) {
            res.push(dir);
        }
        return res;
    }, []);

    i = pref.length;

    while (i--) {
        dir = pref.pop();
        if (!~dirPh.indexOf(dir)) {
            path[0] = dir;
        }
        dir = path.shift();
        if (dir || !i) {
            pref.unshift(dir);
        }
    }
    // Return first empty chunk to be absolute
    if (isAbsolute && pref[0]) {
        pref.unshift('');
    }
    pref.push(file);
    return pref.join(sep);
};
