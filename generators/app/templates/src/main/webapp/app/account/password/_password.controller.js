(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['Auth', 'Principal','$mdDialog','$mdToast'];

    function PasswordController (Auth, Principal, $mdDialog, $mdToast) {
        var vm = this;

        vm.changePassword = changePassword;
        vm.doNotMatch = null;
        vm.error = null;
        vm.success = null;

        vm.openToast = function( message ) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent( message )
                    .position('top right')
                    .hideDelay(3000)
                );
        }

        Principal.identity().then(function(account) {
            vm.account = account;
        });

        function changePassword () {
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
                    $mdDialog.hide();
                    vm.openToast( err.data );
                });
            }
        }
    }
})();
