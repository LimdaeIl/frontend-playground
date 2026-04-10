/* Copyright start
  MIT License
  Copyright (c) 2026
  Copyright end */
'use strict';

(function () {
  angular
    .module('cybersponse')
    .controller('eRopCssEarthGlobe100Ctrl', eRopCssEarthGlobe100Ctrl);

  eRopCssEarthGlobe100Ctrl.$inject = ['$scope', 'config', '$element', '$timeout'];

  function eRopCssEarthGlobe100Ctrl($scope, config, $element, $timeout) {
    $scope.config = angular.extend({
      title: 'Earth Globe',
      caption: 'Global Security Overview',
      emptyText: 'No data to display.',
      rotationSpeed: 0.35
    }, config || {});

    $scope.collapsed = false;
    $scope.noData = false;

    var _canvas = null;
    var _ctx = null;
    var _textureCanvas = null;
    var _textureCtx = null;
    var _textureImage = null;
    var _animationId = null;
    var _phase = 0;
    var _ready = false;
    var _resizeTimer = null;

    // base64 지도 이미지 넣는 자리
    // 이전에 만들었던 data:image/jpeg;base64,... 문자열을 여기 넣으면 됩니다.
    // 너무 길어서 여기서는 PLACEHOLDER로 둡니다.
    var WORLD_MAP_DATA_URI = 'PUT_YOUR_BASE64_WORLD_MAP_HERE';

    function _init() {
      $timeout(function () {
        _canvas = $element[0].querySelector('.erop-css-earth-canvas');
        if (!_canvas) {
          return;
        }

        _ctx = _canvas.getContext('2d');
        _prepareTexture();
        _bindResize();
      }, 0);
    }

    function _prepareTexture() {
      _textureCanvas = document.createElement('canvas');
      _textureCanvas.width = 2048;
      _textureCanvas.height = 1024;
      _textureCtx = _textureCanvas.getContext('2d');

      _textureImage = new Image();
      _textureImage.onload = function () {
        _textureCtx.clearRect(0, 0, _textureCanvas.width, _textureCanvas.height);
        _textureCtx.drawImage(_textureImage, 0, 0, _textureCanvas.width, _textureCanvas.height);
        _ready = true;
        _resizeCanvas();
        _startAnimation();
      };
      _textureImage.onerror = function () {
        $scope.noData = true;
        if (!$scope.$$phase) {
          $scope.$applyAsync();
        }
      };
      _textureImage.src = WORLD_MAP_DATA_URI;
    }

    function _resizeCanvas() {
      if (!_canvas) {
        return;
      }

      var rect = _canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      _canvas.width = Math.round(rect.width);
      _canvas.height = Math.round(rect.height);

      if (_ready) {
        _render();
      }
    }

    function _bindResize() {
      function onResize() {
        clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(function () {
          _resizeCanvas();
        }, 120);
      }

      window.addEventListener('resize', onResize);
      $scope.$on('$destroy', function () {
        window.removeEventListener('resize', onResize);
      });
    }

    function _startAnimation() {
      _stopAnimation();

      function tick() {
        if (!$scope.collapsed && _ready) {
          _phase += $scope.config.rotationSpeed || 0.35;
          _render();
        }
        _animationId = window.requestAnimationFrame(tick);
      }

      tick();
    }

    function _stopAnimation() {
      if (_animationId) {
        window.cancelAnimationFrame(_animationId);
        _animationId = null;
      }
    }

    function _render() {
      if (!_ctx || !_textureCtx || !_canvas) {
        return;
      }

      var w = _canvas.width;
      var h = _canvas.height;
      var cx = w / 2;
      var cy = h / 2;
      var radius = Math.min(w, h) / 2;

      _ctx.clearRect(0, 0, w, h);

      // 원형 클리핑
      _ctx.save();
      _ctx.beginPath();
      _ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      _ctx.closePath();
      _ctx.clip();

      // 바다 바탕
      var ocean = _ctx.createRadialGradient(
        cx - radius * 0.25, cy - radius * 0.3, radius * 0.15,
        cx, cy, radius
      );
      ocean.addColorStop(0, '#4dd8ff');
      ocean.addColorStop(0.45, '#1789df');
      ocean.addColorStop(1, '#0a3d78');
      _ctx.fillStyle = ocean;
      _ctx.fillRect(0, 0, w, h);

      // 구면 투영 비슷한 효과:
      // 화면 x 위치를 구의 경도처럼 보고, texture에서 비선형 샘플링
      var texW = _textureCanvas.width;
      var texH = _textureCanvas.height;
      var yTop = cy - radius;
      var diameter = radius * 2;
      var offset = ((_phase % 360) / 360) * texW;

      var dx;
      for (dx = 0; dx < diameter; dx += 1) {
        var nx = (dx / diameter) * 2 - 1;   // -1 ~ 1
        var edge = Math.sqrt(Math.max(0, 1 - nx * nx)); // 구 가장자리 압축
        var stripHeight = diameter * edge;
        var drawY = cy - stripHeight / 2;
        var sampleX = Math.acos(nx) / Math.PI; // 0~1
        var texX = Math.floor((sampleX * texW + offset) % texW);

        // 1px strip 샘플링
        _ctx.drawImage(
          _textureCanvas,
          texX, 0, 1, texH,
          cx - radius + dx, drawY, 1, stripHeight
        );
      }

      // 약한 블러/광량 보정 느낌
      _ctx.fillStyle = 'rgba(255,255,255,0.04)';
      _ctx.fillRect(0, 0, w, h);

      // 밤/낮 경계 음영
      var shade = _ctx.createLinearGradient(
        cx - radius, cy,
        cx + radius, cy
      );
      shade.addColorStop(0.00, 'rgba(0,0,0,0.52)');
      shade.addColorStop(0.28, 'rgba(0,0,0,0.20)');
      shade.addColorStop(0.55, 'rgba(255,255,255,0.03)');
      shade.addColorStop(0.75, 'rgba(255,255,255,0.12)');
      shade.addColorStop(1.00, 'rgba(255,255,255,0.00)');
      _ctx.fillStyle = shade;
      _ctx.fillRect(0, 0, w, h);

      // 가장자리 비네팅
      var vignette = _ctx.createRadialGradient(cx, cy, radius * 0.55, cx, cy, radius);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.72, 'rgba(0,0,0,0.02)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.28)');
      _ctx.fillStyle = vignette;
      _ctx.fillRect(0, 0, w, h);

      _ctx.restore();

      // 하이라이트
      _ctx.save();
      _ctx.beginPath();
      _ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      _ctx.closePath();
      _ctx.clip();

      var highlight = _ctx.createRadialGradient(
        cx - radius * 0.35, cy - radius * 0.42, radius * 0.05,
        cx - radius * 0.25, cy - radius * 0.25, radius * 0.75
      );
      highlight.addColorStop(0, 'rgba(255,255,255,0.24)');
      highlight.addColorStop(0.22, 'rgba(255,255,255,0.10)');
      highlight.addColorStop(1, 'rgba(255,255,255,0)');
      _ctx.fillStyle = highlight;
      _ctx.fillRect(0, 0, w, h);

      _ctx.restore();
    }

    $scope.$watch('collapsed', function (newVal) {
      if (!newVal && _ready) {
        $timeout(function () {
          _resizeCanvas();
        }, 50);
      }
    });

    $scope.$on('$destroy', function () {
      _stopAnimation();
      clearTimeout(_resizeTimer);
    });

    _init();
  }
})();