(function() {
  'use strict';

  angular
    .module('scMessages')
    .controller('ScComposeMessageCtrl', ScComposeMessageCtrl);

  ScComposeMessageCtrl.$inject = ['$state', 'scMessage', 'scUser', '$window', '_', '$ionicHistory'];

  /* @ngInject */
  function ScComposeMessageCtrl($state, scMessage, scUser, $window, _, $ionicHistory) {
    var vm = this;

    vm.user = scUser.getRootUser();

    vm.composeMessageVars = {
      title: $state.current.data.tabTitle,
      messageToList: [],
      messageTxtAreaMaxHeight: ($window.innerHeight - 290)+ 'px', // var w = angular.element($window); // console.log(w.height());
      postMsgInProcess: false,
    };

    vm.setMessageToList = setMessageToList;
    vm.sendMessage = sendMessage;
    vm.goBack = goBack;

    ////////////

    vm.setMessageToList();

    function setMessageToList() {

      var aList = [];

      // if(scUser.isAdmin(vm.user) || scUser.isInstitutionAdmin(vm.user)) {
      //   vm.composeMessageVars.messageToList = [
      //     {'id': scMessage.MESSAGE_TYPE_GLOBAL, 'name': 'For All Users', 'messageTypeId': scMessage.MESSAGE_TYPE_GLOBAL, 'messageTypeTitle': ''},
      //     {'id': scMessage.MESSAGE_TYPE_ADVISOR_GLOBAL, 'name': 'For All Counselors', 'messageTypeId': scMessage.MESSAGE_TYPE_ADVISOR_GLOBAL, 'messageTypeTitle': ''},
      //     {'id': scMessage.MESSAGE_TYPE_ADVISEE_GLOBAL, 'name': 'For All Advisees', 'messageTypeId': scMessage.MESSAGE_TYPE_ADVISEE_GLOBAL, 'messageTypeTitle': ''}
      //   ];
      // }

      // Advisor/Advisee List
      // if(scUser.isStudent(vm.user)){
      //   scAdvisorAdvisee.getAdvisorsByAdviseeId(vm.user.id).then(function(data) {
      //     aList = data;
      //     // forcing just one element in array since student shouldn't be able to pick which advisor right now
      //     aList = (aList.length > 1) ? [aList[0]] : aList;
      //     _.each(aList, function(list) {
      //       list.name = 'My Counselors';  //list.firstName + ' ' + list.lastName;
      //       list.messageTypeId = scMessage.MESSAGE_TYPE_ADVICE;
      //       list.messageTypeTitle = 'Counselors';
      //     });
      //     vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      //   });
      // }else if(scUser.isAdvisor(vm.user)) {
      //   scAdvisorAdvisee.getAdviseesByAdvisorId(vm.user.id, null, true).then(function(data) {
      //     aList =  data;
      //     _.each(aList, function(list) {
      //       list.name = list.firstName + ' ' + list.lastName;
      //       list.messageTypeId = scMessage.MESSAGE_TYPE_ADVICE;
      //       list.messageTypeTitle = 'Advisee';
      //     });
      //     vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      //   });
      // }

      // Peer circle List
      if(vm.user.circles.peer && vm.user.circles.peer.length > 0){
        aList =  vm.user.circles.peer;
          _.each(aList, function(list) {
            list.messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
            list.messageSubTypeId = scMessage.CIRCLE_TYPE_PEER;
            list.messageTypeTitle = '';
            list.JobIdInput = true;
          });
          vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      }

      // Forum circle List
      if(vm.user.circles.forum && vm.user.circles.forum.length > 0){
        aList =  vm.user.circles.forum;
          _.each(aList, function(list) {
            list.messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
            list.messageSubTypeId = scMessage.CIRCLE_TYPE_FORUM;
            list.messageTypeTitle = 'Circles';
          });
          vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      }

      // FF circle List
      // if(vm.user.circles.familyFriends && vm.user.circles.familyFriends.length > 1) { // In case of family login with 2 circles
      //   aList =  vm.user.circles.familyFriends;
      //   _.each(aList, function(list) {
      //     list.messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
      //     list.messageTypeTitle = 'Friend Circle';
      //   });
      //   vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      // }else if(vm.user.circles.familyFriends && vm.user.circles.familyFriends.length === 1) {
      //   aList = [];
      //   aList[0] = vm.user.circles.familyFriends[0];
      //   aList[0].name = 'My Friend Circle'; // + vm.user.circles.familyFriends[0].name;
      //   aList[0].messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
      //   aList[0].messageTypeTitle = 'Friend Circle';
      //   vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      // }

      // Angel circle List
      // if(vm.user.circles.angel && vm.user.circles.angel.length > 1) { // In case of Angel login with 2 circles
      //   aList =  vm.user.circles.angel;
      //   _.each(aList, function(list) {
      //     list.messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
      //     list.messageTypeTitle = 'Angel Circle';
      //   });
      //   vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      // }else if(vm.user.circles.angel && vm.user.circles.angel.length === 1) {
      //   aList = [];
      //   aList[0] = vm.user.circles.angel[0];
      //   aList[0].name = 'My Angel Circle'; // + vm.user.circles.angel[0].name;
      //   aList[0].messageTypeId = scMessage.MESSAGE_TYPE_CIRCLE;
      //   aList[0].messageTypeTitle = 'Angel Circle';
      //   vm.composeMessageVars.messageToList = aList.concat(vm.composeMessageVars.messageToList);
      // }

    } // End of setMessageToList

    function sendMessage(form) {

      //Form validation failed
      if (form.$invalid) {return;}

      if(vm.composeMessageVars.messageTxt) {
        vm.composeMessageVars.postMsgInProcess = true;
        // $ionicLoading.show();

        var composeMessageParams = {
          messageTxt: vm.composeMessageVars.messageTxt,
          messageReferenceId: vm.composeMessageVars.messageReferenceId,
          postedBy: vm.user.id,
          postedTo: 0,
          messageTypeId: vm.composeMessageVars.messageTo.messageTypeId,
        };

        // // Admin log-in : global messages
        // if(scUser.isAdmin(vm.user) || scUser.isInstitutionAdmin(vm.user)){
        //   composeMessageParams.adviseeId = scUtility.getSystemAdminId() ;
        //   composeMessageParams.postedTo = scUtility.getSystemAdminId() ;
        //   // composeMessageParams.messageTypeId =  vm.composeMessageVars.selectedNewMessageTypeId.id ;
        // }

        // if scMessage.MESSAGE_TYPE_CIRCLE
        if(composeMessageParams.messageTypeId === scMessage.MESSAGE_TYPE_CIRCLE) {
          composeMessageParams.circleId = vm.composeMessageVars.messageTo.id;
        }

        // // if scMessage.MESSAGE_TYPE_ADVICE
        // if(composeMessageParams.messageTypeId === scMessage.MESSAGE_TYPE_ADVICE) {
        //   if(scUser.isStudent(vm.user)){
        //     composeMessageParams.adviseeId = vm.user.id;
        //     composeMessageParams.postedTo = vm.composeMessageVars.messageTo.id;
        //   }else if(scUser.isAdvisor(vm.user)) {
        //     composeMessageParams.adviseeId = vm.composeMessageVars.messageTo.id;
        //     composeMessageParams.postedTo = vm.composeMessageVars.messageTo.id;
        //   }
        // }

        scMessage.postMessage(composeMessageParams).then(
          function() {
            // vm.composeMessageVars.messageTxt = '';
            // vm.composeMessageForm.$setPristine();
            // $state.go('user.messages', {}, {reload: true}); //$state.current
            $ionicHistory.goBack();

          }
        ).finally(function() {
          vm.composeMessageParams.postMsgInProcess = false;
          // $ionicLoading.hide();
        });

      }

    } // End of sendMessage

    function goBack() {
      $ionicHistory.goBack();
    } // End of goBack

  }

})();
