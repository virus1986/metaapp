/**
 * 标题控件
 */
define(['angular',"directives/directives","common/classLoader","common/utils"], function(angular,directiveModule,classLoader,utils) {
	var directiveName="pdHtml";
	
	//标签基本参数定义
	var directiveDef={
		priority: 0,
		replace: true,
		transclude: false,
		restrict: 'A',
		dragHelper:"clone"
	};

	var directive=directiveModule.directive(directiveName, function factory() {
		directiveDef.link=function postLink(scope, iElement, iAttrs) {
		   	
		};	
		return directiveDef;
	});
	
	classLoader.register(directiveName,directiveDef);
	return directive;
});