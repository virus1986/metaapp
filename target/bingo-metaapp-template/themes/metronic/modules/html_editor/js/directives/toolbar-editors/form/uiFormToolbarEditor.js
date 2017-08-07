/**
 * ui-form-toolbar 顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"], function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('uiFormToolbarEditor',["$http", function factory($http) {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/form/ui-form-toolbar-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	$scope.operations=[];
	    	var url=Global.contextPath+"/html_editor/"+Global.entityName+"/operation/";
			$http.get(url).success(function(opts){
				if(opts){
					$scope.operations=opts;
				}
			});
			$scope.setupOperation=function(){
				var currentElement=$scope.bin.element;
				var $currentFormToolbar=currentElement.children("ul");
				var existsButtons=$currentFormToolbar.find("li.form-toolbar-button");
				var $toolbarModelBody=$("#toolbarConfigModal .modal-body");
				$toolbarModelBody.find("input:checked").removeProp("checked");
				for(var i=0;i<existsButtons.length;++i){
					var dataFunc=$(existsButtons[i]).attr("data-func");
					var $currentInput=$toolbarModelBody.find("input[value='"+dataFunc+"']");
					$currentInput.prop("checked",true);
					$currentInput.parent().insertBefore($toolbarModelBody.find(".checkbox:eq("+i+")"));
				}
			};
			$scope.saveSetupOperation=function(){
				var currentElement=$scope.bin.element;
				var $currentFormToolbar=currentElement.children("ul");
				var $toolbarModelBody=$("#toolbarConfigModal .modal-body");
				var addButtons=$toolbarModelBody.find("input:checked");
				var datas=[];
				for(var i=0;i<addButtons.length;++i){
					var $button=$(addButtons[i]);
					var mainFunc=$button.val();
					var displayName=$button.attr("data-displayName");
					var icon=$button.attr("data-icon");;
					datas.push({"mainFunc":mainFunc,"displayName":displayName,"icon":icon});
				}
				if($currentFormToolbar){
					$currentFormToolbar.find(".form-toolbar-button").remove();
					$currentFormToolbar.append($("#addToolbarButtonTemplate").render(datas));
				}
			};
			
	    }],
	    link:function postLink(scope, iElement, iAttrs) {
	    	$(iElement).find("#toolbarConfigModal .modal-body").sortable({
	    		opacity: .35,
	    		items:".checkbox",
	    		connectWith: "#toolbarConfigModal .modal-body",
	    		stop: function(e,t) {
	    			
	    		}
	    	});
		}
	  };
	  return directiveDefinition;
	}]);
	return directive;
});