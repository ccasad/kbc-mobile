(function() {
  'use strict';

  angular
    .module('scDoMobileApp')
    .config(scIonicConfiguration)
    .config(scHttpConfiguration)
    .run(scRunBlock);

  // scIonicConfiguration
  scIonicConfiguration.$inject = ['$ionicConfigProvider'];
  function scIonicConfiguration($ionicConfigProvider) {
    // http://ionicframework.com/docs/api/provider/$ionicConfigProvider/
    // $ionicConfigProvider.
    // $ionicConfigProvider.platform.ios
    // $ionicConfigProvider.platform.android

    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
    // $ionicConfigProvider.backButton.text(''); // Defaults to Back
    // $ionicConfigProvider.backButton.previousTitleText(true); // This is the default for iOS.

    $ionicConfigProvider.tabs.position('bottom'); // Android defaults to top and iOS defaults to bottom

    $ionicConfigProvider.navBar.alignTitle('center'); // If the platform is ios, it will default to center. If the platform is android, it will default to left. If the platform is not ios or android, it will default to center.
  } // End of scIonicConfiguration

  // scHttpConfiguration
  scHttpConfiguration.$inject = ['$httpProvider'];
  function scHttpConfiguration($httpProvider) {

    // To set SCTOKEN to detect mobile request - specially for avatar response
    // To set $http.defaults.headers.common.USERTOKEN = store.get('scToken'); via $httpProvider for all $http request
    // ToDO : Create scHttpProvider/Factory and move logic to factory file
    // $httpProvider.interceptors.push('scHttpInterceptor');
    // $httpProvider.interceptors.push(['scStorage', function(scStorage) {
    //   return {
    //     'request': function(config) {
    //       config.headers = config.headers || {};
    //       if (!config.headers.SCTOKEN) {
    //         config.headers.SCTOKEN = 'scMobile';
    //       }
    //       var user = scStorage.get('user');
    //       if (user && user.token && !config.headers.USERTOKEN) {
    //         config.headers.USERTOKEN = user.token;
    //       }
    //       return config;
    //     }
    //   };
    // }]);
    $httpProvider.interceptors.push(['$injector', '$cordovaNetwork', '$rootScope', '$q' , 'scAlert',
      function($injector, $cordovaNetwork, $rootScope, $q, scAlert) {
        return {
          'request': function(config) {

            // If Web service call, check for internet connection.
            // if($rootScope.isNetworkAvailable === false && config.url.search('http') >= 0) {
            if($rootScope.isNetworkAvailable === false && config.url.search('.view.html') < 0) {
              // console.log('http req canceler: ' + JSON.stringify(config));
              scAlert.error('Sorry, no Internet connectivity detected. Please reconnect and try again.');

              var canceler = $q.defer();
              config.timeout = canceler.promise;
              // if (true) {
              // Canceling request
              canceler.resolve();
              // }
              return config || $q.when(config);
            } // End of check for internet connection

            // Add SCTOKEN and USERTOKEN in config for all web service calls
            config.headers = config.headers || {};
            if (!config.headers.SCTOKEN) {
              config.headers.SCTOKEN = 'scMobile';
            }
            var scUser = $injector.get('scUser'); // to avoide circular DI with scUser and $http
            var user = scUser.getRootUser();
            if (user && user.token && !config.headers.USERTOKEN) {
              config.headers.USERTOKEN = user.token;
            }
            return config;
          }// ,
          // 'responseError': function(rejection) {
          //   console.log('httperror');
          //   var isOnline = $cordovaNetwork.isOnline();

          //   if(!isOnline) {
          //     console.log('No Network Connection');
          //     $rootScope.isNetworkAvailable = false;
          //   }

          //   return $q.reject(rejection);
          // }
        };
      }
    ]);

  } // End of scHttpConfiguration

  // scRunBlock, Will run after all config
  scRunBlock.$inject = ['$ionicPlatform', 'scUser', '$cordovaDevice', '$rootScope', '$cordovaNetwork', 'APP_GLOBALS'];
  function scRunBlock($ionicPlatform, scUser, $cordovaDevice, $rootScope, $cordovaNetwork, APP_GLOBALS) {
    // When app is launched first time
    // Won't fire if app was already running in background
    $ionicPlatform.ready(function() {
      // Update user info stored at localstorage
      scUser.updateRootUser();

      // Get device info via cordova plugin org.apache.cordova.device
      // returns cordova, model, platform, UUID, and version information
      // {"available":true,"platform":"Android","version":"4.1.1","uuid":"2f2wd64dfd99h0c9","cordova":"3.6.4","model":"SAMSUNG-SGH-I747","manufacturer":"samsung"}
      $rootScope.deviceInfo = {};
      if (window.cordova) {
        $rootScope.deviceInfo = $cordovaDevice.getDevice();
      }

      if (window.cordova && $cordovaDevice.getPlatform() === 'Android' && typeof window.analytics !== undefined) {
        $rootScope.googleAnalyticsKey = APP_GLOBALS.googleAnalyticsAndroidKey;
      }else if(window.cordova && $cordovaDevice.getPlatform() === 'iOS' && typeof window.analytics !== undefined) {
        $rootScope.googleAnalyticsKey = APP_GLOBALS.googleAnalyticsIOSKey;
      }//else { // typeof window.analytics !== undefined
      //   $rootScope.googleAnalyticsKey = APP_GLOBALS.googleAnalyticsKey;
      // }

      if($rootScope.googleAnalyticsKey && $rootScope.googleAnalyticsKey !== '') {
        // $cordovaGoogleAnalytics.startTrackerWithId($rootScope.googleAnalyticsKey);
        window.analytics.startTrackerWithId($rootScope.googleAnalyticsKey);
        // console.log($rootScope.googleAnalyticsKey);

        $rootScope.$on('$stateChangeSuccess',
          function(event, toState){ // , toParams, fromState, fromParams
            // $cordovaGoogleAnalytics.trackView(toState.name);
            window.analytics.trackView(toState.name);
            // console.log(toState.name);
        });

      }


      // Check/Set network check variable via cordova plugin org.apache.cordova.network-information
      if (window.cordova) {
        $rootScope.isNetworkAvailable = $cordovaNetwork.isOnline();
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(){ // function(event, networkState){
          // if(!$rootScope.isNetworkAvailable) {
          //   $state.go($state.current, {}, {reload: true});
          //   // $window.location.reload(true);
          // }
          $rootScope.isNetworkAvailable = true;
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(){ // function(event, networkState){
          $rootScope.isNetworkAvailable = false;
        });
      }

      // Set variable to check at hidden processes to see if app is active/focused
      $rootScope.isAppOnFocus = true;

      // When app was running in background, and resumed
      // Won't fire first time when app is launched
      $ionicPlatform.on('resume', function(){ // $document.addEventListener('resume', function() {
        $rootScope.isAppOnFocus = true;
        if (window.cordova) {
          $rootScope.isNetworkAvailable = $cordovaNetwork.isOnline();
        }
        // $rootScope.$broadcast('scOnResume'); // $rootScope.$emit('scOnResume');
        // scUser.updateRootUser();
      });

      // When app was goes in background
      $ionicPlatform.on('pause', function(){ // $document.addEventListener('pause', function() {
        $rootScope.isAppOnFocus = false;
        // $rootScope.$broadcast('scOnPause'); // $rootScope.$emit('scOnPause');
      });

    });

  } // End of scRunBlock

  // angular
  //   .module('scDoMobileApp')
  //   .factory('scHttpInterceptor', scHttpInterceptorFactory);

  // scHttpInterceptorFactory.$inject = ['scUser'];

  // function scHttpInterceptorFactory(scUser) {
  //   var scHttpInterceptor = {
  //     'request': function(config) {
  //       config.headers = config.headers || {};
  //       if (!config.headers.SCTOKEN) {
  //         config.headers.SCTOKEN = 'scMobile';
  //       }
  //       var user = scUser.getRootUser();
  //       if (user && user.token && !config.headers.USERTOKEN) {
  //         config.headers.USERTOKEN = user.token;
  //       }
  //       return config;
  //     }
  //   };

  //   return scHttpInterceptor;
  // }


})();