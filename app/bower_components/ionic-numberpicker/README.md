##Introduction:

This is a `ionic-numberpicker` bower component which can be used with any Ionic framework's application.

It is based on the 'ionic-timepicker' and 'ionic-datepicker' by https://github.com/rajeshwarpatlolla 


##Prerequisites.

1) node.js, npm, ionic, bower and gulp.

##How to use:

1) In your project repository install the ionic time picker using bower

`bower install ionic-numberpicker --save`

2) Give the path of  `ionic-numberpicker.bundle.min.js` in your `index.html` file.

````html
<!-- path to ionic/angularjs js -->
<script src="lib/ionic-numberpicker/dist/ionic-numberpicker.bundle.min.js"></script>
````    

3) In your application module inject the dependency `ionic-numberpicker`, in order to work with the `ionic-numberpicker` component

````javascript
angular.module('modulename', ['ionic', 'ionic-numberpicker']){

}
````

4) Use the below format in your template's corresponding controller

````javascript
$scope.numberPickerObject = {
    inputValue: 0, //Optional
    minValue: -9007199254740991,
    maxValue: 9007199254740991,
    decimalCharacter: '.',  //Optional
    decimalStep: 0.25,  //Optional
    format: "DECIMAL",  //Optional - "WHOLE" or "DECIMAL"
    titleLabel: 'Number Picker',  //Optional
    setLabel: 'Set',  //Optional
    closeLabel: 'Close',  //Optional
    setButtonType: 'button-positive',  //Optional
    closeButtonType: 'button-stable',  //Optional
    callback: function (val) {    //Mandatory
    timePickerCallback(val);
  }
};
````

##Versions:

### 1) v1.0.1
 - Fixed decimalStep issue
 - Added functionality to allow control over character used for decimal place ('decimalCharacter').

### 2) v1.0.0
Number picker functionality has been implemented, and can be installed with 

bower install ionic-numberpicker --save

##License:
[MIT](https://github.com/milkcan/ionic-numberpicker/blob/master/LICENSE.MD "MIT")

##Contact:
email : admin@milkcan.io

Rate it or Comment : http://market.ionic.io/plugins/ionic-numberpicker