/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 */
define(['angular',"filters/filters","services/services","directives/directives",
"directives/pdContainer","directives/pdBin","directives/pdPaletteItem"
],function(angular){	
	var module= angular.module('app.controllers',['app.filters','app.services', 'app.directives']);		
	return module;
});
