(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$mdDialog', '$mdMedia'];

    function LoginService ($mdDialog, $mdMedia) {
        var service = {
            openLogin: openLogin,
            openChangePassword: openChangePassword,
            openRegister: openRegister,
            openActivate: openActivate,
            openRequestResetPassword: openRequestResetPassword,
            openRequestFinishPassword: openRequestFinishPassword
        };

        return service;
        
        function openLogin(ev) {
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

        function openChangePassword(ev) {
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

        function openRegister(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/account/register/register.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'RegisterController',
                    controllerAs: 'vm',
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }).then( function() {

                }, function() {

                });
                      
        }

        function openRequestResetPassword(ev) {
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

        function openRequestFinishPassword(ev) {
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
