/**
 * Directive that defines a table container that can drag and sort items in it
 */

define(['angular',"directives/directives","common/utils","common/classLoader","services/sidebarItems","services/appPd"], function(angular,directiveModule,utils,classLoader,sidebarItems,appConfig) {
	'use strict';
	var directiveName="pdTable";
	var extendAttrs={
			name:directiveName,
			//dragHelper:"clone",
			//dragConnectToSortable:".main-content ."+appConfig.containerAddClass,
			directiveDef:null,
			getSidebarItems:function(){
				return {
					parentName:"layouts",
					name:directiveName,
					moduleName:directiveName,
					paletteItemHtml:'表格:'+
									'<input value="4" type="text" class="i-table-row sidebar-input" title="行" style="width:15px" />'+
									'*<input value="4" type="text" class="i-table-col sidebar-input" title="列" style="width:15px" />'+
									'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
					compileHtml:"<table pd-table='' class='table form-table'></table>"//required attribute for dynamic compile
				};
			},
			getItemName:function(iElement){//iElement: bin postlink element
				return directiveName;
			},
			getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
				$scope.tableLayoutInfo={
						row:$ui.find(".i-table-row").val()||'4',
						col:$ui.find(".i-table-col").val()||'4'
				};
				return $compile(sidebarItem.compileHtml)($scope);
			},
			paletteItemPostProcess:function($el){
				$el.on("keyup","input", function(e) {
	    			var v=$(this).val();
	    			if ($.isNumeric(v)) {
	    				$el.draggable("enable");
	    			} else {
	    				$el.draggable("disable");
	    			}
	    		});
			}
	};
	var directive=directiveModule.directive(directiveName, function factory($compile,appConfig,templates) {
		var directiveDefinition = {
		name:directiveName,
	    priority: 0,
	    replace: false,
	    transclude: false,
	    restrict: 'A',
	    link: function postLink(scope, iElement, iAttrs) {
	    	var $el=$(iElement);
	    	
	    	var tableLayoutInfo=scope.tableLayoutInfo;//
	    	var layoutTemplate=null;
	    	if(tableLayoutInfo&&tableLayoutInfo!=''){	    		
	    		layoutTemplate=templates.table(tableLayoutInfo);
	    		$el.append(layoutTemplate);
	    	}
	    	
	    }
	  };
	  extendAttrs.directiveDef=directiveDefinition;
	  return directiveDefinition;
	});
	classLoader.register(directiveName,extendAttrs);
	//return all the attributes 
	return extendAttrs;
});