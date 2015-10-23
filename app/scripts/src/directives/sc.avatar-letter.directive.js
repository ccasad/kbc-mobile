(function() {
  'use strict';

  // <div data-sc-avatar-letter="sc-avatar-letter" data-avatar-class="sc-inline-block" data-avatar-size="lg" data-background-class="warning" data-ng-bind="headerVm.user.firstName.charAt(0)"></div>

  angular
  .module('scDoMobileApp.core')
  .directive('scAvatarLetter', scAvatarLetter);

  scAvatarLetter.$inject = [];

  /* @ngInject */
  function scAvatarLetter() {
    var directive = {
        link: link,
        restrict: 'A',
        scope: {
          backgroundClass: '@',
          avatarSize: '@',
          avatarClass: '@'
        }
      };
    return directive;

    function link(scope, element) {
      if (scope.avatarSize) {
        element.addClass('sc-avatar-letter-'+scope.avatarSize);
      } else {
        element.addClass('sc-avatar-letter-md');
      }

      if (scope.backgroundClass) {
        element.addClass('sc-background-'+scope.backgroundClass);
      } else {
        element.addClass('sc-background-warning');
      }

      if(scope.avatarClass) {
        element.addClass(scope.avatarClass);
      }else {
        element.addClass('pull-left');
      }

    }
  }
})();
