/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editFortinetbrandwidget100Ctrl', editFortinetbrandwidget100Ctrl);

  editFortinetbrandwidget100Ctrl.$inject = [
    '$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'
  ];

  function editFortinetbrandwidget100Ctrl(
    $scope, $uibModalInstance, config, widgetUtilityService, $timeout) {

    $scope.cancel = cancel;
    $scope.save   = save;

    $scope.config = angular.extend({
      title: 'Fortinet Brand Banner'
    }, config);

    _init();

    function _handleTranslations() {
      var wv = widgetUtilityService.getWidgetNameVersion(
        $scope.$resolve.widget, $scope.$resolve.widgetBasePath);
      if (wv) {
        widgetUtilityService.checkTranslationMode(wv).then(function () {
          $scope.viewWidgetVars = {
            BTN_CLOSE: widgetUtilityService.translate('fortinetbrandwidget.BTN_CLOSE'),
            BTN_SAVE:  widgetUtilityService.translate('fortinetbrandwidget.BTN_SAVE')
          };
        });
      } else {
        $timeout(function () { $scope.cancel(); });
      }
    }

    function _init() {
      _handleTranslations();
    }

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
