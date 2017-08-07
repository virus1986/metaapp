define(["require","./workflow_utils"],function(require,WorkflowUtils){
	var $=jQuery;
	return {
		createNew:function(_options){
			var workflowManager={};
			var workflowUtils=WorkflowUtils.createNew();
			var context = _options.context;
			var options=_options.options,
				businessProcId=_options.businessProcId,
				businessDataId=_options.businessDataId,
				taskId=_options.taskId,
				notifyId=_options.notifyId,
				type=_options.type,
				businessFormUrl=_options.businessFormUrl,
				instId=_options.procInstId,
				procDefId=_options.procDefId,
				delegatorId=_options.delegatorId,
				nextIsNeedSelectUser=_options.nextIsNeedSelectUser,
				nextAllActivity=_options.nextAllActivity,
				freestyle=_options.freestyle,
				countersign=_options.countersign,
				canCountersign=_options.canCountersign,
				canFinish=_options.canFinish,
				replyActor=_options.replyActor,
				isInTab=_options.isInTab;
			var sendToReadActors=null,forwardActors=null;
			var flowType={countersign:"countersign",normal:"normal",finish:"finish"};
			
			var selectedTabId=TabUtils.getSelectedTabId();
			
			var $approveContainer=$("#approveContainer",context);
			
			var businessForm={
					save:function(callback,isSaveDraft){
						var businessFormContainer = $("#businessFormContainer",context);
						var form=$("form",businessFormContainer);
						form.data("success",function(businessData){
							if(businessData&&$.isFunction(callback)){
								callback(businessData);
								//console.log(businessData);
							}							
						});
						if(isSaveDraft){
							form.data("wfFormSaveDraft",1);
							var formAction=form.attr("action");
							form.attr("action",Urls.appendParam(formAction,"wfFormSaveDraft",1));
						}
						form.on("afterSerialize",function(e,isOk){
							if(!isOk){
								enableBtns();
							}
						});
						form.submit();
				   },
				   validation:function(){
					    var businessFormContainer = $("#businessFormContainer",context);
					    var form=$("form",businessFormContainer);
					    var valInfo = $.validation.validate(form) ;
						if( valInfo.isError ) {
							enableBtns();
							return false;
						}
						return true;
				   }
			};
			function closeCurWin(){
				if(!isInTab){
					  window.opener=null;
					  window.open('','_self','');
					  window.close();
				  }else{
					  TabUtils.closeTab();
					  TabUtils.reloadTabGrid();
				  }
			};
			function disableBtns(btnSelf){
				if(btnSelf.data("alreadyClicked")===true){
					return true;
				}
				$("#workflow-header-con-btns button",context).data("alreadyClicked",true);
				$(btnSelf).attr("disabled","disabled").addClass("disabled");
				$(btnSelf).siblings("button").attr("disabled","disabled").addClass("disabled");
				return false;
			};
			function enableBtns(){
				$("#workflow-header-con-btns button",context).removeAttr("disabled").removeClass("disabled").data("alreadyClicked",false);
			};
			function appendDelegatorToUrl(url){//task from delegate
				if(delegatorId){
					url=Urls.urlParam(url,[{key:"delegatorId",value:delegatorId}]);
				}
				return url;
			};
			var restPostOptions=function(btnSelf){
				return {
					beforeSend:function(xhr){
						if(btnSelf.data("isSumbit")){
							$.messageBox.warning({message:"请不要重复提交!"});
							return false;
						}
						btnSelf.data("isSumbit",true);
						//disableBtns(btnSelf);
						var loadingSelector=CommonUtil.showLoading(context,"流程提交中...",true);
						btnSelf.data("loadingSelector",loadingSelector);
					  },complete:function(xhr,textStatus){
						  if(btnSelf.data("loadingSelector")){
							  CommonUtil.hiddenLoading(100,btnSelf.data("loadingSelector"));
						  }
					  },success:function(response){
						  CommonUtil.hiddenLoading(100,btnSelf.data("loadingSelector"));
						  if(response){
							  FlowOpts.refreshCount();
							  closeCurWin();
						  }					  
					  }
				};
			};
			var selectUser=workflowManager.selectUser=workflowUtils.selectActors;
			var actorType={post:"post",userrole:"role",user:"user",scriptUser:"expression"};
			var getUserComment=workflowManager.getUserComment=function(defaultValue,notNeedApprove){
				var $commentInput=$approveContainer.find("[name=userComment]");
				if($commentInput.length===0){
					return {valid:true,userComment:""};
				}
				var approveValue=getApproveValue(notNeedApprove);
				var userComment=$commentInput.val();
				if(!userComment){
					if(defaultValue){
						return {valid:true,userComment:defaultValue};
					}
					if(approveValue=="1"){
						return {valid:true,userComment:""};
					}
					$.messageBox.warning({message:"请填写审批意见!"});
					enableBtns();
					return {valid:false};;
				}
				return {valid:true,userComment:userComment};
			};
			var getApproveValue=workflowManager.getApproveValue=function(notNeedApprove){
				if(!!notNeedApprove){
					return "1";
				}
				if(!$approveContainer.find("#approveValue").length){
					return "1";
				}
				if(!$approveContainer.find("#approveValue:checked").length){
					$.messageBox.warning({message:"请选择是否审批通过!"});
					return "-1";
				}
				var approveValue=$approveContainer.find("#approveValue:checked").val();
				return approveValue;
			};
			/*var getSelectActToContinue=workflowManager.getSelectActToContinue=function(){
				var selectActToContinueDom=$approveContainer.find("[name=selectActToContinue]");
				var selectActToContinue=null;
				var name=selectActToContinueDom.val();
				if(selectActToContinueDom.length){
					if(!name){
						$.messageBox.warning({message:"请选择下一环节!"});
						return "-1";
					}
					var selected=selectActToContinueDom.find("option:selected");
					var needSelectUser=selected.data("needselectuser");
					if(needSelectUser===true||needSelectUser==="true"){
						nextIsNeedSelectUser=true;
					}
					selectActToContinue=[{name:name,parent:selected.data("parent")}];
					if($.isArray(nextAllActivity)){
						$.each(nextAllActivity,function(i,act){
							if(act.displayType==="TrueCheckBox"){
								selectActToContinue.push({name:act.id,parent:act.parentId});
							}
						});
					}
				}
				return selectActToContinue;
			};*/
			var getRejectAct=workflowManager.getRejectAct=function(){
				var rejectAct=$approveContainer.find("[name=rejectToAct]").val();
				return rejectAct;
			};
			
			var getTaskUsers=workflowManager.getTaskUsers=function(taskId,callback){
				var url=Global.contextPath+"/workflow/process/getTaskUsers";
				url=Urls.appendParam(url,"taskId",taskId);
				$.restGet(url,null,function(response){
					if($.isFunction(callback)){
						callback(response);
					};
				});
			};
			var nextAllActivityMap={},flowTypeParamValue=flowType.normal;
			function selectActAndSetUser(nextAllActivity,userDataWithActors,callcack){
				if($.isArray(nextAllActivity)){
					$.each(nextAllActivity,function(i,act){
						nextAllActivityMap[act.id]=act;
					});
				}
				var selectActToContinue=[];
				var nextAllActivityParams=[];
				var justSetActor=false;
				$.each(nextAllActivity,function(i,act){
					if(act.justSetActor){
						justSetActor=true;
						nextAllActivityParams.push(nextAllActivity[i]);
						return false;
					}
					if(act.displayType==="TrueCheckBox"){
						selectActToContinue.push({name:act.id,parent:act.parentId});
					}else{
						nextAllActivityParams.push(nextAllActivity[i]);
					}
				});
				var chooseActUrl=Global.contextPath+"/workflow/approve/chooseActivity";
				if(justSetActor){
					chooseActUrl=Urls.urlParam(chooseActUrl,[{key:"justsetactor",value:1}]);
				}else{
					chooseActUrl=Urls.urlParam(chooseActUrl,[{key:"justsetactor",value:0}]);
				}
				$.openLink(chooseActUrl,{nextAllActivity:nextAllActivityParams,procId:businessProcId,taskId:taskId},function(res){
					if(res){
						if(justSetActor){
							userDataWithActors.justSetActorList=res;
						}else{
							if(nextAllActivityMap[res.name].isCountersign){
								flowTypeParamValue=flowType.countersign;
							}
							selectActToContinue.push(res);
							userDataWithActors.nextNamedActors=selectActToContinue;
						}
						if($.isFunction(callcack)){
							callcack(userDataWithActors);
						}
					}else{
						enableBtns();
						return false;
					}
	      		});
			};
			var nextAllActivityUrl=Global.contextPath+"/workflow/process/calcNextAllActivity";
			function getBDataForDraft(){
				var bData={
						"ccCandidates":null,
						"isCounterSign": false,
						"candidates":null,
						"procTitle":""
					};
				if(sendToReadActors){
					bData.ccCandidates=sendToReadActors;
				}
				if(forwardActors){
					bData.candidates=forwardActors;
				}
				if(flowType.countersign===flowTypeParamValue){
					bData.isCounterSign=true;
				}
				var procTitle=$("[name=procTitle]",context).val();
				if(procTitle){
					bData.procTitle=procTitle;
				}
				return bData;
			};
			var FlowForm=workflowManager.FlowForm={
					saveReceipt:function(btnSelf){
						businessForm.save(function(businessData){},true);
					},
					saveDraft:function(btnSelf){
						//保存草稿
						businessForm.save(function(businessData){
							var businessDataId=businessData.id;
							var saveDraftUrl=Global.contextPath+"/workflow/draft/save";
							saveDraftUrl=Urls.urlParam(saveDraftUrl,[{key:"businessProcId",value:businessProcId}]);
							var bdata=getBDataForDraft();
							var draft={procId:businessProcId,title:bdata.procTitle,businessId:businessDataId,businessData:JSON.stringify(bdata)};
							$.restPost(saveDraftUrl,draft,null,restPostOptions(btnSelf));
						},true);
					},
					setUserToSendToRead:function(btnSelf){
						selectUser(function(cActors){
							if(cActors){
								sendToReadActors=cActors;
							}
							enableBtns();
							return false;
						});
					},
					doDraft:function(btnSelf){
						var userDataWithActors={};//params to start process
						function sendDraftToStart(businessData){
							if(sendToReadActors){//if set send to read user
								userDataWithActors.candidates=sendToReadActors;
							}
							var businessDataId=businessData.id;
							var entityName=businessData['_entity_name_'];
							var procStartUrl=Global.contextPath+"/workflow/process/start";
							procStartUrl=Urls.urlParam(procStartUrl,[{key:"businessProcId",value:businessProcId},
							                                         {key:"formKey",value:entityName},
							                                         {key:"flowType",value:flowTypeParamValue},
							                                         {key:"businessDataId",value:businessDataId}]);
							$.restPost(procStartUrl,userDataWithActors,null,restPostOptions(btnSelf));
						};
						//拟稿
						businessForm.save(function(businessData){
							//TODO:获取nextAllActivity
							var url=Urls.urlParam(nextAllActivityUrl,[{key:"businessProcId",value:businessProcId},
							                                               {key:"businessDataId",value:businessDataId}]);
							$.restGet(url,function(_nextAllActivity){
								nextAllActivity=_nextAllActivity;
								if($.isArray(nextAllActivity)&&((nextAllActivity.length===1&&nextAllActivity[0].canSelectUser)||nextAllActivity.length>1)){
									selectActAndSetUser(nextAllActivity,userDataWithActors,function(){
										sendDraftToStart(businessData);
									});
								}else{
									sendDraftToStart(businessData);
								}
							});
							
						});
					},
					doSend:function(btnSelf){
						//提交
						var approveValue=getApproveValue();
						if(approveValue=="-1"){
							enableBtns();
							return false;
						}
						var userCommentRes=getUserComment();
						if(!userCommentRes.valid){
							enableBtns();
							return false;
						}
						var userComment=userCommentRes.userComment;
						
						var userData={"userComment":userComment,"userOpinion":approveValue};
							
						function doSave(businessData){
							var procApproveUrl=Global.contextPath+"/workflow/process/approve";
							if(sendToReadActors){//if set send to read user
								userData.candidates=sendToReadActors;
							}
							procApproveUrl=Urls.urlParam(procApproveUrl,[{key:"taskId",value:taskId},  {key:"flowType",value:flowTypeParamValue}]);
							procApproveUrl=appendDelegatorToUrl(procApproveUrl);
							if(approveValue=="1"){
								$.restPost(procApproveUrl,userData,null,restPostOptions(btnSelf));
							}else{
								var rejectAct=null;
								var reapprove=$("[name=reapprove]",context).val() || "0";
								rejectAct=getRejectAct();
								if(rejectAct=="-1"){
									FlowForm.doRejectToStarter(btnSelf);
								}else if(rejectAct=="-2"){
									FlowForm.doRejectToPrevious(btnSelf,reapprove);
								}else{
									FlowForm.doRejectToHistoryAct(btnSelf,rejectAct,reapprove);
								}
							}
						};
						businessForm.save(function(businessData){
							var url=Urls.urlParam(nextAllActivityUrl,[{key:"taskId",value:taskId},
							                                          {key:"businessProcId",value:businessProcId},
						                                               {key:"businessDataId",value:businessDataId}]);
							$.restGet(url,function(_nextAllActivity){
								nextAllActivity=_nextAllActivity;
								if(approveValue=="1"&&$.isArray(nextAllActivity)&&((nextAllActivity.length===1&&nextAllActivity[0].canSelectUser)||nextAllActivity.length>1)){
									selectActAndSetUser(nextAllActivity,userData,function(){
										doSave(businessData);
									});
								}else{
									doSave(businessData);
								}
							});
						});
					},
					doPrint:function(btnSelf){
						//打印
						var printUrl=Global.contextPath+"/workflow/process/print";
						printUrl=Urls.urlParam(printUrl,[{key:"taskId",value:taskId},
						                                 {key:"_viewId",value:$(context).attr("id")},
						                                 {key:"_masterpage",value:"common/print"}]);
						window.open(printUrl);
					},					
					doTransfer:function(btnSelf,params){
						//转办
						var userCommentRes=getUserComment("转办",true);
						if(!userCommentRes.valid){
							enableBtns();
							return false;
						}
						
						var _params=$.extend({
							taskId:taskId,
							userComment:userCommentRes.userComment
						},params,true);						
						var doTransferUrl=Global.contextPath+"/workflow/process/transfer";					
						doTransferUrl=Urls.urlParam(doTransferUrl,[{key:"taskId",value:_params.taskId}]);
						doTransferUrl=appendDelegatorToUrl(doTransferUrl);
						if(_params.candidates&&_params.candidates.length>0){
							var userDataWithActors={userComment:_params.userComment,forwardCandidates:_params.candidates};
							$.restPost(doTransferUrl,userDataWithActors,null,restPostOptions(btnSelf));
						}else{
							selectUser(function(cActors){
								if(cActors){
									var userDataWithActors={userComment:_params.userComment,forwardCandidates:cActors};
									$.restPost(doTransferUrl,userDataWithActors,null,restPostOptions(btnSelf));
								}else{
									enableBtns();
								}
							});
						}
					},
					doCirculate:function(btnSelf){
						//传阅
						var doCirculateUrl=Global.contextPath+"/workflow/process/circulate";
						var userCommentRes=getUserComment("传阅",true);
						if(!userCommentRes.valid){
							enableBtns();
							return false;
						}
						var userComment=userCommentRes.userComment;
						selectUser(function(cActors){
							if(cActors){
								var userDataWithActors={userComment:userComment,candidates:cActors};
								doCirculateUrl=Urls.urlParam(doCirculateUrl,[{key:"taskId",value:taskId}]);
								$.restPost(doCirculateUrl,userDataWithActors,null,restPostOptions(btnSelf));
							}else{
								enableBtns();
							}
						});
					},
					doRejectToStarter:function(btnSelf,reapprove,params,isAdmin){
						//驳回拟稿人
						var userCommentRes=getUserComment();
						if(!userCommentRes.valid){
							return false;
						}						
						var _params=$.extend({
							taskId:taskId,
							userComment:userCommentRes.userComment
						},params,true);							
						var doRejectUrl=Global.contextPath+"/workflow/process/rejectToStarter";		
						
						var userData={userComment:_params.userComment};
						doRejectUrl=Urls.urlParam(doRejectUrl,[{key:"taskId",value:_params.taskId},{key:"reapprove",value:reapprove}]);
						doRejectUrl=appendDelegatorToUrl(doRejectUrl);
						if(isAdmin){
							doRejectUrl=Urls.urlParam(doRejectUrl,[{key:"_isadmin",value:"1"}]);
						}
						$.restPost(doRejectUrl,userData,null,restPostOptions(btnSelf));
					},
					doRejectToPrevious:function(btnSelf,reapprove){
						//驳回到上一步
						var doRejectUrl=Global.contextPath+"/workflow/process/rejectToPrevious";
						var userCommentRes=getUserComment();
						if(!userCommentRes.valid){
							return false;
						}
						var userComment=userCommentRes.userComment;
						var userData={userComment:userComment};
						doRejectUrl=Urls.urlParam(doRejectUrl,[{key:"taskId",value:taskId},
						                                       {key:"reapprove",value:reapprove}]);
						doRejectUrl=appendDelegatorToUrl(doRejectUrl);
						$.restPost(doRejectUrl,userData,null,restPostOptions(btnSelf));
					},
					doRejectToHistoryAct:function(btnSelf,actInstId,reapprove){
						//驳回到某个历史环节
						var doRejectUrl=Global.contextPath+"/workflow/process/rejectToHistoryAct";
						var userCommentRes=getUserComment();
						if(!userCommentRes.valid){
							return false;
						}
						var userComment=userCommentRes.userComment;
						var userData={userComment:userComment};
						doRejectUrl=Urls.urlParam(doRejectUrl,[{key:"taskId",value:taskId},{key:"actInstId",value:actInstId},
						                                       {key:"reapprove",value:reapprove}]);
						doRejectUrl=appendDelegatorToUrl(doRejectUrl);
						$.restPost(doRejectUrl,userData,null,restPostOptions(btnSelf));
					},
					jumpTo:function(btnSelf,params){
						var _params=$.extend({
							taskId:taskId,
							userComment:'管理员重设流程',
							jumpToAct:'2fb14a4b-1a0f-4393-909a-e21a9856b7d2',
							candidates:[]
						},params,true);	
						var url=Global.contextPath+"/workflow/process/jumpTo";
						url=Urls.urlParam(url,[{key:"taskId",value:_params.taskId},{key:"jumpToAct",value:_params.jumpToAct}]);
						var userDataWithActors={userComment:_params.userComment,candidates:_params.candidates};
						$.restPost(url,userDataWithActors,null,restPostOptions(btnSelf));
					},
					doRead:function(btnSelf){
						//已阅
						var doReadUrl=Global.contextPath+"/workflow/process/read";	
						doReadUrl=Urls.appendParam(doReadUrl,"notifyId",notifyId);
						$.restPost(doReadUrl,{},null,restPostOptions(btnSelf));
					},
					forceEnd:function(btnSelf){
						//作废
						$.messageBox.confirm({message:"该流程将被作废，相关的业务数据及其状态将恢复至流程发起前，确认要作废？",callback:function(isConfirm){
							if(isConfirm){
								var forceEndUrl=Global.contextPath+"/workflow/process/forceEnd";	
								forceEndUrl=Urls.urlParam(forceEndUrl,[{key:"instId",value:instId},{key:"comment",value:"废弃的流程"}]);
								$.restPost(forceEndUrl,{},null,restPostOptions(btnSelf));
							}else{
								enableBtns();
							}
						}});
					},
					forceEndValid:function(btnSelf){
						//流程结束
						$.messageBox.confirm({message:"该流程将被正常结束，相关的业务数据将按有效处理，确认要结束？",callback:function(isConfirm){
							if(isConfirm){
								var forceEndUrl=Global.contextPath+"/workflow/process/finish";	
								forceEndUrl=Urls.urlParam(forceEndUrl,[{key:"instId",value:instId},{key:"comment",value:"正常结束流程"}]);
								$.restPost(forceEndUrl,{},null,restPostOptions(btnSelf));
							}else{
								enableBtns();
							}
						}});
					},
					remind:function(btnSelf){
						//催办
						btnSelf.attr("disabled","disabled").addClass("disabled");
						btnSelf.siblings("button").attr("disabled","disabled").addClass("disabled");
						var doRemindUrl=Global.contextPath+"/workflow/process/remind";
						doRemindUrl=Urls.urlParam(doRemindUrl,[{key:"taskId",value:taskId}]);
						$.openLink(doRemindUrl,{title:"催办提醒"},function(response){
							if(response){
								closeCurWin();
							}
						});
					}
			};
			
			$(".draft button",context).click(function(e){
				e.preventDefault();
				var self=$(this);
				if(self.hasClass("save-draft")){
					var clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.saveDraft(self);
				}else if(self.hasClass("do-draft")){
					var clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doDraft(self);
				}else if(self.hasClass("do-draft-and-sendtoread")){
					var clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.setUserToSendToRead(self);
				}
			});
			
			$(".todo button",context).click(function(e){
				e.preventDefault();
				var self=$(this);
				var clicked=false;
				if(self.hasClass("do-send")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doSend(self);
				}else if(self.hasClass("do-transfer")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doTransfer(self);
				}else if(self.hasClass("do-circulate")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doCirculate(self);
				}else if(self.hasClass("do-setsendtoread")){
					FlowForm.setUserToSendToRead(self);
				}else if(self.hasClass("do-print")){
					FlowForm.doPrint(self);
				}else if(self.hasClass("do-read")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doRead(self);
				}else if(self.hasClass("finish")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.forceEnd(self);
				}else if(self.hasClass("do-remind")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.remind(self);
				}else if(self.hasClass("valid-finish")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.forceEndValid(self);
				}else if(self.hasClass("save-receipt")){
					FlowForm.saveReceipt(self);
				}
			});
			function selectActAndSetUser2(nextAllActivity,userDataWithActors,callcack){
				if($.isArray(nextAllActivity)){
					$.each(nextAllActivity,function(i,act){
						nextAllActivityMap[act.id]=act;
					});
				}
				var selectActToContinue=[];
				var nextAllActivityParams=[];
				var justSetActor=false;
				$.each(nextAllActivity,function(i,act){
					if(act.justSetActor){
						justSetActor=true;
						nextAllActivityParams.push(nextAllActivity[i]);
						//return false;
					}
					if(!justSetActor){
						if(act.displayType==="TrueCheckBox"){
							selectActToContinue.push({name:act.id,parent:act.parentId});
						}else{
							nextAllActivityParams.push(nextAllActivity[i]);
						}
					}
				});
				var chooseActUrl="";
				if(instId){
					chooseActUrl=Global.contextPath+"/workflow/diagram/show?setupAct=1&usetheme=1&istrack=1&instId="+instId;
				}else{
					chooseActUrl=Global.contextPath+"/workflow/diagram/show?setupAct=1&flowId="+procDefId;
				}
				if(justSetActor){
					chooseActUrl=Urls.urlParam(chooseActUrl,[{key:"justsetactor",value:1}]);
				}else{
					chooseActUrl=Urls.urlParam(chooseActUrl,[{key:"justsetactor",value:0}]);
				}
				$.openLink(chooseActUrl,{
					width:1000,height:400,nextAllActivity:nextAllActivityParams,
					procId:businessProcId,taskId:taskId,justSetActor:justSetActor},function(res){
					if(res){
						if(justSetActor){
							userDataWithActors.justSetActorList=res;
						}else{
							if(nextAllActivityMap[res.name].isCountersign){
								flowTypeParamValue=flowType.countersign;
							}
							selectActToContinue.push(res);
							userDataWithActors.nextNamedActors=selectActToContinue;
						}
						if($.isFunction(callcack)){
							callcack(userDataWithActors);
						}
					}else{
						enableBtns();
						return false;
					}
	      		});
			};
			var FlowOpts=workflowManager.FlowOpts={
				setUserToSendToReadOutside:function(callback){
					selectUser(function(cActors){
						if(cActors){
							sendToReadActors=cActors;
							if(jQuery.isFunction(callback)){
								callback(cActors);
							}
						}
						return false;
					},{dept:true,group:true});
				},
				setUserToSendToReadOnlyOutside:function(cActors){
					if(cActors){
						sendToReadActors=cActors;
					}
				},
				setUserToForwardOutside:function(callback){
					selectUser(function(cActors){
						if(cActors){
							forwardActors=cActors;
							if(jQuery.isFunction(callback)){
								callback(cActors);
							}
						}
						return false;
					},{dept:true,group:true});
				},
				setUserToFowardOnlyOutside:function(cActors){
					if(cActors){
						forwardActors=cActors;
					}
				},
				setUserToFowardCountersignTagOutside:function(countersignTag){
					if(countersignTag){
						flowTypeParamValue=flowType.countersign;
					}else{
						flowTypeParamValue=flowType.normal;
					}
				},
				doDraft:function(btnSelf){
					var userDataWithActors={};//params to start process
					function sendDraftToStart(businessData){
						if(sendToReadActors){//if set send to read user
							userDataWithActors.candidates=sendToReadActors;
						}
						if(forwardActors){
							userDataWithActors.forwardCandidates=forwardActors;
						}
						var businessDataId=businessData.id;
						var entityName=businessData['_entity_name_'];
						var procStartUrl=Global.contextPath+"/workflow/process/start";
						var procTitle=$("[name=procTitle]",context).val();
						userDataWithActors.procTitle=procTitle;
						procStartUrl=Urls.urlParam(procStartUrl,[{key:"businessProcId",value:businessProcId},
						                                         {key:"formKey",value:entityName},
						                                         {key:"flowType",value:flowTypeParamValue},
						                                         {key:"businessDataId",value:businessDataId}]);
						$.restPost(procStartUrl,userDataWithActors,function(res){
							if(res){
								CommonUtil.hiddenLoading(100,btnSelf.data("loadingSelector"))
								FlowOpts.refreshCount();
								$.openLink(Global.contextPath+"/workflow/approve/successStart",{showType:"tab",title:"流程提交成功"},function(res){
									TabUtils.closeTab(null,selectedTabId);
								});
							}
						},restPostOptions(btnSelf));
					};
					if(freestyle){//check candidates is not null
						if(!forwardActors){
							$.messageBox.warning({message:"请选择收件人"});
							enableBtns();
							return false;
						}
					}
					//拟稿
					businessForm.save(function(businessData){
						if(freestyle){
							sendDraftToStart(businessData);
							return false;
						}
						var url=Urls.urlParam(nextAllActivityUrl,[{key:"businessProcId",value:businessProcId},
						                                               {key:"businessDataId",value:businessDataId}]);
						$.restGet(url,function(_nextAllActivity){
							nextAllActivity=_nextAllActivity;
							if($.isArray(nextAllActivity)&&((nextAllActivity.length===1&&nextAllActivity[0].canSelectUser)||nextAllActivity.length>1)){
								selectActAndSetUser2(nextAllActivity,userDataWithActors,function(){
									sendDraftToStart(businessData);
								});
							}else{
								sendDraftToStart(businessData);
							}
						});
						
					});
				},
				doSendFreestyle:function(btnSelf){
					var validForm=businessForm.validation();
					if(!validForm){
						return false;
					}
					var url=Global.contextPath+"/workflow/approve/setupParams";
					url=Urls.urlParam(url,[{key:"procId",value:businessProcId},{key:'canCountersign',value:canCountersign}]);
					$.openLink(url,function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:}{contentSelector:$(".cool-opinion-panel",context)}
							var userData={"userComment":res.userComment};
							function doSave(businessData){
								var procApproveUrl=Global.contextPath+"/workflow/process/approve";
								if(res.sendToReadActors){//if set send to read user
									userData.candidates=res.sendToReadActors;
								}
								userData.forwardCandidates=res.forwardActors;
								procApproveUrl=Urls.urlParam(procApproveUrl,[{key:"taskId",value:taskId},  {key:"flowType",value:res.flowType}]);
								procApproveUrl=appendDelegatorToUrl(procApproveUrl);
								$.restPost(procApproveUrl,userData,null,restPostOptions(btnSelf));
							};
							businessForm.save(function(businessData){
								doSave(businessData);
							});
						}else{
							enableBtns();
						}
					});
				},
				doSend:function(btnSelf){
					var validForm=businessForm.validation();
					if(!validForm){
						return false;
					}
					var url=Global.contextPath+"/workflow/approve/setupParams";
					url=Urls.urlParam(url,[{key:"todoTaskId",value:taskId},{key:"procId",value:businessProcId},{key:'hideForward',value:true}]);
					$.openLink(url,function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:}{contentSelector:$(".cool-opinion-panel",context)}
							var userData={"userComment":res.userComment};
							function doSave(businessData){
								var procApproveUrl=Global.contextPath+"/workflow/process/approve";
								if(res.sendToReadActors){//if set send to read user
									userData.candidates=res.sendToReadActors;
								}
								procApproveUrl=Urls.urlParam(procApproveUrl,[{key:"taskId",value:taskId},  {key:"flowType",value:flowTypeParamValue}]);
								procApproveUrl=appendDelegatorToUrl(procApproveUrl);
								$.restPost(procApproveUrl,userData,null,restPostOptions(btnSelf));
							};
							businessForm.save(function(businessData){
								var url=Urls.urlParam(nextAllActivityUrl,[{key:"taskId",value:taskId},
								                                          {key:"businessProcId",value:businessProcId},
							                                               {key:"businessDataId",value:businessDataId}]);
								$.restGet(url,function(_nextAllActivity){
									nextAllActivity=_nextAllActivity;
									if($.isArray(nextAllActivity)&&((nextAllActivity.length===1&&nextAllActivity[0].canSelectUser)||nextAllActivity.length>1)){
										selectActAndSetUser2(nextAllActivity,userData,function(){
											doSave(businessData);
										});
									}else{
										doSave(businessData);
									}
								});
							});
						}else{
							enableBtns();
						}
					});
				},
				doReplyFreestyle:function(btnSelf){//replyActor
					var validForm=businessForm.validation();
					if(!validForm){
						return false;
					}
					var url=Global.contextPath+"/workflow/approve/setupParams";
					url=Urls.urlParam(url,[{key:"procId",value:businessProcId},{key:'canCountersign',value:false},{key:'canSetForward',value:false}]);
					$.openLink(url,{replyActor:replyActor},function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:}{contentSelector:$(".cool-opinion-panel",context)}
							var userData={"userComment":res.userComment};
							function doSave(businessData){
								var procApproveUrl=Global.contextPath+"/workflow/process/approve";
								if(res.sendToReadActors){//if set send to read user
									userData.candidates=res.sendToReadActors;
								}
								userData.forwardCandidates=replyActor;
								procApproveUrl=Urls.urlParam(procApproveUrl,[{key:"taskId",value:taskId},  {key:"flowType",value:res.flowType}]);
								procApproveUrl=appendDelegatorToUrl(procApproveUrl);
								$.restPost(procApproveUrl,userData,null,restPostOptions(btnSelf));
							};
							businessForm.save(function(businessData){
								doSave(businessData);
							});
						}else{
							enableBtns();
						}
					});
				},
				forceEndValid:function(btnSelf,contersignInner){
					var validForm=businessForm.validation();
					if(!validForm){
						return false;
					}
					var url=Global.contextPath+"/workflow/approve/setupParams";
					var _params=[{key:"procId",value:businessProcId},{key:'canCountersign',value:false},{key:'canSetForward',value:false},{key:'hideForward',value:true},{key:"flowType",value:flowType.finish}];
					_params.push({key:"contersignInner",value:contersignInner?1:0});
					url=Urls.urlParam(url,_params);
					$.openLink(url,function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:}{contentSelector:$(".cool-opinion-panel",context)}
							var userData={"userComment":res.userComment};
							function doSave(businessData){
								var procApproveUrl=Global.contextPath+"/workflow/process/approve";
								if(res.sendToReadActors){//if set send to read user
									userData.candidates=res.sendToReadActors;
								}
								procApproveUrl=Urls.urlParam(procApproveUrl,[{key:"taskId",value:taskId}, {key:"flowType",value:flowType.finish}]);
								procApproveUrl=appendDelegatorToUrl(procApproveUrl);
								$.restPost(procApproveUrl,userData,null,restPostOptions(btnSelf));
							};
							businessForm.save(function(businessData){
								doSave(businessData);
							});
						}else{
							enableBtns();
						}
					});
				},
				doReject:function(btnSelf){
					var url=Global.contextPath+"/workflow/approve/setupParams";
					url=Urls.urlParam(url,[{key:"taskId",value:taskId},{key:"procId",value:businessProcId},{key:'reject',value:true},{key:'hideForward',value:true}]);
					$.openLink(url,function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:,transferActors:,rejectAct:}
							//驳回到某个历史环节
							var doRejectUrl=Global.contextPath+"/workflow/process/rejectToHistoryAct";
							var userData={userComment:res.userComment,candidates:res.sendToReadActors};
							doRejectUrl=Urls.urlParam(doRejectUrl,[{key:"taskId",value:taskId},{key:"actInstId",value:res.rejectAct},
							                                       {key:"reapprove",value:1}]);
							doRejectUrl=appendDelegatorToUrl(doRejectUrl);
							$.restPost(doRejectUrl,userData,null,restPostOptions(btnSelf));
						}else{
							enableBtns();
						}
					});
					
				},
				doTransfer:function(btnSelf){
					var url=Global.contextPath+"/workflow/approve/setupParams";
					url=Urls.urlParam(url,[{key:"procId",value:businessProcId},{key:'transfer',value:true},{key:'hideForward',value:true}]);
					$.openLink(url,function(res){
						if(res){//{sendToReadActors:,forwardActors:,userComment:,flowType:,transferActors:}
							var userData={"userComment":res.userComment,forwardCandidates:res.transferActors,candidates:res.sendToReadActors};
							var doTransferUrl=Global.contextPath+"/workflow/process/transfer";					
							doTransferUrl=Urls.urlParam(doTransferUrl,[{key:"taskId",value:taskId}]);
							doTransferUrl=appendDelegatorToUrl(doTransferUrl);
							$.restPost(doTransferUrl,userData,null,restPostOptions(btnSelf));
						}else{
							enableBtns();
						}
					});
				},
				refreshCount:function(){
					$(context).closest(".my-task-top-con").trigger("refreshCount");
				}
			};
			$(".draft-cool button",context).click(function(e){
				e.preventDefault();
				var self=$(this);
				if(self.hasClass("save-draft")){
					var clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.saveDraft(self);
				}else if(self.hasClass("do-draft")){
					var clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doDraft(self);
				}
			});
			$(".freestyle-todo-cool button",context).click(function(e){
				e.preventDefault();
				var self=$(this);
				var clicked=false;
				if(self.hasClass("do-send")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doSendFreestyle(self);
				}else if(self.hasClass("do-reply")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doReplyFreestyle(self);
				}else if(self.hasClass("do-finish")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.forceEndValid(self,false);
				}else if(self.hasClass("do-finish-countersign")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.forceEndValid(self,true);
				}else if(self.hasClass("do-read")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doRead(self);
				}else if(self.hasClass("valid-finish")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.forceEndValid(self);
				}else if(self.hasClass("do-circulate")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doCirculate(self);
				}
			});
			$(".todo-cool button",context).click(function(e){
				e.preventDefault();
				var self=$(this);
				var clicked=false;
				if(self.hasClass("do-send")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doSend(self);
				}else if(self.hasClass("do-read")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doRead(self);
				}else if(self.hasClass("reject")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doReject(self);
				}else if(self.hasClass("do-transfer")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowOpts.doTransfer(self);
				}else if(self.hasClass("valid-finish")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.forceEndValid(self);
				}else if(self.hasClass("do-circulate")){
					clicked=disableBtns(self);
					if(clicked){
						return false;
					}
					FlowForm.doCirculate(self);
				}
			});
			
			return workflowManager;
		}
};
});
