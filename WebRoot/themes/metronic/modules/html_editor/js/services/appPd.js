define(['services/services',"common/eventBase","common/utils"], function(serviceModule,EventBase,utils) {
	var PD=EventBase.extend({
		paletteItemAddClass:"i-palette-item",
		containerAddClass:"i-container",
		layoutAddClass:"row-fluid",
		columnAddClass:"i-column",	
		$scope:null,
		focus:null,
		init:function(){
			this._super();
			this.$scope=null;
			this.bin={};
			this.bin.binModuleBaseOptions={
					canDrag:true,
					canDelete:true,
					canSetting:true,
					//dragHelper:"clone",
					//dragConnectToSortable:appConfig.bin.dragConnectToSortable,
					getInitData:function(tElement, tAttrs){
						var $attr={};
						for(var key in tAttrs){
							if(tAttrs.hasOwnProperty(key)){
								if(key=="pdBin"||key=="binId"||_.str.startsWith(key,"ng")||_.str.startsWith(key,"$")){
									continue;
								}else{
									$attr[key]=tAttrs[key];
								}
							}
						}
						var data= $.extend($attr,{
									editable:false
								});
						return data;
					},
					actived:function($scope){
						$scope.data.editable=true;
					},
					disActived:function($scope){
						$scope.data.editable=false;
					},
					getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
						return $compile(sidebarItem.compileHtml)($scope);
					}
			};
			this.bin.binModuleItemUniqueOptions=$.extend({},this.bin.binModuleBaseOptions,{
				paletteItemPostProcess:function($el){
					$el.on("enableDrag",function(e){
						$el.draggable("enable");
					});
					$el.on("disableDrag",function(e){
						$el.draggable("disable");
					});
				}
			});
			this.draggableOptions={
				refuse:function(event,ui,curDropEl,direction){
	    			if($(curDropEl).closest(".tab-pane-placeholder").length>0){
	    				return true;
	    			}
	    			return false;
	    		}
			};
		},
		setScope:function(scope){
			this.$scope=scope;
		},
		setFocus:function(focus){			
			this.focus=focus;
			this.trigger("focusChanged",focus);
		},
		/**
		 * focus信息如下:
		 * frameScope:$scope,
    	   frame:iElement,
    	   current:$scope.focus,
    	   pre:oldValue
		 */
		getFocus:function(){
			return this.focus;
		},
		refreshFocus:function(){
			var me=this;
			if(this.focus==null){
				return;
			}
			window.setTimeout(function(){
				me.focus.frameScope.$apply(function(){
					me.focus.frameScope.refresh();
					me.trigger("focusRefreshed",me.focus);
				});
			},100);
		},
		close:function(val){
			var iframeId=this.$scope.iframeId;
			if(!utils.isBlank(iframeId) && window.parent.Page){
				window.parent.Page.closeIframe(iframeId,val);
				return;
			}
			window.returnValue=val;
			window.close();			
		}
	});
	if(!window.pd){
		window.pd=new PD();
	}
	serviceModule.factory('appConfig',["$compile","$rootScope",function($compile,$rootScope) {
		return window.pd;
	}]);
	
	return window.pd;
});
