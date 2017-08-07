/**
 * Directive that defines a form-toolbar that can edit
 */

define(['angular',"directives/directives","common/utils","common/classLoader","services/sidebarItems",
        "services/appPd","services/layoutService","services/templates","services/binManager"], function(angular,directiveModule,utils,classLoader,sidebarItems,appConfig,layoutService,templates) {
	'use strict';
	var directiveName="uiFormToolbar";
	var extendAttrs={
			name:directiveName,
			directiveDef:null,
			getSidebarItems:function(){
				return {
					parentName:null,
					name:directiveName,
					moduleName:directiveName,
					paletteItemHtml:'ui-form-toolbar'+
					'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
					compileHtml:"<div ui-form-toolbar></div>",//required attribute for dynamic compile
					sourcePreprocess:function(element){
						//$(element).find(".tab-pane-placeholder").remove();
					},
					editorName:"uiFormToolbarEditor",
				};
			},
			getItemName:function(iElement){//iElement: bin postlink element
				return directiveName;
			},
			getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
				return $compile(sidebarItem.compileHtml)($scope);
			},
			paletteItemPostProcess:function($el){
				
			}
	};
	var directive=directiveModule.directive(directiveName,["$compile","appConfig","templates","binManager", function factory($compile,appConfig,templates,binManager) {
		var directiveDefinition = {
		name:directiveName,
	    priority: 0,
	    scope:true,
	    restrict: 'A',
	    compile:function compile(tElement, tAttrs) {
	    	return {
	    		pre:function(scope, iElement, iAttrs,controller){
	    			layoutService.registerLayoutBin(directiveName,scope, iElement);
	    		},
	    		post:function(scope, iElement, iAttrs,controller){}
	    	};
	    }
	  };
	  extendAttrs.directiveDef=directiveDefinition;
	  return directiveDefinition;
	}]);
	classLoader.register(directiveName,extendAttrs);
	//return all the attributes 
	return extendAttrs;
});