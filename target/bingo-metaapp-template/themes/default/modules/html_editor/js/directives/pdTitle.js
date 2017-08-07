/**
 * 标题控件
 */
define(['angular',"directives/directives","directives/pdBinBase","common/utils"], function(angular,directiveModule,BinBase,utils) {
	var directiveName="pdTitle";
	//标签基本参数定义
	var PdTitle=BinBase.extend({
		editorName:"pdTitleEditor",
		getSidebarItems:function(){
			return {
				parentName:"controls",
				name:this.name,
				moduleName:this.name,
				paletteItemHtml:"<div>标题控件</div>"+
								'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-bin='pdTitle'>Title</div>",//required attribute for dynamic compile
				sourceCompileHtml:"<div>{{:data.innerHtml}}</div>"//optional,if this exists,when edit source use it to compile
			};
		},
		directiveDef:{
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("title/template.html"),
			name:this.name,
			link:function postLink(scope, iElement, iAttrs) {
				iElement.on('blur', function() {
	                scope.$apply(function(){
	                	scope.data.innerHtml=iElement.html();
	                });
	            });
			},
			controller:function($scope, $element, $attrs, $transclude) {
				$scope.data=$scope.data||{};
				$scope.data['class']="";
			}
		}
	});
	
	var pdTitle=new PdTitle(directiveName);
	
	var directive=directiveModule.directive(pdTitle.name, function factory($http) {
		return pdTitle.directiveDef;
	});
	
	return pdTitle;
});