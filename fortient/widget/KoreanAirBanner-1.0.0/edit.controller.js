/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editKPIoptional94100DevCtrl', editKPIoptional94100DevCtrl);

    editKPIoptional94100DevCtrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout'];

    function editKPIoptional94100DevCtrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout) {
        $scope.cancel = cancel;
        $scope.save = save;

        $scope.config = angular.extend({
            title: 'KISA Security Overview',
            subtitle: 'Threat posture and intelligence stream',
            statusText: 'LIVE VIEW',

            card1Label: 'Open Incidents',
            card1Value: '128',
            card1Meta: '▲ 8.4% from yesterday',

            card2Label: 'Critical Alerts',
            card2Value: '17',
            card2Meta: '▲ 3 high-risk escalations',

            card3Label: 'MTTR',
            card3Value: '42m',
            card3Meta: '▼ 11% faster response',

            card4Label: 'Last Updated',
            card4Value: '2m ago',
            card4Meta: 'Collection pipeline healthy',

            footerNote: 'Mission telemetry synchronized across feeds',
            footerBadge: 'INTELLIGENCE ACTIVE'
        }, config || {});

        function _handleTranslations() {
          var widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

          if (widgetNameVersion) {
            widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
              $scope.viewWidgetVars = {
                // translation variables can be added later
              };
            });
          } else {
            $timeout(function() {
              $scope.cancel();
            });
          }
        }

        function init() {
            _handleTranslations();
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close($scope.config);
        }

        init();
    }
})();