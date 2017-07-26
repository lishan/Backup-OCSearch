'use strict';

angular.module('basic').directive('autoBlurBtn', function(){
  return function(scope, element, attributes) {
    scope.$watch(attributes.autoBlurBtn, function(newVal, oldVal) {
      if (newVal === false && oldVal === true) {
        element[0].blur();
      }
    });
  };
});
