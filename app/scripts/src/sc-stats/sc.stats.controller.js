(function(){
  'use strict';

  angular
    .module('scStats')
    .controller('ScStatsCtrl', ScStatsCtrl);

  ScStatsCtrl.$inject = ['scUser', 'scStats', 'scAlert', '$ionicLoading', '$scope', '$state', '$previousState', '$ionicModal', 'APP_GLOBALS', '_'];

  /* @ngInject */
  function ScStatsCtrl(scUser, scStats, scAlert, $ionicLoading, $scope, $state, $previousState, $ionicModal, APP_GLOBALS, _) {
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
      orderByField : 'statName',
      orderByType: 'ASC',
      isFilterVisible: true,
      loading: true,
      title: '',
      isChart: false,
      chartOptions: {
        'type': 'serial',
        'theme': 'light',
        'marginRight': 80,
        'autoMarginOffset': 20,
        'dataDateFormat': 'YYYY-MM-DD',
        'valueAxes': [{
          'id': 'v1',
          'axisAlpha': 0,
          'position': 'left'
        }],
        'balloon': {
          'borderThickness': 1,
          'shadowAlpha': 0
        },
        'graphs': [{
          'id': 'g1',
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletColor': '#FFFFFF',
          'bulletSize': 5,
          'hideBulletsCount': 50,
          'lineThickness': 2,
          'title': 'red line',
          'useLineColorForBulletBorder': true,
          'valueField': 'value',
          'balloonText': '<div style="margin:5px; font-size:19px;"><span style="font-size:13px;">[[category]]</span><br>[[value]]</div>'
        }],
        'chartScrollbar': {
          'graph': 'g1',
          'oppositeAxis':false,
          'offset':30,
          'scrollbarHeight': 80,
          'backgroundAlpha': 0,
          'selectedBackgroundAlpha': 0.1,
          'selectedBackgroundColor': '#888888',
          'graphFillAlpha': 0,
          'graphLineAlpha': 0.5,
          'selectedGraphFillAlpha': 0,
          'selectedGraphLineAlpha': 1,
          'autoGridCount':true,
          'color':'#AAAAAA'
        },
        'chartCursor': {
          'pan': true,
          'valueLineEnabled': true,
          'valueLineBalloonEnabled': true,
          'cursorAlpha':0,
          'valueLineAlpha':0.2
        },
        'categoryField': 'date',
        'categoryAxis': {
          'parseDates': true,
          'dashLength': 1,
          'minorGridEnabled': true
        },
        'export': {
          'enabled': true
        },
        'dataProvider': [{
            'date': '2012-07-27',
            'value': 13
        }, {
            'date': '2012-07-28',
            'value': 11
        }, {
            'date': '2012-07-29',
            'value': 15
        }, {
            'date': '2012-07-30',
            'value': 16
        }, {
            'date': '2012-07-31',
            'value': 18
        }, {
            'date': '2012-08-01',
            'value': 13
        }, {
            'date': '2012-08-02',
            'value': 22
        }, {
            'date': '2012-08-03',
            'value': 23
        }, {
            'date': '2012-08-04',
            'value': 20
        }, {
            'date': '2012-08-05',
            'value': 17
        }, {
            'date': '2012-08-06',
            'value': 16
        }]
      }
    };

    vm.stats.formData = {};

    vm.stats.fields = {
      // statId: {
      //   key: 'statId',
      //   type: 'select',
      //   defaultValue: 'all',
      //   templateOptions: {
      //     label: 'Stat',
      //     options: []
      //   }
      // },
      orderBy: {
        key: 'orderBy',
        type: 'select',
        defaultValue: 'statName',
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
        },
        expressionProperties: {
          'templateOptions.label': function($viewValue, $modelValue, scope) {
            if (scope.model.orderDir) {
              return 'Descending Order';
            }
            return 'Ascending Order';
          }
        }
      }
    };

    vm.setStatsList = setStatsList;
    vm.getStats = getStats;
    vm.getMyStats = getMyStats;
    vm.getUserStats = getUserStats;
    vm.showFilters = showFilters;
    vm.applyFilters = applyFilters;
    vm.hideFilters = hideFilters;
    vm.clearFilters = clearFilters;

    ////////////

    getStatOptions();

    if ($state.current.name === 'user.stats-pr-list') {
      vm.setStatsList();
    }

    function getStats() {
      return scStats.getStats().then(function (response) {
        vm.stats.statList = response.data;
        return vm.stats.statList;
      });
    }

    function getStatOptions() {
      return getStats().then(function() {
        
        vm.stats.typeOptions.push({name: 'All', value: 'all'});
        
        _.each(vm.stats.statList, function(stat) {
          vm.stats.typeOptions.push({name: stat.name, value: stat.id});
        });

        setStatFields();

        if ($state.current.name === 'user.stats-stat-list') {
          if ($state.params.statId && $state.params.statId.length) {
            vm.stats.title = _.result(_.findWhere(vm.stats.statList, {'id': parseInt($state.params.statId)}), 'name');
            getUserStats($state.params.statId, null, null, false);
          }
        }

        return vm.stats.typeOptions;
      });
    }

    function setStatFields() {
      //vm.stats.fields.statId.templateOptions.options = vm.stats.typeOptions;

      vm.stats.formFields = [
        //vm.stats.fields.statId,
        vm.stats.fields.orderBy,
        vm.stats.fields.orderDir
      ];
    }

    function getMyStats() {
      vm.getUserStats(vm.stats.formData.statId, vm.stats.formData.orderBy, vm.stats.formData.orderDir, true);
    }

    function getUserStats(statId, orderBy, orderDir, prOnly) {
      var userId = user.id;
      statId = (!statId || statId === 'all') ? null : statId;
      orderBy = (orderBy) ? orderBy : 'statName';
      orderDir = (orderDir) ? 'DESC' : 'ASC';

      var params = {
        userId: userId,
        statId: statId,
        orderBy: orderBy,
        orderDir: orderDir,
        prOnly: prOnly
      };

      return scStats.getAllUsersStats(params).then(function (response) {
        vm.stats.list = response.data;
        return vm.stats.list;
      });
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
      vm.stats.orderByField = 'StatName';
      vm.stats.orderByType = 'ASC';
      vm.stats.formData.orderBy = 'StatName';
      vm.stats.formData.orderDir = 'ASC';

      vm.getMyStats();
      $scope.modal.hide();
    } // end of clearFilters
  }

})();