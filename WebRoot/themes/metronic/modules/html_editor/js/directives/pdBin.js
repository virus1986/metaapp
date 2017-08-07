/**
 * 标题控件
 */
define(['angular',"directives/directives","common/classLoader","common/utils",
        "services/binManager","services/editorManager"], function(angular,directiveModule,classLoader,utils) {
	var directiveName="pdBin";
	var directive=directiveModule.directive(directiveName, ["sidebarItems",function factory(sidebarItems) {
		var directiveDef={};		
		var params={
			priority: 0,
		    replace: true,
		    transclude: false,
		    restrict: 'A',
		    scope:true
		};
		var moduleInitDataMap={},currentModuleMap={};
		directiveDef=$.extend(true,{},params);	
		directiveDef.template=function(tElement, tAttrs){
			var moduleName=tAttrs[directiveName];	
			if(utils.isBlank(moduleName)){
				moduleName="pdHtml";
			}
			var currentModule=classLoader.getModule(moduleName);
			if(utils.isBlank(currentModule)){
				return;
    		}
			
			var binId="_"+utils.newGuid();
	    	var wrapper=$("<div class='_i-wrapper' bin-id="+binId+">" +
			    		"</div>");
	    	tElement.removeAttr("pd-bin");
	    	tElement.attr(_.str.dasherize(moduleName),"");
	    	var moduleInitData=currentModule.getInitData(tElement,tAttrs);
	    	moduleInitDataMap[binId]=moduleInitData;
	    	currentModuleMap[binId]=currentModule;
	    	wrapper.append(tElement.clone());
	    	return wrapper[0].outerHTML;
		};
		directiveDef.compile=function compile(tElement, tAttrs) {
			
	    	return {
	    		pre:function(scope, iElement, iAttrs,controller){
	    			scope.data=moduleInitDataMap[iAttrs.binId];
	    			scope.module=currentModuleMap[iAttrs.binId];
	    		},
	    		post:function(scope, iElement, iAttrs,controller){
	    			$(iElement).hover(
	    				function(){
	    					if(scope.selected) return;
	    					scope.$apply(function(){
	    						scope.selected=true;
	    					});
	    				},
	    				function(){
	    					if(scope.actived) return;
	    					scope.$apply(function(){
	    						scope.selected=false;
	    					});
	    			});
	    			
	    			/*$(iElement).on("click.pdBin",function(event){
	    				event.stopPropagation();
	    				if(scope.actived) return;
	    				scope.$apply(function(){
	    					controller.active();
	    				});
	    			});*/
	    			//setup relation between bin and sidebaritem
	    			if($.isFunction(scope.module.getItemName)){
	    				var itemName=scope.module.getItemName(iElement);
	    				var item=sidebarItems.getItemInFlat(itemName);
	    				scope.item=item;
	    				scope.$watch("item.$el",function(newV,oldV){
	    					if(item&&item.unique&&item.$el){
	    						item.$el.trigger("disableDrag");
	    					}
	    				});
	    			}
	    		}
	    	};
	    };
	    
	    directiveDef.controller=["$scope", "$element", "$attrs","binManager","editorManager",function($scope, $element, $attrs, binManager,editorManager) {
	    	function active (){
	    		var preBin=binManager.getActivedBin();
	    		if(!utils.isBlank(preBin) && preBin.id==$scope.id){
	    			return;
	    		}	    		
	    		binManager.activeBin($scope);
	    		$scope.$emit("actived.angular",$scope);
	    	};
	    	$scope.init=function(){
	    		var bin=binManager.createBin($element,$attrs.binId);
		    	$.extend($scope,bin);
		    	binManager.addBin($scope);
	    	};
	    	
	    	$scope.init();
	    	
	    	return ({
	    		active:active
	    	});
	    }];
	    	    
		return directiveDef;
	}]);
	return directive;
});