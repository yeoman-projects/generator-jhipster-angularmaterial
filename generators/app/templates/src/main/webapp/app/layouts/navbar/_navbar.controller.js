(function(){
  'use strict';

  angular.module('<%=angularAppName%>')

    .controller('NavBarCtrl', [
      'menu',
      function (menu) {

        var vm = this;
       
        //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.autoFocusContent = false;
        vm.menu = menu;

        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };


        function isOpen(section) {
          return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
          menu.toggleSelectSection(section);
        }

      }])
})();