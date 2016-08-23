/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var extend = require("extend");
var htmlMinifier = require("html-minifier");
var loaderUtils = require("loader-utils");
var scriptParser = require('./lib/scriptParser.js');
var urlParser = require('./lib/urlParser.js');
var getTemplateId = require('./lib/templateId.js');

var PRE_STUB = 'var angular=window.angular,ngModule;\n' +
    'try {ngModule=angular.module(["${mod}"])}\n' +
    'catch(e){ngModule=angular.module("${mod}",[])}';

var STUB = 'var v${i}=${val};\n' +
    'var id${i}="${key}";\n' +
    'ngModule.run(["$templateCache",function(c){c.put(id${i},v${i})}]);';

/**
 * Replaces placeholders with values.
 * @param {string} stub Template ith placeholders.
 * @param {Object} values Key-value pairs.
 * @return {string} Resolved template.
 */
function supplant(stub, values) {
    return stub.replace(/\$\{([^}]+)\}/g, function(match, key) {
        return values[key] || match;
    });
}
/**
 * Replaces urls with `require(url)` for further processing with url-loader or file-loader.
 * @param {Object} query ng-cache-loader options.
 * @param {string} src Template text.
 * @return {string} JSON
 */
function resolveUrl(query, src) {
    return query.url === false ?
        JSON.stringify(src) :
        urlParser(src);
}

module.exports = function(source) {
    var opts = {
        module: 'ng',
        minimize: true,
        // next are html-minifier default options
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeEmptyAttributes: true,
        keepClosingSlash: true,
    };
    var minimizeOpts = this.query.match(/&?minimizeOptions[\s\n]*=[\s\n]*([^&]*)/);
    var result = [];
    var scripts;
    var html;
    var scr;

    if (this.cacheable) {
        this.cacheable();
    }

    // Remove minimizeOptions from query string because JSON is not suitable for query parameter
    if (minimizeOpts) {
        this.query = this.query.replace(minimizeOpts[0], '');
    }
    try {
        minimizeOpts = minimizeOpts && JSON.parse(minimizeOpts[1]);
    } catch (e) {
        throw new Error('Invalid value of query parameter minimizeOptions');
    }

    // Parse query and append minimize options
    extend(opts, minimizeOpts, loaderUtils.parseQuery(this.query));

    if (opts.minimize) {
        try {
            source = htmlMinifier.minify(source, extend({}, opts));
        } catch (e) {
            this.emitWarning(e.toString() + '\nUsing unminified HTML');
        }
    }

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
                val: resolveUrl(opts, html),
                i: result.length + 1,
            });
        } else {
            source.splice(scr.idx, 0, html);
        }
    }
    // Prepare the ramaining templates (means w/o `script` tag or w/o `id` attribute)
    source = source.join('');

    if (/[^\s]/.test(source)) {
        result.push({
            key: getTemplateId.call(this, source),
            val: resolveUrl(opts, source),
            i: result.length + 1,
        });
    }
    result = result.map(supplant.bind(null, STUB));

    // Return template string or id/template pair as module exports
    if (opts.exportId) {
        result.push('exports.id=id' + result.length + ';\nexports.template=v' + result.length + ';');
    } else if (opts.exportIdOnly) {
        result.push('module.exports=id' + result.length + ';');
    } else {
        result.push('module.exports=v' + result.length + ';');
    }
    result.unshift(supplant(PRE_STUB, {mod: opts.module}));

    return result.join('\n');
};
