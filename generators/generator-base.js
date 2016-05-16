'use strict';
var path = require('path'),
    util = require('util'),
    jhipsterUtils = require('./util'),
    html = require('html-wiring'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    shelljs = require('shelljs'),
    engine = require('ejs').render,
    _ = require('lodash');

module.exports = Generator;

function Generator() {
    yeoman.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.Base);

  
Generator.prototype.addEntityToMenu = function(routerName, enableTranslation) {
    try {
        var fullPath = 'src/main/webapp/app/layouts/navbar/navbar.factory.js';
        jhipsterUtils.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-add-entity-to-menu',
            splicable: [
                '{\n' +
                '    name: \'' + _.camelCase(routerName) + '\',\n' +
                '    state: \'' + routerName + '\',\n' +
                '    type: \'link\',\n' +
                '    icon: \'fa fa-map-marker\'\n' +
                '},' 
            ]
        }, this);
    } catch (e) {
        console.log( ' addEntityToMenu  name:' + e.name + '\nmessage:' + e.message);
    }
};


/**
 * Copy templates with all the custom logic applied according to the type.
 *
 * @param {string} source - path of the source file to copy from
 * @param {string} dest - path of the destination file to copy to
 * @param {string} action - type of the action to be performed on the template file, i.e: stripHtml | stripJs | template | copy
 * @param {object} generator - context that can be used as the generator instance or data to process template
 * @param {object} opt - options that can be passed to template method
 * @param {boolean} template - flag to use template method instead of copy method
 */
Generator.prototype.copyTemplate = function (source, dest, action, generator, opt, template) {

    var _this = generator || this;
    var _opt = opt || {};
    var regex;
    switch (action) {
    case 'stripHtml' :
        regex = /( translate\="([a-zA-Z0-9](\.)?)+")|( translate-values\="\{([a-zA-Z]|\d|\:|\{|\}|\[|\]|\-|\'|\s|\.)*?\}")|( translate-compile)|( translate-value-max\="[0-9\{\}\(\)\|]*")/g;
            //looks for something like translate="foo.bar.message" and translate-values="{foo: '{{ foo.bar }}'}"
        jhipsterUtils.copyWebResource(source, dest, regex, 'html', _this, _opt, template);
        break;
    case 'stripJs' :
        regex = /\,[\s\n ]*(resolve)\:[\s ]*[\{][\s\n ]*[a-zA-Z]+\:(\s)*\[[ \'a-zA-Z0-9\$\,\(\)\{\}\n\.\<\%\=\-\>\;\s]*\}\][\s\n ]*\}/g;
            //looks for something like mainTranslatePartialLoader: [*]
        jhipsterUtils.copyWebResource(source, dest, regex, 'js', _this, _opt, template);
        break;
    case 'copy' :
        _this.copy(source, dest);
        break;
    default:
        _this.template(source, dest, _this, _opt);
    }
};


/**
 * Copy html templates after stripping translation keys when translation is disabled.
 *
 * @param {string} source - path of the source file to copy from
 * @param {string} dest - path of the destination file to copy to
 * @param {object} generator - context that can be used as the generator instance or data to process template
 * @param {object} opt - options that can be passed to template method
 * @param {boolean} template - flag to use template method instead of copy
 */
Generator.prototype.copyHtml = function (source, dest, generator, opt, template) {
    this.copyTemplate(source, dest, 'stripHtml', generator, opt, template);
};

/**
 * Copy Js templates after stripping translation keys when translation is disabled.
 *
 * @param {string} source - path of the source file to copy from
 * @param {string} dest - path of the destination file to copy to
 * @param {object} generator - context that can be used as the generator instance or data to process template
 * @param {object} opt - options that can be passed to template method
 * @param {boolean} template - flag to use template method instead of copy
 */
Generator.prototype.copyJs = function (source, dest, generator, opt, template) {
    this.copyTemplate(source, dest, 'stripJs', generator, opt, template);
};
