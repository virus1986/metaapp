/**
 * pd-bin='pdSpecs'顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"], function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('pdSpecsEditor', function factory() {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/specs-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	$scope.labelClass=function(className){
	    		$scope.bin.data.labelClass=className;
	    	};
	    	$scope.toggleHr=function(){
	    		$scope.bin.$emit("toggleHr");
	    	};
	    	$scope.toggleH4=function(){
	    		$scope.bin.$emit("toggleH4");
	    	};
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});