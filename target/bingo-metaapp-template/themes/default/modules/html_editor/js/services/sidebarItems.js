define([ 'angular', 'services/services',"common/utils","common/classLoader"], function(angular, serviceModule,utils,classLoader) {
	
	var service={};	
	var items=[
	           {name:"layouts",html:"布局控件",icon:"icon-text-width",href:"javascript://",active:true,items:[]},
	           {name:"controls",html:"基本控件",icon:"icon-desktop",href:"javascript://",active:false,items:[]},
	           {name:"fields",html:"实体字段",icon:"icon-edit",href:"javascript://",active:false,items:[]},
	           {name:"relations",html:"实体关系",icon:"icon-tag",href:"javascript://",active:false,items:[]},
	           {name:"plugins",html:"其它插件",icon:"icon-edit",href:"javascript://",active:false,items:[]},
	           {name:"templates",html:"布局模板",icon:"icon-dashboard",href:"javascript://",active:false,items:[]}
	          ];
	service.items=items;
	var flatItems={};
	
	//获取所有的条目
	var getItems=service.getItems=function(){
		return items;
	};
	service.getItemInFlat=function(itemName){
		if(utils.isBlank(itemName)){
			return null;
		}
		return flatItems[itemName];
	};
	//获取指定名称的条目
	var getItem=service.getItem=function(itemName){
		if(utils.isBlank(itemName)){
			return null;
		}
		itemName=itemName.toLowerCase();
		var selectedItem=null;
		$.each(items,function(i,item){
			if(item.name.toLowerCase()==itemName){
				selectedItem=item;
				return false;
			}
		});
		return selectedItem;
	};
	
	//添加条目
	var addItem=service.addItem=function(parentName,item){
		var parent=getItem(parentName);
		if(utils.isBlank(parent)){
			return;
		}
		if(utils.isBlank(parent.items)){
			parent.items=[];
		}
		parent.items.push(item);
	};
	
	//根据模块的配置生成条目
	var createItem=service.createItem=function(parentName,instance){
		var item=instance||{};
		/*item.name=instance.name;
		item.compileHtml=instance.compileHtml;
		item.moduleName=instance.moduleName;
		item.unique=instance.unique;*/
		item.html=instance.paletteItemHtml;
		item.href=instance.href;
		item.icon=instance.icon;
		item.items=[];
		
		addItem(parentName,item);
		flatItems[item.name]=item;
	};
		
	serviceModule.factory('sidebarItems',["$resource",function($resource) {
		function init(){
			var allModules= classLoader.classes;
			$.each(allModules,function(i,module){
				if(module.getSidebarItems){
					var items=module.getSidebarItems();
					if($.isArray(items)){
						$.each(items,function(i,item){
							createItem(item.parentName,item);
						});
					}else if($.isPlainObject(items)){
						createItem(items.parentName,items);
					}
				}
			});
		};
		init();
		return service;
	}]);
	
	return service;
});
