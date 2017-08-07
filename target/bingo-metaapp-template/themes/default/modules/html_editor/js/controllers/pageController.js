'use strict';
/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 * 功能： 负责整个页面的布局设置、事件的分发等
 */

define(['angular',"controllers/controllers","common/utils","services/appPd","services/metauiTemplate",
        	"controllers/navbarController","controllers/sidebarController",
        	"services/templates","services/editorManager","services/binManager"],function(angular,ctrlModule,utils){	
	
		var pageController=ctrlModule.controller('pageController', ['$scope','MetauiTemplate',"editorManager","binManager","$compile", function ($scope,MetauiTemplate,editorManager,binManager,$compile) {

			function init(){
				$scope.ui={editSource:false};
				$scope.focus={el:null,type:"html"};
				$scope.designer={designerSourceContent:"",scriptContent:""};
				window.pd.setScope($scope);
				
				MetauiTemplate.get({id:Global.formId},function(formLayout){
					$scope.formLayout=formLayout||{};
					$scope.formInfo=formLayout.entityName+":"+formLayout.name;
					$("#edit-page-designer").html($compile($scope.formLayout.configData)($scope.$new()));
					$scope.designer.scriptContent=$("#script").text();
					$("#script").remove();
				});
					
				//激活
				$scope.$on("focusChanged.angular",function(event,focus){
					if($scope.focus.el==focus.el){
						return ;
					}
					activeFocus(focus);
				});
					
				//新增Dom元素
				
				
				//当前Dom元素被销毁
				$scope.$on("domDeleted.angular",function(event){
					clearFocus();
				});
				
				window.pd.on("removeTools",function(){
					clearFocus();
				});
			};
				
			function activeFocus(focus){
				$scope.focus=focus;
				if(focus.type=="bin" || $(focus.el).attr("layout-id")){
					var bin=focus.el.scope();
					binManager.activeBin(bin);
				}
				
			};
			
			function clearFocus(){
				$scope.focus={el:null,type:"html"};
			};
			init();
		}]);
		return pageController;
});
