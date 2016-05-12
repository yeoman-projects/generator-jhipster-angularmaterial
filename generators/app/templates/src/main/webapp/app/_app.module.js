(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>', [
            'ngMaterial',
            'ngResource',
            'md.data.table',
            'ngMdIcons',    
            'ui.router',        
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'ngMessages'
        ])
        .config( function ($mdIconProvider, $mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');
                
        });

    
})();
