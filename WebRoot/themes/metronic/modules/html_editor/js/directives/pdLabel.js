/**
 * Label
 */
define(['angular',"directives/directives","common/utils","common/classLoader","services/appPd"], function(angular,directiveModule,utils,classLoader,appConfig) {
	var directiveName="pdLabel";
	//标签基本参数定义
	var pdLabel=$.extend({},appConfig.bin.binModuleBaseOptions,{
		name:directiveName,
		getSidebarItems:function(){
			return {
				parentName:"controls",
				name:directiveName,
				moduleName:directiveName,
				paletteItemHtml:"<div>Label</div>"+
								'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-label=''>Label</div>",//required attribute for dynamic compile
				sourceCompileHtml:"<div>{{:data.innerHtml}}</div>"//optional,if this exists,when edit source use it to compile
			};
		},
		directiveDef:{
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("controls/label.html"),
			name:directiveName,
			link:function postLink(scope, iElement, iAttrs) {
				iElement.on('blur', function() {
	                scope.$apply(function(){
	                	scope.data.innerHtml=iElement.html();
	                });
	            });
				iElement.removeAttr("pd-label");
			},
			controller:function($scope, $element, $attrs, $transclude) {
				$scope.data={};
				$scope.data.editable=true;
				$scope.data.innerHtml="输入label名称";
			}
		}
	});
	
	var directive=directiveModule.directive(directiveName, function factory() {
		return pdLabel.directiveDef;
	});
	classLoader.register(directiveName,pdLabel);
	return pdLabel;
});