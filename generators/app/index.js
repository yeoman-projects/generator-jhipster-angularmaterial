'use strict';
var generators = require('yeoman-generator');
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
  writing: {
    writeTemplates : function () {
      this.baseName = jhipsterVar.baseName;
      this.packageName = jhipsterVar.packageName;
      this.angularAppName = jhipsterVar.angularAppName;
      var javaDir = jhipsterVar.javaDir;
      var resourceDir = jhipsterVar.resourceDir;
      var webappDir = jhipsterVar.webappDir;

      this.log('baseName=' + this.baseName);
      this.log('packageName=' + this.packageName);
      this.log('angularAppName=' + this.angularAppName);


      // Static images
      this.copy('src/main/webapp/content/images/clear.svg', 'src/main/webapp/content/images/clear.svg');
      this.copy('src/main/webapp/content/images/delete.svg', 'src/main/webapp/content/images/delete.svg');
      this.copy('src/main/webapp/content/images/filter.svg', 'src/main/webapp/content/images/filter.svg');
      this.copy('src/main/webapp/content/images/playlist_add.svg', 'src/main/webapp/content/images/playlist_add.svg');
      this.copy('src/main/webapp/content/images/search.svg', 'src/main/webapp/content/images/search.svg');
      
      // Bower and modules
      jhipsterFunc.addBowerDependency("angular-material-data-table","0.10.5");
      jhipsterFunc.addAngularJsModule("ngMaterial");
      jhipsterFunc.addAngularJsModule("md.data.table");
         
      
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
    //this.installDependencies();
  },

  end: function () {
    this.log('End of angularmaterial generator');
  }
});
