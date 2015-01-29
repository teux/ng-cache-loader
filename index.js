/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var htmlMinifier = require("html-minifier");
var loaderUtils = require("loader-utils");
var scriptParser = require('./lib/scriptParser.js');
var urlParser = require('./lib/urlParser.js');
var getTemplateId = require('./lib/templateId.js');

var stub = 'var v$i=$val;\n' +
    'window.angular.module(["ng"])' +
    '.run(["$templateCache",function(c){' +
    'c.put("$key", v$i)' +
    '}]);';

module.exports = function (source) {
    var query = loaderUtils.parseQuery(this.query),
        result = [],
        scripts,
        html,
        scr;

    var resolveUrl = function (src) {
        return query.url !== false ?
            urlParser(src)
            : JSON.stringify(src);
    };

    this.cacheable && this.cacheable();

    source = htmlMinifier.minify(source, {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true
    });
    scripts = scriptParser.parse('root', source, {scripts: []}).scripts;
    source = Array.prototype.slice.apply(source);

    // Prepare named templates
    while (scripts.length) {
        scr = scripts.pop();
        html = source
            .splice(scr.idx, scr.len)
            .splice(scr.contIdx, scr.contLen)
            .join('');
        if (scr.id) {
            result.push({
                key: scr.id,
                val: resolveUrl(html),
                i: result.length + 1
            });
        } else {
            source.splice(scr.idx, 0, html);
        }
    }
    // Prepare the ramaining templates (means w/o `script` tag or w/o `id` attribute)
    source = source.join('');
    if (/[^\s]/.test(source)) {
        result.push({
            key: getTemplateId.apply(this),
            val: resolveUrl(source),
            i: result.length + 1
        });
    }

    result.forEach(function (res, i) {
        result[i] = stub.replace(/\$([\w\d_\-]+)/g, function (match, name) {
            return res[name] ? res[name] : match;
        });
    });
    result.push('module.exports=v' + result.length + ';');
    return result.join('\n');
};
