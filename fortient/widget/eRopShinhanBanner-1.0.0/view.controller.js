/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('eRopShinhanBanner100Ctrl', eRopShinhanBanner100Ctrl);

  eRopShinhanBanner100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$timeout',
    '$rootScope', '$interval', '$window'
  ];

  function eRopShinhanBanner100Ctrl(
    $scope, widgetUtilityService, config, $timeout,
    $rootScope, $interval, $window) {

    $scope.config     = config;
    $scope.themeId    = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page       = '';
    $scope.collapsed  = false;

    // 파티클 배열 생성
    $scope.particles  = [];

    // i18n
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          TXT_LABEL_SOC:     widgetUtilityService.translate('eRopShinhanBanner.TXT_LABEL_SOC')     || 'Security Operations Center',
          TXT_LABEL_POWERED: widgetUtilityService.translate('eRopShinhanBanner.TXT_LABEL_POWERED') || 'Powered by FortiSOAR',
          LABEL_REFRESH:     widgetUtilityService.translate('eRopShinhanBanner.LABEL_REFRESH')     || 'Refresh'
        };
      });
    }

    // 파티클 초기화 (20개)
    function _initParticles() {
      var ps = [];
      for (var i = 0; i < 20; i++) {
        ps.push({
          id:    i,
          left:  Math.random() * 100,      // % left
          size:  Math.random() * 6 + 2,    // 2~8px
          delay: Math.random() * 5,        // 0~5s delay
          dur:   Math.random() * 4 + 3,    // 3~7s duration
          opacity: Math.random() * 0.5 + 0.2
        });
      }
      $scope.particles = ps;
    }

    // 티커 메시지 구성
    function _buildTickerText() {
      var items = [];
      if (config.ticker_text) {
        items.push(config.ticker_text);
      } else {
        items = [
          '● Active Threat Monitoring 24/7',
          '◆ Shinhan Financial Group SOC',
          '■ Automated Incident Response',
          '● FortiSOAR Powered Security Operations',
          '◆ Real-time Threat Intelligence',
          '■ Compliance & Governance'
        ];
      }
      $scope.tickerText = items.join('    ✦    ');
    }

    // destroy 시 인터벌 정리
    $scope.$on('$destroy', function () {
      // nothing to clean for CSS animations
    });

    $scope.init = function () {
      _handleTranslations();
      _initParticles();
      _buildTickerText();
    };

    $scope.init();
  }
})();
