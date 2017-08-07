/**
 * pd-bin='pdTitle'顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"], function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('pdTitleEditor', function factory() {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/title-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	$scope.labelClass=function(className){
	    		$scope.bin.data.labelClass=className;
	    	};
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});