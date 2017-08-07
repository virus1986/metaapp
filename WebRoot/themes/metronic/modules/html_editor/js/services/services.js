/**
 * 依赖的定义
 * 所属module
 * 依赖的Services
 */
define(['angular','ngResource'],function(angular,ngResource){	
	var module= angular.module('app.services',['ngResource']);		
	return module;
});
