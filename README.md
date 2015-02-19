# Angular File to JSON

#### Converts files to json object

---

Angular File to JSON is a directive used to convert various files to JSON objects, which can then be used by your application. This directive works with any text file, regardless of the extension, as long as there are delimiters for the rows and columns. Although you may create the files in any text editor, it is encouraged to use a spreadsheet and export the file as a CSV to ensure the columns align.

---

**Note:** *Angular File to JSON is still under active development and may have bugs.*

## Getting Started

**(1)** Download the file at [Repository](https://github.com/aburchette/angular-file-to-json)

**(2)** Install from Bower
 - Open Terminal
 - Install package with `bower install angular-file-to-json`
 - Add `angular-file-to-json/angular-file-to-json.js` to your list of scripts to load
 - Add module `angular-file-to-json` as a dependency to your app
 - Add the directive using an element `<ng-file-to-json></ng-file-to-json>` together with options as attributes

**(3)** Perform your own build
 - Open Terminal
 - Clone the Angular File to JSON repository at [Repository](https://github.com/aburchette/angular-file-to-json)
 - Install npm modules with the command `npm install`
 - Build the script using `grunt`
 - Add `angular-file-to-json/angular-file-to-json.js` to your list of scripts to load
 - Add module `angular-file-to-json` as a dependency to your app
 - Add the directive using an element `<ng-file-to-json></ng-file-to-json>` together with options as attributes

## Basic Usage

At a minimum you should specify the `result` attribute. This is where you will get the JSON result of the file upload.

```html
<ng-file-to-json result="obj"></ng-file-to-json>

<div ng-if="obj">
    <pre>{{ obj }}</pre>
</div>
```

## Options

Here is a list of the options:

 - `result`: Two-way binding returns the result of the directive to the value assigned to 'result'
 - `header-field`: true or false - if true, the first row will be the keys of the other rows
 - `type-field`: true or false - if true, the next row will be used to output the values of the items in the corresponding columns - if false, all the items will be of the String type
 - `delimiter`: this can be any value that separates the items in each row - defaults to ','
 - `row-delimiter`: this can be any value that separates the rows - defaults to '\n'

### Sample element with all the default values

```html
<ng-file-to-json
	result="obj"
    header-field="true"
    type-field="false"
    delimiter=","
    row-delimiter="\n"
    ></ng-file-to-json>
```