(function(){

  'use strict';

  angular.module('<%=angularAppName%>')
    .factory('menu', [
      '$location',
      function ($location) {

        var sections = [];

        sections.push({
          name: 'Entities',
          type: 'toggle',
          pages: [
            
            // jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here
          ]
        });

        sections.push({
          name: 'Account',
          type: 'toggle',
          pages: [{
            name: 'Settings',
            type: 'link',
            state: 'settings',
            icon: 'fa fa-wrench'
          }, {
            name: 'Password',
            state: 'password',
            type: 'link',
            icon: 'fa fa-key'
          },
            {
              name: 'Sign out',
              state: 'munchies.donuts',
              type: 'link',
              icon: 'fa fa-sign-out'
            },
            {
              name: 'Sign in',
              state: 'munchies.donuts',
              type: 'link',
              icon: 'fa fa-sign-in'
            },
            {
              name: 'Register',
              state: 'register',
              type: 'link',
              icon: 'fa fa-map-marker'
            }]
        });
        
        sections.push({
          name: 'Administration',
          type: 'toggle',
          pages: [{
            name: 'User management',
            type: 'link',
            state: 'user-management',
            icon: 'fa fa-users'
          }, {
            name: 'Metrics',
            state: 'jhi-metrics',
            type: 'link',
            icon: 'fa fa-map-marker'
          },
            {
              name: 'Health',
              state: 'jhi-health',
              type: 'link',
              icon: 'fa fa-map-marker'
            },
            {
              name: 'Configuration',
              state: 'jhi-configuration',
              type: 'link',
              icon: 'fa fa-map-marker'
            },
            {
              name: 'Audits',
              state: 'audits',
              type: 'link',
              icon: 'fa fa-map-marker'
            },
            {
              name: 'logs',
              state: 'logss',
              type: 'link',
              icon: 'fa fa-map-marker'
            },
            {
              name: 'API',
              state: 'docs',
              type: 'link',
              icon: 'fa fa-map-marker'
            }]
        });

        var self;

        return self = {
          sections: sections,

          toggleSelectSection: function (section) {
            self.openedSection = (self.openedSection === section ? null : section);
          },
          isSectionSelected: function (section) {
            return self.openedSection === section;
          },

          selectPage: function (section, page) {
            page && page.url && $location.path(page.url);
            self.currentSection = section;
            self.currentPage = page;
          }
        };

        function sortByHumanName(a, b) {
          return (a.humanName < b.humanName) ? -1 :
            (a.humanName > b.humanName) ? 1 : 0;
        }

      }])

})();