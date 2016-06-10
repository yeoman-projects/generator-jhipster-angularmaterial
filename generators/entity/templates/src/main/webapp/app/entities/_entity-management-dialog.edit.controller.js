(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>EditDialogController', <%= entityAngularJSName %>DialogController);

    <%= entityAngularJSName %>DialogController.$inject = ['$scope','<%= entityInstance %>','$mdDialog'<% for (idx in differentTypes) { %>, '<%= differentTypes[idx] %>'<% } %><% if (fieldsContainBlob) { %>, 'DataUtils'<% } %>];

    function <%= entityAngularJSName %>DialogController ($scope,<%= entityInstance %>, $mdDialog<% for (idx in differentTypes) { %>, <%= differentTypes[idx] %><% } %><% if (fieldsContainBlob) { %>, DataUtils<% } %>) {
        var vm = this;
        
        vm.<%= entityInstance %> = <%= entityInstance %>;
		
		 <%_ if (fieldsContainBlob) { _%>
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        <%_ } _%>
        
        <%_
            var queries = [];
            for (idx in relationships) {
                var query;
                if (relationships[idx].relationshipType == 'one-to-one' && relationships[idx].ownerSide == true && relationships[idx].otherEntityName != 'user') {
                    query = 'vm.' + relationships[idx].relationshipFieldName.toLowerCase() + 's = ' + relationships[idx].otherEntityNameCapitalized + ".query({filter: '" + relationships[idx].otherEntityRelationshipName.toLowerCase() + "-is-null'});"
                + "\n        $q.all([vm." + entityInstance + ".$promise, vm." + relationships[idx].relationshipFieldName.toLowerCase() + "s.$promise]).then(function() {";
                    if (dto == "no"){
                        query += "\n            if (!vm." + entityInstance + "." + relationships[idx].relationshipFieldName + " || !vm." + entityInstance + "." + relationships[idx].relationshipFieldName + ".id) {"
                    } else {
                        query += "\n            if (!vm." + entityInstance + "." + relationships[idx].relationshipFieldName + "Id) {"
                    }
                    query += "\n                return $q.reject();"
                + "\n            }"
                + "\n            return " + relationships[idx].otherEntityNameCapitalized + ".get({id : vm." + entityInstance + "." + relationships[idx].relationshipFieldName + (dto == 'no' ? ".id" : "Id") + "}).$promise;"
                + "\n        }).then(function(" + relationships[idx].relationshipFieldName + ") {"
                + "\n            vm." + relationships[idx].relationshipFieldNamePlural.toLowerCase() + ".push(" + relationships[idx].relationshipFieldName + ");"
                + "\n        });";
                } else {
                    query = 'vm.' + relationships[idx].otherEntityNameCapitalizedPlural.toLowerCase() + ' = ' + relationships[idx].otherEntityNameCapitalized + '.query();';
                }
                if (!contains(queries, query)) {
                    queries.push(query);
                }
            }
        _%><% for (idx in queries) { %>
        <%- queries[idx] %><% } %>
        
        <%_ for (idx in fields) {
            var fieldName = fields[idx].fieldName;
                        
            if (fields[idx].fieldIsEnum) { 
                            
               var values = fields[idx].fieldValues.replace(/\s/g, '');
               _%>
               
               vm.<%= fieldName %>Values = ('<%= values %>').split(',').map(function(enumValue) { return {value: enumValue }  } );
                  
               
            <%_   
            }        
                       
           }     _%>       
                       
                       
        var onSaveSuccess = function (result) {
            var self = this;
            
        };

        var onSaveError = function () {
            var self = this;

        };
               
        vm.cancel = function() {
            $mdDialog.cancel();
        }
        
        vm.save = function() {
            if (vm.<%= entityInstance %>.id !== null) {
                <%= entityClass %>.update(vm.<%= entityInstance %>, onSaveSuccess, onSaveError);
            } else {
                <%= entityClass %>.save(vm.<%= entityInstance %>, onSaveSuccess, onSaveError);
            }
            $mdDialog.hide();
        }
		
		<%_ for (idx in fields) {
            if ((fields[idx].fieldType === 'byte[]' || fields[idx].fieldType === 'ByteBuffer') && fields[idx].fieldTypeBlobContent !== 'text') { _%>

        vm.set<%= fields[idx].fieldNameCapitalized %> = function ($file, <%= entityInstance %>) {
            <%_ if (fields[idx].fieldTypeBlobContent === 'image') { _%>
            if ($file && $file.$error === 'pattern') {
                return;
            }
            <%_ } _%>
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        vm.<%= entityInstance %>.<%= fields[idx].fieldName %> = base64Data;
                        vm.<%= entityInstance %>.<%= fields[idx].fieldName %>ContentType = $file.type;
                    });
                });
            }
        };
        <%_ } } _%>
        
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
