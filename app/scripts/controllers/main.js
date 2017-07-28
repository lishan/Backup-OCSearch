'use strict';

/**
 * Main Controller
 */
angular.module('basic').controller('MainCtrl', ['$scope', 'searchService', 'hotkeys', '$state', '$rootScope', function ($scope, searchService, hotkeys, $state, $rootScope) {
  $rootScope.global = {
    tab: null
  };
  $scope.search = function(){
    searchService.search($scope.content, function(schemas){
      $state.go("result", {"schemas": schemas, "content": $scope.content});
    });
  };

  hotkeys.bindTo($scope)
    .add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: $scope.search
    });
}]);
