(function(){
  'use strict';

  angular
    .module('scTools')
    .controller('ScToolsReportCtrl', ScToolsReportCtrl);

  ScToolsReportCtrl.$inject = ['scReports', '$state', '_'];

  /* @ngInject */
  function ScToolsReportCtrl(scReports, $state, _) {
    var vm = this;

    vm.reports = {
      list: null,
      data: null,
      selectedReport: null,
    };

    vm.getReports = getReports;
    vm.getReport = getReport;

    /////////

    getReports();

    function getReports() {
      return scReports.getReports().then(function (response) {
        vm.reports.list = response.data;

        if ($state.current.name === 'user.tools-report-detail') {
          if ($state.params.reportId && $state.params.reportId.length) {
            vm.reports.selectedReport = _.findWhere(vm.reports.list, {'id': parseInt($state.params.reportId)});
            vm.reports.title = vm.reports.selectedReport.title;

            getReport($state.params.reportId);
          }
        }

        return vm.reports.list;
      });
    }

    function getReport(id) {
      return scReports.getReport(id).then(function (response) {
        vm.reports.data = response.data;
        return vm.reports.data;
      });
    }

  }

})();