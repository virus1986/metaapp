/**
 * Directive that defines a main container for page design
 */

define(['angular',"directives/directives","common/utils","common/classLoader","common/domUtils","services/appPd"], function(angular,directiveModule,utils,classLoader,domUtils,appConfig) {
	'use strict';
	var directive=directiveModule.directive('pdContainer', function factory($compile) {
	  var directiveDefinition = {
	    priority: 0,
	    transclude: false,
	    restrict: 'A',
	    link: function postLink($scope, iElement, iAttrs) {
	    	var $el=$(iElement);
	    	$el.addClass(appConfig.containerAddClass);    	
	    	
	    	$el.on("click",function(event){
	    		var curEl=$(event.target);
	    		var elType="html";
	    		var focusEl=null;
	    		if(domUtils.isNotNeedFocus(curEl)){
	    			focusEl=null;
	    		}else{
	    			focusEl=domUtils.focusFinder.find(event,curEl);
		    		if(domUtils.isBinWrapper(focusEl)){
		    			elType="bin";
		    		}
	    		}
	    		$scope.$apply(function(){
	    			$scope.$emit("focusChanged.angular",{el:focusEl,type:elType});
	    		});
	    	});
	    }
	  };
	  return directiveDefinition;
	});
	return directive;
});