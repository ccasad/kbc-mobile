// (function(){
//   'use strict';

//   angular.module('kbcMobileApp.core')
//     .factory('scLog', logFactory);

//   logFactory.$inject = ['$http', 'APP_GLOBALS', 'scUtility',];

//   function logFactory($http, APP_GLOBALS, scUtility) {

//     // Public/Static variables
//     scLog.ERROR = 4;
//     scLog.WARNING = 5;
//     scLog.INFO = 7;

//     scLog.error = error;
//     scLog.warning = warning;
//     scLog.info = info;
//     scLog.addLog = addLog;

//     // Return constructor - this is what defines the actual injectable in the DI framework.
//     return scLog;

//     ////////////////

//     // Define the constructor function. To use: new scLog(message, ...)
//     function scLog(message, className, functionName, args) {
//       /*jshint validthis:true */
//       this.message = message;
//       this.className = className;
//       this.functionName = functionName;
//       this.args = args;
//     } // End of scLog constructor

//     ////////////////

//     function error(message, className, functionName, args) {
//       scLog.addLog(message, scLog.ERROR, className, functionName, args);
//     } // End of error

//     function warning(message, className, functionName, args) {
//       scLog.addLog(message, scLog.WARNING, className, functionName, args);
//     } // End of warning

//     function info(message, className, functionName, args) {
//       scLog.addLog(message, scLog.INFO, className, functionName, args);
//     } // End of info

//     function addLog(message, levelId, className, functionName, args) {

//       if (args) {
//         args = JSON.stringify(args);
//       }

//       var data = {
//         'message': message,
//         'class': className,
//         'function': functionName,
//         'args': args,
//         'levelId': levelId
//       };

//       var promise = scUtility.getDefaultPromise();

//       if (data) {
//         promise = $http.post(APP_GLOBALS.restBaseUrl + 'add-log', data).then(
//             function(response) {
//               return response.data;
//             }, function(response) {
//               return APP_GLOBALS.httpError;
//             }
//         );

//         return promise;
//       }

//       return promise;
//     } // End of addLog

//   }

// })();