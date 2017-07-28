'use strict';

angular.module('basic').controller('TableCtrl', ['$scope', '$http', 'GLOBAL', '$uibModal', '$q', function ($scope, $http, GLOBAL, $uibModal, $q) {
  $scope.page = {
    table: {},
    tablesActive: []
  };
  $scope.selectTable = function(table, index){
    $scope.page.table = table;
    $scope.page.tablesActive = [];
    for(let i = 0 ; i < $scope.tables.length; i++){
      if(i === index){
        $scope.page.tablesActive.push(true);
      }else {
        $scope.page.tablesActive.push(false);
      }
    }
  };
  $scope.addTable = function(){
    let modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addTable.html',
      backdrop: 'static',
      scope: $scope,
      size: 'md',
      controller: ['$scope', '$http', function($scope, $http) {
        $scope.name = 'top';
        $scope.item = {
          hbase:{},
          solr:{}
        };
        $scope.ok = function(){
          console.log($scope.item);
          if($scope.item.schemaModel) {
            $scope.item.schema = $scope.item.schemaModel.name;
          }
          $http.post(GLOBAL.host + '/table/create', $scope.item).then(function(){
            $scope.item = {
              hbase:{},
              solr:{}
            };
            modalInstance.close();
          });
        };
        $scope.cancel = function(){
          modalInstance.close();
        };
      }]
    });
  };
  $q.all([$http.get(GLOBAL.host + "/table/list"), $http.get(GLOBAL.host + "/schema/list")]).then(function(data){
    $scope.tables = data[0].data.tables;
    if($scope.tables.length > 0){
      $scope.page.table = $scope.tables[0];
      $scope.page.tablesActive.push(true);
      for (let i = 1; i < $scope.tables.length; i++) {
        $scope.page.tablesActive.push(false);
      }
    }
    $scope.schemas = data[1].data.schemas;
  })
}]);
