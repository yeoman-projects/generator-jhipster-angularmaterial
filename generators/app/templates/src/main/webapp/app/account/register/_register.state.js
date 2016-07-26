(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider','$mdDialog','$mdMedia'];

    function stateConfig($stateProvider,$mdDialog,$mdMedia) {
        $stateProvider.state('register', {
            parent: 'account',
            url: '/register',
            data: {
                authorities: [],
                pageTitle: 'register.title'
            },
            onEnter: function($mdDialog, $state) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );

                $mdDialog.show({
                    templateUrl: 'app/account/register/register.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    controller: 'RegisterController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
               
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('register');
                    return $translate.refresh();
                }],
                event: function($stateParams) {
                    return $stateParams.event;
                }
            }
        });
    }
})();
