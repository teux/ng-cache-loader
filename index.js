/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var htmlMinifier = require("html-minifier");
var loaderUtils = require("loader-utils");
var scriptParser = require('./lib/scriptParser.js');
var urlParser = require('./lib/urlParser.js');
var getTemplateId = require('./lib/templateId.js');

var PRE_STUB = 'var angular=window.angular,ngModule;\n' +
    'try {ngModule=angular.module(["${mod}"])}\n' +
    'catch(e){ngModule=angular.module("${mod}",[])}';

var STUB = 'var v${i}=${val};\n' +
    'ngModule.run(["$templateCache",function(c){c.put("${key}",v${i})}]);';

var DEF_MODULE = 'ng';
/**
 * Replaces placeholders with values.
 * @param {string} stub
 * @param {Object} values Key-value pairs.
 * @returns {string}
 */
var supplant = function (stub, values) {
    return stub.replace(/\$\{([^}]+)\}/g, function (match, key) {
        return values[key] || match;
    });
};

module.exports = function (source) {
    var query = loaderUtils.parseQuery(this.query),
        result = [],
        scripts,
        html,
        scr;

    var resolveUrl = function (src) {
        return query.url !== false ?
            urlParser(src) :
            JSON.stringify(src);
    };

    this.cacheable && this.cacheable();

    var mod = query.module || DEF_MODULE;

    try {
        source = htmlMinifier.minify(source, {
            removeComments: true,
            removeCommentsFromCDATA: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            preserveLineBreaks: true,
            removeEmptyAttributes: true,
            keepClosingSlash: true
        });
    } catch (e) {}

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
    result = result.map(supplant.bind(null, STUB));

    result.push('module.exports=v' + result.length + ';');
    result.unshift(supplant(PRE_STUB, {mod: mod}));

    return result.join('\n');
};
