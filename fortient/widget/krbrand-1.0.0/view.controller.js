/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('krbrand100Ctrl', krbrand100Ctrl);

  krbrand100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$timeout', '$interval', '$rootScope'
  ];

  function krbrand100Ctrl($scope, widgetUtilityService, config, $timeout, $interval, $rootScope) {

    $scope.config  = config;
    $scope.themeId = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.page    = '';

    var _DAYS_EN = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var _DAYS_KR = ['일','월','화','수','목','금','토'];
    var _MON_EN  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    // ── 실시간 시계 ───────────────────────────────────────────────────────
    function _tick() {
      var now = new Date();
      var h   = String(now.getHours()).padStart(2, '0');
      var m   = String(now.getMinutes()).padStart(2, '0');
      var s   = String(now.getSeconds()).padStart(2, '0');
      $scope.currentTime    = h + ':' + m + ':' + s;
      $scope.currentDateEn  = _DAYS_EN[now.getDay()] + '  ' +
                              _MON_EN[now.getMonth()] + ' ' +
                              String(now.getDate()).padStart(2, '0') + ', ' + now.getFullYear();
      $scope.currentDateKr  = now.getFullYear() + '.' +
                              String(now.getMonth() + 1).padStart(2, '0') + '.' +
                              String(now.getDate()).padStart(2, '0') +
                              ' (' + _DAYS_KR[now.getDay()] + ')';
      $scope.isWeekend      = (now.getDay() === 0 || now.getDay() === 6);
    }

    _tick();
    var _clockInterval = $interval(_tick, 1000);

    // ── i18n ─────────────────────────────────────────────────────────────
    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          LABEL_REFRESH: widgetUtilityService.translate('krbrand.LABEL_REFRESH') || 'Refresh'
        };
      });
    }

    // ── destroy ───────────────────────────────────────────────────────────
    $scope.$on('$destroy', function () {
      if (_clockInterval) { $interval.cancel(_clockInterval); }
    });

    // ── init ─────────────────────────────────────────────────────────────
    $scope.init = function () {
      _handleTranslations();
    };

    $scope.init();
  }
})();
