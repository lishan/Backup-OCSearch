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
    'chart.js'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise("home");
    $stateProvider
      .state('home', {
        url:"/home",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('result', {
        url:"/result",
        params: {"schemas": null, content: null},
        templateUrl: 'views/result.html',
        controller: 'ResultCtrl'
      });
    $httpProvider.interceptors.push('spinnerInterceptor');
  }).constant('GLOBAL', {
    host: './ocsearch-service',
  });
