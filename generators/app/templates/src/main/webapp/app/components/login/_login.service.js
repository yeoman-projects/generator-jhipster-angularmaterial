(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$mdDialog', '$mdMedia'];

    function LoginService ($mdDialog, $mdMedia) {
        var service = {
            open: open,
            openResetPassword: openResetPassword,
            register: register,
            openActivate: openActivate,
            requestResetPassword: requestResetPassword,
            requestFinishPassword: requestFinishPassword
        };

        return service;
        
        function open(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/components/login/login.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function openResetPassword(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/password/password.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'PasswordController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function register(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/register/register.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'RegisterController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function requestResetPassword(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/reset/request/reset.request.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'RequestResetController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function requestFinishPassword(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/reset/finish/reset.finish.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'ResetFinishController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function openActivate(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/activate/activate.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'ActivationController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }


        
    }
})();
