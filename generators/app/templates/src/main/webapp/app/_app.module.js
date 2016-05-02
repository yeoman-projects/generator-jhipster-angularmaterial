(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>', [
            'ngMaterial',
            'md.data.table',
            'ngMdIcons',            
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'ngMessages'
        ])
        .config( function ($mdIconProvider, $mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('red');
                
        });

    
})();
