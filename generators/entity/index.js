'use strict';
var path = require('path'),
    generators = require('yeoman-generator'),
    scriptBase = require('../generator-base'),
    util = require('util'),
    chalk = require('chalk'),
    _ = require('lodash'),
    pluralize = require('pluralize'),
    packagejs = require(__dirname + '/../../package.json'),
    fs = require('fs'),
    glob = require("glob");
    
/* constants used througout */
const constants = require('../generator-constants'),
    INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX,
    CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR,
    CLIENT_TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR,
    ANGULAR_DIR = constants.ANGULAR_DIR,
    SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR,
    SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR,
    TEST_DIR = constants.TEST_DIR,
    SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR,
    RESERVED_WORDS_JAVA = constants.RESERVED_WORDS_JAVA,
    RESERVED_WORDS_MYSQL = constants.RESERVED_WORDS_MYSQL,
    RESERVED_WORDS_POSGRES = constants.RESERVED_WORDS_POSGRES,
    RESERVED_WORDS_CASSANDRA = constants.RESERVED_WORDS_CASSANDRA,
    RESERVED_WORDS_ORACLE = constants.RESERVED_WORDS_ORACLE,
    RESERVED_WORDS_MONGO = constants.RESERVED_WORDS_MONGO,
    SUPPORTED_VALIDATION_RULES = constants.SUPPORTED_VALIDATION_RULES;

var JhipsterClientGenerator = generators.Base.extend({});

util.inherits(JhipsterClientGenerator, scriptBase);

// Stores JHipster variables
var jhipsterVar = {moduleName: 'angularmaterial'};

// Stores JHipster functions
var jhipsterFunc = {};

var STRIP_HTML = 'stripHtml',
STRIP_JS = 'stripJs',
COPY = 'copy',
TPL = 'template'

module.exports = JhipsterClientGenerator.extend({

  initializing: {

    compose: function (args) {
      this.entityConfig = this.options.entityConfig;
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });
    },

    

    displayLogo: function () {
      if (this.abort){
        return;
      }
      this.log(chalk.white('Running ' + chalk.bold('JHipster Angular Material') + ' Generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
    },

    

    prompting: function () {
      
    }
  },
  configuring: {
    loadInMemoryData: function () {
        // From yo-rc.json
        this.authenticationType = this.config.get('authenticationType');
        this.searchEngine = this.config.get('searchEngine');
        this.applicationType = this.config.get('applicationType');
        this.enableTranslation = this.config.get('enableTranslation');
        
        // From entityConfig
        var entityNameSpinalCased = _.kebabCase(_.lowerFirst(this.entityConfig.entityClass));
        var entityNamePluralizedAndSpinalCased = _.kebabCase(_.lowerFirst(pluralize(this.entityConfig.entityClass)));
        
        this.baseName = jhipsterVar.baseName;
        this.packageName = jhipsterVar.packageName;
        this.angularAppName = jhipsterVar.angularAppName;
        this.frontendBuilder = jhipsterVar.frontendBuilder;
        this.changelogDate = jhipsterFunc.dateFormatForLiquibase();
        this.entityClass =  this.entityConfig.entityClass;
        this.entityNameCapitalized = _.upperFirst(this.entityClass);
        
        this.entityClassHumanized = _.startCase(this.entityNameCapitalized);
        this.entityClassPlural = pluralize(this.entityClass);
        this.entityClassPluralHumanized = _.startCase(this.entityClassPlural);
        this.entityInstance = _.lowerFirst(this.entityClass);
        this.entityInstancePlural = pluralize(this.entityInstance);
        this.entityApiUrl = entityNamePluralizedAndSpinalCased;
        this.entityFolderName = entityNameSpinalCased;
        this.entityAngularJSSuffix = (this.entityConfig.data.angularJSSuffix) ? this.entityConfig.data.angularJSSuffix : "";
        this.entityFileName = entityNameSpinalCased + this.entityAngularJSSuffix;
        this.entityPluralFileName = entityNamePluralizedAndSpinalCased + this.entityAngularJSSuffix;
        this.entityServiceFileName = entityNameSpinalCased;
        this.entityAngularJSName = this.entityClass + _.upperFirst(_.camelCase(this.entityAngularJSSuffix));
        this.entityStateName = entityNameSpinalCased + this.entityAngularJSSuffix;
        this.entityUrl = entityNameSpinalCased + this.entityAngularJSSuffix;
        this.entityTranslationKey = this.entityInstance;
        this.entityTranslationKeyMenu = _.camelCase(this.entityStateName);
        
        this.fields = this.entityConfig.data.fields;
        this.pagination = this.entityConfig.data.pagination;
        this.relationships = this.entityConfig.data.relationships;
        this.dto = this.entityConfig.data.dto;
        this.service = this.entityConfig.data.service;
                
        this.fieldsContainOwnerManyToMany = this.entityConfig.fieldsContainOwnerManyToMany;
        this.fieldsContainNoOwnerOneToOne = this.entityConfig.fieldsContainNoOwnerOneToOne;
        this.fieldsContainOwnerOneToOne = this.entityConfig.fieldsContainOwnerOneToOne;
        this.fieldsContainOneToMany = this.entityConfig.fieldsContainOneToMany;
        this.fieldsContainZonedDateTime = this.entityConfig.fieldsContainZonedDateTime;
        this.fieldsContainLocalDate = this.entityConfig.fieldsContainLocalDate;
        this.fieldsContainBigDecimal = this.entityConfig.fieldsContainBigDecimal;
        this.fieldsContainBlob = this.entityConfig.fieldsContainBlob;
        
        this.differentTypes = [this.entityClass];
            if (!this.relationships) {
                this.relationships = [];
            }
            
        this.relationships && this.relationships.forEach( function (relationship) {
             var entityType = relationship.otherEntityNameCapitalized;
                if (this.differentTypes.indexOf(entityType) === -1) {
                    this.differentTypes.push(entityType);
                }
        },this);
    }
  },
  writing : {
    updateFiles: function () {
     

      

      var webappDir = jhipsterVar.webappDir,
      javaTemplateDir = 'src/main/java/package',
      javaDir = jhipsterVar.javaDir,
      resourceDir = jhipsterVar.resourceDir,
      interpolateRegex = /<%=([\s\S]+?)%>/g; // so that thymeleaf tags in templates do not get mistreated as _ templates

      if (this.entityConfig.entityClass) {
        this.log('\n' + chalk.bold.green('I\'m updating the entity for AngularMaterial ') + chalk.bold.yellow(this.entityConfig.entityClass));
        
        this.template(ANGULAR_DIR + 'entities/_entity-management.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityPluralFileName + '.html', this, {});
        this.template(ANGULAR_DIR + 'entities/_entity-management-dialog.html', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-dialog.html', this, {});
                
        this.template(ANGULAR_DIR + 'entities/_entity-management.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '.controller' + '.js', this, {});
        this.template(ANGULAR_DIR + 'entities/_entity-management-dialog.add.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-dialog.add.controller' + '.js', this, {});
        this.template(ANGULAR_DIR + 'entities/_entity-management-dialog.edit.controller.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '-dialog.edit.controller' + '.js', this, {});
        this.template(ANGULAR_DIR + 'entities/_entity-management.state.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityFileName + '.state.js', this, {});
        this.template(ANGULAR_DIR + 'services/_entity.service.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityServiceFileName + '.service' + '.js', this, {});
        if (this.searchEngine === 'elasticsearch') {
            this.template(ANGULAR_DIR + 'services/_entity-search.service.js', ANGULAR_DIR + 'entities/' + this.entityFolderName + '/' + this.entityServiceFileName + '.search.service' + '.js', this, {});
        }
		
        this.addEntityToMenu(this.entityConfig.entityStateName, false);

          
          
      }
    },
    updateConfig : function() {
      if (this.abort){
        return;
      }
      jhipsterFunc.updateEntityConfig(this.entityConfig.filename, 'enableEntityAudit', this.enableAudit);
    }
  },
  install: function () {
        var injectJsFilesToIndex = function () {
            this.log('\n' + chalk.bold.green('Running gulp Inject to add javascript to index\n'));
            this.spawnCommand('gulp', ['inject:app']);
        };
        if (!this.options['skip-install'] && !this.skipClient) {
            injectJsFilesToIndex.call(this);
        }
  },
  end: function () {
    if (this.abort){
      return;
    }
    if (this.enableAudit){
      this.log('\n' + chalk.bold.green('Entity AngularMaterial enabled'));
    }
  }
});