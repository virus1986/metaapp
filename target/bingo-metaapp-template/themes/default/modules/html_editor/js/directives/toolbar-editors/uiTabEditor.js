/**
 * ui-tab顶部的工具栏
 */

define(['angular',"directives/directives","common/utils"], function(angular,directiveModule,utils) {
	'use strict';
	var directiveName="uiTabEditor";
	var directive=directiveModule.directive(directiveName,["$http", function factory($http) {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/ui-tab-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	var tabElement=$scope.bin.element;
	    	$scope.isBottomTab=tabElement.hasClass("tabs-bottom");
			var tabsMap=$scope.bin.tabsMap;
			$scope.setupEditTab=function(){
				var tabsData=[];
				$.each(tabsMap,function(contentDivId,tab){
					var $aNew=tab.a;
					var text=$aNew.text();
					var href=$aNew.attr("href");
					tabsData.push({text:text,add:true,href:href,tabId:tab.contentDiv.attr("id")});
				});
				$("#accordion-edit-tab").html($("#editTabTemplate").render(tabsData));
				$("#editTabModal").on("click",".remove-tab",function(e){
					e.preventDefault();
					if($("#accordion-edit-tab").find(".accordion-group").length===1){
						alert("The last tab is not allowed to delete!");
						$(this).attr("disabled","disabled");
						return;
					}
					var $curAccordion=$(this).closest(".accordion-group");
					var tabId=$curAccordion.attr("data-tabId");
					var tab=tabsMap[tabId];
					if(tab){
						tab.a.parent().remove();
						tab.contentDiv.remove();
						$curAccordion.remove();
					}
					delete tabsMap[tabId];
				});
				
			};
			$scope.setupAddTab=function(){
				$("#add-tab-form").find("input[type=text]").val("");
				$("#add-tab-form").find("[value=yes]").prop("checked",true);
				$("#add-tab-form").find("[name=useUrl]").click(function(){
					var checkedValue=$("#add-tab-form").find("[name=useUrl]:checked").val();
					if(checkedValue==="yes"){
						$("#add-tab-form").find(".use-url").show();
					}else{
						$("#add-tab-form").find(".use-url").hide().val("");
					}
				});
			};
			$scope.saveSetupAddTab=function(){
				var currentElement=tabElement;
				var $currentEditTabUl=currentElement.children("ul");
				if($currentEditTabUl&&$currentEditTabUl.length===1){
					var $tabForm=$("#add-tab-form");
					var text=$tabForm.find("[name=text]").val();
					var url=$tabForm.find("[name=url]").val();
					var useUrl=$("#add-tab-form").find("[name=useUrl]:checked").val(),isUseUrl=false;
					var contendDivId,navLi,tab;
					if(useUrl==="yes"){
						if((!text)||(!url)){
							return false;
						}
						isUseUrl=true;
						contendDivId="#"+url;
						tab=[{text:text,href:url,useUrl:true}];
					}else{
						contendDivId=utils.newGuid();
						tab=[{text:text,href:"#"+contendDivId}];
					}
					navLi=$($("#addTabTemplate").render(tab));
					$scope.bin.addNewTab(tabElement,contendDivId,navLi,isUseUrl);
				}
			};
	    }],
	    link:function postLink(scope, iElement, iAttrs) {
		}
	  };
	  return directiveDefinition;
	}]);
	return directive;
});