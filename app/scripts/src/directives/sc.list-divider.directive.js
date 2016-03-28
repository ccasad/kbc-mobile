// Originally built by: Andrew McGivery https://github.com/andrewmcgivery/ionic-ion-autoListDivider

(function() {
  'use strict';

  angular
  .module('kbcMobileApp.core')
  .directive('scListDivider', scListDivider);

  scListDivider.$inject = ['$timeout'];

  /* @ngInject */
  function scListDivider($timeout) {
  	var lastDivideKey = '';
    var directive = {
        link: link,
        restrict: 'A',
        scope: {}
      };
    return directive;

    function link(scope, element, attrs) {
      var key = attrs.listDividerValue;

			var defaultDivideFunction = function(k) {
				return k.slice(0, 1).toUpperCase();
			};
      
			var doDivide = function() {
				var divideFunction = scope.$apply(attrs.listDividerFunction) || defaultDivideFunction;
				var divideKey = divideFunction(key);
				
				if (divideKey !== lastDivideKey) { 
					var contentTr = angular.element('<div class="item item-divider">'+divideKey+'</div>');
					element[0].parentNode.insertBefore(contentTr[0], element[0]);
				}

				lastDivideKey = divideKey;
			};
		  
			$timeout(doDivide, 0);
    }
  }
})();
