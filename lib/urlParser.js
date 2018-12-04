/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Andrey Koperskiy @teux
 */
var Parser = require("fastparse");
var relativeImageUrl = /^[^/][^:]+(?:\.png|\.bmp|\.raw|\.jpg|\.jpeg|\.tiff|\.gif|\.svg)$/;

Parser = new Parser({
    root: {
        '<[^\\s/>]+': 'tag',
    },
    tag: {
        '[\\s\\n](md-svg-)?src(set)?[\\s\\n]*=[\\s\\n]*[\'"]': 'srcAttr',
        '>': 'root',
    },
    srcAttr: {
        '[^\\s\\n\'"]+': function(match, idx) {
            if (relativeImageUrl.test(match)) {
                this.urls.push({idx: idx, path: match});
            }
            return 'srcAttr';
        },
        '[\'"]': 'tag',
    },
});

module.exports = function(src) {
    var urls = Parser.parse('root', src, {urls: []}).urls;
    var i = urls.length;
    var result = [];

    while (i--) {
        result.push(JSON.stringify(src.substr(urls[i].idx + urls[i].path.length)));
        result.push(' + require("' + urls[i].path + '") + ');
        src = src.substr(0, urls[i].idx);
    }
    result.push(JSON.stringify(src));
    result.reverse();
    return result.join('');
};
