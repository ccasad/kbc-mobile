(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scEmployers', scEmployersFactory);

  scEmployersFactory.$inject = ['$http', 'APP_GLOBALS', 'scUtility', 'scUser'];

  function scEmployersFactory($http, APP_GLOBALS, scUtility, scUser) {
    var scEmployers = {
      getEmployersListByCenterRepId: getEmployersListByCenterRepId,
      getEmployerTabs: getEmployerTabs
    };

    return scEmployers;
    ////////////

    function getEmployersListByCenterRepId() {
      var promise = scUtility.getDefaultPromise();
      var user = scUser.getRootUser();

      if(user.id) {
        var url = 'get-employers-list-by-centerrep-id/' + user.id;

        promise = $http.get(scUtility.getRestBaseUrl() + url).then(function(response) {
          return response.data;
        }, function(){
          return APP_GLOBALS.httpError;
        });

      }

      return promise;
    } // End of getEmployersListByCenterRepId

    function getEmployerTabs() {

      var tabsList = [ {title: 'Correspondence', state: 'user.centerrep.employer.correspondence', access: 'accessLevels.authenticateduser', cssClass: ''},
        // {title: 'Contacts', state: 'user.centerrep.employer.contacts', access: 'accessLevels.authenticateduser', cssClass: ''},
      ];

      return tabsList;

    } // End of getCenterTabs
  }

})();