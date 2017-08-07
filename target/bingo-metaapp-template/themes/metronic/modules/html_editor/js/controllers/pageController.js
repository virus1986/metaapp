'use strict';
/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 * 功能： 负责整个页面的布局设置、事件的分发等
 */

define(['angular',"controllers/controllers","common/utils","services/appPd","services/metauiTemplate",
        	"controllers/navbarController","controllers/sidebarController","services/layoutService",
        	"services/templates","services/editorManager","services/binManager"],function(angular,ctrlModule,utils){	
	
		var pageController=ctrlModule.controller('pageController', ['$scope','MetauiTemplate',"editorManager","binManager","$compile","templates","layoutService", function ($scope,MetauiTemplate,editorManager,binManager,$compile,templates,layoutService) {

			function init(){
				$scope.workflow=Global.workflow;
				$scope.uiEntityDesignTitle="架构设计";
				$scope.pageDesignerTitle="表单设计器";
				$scope.ui={editSource:false,editPage:true,entityDesign:false};
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
				
				$scope.switchTemplate=function(type){
					var path=layoutService.baseFormTemplates[type];
					if(path){
						var layoutTemplate=templates.tmpl(path);
						var containedLayouts=$("#edit-page-designer").find("[layout-id]");////layout or html may contain layouts
		    			var containedBins=$("#edit-page-designer").find("[bin-id]");//layout or html may contain bins
		    			containedLayouts.each(function(i,ele){
		    				var bin=binManager.findBin($(ele).attr("layout-id"));
		    				binManager.notifyBinBeforeDelete(bin);
		    			});
		    			containedBins.each(function(i,ele){
		    				var bin=binManager.findBin($(ele).attr("bin-id"));
		    				binManager.notifyBinBeforeDelete(bin);
		    			});
						$("#edit-page-designer").html($compile(layoutTemplate)($scope.$new()));
						$scope.designer.scriptContent=$("#script").text();
						$("#script").remove();
					}else{
						alert("未找到对应的模板，无法切换");
					}
					$("#templateSwitchModal").modal('hide');
				};
					
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
				
				initIframeInfo();
				
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
			
			function initIframeInfo(){
				if(self==top) return;
				$scope.iframeId=utils.getParameter("_iframe_id",window.location.href);
			};
			
			init();
		}]);
		return pageController;
});
