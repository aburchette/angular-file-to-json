'use strict';

var ngFileToJson = angular.module('ngFileToJson',[]);

ngFileToJson.directive('ngFileToJson', function(){
    var module,
        splitColumns,
        createObject,
        cleanUpString,
        createType,
        validTypes = ['string', 'number', 'object', 'boolean', 'array'];

    // module to be returned
    module = {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            result: '=',
            headerField: '=',
            typeField: '=',
            delimiter: '=',
            rowDelimiter: '='
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
            typeField: 'true',
            delimiter: ','
        };

        var obj = [],
            rows,
            row,
            columns,
            header,
            types = [],
            items,
            i,
            value;

        options.headerField = options.headerField && !(options.headerField === 'false') ? true : false;
        options.typeField = options.typeField && !(options.typeField === 'false') ? true : false;

        rows = cleanUpString(str).split('\n');

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
                if(!(validTypes.indexOf(types[i].toLowerCase()) > -1)){
                    types[i] = 'string';
                } else {
                    types[i] = types[i].toLowerCase();
                }
            }
        }

        while(rows.length > 0){
            // set values
            items = {};
            row = rows.shift();
            columns = splitColumns(row, options.delimiter);

            console.log(columns);

            if(header){
                for(i = 0; i < columns.length; i++){
                    if(types.length && types[i]){
                        // if the types array is set
                        value = createType(types[i], columns[i]);
                        items[header[i] || ''] = value;
                    } else {
                        // set the key/value
                        items[header[i] || ''] = columns[i];
                    }
                }
                obj.push(items);
            } else {
                obj.push(columns);
            }

        }

        console.log(obj);

        return obj;
    };

    // special function to split row into columns using a delimiter
    splitColumns = function(row, delimiter){
        var characters = row.split(''),
            inQuotes = false,
            indeces = [],
            i,
            lastIndex = 0,
            columns = [];

        for(i = 0; i < characters.length; i++){
            if(characters[i] === '"'){
                inQuotes = !inQuotes;
            }

            if(!inQuotes && characters[i] === delimiter){
                indeces.push(i);
            }
        }

        if(indeces.length) {
            for(i = 0; i < indeces.length; i++){
                columns.push(row.slice(lastIndex, indeces[i]));
                lastIndex = indeces[i] + 1;
            }
            columns.push(row.slice(lastIndex, characters.length));
        }


        //var quoted = [],
        //    placeholder = '**' + Math.floor(Math.random() * 1000) + '**',
        //    index = 0,
        //    columns;
        //
        //quoted.push(str.replace(/(".*?")/g, placeholder + index));
        //index++;
        //
        //columns = str.split(delimiter);

        //var regex = new RegExp('(".*?"|[^"' + delimiter + ']+|$)', 'g');
        return columns;
    };

    // helper function to clean up line breaks
    // this breaks down the string into characters, removes the carriage return, and builds the string again
    cleanUpString = function(str){
        var arr = str.split(''),
            i;

        // start from the last item since items will be removed which will mess up the loop
        for(i = arr.length - 1; i >=0; i--){
            if(arr[i] === '\r'){
                arr.splice(i, 1);
            }
        }

        str = arr.join('');

        // smart single quotes and apostrophe
        str = str.replace(/[\u2018\u2019\u201Aâ]/g, "\'");
        // smart double quotes
        str = str.replace(/[\u201C\u201D\u201E]/g, "\"");
        // ellipsis
        str = str.replace(/\u2026/g, "...");
        // dashes
        str = str.replace(/[\u2013\u2014]/g, "-");
        // circumflex
        str = str.replace(/\u02C6/g, "^");
        // open angle bracket
        str = str.replace(/\u2039/g, "<");
        // close angle bracket
        str = str.replace(/\u203A/g, ">");
        // spaces
        str = str.replace(/[\u02DC\u00A0]/g, " ");

        return str;
    };

    createType = function(type, value){
        var obj,
            arr;

        switch(type) {
            case 'string':
                return (new String(value)).valueOf();
            case 'number':
                return parseInt(value);
            case 'object':
                if(value) {
                    try {
                        obj = JSON.parse(JSON.stringify(eval("(" + value + ")")));
                    } catch(e){
                        return {};
                    }
                    return obj;
                } else {
                    return {};
                }
            case 'array':
                if(value) {
                    try {
                        obj = [];
                        value = value.replace(/^"?\[|\]"?$/g, '');
                        arr = value.split(',');
                        angular.forEach(arr, function(item) {
                            if((item.toLowerCase().indexOf('true') > -1) || (item.toLowerCase().indexOf('false') > -1)){
                                obj.push(createType('boolean', item));
                            } else if(item.indexOf('{') > -1){
                                obj.push(createType('object', item));
                            } else if(item.indexOf('[') > -1){
                                obj.push(createType('array', item));
                            } else if(item.indexOf("'") > -1){
                                item = item.replace(/["']/g, '');
                                obj.push(createType('string', item));
                            } else if(item.match(/\d/)){
                                obj.push(createType('number', item));
                            }
                        });
                    } catch(e){
                        return [];
                    }
                    return obj;
                } else {
                    return [];
                }
            case 'boolean':
                return (new Boolean(value.toLowerCase())).valueOf();
            default:
                return (new String(value)).valueOf();
        }
    };

    // Expose directive
    return module;
});
