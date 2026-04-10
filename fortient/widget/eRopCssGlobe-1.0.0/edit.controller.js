/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editERopCssGlobe100Ctrl', editERopCssGlobe100Ctrl);

  editERopCssGlobe100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'
  ];

  function editERopCssGlobe100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    // Speed options: value in seconds (higher = slower rotation)
    $scope.speedOptions = [
      { label: 'Fast  (12s)',   value: 12  },
      { label: 'Normal (28s)',  value: 28  },
      { label: 'Slow  (50s)',   value: 50  }
    ];

    $scope.config = angular.extend({
      title:      'CSS Globe',
      spinSpeed:  28
    }, config);

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            BTN_CLOSE: widgetUtilityService.translate('eRopCssGlobe.BTN_CLOSE') || 'Close',
            BTN_SAVE:  widgetUtilityService.translate('eRopCssGlobe.BTN_SAVE')  || 'Save'
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    _handleTranslations();

    // ── Modal ─────────────────────────────────────────────────────────────
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
