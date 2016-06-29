/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var loaderUtils = require("loader-utils");

/**
 * Process file name.
 * @param {string} pattern Name pattern, i.e. [name]-1.[ext].
 * @param {string} source Template content (for hash calculation - not implemented now).
 * @param {string} file File name. With prefix if defined.
 * @return {*} File name according with template.
 */
var processName = function(pattern, source, file) {
    var params = {
        name: '',
        ext: '',
        hash: '[hash]',
    };
    var re = new RegExp('\\[(' + Object.keys(params).join('|') + ')\\]', 'g');
    var splitted;
    var isValid;
    var match;
    var name;

    if (pattern) {
        // It may contain no more than one [name], [ext], [hash] in any order
        // Note. hash is not supported now
        match = pattern.match(re);

        isValid = !match || !match.some(function(p, i) {
            return match.indexOf(p) !== i;
        });
    }

    if (!isValid) {
        return file;
    }

    splitted = file.split('/');
    params.name = splitted.pop();
    match = params.name.match(/^(.+)\.+(.+)$/);

    if (match) {
        params.name = match[1];
        params.ext = match[2] || '';
    }

    name = pattern.replace(re, function(p, key) {
        return params[key];
    });

    splitted.push(name);
    return splitted.join('/');
};

/**
 * Process prefix an file name.
 * @param {string} source Template content.
 * @return {string} Template ID.
 */
module.exports = function(source) {
    var sep = '/';
    var rootSep = ':';
    var dirPh = ['*', '[dir]'];
    var dirsPh = ['**', '[dirs]'];

    var query = loaderUtils.parseQuery(this.query);
    var pref = query.prefix || '';
    var path = this.resource;
    var isAbsolute;
    var root;
    var file;
    var dir;
    var i;

    // Change separators to unix style
    pref = pref.replace(/\\/g, sep);
    path = path.replace(/\\/g, sep);

    // No prefix defined - return file name
    if (!pref) {
        file = path.split(sep).pop();
        return processName(query.name, source, file);
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

    // Split prefix and replace `[dirs]` by `**` for consistency
    pref = pref.split(sep).map(function(dir) {
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
    pref = pref.reduce(function(res, dir, i) {
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
    file = pref.join(sep);

    return processName(query.name, source, file);
};
