(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>Controller', <%= entityAngularJSName %>Controller);
    
    <%= entityAngularJSName %>Controller.$inject = ['$scope', '$state'];

    function <%= entityAngularJSName %>Controller ($scope, $state) {
        var vm = this;
        
        
    }
    
    
})();
