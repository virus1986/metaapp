/*global define*/
'use strict';
/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 * 功能： 负责整个页面的布局设置、事件的分发等
 */
define(['angular',"controllers/controllers","services/sourceManager","common/utils","services/toolbarService"],function(angular,ctrlModule,sm,utils){	
	var navbarController=ctrlModule.controller('navbarController',["$scope","$compile","sourceManager","toolbarService","MetauiTemplate", function ($scope,$compile,sourceManager,toolbarService,MetauiTemplate) {
		$scope.sourceBtnClick=function(){
			$scope.ui.editSource=!$scope.ui.editSource;
			if($scope.ui.editSource){
				$scope.ui.editPage=false;//hide form design page
				$scope.ui.entityDesign=false;//hide entity design page 
				toolbarService.removeAll();
				$scope.designer.designerSourceContent=utils.formatXml(sourceManager.getMainPageDesignerSource());
			}else{
				$scope.ui.editPage=true;//show form design page
				var content=$scope.designer.designerSourceContent;
				var newScope=$scope.$new();
				$("#edit-page-designer").html($compile(content)(newScope));
			}
		};
		$scope.scriptBtnClick=function($event){
			var $element=$("#scripteditor");
			$("#scriptModal").off('shown');
			$("#scriptModal").on('shown', function () {
				var aceEditor=$element.data("ace");
				if(aceEditor&&!$element.is(":hidden")){
					aceEditor.setReadOnly(false);
					aceEditor.setValue(aceEditor.getValue(),-1);
					aceEditor.gotoLine(1);
				}
			});
		};
		$scope.frameworkDesignBtnClick=function($event){
			/*var entityName=Global.entityName;
			var entityName1=$scope.formLayout.entityName;
			var url=Global.contextPath+"/html_editor/"+entityName+"/entityConfig?_inframe=1";
			$("#frameworkDesignIframe").attr("src",url);
			$("#frameworkDesignModal").off('hidden');
			$("#frameworkDesignModal").on('hidden', function () {
				window.location.reload(true);
			});*/
			saveLayout(function(newLayout){
				$scope.ui.entityDesign=!$scope.ui.entityDesign;
				if($scope.ui.entityDesign){
					$scope.uiEntityDesignTitle="退出架构设计";
					$scope.ui.editSource=false;//hide source edit page
					$scope.ui.editPage=false;//hide form design page
					var entityName=Global.entityName;
					var url=Global.contextPath+"/html_editor/"+entityName+"/entityConfig?_inframe=1";
					$("#frameworkDesignIframe").attr("src",url);
				}else{
					window.location.reload(true);
				}
			});
		};
		function saveLayout(callback){
			var newFormTemplate=sourceManager.getToSavedTemplate();
			$scope.formLayout.template=newFormTemplate;
			$scope.formLayout.configData=null;
			var layout = new MetauiTemplate($scope.formLayout);
			layout.$save(function(newLayout){
				if(newLayout){
					$scope.formLayout.id=newLayout.id;
					$scope.formLayout.version=newLayout.version;
					$scope.formLayout.status=newLayout.status;
					Global.formId=newLayout.id;
					if($.isFunction(callback)){
						callback(newLayout);
					}
				}
			});
		}
		$scope.copyBtnClick=function(){
			var newFormTemplate=sourceManager.getToSavedTemplate();
			var $element=$("#full-source-code-textarea");
			$("#fullSourceModal").off('shown');
			$("#fullSourceModal").on('shown', function () {
				$element.text(newFormTemplate);
			});
		};
		$scope.saveBtnClick=function(){
			saveLayout(function(newLayout){
				window.pd.close(newLayout);
			});
		};
		$scope.previewBtnClick=function(){
			//var confirmPreview=confirm("预览将保存草稿，确定预览吗？");
			//if(confirmPreview){
			saveLayout(function(newLayout){
				var previewId=newLayout.id;
				var url=Global.contextPath+"/entities/"+Global.entityName+"/preview?_inframe=1&id="+previewId;
				$("#previewFormModalIframe").attr("src",url);
				$("#previewFormModal").modal();
			});
			//}
		};
	}]);
	return navbarController;
});
