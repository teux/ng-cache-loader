/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Alexander Merkulov @merqlove
 */
var loaderUtils = require("loader-utils");

/**
 * Process Module ID.
 * @param {string} templateId Template ID.
 * @return {object} Module ID, New Template ID.
 */
module.exports = function(templateId) {
    var root = '[root]';
    var sep = '/';
    var defaultName = 'ng';

    var query = loaderUtils.getOptions ?
        loaderUtils.getOptions(this) :
        loaderUtils.parseQuery(this.query);
    var moduleId = query.module || defaultName;
    var newTemplateId = templateId;
    
    if(~moduleId.indexOf(root)) {
        var path = templateId.split(sep);
        var suffix = path.shift();
        moduleId = moduleId.replace(root, suffix);
        newTemplateId = path.join(sep);
    }

    return {
        moduleId: moduleId,
        templateId: newTemplateId
    };
};
