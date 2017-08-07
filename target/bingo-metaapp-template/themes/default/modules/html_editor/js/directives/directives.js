/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 */
define(['angular',"filters/filters","services/services"],function(angular){	
	var module= angular.module('app.directives',['app.filters','app.services']);		
	return module;
});
