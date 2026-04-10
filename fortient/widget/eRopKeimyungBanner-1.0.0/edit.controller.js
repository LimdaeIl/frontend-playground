/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editERopKeimyungBanner100Ctrl', editERopKeimyungBanner100Ctrl);

  editERopKeimyungBanner100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config',
    'widgetUtilityService', '$timeout'
  ];

  function editERopKeimyungBanner100Ctrl(
    $scope, $uibModalInstance, config,
    widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    $scope.config = angular.extend({
      title:      'Keimyung University Banner',
      main_title: '계명대학교 정보보안 운영센터',
      ticker_text: ''
    }, config);

    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE':      widgetUtilityService.translate('eRopKeimyungBanner.BTN_CLOSE'),
            'BTN_SAVE':       widgetUtilityService.translate('eRopKeimyungBanner.BTN_SAVE'),
            'LBL_TITLE':      widgetUtilityService.translate('eRopKeimyungBanner.LBL_TITLE'),
            'LBL_MAIN_TITLE': widgetUtilityService.translate('eRopKeimyungBanner.LBL_MAIN_TITLE'),
            'LBL_TICKER':     widgetUtilityService.translate('eRopKeimyungBanner.LBL_TICKER'),
            'PH_TICKER':      widgetUtilityService.translate('eRopKeimyungBanner.PH_TICKER')
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    _handleTranslations();

    function cancel() { $uibModalInstance.dismiss('cancel'); }

    function save() {
      if ($scope.editForm.$invalid) {
        $scope.editForm.$setTouched();
        $scope.editForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
  }
})();
