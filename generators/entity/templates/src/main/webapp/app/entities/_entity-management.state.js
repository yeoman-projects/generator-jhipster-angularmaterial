(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('<%= entityStateName %>', {
            parent: 'entity',
            url: '/<%= entityUrl %><% if (pagination == 'pagination' || pagination == 'pager') { %>?page&sort&search<% } %>',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: <% if (enableTranslation){ %>'<%= angularAppName %>.<%= entityTranslationKey %>.home.title'<% }else{ %>'<%= entityClassPlural %>'<% } %>
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityPluralFileName %>.html',
                    controller: '<%= entityAngularJSName %>Controller',
                    controllerAs: 'vm'
                }
            },
            <%_ if (pagination == 'pagination' || pagination == 'pager'){ _%>
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            <%_ } _%>
            resolve: {
            <%_ if (pagination == 'pagination' || pagination == 'pager'){ _%>
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }]<%= (pagination == 'pagination' || pagination == 'pager' && enableTranslation) ? ',' : '' %>
            <%_ } if (enableTranslation){ _%>
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('<%= entityInstance %>');<%
                    for (var idx in fields) {
                      if (fields[idx].fieldIsEnum == true) { %>
                    $translatePartialLoader.addPart('<%= fields[idx].enumInstance %>');<% }} %>
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            <%_ } _%>
            }
        });
    }

})();
