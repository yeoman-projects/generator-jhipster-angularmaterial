(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['Auth', 'Principal','$mdDialog'];

    function PasswordController (Auth, Principal, $mdDialog) {
        var vm = this;

        vm.changePassword = changePassword;
        vm.doNotMatch = null;
        vm.error = null;
        vm.success = null;
        vm.validationError = null;

        Principal.identity().then(function(account) {
            vm.account = account;
        });

        function changePassword (form) {
            if (vm.password !== vm.confirmPassword) {
                vm.error = null;
                vm.success = null;
                vm.doNotMatch = 'ERROR';
            } else {
                vm.doNotMatch = null;
                Auth.changePassword(vm.password).then(function () {
                    vm.error = null;
                    vm.success = 'OK';
                    $mdDialog.hide();
                }).catch(function (err) {
                    vm.success = null;
                    vm.error = 'ERROR';
                    vm.validationError = err.data;
                    form.password.$setValidity('validationError', false);
                });
            }
        }
    }
})();
