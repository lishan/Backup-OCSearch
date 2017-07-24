'use strict';

/**
 * Controller of the dataModel
 */
angular.module('basic')
  .controller('DataModelCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.tab = "dataModel";
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
