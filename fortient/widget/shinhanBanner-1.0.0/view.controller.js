/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('shinhanBanner100Ctrl', shinhanBanner100Ctrl);

  shinhanBanner100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$timeout', '$rootScope'
  ];

  function shinhanBanner100Ctrl(
    $scope, widgetUtilityService, config, $timeout, $rootScope) {

    $scope.config  = config;
    $scope.themeId = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page    = '';

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.t = {
          GROUP_NAME:  widgetUtilityService.translate('shinhanBanner.GROUP_NAME')  || '신한금융그룹',
          TAGLINE:     widgetUtilityService.translate('shinhanBanner.TAGLINE')     || '금융으로 세상을 이롭게',
          LABEL_REFRESH: widgetUtilityService.translate('shinhanBanner.LABEL_REFRESH') || 'Refresh',
          EST_YEAR:    widgetUtilityService.translate('shinhanBanner.EST_YEAR')    || 'Since 1982',
          GLOBAL_TEXT: widgetUtilityService.translate('shinhanBanner.GLOBAL_TEXT') || 'Global Financial Group'
        };
      });
    }

    // ── init ─────────────────────────────────────────────────────────────
    $scope.init = function () {
      _handleTranslations();
    };

    $scope.getList = function () {
      // 배너 위젯은 새로고침 시 번역만 재로드
      _handleTranslations();
    };

    $scope.init();
  }
})();
