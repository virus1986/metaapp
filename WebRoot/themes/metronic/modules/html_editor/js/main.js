/*global require*/
(function(){
	var heRequire=require.config({
		paths: {
			underscore:'lib/underscore-min',
			usStrings:'lib/underscore-string',
			angular: 'lib/angular',
			ngResource:'lib/angular-resource',
			ngAnimate:'lib/angular-animate',
			ngSanitize:'lib/angular-sanitize',
			cellPos:"lib/jquery.cellpos"
		},
		shim: {
			usStrings:{
				exports:'usStrings',
				deps:['underscore']
			},
			angular: {
				exports: 'angular'
			},
			ngResource:{
				exports:'$resource',
				deps: ['angular']
			},
			ngAnimate:{
				exports:'ngAnimate',
				deps: ['angular']
			},
			ngSanitize:{
				exports:'ngSanitize',
				deps: ['angular']
			}
		}
	});
	
	window.pd = null;
	define("main",['angular','app','ngAnimate','ngSanitize',"usStrings","directives/uiAce",
                   "directives/pdFocusFrame","directives/toolbar-editors/pdEditor",
                   "directives/pdLayout","directives/pdTable","directives/pdTitle",
                   "directives/pdHtml","directives/metaField","directives/metaRelation",
                   "directives/metaFields","directives/metaGrid","directives/pdLabel",
                   "directives/uiTab","directives/uiFormToolbar","directives/metaSlaveTable",
                   "directives/pdSpecs","plugins/focusTable",
		             "plugins/htmleditor/singleItems","plugins/htmleditor/listItems",
		             "plugins/htmleditor/tableItems"], function (angular,module) {
			angular.bootstrap(document, [module.name]);
			window.pd.trigger("ready");
	});
	heRequire(["main"]);
}());