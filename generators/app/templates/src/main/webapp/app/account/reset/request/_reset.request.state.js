(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider','$mdDialog','$mdMedia'];

    function stateConfig($stateProvider,$mdDialog,$mdMedia) {
        $stateProvider.state('requestReset', {
            parent: 'account',
            url: '/reset/request',
            data: {
                authorities: []
            },
            onEnter: function($mdDialog, $state) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );

                $mdDialog.show({
                    templateUrl: 'app/account/reset/request/reset.request.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    controller: 'RequestResetController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
               
            },

            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('reset');
                    return $translate.refresh();
                }],
                event: function($stateParams) {
                    return $stateParams.event;
                }
            }
        });
    }
})();
