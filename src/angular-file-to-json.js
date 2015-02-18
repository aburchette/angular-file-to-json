'use strict';

var ngFileToJson = angular.module('ngFileToJson',[]);

ngFileToJson.directive('ngFileToJson', function(){
    var module,
        createObject,
        cleanLineBreaks;

    // module to be returned
    module = {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            result: '='
        },
        //templateUrl: './templates/angular-file-to-json.html',
        template: '<div><input ng-model="uploadFile" type="file"></div>',
        link: function(scope, element){
            element.on('change', function(event){
                var str = '',
                    uploadedFile = new FileReader();

                uploadedFile.readAsBinaryString(event.target.files[0]);

                uploadedFile.onload = function(e){
                    scope.$apply(function(){
                        str = e.target.result;
                        scope.result = createObject(str);
                    });
                };
            });
        }
    };

    // The function that actually converts the string into an object
    createObject = function(str) {
        var options = {
            fileType: '',
            headerField: 'true',
            typeField: 'false',
            delimiter: ','
        };

        var obj = [],
            rows,
            row,
            columns,
            header,
            types,
            validTypes = ['String', 'Number', 'Object', 'Boolean', 'Array'],
            items,
            i;

        options.headerField = options.headerField && !(options.headerField === 'false') ? true : false;
        options.typeField = options.typeField && !options.typeField === 'false' ? true : false;

        rows = cleanLineBreaks(str).split('\n');

        if(options.headerField){
            // set keys
            row = rows.shift();
            header = row.split(options.delimiter);
        }

        if(options.typeField){
            // set type
            row = rows.shift();
            types = row.split(options.delimiter);

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
            columns = row.split(options.delimiter);

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

    // helper function to clean up line breaks
    cleanLineBreaks = function(str){
        var arr = str.split(''),
            i;

        for(i = arr.length - 1; i >=0; i--){
            if(arr[i] === '\r'){
                arr.splice(i, 1);
            }
        }

        return arr.join('');
    };

    // Expose directive
    return module;
});