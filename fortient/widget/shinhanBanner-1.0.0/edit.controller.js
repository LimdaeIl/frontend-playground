/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editShinhanBanner100Ctrl', editShinhanBanner100Ctrl);

  editShinhanBanner100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config',
    'widgetUtilityService', '$timeout'
  ];

  function editShinhanBanner100Ctrl(
    $scope, $uibModalInstance, config,
    widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    $scope.config = angular.extend({
      title:         '신한금융그룹',
      subtitle:      '금융으로 세상을 이롭게',
      show_logo:     true,
      show_tagline:  true,
      show_est:      true,
      banner_style:  'blue',   // 'blue' | 'dark' | 'gradient'
      show_divider:  true
    }, config);

    $scope.bannerStyles = [
      { value: 'blue',     label: 'Shinhan Blue' },
      { value: 'dark',     label: 'Dark Navy' },
      { value: 'gradient', label: 'Blue Gradient' }
    ];

    // ── i18n ────────────────────────────────────────────────────────────
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE': widgetUtilityService.translate('shinhanBanner.BTN_CLOSE'),
            'BTN_SAVE':  widgetUtilityService.translate('shinhanBanner.BTN_SAVE')
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    _handleTranslations();

    // ── 모달 ──────────────────────────────────────────────────────────
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
