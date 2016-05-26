(function(){

  'use strict';

  angular.module('<%=angularAppName%>')
    .factory('menu', [
      '$location','Principal',
      function ($location, Principal) {

        var sections = [];

        if (Principal.isAuthenticated()) {
          sections.push({
            name: 'Entities',
            type: 'toggle',
            pages: [
              
              // jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here
            ]
          });
        }

        if (Principal.isAuthenticated()) {
            sections.push({
              name: 'Account',
              type: 'toggle',
              pages: [{
                name: 'Settings',
                type: 'link',
                state: 'settings',
                icon: 'settings'
              }, {
                name: 'Password',
                state: 'password',
                type: 'link',
                icon: 'verified_user'
              },
                {
                  name: 'Sign out',
                  state: 'munchies.donuts',
                  type: 'link',
                  icon: 'logout'
                },
                {
                  name: 'Sign in',
                  state: 'munchies.donuts',
                  type: 'link',
                  icon: 'login'
                },
                {
                  name: 'Register',
                  state: 'register',
                  type: 'link',
                  icon: 'person_add'
                }]
            });
        }
        
       if (Principal.hasAuthority('ROLE_ADMIN')) { 
          sections.push({
            name: 'Administration',
            type: 'toggle',
            pages: [{
              name: 'User management',
              type: 'link',
              state: 'user-management',
              icon: 'person'
            }, {
              name: 'Metrics',
              state: 'jhi-metrics',
              type: 'link',
              icon: 'av_timer'
            },
              {
                name: 'Health',
                state: 'jhi-health',
                type: 'link',
                icon: 'healing'
              },
              {
                name: 'Configuration',
                state: 'jhi-configuration',
                type: 'link',
                icon: 'settings'
              },
              {
                name: 'Audits',
                state: 'audits',
                type: 'link',
                icon: 'assignment'
              },
              {
                name: 'logs',
                state: 'logss',
                type: 'link',
                icon: 'receipt'
              },
              {
                name: 'API',
                state: 'docs',
                type: 'link',
                icon: 'my_library_books'
              }]
          });
       }

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