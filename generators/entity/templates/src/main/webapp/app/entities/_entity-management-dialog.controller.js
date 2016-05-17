(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .controller('<%= entityAngularJSName %>DialogController', <%= entityAngularJSName %>DialogController);

    <%= entityAngularJSName %>DialogController.$inject = ['$mdDialog'<% for (idx in differentTypes) { %>, '<%= differentTypes[idx] %>'<% } %>];

    function <%= entityAngularJSName %>DialogController ($mdDialog<% for (idx in differentTypes) { %>, <%= differentTypes[idx] %><% } %>) {
        var vm = this;
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
                       
                       
        
               
        vm.cancel = function() {
            $mdDialog.cancel();
        }
        
        vm.save = function() {
            $mdDialog.hide();
        }
        
        
    }
})();
