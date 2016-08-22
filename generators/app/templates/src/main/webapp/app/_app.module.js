(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>', [
            'ngMaterial',
            <% if (enableTranslation) { %>
            'tmh.dynamicLocale',
            'pascalprecht.translate', <% } %>
            'ngResource',
            'md.data.table',
            'ngMdIcons',    
            'ui.router',     
            'ngStorage',  
            'ngCookies',
            'ngCacheBuster',
            'mdPickers',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'ngMessages',
            'ngFileUpload'
        ])
        .config( function ($mdIconProvider, $mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');
                
        })
        .run(run);

        run.$inject = ['stateHandler'<% if (enableTranslation) { %>, 'translationHandler'<% } %>];

        function run(stateHandler<% if (enableTranslation) { %>, translationHandler<% } %>) {
            stateHandler.initialize();<% if (enableTranslation) { %>
            translationHandler.initialize();<% } %>
        }

        
})();
