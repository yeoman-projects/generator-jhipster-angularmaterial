(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = [<% if (enableTranslation){ %>'$translate',<% } %> '$timeout', 'Auth', 'LoginService','$mdDialog','$mdToast'];

    function RegisterController (<% if (enableTranslation){ %>$translate, <% } %>$timeout, Auth, LoginService, $mdDialog, $mdToast) {
        var vm = this;

        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.registerAccount = {};
        vm.success = null;
        vm.validationError = null;
        vm.cancel = cancel;

        vm.openToast = function( message ) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent( message )
                    .position('top right')
                    .hideDelay(3000)
                );
        }

        function cancel() {
            $mdDialog.hide();
        }

        function register (registrationForm) {
            if (vm.registerAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                vm.registerAccount.langKey = <% if (enableTranslation){ %>$translate.use()<% }else {%> 'en' <% } %>;
                vm.doNotMatch = null;
                vm.error = null;
                vm.errorUserExists = null;
                vm.errorEmailExists = null;

                Auth.createAccount(vm.registerAccount).then(function () {
                    vm.success = 'OK';
                    $mdDialog.hide();
                }).catch(function (response) {
                    vm.success = null;
                    vm.validationError = response.data;
                       
                    vm.openToast( response.data );
                    if (response.status === 400 && response.data === 'login already in use') {
                        vm.errorUserExists = 'ERROR';
                        registrationForm.login.$setValidity('validationError', false);
                    } else if (response.status === 400 && response.data === 'e-mail address already in use') {
                        vm.errorEmailExists = 'ERROR';
                        registrationForm.email.$setValidity('validationError', false);
                    } else {
                        vm.error = 'ERROR';
                        registrationForm.login.$setValidity('validationError', false);
                    }
                });
            }
        }
    }
})();
