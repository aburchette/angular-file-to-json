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
            type: "csv",
            delimiter: ",",
            header: "true",
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
            items,
            i;

        rows = str.split(opts.rowDelimeter);

        opts.header = opts.header && !opts.header === 'false' ? true : false;

        if(opts.header){
            // set keys
            row = rows.shift();
            header = row.split(opts.delimiter);
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