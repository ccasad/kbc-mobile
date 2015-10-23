(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScJobsCtrl);

  ScJobsCtrl.$inject = ['scUser', 'scJobs', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$ionicModal', 'APP_GLOBALS'];

  /* @ngInject */
  function ScJobsCtrl(scUser, scJobs, scStats, scAlert, $ionicLoading, $scope, $ionicModal, APP_GLOBALS) {
    var vm = this;

    var user = scUser.getRootUser();

    vm.jobs = {
      list: [],
      noOfDays: 30,
      maxLimit: 15,
      orderByFieldList: [
        {id: 'JobId', name: 'Latest', direction: 'DESC'},
        {id: 'JobTitleText', name: 'Title', direction: 'ASC'},
        {id: 'JobStatus', name: 'Status', direction: 'ASC'},
        {id: 'LastSentDate', name: 'Last Sent Date', direction: 'DESC'},
      ], // { "JobStatus", "JobTitleText", "EmployersJobId", "JobId", "JobStatusCode", "LastSentDate", "LastSentMethod", "OscName" }
      skipNoRecords: 0,
      orderByField : 'JobId',
      orderByType: 'DESC',
      jobStatusCode: '', // To search/filter by jobStatusCode
      searchKeyword: '', // To search/filter by JobTitleText
      jobId: '', // To search/filter by VOC Job Id
      empJobId: '', // To search/filter by Employer’s Job id
      isFilterVisible: true,
      showMoreJobsLink: false,
      noJobsText: 'No Jobs Found',
      loading: true,
    };

    vm.getJobsList = getJobsList;
    vm.refreshJobsList = refreshJobsList;
    vm.getMoreJobsList = getMoreJobsList;
    vm.setJobsList = setJobsList;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;

    ////////////

    vm.setJobsList();

    function setJobsList() {

      if(scUser.isCenterRep(user)){
        vm.isCenterRepUser = true;
      }else {
        vm.getJobsList();
      }

      $ionicModal.fromTemplateUrl( APP_GLOBALS.appModulesPath + APP_GLOBALS.appStatsModuleDir + 'sc.stats-filters-modal.view.html', {
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

    } // End of setJobsList

    function applyFilters() {
      $scope.modal.hide();
      vm.jobs.skipNoRecords =  0;
      vm.getJobsList();
    } // end of applyFilters

    function showFilters() {
      $scope.modal.show();
    } // End of showFilters

    function hideFilters() {
      $scope.modal.hide();
      // vm.jobs.skipNoRecords =  0;
      // vm.getJobsList();
    } // end of hideFilters

    function clearFilters() {
      vm.jobs.skipNoRecords =  0;
      vm.jobs.orderByField = 'JobId';
      vm.jobs.orderByType = 'DESC';

      vm.jobs.jobStatusCode = ''; // To search/filter by jobStatusCode
      vm.jobs.searchKeyword = ''; // To search/filter by JobTitleText
      vm.jobs.jobId = ''; // To search/filter by VOC Job Id
      vm.jobs.empJobId = ''; // To search/filter by Employer’s Job id

      vm.getJobsList();
      $scope.modal.hide();
    } // end of clearFilters

    function refreshJobsList() {
      vm.jobs.skipNoRecords =  0;

      vm.getJobsList();
    }

    function getMoreJobsList() {
      if(!vm.jobs.loading && vm.jobs.showMoreJobsLink && vm.jobs.list.length > 0) {
      vm.jobs.skipNoRecords =  vm.jobs.skipNoRecords + vm.jobs.maxLimit;

      vm.getJobsList();
      }
    }

    function getJobsList() {
      var jobsParams = {
        userId: user.id,
        noOfDays: vm.jobs.noOfDays,
        maxLimit: vm.jobs.maxLimit,
        employerId: vm.jobs.employerId > 0 ? vm.jobs.employerId : 0,
        skipNoRecords: vm.jobs.skipNoRecords,
        orderByField: vm.jobs.orderByField,
        orderByType: vm.jobs.orderByType,
        jobStatusCode: vm.jobs.jobStatusCode,
        searchKeyword: vm.jobs.searchKeyword,
        jobId: vm.jobs.jobId,
        empJobId: vm.jobs.empJobId,
      };

      vm.jobs.loading = true;
      $ionicLoading.show();

      scJobs.getJobsList(jobsParams).then(function(response){
        if (response.status && response.status.success) {
          if(vm.jobs.list.length > 0 && vm.jobs.skipNoRecords > 0){
            vm.jobs.list = vm.jobs.list.concat(response.data.jobslist);
          }else {
            vm.jobs.list = response.data.jobslist;
          }

          if(response.data.jobsTotalCount <= vm.jobs.list.length) {
            vm.jobs.showMoreJobsLink = false;
          }else {
            vm.jobs.showMoreJobsLink = true;
          }

        } else {
          scAlert.error('Error in getting jobs data. Please try again');
        }
        vm.jobs.loading = false;
      }).finally(function() {
        vm.jobs.loading = false;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      });

    } // End of getJobsList

  }

})();