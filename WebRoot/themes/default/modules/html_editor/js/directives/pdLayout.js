/**
 * Directive that defines a layout container that can drag and sort items in it
 */

define(['angular',"directives/directives","common/utils","common/classLoader","services/sidebarItems",
        "services/appPd","services/layoutService","services/binManager"], function(angular,directiveModule,utils,classLoader,sidebarItems,appConfig,layoutService) {
	'use strict';
	var directiveName="pdLayout";
	var extendAttrs={
			name:directiveName,
			directiveDef:null,
			getSidebarItems:function(){
				return layoutService.getPdLayoutSidebarItems();
			},
			getItemName:function(iElement){//iElement: bin postlink element
				var name= iElement.attr(_.str.dasherize(directiveName));
				if(name&&name!=""){
					return name;
				}else{
					return directiveName;
				}
			},
			getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
				if(directiveName==sidebarItem.name){
					$scope.layoutInfo=$ui.find(".i-layout-info").val();
				}
				return $compile(sidebarItem.compileHtml)($scope);
			},
			paletteItemPostProcess:function($el){
				/*$el.on("enableDrag",function(e){
					$el.draggable("enable");
				});
				$el.on("disableDrag",function(e){
					$el.draggable("disable");
				});*/
				$el.on("keyup",".i-layout-info", function(e) {
	    			var n = $(this).val().split(" ", 12);
	    			var e = 0;
	    			var disable=false;
	    			$.each(n, function(n, r) {
	    				if(r==""){
	    					r=0;
	    				}
	    				if(!$.isNumeric(r)){
	    					disable=true;
	    					return false;
	    				}
	    				e = e + parseInt(r);
	    			});
	    			if (e != 12 || disable) {
	    				$el.draggable("disable");
	    			} else {
	    				$el.draggable("enable");
	    			}
	    		});
			}
	};
	var directive=directiveModule.directive(directiveName,["$compile","appConfig","templates","binManager", function factory($compile,appConfig,templates,binManager) {
		var directiveDefinition = {
		name:directiveName,
	    priority: 0,
	    replace: true,
	    scope:true,
	    transclude: false,
	    restrict: 'A',
	    template:function(iElement, iAttrs){
	    	var $el=$(iElement);
	    	
	    	var layoutName=iAttrs[directiveName];
	    	var isElementEmpty=iElement.children().length>0?false:true;
	    	if(isElementEmpty){//empty: insert template
	    		var layoutTemplate=null,templatePath=null;
	    		if(layoutName&&layoutName!=""){
	    			var item=sidebarItems.getItemInFlat(layoutName);
	    			if(item.templatePath){
	    				templatePath=item.templatePath;
	    				layoutTemplate=templates.tmpl(templatePath);
	    				return layoutTemplate;
	    			}
	    		}
	    	}
	    	for(var key in iAttrs){
	    		if(iAttrs.hasOwnProperty(key)){
	    			$el.removeAttr(iAttrs.$attr[key]);
	    		}
	    	}
	    	return $el[0].outerHTML;
	    },
	    compile:function compile(tElement, tAttrs) {
	    	return {
	    		pre:function(scope, iElement, iAttrs,controller){
	    			layoutService.registerLayoutBin(directiveName,scope, iElement);
	    		},
	    		post:function(scope, iElement, iAttrs,controller){
	    			var layoutInfo=null,layoutTemplate=null;
	    			var $el=$(iElement);
	    			if(scope.layoutInfo){
		    			$el.addClass(appConfig.layoutAddClass);
		    			layoutInfo=scope.layoutInfo;//space separated number, sum is 12
		    			layoutTemplate=templates.layout(layoutInfo);
		    			$el.append(layoutTemplate);
		    		}
	    			if($.isFunction(scope.item.postLinkCallback)){
	    				scope.item.postLinkCallback(scope, iElement, iAttrs,controller);
	    			};
	    	    	//setup relation between layout and sidebaritem
	    			/*if($.isFunction(scope.module.getItemName)){
	    				var itemName=scope.module.getItemName(iElement);
	    				var item=sidebarItems.getItemInFlat(itemName);
	    				scope.item=item;
	    				if(item.unique){
	    					item.$el.trigger("disableDrag");
	    				}
	    			}*/
	    		}
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