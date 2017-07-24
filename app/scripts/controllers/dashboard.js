'use strict';

/**
 * Controller of the dashboard
 */
angular.module('basic')
  .controller('DashboardCtrl',['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.tab = "dashboard";
    $scope.labels1 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
    $scope.data1 = [300, 500, 100, 40, 120];
    $scope.labels2 = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series2 = ['Series A', 'Series B'];
    $scope.data2 = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.labels3 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series3 = ['Series A', 'Series B'];
    $scope.data3 = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
  }]);
