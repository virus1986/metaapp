/*global define*/
'use strict';
/**
 * define metaRelation bin not relative with pdbin,In link function:
 * step1: register bin in binManager
	    Call[ binManager.registerBin(directiveName,$scope); ]
 * step2: wrap bin with some wrapper and do some common postprocess
		Call[ binManager.wrapBinWithCommonLink($scope, $element) ];
 */

define(['angular',"directives/directives","services/appPd","common/classLoader","common/utils","services/relationService"], function(angular,directiveModule,appConfig,classLoader,utils,relationService) {
	//attributes that directive not needed,but business requirement.
	var directiveName="metaRelation";
	var extendAttrs=$.extend({},appConfig.bin.binModuleItemUniqueOptions,{
			name:directiveName,
			editorName:"metaRelationEditor",
			getSidebarItems:function(){
				return {
					parentName:"relations",
					name:directiveName,
					unique:true,
					moduleName:directiveName,
					paletteItemHtml:"<div>自动关系</div>"+
									'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
					compileHtml:"<meta:relation></meta:relation>",//required attribute for dynamic compile
					sourceCompileHtml:"<meta:relation {{if data.model}}model='{{:data.model}}' {{else}}view-container='{{:data.viewContainer}}' {{/if}}exclude-relation-names='{{:data.excludeRelationNames}}'>{{:data.innerHtml}}</meta:relation>"//optional,if this exists,when edit source use it to compile
				};
			},
			getItemName:function(iElement){//iElement: bin postlink element
				return directiveName;
			},
			getInitData:function(tElement, tAttrs){
				var data=appConfig.bin.binModuleItemUniqueOptions.getInitData(tElement, tAttrs);
				data.innerHtml=tElement.html();
				return data;
			},
			directiveDef:null
	});
	directiveModule.directive(directiveName, ["$http","binManager","sidebarItems",function($http,binManager,sidebarItems) {
		var directiveDef={
			priority: 0,
			replace: true,
			restrict: 'E',
			templateUrl:utils.resolveTemplateUrl("metarelation/template.html"),
			name:directiveName,
			scope:true
		};
		directiveDef.link=function($scope, $element, attrs){
			//register bin in binManager
	    	binManager.registerBin(directiveName,$scope,$element);
			//wrap bin with some wrapper do some common postprocess
			binManager.wrapBinWithCommonLink($scope, $element);
		};
		 directiveDef.controller=["$scope", "$element", "$attrs","binManager","editorManager",function($scope, $element, $attrs, binManager,editorManager) {
			 	$scope.data={};
				$scope.data.excludeRelationNames=$scope.data.excludeRelationNames||"";
				$scope.data.relationLinks=relationService.relationLinks;
				if($attrs.hasOwnProperty("model")){
					$scope.data.inTab=true;
				}else{
					$scope.data.inTab=false;
					$scope.data.viewContainer=".form-right";
				}
				//define scope method for disabled relation element's template class value
				$scope.disabled=function(name){
					var excludeNames=_.str.words($scope.data.excludeRelationNames,",");
					var disabled=false;
					$.each(excludeNames,function(i,v){
						var value=_.str.trim(v);
						if(value==name){
							disabled=true;
							return false;
						}
					});
					return disabled;
				};
				$scope.$watch("data.excludeRelationNames",function(newV,oldV){
					var excludeNames=_.str.words(newV,","),disabledClass="i-disabled";
					$element.find("li").removeClass(disabledClass);
					$.each(excludeNames,function(i,v){
						var value=_.str.trim(v);
						$element.find("li[name="+value+"]").addClass(disabledClass);
					});
				});
		    }];
		extendAttrs.directiveDef=directiveDef;
		return directiveDef;
	}]);
	classLoader.register(directiveName,extendAttrs);
	return extendAttrs;
});