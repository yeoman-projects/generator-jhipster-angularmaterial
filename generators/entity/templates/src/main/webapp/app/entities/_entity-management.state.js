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
            url: '/<%= entityUrl %>',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '<%= entityClassPlural %>'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityPluralFileName %>.html',
                    controller: '<%= entityAngularJSName %>Controller',
                    controllerAs: 'vm'
                }
            }
        })
        .state('<%= entityStateName %>-detail', {
            parent: 'entity',
            url: '/<%= entityUrl %>/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: '<%= entityClass %>'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-detail.html',
                    controller: '<%= entityAngularJSName %>DetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', '<%= entityClass %>', function($stateParams, <%= entityClass %>) {
                    return <%= entityClass %>.get({id : $stateParams.id});
                }]
            }
        })
        .state('<%= entityStateName %>.new', {
            parent: '<%= entityStateName %>',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-dialog.html',
                    controller: '<%= entityAngularJSName %>DialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                <%_ for (idx in fields) { _%>
                                    <%_ if (fields[idx].fieldType == 'Boolean' && fields[idx].fieldValidate == true && fields[idx].fieldValidateRules.indexOf('required') != -1) { _%>
                                <%= fields[idx].fieldName %>: false,
                                    <%_ } else { _%>
                                <%= fields[idx].fieldName %>: null,
                                        <%_ if (fields[idx].fieldType == 'byte[]' && fields[idx].fieldTypeBlobContent != 'text') { _%>
                                <%= fields[idx].fieldName %>ContentType: null,
                                        <%_ } _%>
                                    <%_ } _%>
                                <%_ } _%>
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                    $state.go('<%= entityStateName %>');
                });
            }]
        })
        .state('<%= entityStateName %>.edit', {
            parent: '<%= entityStateName %>',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-dialog.html',
                    controller: '<%= entityAngularJSName %>DialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['<%= entityClass %>', function(<%= entityClass %>) {
                            return <%= entityClass %>.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('<%= entityStateName %>.delete', {
            parent: '<%= entityStateName %>',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-delete-dialog.html',
                    controller: '<%= entityAngularJSName %>DeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['<%= entityClass %>', function(<%= entityClass %>) {
                            return <%= entityClass %>.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
