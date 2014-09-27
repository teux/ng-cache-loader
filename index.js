var htmlMinifier = require("html-minifier");
var parser = require('./lib/scriptParser.js');
var getTemplateId = require('./lib/templateId.js');

var stub = 'angular.module(["ng"])' +
    '.run(["$templateCache", function (c) {\n' +
    '    c.put("$key", $val);' +
    '\n}]);';

module.exports = function (source) {
    var result = [],
        scripts,
        html,
        scr;

    this.cacheable && this.cacheable();

    source = htmlMinifier.minify(source, {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true
    });
    scripts = parser.parse("root", source, { scripts: [] }).scripts;
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
                val: JSON.stringify(html)
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
            val: JSON.stringify(source)
        });
    }

    result.forEach(function (res, i) {
        result[i] = stub.replace(/\$([\w\d_\-]+)/g, function (match, name) {
            return res[name] ? res[name] : match;
        });
    });
    return result.join('\n');
};
