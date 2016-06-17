(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$mdDialog', '$mdMedia'];

    function LoginService ($mdDialog, $mdMedia) {
        var service = {
            open: open
        };

        var vm = this;

        var modalInstance = null;
        var resetModal = function () {
            modalInstance = null;
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
                    self.openToast('Logged you In');
                }, function() {
                    self.openToast('You Cancelled dialog');
                });
                      
        }

        vm.openToast = function( message ) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent( message )
                    .position('top right')
                    .hideDelay(3000)
                );
        };
        
    }
})();
