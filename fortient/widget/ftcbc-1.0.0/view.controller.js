/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('ftcbc100Ctrl', ftcbc100Ctrl);

  ftcbc100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$rootScope'
  ];

  function ftcbc100Ctrl($scope, widgetUtilityService, config, $rootScope) {

    $scope.config      = config;
    $scope.themeId     = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page        = '';
    $scope.currentYear = new Date().getFullYear();

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          LABEL_REFRESH: widgetUtilityService.translate('ftcbc.LABEL_REFRESH') || 'Refresh'
        };
      });
    }

    // ── init ─────────────────────────────────────────────────────────────
    $scope.init = function () {
      _handleTranslations();
    };

    $scope.init();
  }
})();
