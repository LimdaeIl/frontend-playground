/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editFtcbc100Ctrl', editFtcbc100Ctrl);

  editFtcbc100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'
  ];

  function editFtcbc100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    // ── Default config ─────────────────────────────────────────────────────
    $scope.config = angular.extend({
      orgName:    'Fortinet Korea',
      centerName: 'Customer Briefing Center',
      tagline:    'Cybersecurity Excellence',
      showLogo:   true
    }, config);

    // ── i18n ───────────────────────────────────────────────────────────────
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            'BTN_CLOSE': widgetUtilityService.translate('ftcbc.BTN_CLOSE') || 'Close',
            'BTN_SAVE':  widgetUtilityService.translate('ftcbc.BTN_SAVE')  || 'Save'
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
      if ($scope.editFtcbcForm.$invalid) {
        $scope.editFtcbcForm.$setTouched();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
  }
})();
