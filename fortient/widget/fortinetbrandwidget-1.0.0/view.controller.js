/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('fortinetbrandwidget100Ctrl', fortinetbrandwidget100Ctrl);

  fortinetbrandwidget100Ctrl.$inject = [
    '$scope', 'widgetUtilityService', 'config', '$rootScope', '$interval'
  ];

  function fortinetbrandwidget100Ctrl(
    $scope, widgetUtilityService, config, $rootScope, $interval) {

    $scope.config  = config;
    $scope.themeId = $rootScope.theme ? $rootScope.theme.id : 'dark';
    $scope.clock   = null;
    $scope.page    = '';

    var clockInterval;

    var _MONTHS  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var _WEEKDAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

    function _pad(n) { return n < 10 ? '0' + n : String(n); }

    function _updateClock() {
      var now = new Date();
      var h   = now.getHours();
      var m   = now.getMinutes();
      var s   = now.getSeconds();
      $scope.clock = {
        hours:   _pad(h),
        minutes: _pad(m),
        seconds: _pad(s),
        ampm:    h >= 12 ? 'PM' : 'AM',
        date:    _MONTHS[now.getMonth()] + ' ' + _pad(now.getDate()) + ', ' + now.getFullYear(),
        weekday: _WEEKDAYS[now.getDay()]
      };
    }

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          LABEL_REFRESH: widgetUtilityService.translate('fortinetbrandwidget.LABEL_REFRESH') || 'Refresh'
        };
      });
    }

    $scope.$on('$destroy', function () {
      if (clockInterval) { $interval.cancel(clockInterval); }
    });

    $scope.init = function () {
      _handleTranslations();
      _updateClock();
      clockInterval = $interval(_updateClock, 500);
    };

    $scope.getList = function () { _updateClock(); };

    $scope.init();
  }
})();
