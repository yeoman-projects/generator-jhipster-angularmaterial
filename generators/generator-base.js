'use strict';
var path = require('path'),
    util = require('util'),
    jhipsterUtils = require('./util'),
    html = require('html-wiring'),
    chalk = require('chalk'),
    Insight = require('insight'),
    yeoman = require('yeoman-generator'),
    shelljs = require('shelljs'),
    engine = require('ejs').render,
    packagejs = require('../package.json'),
    _ = require('lodash');

const constants = require('./generator-constants'),
    CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR,
    SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
    
module.exports = Generator;

function Generator() {
    yeoman.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.Base);

  
Generator.prototype.addEntityToMenu = function(entityClassPluralHumanized, routerName, enableTranslation) {
    try {
        var fullPath = 'src/main/webapp/app/layouts/navbar/navbar.html';
        jhipsterUtils.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-add-entity-to-menu',
            splicable: [
                '<md-list-item ui-sref=\'' + routerName +  '\' ng-show=\'vm.isAuthenticated()\'>\n' +
                '    <ng-md-icon icon="no"></ng-md-icon>\n' +
                '    <p>' + entityClassPluralHumanized + '</p>\n' +
                '</md-list-item>'                
            ]
        }, this);
    } catch (e) {
        console.log( ' addEntityToMenu  name:' + e.name + '\nmessage:' + e.message);
    }
};

Generator.prototype.insight = function () {
    var insight = new Insight({
        trackingCode: 'UA-46075199-2',
        packageName: packagejs.name,
        packageVersion: packagejs.version
    });

    insight.trackWithEvent = function (category, action) {
        insight.track(category, action);
        insight.trackEvent({
            category: category,
            action: action,
            label: category + ' ' + action,
            value: 1
        });
    };

    return insight;
};

Generator.prototype.composeLanguagesSub = function (generator, configOptions, type) {
    if (generator.enableTranslation) {
        // skip server if app type is client
        var skipServer = type && type === 'client';
        // skip client if app type is server
        var skipClient = type && type === 'server';
        generator.composeWith('jhipster:languages', {
            options: {
                'skip-install': true,
                'skip-server': skipServer,
                'skip-client': skipClient,
                configOptions: configOptions
            },
            args: generator.languages
        }, {
            local: require.resolve('./languages')
        });
    }
};


Generator.prototype.updateLanguagesInLanguageConstant = function (languages) {
    var fullPath = CLIENT_MAIN_SRC_DIR + 'app/components/language/language.constants.js';
    try {
        var content = '.constant(\'LANGUAGES\', [\n';
        for (var i = 0, len = languages.length; i < len; i++) {
            var language = languages[i];
            content += '            \'' + language + '\'' + (i !== languages.length - 1 ? ',' : '') + '\n';
        }
        content +=
            '            // jhipster-needle-i18n-language-constant - JHipster will add/remove languages in this array\n' +
            '        ]';

        jhipsterUtils.replaceContent({
            file: fullPath,
            pattern: /\.constant.*LANGUAGES.*\[([^\]]*jhipster-needle-i18n-language-constant[^\]]*)\]/g,
            content: content
        }, this);
    } catch (e) {
        this.log(chalk.yellow('\nUnable to find ') + fullPath + chalk.yellow(' or missing required jhipster-needle. LANGUAGE constant not updated with languages: ') + languages + chalk.yellow(' since block was not found. Check if you have enabled translation support.\n'));
    }
};

/**
 * A a new element in the "global.json" translations.
 *
 * @param {string} key - Key for the menu entry
 * @param {string} value - Default translated value
 * @param {string} language - The language to which this translation should be added
 */
Generator.prototype.addElementTranslationKey = function (key, value, language) {
    var fullPath = CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/global.json';
    try {
        jhipsterUtils.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-menu-add-element',
            splicable: [
                '"' + key + '": "' + _.startCase(value) + '",'
            ]
        }, this);
    } catch (e) {
        this.log(chalk.yellow('\nUnable to find ') + fullPath + chalk.yellow(' or missing required jhipster-needle. Reference to ') + language + chalk.yellow(' not added as a new entity in the menu.\n'));
    }
};

/**
 * A a new element in the admin section of "global.json" translations.
 *
 * @param {string} key - Key for the menu entry
 * @param {string} value - Default translated value
 * @param {string} language - The language to which this translation should be added
 */
Generator.prototype.addAdminElementTranslationKey = function (key, value, language) {
    var fullPath = CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/global.json';
    try {
        jhipsterUtils.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-menu-add-admin-element',
            splicable: [
                '"' + key + '": "' + _.startCase(value) + '",'
            ]
        }, this);
    } catch (e) {
        this.log(chalk.yellow('\nUnable to find ') + fullPath + chalk.yellow(' or missing required jhipster-needle. Reference to ') + language + chalk.yellow(' not added as a new entry in the admin menu.\n'));
    }
};

/**
 * A a new entity in the "global.json" translations.
 *
 * @param {string} key - Key for the entity name
 * @param {string} value - Default translated value
 * @param {string} language - The language to which this translation should be added
 */
Generator.prototype.addEntityTranslationKey = function (key, value, language) {
    var fullPath = CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/global.json';
    try {
        jhipsterUtils.rewriteFile({
            file: fullPath,
            needle: 'jhipster-needle-menu-add-entry',
            splicable: [
                '"' + key + '": "' + _.startCase(value) + '",'
            ]
        }, this);
    } catch (e) {
        this.log(chalk.yellow('\nUnable to find ') + fullPath + chalk.yellow(' or missing required jhipster-needle. Reference to ') + language + chalk.yellow(' not added as a new entity in the menu.\n'));
    }
};

/**
 * A a new entry as a root param in "global.json" translations.
 *
 * @param {string} key - Key for the entry
 * @param {string} value - Default translated value or object with multiple key and translated value
 * @param {string} language - The language to which this translation should be added
 */
Generator.prototype.addGlobalTranslationKey = function (key, value, language) {
    var fullPath = CLIENT_MAIN_SRC_DIR + 'i18n/' + language + '/global.json';
    try {
        jhipsterUtils.rewriteJSONFile(fullPath, function (jsonObj) {
            jsonObj[key] = value;
        }, this);
    } catch (e) {
        this.log(chalk.yellow('\nUnable to find ') + fullPath + chalk.yellow('. Reference to ') + '(key: ' + key + ', value:' + value + ')' + chalk.yellow(' not added to global translations.\n'));
    }
};

/**
 * Add a translation key to all installed languages
 *
 * @param {string} key - Key for the entity name
 * @param {string} value - Default translated value
 * @param {string} method - The method to be run with provided key and value from above
 * @param {string} enableTranslation - specify if i18n is enabled
 */
Generator.prototype.addTranslationKeyToAllLanguages = function (key, value, method, enableTranslation) {
    if (enableTranslation) {
        this.getAllInstalledLanguages().forEach(function (language) {
            this[method](key, value, language);
        }, this);
    }
};

/**
 * get all the languages installed currently
 */
Generator.prototype.getAllInstalledLanguages = function () {
    var languages = [];
    this.getAllSupportedLanguages().forEach(function (language) {
        try {
            var stats = fs.lstatSync(CLIENT_MAIN_SRC_DIR + 'i18n/' + language);
            if (stats.isDirectory()) {
                languages.push(language);
            }
        } catch (e) {
            // An exception is thrown if the folder doesn't exist
            // do nothing as the language might not be installed
        }
    });
    return languages;
};

/**
 * get all the languages supported by JHipster
 */
Generator.prototype.getAllSupportedLanguages = function () {
    return _.map(this.getAllSupportedLanguageOptions(), 'value');
};

/**
 * check if a language is supported by JHipster
 * @param {string} language - Key for the language
 */
Generator.prototype.isSupportedLanguage = function (language) {
    return _.includes(this.getAllSupportedLanguages(), language);
};

/**
 * get all the languages options supported by JHipster
 */
Generator.prototype.getAllSupportedLanguageOptions = function () {
    return [
        {name: 'Catalan', value: 'ca'},
        {name: 'Chinese (Simplified)', value: 'zh-cn'},
        {name: 'Chinese (Traditional)', value: 'zh-tw'},
        {name: 'Czech', value: 'cs'},
        {name: 'Danish', value: 'da'},
        {name: 'Dutch', value: 'nl'},
        {name: 'English', value: 'en'},
        {name: 'French', value: 'fr'},
        {name: 'Galician', value: 'gl'},
        {name: 'German', value: 'de'},
        {name: 'Greek', value: 'el'},
        {name: 'Hindi', value: 'hi'},
        {name: 'Hungarian', value: 'hu'},
        {name: 'Italian', value: 'it'},
        {name: 'Japanese', value: 'ja'},
        {name: 'Korean', value: 'ko'},
        {name: 'Marathi', value: 'mr'},
        {name: 'Polish', value: 'pl'},
        {name: 'Portuguese (Brazilian)', value: 'pt-br'},
        {name: 'Portuguese', value: 'pt-pt'},
        {name: 'Romanian', value: 'ro'},
        {name: 'Russian', value: 'ru'},
        {name: 'Slovak', value: 'sk'},
        {name: 'Spanish', value: 'es'},
        {name: 'Swedish', value: 'sv'},
        {name: 'Turkish', value: 'tr'},
        {name: 'Tamil', value: 'ta'}
    ];
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


/**
 * Copy i18 files for given language
 *
 * @param {object} generator - context that can be used as the generator instance or data to process template
 * @param {string} webappDir - webapp directory path
 * @param {string} fileToCopy - file name to copy
 * @param {string} lang - language for which file needs to be copied
 */
Generator.prototype.copyI18nFilesByName = function (generator, webappDir, fileToCopy, lang) {
    var _this = generator || this;
    _this.copy(webappDir + 'i18n/' + lang + '/' + fileToCopy, webappDir + 'i18n/' + lang + '/' + fileToCopy);
};

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
        console.log(e);
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