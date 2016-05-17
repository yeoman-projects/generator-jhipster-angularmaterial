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

Generator.prototype.contains = _.includes;




Generator.prototype.installI18nClientFilesByLanguage = function (_this, webappDir, lang) {
    this.copyI18nFilesByName(_this, webappDir, 'activate.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'audits.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'configuration.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'error.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'gateway.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'login.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'logs.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'home.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'metrics.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'password.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'register.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'sessions.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'settings.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'reset.json', lang);
    this.copyI18nFilesByName(_this, webappDir, 'user-management.json', lang);

    // tracker.json for Websocket
    if (this.websocket === 'spring-websocket') {
        this.copyI18nFilesByName(_this, webappDir, 'tracker.json', lang);
    }

    if (this.enableSocialSignIn) {
        this.copyI18nFilesByName(_this, webappDir, 'social.json', lang);
    }

    // Templates
    _this.template(webappDir + 'i18n/' + lang + '/_global.json', webappDir + 'i18n/' + lang + '/global.json', this, {});
    _this.template(webappDir + 'i18n/' + lang + '/_health.json', webappDir + 'i18n/' + lang + '/health.json', this, {});


};

Generator.prototype.installI18nServerFilesByLanguage = function (_this, resourceDir, lang) {
    // Template the message server side properties
    var lang_prop = lang.replace(/-/g, '_');
    _this.template(resourceDir + 'i18n/_messages_' + lang_prop + '.properties', resourceDir + 'i18n/messages_' + lang_prop + '.properties', this, {});

};

Generator.prototype.copyI18n = function (language) {
    try {
        this.template(CLIENT_MAIN_SRC_DIR + 'i18n/_entity_' + language + '.json', CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/' + this.entityInstance + '.json', this, {});
        this.addEntityTranslationKey(this.entityTranslationKeyMenu, this.entityClass, language);
    } catch (e) {
        // An exception is thrown if the folder doesn't exist
        // do nothing
    }
};

Generator.prototype.copyEnumI18n = function (language, enumInfo) {
    try {
        this.template(CLIENT_MAIN_SRC_DIR + 'i18n/_enum_' + language + '.json', CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/' + enumInfo.enumInstance + '.json', enumInfo, {});
    } catch (e) {
        // An exception is thrown if the folder doesn't exist
        // do nothing
    }
};