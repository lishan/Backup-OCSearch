'use strict';

angular.module('basic').service('searchService', ['$http', 'GLOBAL', '$q', function($http, GLOBAL, $q){
  this.search = function(content ,cb){
    $http.get(GLOBAL.host + "/schema/list").then(function(data){
      let results = data.data.schemas;
      let promises = [];
      for(let i = 0; i < results.length; i++) {
        let p = $http.get(GLOBAL.host + "/table/get?name=" + results[i].name).then(function (data) {
          results[i].tables = data.data.tables;
        });
        promises.push(p);
      }
      $q.all(promises).then(function(){
        cb(results);
      })
    })

  }
}]);
