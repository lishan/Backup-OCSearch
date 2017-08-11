'use strict';

angular.module('basic').controller('SchemaCtrl', ['$scope', '$http', 'GLOBAL', '$uibModal', '$q', function ($scope, $http, GLOBAL, $uibModal, $q) {

  $scope.page = {
    schema: {},
    schemasActive: []
  };

  $scope.selectSchema = function(schema, index) {
    $scope.page.schema = schema;
    $scope.page.schemasActive = [];
    for (let i = 0; i < $scope.schemas.length; i++) {
      if ( i === index ) {
        $scope.page.schemasActive.push(true);
      } else {
        $scope.page.schemasActive.push(false);
      }
    }
  };

  $scope.addSchema = function() {
    let modealInstance = $uibModal.open({
      animation: true,
      templateUrl: 'addSchema.html',
      backdrop: 'static',
      scope: $scope,
      size: 'md',
      controller: ['$scope', '$http', '$ngConfirm', function($scope, $http, $ngConfirm) {
        // Temp new schema
        $scope.newschema = {
          name: "",
          rowkey_expression: "",
          table_expression: "",
          index_type: "",
          content_fields: [],
          inner_fields: [],
          query_fields: [],
          fields: []
        };
        // schema index type
        $scope.index_type = [
          { val: 0, display: "hbase+indexer+solr" },
          { val: -1, display: "hbase only" },
          { val: 1, display: "solr" }
        ];
        // field store type
        $scope.field_type = [ 
          "int", "long", "float", "double", "string", "Boolean", "File", "Attachment"
        ];
        // field index type
        $scope.field_index_type = [
          "int", "int_d", "ints", "tint", "tint_d", "tints",
          "double", "double_d", "doubles", "tdouble", "tdouble_d", "tdoubles",
          "float", "float_d", "floats", "tfloat", "tfloat_d", "tfloats",
          "long", "long_d", "longs", "tlong", "tlong_d", "tlongs",
          "string", "string_d", "strings", "lowercase",
          "tdate", "tdate_d", "tdates", "text_en", "text_general", "text_ik"
        ];
        // Temp new content field
        $scope.new_content_field = { name: null, type: null };
        // Temp new inner field
        $scope.new_inner_field = { name: null, separator: null };
        // Temp new field
        $scope.new_field = { name: null, store_type: null, indexed: true, index_stored: false };
        // Temp new query field
        $scope.new_query_field = { name: null, weight: null };

        // Functions of Content Field
        $scope.addContentField = function() {
          $scope.newschema.content_fields.push($scope.new_content_field);
          $scope.new_content_field = { name: null, type: null };
        };
        $scope.removeContentField = function($index) {
          $scope.newschema.content_fields.splice($index, 1);
        };

        // Functions of Inner Field
        $scope.addInnerField = function() {
          $scope.newschema.inner_fields.push($scope.new_inner_field);
          $scope.new_inner_field = { name: null, separator: null };
        };
        $scope.removeInnerField = function($index) {
          $scope.newschema.inner_fields.splice($index, 1);
        };

        // Functions of Define Field
        $scope.addField = function() {
          if(!$scope.new_field.index_type) { delete $scope.new_field.index_type; }
          if(!$scope.new_field.content_field) { delete $scope.new_field.content_field; }
          if(!$scope.new_field.inner_field) { delete $scope.new_field.inner_field; }
          $scope.newschema.fields.push($scope.new_field);
          $scope.new_field = { name: null, store_type: null, indexed: true, index_stored: false };
        };
        $scope.removeField = function($index) {
          $scope.newschema.fields.splice($index, 1);
        };
        $scope.checkIndexType = function() {
          if (!($scope.new_field.indexed || $scope.new_field.content_field)) {
            $scope.new_field.index_type = null;
          }
        };

        // Functions of Query Field
        $scope.addQueryField = function() {
          $scope.newschema.query_fields.push($scope.new_query_field);
          $scope.new_query_field = { name: null, weight: null };
        };
        $scope.removeQueryField = function($index) {
          $scope.newschema.query_fields.splice($index, 1);
        };

        // Functions of Add Schema steps
        $scope.addsteps = ["step1", "step2", "step3"];
        $scope.curstep = 0;
        $scope.next = function() {
          $scope.curstep = ($scope.curstep + 1) % $scope.addsteps.length;
        };
        $scope.prev = function() {
          $scope.curstep = ($scope.curstep - 1) % $scope.addsteps.length;
        };
        $scope._ok = function() {
          console.log($scope.newschema);
        };
        $scope.ok = function() {
          $ngConfirm({
            title: "Confirmation",
            Content: "Are you sure?",
            scope: $scope,
            buttons: {
              Yes: {
                text: "Yes",
                action: function(scope) {
                  scope._ok();
                  modealInstance.close();
                }
              },
              No: {
                text: "No",
              }
            }
          });
        };
        $scope.cancel = function() {
          modealInstance.close();
        };

        // Functions of filter
        $scope.typeFilter = {
          content: function(item) { return /^text/.test(item); },
          int: function(item) { return /int/.test(item); },
          float: function(item) { return /float/.test(item); },
          double: function(item) { return /double/.test(item); },
          long: function(item) { return /long/.test(item); },
          string: function(item) { return /(string|date|text|lowercase)/.test(item); },
          Boolean: function() { return false; },
          File: function() { return false; },
          Attachment: function() { return false; }
        };
        
        $scope.queryFilter = function(item) {
          return item.index_type;
        };

      }] // END of controller
    }); // END of modal instance
  };

  //Initial load function
  $http.get(GLOBAL.host + "/schema/list").then(function(data) {
    $scope.schemas = data.data.schemas;
    if($scope.schemas.length > 0) {
      $scope.page.schema = $scope.schemas[0];
      $scope.page.schemasActive.push(true);
      for (let i = 1; i < $scope.schemas.length; i++) {
        $scope.page.schemasActive.push(false);
      }
    }
  });

}]);