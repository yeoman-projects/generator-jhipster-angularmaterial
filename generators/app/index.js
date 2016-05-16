'use strict';
var generators = require('yeoman-generator');
var scriptBase = require('../generator-base');
var util = require('util');
var chalk = require('chalk');
var packagejs = require(__dirname + '/../../package.json');
var _ = require('lodash');
var pluralize = require('pluralize');
var fs = require('fs');

// Stores JHipster variables
var jhipsterVar = {moduleName: 'angularmaterial'};

// Stores JHipster functions
var jhipsterFunc = {};

var AngularMaterialGenerator = generators.Base.extend({});

util.inherits(AngularMaterialGenerator, scriptBase);

const MAIN_SRC_DIR = 'src/main/webapp/',
      TEST_SRC_DIR = 'src/test/javascript/',
      DIST_DIR ='www/',
      BUILD_DIR = 'target/',
      ANGULAR_DIR = 'src/main/webapp/app/';

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
      this.packagejs = { 'version' : '3.1.0' };
            
      this.serverPort = this.config.get('serverPort') || 8080;
      this.authenticationType = this.config.get('authenticationType');
      this.jhiPrefix = this.config.get('jhiPrefix') || 'jhi';
      
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
    writeAngularAppFiles: function () {
            this.copy(MAIN_SRC_DIR + '_index.html', MAIN_SRC_DIR + 'index.html');

            // Angular JS module
            this.template(ANGULAR_DIR + '_app.module.js', ANGULAR_DIR + 'app.module.js', this, {});
            this.template(ANGULAR_DIR + '_app.state.js', ANGULAR_DIR + 'app.state.js', this, {});
            this.template(ANGULAR_DIR + '_app.constants.js', ANGULAR_DIR + 'app.constants.js', this, {});
			
            //Layouts
			      this.template(ANGULAR_DIR + 'layouts/navbar/_navbar.html', ANGULAR_DIR + 'layouts/navbar/navbar.html', this, {});
            this.template(ANGULAR_DIR + 'layouts/navbar/_navbar.controller.js', ANGULAR_DIR + 'layouts/navbar/navbar.controller.js', this, {});
            this.template(ANGULAR_DIR + 'layouts/navbar/_navbar.factory.js', ANGULAR_DIR + 'layouts/navbar/navbar.factory.js', this, {});
            this.template(ANGULAR_DIR + 'layouts/navbar/_menu_link.directive.js', ANGULAR_DIR + 'layouts/navbar/menu_link.directive.js', this, {});
            this.template(ANGULAR_DIR + 'layouts/navbar/_menu_toggle.directive.js', ANGULAR_DIR + 'layouts/navbar/menu_toggle.directive.js', this, {});
            
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
