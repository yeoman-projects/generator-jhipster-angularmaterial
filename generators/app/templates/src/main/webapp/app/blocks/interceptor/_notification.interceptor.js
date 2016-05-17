(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .factory('notificationInterceptor', notificationInterceptor);

    notificationInterceptor.$inject = ['$q' ];

    function notificationInterceptor ($q ) {
        var service = {
            response: response
        };

        return service;

        function response (response) {
            var alertKey = response.headers('X-<%=angularAppName%>-alert');
            if (angular.isString(alertKey)) {
                
            }
            return response;
        }
    }
})();
