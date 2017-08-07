define(["require"],function(require){
    return {
        //查看版本
        listVersions:function(sender,args){
        	var $grid=args;
        	var id = $grid.jqGrid('getGridParam', 'selarrrow')[0];
            if(!id){
                $.messageBox.warning({message:i18n.t("uitemplate.versionView.selectInfo")});
                return;
            }
            var obj = $grid.getRowData(id);
            var url=Global.contextPath + "/metadata/uitemplate/list?view=versions";
            url=Urls.appendParam(url,"entity",obj.entityName);
            url=Urls.appendParam(url,"name",obj.name);
            $.openLink(url, {
					width:800,
					height:300,
					title : i18n.t("uitemplate.versionMange.title",obj.displayName),
					requestType : "GET"
					}, null);
        } ,
        //删除所有版本
        delVersions:function(sender,args){
        	var $grid=args;
        	var id = $grid.jqGrid('getGridParam', 'selarrrow')[0];
            if(!id){
                $.messageBox.warning({message:i18n.t("uitemplate.deleteSelectInfo")});
                return;
            }
            var obj = $grid.getRowData(id);
            if(obj.isCustom=="false"){
            	$.messageBox.warning({message:i18n.t("uitemplate.deleteFailSystem")});
                return;
            }
            var url=Global.contextPath + "/metadata/uitemplate/del_byname";
            url=Urls.appendParam(url,"entity",obj.entityName);
            url=Urls.appendParam(url,"name",obj.name);
            url=Urls.appendParam(url,"layoutType",obj.layoutType);
            $.messageBox.confirm({
				message:i18n.t("common.deleteConfirm"),
				callback:function(result){
					if(result){
						jQuery.restGet(url,null,function(response){
							if(response==null || response<1) return ;
							var loadOnce=$grid.getGridParam('loadonce');
							if(loadOnce){
								$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
							}else{
								$grid.trigger("reloadGrid");
							}
						});
					}
				}
			});
        } 
        ,
        //发布模板
        publish:function(sender,args){
        	var $grid=args;
        	var id = $grid.jqGrid('getGridParam', 'selarrrow')[0];
            if(!id){
                $.messageBox.warning({message:i18n.t("uitemplate.publishSelectInfo")});
                return;
            }
            var obj = $grid.getRowData(id);
            if(!obj.status || obj.status==10 ){
            	$.messageBox.warning({message:i18n.t("uitemplate.publishRepeatError")});
                return;
            }
            var url=Global.contextPath + "/metadata/uitemplate/publish";
            url=Urls.appendParam(url,"id",id);
			jQuery.restGet(url,null,function(response){
				if(response==null || response<1) return ;
				var loadOnce=$grid.getGridParam('loadonce');
				if(loadOnce){
					$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
				}else{
					$grid.trigger("reloadGrid");
				}
			});
        },
        //高级模式编辑表单
        editRecord:function(sender,args){
        	var $grid=args;
        	var id = $grid.jqGrid('getGridParam', 'selarrrow')[0];
            if(!id){
                $.messageBox.warning({message:i18n.t("uitemplate.formEditSelectInfo")});
                return;
            }
            var obj = $grid.getRowData(id);
            //var url=Global.contextPath + "/html_editor/layout_form";
            var url=Global.contextPath + "/html_editor/";
            url=Urls.appendParam(url,"entityName",obj.entityName);
            url=Urls.appendParam(url,"formId",id);
			var converter=obj.converter;
			if("form_template_workflow"==converter){
				url=Urls.appendParam(url,"workflow","1");
			}
            $.openLink(url, {
            		showType:'slide',
					title : i18n.t("uitemplate.formEditTitle",obj.displayName),
					target:'_'+obj.entityName+'_'+obj.name,
					requestType : "GET"
					}, function(res){
						var loadOnce=$grid.getGridParam('loadonce');
						if(loadOnce){
							$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
						}else{
							$grid.trigger("reloadGrid");
						}
					});
        },
        createWorkflowForm:function(sender,args){
        	var $grid=args;
        	var formCreateUrl=Global.contextPath+"/metadata/uitemplate/form_create_base_workflow";
			$.openLink(formCreateUrl,{
        		showType:'pop-up'},function(res){
        			if(res){
        				var loadOnce=$grid.getGridParam('loadonce');
						if(loadOnce){
							$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
						}else{
							$grid.trigger("reloadGrid");
						}
        			}
        		});
        },
        copyToMobileWorkflowForm:function(sender,args){
        	var $grid=args;
        	var id = $grid.jqGrid('getGridParam', 'selarrrow')[0];
            if(!id){
                $.messageBox.warning({message:i18n.t("uitemplate.formEditSelectInfo")});
                return;
            }
            var obj = $grid.getRowData(id);
            var name=obj.name;
            if(name.endWith("_mobile")){
            	 $.messageBox.warning({message:i18n.t("uitemplate.mobileOnlyOne")});
            	return;
            }
            var url=Global.contextPath+"/metadata/uitemplate/copyToMobileWorkflowForm";
            url=Urls.appendParam(url,"id",id);
            $.restPost(url,{},function(res){
            	if(res){
    				var loadOnce=$grid.getGridParam('loadonce');
					if(loadOnce){
						$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
					}else{
						$grid.trigger("reloadGrid");
					}
    			}
            });
        }
	};
});