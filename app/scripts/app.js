'use strict';

/**
 * @ngdoc overview
 * @name basicApp
 * @description
 * # basicApp
 *
 * Main module of the application.
 */
angular
  .module('basic', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'ngFileUpload',
    "isteven-multi-select",
    "dndLists",
    'ui.bootstrap',
    'ui-notification',
    'angularSpinner',
    'ngCookies',
    'ui.select',
    'toggle-switch',
    'cfp.hotkeys',
    'ui.bootstrap.datetimepicker',
    'angularMoment',
    'chart.js',
    'cp.ngConfirm'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, NotificationProvider) {
    $urlRouterProvider.otherwise("home");
    $stateProvider
      .state('home', {
        url:"/home",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('schema', {
        url:"/schema",
        templateUrl: 'views/schema.html',
        controller: 'SchemaCtrl'
      })
      .state('table', {
        url:"/table",
        templateUrl: 'views/table.html',
        controller: 'TableCtrl'
      })
      .state('result', {
        url:"/result",
        params: {"schemas": null, content: null},
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl'
      });
    $httpProvider.interceptors.push('spinnerInterceptor');
    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  }).constant('GLOBAL', {
    host: './ocsearch-service',
  }).run(['$rootScope', function ($rootScope) {
    $rootScope.global = {
      tab: null
    };
    $rootScope.functions = {};
    $rootScope.functions.click = function(item){
      $rootScope.global.tab = item;
    };
  }]);
