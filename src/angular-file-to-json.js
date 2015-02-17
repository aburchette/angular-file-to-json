'use strict';

var ngFileToJson = angular.module('ngFileToJson',[]);

ngFileToJson.directive('ngFileToJson', function(){
    var module,
        createObject;

    module = {
        restrict: 'AE',
        replace: true,
        template: '',
        scope: {
            fileType: "",
            headerField: "true",
            typeField: "false",
            delimiter: ",",
            rowDelimiter: "\n"
        },
        compile: function(){
            var str = '';

            createObject(str, scope);
        }
    };

    // The function that actually converts the string into an object
    createObject = function(str, opts) {
        var obj = [],
            rows,
            row,
            columns,
            header,
            types,
            validTypes = ['String', 'Number', 'Object', 'Boolean', 'Array'],
            items,
            i;

        opts.headerField = opts.headerField && !opts.headerField === 'false' ? true : false;
        opts.typeField = opts.typeField && !opts.typeField === 'false' ? true : false;

        rows = str.split(opts.rowDelimeter);

        if(opts.headerField){
            // set keys
            row = rows.shift();
            header = row.split(opts.delimiter);
        }

        if(opts.typeField){
            // set type
            row = rows.shift();
            types = row.split(opts.delimiter);

            // check for valid types
            for(i = 0; i < types.length; i++){
                if(!(validTypes.indexOf(types[i]) > -1)){
                    types[i] = 'String';
                }
            }
        }

        while(rows.length > 0){
            // set values
            items = {};
            row = rows.shift();
            columns = row.split(opts.delimiter);

            if(header){
                for(i = 0; i < columns.length; i++){
                    items[header[i] || ''] = columns[i];
                }
                obj.push(items);
            } else {
                obj.push(columns);
            }

        }

        return obj;
    };

    // Expose directive
    return module;
});