/**
 * pd-bin顶部的工具栏，css style的编辑
 */

define(['angular',"directives/directives","common/utils","directives/toolbar-editors/htmleditor/editor","directives/toolbar-editors/pdHtmleditorItem"], function(angular,directiveModule,utils,editor) {
	'use strict';
	var directive=directiveModule.directive('pdHtmleditor', function factory() {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/html-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	function init(){
	    		$scope.htmlEditor=editor;
	    		editor.selectionChange($($scope.focus.current.el[0]));
	    		$($scope.focus.current.el).attr("contenteditable",true);
	    		$scope.$on("$destroy",function(){
	    			$($scope.focus.current.el).removeAttr("contenteditable");
	    		});
	    	}
	    	init();
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});