/**
 * 说明控件，可用来作为表单section的说明
 */
define(['angular',"directives/directives","common/utils","common/classLoader","services/appPd","directives/pdBinBase"], function(angular,directiveModule,utils,classLoader,appConfig,BinBase) {
	var directiveName="pdSpecs";
	var hrBtnText={show:"显示下划线",hide:"隐藏下划线"};
	var h4BtnText={show:"显示标题",hide:"隐藏标题"};
	var classHeader=".spec-header",classDesc=".spec-description";
	//标签基本参数定义
	var PdSpecs=BinBase.extend({
		name:directiveName,
		editorName:"pdSpecsEditor",
		getItemName:function(iElement){//iElement: bin postlink element
			return directiveName;
		},
		getSidebarItems:function(){
			return {
				parentName:"controls",
				name:directiveName,
				moduleName:directiveName,
				paletteItemHtml:"<div>提醒或较长说明</div>"+
								'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-bin='pdSpecs'><h4 contentEditable='true' class='spec-header' style='display:none;'>请填写标题</h4><hr style='display:none;'/><div class='spec-description' contentEditable='true'>请填写详细说明文字<div></div>",//required attribute for dynamic compile
				sourceCompileHtml:"<div class='alert {{:data.labelClass}}'>{{:data.innerHtml}}</div>",//optional,if this exists,when edit source use it to compile
			};
		},
		directiveDef:{
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("controls/specs.html"),
			name:directiveName,
			link:function postLink(scope, iElement, iAttrs) {
				$(iElement).find(classHeader).on('blur', function() {
	                scope.$apply(function(){
	                	scope.data.head=$(iElement).find(classHeader).html();
	                	scope.data.innerHtml=iElement.html();
	                });
	            });
				$(iElement).find(classDesc).on('blur', function() {
					scope.$apply(function(){
						scope.data.body=$(iElement).find(classDesc).html();
						scope.data.innerHtml=iElement.html();
					});
				});
				scope.$on("toggleHr",function(){
					scope.data.hrHide=!scope.data.hrHide;
		    		if(scope.data.hrHide){
		    			scope.data.hrBtnText=hrBtnText.show;
		    			scope.data.hrStyle={display:'none'};
		    		}else{
		    			scope.data.hrBtnText=hrBtnText.hide;
		    			scope.data.hrStyle={display:'block'};
		    		}
		    		setTimeout(function(){
		    			scope.data.innerHtml=iElement.html();
		    		},20);
				});
				scope.$on("toggleH4",function(){
					scope.data.h4Hide=!scope.data.h4Hide;
		    		if(scope.data.h4Hide){
		    			scope.data.h4BtnText=h4BtnText.show;
		    			scope.data.h4Style={display:'none'};
		    		}else{
		    			scope.data.h4BtnText=h4BtnText.hide;
		    			scope.data.h4Style={display:'block'};
		    		}
		    		setTimeout(function(){
		    			scope.data.innerHtml=iElement.html();
		    		},20);
				});
				/*iElement.on('blur', function() {
	                scope.$apply(function(){
	                	scope.data.innerHtml=iElement.html();
	                });
	            });*/
				iElement.removeAttr("pd-specs");
			},
			controller:function($scope, $element, $attrs, $transclude) {
				$scope.data=$scope.data||{};
				var initClass=$scope.data.class;
				if(_.str.startsWith(initClass,"alert ")){
					initClass=_.str.strRight(initClass," ");
				}
				$scope.data.labelClass=initClass||$scope.data.labelClass||"alert-gray";
				$scope.data.editable=true;
				var innerHtml=$scope.data.innerHtml;
				var $wrapper=$("<div>"+innerHtml+"</div>")
				$scope.data.head=$wrapper.find(classHeader).html();
				$scope.data.body=$wrapper.find(classDesc).html();
				var hrDom=$wrapper.find("hr:eq(0)");
				var h4Dom=$wrapper.find(classHeader);
				if(hrDom.length==0){
					$scope.data.hrHide=true;
				}else{
					$scope.data.hrHide=hrDom.css("display")=="none"?true:false;
				}
				if(h4Dom.length==0){
					$scope.data.h4Hide=true;
				}else{
					$scope.data.h4Hide=h4Dom.css("display")=="none"?true:false;
				}
				if($scope.data.hrHide){
	    			$scope.data.hrBtnText=hrBtnText.show;
	    			$scope.data.hrStyle={display:'none'};
	    		}else{
	    			$scope.data.hrBtnText=hrBtnText.hide;
	    			$scope.data.hrStyle={display:'block'};
	    		}
				if($scope.data.h4Hide){
					$scope.data.h4BtnText=h4BtnText.show;
					$scope.data.h4Style={display:'none'};
				}else{
					$scope.data.h4BtnText=h4BtnText.hide;
					$scope.data.h4Style={display:'block'};
				}
			}
		}
	});
	var pdSpecs=new PdSpecs(directiveName);
	var directive=directiveModule.directive(pdSpecs.name, function factory() {
		return pdSpecs.directiveDef;
	});
	classLoader.register(directiveName,pdSpecs);
	return pdSpecs;
});