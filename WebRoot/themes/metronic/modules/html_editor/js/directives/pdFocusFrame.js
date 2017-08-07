/**
 * pd-bin顶部的工具栏，包括对该Bin的编辑、拖动、删除等操作
 */

define(['angular',"directives/directives","common/utils","common/domUtils","services/appPd","services/binManager"], function(angular,directiveModule,utils,domUtils,appConfig) {
	'use strict';
	var directive=directiveModule.directive('pdFocusFrame', function factory() {

	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("focus-frame.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',	 
	    link: function postLink($scope, iElement, iAttrs) {
	    	domUtils.draggable(iElement,{
	    		start:function(event,ui,placeHolder){
	    			$scope.$apply(function(){
	    				$scope.style.display="none";
	    			});
	    		},	 
	    		refuse:function(event,ui,curDropEl,direction){
	    			var refuseFun=$($scope.focus.el).data("refuse"),refuse=false;
	    			if($.isFunction(refuseFun)){
	    				refuse=refuseFun(event,ui,curDropEl,direction);
	    			}
	    			if(!refuse){
	    				return appConfig.draggableOptions.refuse(event,ui,curDropEl,direction);
	    			}else{
	    				return true;
	    			}
	    		},
		      	stop: function(event,ui,placeholder) {
		      		if(!placeholder.visible){
			      		$scope.$apply(function(){
		    				$scope.style.display="block";
		    			});
			      		return;
		      		}
		      		var newAddItemDom=$scope.focus.el;
		      		if(domUtils.defaultRefuse(event,ui,placeholder,newAddItemDom)){
						return;
					}
		      		placeholder.pl.after(newAddItemDom);
		      		window.setTimeout(function(){
		      			$scope.$apply(function(){
		      				$scope.refresh();
		    			});
		      		},50);
		      	}
	    	});
	    	
	    	$scope.$watch(iAttrs.pdFocusFrame,function pdFocusFrameWatchAction(value,oldValue){
	    		window.pd.setFocus({
	    			frameScope:$scope,
    	            frame:iElement,
    	            current:$scope.focus,
    	            pre:oldValue
	    		});	    		
	    		$scope.render();
	    	});
	    },
	    controller:["$scope", "$element", "$attrs","binManager",function($scope, $element, $attrs, binManager) {
	    	$scope.init=function(){
	    		$scope.style={position: "absolute",display: "none",left: 0,top: 0,opacity: 1};
	    		$scope.frameLeftStyle={height:0,left:-6,top:-6,cursor:"auto"};
	    		$scope.frameRightStyle={height:0,left:-6,top:-6,cursor:"auto"};
	    		$scope.frameTopStyle={width:0,left:-6,top:-6,cursor:"auto"};
	    		$scope.frameBottomStyle={left:-6,top:-6,width:0,cursor:"auto"};
	    		$scope.titlebarStyle={left:0};
	    		$scope.titlebar={canSetting:false,canDelete:true,canDrag:true};
	    		$scope.canResize=false;
	    		$scope.type="html";
	    	};
	    	
	    	$scope.setting=function(){
	    		var bin=binManager.findBin($scope.id);
	    	};
	    	
	    	$scope.render=function(){
	    		$scope.init();
	    		var focus=$scope.focus;	    				
	    		if(utils.isBlank(focus) || utils.isBlank(focus.el)){
	    			return;
	    		}
	    		var $el=$(focus.el); 
	    		$scope.titlebarStyle.display="block";
	    		$scope.frameLeftStyle.height=$scope.frameRightStyle.height=$el.outerHeight()+8;
	    		$scope.frameRightStyle.left=$scope.frameLeftStyle.left+$el.outerWidth()+6;	 
	    		$scope.frameTopStyle.width=$scope.frameBottomStyle.width=$el.outerWidth()+8;
	    		$scope.frameBottomStyle.top=$scope.frameTopStyle.top+$el.outerHeight()+8;
	    		$scope.titlebarStyle.left=$scope.frameTopStyle.width/2-15;
	    		$scope.style.left=$el.offset().left;
	    		$scope.style.top=$el.offset().top;
	    		$scope.style.display="block";
	    		$scope.titlebar.canDrag=domUtils.canDraggable($el);
	    		$scope.titlebar.canDelete=domUtils.canDelete($el);
	    		//modify width to make the active toolbars above the frameTop
	    		var leftRightDistance=$scope.frameRightStyle.left-$scope.frameLeftStyle.left;
	    		var buttonsWidthSum=0;
	    		$(".i-titlebar>.i-titlebar-wrap>a.i-titlebar-button").each(function(i,toolBtn){
	    			buttonsWidthSum+=$(toolBtn).width();
	    		});
	    		if(leftRightDistance<buttonsWidthSum){
	    			var addDistance=buttonsWidthSum-leftRightDistance;
	    			$scope.frameRightStyle.left+=addDistance;
	    			$scope.frameTopStyle.width+=addDistance;
	    			$scope.frameBottomStyle.width+=addDistance;
	    			$scope.titlebarStyle.left+=addDistance/2;
	    		}
	    	};
	    	
	    	$scope.refresh=function(){	 
	    		$scope.render();	    		
	    	};
	    	
	    	$scope.del=function(){
	    		if($scope.focus==null) return;
	    		if($scope.focus.type=="bin"){	
		    		//var bin=binManager.findBin($($scope.focus.el).scope().id);
		    		var binId=$($scope.focus.el).attr("bin-id");
		    		var bin=binManager.findBin(binId);
		    		binManager.notifyBinBeforeDelete(bin);
		    		binManager.dropBin(bin);
		    		if(bin.wrapperElement){
		    			bin.wrapperElement.remove();
		    		}
		    		bin.element.remove();
		    		bin.$destroy();
	    		}else{
	    			var layoutId=$scope.focus.el.attr("layout-id");
	    			if(layoutId&&layoutId!=""){
	    				binManager.notifyBinBeforeDelete(binManager.findBin(layoutId));
	    			}
	    			var containedLayouts=$scope.focus.el.find("[layout-id]");////layout or html may contain layouts
	    			var containedBins=$scope.focus.el.find("[bin-id]");//layout or html may contain bins
	    			containedLayouts.each(function(i,ele){
	    				var bin=binManager.findBin($(ele).attr("layout-id"));
	    				binManager.notifyBinBeforeDelete(bin);
	    			});
	    			containedBins.each(function(i,ele){
	    				var bin=binManager.findBin($(ele).attr("bin-id"));
	    				binManager.notifyBinBeforeDelete(bin);
	    			});
	    			if($scope.focus.el[0].nodeName==="FORM"){//if form remove parent container,because only one form allowed now
	    				$scope.focus.el.parent().remove();
	    			}else{
	    				$($scope.focus.el).remove();
	    			}
	    		}
	    		$scope.$emit("domDeleted.angular");
	    	};
	    	
	    	$scope.init();
	    }]
	  };
	  return directiveDefinition;
	});
	return directive;
});