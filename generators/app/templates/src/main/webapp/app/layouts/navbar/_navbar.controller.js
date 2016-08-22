(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope','$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarController ($scope, $state, Auth, Principal, ProfileService, LoginService) {
        var vm = this;

        vm.isAuthenticated = Principal.isAuthenticated;
        vm.account = null;
        vm.hasAnyAuthority = Principal.hasAnyAuthority;

        vm.login = login;
        vm.logout = logout;
        vm.$state = $state;
        vm.register = register;
        vm.passwordReset = passwordReset;
        vm.hasAuthority = hasAuthority;

        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        function login(ev) {
            LoginService.openLogin(ev);
        }

        function register(ev) {
            LoginService.openRegister(ev);
        }

        function passwordReset(ev) {
            LoginService.openChangePassword(ev);
        }

        function logout() {
            Auth.logout();
            vm.account = null;     
            $state.go('home');
        }

        function hasAuthority(authority) {
            return Principal.hasAnyAuthority([authority]);            
        }

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
    }
})();
