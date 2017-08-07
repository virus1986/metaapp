/**
 * 模块加载器，负责模块的注入及加载工作
 */
define([],function(){	
	var classes={};
	var module={};
	module.classes=classes;
	module.register=function(moduleName,moduleConfig){
		classes[moduleName]=moduleConfig;
	};

	module.getModule=function(moduleName){
		return classes[moduleName];
	};
	
	module.getAllModules=function(){
		var allModules=[];
		$.each(classes,function(i,item){
			allModules.push(item);
		});
		return allModules;
	};

	
	return module;
});
