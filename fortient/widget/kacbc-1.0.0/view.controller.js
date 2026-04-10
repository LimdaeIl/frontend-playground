/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
    angular
      .module('cybersponse')
      .controller('kacbc100Ctrl', kacbc100Ctrl);

    kacbc100Ctrl.$inject = ['$scope', 'widgetUtilityService'];

    function kacbc100Ctrl($scope, widgetUtilityService) {

      function _handleTranslations() {
        widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      }

      function init() {
        // To handle backward compatibility for widget
        _handleTranslations();
      }

      init();
    }
})();
