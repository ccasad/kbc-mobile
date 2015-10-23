(function() {
  'use strict';

  angular
    .module('kbcMobileApp.core')
    .factory('scMessage', scMessageFactory);

  // ToDo : remove APP_GLOBALS DI, use via utility functions
  scMessageFactory.$inject = ['APP_GLOBALS', 'scUtility', '$http', '$filter', '_', 'scUser', 'scAlert'];

  /* @ngInject */
  function scMessageFactory(APP_GLOBALS, scUtility, $http, $filter, _, scUser, scAlert) {

    // Public/Static variables
    scMessage.MAX_NUMBER_DISPLAY_DEFAULT = 5;
    scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS = 2;

    scMessage.MESSAGE_STATUS_UNREAD = 1;
    scMessage.MESSAGE_STATUS_READ = 2;
    scMessage.MESSAGE_STATUS_ARCHIVED = 3;

    scMessage.MESSAGE_PRIORITY_HIGH = 1;
    scMessage.MESSAGE_PRIORITY_NORMAL = 2;
    scMessage.MESSAGE_PRIORITY_LOW = 3;

    scMessage.MESSAGE_TYPE_WELCOME = 1;
    scMessage.MESSAGE_TYPE_ADVICE = 2;
    scMessage.MESSAGE_TYPE_GLOBAL = 3;
    scMessage.MESSAGE_TYPE_ADVISOR_GLOBAL = 4;
    scMessage.MESSAGE_TYPE_ADVISEE_GLOBAL = 5;
    scMessage.MESSAGE_TYPE_GROUP = 6;
    scMessage.MESSAGE_TYPE_CIRCLE = 7;
    scMessage.MESSAGE_TYPE_SUPPORT_TEAM_GLOBAL = 8;
    scMessage.MESSAGE_TYPE_ANGEL_GLOBAL = 9;
    scMessage.MESSAGE_TYPE_FAMILY_GLOBAL = 10;
    scMessage.MESSAGE_TYPE_FRIEND_GLOBAL = 11;
    scMessage.MESSAGE_TYPE_ADVISOR_ADVISEE_GLOBAL = 12;
    scMessage.MESSAGE_TYPE_CENTERREP_BUSINESSREP_GLOBAL = 13;
    scMessage.MESSAGE_TYPE_CENTERREP_GLOBAL = 14;
    scMessage.MESSAGE_TYPE_BUSINESSREP_GLOBAL = 15;

    scMessage.CIRCLE_TYPE_PEER = APP_GLOBALS.circles.peer.typeId;
    scMessage.CIRCLE_TYPE_FAMILY_AND_FRIENDS = APP_GLOBALS.circles.familyFriends.typeId;
    scMessage.CIRCLE_TYPE_ANGEL = APP_GLOBALS.circles.angel.typeId;
    scMessage.CIRCLE_TYPE_FORUM = APP_GLOBALS.circles.forum.typeId;

    scMessage.setMessage = setMessage;
    scMessage.getMessage = getMessage;
    scMessage.getMessages = getMessages;
    scMessage.postMessage = postMessage;
    scMessage.getRootUserUnreadMessageCount = getRootUserUnreadMessageCount;

    scMessage.prototype = {
      getPersonTypeCssClassName: getPersonTypeCssClassName,
      showMoreComments: showMoreComments,
      getComments: getComments,
      addComment: addComment,
      postComment: postComment,
      updateMessagePriority: updateMessagePriority,
      updateMessageRate: updateMessageRate,
      updateMessageStatus: updateMessageStatus,
      postMessageProperty: postMessageProperty,
    };

    // Return constructor - this is what defines the actual injectable in the DI framework.
    return scMessage;

    ////////////////

    // Define the constructor function. To use: new scMessage(id,parentId ...)
    function scMessage(id, parentId, adviseeId, postedBy, postedTo, bodyMarkup, bodyHtml, referenceId, createdTime, updatedTime) {
      /*jshint validthis:true */
      this.id = id;
      this.parentId = parentId;

      this.adviseeId = adviseeId;
      this.postedBy = postedBy;
      this.postedTo = postedTo;

      this.bodyMarkup = bodyMarkup;
      this.bodyHtml = bodyHtml;

      this.referenceId = referenceId;

      this.createdTime = createdTime;
      this.updatedTime = updatedTime;
    } // End of scMessage constructor

    ////////////////

    function setMessage(message) {
      var scMsg =  new scMessage(
        message.id,
        message.parentId,
        message.adviseeId,
        message.postedBy,
        message.postedTo,
        message.bodyMarkup,
        message.bodyHtml,
        message.referenceId,
        scUtility.mysqlTimeStampToDate(message.createdTime),
        scUtility.mysqlTimeStampToDate(message.updatedTime)
      );

      scMsg.loadCommentsInProcess = false;

      scMsg.favoriteYn = message.favoriteYn;
      scMsg.priorityId = message.priorityId;
      scMsg.priority = message.priority;
      scMsg.priorityClass = (message.priority === 'High' ? 'btn-danger' : (message.priority === 'Low' ? 'btn-success' : 'btn-info'));
      scMsg.statusId = message.statusId;

      scMsg.typeId = message.typeId;

      scMsg.messageCommentCount = message.messageCommentCount;

      scMsg.postedByFirstName = message.postedByFirstName;
      scMsg.postedByLastName = message.postedByLastName;

      scMsg.postedByAvatar = message.postedByAvatar; //scMessage.getAvatarUrl({avatar:message.postedByAvatar});

      scMsg.postedByTitle = '';
      if(message.typeId === scMessage.MESSAGE_TYPE_CIRCLE) {
        scMsg.circleTypeId = message.circleTypeId;
        scMsg.postedByTitle = message.circleName; // + ' - ';
        //scMsg.postedByAvatar = scUtility.getMainUrl() + '/images/miscellaneous/circles_icon.png';

        if (scMsg.circleTypeId === APP_GLOBALS.circles.familyFriends.typeId) {
          scMsg.postedByTitle = 'Friend Circle for ' + message.circleContactFirstName + ' ' + message.circleContactLastName;
        } else if (scMsg.circleTypeId === APP_GLOBALS.circles.angel.typeId) {
          scMsg.postedByTitle = 'Angel Circle for ' + message.circleContactFirstName + ' ' + message.circleContactLastName;
        }

      }

      // scMsg.displayTitle = '';
      // if(!message.isSystemMessage) {
      //   scMsg.displayTitle = scMsg.displayTitle + message.postedByFirstName+' '+message.postedByLastName;
      // }
      // if(scMsg.postedByTitle && !message.isSystemMessage){
      //   scMsg.displayTitle = scMsg.displayTitle + ' > '; // ' <span class="glyphicon glyphicon-play sc-font-small text-muted sc-message-header-title-play-icon"> </span> '; // ion-android-arrow-dropright
      // }
      // if(scMsg.postedByTitle) {
      //   scMsg.displayTitle = scMsg.displayTitle + scMsg.postedByTitle;
      // }
      // if(message.messageCommentCount) {
      //   scMsg.displayTitle = scMsg.displayTitle + ' <span class="text-muted" >('+ (message.messageCommentCount + 1) +')</span>';
      // }

      return scMsg;
    } // End of setMessage

    function getMessage(messageParams) {

      // $http returns a promise, which has a then function, which also returns a promise
      var promise =
        $http.get(scUtility.getRestBaseUrl() + 'message/' + messageParams.messageId + '/' + messageParams.commentDefaultDisplayLimit).then(
          function (response) { // success handler
            var messagesOut = [];

            if(!_.isObject(response.data.status) || response.data.status.success !== true) {
              scAlert.error('There was an issue retrieving message. Please try again.');
            }

            if(_.isObject(response.data.data)) {
              var messages = response.data.data.messages; //var data = response.data, status = response.status, header = response.header, config = response.config;

              var mId = 0;
              if(!_.isEmpty(messages)) {
                _.each(messages, function(message) {
                  if(message.parentId < 1){
                    mId = message.id;
                    messagesOut[mId] = scMessage.setMessage(message);
                    messagesOut[mId].comments = [];
                    messagesOut[mId].showMoreCommentsLink = false;
                    messagesOut[mId].typeId = message.typeId;

                    messagesOut[mId].isSystemMessage =  _.contains([scMessage.MESSAGE_TYPE_WELCOME, scMessage.MESSAGE_TYPE_GLOBAL, scMessage.MESSAGE_TYPE_ADVISOR_GLOBAL, scMessage.MESSAGE_TYPE_ADVISEE_GLOBAL], message.typeId) ? true : false;
                    if(messagesOut[mId].isSystemMessage) {
                      messagesOut[mId].postedByTitle = messagesOut[mId].postedByFirstName+ ' '+ messagesOut[mId].postedByLastName;
                    }

                    if(message.typeId === scMessage.MESSAGE_TYPE_CIRCLE) {
                      if(message.circleTypeId === scMessage.CIRCLE_TYPE_PEER) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_peer_icon.png';
                      }else if(message.circleTypeId === scMessage.CIRCLE_TYPE_FAMILY_AND_FRIENDS) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_ff_icon.png';
                      }else if(message.circleTypeId === scMessage.CIRCLE_TYPE_ANGEL) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_angel_icon.png';
                      }else {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_icon.png';
                      }
                    }else if(message.typeId === scMessage.MESSAGE_TYPE_CIRCLE) {
                      messagesOut[mId].postedByTitle = '';
                    }

                  }else {
                    mId = message.parentId;
                    messagesOut[mId].comments[messagesOut[mId].comments.length] = scMessage.setMessage(message);
                    messagesOut[mId].showMoreCommentsLink = true;
                  }
                });
              }

              //sort the messages by date/time
              // messagesOut.sort(function(a,b){
              //   return b.updatedTime - a.updatedTime ;
              // });

              messagesOut = _.compact(messagesOut); // remove empty array values + come back in future to identify from where they are coming.
            }
            return {result:response, message:messagesOut};

          }, function (response) { // error handler
            scAlert.error('There was an issue retrieving message. Please try again.');
            return {result:response, message:[]}; // return empty message array
          }
        );

      // Return the promise to the controller
      return promise;

    } // End of getMessage

    function getMessages(messageStreamFilterParams) {

      var user = scUser.getRootUser();

      var params = {
        getNewMessagesOnly: messageStreamFilterParams.getNewMessagesOnly,
        getSystemMessages: messageStreamFilterParams.getSystemMessages,
        getAdviceMessages: messageStreamFilterParams.getAdviceMessages ? messageStreamFilterParams.getAdviceMessages : false,
        getCircleMessages: messageStreamFilterParams.getCircleMessages ? messageStreamFilterParams.getCircleMessages : false,
        systemAdminId: scUtility.getSystemAdminId(),
        userId: user.id,
        userCreatedTime: user.createdTime, //isset(messageStreamFilterParams.userCreatedTime) ? messageStreamFilterParams.userCreatedTime : user.createdTime
        adviseeUserId: messageStreamFilterParams.adviseeUserId,
        advisorUserId: messageStreamFilterParams.advisorUserId,
        startUpdatedTime: $filter('date')(messageStreamFilterParams.startUpdatedTime, 'yyyy-MM-dd HH:mm:ss'),
        endUpdatedTime: $filter('date')(messageStreamFilterParams.endUpdatedTime, 'yyyy-MM-dd HH:mm:ss'),
        year: messageStreamFilterParams.year,
        month: messageStreamFilterParams.month,

        msgLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT,
        commentLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS
      };

      if(messageStreamFilterParams.propFilters) {
        if(messageStreamFilterParams.propFilters.favoriteYN === 'Y') {
          params.favoriteYN = messageStreamFilterParams.propFilters.favoriteYN;
        }
        if(messageStreamFilterParams.propFilters.msgPriority > 0) {
          params.priorityId = messageStreamFilterParams.propFilters.msgPriority;
        }
        if(messageStreamFilterParams.propFilters.msgStatus > 0) {
          params.statusId = messageStreamFilterParams.propFilters.msgStatus;
        }
        if(messageStreamFilterParams.propFilters.msgType > 0 || _.isArray(messageStreamFilterParams.propFilters.msgType)) {
          params.typeId = messageStreamFilterParams.propFilters.msgType;
        }
        if(messageStreamFilterParams.propFilters.circleType > 0 || _.isArray(messageStreamFilterParams.propFilters.circleType)) {
          params.circleTypeId = messageStreamFilterParams.propFilters.circleType;
        }
        if(messageStreamFilterParams.propFilters.searchText && messageStreamFilterParams.propFilters.searchText.length > 0) {
          params.searchText = messageStreamFilterParams.propFilters.searchText;
        }
        if(messageStreamFilterParams.circleId && messageStreamFilterParams.circleId > 0) {
          params.circleId = messageStreamFilterParams.circleId;
        }
      }

      // $http returns a promise, which has a then function, which also returns a promise
      var promise =
        $http.post(scUtility.getRestBaseUrl() + 'messages', params).then(
          function (response) { // success handler
            var messagesOut = [];

            if(!_.isObject(response.data.status) || response.data.status.success !== true) {
              scAlert.error('There was an issue retrieving messages. Please try again.');
            }

            var messageCount = null;
            if(_.isObject(response.data.data)) {
              messageCount = response.data.data.messagesCount;
              var messages = response.data.data.messages; //var data = response.data, status = response.status, header = response.header, config = response.config;

              var mId = 0;
              if(!_.isEmpty(messages)) {
                _.each(messages, function(message) {
                  if(message.parentId < 1){
                    mId = message.id;
                    messagesOut[mId] = scMessage.setMessage(message);
                    messagesOut[mId].comments = [];
                    messagesOut[mId].showMoreCommentsLink = false;
                    messagesOut[mId].typeId = message.typeId;

                    messagesOut[mId].isSystemMessage =  _.contains([scMessage.MESSAGE_TYPE_WELCOME, scMessage.MESSAGE_TYPE_GLOBAL, scMessage.MESSAGE_TYPE_ADVISOR_GLOBAL, scMessage.MESSAGE_TYPE_ADVISEE_GLOBAL], message.typeId) ? true : false;
                    if(messagesOut[mId].isSystemMessage) {
                      messagesOut[mId].postedByTitle = messagesOut[mId].postedByFirstName+ ' '+ messagesOut[mId].postedByLastName;
                    }
                    // if(messageStreamFilterParams.getNewMessagesOnly){
                    //   messagesOut[mId].isNewMsg = true;
                    // }

                    if(message.typeId === scMessage.MESSAGE_TYPE_CIRCLE && !(messageStreamFilterParams.circleId && messageStreamFilterParams.circleId > 0)) {
                      if(message.circleTypeId === scMessage.CIRCLE_TYPE_PEER) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_peer_icon.png';
                      }else if(message.circleTypeId === scMessage.CIRCLE_TYPE_FAMILY_AND_FRIENDS) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_ff_icon.png';
                      }else if(message.circleTypeId === scMessage.CIRCLE_TYPE_ANGEL) {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_angel_icon.png';
                      }else {
                        messagesOut[mId].postedByAvatar = scUtility.getImageUrl() + 'miscellaneous/circles_icon.png';
                      }
                    }else if(message.typeId === scMessage.MESSAGE_TYPE_CIRCLE) {
                      messagesOut[mId].postedByTitle = '';
                    }

                  }else {
                    mId = message.parentId;
                    messagesOut[mId].comments[messagesOut[mId].comments.length] = scMessage.setMessage(message);
                    messagesOut[mId].showMoreCommentsLink = true;
                  }
                });
              }

              //sort the messages by date/time
              messagesOut.sort(function(a,b){
                return b.updatedTime - a.updatedTime ;
              });

              messagesOut = _.compact(messagesOut); // remove empty array values + come back in future to identify from where they are coming.
            }
            return {result:response, messageStream:messagesOut, messageCount:messageCount};

          }, function (response) { // error handler
            scAlert.error('There was an issue retrieving messages. Please try again.');
            return {result:response, messageStream:[], messageCount:null}; // return empty messageStream
          }
        );

      // Return the promise to the controller
      return promise;

    } // End of getMessages

    function postMessage(newMessageParams) {
      //Check
      if(newMessageParams.messageTxt) {

        var params = newMessageParams;

        var promise = $http.post(scUtility.getRestBaseUrl() + 'add-message', params).then(
          function (response) { // success handler

            var messages = response.data.data; //var data = response.data, status = response.status, header = response.header, config = response.config;

            var messagesOut = [];
            var mId = messagesOut.length;
            messagesOut[mId] = scMessage.setMessage(messages[0]);
            messagesOut[mId].comments = [];
            messagesOut[mId].showMoreCommentsLink = false;
            messagesOut[mId].statusId = scMessage.MESSAGE_STATUS_READ; // 2 ;
            messagesOut[mId].postedByTitle = '';

            return {result:response, newMessage:messagesOut};

          }, function (response) { // error handler
            scAlert.error('There was an issue posting new message. Please try again.');
            return {result:response, newMessage:[]}; // return empty data object
          }
        );

        // Return the promise to the controller
        return promise;

      }
      return {};

    } // End of postMessage

    function getRootUserUnreadMessageCount() {
      var user = scUser.getRootUser();

      if(_.isObject(user) && user.id > 0) {
        var promise =
          $http.get(scUtility.getRestBaseUrl() + 'unread-messages-count').then(
            function (response) { // success handler

              var unreadMessagesCount = response.data.data;

              user.unreadMessagesCount = unreadMessagesCount;
              scUser.setUser(user); // Update rootscope User

              return {result:response, unreadMessagesCount:unreadMessagesCount};

            }, function (response) {
              scAlert.error('There was an issue retrieving user message count data. Please try again.');
              return {result:response, unreadMessagesCount:0}; // return empty data object
            }
          );

        // Return the promise to the controller
        return promise;
      }
      return 0;
    } // End of getRootUserUnreadMessageCount


    function getPersonTypeCssClassName() {
      /*jshint validthis: true */

      // warning/Orange - always represents the person logged in
      // primary/Blue - an advisor (unless the advisor is logged in which they would see orange for the messages they create)
      // success/Green - student/other
      // danger/Red - system

      var user = scUser.getRootUser();
      var className = 'primary';

      if (this.postedBy === user.id) { // posted by logged in user
        className = 'warning';
      } else if(this.postedBy === this.adviseeId) { // posted by student ( + advisor logged in)
        className = 'success';
      }

      if (this.postedBy === scUtility.getSystemAdminId() || this.postedTo === scUtility.getSystemAdminId()) {
        className = 'danger';
      }
      return className;
    } // End of getPersonTypeCssClassName

    function showMoreComments(event, message) {
      if(!_.isEmpty(message.comments)){
        message.loadCommentsInProcess = true;
        message.getComments().then(
          function(result) {

            if(_.isEmpty(result.commentStream) || result.commentStream.length < scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS){
              message.showMoreCommentsLink = false;
            }

            message.comments = result.commentStream.concat(message.comments);
            message.loadCommentsInProcess = false;
          }
        );
      }
    } // End of showMoreComments

    function getComments() {
      /*jshint validthis: true */

      //Check message id
      if(this.id > 0 && !_.isEmpty(this.comments)) {
        var commentsStartTime = _.first(this.comments).createdTime;

        var params = {
          messageId: this.id,
          commentsStartTime: $filter('date')(commentsStartTime, 'yyyy-MM-dd HH:mm:ss'),
          commentLimit: scMessage.MAX_NUMBER_DISPLAY_DEFAULT_COMMENTS
        }; //console.log(params);

        var promise = $http.post(scUtility.getRestBaseUrl() + 'comments', params).then(
          function (response) { // success handler

            var comments = response.data.data; //var data = response.data, status = response.status, header = response.header, config = response.config;

            var commentsOut = [];

            if(!_.isEmpty(comments)) {
              _.each(comments, function(comment) {
                commentsOut[commentsOut.length] = scMessage.setMessage(comment);
              });
            }

            //sort the messages by date/time
            commentsOut.sort(function(a,b){
              return a.updatedTime - b.updatedTime ;
            });

            commentsOut = _.compact(commentsOut); // remove empty array values + come back in future to identify from where they are coming.

            return {result:response, commentStream:commentsOut};

          }, function (response) { // error handler
            console.log('There was an issue retrieving comments. Please try again.');
            return {result:response, commentStream:[]}; // return empty data object
          }
        );

        // Return the promise to the controller
        return promise;

      }
      return {};

    } // End of getComments

    function addComment(event, message) {
      if(message.commentTxt) {
        message.postComment().then(
          function(result) {
            message.commentTxt = '';
            message.comments = message.comments.concat(result.commentStream);
            message.messageCommentCount = parseInt(message.messageCommentCount) + 1; // Or update with latest from database for ajax update.
          }
        );
      }
    } // End of addComment

    function postComment() {
      /*jshint validthis: true */

      var user = scUser.getRootUser();
      //Check message id
      if(this.id > 0 && this.commentTxt) {

        var postedTo = 0;
        if(this.typeId === scMessage.MESSAGE_TYPE_ADVICE) {
          var advisorId = (this.adviseeId === this.postedBy) ? this.postedTo: this.postedBy;
          postedTo = (scUser.isStudent(user)) ? advisorId : this.adviseeId;
        }

        var params = {
          messageId: this.id,
          commentTxt: this.commentTxt,
          postedBy: user.id,
          postedTo: postedTo,
          typeId: this.typeId
        };

        var promise = $http.post(scUtility.getRestBaseUrl() + 'add-comment', params).then(
          function (response) { // success handler

            var comments = response.data.data; //var data = response.data, status = response.status, header = response.header, config = response.config;

            var commentsOut = [];
            commentsOut[commentsOut.length] = scMessage.setMessage(comments[0]);

            return {result:response, commentStream:commentsOut};

          }, function (response) { // error handler
            console.log('There was an issue posting new comment. Please try again.');
            return {result:response, commentStream:[]}; // return empty data object
          }
        );

        // Return the promise to the controller
        return promise;

      }
      return {};
    } // End of postComment

    function updateMessagePriority(event, message, priority) {
      /*jshint validthis: true */

      if(message.priority !== priority) {
        message.priorityMessageInProcess = true;

        var user = scUser.getRootUser();
        var params = {
          messageId: this.id,
          propertyType: 'priority_id',
          propertyValue: priority === 'High' ? scMessage.MESSAGE_PRIORITY_HIGH : (priority === 'Low' ? scMessage.MESSAGE_PRIORITY_LOW : scMessage.MESSAGE_PRIORITY_NORMAL) ,
          userId: user.id,
        };

        message.postMessageProperty(params).then(
          function(result) {
            //Check if failed.
            if(result.propertySuccess !== true){
              console.log('There was an issue updateing message property. Please try again.');
            }
            message.priorityMessageInProcess = false;
          }
        );
      }
    } // End of updateMessagePriority

    function updateMessageRate(event, message, rateToogle) {
      /*jshint validthis: true */

      message.rateMessageInProcess = true;
      if(rateToogle === true) {
        this.rate = 0;
      }else {
        this.rate = 1;
      }

      var user = scUser.getRootUser();
      var params = {
        messageId: this.id,
        propertyType: 'favorite_yn',
        propertyValue: this.rate === 1 ? 'Y' : 'N' ,
        userId: user.id,
      };

      message.postMessageProperty(params).then(
        function(result) {
          //Check if failed.
          if(result.propertySuccess !== true){
            console.log('There was an issue updateing message property. Please try again.');
          }
          message.rateMessageInProcess = false;
        }
      );

    } // End of updateMessageRate

    function updateMessageStatus(event, message, status) {
      /*jshint validthis: true */

      this.statusId = status;

      var user = scUser.getRootUser();
      var params = {
        messageId: this.id,
        propertyType: 'status_id',
        propertyValue: status ,
        userId: user.id,
      };

      message.postMessageProperty(params).then(
        function(result) {
          //Check if failed.
          if (result.propertySuccess !== true){
            console.log('There was an issue updateing message property. Please try again.');
          } else { // Success

            if(status === scMessage.MESSAGE_STATUS_READ) { // decrease unreadMessagesCount at rootscope user properties
              user.unreadMessagesCount = user.unreadMessagesCount - 1;
              scUser.setUser(user); // Update rootscope User
            }

          }
        }
      );

    } // End of updateMessageStatus

    function postMessageProperty(params) {
      /*jshint validthis: true */

      //Check message id
      if (this.id > 0) {
        var promise = $http.post(scUtility.getRestBaseUrl() + 'set-message-property', params).then(
          function (response) { // success handler

            return {result:response, propertySuccess:response.data.status.success};

          }, function (response) { // error handler
            console.log('There was an issue updateing message property. Please try again.');
            return {result:response, propertySuccess:false}; // return empty data object
          }
        );

        // Return the promise to the controller
        return promise;

      }
      return {};
    } // End of postMessageProperty

  }

})();