(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('ToolbarController', ToolbarController);

    ToolbarController.$inject = ['$mdSidenav'];

    function ToolbarController ($mdSidenav) {
        var vm = this;
        vm.togleSidenav = toggle;

        function toggle() {
			$mdSidenav('mysidenav').toggle();
		}
    }
})();
