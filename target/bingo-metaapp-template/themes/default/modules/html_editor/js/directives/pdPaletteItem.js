/**
 * 工具栏条目
 */

define(['angular',"directives/directives","common/classLoader","common/utils","common/domUtils","services/appPd"], function(angular,directiveModule,classLoader,utils,domUtils,appConfig) {
	'use strict';
	var directiveName="pdPaletteItem";
	var directive=directiveModule.directive(directiveName,["sidebarItems","$compile",function factory(sidebarItems,$compile) {
	  var directiveDefinition = {
	    priority: 0,
	    replace: false,
	    transclude: false,
	    restrict: 'A',
	    link: function postLink(scope, iElement, iAttrs) {
	    	var $el=$(iElement);
	    	$el.addClass(appConfig.paletteItemAddClass);
	    	var itemName=iAttrs[directiveName];
	    	var item=sidebarItems.getItemInFlat(itemName);
	    	var module=classLoader.getModule(item['moduleName']);
	    	if(utils.isBlank(module)){
	    		return;
	    	}
	    	
	    	domUtils.draggable($el,{
	    		start:function(event,ui,placeHolder){
	    			
	    		},
	    		refuse:function(event,ui,curDropEl,direction){
	    			return appConfig.draggableOptions.refuse(event,ui,curDropEl,direction);
	    		},
		      	stop: function(event,ui,placeholder) {
		      		if(!placeholder.visible){
			      		return ;
		      		}
		      		//将元素插入到placeholder.pl后面
		      		var $el=$(ui.item);
					var itemName=$el.attr("pd-palette-item");
	    			var item=null;
	    			if(itemName) {
	    				item=sidebarItems.getItemInFlat(itemName);
	    				if(!item){
	    					return;
	    				}
	    				var itemModule=classLoader.getModule(item.moduleName);
	    				scope.$apply(function(){
	    					var childScope=scope.$new();
	    					var newAddItemDom=$(itemModule.getCompiledHtml($compile,childScope,$el,item));
	    					placeholder.pl.after(newAddItemDom);
	    					if($.isFunction(item.dropPostProcess)){
	    						item.dropPostProcess(newAddItemDom,item);
	    					}
	    				});
	    			}
		      	}
	    	});	    	
	    	
	    	if(module.paletteItemPostProcess&&$.isFunction(module.paletteItemPostProcess)){
	    		module.paletteItemPostProcess($el);
	    	}
	    	item.$el=$el;
	    }
	  };
	  return directiveDefinition;
	}]);
	return directive;
});