define([ 'angular', 'services/services',"common/utils"], function(angular, serviceModule,utils,classLoader) {
	
	var service={
			bins:[],
			currentBin:null,
	};	

	//创建新的Bin配置数据
	var createBin=service.createBin=function(iElement,suppliedId){
		var defaultBin={
				data:null,
				selected:false,
				actived:false,
				element:iElement,
				id:suppliedId||utils.newGuid()
		};
		return defaultBin;
	};
	
	var dropBin=service.dropBin=function(bin){
		var dBin=findBin(bin.id);
		if(utils.isBlank(dBin)){
			return;
		}
		service.bins.splice($.inArray(dBin, service.bins),1);
	};
	
	//激活选中的Bin
	var activeBin=service.activeBin=function(bin){
		if(utils.isBlank(bin) || bin==service.currentBin){
			return;
		}
		if(service.currentBin!=null){
			disActiveBin();
		}
		service.currentBin=bin;
		bin.actived=true;
		bin.selected=true;
		notify("actived",bin);
	};
	
	var disActiveBin=service.disActiveBin=function(){
		var bin=getActivedBin();
		if(utils.isBlank(bin)){
			return;
		}
		bin.actived=false;
		bin.selected=false;
		service.currentBin=null;
		notify("disActived",bin);
	};
	
	//获取已激活的Bin
	var getActivedBin=service.getActivedBin=function(){
		return service.currentBin;
	};
	
	//添加一个Bin
	var addBin=service.addBin=function(bin){
		var existsBin=findBin(bin.id);
		if(utils.isBlank(existsBin)){
			service.bins.push(bin);
		}		
	};
	
	//根据Id名获取Bin
	var findBin=service.findBin=function(binId){
		var selected=null;
		$.each(service.bins,function(i,item){
			if(binId==item.id){
				selected=item;
				return false;
			}
		});
		return selected;
	};
	
	//清空所有Bin
	var clear=service.clear=function(){
		service.bins=[];
		service.currentBin=null;
	};
	//do some notifications before delete this bin element
	service.notifyBinBeforeDelete=function(bin){
		if(bin&&bin.item){
			if(bin.item.$el&&bin.item.unique){
				bin.item.$el.trigger("enableDrag");
			}
			if($.isFunction(bin.item.beforeDelete)){
				bin.item.beforeDelete(bin);
			}
		}
	};
	
	function notify(eventName,bin){
		if(utils.isBlank(bin) || utils.isBlank(bin.module)){
			return;
		}
		var binModule=bin.module;
		if(utils.isBlank(binModule[eventName]) || !$.isFunction(binModule[eventName])){
			return;
		}
		binModule[eventName].call(binModule,bin);
	}
			
	serviceModule.factory('binManager',function($resource) {
		return service;
	});
	
	return service;
});
