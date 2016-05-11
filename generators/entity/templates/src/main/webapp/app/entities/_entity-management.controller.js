(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>Controller', <%= entityAngularJSName %>Controller);

    <%= entityAngularJSName %>Controller.$inject = ['$mdDialog', '$scope', '$state'<% if (fieldsContainBlob) { %>, 'DataUtils'<% } %>, '<%= entityClass %>'<% if (searchEngine == 'elasticsearch') { %>, '<%= entityClass %>Search'<% } %><% if (pagination != 'no') { %>, 'ParseLinks', 'AlertService'<% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, 'pagingParams', 'paginationConstants'<% } %>];

    function <%= entityAngularJSName %>Controller ($mdDialog, $scope, $state<% if (fieldsContainBlob) { %>, DataUtils<% } %>, <%= entityClass %><% if (searchEngine == 'elasticsearch') { %>, <%= entityClass %>Search<% } %><% if (pagination != 'no') { %>, ParseLinks, AlertService<% } %> <%_ if (pagination == 'pager' || pagination == 'pagination'){ %>, pagingParams, paginationConstants<% } %>) {
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
                    $scope.status = 'You decided to keep <%= entityClassHumanized %>.';
            });
            
        };
        
        
    }
    
    
    
})();
