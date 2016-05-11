(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('<%= entityStateName %>', {
            parent: 'entity',
            url: '/<%= entityUrl %>',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '<%= entityClassPlural %>'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityPluralFileName %>.html',
                    controller: '<%= entityAngularJSName %>Controller',
                    controllerAs: 'vm'
                }
            }
        });
    }

})();
