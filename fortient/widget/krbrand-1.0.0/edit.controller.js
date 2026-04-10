/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editKrbrand100Ctrl', editKrbrand100Ctrl);

  editKrbrand100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'
  ];

  function editKrbrand100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    // ── Default config ─────────────────────────────────────────────────────
    $scope.config = angular.extend({
      companyName:   '대한항공',
      companyNameEn: 'KOREAN AIR',
      tagline:       'Securing the Skies',
      subtitle:      'Security Operations Center',
      showLogo:      true,
      showClock:     true
    }, config);

    // ── i18n ───────────────────────────────────────────────────────────────
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE': widgetUtilityService.translate('krbrand.BTN_CLOSE') || 'Close',
            'BTN_SAVE':  widgetUtilityService.translate('krbrand.BTN_SAVE')  || 'Save'
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    _handleTranslations();

    // ── 모달 ───────────────────────────────────────────────────────────────
    function cancel() { $uibModalInstance.dismiss('cancel'); }

    function save() {
      if ($scope.editKrbrandForm.$invalid) {
        $scope.editKrbrandForm.$setTouched();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
  }
})();
