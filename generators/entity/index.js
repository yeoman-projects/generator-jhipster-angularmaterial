'use strict';
var path = require('path'),
    util = require('../util'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    _ = require('lodash'),
    pluralize = require('pluralize'),
    packagejs = require(__dirname + '/../../package.json'),
    fs = require('fs'),
    glob = require("glob");

// Stores JHipster variables
var jhipsterVar = {moduleName: 'angularmaterial'};

// Stores JHipster functions
var jhipsterFunc = {};

var STRIP_HTML = 'stripHtml',
STRIP_JS = 'stripJs',
COPY = 'copy',
TPL = 'template'

module.exports = yeoman.Base.extend({

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
      
    }
  },
  writing : {
    updateFiles: function () {
     

      this.baseName = jhipsterVar.baseName;
      this.packageName = jhipsterVar.packageName;
      this.angularAppName = jhipsterVar.angularAppName;
      this.frontendBuilder = jhipsterVar.frontendBuilder;
      this.changelogDate = jhipsterFunc.dateFormatForLiquibase();
      this.entityClass =  this.entityConfig.entityClass;

      var webappDir = jhipsterVar.webappDir,
      javaTemplateDir = 'src/main/java/package',
      javaDir = jhipsterVar.javaDir,
      resourceDir = jhipsterVar.resourceDir,
      interpolateRegex = /<%=([\s\S]+?)%>/g; // so that thymeleaf tags in templates do not get mistreated as _ templates

      if (this.entityConfig.entityClass) {
        this.log('\n' + chalk.bold.green('I\'m updating the entity for audit ') + chalk.bold.yellow(this.entityConfig.entityClass));
        
                
        this.template('src/main/webapp/app/entities/_entity-management.controller.js', 'src/main/webapp/app/entities/' + this.entityConfig.entityFolderName + '/' + this.entityConfig.entityFileName + '.controller' + '.js', this, {});
        this.template('src/main/webapp/app/entities/_entity-management.html', 'src/main/webapp/app/entities/' + this.entityConfig.entityFolderName + '/' + this.entityConfig.entityFileName + '.html', this, {}, true);
		
        util.addEntityToMenu(this.entityConfig.entityStateName, false);

          
          
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
      this.log('\n' + chalk.bold.green('Entity audit enabled'));
    }
  }
});