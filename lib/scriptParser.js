/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Andrey Koperskiy @teux
 */
var Parser = require('fastparse');

module.exports = new Parser({
    root: {
        '<script': function(match, idx) {
            this.idx = idx;
            return 'scriptTag';
        },
        '<\\/script[\\s\\n]*>': function(match, idx, len) {
            if (this.isTemplate) {
                this.scripts.push({
                    id: this.id,                // template name
                    idx: this.idx,              // script begin index
                    len: idx + len - this.idx,  // script including final script tag length
                    contIdx: this.contIdx,      // content begin index
                    contLen: idx - this.idx - this.contIdx, // content up to final script tag length
                });
            }
            this.isTemplate = this.idx = this.contIdx = this.id = undefined;
        },
    },
    scriptTag: {
        'type[\\s\\n]*=[\\s\\n]*[\'"]': 'typeAttr',
        'id[\\s\\n]*=[\\s\\n]*[\'"]': 'idAttr',
        '>': function(match, idx) {
            this.contIdx = idx - this.idx + 1;
            return 'root';
        },
    },
    typeAttr: {
        'text/ng-template': function() {
            this.isTemplate = true;
        },
        '[\'"]': 'scriptTag',
    },
    idAttr: {
        '[^\'"\\s\\n]+': function(match) {
            this.id = match;
        },
        '[\'"]': 'scriptTag',
    },
});
