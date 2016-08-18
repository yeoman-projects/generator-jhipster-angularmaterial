(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('RequestResetController', RequestResetController);

    RequestResetController.$inject = ['$timeout', 'Auth','$mdDialog'];

    function RequestResetController ($timeout, Auth,$mdDialog) {
        var vm = this;

        vm.error = null;
        vm.errorEmailNotExists = null;
        vm.requestReset = requestReset;
        vm.resetAccount = {};
        vm.success = null;
        vm.validationError = null;

        function requestReset (resetForm) {

            vm.error = null;
            vm.errorEmailNotExists = null;

            Auth.resetPasswordInit(vm.resetAccount.email).then(function () {
                vm.success = 'OK';
                 $mdDialog.hide();
            }).catch(function (response) {
                vm.success = null;
                vm.validationError = response.data;
                if (response.status === 400 && response.data === 'e-mail address not registered') {
                    resetForm.email.$setValidity('validationError', false);
                    vm.errorEmailNotExists = 'ERROR';
                } else {
                    resetForm.email.$setValidity('validationError', false);
                    vm.error = 'ERROR';
                }
            });
        }
    }
})();
