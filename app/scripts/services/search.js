'use strict';

angular.module('basic').service('searchService', ['$http', 'GLOBAL', '$q', function($http, GLOBAL, $q){
  this.search = function(content ,cb){
    $http.get(GLOBAL.host + "/schema/list").then(function(data){
      let results = data.data.schemas;
      let promises = [];
      //Solve: Functions declared within loops referencing an outer scoped variable may lead to confusing semantics
      let queryTable = i => $http.get(GLOBAL.host + "/table/get?name=" + results[i].name)
                                 .then(function (data) { results[i].tables = data.data.tables; });
      for(let i = 0; i < results.length; i++) {
        //!-- Functions declared within loops referencing an outer scoped variable may lead to confusing semantics
        //let p = $http.get(GLOBAL.host + "/table/get?name=" + results[i].name).then(function (data) {
          //results[i].tables = data.data.tables;
        //});
        promises.push(queryTable(i));
      }
      $q.all(promises).then(function(){
        cb(results);
      });
    });
  };
}]);
