(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>Controller', <%= entityAngularJSName %>Controller);

    <%= entityAngularJSName %>Controller.$inject = ['$mdDialog', '$mdMedia', '$mdToast','$state'<% if (fieldsContainBlob) { %>, 'DataUtils'<% } %>, '<%= entityClass %>'<% if (searchEngine == 'elasticsearch') { %>, '<%= entityClass %>Search'<% } %><% if (pagination != 'no') { %>, 'ParseLinks'<% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, 'pagingParams', 'paginationConstants'<% } %>];

    function <%= entityAngularJSName %>Controller ($mdDialog, $mdMedia, $mdToast, $state<% if (fieldsContainBlob) { %>, DataUtils<% } %>, <%= entityClass %><% if (searchEngine == 'elasticsearch') { %>, <%= entityClass %>Search<% } %><% if (pagination != 'no') { %>, ParseLinks <% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, pagingParams, paginationConstants<% } %>) {
        var vm = this;
                
        vm.options = {
            boundaryLinks: true,
            limitSelect: true,
            pageSelect: true
        };
        
        vm.selected = [];
        vm.filter = {
          show: false            
        };
        vm.limitOptions = [5, 10, 15];
        
        // Load Entity
        <%_ if (pagination == 'pagination' || pagination == 'pager') { _%>
<%- include('pagination-template'); -%>
        <%_ } else if (pagination == 'infinite-scroll') { _%>
<%- include('infinite-scroll-template'); -%>
        <%_ } else { _%>
<%- include('no-pagination-template'); -%>
        <% } %>
     
        //Delete Entity
        vm.delete<%= entityAngularJSName %> = function(ev, id) {
            var self = this;
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Confirm delete operation')
                .textContent('Are you sure you want to delete this <%= entityClassHumanized %>?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');
                
            $mdDialog.show(confirm).then(function() {
                   <%= entityClass %>.delete({id: id}, 
                   function () {
                       $state.go('<%= entityStateName %>', null, { reload: true });
                   }, function(response) {
                       self.openToast("StatusCode " + response.status + " " + response.data.description);
					
					   console.log(response.data.description);
                   } );                  
                   
                }, function() {
                   self.openToast('You decided to keep <%= entityClassHumanized %>.');
            });
            
        };
        
        // Add new Entity
        vm.add<%= entityAngularJSName %> = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: '<%= entityAngularJSName %>AddDialogController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {
                    self.openToast('User added');
                    $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                    self.openToast('You Cancelled dialog');
                });
          
            
        };
        
        // Add new Entity
        vm.edit<%= entityAngularJSName %> = function(ev, entity) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                self.<%= entityInstance %> = entity;
                
                $mdDialog.show({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: '<%= entityAngularJSName %>EditDialogController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    //locals: {
                    //    <%= entityInstance %>: self.<%= entityInstance %>
                    //},
                    resolve: {
                        <%= entityInstance %>: ['<%= entityClass %>', function(<%= entityClass %>) {
                            return <%= entityClass %>.get({id : self.<%= entityInstance %>.id}).$promise;
                        }]
                    }
                }).then( function() {
                    self.openToast('User edited');
                    $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                    self.openToast('You Cancelled Edit dialog');
                });      
            
        };
        
        vm.paginate<%= entityAngularJSName %> = function (page, limit) {
            console.log('page: ' +  page + ' limit: ' + limit);
			vm.loadPage(page);
        };
        
        vm.logOrder = function (order) {
            console.log('order: ', order);
        };
        
        vm.openToast = function( message ) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent( message )
                    .position('top right')
                    .hideDelay(3000)
                );
        };
    }
    
    
    
})();
