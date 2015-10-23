(function() {
  'use strict';

	angular
		.module('scMessages')
		.controller('ScMessagesCtrl', ScMessagesCtrl);

	ScMessagesCtrl.$inject = ['scUtility', '_', 'scUser', '$scope', 'scMessage', '$ionicLoading', '$state', '$interval', 'APP_GLOBALS', '$ionicModal', 'messagesTabDetail', '$stateParams'];

  /* @ngInject */
	function ScMessagesCtrl(scUtility, _, scUser, $scope, scMessage, $ionicLoading, $state, $interval, APP_GLOBALS, $ionicModal, messagesTabDetail, $stateParams) {
		var vm = this;

    var user = scUser.getRootUser();

    var currentYear = new Date().getFullYear();

    vm.messagesTabOnFocus = true;

    vm.monthsList = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Don't update local variable directly, update via vm.messageStreamVars.messageStreamFilterParams
    var messageStreamPropFilters = {
        favoriteYN: 'N',
        msgStatus: 0,
        msgType: 0,
        msgPriority: 0,
        searchText: ''
      };

    var messageStreamFilterParams = {
      getSystemMessages: true,
      getAdviceMessages: true,
      getCircleMessages: true,
      adviseeUserId: 0,
      advisorUserId: 0,
      startUpdatedTime: '',
      endUpdatedTime: '',
      year: 'Recent',
      month: 0,
      propFilters: messageStreamPropFilters,
    };

    vm.messageStreamVars = {
      title: $state.current.data.tabTitle,
      messageTemplate: $state.current.data.messageTemplate,
      displayMsgCount: true,
      showMoreMessagesLink: true,
      loadMessagesInProcess: true,
      noMessagesText: 'No Messages',
      commentDefaultDisplayLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS,
      messageStreamFilterParams: messageStreamFilterParams,
      filterDefaultYear: 'Recent',
      filterDefaultMonth: 0,
      showPropertyFilter: true,
      // propFilters: messageStreamPropFilters,
      MESSAGE_STATUS_READ: scMessage.MESSAGE_STATUS_READ
    };
    vm.messageStreamVars.yearList = [];
    vm.messageStreamVars.yearList[0] = 'Recent';
    for (var i = 1; i <= currentYear - 2012; i++){
      vm.messageStreamVars.yearList[i] = (currentYear - i + 1);
    }

    vm.messages = [];

    vm.state = $state;

    vm.setMessageStreamVars = setMessageStreamVars;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;
    vm.getMessages = getMessages;
    vm.getNewMessages = getNewMessages;
    vm.refreshMessageStream = refreshMessageStream;
    vm.showMoreMessages = showMoreMessages;
    vm.composeMessage = composeMessage;
    vm.showMessageDetail = showMessageDetail;
    vm.filterMessagesByProperties = filterMessagesByProperties;
    vm.getMessageConstant = getMessageConstant;
    // vm.scrollMessageStreamToTop = scrollMessageStreamToTop;
    // vm.onMessageHold = onMessageHold;

    ////////////

    vm.setMessageStreamVars();
    vm.getMessages();

    $scope.$on('$ionicView.enter', function(){
      vm.messagesTabOnFocus = true;
      vm.refreshMessageStream();
    });

    // Temporary polling till we have push notification
    if(APP_GLOBALS.pollingEnabled && !scUser.isAdmin(user) && !scUser.isInstitutionAdmin(user)) {
      // Start/Set message stream polling to get new messages at top of stream (for current page in current scope)
      var messagesPolling = $interval(vm.refreshMessageStream, APP_GLOBALS.pollingInterval); //$interval.cancel(messagesPolling);

      // Stop message stream polling when current scope is distroyed
      $scope.$on('$destroy', function(){
        if (angular.isDefined(messagesPolling)) {
          $interval.cancel(messagesPolling);
          messagesPolling = undefined;
        }
      });
    }

    // $scope.$on('$ionicView.leave', function(){ // Not working on tab change due to ionic bug
    //   vm.messagesTabOnFocus = false;
    // });

    function setMessageStreamVars() {

      if($state.current.data.messageType === 'ForumCircle') { // Forum Circle specific messages

        vm.messageStreamVars.messageStreamFilterParams.getSystemMessages =  false;
        vm.messageStreamVars.messageStreamFilterParams.getAdviceMessages =  false;
        vm.messageStreamVars.messageStreamFilterParams.getCircleMessages =  true;

        vm.messageStreamVars.messageStreamFilterParams.circleId = $stateParams.circleId;

        vm.messageStreamVars.messageStreamFilterParams.propFilters.msgType = scMessage.MESSAGE_TYPE_CIRCLE;
        vm.messageStreamVars.messageStreamFilterParams.propFilters.circleType = scMessage.CIRCLE_TYPE_FORUM;

        vm.messageStreamVars.title = messagesTabDetail.circle.name;

      }else { // All messages

        if(scUser.isStudent(user)){
          vm.messageStreamVars.messageStreamFilterParams.adviseeUserId = user.id ;
        }else {
          vm.messageStreamVars.messageStreamFilterParams.advisorUserId = user.id ;
        }

      }


      $ionicModal.fromTemplateUrl(APP_GLOBALS.appModulesPath + APP_GLOBALS.appMessagesModuleDir + 'sc.messages-filters-modal.view.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

    } // End of setMessageStreamVars

    function showFilters() {
      $scope.modal.show();
    } // End of showFilters

    function applyFilters() {
      if(vm.searchTextUpdate) {
        vm.filterMessagesByProperties();
      }
      $scope.modal.hide();
    } // end of applyFilters

    function hideFilters() {
      $scope.modal.hide();
    } // end of hideFilters

    function clearFilters() {
      // vm.state.go(vm.state.current, {}, {reload: true});

      vm.messageStreamVars.noMessagesText = 'No Messages';
      vm.messages = [];
      vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime = '';
      vm.messageStreamVars.messageStreamFilterParams.endUpdatedTime = '';
      vm.messageStreamVars.filterDefaultYear = 'Recent';
      vm.messageStreamVars.messageStreamFilterParams.year = 'Recent';
      vm.messageStreamVars.messageStreamFilterParams.month = 0;
      vm.messageStreamVars.filterDefaultMonth = 0;

      vm.messageStreamVars.messageStreamFilterParams.propFilters = {
        favoriteYN: 'N',
        msgStatus: 0,
        msgType: 0,
        msgPriority: 0,
        searchText: ''
      };
      vm.messageStreamVars.messageStreamFilterParams.propFilters = vm.messageStreamVars.messageStreamFilterParams.propFilters;

      vm.messageStreamVars.showMoreMessagesLink = true;

      vm.getMessages();
      // vm.filterMessagesByProperties();
      $scope.modal.hide();
    } // end of clearFilters

    function getMessages() {
      vm.messageStreamVars.messageStreamFilterParams.getNewMessagesOnly = false;
      vm.messageStreamVars.loadMessagesInProcess = true;
      $ionicLoading.show();

      scMessage.getMessages(vm.messageStreamVars.messageStreamFilterParams).then(
        function(result) {
          if(vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime === '' && vm.messageStreamVars.messageStreamFilterParams.endUpdatedTime === ''){
            vm.messageStreamVars.messagesCount = result.messageCount;
            if(!_.isEmpty(result.messageStream)) {
              vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime = _.first(result.messageStream).updatedTime;
            }
          }

          if(!_.isEmpty(result.messageStream)) {
            vm.messageStreamVars.messageStreamFilterParams.endUpdatedTime = _.last(result.messageStream).updatedTime;
          }

          var remainingMessageCount = (result.messageCount - scMessage.MAX_NUMBER_DISPLAY_DEFAULT);
          vm.messageStreamVars.remainingMessageCount = remainingMessageCount;

          if(_.isEmpty(result.messageStream) || result.messageStream.length < scMessage.MAX_NUMBER_DISPLAY_DEFAULT || remainingMessageCount < 1){
            vm.messageStreamVars.showMoreMessagesLink = false;

            if(_.isEmpty(vm.messages) && result.messageStream.length > 0){
              vm.messageStreamVars.noMessagesText = '';
            }
          }

          vm.messages = vm.messages.concat(result.messageStream);
        }
      ).finally(function() {
        vm.messageStreamVars.loadMessagesInProcess = false;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
     });
    } // End of getMessages

    function getNewMessages() {
      // if(!vm.checkUserActivity()) {

      vm.messageStreamVars.messageStreamFilterParams.getNewMessagesOnly = true;

      // Remove isNewMsg property of all old messages in next polling before adding new messages on stream top
      // vm.messages = _.each(vm.messages,
      //   function(message) {
      //     _.omit(message, 'isNewMsg');
      //   }
      // );

      scMessage.getMessages(vm.messageStreamVars.messageStreamFilterParams).then(
        function(result) {

          if(!_.isEmpty(result.messageStream)) {
            var newMsgIds = _.pluck(result.messageStream, 'id');
            // var newUnreadMsgCount = _.size(_.where(result.messageStream, {statusId: scMessage.MESSAGE_STATUS_UNREAD}), 'id');

            vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime = _.first(result.messageStream).updatedTime;
            vm.messages = _.reject(vm.messages, function(msg) {
              return (_.indexOf(newMsgIds, msg.id) >= 0);
            });
            vm.messages = result.messageStream.concat(vm.messages);

          }

          vm.messageStreamVars.messageStreamFilterParams.getNewMessagesOnly = false;

        }
      ).finally(function() {
        $scope.$broadcast('scroll.refreshComplete'); // Stop the ion-refresher from spinning
      });

      // }
    } // End of getNewMessages

    function refreshMessageStream() {
      if(!vm.messageStreamVars.loadMessagesInProcess && vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime !== '' && scUtility.isAppOnFocus() && vm.messagesTabOnFocus && $state.current.data.view === 'messages-list'){
        // vm.setMessageStreamVars();
        vm.getNewMessages();
      }else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    } // End of refreshMessageStream

    function showMoreMessages() {
      if(!vm.messageStreamVars.loadMessagesInProcess && vm.messageStreamVars.messageStreamFilterParams.endUpdatedTime !== ''){
        vm.messageStreamVars.noMessagesText = 'No More Messages';
        vm.getMessages();
      }
    } // End of showMoreMessages

    function composeMessage(){
      $state.go($state.current.data.composeMessageState);
    } // End of composeMessage

    function showMessageDetail(messageId){
      $state.go($state.current.data.messageDetailState, { messageId: messageId });
    } // End of showMessageDetail

    function filterMessagesByProperties() { // (event)
      vm.messageStreamVars.noMessagesText = 'No Messages';
      vm.messages = [];
      vm.messageStreamVars.messageStreamFilterParams.startUpdatedTime = '';
      vm.messageStreamVars.messageStreamFilterParams.endUpdatedTime = '';
      // vm.messageStreamVars.filterDefaultYear = 'Recent';
      // vm.messageStreamVars.messageStreamFilterParams.year = '';
      // vm.messageStreamVars.messageStreamFilterParams.month = '';
      // vm.messageStreamVars.filterDefaultMonth = '';
      vm.messageStreamVars.filterDefaultYear = vm.messageStreamVars.messageStreamFilterParams.year;
      vm.messageStreamVars.filterDefaultMonth = vm.messageStreamVars.messageStreamFilterParams.month;

      if(vm.messageStreamVars.messageStreamFilterParams.year === 'Recent') {
        vm.messageStreamVars.filterDefaultMonth = vm.messageStreamVars.messageStreamFilterParams.month = 0;
      }

      // if(parseInt(vm.messageStreamVars.messageStreamFilterParams.month) > 0 && vm.messageStreamVars.messageStreamFilterParams.year === 'Recent'){
      //   vm.messageStreamVars.filterDefaultYear = vm.messageStreamVars.messageStreamFilterParams.year = currentYear;
      // }

      vm.messageStreamVars.messageStreamFilterParams.propFilters = vm.messageStreamVars.messageStreamFilterParams.propFilters;

      // if(vm.messageStreamVars.messageStreamFilterParams.propFilters.msgType !== scMessage.MESSAGE_TYPE_ADVICE){
      //   if(scUser.isStudent()){
      //     vm.messageStreamVars.messageStreamFilterParams.advisorUserId = vm.messageStreamVars.filterAdvisorId = 0;
      //     vm.messageStreamVars.messageStreamFilterParams.getSystemMessages = true;
      //   }else {
      //     vm.messageStreamVars.messageStreamFilterParams.adviseeUserId = vm.messageStreamVars.filterAdviseeId = 0;
      //     vm.messageStreamVars.messageStreamFilterParams.getSystemMessages = true;
      //   }
      // }

      vm.messageStreamVars.showMoreMessagesLink = true;

      vm.getMessages();
    } // End of filterMessages

    function getMessageConstant(key) {
      return scMessage[key]; //return eval('scMessage.'+key);
    } // End of getMessageConstant

    // function scrollMessageStreamToTop() {
    //   $ionicScrollDelegate.$getByHandle('messageStream').scrollTop();
    // } // End of scrollMessageStreamToTop

    // function onMessageHold() { // on-hold="vm.onMessageHold()"
    //    $ionicActionSheet.show({
    //     titleText: 'Things to Do with Message',
    //     destructiveText: 'Red',
    //     destructiveButtonClicked: function() {

    //     },
    //     cancelText: 'Cancel',
    //     cancel: function() {
    //       // add cancel code..
    //     }
    //   });
    // } // End of onMessageHold

	}

})();
