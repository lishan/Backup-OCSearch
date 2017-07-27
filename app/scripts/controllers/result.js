'use strict';

/**
 * Search Result Controller
 */
angular.module('basic').controller('ResultCtrl', ['$scope', 'searchService', '$stateParams', 'hotkeys', '$http', 'GLOBAL', function ($scope, searchService, $stateParams, hotkeys, $http, GLOBAL) {
  /**
   * Initialize params
   */
  $scope.content = $stateParams.content;
  $scope.schemas = $stateParams.schemas;
  $scope.condition = "";
  $scope.host = GLOBAL.host;
  $scope.page = {
    schema : {},
    tables: [],
    fields: [],
    actives: [],
    rows: 5,
    rowOptions:[5,10,20,50],
    pagination:{
      current : 1
    },
  };

  /**
   * Page Methods;
   */
  $scope.search = function(){
    searchService.search($scope.content, function(schemas){
      $scope.schemas = schemas;
      if(schemas && schemas.length > 0) {
        $scope.chooseSchema(schemas[0], 0);
      }
    });
  };

  $scope._choose = function(){
    let tables = [];
    for(let i = 0; i < $scope.page.tables.length; i++){
      if($scope.page.actives[i]){
        tables.push($scope.page.tables[i]);
      }
    }
    $http.post(GLOBAL.host + '/query/search', {
      "query": $scope.content,
      "condition": $scope.condition,
      "start": ($scope.page.pagination.current-1) * $scope.page.rows,
      "rows": $scope.page.rows,
      "sort": "",
      "tables": tables,
      "return_fields": $scope.page.fields
    }).then(function(data){
      $scope.data = data.data.data;
      if($scope.data) {
        $scope.page.pagination.total = $scope.data.total;
      }
    });
  };

  $scope.choose = function(table){
    if($scope.page.tables) {
      for (let i = 0; i < $scope.page.tables.length; i++) {
        if ($scope.page.tables[i] === table) {
          $scope.page.actives[i] = !$scope.page.actives[i];
          break;
        }
      }
    }
    $scope._choose();
  };

  $scope.chooseSchema = function(item, index){
    $scope.page.schema = item;
    $scope.page.chooseIndex = index;
    $scope.page.tables = item.tables;
    $scope.page.actives = [];
    if(item.tables && item.tables.length > 0){
      for(let i = 0; i < item.tables.length; i++){
        $scope.page.actives[i] = true;
      }
    }
    $scope.page.fields = [];
    for(let i = 0; i < item.fields.length; i++){
      $scope.page.fields.push(item.fields[i].name);
    }
    $scope._choose();
  };

  $scope.pageChanged = function(){
    $scope._choose();
  };

  $scope.toggleSideBar = function(){
    $scope.$broadcast('openSidebar');
  };

  /**
   * Global init functions
   */
  if($scope.schemas && $scope.schemas.length > 0) {
    $scope.chooseSchema($scope.schemas[0], 0);
  }

  hotkeys.bindTo($scope)
    .add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: $scope.search
    });
}]);
