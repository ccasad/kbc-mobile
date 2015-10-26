(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScStatsCtrl);

  ScStatsCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$ionicModal', 'APP_GLOBALS'];

  /* @ngInject */
  function ScStatsCtrl(scUser, scStats, scAlert, $ionicLoading, $scope, $ionicModal, APP_GLOBALS) {
    var vm = this;

    //var user = scUser.getRootUser();

    vm.stats = {
      list: [],
      skipNoRecords: 0,
      maxLimit: 15,
      orderByFieldList: [
        {id: 'statId', name: 'Id', direction: 'DESC'},
        {id: 'statName', name: 'Name', direction: 'ASC'},
        {id: 'statDate', name: 'Date', direction: 'ASC'},
        {id: 'statValue', name: 'Value', direction: 'ASC'},
        {id: 'statInfo', name: 'Info', direction: 'DESC'},
      ],
      orderByField : 'statDate',
      orderByType: 'DESC',
      // jobStatusCode: '', // To search/filter by jobStatusCode
      // searchKeyword: '', // To search/filter by JobTitleText
      // jobId: '', // To search/filter by VOC Job Id
      // empJobId: '', // To search/filter by Employer’s Job id
      isFilterVisible: true,
      noStatsText: 'No stats found',
      loading: true,
    };

    vm.stats.formData = {};

    vm.stats.formFields = [
      {
        key: 'statId',
        type: 'select',
        templateOptions: {
          label: 'Stat',
          options: [
            {name: 'Push Ups', value: '1'},
            {name: 'Sit Ups', value: '2'},
            {name: 'Red Challenge', value: '3'},
            {name: 'Dynamax', value: '4'},
          ]
        }
      },
      {
        key: 'orderBy',
        type: 'select',
        initialValue: 'statDate',
        templateOptions: {
          label: 'Order By',
          options: [
            {name: 'Name', value: 'statName'},
            {name: 'Date', value: 'statDate'},
            {name: 'Value', value: 'statValue'}
          ]
        }
      },
      {
        key: 'orderBy',
        type: 'select',
        initialValue: 'statDate',
        templateOptions: {
          label: 'Order By',
          options: [
            {name: 'Name', value: 'statName'},
            {name: 'Date', value: 'statDate'},
            {name: 'Value', value: 'statValue'}
          ]
        }
      },
    ];

    vm.setStatsList = setStatsList;
    vm.getMyStats = getMyStats;
    vm.getMoreStatsList = getMoreStatsList;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;

    ////////////

    vm.setStatsList();

    function getMyStats() {

      var userId = 1; //user.id;
      var statId = (vm.statId === 'all') ? null : vm.statId;

      var params = {
        userId: userId,
        statId: statId
      };

      return scStats.getAllUsersStats(params).then(function (response) {
        vm.stats.list = response.data;
        return vm.stats.list;
      });
    }

    function getMoreStatsList() {
      if(!vm.stats.loading && vm.stats.showMoreStatsLink && vm.stats.list.length > 0) {
        vm.stats.skipNoRecords = vm.stats.skipNoRecords + vm.stats.maxLimit;
        vm.getMyStats();
      }
    }

    function setStatsList() {

      vm.getMyStats();

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

    } // End of setStatsList

    function applyFilters() {
      $scope.modal.hide();
      vm.stats.skipNoRecords =  0;
      vm.getMyStats();
    } // end of applyFilters

    function showFilters() {
      $scope.modal.show();
    } // End of showFilters

    function hideFilters() {
      $scope.modal.hide();
    } // end of hideFilters

    function clearFilters() {
      vm.stats.skipNoRecords =  0;
      vm.stats.orderByField = 'StatDate';
      vm.stats.orderByType = 'DESC';

      // vm.stats.jobStatusCode = ''; // To search/filter by jobStatusCode
      // vm.stats.searchKeyword = ''; // To search/filter by JobTitleText
      // vm.stats.jobId = ''; // To search/filter by VOC Job Id
      // vm.stats.empJobId = ''; // To search/filter by Employer’s Job id

      vm.getMyStats();
      $scope.modal.hide();
    } // end of clearFilters
  }

})();