/*global define*/
'use strict';
/**
 * Directive that support entity auto fields.
 */

define(['angular',"directives/directives","services/appPd","common/classLoader","common/utils"], function(angular,directiveModule,appConfig,classLoader,utils) {
	//attributes that directive not needed,but business requirement.
	var directiveName="pdMetaFields";
	var extendAttrs=$.extend({},appConfig.bin.binModuleItemUniqueOptions,{
		name:directiveName,
		getSidebarItems:function(){
			return {
				parentName:"fields",
				name:directiveName,
				unique:true,
				moduleName:directiveName,
				paletteItemHtml:"<div>自动字段</div>"+
								'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-bin='pdMetaFields'></div>",//required attribute for dynamic compile
				sourceCompileHtml:"<meta:fields colNum='{{:data.colNum}}' title='{{:data.title}}'></meta:fields>"//optional,if this exists,when edit source use it to compile
			};
		},
		getItemName:function(iElement){//iElement: bin postlink element
			return directiveName;
		},
		directiveDef:null
	});
	directiveModule.directive(directiveName, ["$http","binManager",function($http,binManager) {
		var directiveDef={
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("metafields/template.html"),
			name:directiveName
		};
		directiveDef.link=function postLink(scope, iElement, iAttrs) {
		};
		directiveDef.controller=function($scope, $element, $attrs, $transclude) {
			$scope.data=$scope.data||{};
			$scope.data.colNum=2;
			$scope.data.title="扩展属性";
		};
		extendAttrs.directiveDef=directiveDef;
		return directiveDef;
	}]);
	classLoader.register(directiveName,extendAttrs);
	return extendAttrs;
});