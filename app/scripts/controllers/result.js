'use strict';

/**
 * Search Result Controller
 */
angular.module('basic').controller('ResultCtrl', ['$scope', 'searchService', '$stateParams', 'hotkeys', '$http', 'GLOBAL', function ($scope, searchService, $stateParams, hotkeys, $http, GLOBAL) {
  $scope.content = $stateParams.content;
  $scope.schemas = $stateParams.schemas;
  $scope.schema = null;
  $scope.search = function(){
    searchService.search($scope.content, function(schemas){
      $scope.schemas = schemas;
    });
  };

  hotkeys.bindTo($scope)
    .add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: $scope.search
    });

  $scope.choose = function(table){
    let fields = [];
    for(let i = 0; i < $scope.schema.fields.length; i++){
      fields.push($scope.schema.fields[i].name);
      console.log($scope.schema.fields[i]);
    }
    $http.post(GLOBAL.host + '/query/search', {
      "query": $scope.content,
      "condition": "",
      "start": 0,
      "rows": 10,
      "sort": "",
      "tables": [table],
      "return_fields": fields
    }).then(function(data){
      $scope.data = data.data.data;
    });
  };

  $scope.chooseSchema = function(item){
    $scope.schema = item;
  };
}]);
