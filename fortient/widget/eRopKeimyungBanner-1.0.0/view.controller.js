/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('eRopKeimyungBanner100Ctrl', eRopKeimyungBanner100Ctrl);

  eRopKeimyungBanner100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$timeout',
    '$rootScope', '$interval', '$window'
  ];

  function eRopKeimyungBanner100Ctrl(
    $scope, widgetUtilityService, config, $timeout,
    $rootScope, $interval, $window) {

    $scope.config    = config;
    $scope.themeId   = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page      = '';
    $scope.collapsed = false;
    $scope.particles = [];

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          TXT_LABEL_SOC:     widgetUtilityService.translate('eRopKeimyungBanner.TXT_LABEL_SOC')     || 'Security Operations Center',
          TXT_LABEL_POWERED: widgetUtilityService.translate('eRopKeimyungBanner.TXT_LABEL_POWERED') || 'Powered by FortiSOAR',
          LABEL_REFRESH:     widgetUtilityService.translate('eRopKeimyungBanner.LABEL_REFRESH')     || 'Refresh'
        };
      });
    }

    function _initParticles() {
      var ps = [];
      for (var i = 0; i < 22; i++) {
        ps.push({
          id:      i,
          left:    Math.random() * 100,
          size:    Math.random() * 5 + 2,
          delay:   Math.random() * 6,
          dur:     Math.random() * 4 + 3,
          opacity: Math.random() * 0.45 + 0.2,
          // 파티클 색상: 네이비 or 레드 랜덤
          isRed:   i % 5 === 0
        });
      }
      $scope.particles = ps;
    }

    function _buildTickerText() {
      if (config.ticker_text) {
        $scope.tickerText = config.ticker_text;
      } else {
        $scope.tickerText = [
          '◆ 계명대학교 정보보안 운영센터',
          '● KEIMYUNG UNIVERSITY Security Operations',
          '■ 24/7 Threat Monitoring & Incident Response',
          '◆ Powered by Fortinet FortiSOAR',
          '● 실시간 사이버 위협 탐지 및 대응',
          '■ Zero Trust Security Architecture',
          '◆ 계명대학교 AI 기반 보안 자동화'
        ].join('    ✦    ');
      }
    }

    $scope.$on('$destroy', function () {});

    $scope.init = function () {
      _handleTranslations();
      _initParticles();
      _buildTickerText();
    };

    $scope.init();
  }
})();
