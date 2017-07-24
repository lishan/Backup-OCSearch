'use strict';

/**
 * Main Controller
 */
angular.module('basic').controller('MainCtrl', ['$scope', '$http', 'GLOBAL', function ($scope, $http, GLOBAL) {
  $scope.search = function(){
    console.log($scope.content);
    $http.get(GLOBAL.host + "/table/list").then(function(data){
      console.log(data);
    });
  }
}]);
