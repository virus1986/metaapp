/**
 * pd-bin='metaRelation'顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"],function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('metaRelationEditor', ["$http", function factory($http) {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/metarelation-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs","relationService",function($scope, $element, $attrs,relationService) {
	    	$scope.relationLinks=relationService.relationLinks;
	    	$scope.labelClass=function(className){
	    		$scope.bin.data.labelClass=className;
	    	};
	    	$scope.setupRelation=function(){
	    		$("#relationConfigModal").find(":checkbox").attr("checked",true);
	    		var excludeRelations=$scope.bin.data.excludeRelationNames;
	    		if(typeof excludeRelations ==="string"){
	    			var excludes=excludeRelations.split(",");
	    			for(var i=0;i<excludes.length;++i){
	    				$("#relationConfigModal [value="+excludes[i]+"]").removeAttr("checked");
	    			}
	    		}
	    		window.setTimeout(function(){
	    			$(".modal-backdrop").appendTo("#breadcrumbs");
	    		},500);
	    	};
	    	$scope.saveSetupRelation=function(){
	    		var excludeRelations=$("#relationConfigModal").find("input:not(:checked)");
	    		var excludes=[];
	    		for(var i=0;i<excludeRelations.length;++i){
	    			excludes.push($(excludeRelations[i]).val());
	    		}
	    		$scope.bin.data.excludeRelationNames=excludes.join(",");
	    	};
	    }],
	    link:function postLink(scope, iElement, iAttrs) {
			
		}
	  };
	  return directiveDefinition;
	}]);
	return directive;
});