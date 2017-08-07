
/**
 * pd-bin='metaSlaveTable'顶部的工具栏
 */

define(['angular',"directives/directives","common/utils","services/slaveTableService"],function(angular,directiveModule,utils) {
	'use strict';
	var directive=directiveModule.directive('metaSlaveTableEditor', ["$http", function factory($http) {
	  var directiveDefinition = {
	    priority: 0,
	    templateUrl: utils.resolveTemplateUrl("toolbar-editors/metaslavetable-editor.html"),
	    replace: true,
	    transclude: false,
	    restrict: 'A',  
	    controller:["$scope", "$http", "slaveTableService",function($scope, $http, slaveTableService) {
	    	if(!$.isArray($scope.bin.data.fields)){
	    		var fields=slaveTableService.getColumns($scope.bin.data.entityname);
	    		var gridCols = $scope.bin.data.gridCols;
	    		var fieldsClone = [];
	    		for(var i=0;i<gridCols.length;i++){
	    			fieldsClone.push(gridCols[i]);
	    		}
	    		for(var i=0;i<fields.length;i++){
	    			var exist = false;
	    			for(var j=0;j<fieldsClone.length;j++){
	    				if(fields[i].name==fieldsClone[j].name||fields[i].name=="id"){
	    					exist = true;
	    					break;
	    				}
	    			}
	    			if(!exist){
	    				fieldsClone.push({name:fields[i].name,displayName:fields[i].displayName});
	    			}
	    		}
	    		$scope.fields=fieldsClone;
	    	}else{
	    		$scope.fields=$scope.bin.data.fields;
	    	}
	    	$scope.setFields=function(){
	    		$("#slaveTableFields").find(":checkbox").prop("checked",true);
	    		var gridCols=$scope.bin.data.gridCols;
	    		var nochecked = [];
	    		for(var i=0;i<$scope.fields.length;i++){
	    			var exist = false;
	    			for(var j=0;j<gridCols.length;j++){
	    				if($scope.fields[i].name==gridCols[j].name){
	    					exist = true;
	    					break;
	    				}
	    			}
	    			if(!exist){
	    				nochecked.push({name:$scope.fields[i].name,displayName:$scope.fields[i].displayName});
	    			}
	    		}
	    		$scope.bin.data.nochecked=nochecked;
    			for(var i=0;i<nochecked.length;++i){
    				$("#slaveTableFields [value="+nochecked[i].name+"]").prop("checked",false);
    			}
    			$("#sortable").sortable();
	    		window.setTimeout(function(){
	    			$(".modal-backdrop").appendTo("#breadcrumbs");
	    		},500);
	    	};
	    	$scope.saveFieldsSet=function(){
	    		var checkboxfields = $("#slaveTableFields").find(":checkbox");
	    		var checkedFields = $("#slaveTableFields").find(":checked");
	    		var nocheckedFields = $("#slaveTableFields").find("input:not(:checked)");
	    		var fields = [];
	    		var gridCols = [];
	    		var nochecked = [];
	    		var columns = [];
	    		for(var i=0;i<checkboxfields.length;i++){
	    			fields.push({name:checkboxfields[i].value,displayName:checkboxfields[i].dataset.displayname,index:checkboxfields[i].dataset.index});
	    		}
	    		for(var i=0;i<checkedFields.length;i++){
	    			gridCols.push({name:checkedFields[i].value,displayName:checkedFields[i].dataset.displayname,index:checkedFields[i].dataset.index});
	    			columns.push(checkedFields[i].value);
	    		}
	    		for(var i=0;i<nocheckedFields.length;i++){
	    			nochecked.push({name:nocheckedFields[i].value,displayName:nocheckedFields[i].dataset.displayname,index:nocheckedFields[i].dataset.index});
	    		}
	    		var url=Global.contextPath+"/html_editor/"+Global.entityName+"/slavetable/"+$scope.bin.data.entityname+"/columnorder";
	    		
	    		
	    		$.post(url,{columns:columns.join(",")},function(data){
	    			
	    		},"json");
	    		$scope.bin.data.fields =fields;
	    		$scope.bin.data.gridCols = gridCols;
	    		$scope.bin.data.nochecked=nochecked;
	    	};
	    }],
	    link:function postLink(scope, iElement, iAttrs) {
			
		}
	  };
	  return directiveDefinition;
	}]);
	return directive;
});