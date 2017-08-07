/**
 * pd-bin顶部的工具栏，css style的编辑
 */

define(['angular',"directives/directives","common/utils","directives/toolbar-editors/htmleditor/editor"], function(angular,directiveModule,utils,editor) {
	'use strict';
	var directive=directiveModule.directive('pdHtmleditorItem', function factory() {
	  var directiveDefinition = {
	    priority: 0,
	    replace: false,
	    transclude: false,
	    restrict: 'A',  
	    scope:true,
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	function init(){
	    		var cmdName=$attrs["pdHtmleditorItem"];
	    		var htmlEditor=$scope.htmlEditor;
	    		var toolbarItem=htmlEditor.getItem(cmdName);
	    		if(typeof(toolbarItem)=="undefined"){
	    			return;
	    		}
	    		toolbarItem.itemDom=$element;
	    		$scope.item=toolbarItem;
	    		$scope.$watch("item.styleValue",function styleValueWatchAction(value,oldValue){
		    		//初始化时，会调用一次
	    			if(value==oldValue){
		    			return ;
		    		}
	    			$scope.item.onClick();
		    	});
	    		$scope.$watch("item.state",function itemStateWatchAction(value,oldValue){
		    		if(value==-1){
		    			$element.hide();
		    		}else{
		    			$element.show();
		    		}
		    	});
	    	}
	    	init();
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});