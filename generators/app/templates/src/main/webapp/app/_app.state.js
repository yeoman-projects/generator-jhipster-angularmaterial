(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig)
        .filter('nospace', function () {
            return function (value) {
                return (!value) ? '' : value.replace(/ /g, '');
            };
        })
        .filter('humanizeDoc', function () {
            return function (doc) {
                if (!doc) return;
                if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function ($1) {
                    return '-' + $1.toLowerCase();
                });
                }

                return doc.label || doc.name;
            };
        });

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ]<% if (enableTranslation) { %>,
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]<% } %>
            }
        });
    }
})();
