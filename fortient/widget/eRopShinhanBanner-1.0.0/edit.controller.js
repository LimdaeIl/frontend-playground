/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editERopShinhanBanner100Ctrl', editERopShinhanBanner100Ctrl);

  editERopShinhanBanner100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config',
    'widgetUtilityService', '$timeout'
  ];

  function editERopShinhanBanner100Ctrl(
    $scope, $uibModalInstance, config,
    widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    // 기본 설정값
    $scope.config = angular.extend({
      title:      'Shinhan Financial Group Banner',
      main_title: 'Security Operations Center',
      ticker_text: ''
    }, config);

    // i18n
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE':     widgetUtilityService.translate('eRopShinhanBanner.BTN_CLOSE'),
            'BTN_SAVE':      widgetUtilityService.translate('eRopShinhanBanner.BTN_SAVE'),
            'LBL_TITLE':     widgetUtilityService.translate('eRopShinhanBanner.LBL_TITLE'),
            'LBL_MAIN_TITLE':widgetUtilityService.translate('eRopShinhanBanner.LBL_MAIN_TITLE'),
            'LBL_TICKER':    widgetUtilityService.translate('eRopShinhanBanner.LBL_TICKER'),
            'PH_TICKER':     widgetUtilityService.translate('eRopShinhanBanner.PH_TICKER')
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
