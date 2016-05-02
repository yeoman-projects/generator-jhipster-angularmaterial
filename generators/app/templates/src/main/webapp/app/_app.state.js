(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('MainController', function () {
            this.entities = [
                { name: 'Author' },
                { name: 'Book' }
            ];
        });

})();
