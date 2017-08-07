define(["require"],function(require){
	return {
		deleteChild:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var deleteUrl=Global.contextPath+"/portal/menu/deleteDirectChildAndSelf";	
			deleteUrl=Urls.appendParam(deleteUrl,"id",id);
			$.restPost(deleteUrl,{},function(res){
				$grid.trigger("reloadGrid");
			});
		}
	}
});