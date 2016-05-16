(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>Controller', <%= entityAngularJSName %>Controller);

    <%= entityAngularJSName %>Controller.$inject = ['$mdDialog', '$mdMedia', '$mdToast','$state'<% if (fieldsContainBlob) { %>, 'DataUtils'<% } %>, '<%= entityClass %>'<% if (searchEngine == 'elasticsearch') { %>, '<%= entityClass %>Search'<% } %><% if (pagination != 'no') { %>, 'ParseLinks', 'AlertService'<% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, 'pagingParams', 'paginationConstants'<% } %>];

    function <%= entityAngularJSName %>Controller ($mdDialog, $mdMedia, $mdToast, $state<% if (fieldsContainBlob) { %>, DataUtils<% } %>, <%= entityClass %><% if (searchEngine == 'elasticsearch') { %>, <%= entityClass %>Search<% } %><% if (pagination != 'no') { %>, ParseLinks, AlertService<% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, pagingParams, paginationConstants<% } %>) {
        var vm = this;
                
        vm.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        
        vm.selected = [];
        vm.filter = {
          show: false            
        };
        vm.query = {
            filter: '',
            limit: '5',
            order: 'nameToLower',
            page: 1,

        };
        
     
        
        vm.delete<%= entityAngularJSName %>Dialog = function(ev, id) {
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
                   <%= entityClass %>.delete({id: id} );
                   $state.go('<%= entityStateName %>', null, { reload: true });
                }, function() {
                   self.openToast('You decided to keep <%= entityClassHumanized %>.');
            });
            
        };
        
        vm.add<%= entityAngularJSName %>Dialog = function(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs') );
                var self = this;
                
                $mdDialog.show({
                    templateUrl: 'app/entities/<%= entityFolderName %>/<%= entityFileName %>-dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: '<%= entityAngularJSName %>DialogController',
                    controllerAs: 'vm',
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                }).then( function() {
                    self.openToast('User added');
                }, function() {
                    self.openToast('You Cancelled dialog');
                });
          
            
        };
        
        vm.openToast = function( message ) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent( message )
                    .position('top right')
                    .hideDelay(3000)
                );
        }
    }
    
    
    
})();
