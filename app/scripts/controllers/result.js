'use strict';

/**
 * Search Result Controller
 */
angular.module('basic').controller('ResultCtrl', ['$scope', 'searchService', '$stateParams', function ($scope, searchService, $stateParams) {
  $scope.content = $stateParams.content;
  $scope.tables = $stateParams.tables;
  $scope.search = function(){
    searchService.search($scope.content);
  }
}]);
