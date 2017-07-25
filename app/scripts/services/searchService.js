'use strict';

/**
 * Main Controller
 */
angular.module('basic').service('searchService', ['$http', 'GLOBAL', '$state', function($http, GLOBAL, $state){
  this.search = function(content){
    $http.get(GLOBAL.host + "/table/list").then(function(data){
      $state.go("result", {tables: data.data.tables, content: content});
    });
  }
}]);
