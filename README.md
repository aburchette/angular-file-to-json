# Angular File to JSON

#### Convert files to json object

---

Angular File to JSON is a directive used to convert various files to JSON objects, which can then be used by Angular
applications.

---

## Getting Started

 - Open Terminal
 - Get **[Bower](http://bower.io)** package: `$ bower install angular-file-to-json`
 - Add `angular-file-to-json/angular-file-to-json.js` to your list of scripts to load
 - Add module `angular-file-to-json` as a dependency to your app
 - Add the directive one of two ways:
 -- Add the element `<ng-file-to-json></ng-file-to-json>` together with options as attributes
 -- Add the attribute `ng-file-to-json` to an element to use default attributes

## Options

Here are the options, shown with the defaults:

>
```html
<ng-file-to-json
    type="csv"
    delimiter=","
    header="true"
    rowDelimiter="\n"
    ></ng-file-to-json>