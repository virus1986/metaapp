define(["require"],function(require){
    return {
        //createTreeOption
    	createTreeOption:function(sender,args){
        	var $grid=args;
        	var options=$.fn.extend(true,{
				width:800		
			},$grid.getGridParam('addDialogOptions'));
        	var createUrl = $grid.getGridParam("createurl");
			createUrl=Urls.appendDate(createUrl);
			createUrl=Urls.urlParam(createUrl,[{key:'type',value:'tree'}]);
			var showType = "pop-up", title = i18n.t("optionset.newTreeType");
			var dialogSettings = $grid.getGridParam("addDialogSettings");
			if(dialogSettings){
				showType = dialogSettings.showType || showType;
				title = dialogSettings.caption || title;
			}
			$.openLink(createUrl, {
				width:options.width,
				height:options.height,
				showType: showType,
				title : title,
				requestType : "GET",
				data : {}
				}, function(reVal) {
						if (reVal == null){
							return;
						}
						var loadOnce=$grid.getGridParam('loadonce');
						if(loadOnce){
							$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
						}else{
							$grid.trigger("reloadGrid");
						}
				});
        },
        //编辑选项
        editOption:function(sender,args){
        	var $grid=args;
        	var options=$.fn.extend(true,{
				width:800			
			},$grid.getGridParam('editDialogOptions'));
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});;
				return;
			}
			var row=$grid.getRowData(id);
			var editurl=$grid.getGridParam("editurl");	
			editurl=Urls.appendParam(editurl,"id",id);
			editurl=Urls.appendParam(editurl,"type",row.kind);
			editurl=Urls.appendDate(editurl);
			var showType = "pop-up", title = i18n.t("optionset.edit",row.name);
			var dialogSettings = $grid.getGridParam("editDialogSettings");
			if(dialogSettings){
				showType = dialogSettings.showType || showType;
				title = dialogSettings.caption || title;
			}
			$.openLink(editurl,{
				width:options.width,
				height:options.height,
				showType: showType,
				title:title,
				iframe:false,requestType:"GET",data:{}},
				function(reVal){
					if(reVal==null ) return ;
					var loadOnce=$grid.getGridParam('loadonce');
					if(loadOnce){
						$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
					}else{
						$grid.trigger("reloadGrid");
					}
			}) ;
        }
	};
});