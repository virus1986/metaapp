/**
 * 定义根应用，以及主要模块的依赖关系
 */
define(['angular',"filters/filters","services/services","directives/directives","controllers/controllers",
			"controllers/pageController"],
		function (angular,filterModule,serviceModule,directiveModule,controlModule) {
		
		var app= angular.module('app', ['app.filters','app.services', 'app.directives','app.controllers','ngAnimate','ngSanitize']);

		app.config(function($compileProvider){ 
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension|javascript):/); 
		});
		
		return app;
});
