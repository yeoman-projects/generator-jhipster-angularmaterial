(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>DialogController', <%= entityAngularJSName %>DialogController);

    <%= entityAngularJSName %>DialogController.$inject = ['<%= entityClass %>'];

    function <%= entityAngularJSName %>DialogController (<%= entityClass %> ) {
        var vm = this;
        
               

        
    }
})();
