define([ 'angular', 'services/services'], function(angular, serviceModule) {
	
	var relationService={relationLinks:[]};
	$.ajax({
		url:Global.contextPath+"/html_editor/"+Global.entityName+"/relationlink/",
		async:false,
		type:"get",
		dataType:"json",
		contentType:"application/json",
		success:function(data){
			if(data&&$.isArray(data)){
				relationService.relationLinks=data;
			}
		}
	});
	serviceModule.factory('relationService',[function() {
		return relationService;
	}]);
	return relationService;
});