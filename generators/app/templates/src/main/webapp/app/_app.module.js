(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>', [
            'ngMaterial',
            'ngResource',
            'md.data.table',
            'ngMdIcons',    
            'ui.router',     
            'ngStorage',  
            'ngCacheBuster',
            'mdPickers',             
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'ngMessages'
        ])
        .config( function ($mdIconProvider, $mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');
                
        });

    
})();
