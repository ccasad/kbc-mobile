// kbcMobileApp

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'kbcMobileApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function() {
  'use strict';

  /* 3rd-party Lib Wrapper Modules */
  angular
    .module('scLodash', []);
  angular
    .module('scMoment', []);

  // Cross App Core Modules
  angular
    .module('kbcMobileApp.core', [

      /* Angular Modules */
      'angular-storage',
      'angular-jwt',
      'ngSanitize',
      'ngAnimate',
      'ui.bootstrap',

      /* Cross App modules */
      // 'blocks.logger',

      /* 3rd-party Modules */
      'ionic',
      'auth0',
      'ngCordova',
      'angular-capitalize-filter',
      'monospaced.elastic',
      'formlyIonic',

      /* App ENV constants - generated via grunt as per ENV */
      'kbcMobileApp.constants',

      /* 3rd-party Lib Wrapper Modules */
      'scLodash', // Lodash js lib as DI
      'scMoment', // Moment js lib as DI

    ]);

  // Main App Core Modules
  angular
    .module('kbcMobileApp', [

      /* Shared Modules */
      'kbcMobileApp.core',

      /* Feature Modules */
      'scAuth',
      'scStorage',
      'scLayout',
      //'scMessages',
      //'scJobs',
      //'scCircles',
      'scStats',
      'scUserAccount',
    ]);

  angular
    .module('kbcMobileApp.core')
    .run(runBlock);

    runBlock.$inject = ['$ionicPlatform'];

    function runBlock($ionicPlatform) {
      // $ionicPlatform.ready(() => {
      $ionicPlatform.ready(function() { // es6 to es5 syntax
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }

      });
    }

})();