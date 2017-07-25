'use strict';

/**
 * Main Controller
 */
angular.module('basic').controller('MainCtrl', ['$scope', 'searchService', function ($scope, searchService) {
  $scope.search = function(){
    searchService.search($scope.content);
  }
}]);
