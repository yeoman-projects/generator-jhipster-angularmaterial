'use strict';
var generators = require('yeoman-generator');
var scriptBase = require('../generator-base');
var util = require('util');
var chalk = require('chalk');
var packagejs = require(__dirname + '/../../package.json');
var _ = require('lodash');
var pluralize = require('pluralize');
var fs = require('fs');

const MAIN_SRC_DIR = 'src/main/webapp/',
      TEST_SRC_DIR = 'src/test/javascript/',
      DIST_DIR ='www/',
      BUILD_DIR = 'target/',
      ANGULAR_DIR = 'src/main/webapp/app/',
      CLIENT_MAIN_SRC_DIR = MAIN_SRC_DIR;


// Stores JHipster variables
var jhipsterVar = {moduleName: 'angularmaterial'};

// Stores JHipster functions
var jhipsterFunc = {};

var AngularMaterialGenerator = generators.Base.extend({});

util.inherits(AngularMaterialGenerator, scriptBase);


module.exports = AngularMaterialGenerator.extend({

    
  initializing: {
    compose: function (args) {
       
      this.composeWith('jhipster:modules',
        {
          options: {
            jhipsterVar: jhipsterVar,
            jhipsterFunc: jhipsterFunc,
            skipValidation: true
          }
        },
        this.options.testmode ? {local: require.resolve('generator-jhipster/modules')} : null
      );
    },
    displayLogo: function () {
      // Have Yeoman greet the user.
     
      this.log('Welcome to the ' + chalk.red('JHipster angularmaterial') + ' generator! ' + chalk.yellow('v' + packagejs.version + '\n'));
    }
  },
  
  
  prompting: function () {
    
  },
  configuring: {
    configureGlobal: function () {
 
      var javaDir = jhipsterVar.javaDir;
      var resourceDir = jhipsterVar.resourceDir;
      var webappDir = jhipsterVar.webappDir;
      
      // Make constants available in templates
      this.MAIN_SRC_DIR = MAIN_SRC_DIR;
      this.TEST_SRC_DIR = TEST_SRC_DIR;
      this.DIST_DIR = DIST_DIR;
      this.BUILD_DIR = BUILD_DIR,
      this.packagejs = { 'version' : '3.5.1' };
            
      this.serverPort = this.config.get('serverPort') || 8080;
      this.authenticationType = jhipsterVar.authenticationType;
      this.jhiPrefix = jhipsterVar.jhiPrefix;
      this.jhiPrefixCapitalized = _.upperFirst(jhipsterVar.jhiPrefix);
      this.languagesToApply = jhipsterVar.languages;
      this.nativeLanguage = jhipsterVar.nativeLanguage;
      this.searchEngine = jhipsterVar.searchEngine;
      this.applicationType = jhipsterVar.applicationType || 'monolith';
      this.enableTranslation = jhipsterVar.enableTranslation;
      this.enableSocialSignIn = jhipsterVar.enableSocialSignIn;
      this.websocket = jhipsterVar.websocket;
      
      // Constants
      this.useSass = false;
      this.testFrameworks = [];
      this.buildTool = 'maven';
        
      // Application name modified, using each technology's conventions
      this.angularAppName =  jhipsterVar.angularAppName;
      this.packageName = jhipsterVar.packageName;
      this.baseName = jhipsterVar.baseName;
      this.camelizedBaseName = _.camelCase(this.baseName);
      this.capitalizedBaseName = _.upperFirst(this.baseName);
      this.dasherizedBaseName = _.kebabCase(this.baseName);
      this.lowercaseBaseName = this.baseName.toLowerCase();
      this.nativeLanguageShortName = this.enableTranslation && this.nativeLanguage ? this.nativeLanguage.split('-')[0] : 'en';
    }
  },
  default: {
      composeLanguages: function () {
          var configOptions = {};
      
            configOptions.applicationType = this.config.get('authenticationType');
            configOptions.baseName = jhipsterVar.baseName;
            configOptions.websocket = jhipsterVar.websocket;
            configOptions.databaseType =  jhipsterVar.databaseType;
            configOptions.searchEngine =  jhipsterVar.searchEngine;
            configOptions.enableTranslation = jhipsterVar.enableTranslation;
            configOptions.nativeLanguage = jhipsterVar.nativeLanguage;
            
            configOptions.enableSocialSignIn = jhipsterVar.enableSocialSignIn;

            // As argument
            this.languages = jhipsterVar.languages;
            this.enableTranslation = jhipsterVar.enableTranslation;

            if (this.skipI18n) return;
            this.composeLanguagesSub(this, configOptions, 'client');
        },
  },
  writing: {
    writeCommonFiles: function () {

            this.template('_package.json', 'package.json', this, {});
            this.template('_bower.json', 'bower.json', this, {});
            this.template('bowerrc', '.bowerrc', this, {});
            this.template('_eslintrc.json', '.eslintrc.json', this, {});
            this.template('_eslintignore', '.eslintignore', this, {});
            this.template('gulpfile.js', 'gulpfile.js', this, {});
            this.fs.copy(this.templatePath('gulp/handleErrors.js'), this.destinationPath('gulp/handleErrors.js')); // to avoid interpolate errors
            this.template('gulp/utils.js', 'gulp/utils.js', this, {});
            this.template('gulp/serve.js', 'gulp/serve.js', this, {});
            this.template('gulp/config.js', 'gulp/config.js', this, {});
            this.template('gulp/build.js', 'gulp/build.js', this, {});
    },
    writeCssFiles: function () {
            // normal CSS or SCSS?
            //if (this.useSass) {
            //    this.template(MAIN_SRC_DIR + 'scss/main.scss', MAIN_SRC_DIR + 'scss/main.scss');
            //    this.template(MAIN_SRC_DIR + 'scss/vendor.scss', MAIN_SRC_DIR + 'scss/vendor.scss');
            //}
            // this css file will be overwritten by the sass generated css if sass is enabled
            // but this will avoid errors when running app without running sass task first
            this.template(MAIN_SRC_DIR + 'content/css/main.css', MAIN_SRC_DIR + 'content/css/main.css');
            this.copy(MAIN_SRC_DIR + 'content/css/documentation.css', MAIN_SRC_DIR + 'content/css/documentation.css');
    },
    writeCommonWebFiles: function () {
            // HTML5 BoilerPlate
            this.copy(MAIN_SRC_DIR + 'favicon.ico', MAIN_SRC_DIR + 'favicon.ico');
            this.copy(MAIN_SRC_DIR + 'robots.txt', MAIN_SRC_DIR + 'robots.txt');
            this.copy(MAIN_SRC_DIR + '404.html', MAIN_SRC_DIR + '404.html');
    },
    writeSwaggerFiles: function () {
            // Swagger-ui for Jhipster
            this.template(MAIN_SRC_DIR + 'swagger-ui/_index.html', MAIN_SRC_DIR + 'swagger-ui/index.html', this, {});
            this.copy(MAIN_SRC_DIR + 'swagger-ui/images/throbber.gif', MAIN_SRC_DIR + 'swagger-ui/images/throbber.gif');
    },
  /*  
    writeLanguages: function () {
        this.languagesToApply && this.languagesToApply.forEach(function (language) {          
            
            this.installI18nClientFilesByLanguage(this, CLIENT_MAIN_SRC_DIR, language);            
            
        }, this);
    },*/
    writeAngularAuthFiles: function () {
            // account module
            this.template(ANGULAR_DIR + 'account/_account.state.js', ANGULAR_DIR + 'account/account.state.js', this, {});
            this.copyHtml(ANGULAR_DIR + 'account/activate/activate.html', ANGULAR_DIR + 'account/activate/activate.html');
            this.copyJs(ANGULAR_DIR + 'account/activate/_activate.state.js', ANGULAR_DIR + 'account/activate/activate.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/activate/_activate.controller.js', ANGULAR_DIR + 'account/activate/activate.controller.js', this, {});
            this.copyHtml(ANGULAR_DIR + 'account/password/password.html', ANGULAR_DIR + 'account/password/password.html');
            this.copyJs(ANGULAR_DIR + 'account/password/_password.state.js', ANGULAR_DIR + 'account/password/password.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/password/_password.controller.js', ANGULAR_DIR + 'account/password/password.controller.js', this, {});
            this.template(ANGULAR_DIR + 'account/password/_password-strength-bar.directive.js', ANGULAR_DIR + 'account/password/password-strength-bar.directive.js', this, {});
            this.copyHtml(ANGULAR_DIR + 'account/register/register.html', ANGULAR_DIR + 'account/register/register.html');
            this.copyJs(ANGULAR_DIR + 'account/register/_register.state.js', ANGULAR_DIR + 'account/register/register.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/register/_register.controller.js', ANGULAR_DIR + 'account/register/register.controller.js', this, {});
            this.copyHtml(ANGULAR_DIR + 'account/reset/request/reset.request.html', ANGULAR_DIR + 'account/reset/request/reset.request.html');
            this.copyJs(ANGULAR_DIR + 'account/reset/request/_reset.request.state.js', ANGULAR_DIR + 'account/reset/request/reset.request.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/reset/request/_reset.request.controller.js', ANGULAR_DIR + 'account/reset/request/reset.request.controller.js', this, {});
            this.copyHtml(ANGULAR_DIR + 'account/reset/finish/reset.finish.html', ANGULAR_DIR + 'account/reset/finish/reset.finish.html');
            this.copyJs(ANGULAR_DIR + 'account/reset/finish/_reset.finish.state.js', ANGULAR_DIR + 'account/reset/finish/reset.finish.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/reset/finish/_reset.finish.controller.js', ANGULAR_DIR + 'account/reset/finish/reset.finish.controller.js', this, {});
            if (this.authenticationType === 'session') {
                this.copyHtml(ANGULAR_DIR + 'account/sessions/sessions.html', ANGULAR_DIR + 'account/sessions/sessions.html');
                this.copyJs(ANGULAR_DIR + 'account/sessions/_sessions.state.js', ANGULAR_DIR + 'account/sessions/sessions.state.js', this, {});
                this.template(ANGULAR_DIR + 'account/sessions/_sessions.controller.js', ANGULAR_DIR + 'account/sessions/sessions.controller.js', this, {});
            }
            this.copyHtml(ANGULAR_DIR + 'account/settings/settings.html', ANGULAR_DIR + 'account/settings/settings.html');
            this.copyJs(ANGULAR_DIR + 'account/settings/_settings.state.js', ANGULAR_DIR + 'account/settings/settings.state.js', this, {});
            this.template(ANGULAR_DIR + 'account/settings/_settings.controller.js', ANGULAR_DIR + 'account/settings/settings.controller.js', this, {});
            // Social
            if (this.enableSocialSignIn) {
                this.copyHtml(ANGULAR_DIR + 'account/social/directive/_social.html', ANGULAR_DIR + 'account/social/directive/social.html');
                this.template(ANGULAR_DIR + 'account/social/directive/_social.directive.js', ANGULAR_DIR + 'account/social/directive/social.directive.js', this, {});
                this.copyHtml(ANGULAR_DIR + 'account/social/_social-register.html', ANGULAR_DIR + 'account/social/social-register.html');
                this.template(ANGULAR_DIR + 'account/social/_social-register.controller.js', ANGULAR_DIR + 'account/social/social-register.controller.js', this, {});
                this.template(ANGULAR_DIR + 'account/social/_social.service.js', ANGULAR_DIR + 'account/social/social.service.js', this, {});
                this.copyJs(ANGULAR_DIR + 'account/social/_social.state.js', ANGULAR_DIR + 'account/social/social.state.js', this, {});

                if (this.authenticationType === 'jwt') {
                    this.template(ANGULAR_DIR + 'account/social/_social-auth.controller.js', ANGULAR_DIR + 'account/social/social-auth.controller.js', this, {});
                }
            }
        },
    writeAngularProfileServiceFiles: function () {
            // services
            this.template(ANGULAR_DIR + 'services/profiles/_profile.service.js', ANGULAR_DIR + 'services/profiles/profile.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/profiles/_page-ribbon.directive.js', ANGULAR_DIR + 'services/profiles/page-ribbon.directive.js', this, {});
        },
    writeAngularAuthServiceFiles: function () {
            // services
            this.template(ANGULAR_DIR + 'services/auth/_auth.service.js', ANGULAR_DIR + 'services/auth/auth.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_principal.service.js', ANGULAR_DIR + 'services/auth/principal.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_has-authority.directive.js', ANGULAR_DIR + 'services/auth/has-authority.directive.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_has-any-authority.directive.js', ANGULAR_DIR + 'services/auth/has-any-authority.directive.js', this, {});
            if (this.authenticationType === 'oauth2') {
                this.template(ANGULAR_DIR + 'services/auth/_auth.oauth2.service.js', ANGULAR_DIR + 'services/auth/auth.oauth2.service.js', this, {});
            } else if (this.authenticationType === 'jwt' || this.authenticationType === 'uaa') {
                this.template(ANGULAR_DIR + 'services/auth/_auth.jwt.service.js', ANGULAR_DIR + 'services/auth/auth.jwt.service.js', this, {});
            } else {
                this.template(ANGULAR_DIR + 'services/auth/_auth.session.service.js', ANGULAR_DIR + 'services/auth/auth.session.service.js', this, {});
                this.template(ANGULAR_DIR + 'services/auth/_sessions.service.js', ANGULAR_DIR + 'services/auth/sessions.service.js', this, {});
            }
            this.template(ANGULAR_DIR + 'services/auth/_account.service.js', ANGULAR_DIR + 'services/auth/account.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_activate.service.js', ANGULAR_DIR + 'services/auth/activate.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_password.service.js', ANGULAR_DIR + 'services/auth/password.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_password-reset-init.service.js', ANGULAR_DIR + 'services/auth/password-reset-init.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_password-reset-finish.service.js', ANGULAR_DIR + 'services/auth/password-reset-finish.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/auth/_register.service.js', ANGULAR_DIR + 'services/auth/register.service.js', this, {});
            this.template(ANGULAR_DIR + 'services/user/_user.service.js', ANGULAR_DIR + 'services/user/user.service.js', this, {});
        },
    writeAngularComponentFiles: function () {
            this.template(ANGULAR_DIR + 'components/form/_pagination.constants.js', ANGULAR_DIR + 'components/form/pagination.constants.js', this, {});
            //components
            if (this.enableTranslation) {
                this.template(ANGULAR_DIR + 'components/language/_language.filter.js', ANGULAR_DIR + 'components/language/language.filter.js', this, {});
                this.template(ANGULAR_DIR + 'components/language/_language.constants.js', ANGULAR_DIR + 'components/language/language.constants.js', this, {});
                this.template(ANGULAR_DIR + 'components/language/_language.controller.js', ANGULAR_DIR + 'components/language/language.controller.js', this, {});
                this.template(ANGULAR_DIR + 'components/language/_language.service.js', ANGULAR_DIR + 'components/language/language.service.js', this, {});
            }
            this.copyHtml(ANGULAR_DIR + 'components/login/login.html', ANGULAR_DIR + 'components/login/login.html');
            this.copyJs(ANGULAR_DIR + 'components/login/_login.service.js', ANGULAR_DIR + 'components/login/login.service.js', this, {});
            this.template(ANGULAR_DIR + 'components/login/_login.controller.js', ANGULAR_DIR + 'components/login/login.controller.js', this, {});
            this.template(ANGULAR_DIR + 'components/util/_date-util.service.js', ANGULAR_DIR + 'components/util/date-util.service.js', this, {});
			this.template(ANGULAR_DIR + 'components/util/_data-util.service.js', ANGULAR_DIR + 'components/util/data-util.service.js', this, {});
            this.template(ANGULAR_DIR + 'components/util/_base64.service.js', ANGULAR_DIR + 'components/util/base64.service.js', this, {});
            this.template(ANGULAR_DIR + 'components/util/_pagination-util.service.js', ANGULAR_DIR + 'components/util/pagination-util.service.js', this, {});
            this.template(ANGULAR_DIR + 'components/util/_parse-links.service.js', ANGULAR_DIR + 'components/util/parse-links.service.js', this, {});
            // interceptor code
            if (this.authenticationType === 'oauth2' || this.authenticationType === 'jwt' || this.authenticationType === 'uaa') {
                this.template(ANGULAR_DIR + 'blocks/interceptor/_auth.interceptor.js', ANGULAR_DIR + 'blocks/interceptor/auth.interceptor.js', this, {});
            }
            this.template(ANGULAR_DIR + 'blocks/interceptor/_auth-expired.interceptor.js', ANGULAR_DIR + 'blocks/interceptor/auth-expired.interceptor.js', this, {});
            this.template(ANGULAR_DIR + 'blocks/interceptor/_errorhandler.interceptor.js', ANGULAR_DIR + 'blocks/interceptor/errorhandler.interceptor.js', this, {});
            this.template(ANGULAR_DIR + 'blocks/interceptor/_notification.interceptor.js', ANGULAR_DIR + 'blocks/interceptor/notification.interceptor.js', this, {});
  
        },
    writeAngularAppFiles: function () {
            this.copy(MAIN_SRC_DIR + '_index.html', MAIN_SRC_DIR + 'index.html');

           // Angular JS module
            this.template(ANGULAR_DIR + '_app.module.js', ANGULAR_DIR + 'app.module.js', this, {});
            this.template(ANGULAR_DIR + '_app.state.js', ANGULAR_DIR + 'app.state.js', this, {});
            this.template(ANGULAR_DIR + '_app.constants.js', ANGULAR_DIR + 'app.constants.js', this, {});
            
            this.template(ANGULAR_DIR + 'blocks/handlers/_state.handler.js', ANGULAR_DIR + 'blocks/handlers/state.handler.js', this, {});
            if (this.enableTranslation) {
                this.template(ANGULAR_DIR + 'blocks/handlers/_translation.handler.js', ANGULAR_DIR + 'blocks/handlers/translation.handler.js', this, {});
                this.template(ANGULAR_DIR + 'blocks/config/_translation.config.js', ANGULAR_DIR + 'blocks/config/translation.config.js', this, {});
                this.template(ANGULAR_DIR + 'blocks/config/_translation-storage.provider.js', ANGULAR_DIR + 'blocks/config/translation-storage.provider.js', this, {});
            }
            
            // home module
            this.copyHtml(ANGULAR_DIR + 'home/_home.html', ANGULAR_DIR + 'home/home.html');
            this.copyJs(ANGULAR_DIR + 'home/_home.state.js', ANGULAR_DIR + 'home/home.state.js', this, {});
            this.template(ANGULAR_DIR + 'home/_home.controller.js', ANGULAR_DIR + 'home/home.controller.js', this, {});
			
            //Layouts
			this.template(ANGULAR_DIR + 'layouts/navbar/_navbar.html', ANGULAR_DIR + 'layouts/navbar/navbar.html', this, {});
            this.template(ANGULAR_DIR + 'layouts/navbar/_navbar.controller.js', ANGULAR_DIR + 'layouts/navbar/navbar.controller.js', this, {});
			this.copyHtml(ANGULAR_DIR + 'layouts/error/error.html', ANGULAR_DIR + 'layouts/error/error.html');
            this.copyHtml(ANGULAR_DIR + 'layouts/error/accessdenied.html', ANGULAR_DIR + 'layouts/error/accessdenied.html');
            this.copyJs(ANGULAR_DIR + 'layouts/error/_error.state.js', ANGULAR_DIR + 'layouts/error/error.state.js', this, {});
            
            // Config 
            this.template(ANGULAR_DIR + 'blocks/config/_http.config.js', ANGULAR_DIR + 'blocks/config/http.config.js', this, {});
            this.template(ANGULAR_DIR + 'blocks/config/_localstorage.config.js', ANGULAR_DIR + 'blocks/config/localstorage.config.js', this, {});
            
            //Entities
            this.template(ANGULAR_DIR + 'entities/_entity.state.js', ANGULAR_DIR + 'entities/entity.state.js', this, {});
            
    },
    writeAngularAdminModuleFiles: function () {
        // admin modules
        this.template(ANGULAR_DIR + 'admin/_admin.state.js', ANGULAR_DIR + 'admin/admin.state.js', this, {});
            
        this.copy(ANGULAR_DIR + 'admin/docs/docs.html', ANGULAR_DIR + 'admin/docs/docs.html');
        this.copyJs(ANGULAR_DIR + 'admin/docs/_docs.state.js', ANGULAR_DIR + 'admin/docs/docs.state.js', this, {});
    },        
    writeTemplates : function () {
      
              
      
    },

    registering: function () {
      try {
        jhipsterFunc.registerModule("generator-jhipster-angularmaterial", "entity", "post", "entity", "Front End build with Angular MAterial");
      } catch (err) {
        this.log(chalk.red.bold('WARN!') + ' Could not register as a jhipster entity post creation hook...\n');
      }
    }
  },

  install: function () {
    this.spawnCommand('gulp', ['install']);
  },

  end: function () {
    this.log('End of angularmaterial generator');
  }
});
