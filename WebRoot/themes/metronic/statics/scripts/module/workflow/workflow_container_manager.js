define(["require"],function(require){
	var $=jQuery;
	return {
		createNew:function(_options){
			var workflowContainerManager={};
			var options=_options||{};
			var context=options.context;
			var viewId=options.viewId;
			var tabId='#workflow-approve-tab'+viewId;
			var diagramTabliId='workflow-diagram-tabli'+viewId;
			var diagramTabDivId="workflow-runtime-diagram"+viewId;
			var docFrameTabDivId='docFrame'+viewId;
			var procInstId=options.procInstId;
			var procDefId=options.procDefId;
			var businessFormUrl=options.businessFormUrl;
			var businessDataId=options.businessDataId;
			var type=options.type;
			var todoDraft=options.todoDraft;
			var businessProcId=options.businessProcId;
			var docField=options.docField;
			var enableDoc=options.enableDoc;
			
			var diagramShowUrl="";
			if(type!='draft'){
				diagramShowUrl=Global.contextPath+"/workflow/diagram/show?usetheme=1&istrack=1&instId="+procInstId;
			}else{
				diagramShowUrl=Global.contextPath+"/workflow/diagram/show?flowId="+procDefId;
			}

			$(tabId,context).tabs({
				carousel : false,
				cache:true,
				ajaxOptions:{
					cache:false
				},
				load:function(event,ui){
				},
				show:function(event,ui){
					if($(ui.panel).attr("id")===diagramTabDivId&&(!$("#"+diagramTabliId).data("loaded"))){
						CommonLoader.loadData($("#"+diagramTabDivId,context),diagramShowUrl,function(){
						});
						$("#"+diagramTabliId).data("loaded",true);
					}
				}
			});
			CommonLoader.loadData($("#businessFormContainer",context),businessFormUrl,function(){
			});
			
			if(!options.hideAttachment){
				var formAttachmentUrl=Global.contextPath+"/workflow/process/attachment?businessId="+businessDataId+"&type="+type+"&tododraft="+(todoDraft?"1":"0");
				var businessFormAttachmentCon=$("#businessFormAttachment"+",#businessFormAttachment"+viewId,context);
				if(businessFormAttachmentCon.length===1){
					CommonLoader.loadData(businessFormAttachmentCon,formAttachmentUrl,function(){});
				}
			}
			if(!options.isInTab){
				$(".workflow-btns",context).css("top","20px");
			}
			if(enableDoc){
				if($("#"+docFrameTabDivId,context).length===1){
					Page.enableWorkflowDoc(context,docField,"正文",{wfType:type,wfProcId:businessProcId});
				}
			}
			return workflowContainerManager;
		}
	};
});