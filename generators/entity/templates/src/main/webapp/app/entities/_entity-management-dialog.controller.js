(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>DialogController', <%= entityAngularJSName %>DialogController);

    <%= entityAngularJSName %>DialogController.$inject = ['$mdDialog'];

    function <%= entityAngularJSName %>DialogController ($mdDialog) {
        var vm = this;
        
               
        vm.cancel = function() {
            this.$mdDialog.cancel();
        }
        
        vm.save = function() {
            this.$mdDialog.hide();
        }
        
    }
})();
