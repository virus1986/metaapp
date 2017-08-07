define(["require"],function(require){
	return {
		taskRollback:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var rollbackUrl=Global.contextPath+"/workflow/process/rollback";	
			rollbackUrl=Urls.appendParam(rollbackUrl,"taskId",id);
			$.restPost(rollbackUrl,{},function(res){
				$grid.trigger("reloadGrid");
			});
		},
		itemApprove:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var delegatorId=row.delegatorId;//delegate task
			var approveUrl=Global.contextPath+"/workflow/process/approve";	
			approveUrl=Urls.appendParam(approveUrl,"taskId",id);
			if(delegatorId){
				approveUrl=Urls.appendParam(approveUrl,"delegatorId",delegatorId);
			}
			approveUrl=Urls.appendParam(approveUrl,"businessDataId",row['WfProcInst.businessId']);
			$.openLink(approveUrl,{
				showType:"tab",
				title:"审批"
				},function(response){
					if(response){
						$grid.trigger("reloadGrid");
					}
				});
		},
		itemRead:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var approveUrl=Global.contextPath+"/workflow/process/approve?type=read";	
			approveUrl=Urls.appendParam(approveUrl,"taskId",row.taskId);
			approveUrl=Urls.appendParam(approveUrl,"notifyId",row.id);
			approveUrl=Urls.appendParam(approveUrl,"businessDataId",row['WfProcInst.businessId']);
			$.openLink(approveUrl,{
				showType:"tab",
				title:"阅读"
				},function(){
					$grid.trigger("reloadGrid");
				});
		},
		itemView:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var approveUrl=Global.contextPath+"/workflow/process/approve?type=view";	
			approveUrl=Urls.appendParam(approveUrl,"taskId",row.taskId||id);
			approveUrl=Urls.appendParam(approveUrl,"businessDataId",row['WfProcInst.businessId']);
			$.openLink(approveUrl,{
				showType:"tab",
				title:"阅读"
				},function(){
				});
		},
		itemViewByInst:function(send,grid){	
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			id=row.procInstId||id;
			var getTaskIdUrl=Global.contextPath+"/workflow/process/getTaskIdByInst?instId="+id;
			var approveUrl=Global.contextPath+"/workflow/process/approve?type=role";	
			$.restGet(getTaskIdUrl,function(taskId){
				if(taskId){
					approveUrl=Urls.appendParam(approveUrl,"taskId",taskId);
					$.openLink(approveUrl,{
						showType:"tab",
						title:"阅读"
					},function(){
					});
				}
			});
		},
		procDefDeploy:function(send,grid){
			var $grid=grid;
			var deployUrl=Global.contextPath+"/workflow/definition/deploy";	
			$.openLink(deployUrl,{
				width:"600",
				height:"260"
				},function(response){
					if(response){
						$grid.trigger("reloadGrid");
					}
				});
		},
		startProcItem:function(send,grid){
			var starProcUrl=Global.contextPath+"/workflow/process/start";
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var businessProcId=row.procId;
			starProcUrl=Urls.urlParam(starProcUrl,[{key:"businessProcId",value:businessProcId}]);
			$.openLink(starProcUrl,{
				showType:"tab",
				title:"发起["+row.procName+"]申请"
				},function(response){
					
			});
		},
		startProcItemByDraft:function(send,grid){
			var starProcUrl=Global.contextPath+"/workflow/draft/start";
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowDataInitial(id);
			var businessProcId=row.procId;
			starProcUrl=Urls.urlParam(starProcUrl,[{key:"businessProcId",value:businessProcId},
			                                       {key:"draftId",value:id},
			                                       {key:"businessDataId",value:row.businessId}]);
			$.openLink(starProcUrl,{
				showType:"tab",
				title:row['procName']||row['WfProc.procName']
				},function(response){
					
			});
		},
		createProxyBatch:function(send,grid){
			var createProxyBatchUrl=Global.contextPath+"/proxytask/proxy/create?type=1";
			var $grid=grid;
			$.openLink(createProxyBatchUrl,{
				showType:"pop-up",
				title:"新建委托"
				},function(response){
					if(response){
						$grid.trigger("reloadGrid");
					}
			});
		},
		remind:function(send,grid){
			var remindUrl=Global.contextPath+"/workflow/process/remind";
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			remindUrl=Urls.urlParam(remindUrl,[{key:"taskId",value:id}]);
			$.openLink(remindUrl,{
				showType:"pop-up",
				title:"催办提醒"
				},function(response){
			});
		},
		design:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowDataInitial(id);
			var procDefId=row.procDefId||"";
			var designerUrl=Global.contextPath+"/wfdesigner/editor?profile=p1&flowid="+procDefId;
			designerUrl=Urls.appendParam(designerUrl,"procid",id);
			$.openLink(designerUrl,{
        		showType:'slide',target:'designer_'+procDefId},function(res){
        			if(res){
        				if(res.procdefid&&res.procdefkey){
        					var updateUrl=Global.contextPath+"/entities/wfproc/edit?action=EDIT&onlyUpdateDefId=1&id="+id;
	        				$.post(updateUrl,{procId:id,procDefId:res.procdefid,procDefKey:res.procdefkey},function(res){
	        					$grid.trigger("reloadGrid");
	        				});
        				}
        			}
        		});
		},
		editForm:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var wfProcUrl = Global.contextPath+"/entities/wfProc/get?id="+id;
			$.restGet(wfProcUrl,{},function(response){
				if(response){
					var formUrl = response.formUrl;
					if(!formUrl){
						$.messageBox.info({message:"未选择任何表单，请选择表单或者新建表单!"});
						return false;
					}
					var start=formUrl.indexOf("/entities");
					var end=formUrl.indexOf("/form");
					if(start<0 || end<0 || end<start){
						$.messageBox.info({message:"此表单不支持编辑!"});
						return false;
					}
					var entityName=formUrl.substring(start+10,end);
					var viewName="form";
					var params=Urls.resolveParams(formUrl);
					if(params&&params.view){
						viewName=params.view;
					}
					var editFormUrl=Global.contextPath + "/html_editor/?publish=1&workflow=1";
					editFormUrl=Urls.appendParam(editFormUrl,"entityName",entityName);
					editFormUrl=Urls.appendParam(editFormUrl,"viewname",viewName);
					$.openLink(editFormUrl,{
		        		showType:'slide',target:'_'+entityName+'_'+viewName,},function(resp){
		        			
		        		});
				}
			},{async:false});
		},
		editBasicInfo:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var url = Global.contextPath + "/entities/wfProc/form?view=baseinfoform&id="+id;
			$.openLink(url,{width:1000,title:row.procName+'流程属性'},function(re){
				
			});
		},
		forceEnd:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			$.messageBox.confirm({message:"该流程将被作废，相关的业务数据及其状态将恢复至流程发起前，确认要作废？",callback:function(isConfirm){
				if(isConfirm){
					var forceEndUrl=Global.contextPath+"/workflow/process/forceEnd";	
					forceEndUrl=Urls.urlParam(forceEndUrl,[{key:"instId",value:id},{key:"comment",value:"废弃的流程"}]);
					$.restPost(forceEndUrl,{},null,{
						beforeSend:function(xhr){
							CommonUtil.showLoading("正在作废流程...");
						  },complete:function(xhr,textStatus){
							CommonUtil.hiddenLoading(100);
						  },success:function(response){
							  if(response){
								  $grid.trigger("reloadGrid");
							  }
							  CommonUtil.hiddenLoading(100);
						  }
					});
				}
			}});
		},
		forceEndValid:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			$.messageBox.confirm({message:"该流程将被正常结束，相关的业务数据将按有效处理，确认要结束？",callback:function(isConfirm){
				if(isConfirm){
					var forceEndUrl=Global.contextPath+"/workflow/process/finish";		
					forceEndUrl=Urls.urlParam(forceEndUrl,[{key:"instId",value:id},{key:"comment",value:"正常结束流程"}]);
					$.restPost(forceEndUrl,{},null,{
						beforeSend:function(xhr){
							CommonUtil.showLoading("正常结束流程中...");
						},complete:function(xhr,textStatus){
							CommonUtil.hiddenLoading(100);
						},success:function(response){
							if(response){
								$grid.trigger("reloadGrid");
							}
							CommonUtil.hiddenLoading(100);
						}
					});
				}
			}});
		},
		createFromTemplate:function(send,grid){
			var $grid=grid;
			
			var chooseCreateMethodUrl=Global.contextPath+"/workflow/wfproc/createChoose";
			$.openLink(chooseCreateMethodUrl,function(res){
				var createUrl;
				if(res==="createFromTemplate"){
					createUrl=Global.contextPath+"/workflow/wfproc/createFromTemplate";
					$.openLink(createUrl,function(res){
						if(res){
							$grid.trigger("reloadGrid");
						}
					});
				}else if(res==="createNew"){
					createUrl=Global.contextPath+"/entities/wfproc/create?view=create";
					$.openLink(createUrl,function(res){
						if(res){
							$grid.trigger("reloadGrid");
						}
					});
				}else if(res==="createFromWizard"){
					createUrl=Global.contextPath+"/entities/wfproc/create?view=wizard";
					$.openLink(createUrl,{showType:"tab",title:"流程创建向导"},function(res){
						if(res){
							$grid.trigger("reloadGrid");
						}
					});
				}
			});
		},
		businessDataView:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var row=$grid.getRowData(id);
			var entityName=row.entityName;
			var url=Global.contextPath+"/entities/"+entityName+"/list";
			$.openLink(url,{showType:"tab",title:"业务实体"+entityName+"视图"},function(res){
				
			});
		},
		updateFormVersion:function(send,grid){
			var $grid=grid;
			var id = $grid.jqGrid('getGridParam','selrow');
			if (!id){ 											
				$.messageBox.info({message:i18n.t("common.selectRow")});
				return;
			}
			var url=Global.contextPath+"/workflow/wfproc/updateFormVersion?procId="+id;
			$.restPost(url,{},null,{
				beforeSend:function(xhr){
					CommonUtil.showLoading();
				},complete:function(xhr,textStatus){
					CommonUtil.hiddenLoading(100);
				},success:function(response){
					CommonUtil.hiddenLoading(100);
				}
			});
		}
	};
});