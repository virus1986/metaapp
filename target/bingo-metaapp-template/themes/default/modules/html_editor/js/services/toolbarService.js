define([ 'angular', 'services/services'], function(angular, serviceModule) {
	
	var toolbarService={};
	toolbarService.removeAll=function(){
		window.pd.trigger("removeTools");
	};
	serviceModule.factory('toolbarService',[function() {
		return toolbarService;
	}]);
	return toolbarService;
});