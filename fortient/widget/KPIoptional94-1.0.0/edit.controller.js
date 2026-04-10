/* Copyright start
  MIT License
  Copyright (c) 2026
  Copyright end */
'use strict';

(function () {
  angular
    .module('cybersponse')
    .controller('editERopCssEarthGlobe100Ctrl', editERopCssEarthGlobe100Ctrl);

  editERopCssEarthGlobe100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config'];

  function editERopCssEarthGlobe100Ctrl($scope, $uibModalInstance, config) {
    $scope.config = angular.extend({
      title: 'Earth Globe',
      caption: 'Global Security Overview',
      emptyText: 'No data to display.'
    }, config || {});

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function () {
      if ($scope.editForm.$invalid) {
        $scope.editForm.$setTouched();
        if ($scope.editForm.$focusOnFirstError) {
          $scope.editForm.$focusOnFirstError();
        }
        return;
      }
      $uibModalInstance.close($scope.config);
    };
  }
})();