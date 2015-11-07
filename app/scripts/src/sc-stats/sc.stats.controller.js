(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScStatsCtrl);

  ScStatsCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$ionicModal', 'APP_GLOBALS', '_'];

  /* @ngInject */
  function ScStatsCtrl(scUser, scStats, scAlert, $ionicLoading, $scope, $ionicModal, APP_GLOBALS, _) {
    var vm = this;

    var user = scUser.getRootUser();

    vm.stats = {
      list: [],
      statList: [],
      formFields: [],
      typeOptions: [],
      skipNoRecords: 0,
      maxLimit: 5,
      orderByFieldList: [
        {id: 'statId', name: 'Id', direction: 'DESC'},
        {id: 'statName', name: 'Name', direction: 'ASC'},
        {id: 'statDate', name: 'Date', direction: 'ASC'},
        {id: 'statValue', name: 'Value', direction: 'ASC'},
        {id: 'statInfo', name: 'Info', direction: 'DESC'},
      ],
      orderByField : 'statDate',
      orderByType: 'DESC',
      isFilterVisible: true,
      noStatsText: 'No stats found',
      loading: true,
    };

    vm.stats.formData = {};

    vm.stats.fields = {
      statId: {
        key: 'statId',
        type: 'select',
        defaultValue: 'all',
        templateOptions: {
          label: 'Stat',
          options: []
        }
      },
      orderBy: {
        key: 'orderBy',
        type: 'select',
        defaultValue: 'statDate',
        templateOptions: {
          label: 'Order By',
          options: [
            {name: 'Name', value: 'statName'},
            {name: 'Date', value: 'statDate'},
            {name: 'Value', value: 'statValue'}
          ]
        }
      },
      orderDir: {
        key: 'orderDir',
        type: 'toggle',
        templateOptions: {
          label: 'Ascending Order',
          toggleClass: 'balanced'
        }
      }
    };

    // vm.stats.formFields = [
    //   {
    //     key: 'statId',
    //     type: 'select',
    //     defaultValue: 'all',
    //     templateOptions: {
    //       label: 'Stat',
    //       options: []
    //     },
    //     // controller: /* @ngInject */ function($scope, scStats) {
    //     //   $scope.to.loading = scStats.getStats().then(function(response){
    //     //     $scope.options.templateOptions.options = response.data;
    //     //     return response;
    //     //   });
    //     // }
    //   },
    //   {
    //     key: 'orderBy',
    //     type: 'select',
    //     defaultValue: 'statDate',
    //     templateOptions: {
    //       label: 'Order By',
    //       options: [
    //         {name: 'Name', value: 'statName'},
    //         {name: 'Date', value: 'statDate'},
    //         {name: 'Value', value: 'statValue'}
    //       ]
    //     }
    //   },
    //   {
    //     key: 'orderDir',
    //     type: 'toggle',
    //     templateOptions: {
    //       label: 'Ascending Order',
    //       toggleClass: 'balanced'
    //     }
    //   }
    // ];

    vm.setStatsList = setStatsList;
    vm.getStats = getStats;
    vm.getMyStats = getMyStats;
    vm.getMoreStatsList = getMoreStatsList;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;

    ////////////

    getStatOptions();
    vm.setStatsList();

    function getStats() {
      return scStats.getStats().then(function (response) {
        vm.stats.statList = response.data;
        return vm.stats.statList;
      });
    }

    // function getStats() {
    //   return scStats.getStats().then(function (response) {
    //     var data = response.data;
    //     var options = [];

    //     _.each(data, function(stat) {
    //       options.push({name: stat.name, value: stat.id});
    //     });

    //     vm.stats.formFields.statId.templateOptions.options = options;

    //     return options;
    //   });
    // }

    function getStatOptions() {
      return getStats().then(function() {
        
        vm.stats.typeOptions.push({name: 'All', value: 'all'});
        
        _.each(vm.stats.statList, function(stat) {
          vm.stats.typeOptions.push({name: stat.name, value: stat.id});
        });

        setStatFields();

        return vm.stats.typeOptions;
      });
    }

    function setStatFields() {
      vm.stats.fields.statId.templateOptions.options = vm.stats.typeOptions;

      vm.stats.formFields = [
        vm.stats.fields.statId,
        vm.stats.fields.orderBy,
        vm.stats.fields.orderDir
      ];
    }

    function getMyStats() {

      var userId = user.id;
      var statId = (!vm.stats.formData.statId || vm.stats.formData.statId === 'all') ? null : vm.stats.formData.statId;
      var orderBy = (vm.stats.formData.orderBy) ? vm.stats.formData.orderBy : 'statDate';
      var orderDir = (vm.stats.formData.orderDir) ? 'ASC' : 'DESC';
      
      var params = {
        userId: userId,
        statId: statId,
        orderBy: orderBy,
        orderDir: orderDir
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

      vm.getMyStats();
      $scope.modal.hide();
    } // end of clearFilters
  }

})();