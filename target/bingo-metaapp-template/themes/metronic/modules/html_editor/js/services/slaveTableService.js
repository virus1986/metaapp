/**
 * 
 */
define([ 'angular', 'services/services'], function(angular, serviceModule) {
	
	var slaveTableService={getColumns:function(entityName){
		var columns = [];
		$.ajax({
			url:Global.contextPath+"/metadata/field/query_paged?entity="+entityName,
			async:false,
			type:"post",
			dataType:"json",
			contentType:"application/json",
			success:function(data){
				if(data.rows&&$.isArray(data.rows)){
					columns=data.rows;
				}
			}
		});
		return columns;
	}};
	serviceModule.factory('slaveTableService',[function() {
		return slaveTableService;
	}]);
	return slaveTableService;
});