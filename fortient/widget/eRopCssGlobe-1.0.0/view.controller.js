/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('eRopCssGlobe100Ctrl', eRopCssGlobe100Ctrl);

  eRopCssGlobe100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$state'
  ];

  function eRopCssGlobe100Ctrl($scope, widgetUtilityService, config, $state) {

    $scope.config     = config;
    $scope.collapsed  = false;
    $scope.page       = $state.params ? $state.params.page : '';

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          LABEL_EARTH: widgetUtilityService.translate('eRopCssGlobe.LABEL_EARTH') || 'E A R T H'
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
