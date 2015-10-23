(function() {
  'use strict';

  angular
    .module('scMessages', [
      'kbcMobileApp.core',
    ]);

  angular
    .module('scMessages')
    .config(constantConfiguration)
    .config(routeConfiguration);

  constantConfiguration.$inject = ['APP_GLOBALS'];

  function constantConfiguration(APP_GLOBALS) {
    angular
      .extend(APP_GLOBALS, {
        appMessagesModuleDir: 'sc-messages/',
      });
  }

  routeConfiguration.$inject = ['$stateProvider', 'APP_GLOBALS'];

  function routeConfiguration($stateProvider, APP_GLOBALS) {
    var componentPath = APP_GLOBALS.appModulesPath + APP_GLOBALS.appMessagesModuleDir;

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in componentPath/componentDir
    $stateProvider
      .state('user.messages', {
        // cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/messages',
        views: {
          'user-messages': {
            templateUrl: componentPath+'sc.messages.view.html',
            controller: 'ScMessagesCtrl as vm'
          }
        },
        data: {
          tabTitle: 'Messages',
          messageTemplate: componentPath+'sc.message.view.html',
          messageType: 'All',
          messageDetailState: 'user.message',
          composeMessageState: 'user.compose-message',
          view: 'messages-list',
        },
        resolve:{
          messagesTabDetail: [function(){
            return {};
         }],
        }
      })

      .state('user.circles-messages', {
        // cache: false, // Or set via <ion-view cache-view="false" view-title="My Title!">
        url: '/messages/:circleId',
        views: {
          'user-circles': {
            templateUrl: componentPath+'sc.messages.view.html',
            controller: 'ScMessagesCtrl as vm'
          }
        },
        data: {
          tabTitle: 'Circle Messages',
          messageTemplate: componentPath+'sc.message.view.html',
          messageType: 'ForumCircle',
          messageDetailState: 'user.circles-message',
          composeMessageState: 'user.circles-compose-message',
          view: 'messages-list',
        },
        resolve:{
          messagesTabDetail: ['$stateParams', 'scCircles', function($stateParams, scCircles){
            return scCircles.getCircleById($stateParams.circleId);
         }],
        }
      })

      .state('user.message', {
        cache: false,
        url: '/message/:messageId', //url: '/{id:[0-9]{1,8}}', // we can also add some constraint, like int id only
        views: {
          'user-messages': {
            templateUrl: componentPath+'sc.message-detail.view.html',
            controller: 'ScMessageDetailCtrl as vm'
          }
        },
        data: {
          tabTitle: '',
        }
      })

      .state('user.circles-message', {
        cache: false,
        url: '/circles-message/:messageId', //url: '/{id:[0-9]{1,8}}', // we can also add some constraint, like int id only
        views: {
          'user-circles': {
            templateUrl: componentPath+'sc.message-detail.view.html',
            controller: 'ScMessageDetailCtrl as vm'
          }
        },
        data: {
          tabTitle: '',
        }
      })

      .state('user.compose-message', {
        cache: false,
        url: '/compose-message',
        views: {
          'user-messages': {
            templateUrl: componentPath+'sc.compose-message.view.html',
            controller: 'ScComposeMessageCtrl as vm'
          }
        },
        data: {
          tabTitle: 'Compose',
          messageType: 'All',
        }
      })

      .state('user.circles-compose-message', {
        cache: false,
        url: '/circles-compose-message',
        views: {
          'user-circles': {
            templateUrl: componentPath+'sc.compose-message.view.html',
            controller: 'ScComposeMessageCtrl as vm'
          }
        },
        data: {
          tabTitle: 'Compose',
          messageType: 'ForumCircle',
        }
      });

  }

})();

