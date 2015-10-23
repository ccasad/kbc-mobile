(function() {
  'use strict';

  angular
    .module('scDoMobileApp.core')
    .filter('scClipTextByWords', scClipTextByWords);

  scClipTextByWords.$inject = [];

  /* @ngInject */
  function scClipTextByWords() {
    return function(input, maxWords) {
      var wordCount = (!isNaN(maxWords) && maxWords.toString().length && maxWords > 0) ? maxWords : 50;
      var wordsArr = input.split(' ');
      var wordsArrCount = wordsArr.length;
      var wordsShortArr = wordsArr.splice(0, wordCount);
      var output = wordsShortArr.join(' ');

      if (wordCount < wordsArrCount) {
        output += ' <strong class="sc-message-body-more">MORE</strong>';
      }

      return output;
    };
  }

})();
