/*global define*/
'use strict';
/**
 * 
 */

define(['angular',"directives/directives","services/appPd","common/classLoader","common/utils","services/relationService"], function(angular,directiveModule,appConfig,classLoader,utils,relationService) {
	//attributes that directive not needed,but business requirement.
	var directiveName="pdMetaRelation";
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
					compileHtml:"<div pd-bin='pdMetaRelation'></div>",//required attribute for dynamic compile
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
	directiveModule.directive(directiveName, ["$http","binManager",function($http,binManager) {
		var directiveDef={
			priority: 0,
			replace: true,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("metarelation/template.html"),
			name:directiveName
		};
		directiveDef.link=function(scope, iElement, iAttrs){
		};
		directiveDef.controller=function($scope, $element, $attrs, $transclude) {
			$scope.data=$scope.data||{};
			$scope.data.excludeRelationNames=$scope.data.excludeRelationNames||"";
			$scope.data.relationLinks=relationService.relationLinks;
			if($attrs.hasOwnProperty("model")){
				$scope.data.inTab=true;
			}else{
				$scope.data.inTab=false;
			}
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
		};
		extendAttrs.directiveDef=directiveDef;
		return directiveDef;
	}]);
	classLoader.register(directiveName,extendAttrs);
	return extendAttrs;
});