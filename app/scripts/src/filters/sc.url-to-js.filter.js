(function() {
  'use strict';

  angular
    .module('scDoMobileApp.core')
    .filter('scUrlToJs', scUrlToJs);

  scUrlToJs.$inject = ['$sce'];

  /* @ngInject */
  function scUrlToJs($sce) {
    return function (url, text) {
      var newString = '<a class="sc-href" onclick="window.open(\''+url+'\', \'_system\', \'location=yes\')">'+text+'</a>';
      var html = $sce.trustAsHtml(newString);
      return html;
    };
  }

})();