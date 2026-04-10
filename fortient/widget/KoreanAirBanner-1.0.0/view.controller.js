/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('KPIoptional94100DevCtrl', KPIoptional94100DevCtrl);

    KPIoptional94100DevCtrl.$inject = ['$scope', 'config', '$rootScope', 'widgetUtilityService'];

    function KPIoptional94100DevCtrl($scope, config, $rootScope, widgetUtilityService) {

      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // translation variables can be added later
          };
        });
      }

      function _setDefaults() {
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
      }

      function _setViewState() {
        $scope.themeId = $rootScope.theme ? $rootScope.theme.id : 'dark';
        $scope.collapsed = false;
      }

      function init() {
        _handleTranslations();
        _setDefaults();
        _setViewState();
      }

      init();
    }
})();