define([ 'angular', 'services/services',"common/utils"], function(angular, serviceModule,utils,classLoader) {
	
	var service={
		editor:null
	};

	//创建新的编辑器
	var createEditor=service.createEditor=function(editorName,bin){
		var editor={
			name:editorName,
			bin:bin,
		};
		service.editor=editor;
		return editor;
	};
	
	var destroyEditor=service.destroyEditor=function(){
		service.editor=null;
	};
	
	serviceModule.factory('editorManager',function($resource) {
		return service;
	});
	
	return service;
});
