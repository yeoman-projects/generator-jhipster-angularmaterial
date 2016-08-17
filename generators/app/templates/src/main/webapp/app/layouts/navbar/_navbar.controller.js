(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarController ($state, Auth, Principal, ProfileService, LoginService) {
        var vm = this;

        vm.isAuthenticated = Principal.isAuthenticated;
        vm.hasAuthority = Principal.hasAuthority;

        vm.login = login;
        vm.logout = logout;
        vm.$state = $state;
        vm.register = register;
        vm.passwordReset = passwordReset;

        function login(ev) {
            LoginService.open(ev);
        }

        function register(ev) {
            LoginService.register(ev);
        }

        function passwordReset(ev) {
            LoginService.openResetPassword(ev);
        }

        function logout() {
            Auth.logout();
            $state.go('home');
        }

    }
})();
