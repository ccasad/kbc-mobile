(function() {
  'use strict';

  angular
    .module('scDoMobileApp.core')
    .directive('scUserAvatar', scUserAvatar);

  scUserAvatar.$inject = ['scUtility'];

  /* @ngInject */
  function scUserAvatar(scUtility) {
      var directive = {
          link: link,
          template: '<img class="{{::cssClass}}" ng-src="{{avatarUrl}}">',
          restrict: 'EA',
          replace: true
      };
      return directive;

      function link(scope, element, attrs) {

        function avatarInit() {

          var scUserAvatar = scope.$eval(attrs.scUserAvatar);
          var cssClass = scUserAvatar.cssClass ? scUserAvatar.cssClass : '';
          // var userAvatar = scUserAvatar.userAvatar ? scUserAvatar.userAvatar : '';

          var imageUrl = scUtility.getImageUrl();

          // if (!userAvatar) {
          //   var user = scUser.getRootUser();
          //   userAvatar = user.avatar;
          // }

          var defaultUrl = imageUrl + 'miscellaneous/user_blank.jpg';
          // if (_.isString(userAvatar) &&  userAvatar.length > 0 && userAvatar.search(imageUrl) < 0) {
          //   // url = 'data:image/jpeg;base64,\/9j\/4A...9CRUOL6sm4\/uf\/Z';
          //   var avatarUrl = scUtility.getRestBaseUrl() + 'avatar/' + userAvatar;
          //   $http.get(avatarUrl)
          //       .then(getAvatarComplete)
          //       .catch(getAvatarFailed);

          // }else if(_.isString(userAvatar) && userAvatar.search(imageUrl) >= 0){
          //   scope.avatarUrl = userAvatar;
          // }else {
          //   scope.avatarUrl = defaultUrl;
          // }
          scope.avatarUrl = defaultUrl;

          // function getAvatarComplete(response) {
          //   if (response.data.status && !response.data.status.success) {
          //     scope.avatarUrl = defaultUrl;
          //     // scLog.log('Error from rest call: ', response.data.status.msg);
          //   }
          //   var urlData = 'data:image/jpeg;base64,'+response.data.data.avatarData;
          //   scope.avatarUrl = urlData;
          // }

          // function getAvatarFailed() {
          //   // Catch and handle exceptions from success/error/finally functions
          //   scope.avatarUrl = defaultUrl;
          //   // scLog.log('call to rest failed with status:'+ error.status, error);
          // }

          scope.cssClass = cssClass;

        } // End of avatarInit

        avatarInit();

      }
  }

})();