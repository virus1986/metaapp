define(["require"],function(require){
	return {
		createNew:function(_options){
			var $=jQuery;
			var processConfigManager={};
			var context = _options.context;
			var action=_options.action;
			var eventConfig=_options.eventConfig;
			var $closeBtn=$(".closeBtn",context);
			if($closeBtn.length===0){
				$closeBtn=$(context).closest(".ui-dialog").find(".ui-dialog-buttonpane .closeBtn");
			}
			$closeBtn.click(function(){
				$(context).dialogClose();
			});
			function bDataForLink(){
				var businessData={};
				var toType=$("[name=toType]",context).val();
				var title=$("[name=title]",context).val();
				if(!toType){
					$.messageBox.warning({message:"请选择消息接受人"});
					return false;
				}
				businessData.toType=toType;
				businessData.title=title;
				return businessData;
			};
			function bDataForBean(){
				var businessData={};
				var beanName=$("[name=beanName]",context).val();
				if(!beanName){
					$.messageBox.warning({message:"请填写bean名称"});
					return false;
				}
				businessData.beanName=beanName;
				return businessData;
			};
			function bDataForScript(){
				var businessData={};
				var script=$("[name=script]",context).val();
				if(!script){
					$.messageBox.warning({message:"脚本不可以为空"});
					return false;
				}
				businessData.script=script;
				return businessData;
			};
			function bData(eOperation){
				if(eOperation==="link"){
					return bDataForLink();
				}else if(eOperation==="bean"){
					return bDataForBean();
				}else if(eOperation==="script"){
					return bDataForScript();
				}
			};
			var $saveBtn=$(".saveEvent",context);
			if($saveBtn.length===0){
				$saveBtn=$(context).closest(".ui-dialog").find(".ui-dialog-buttonpane .saveEvent");
			}
			$saveBtn.click(function(){
				var valInfo = $.validation.validate($("form",context)) ;
				if( valInfo.isError ) {
					return false;
				}
				var processE=null;
				var eName=$("[name=eName]:checked",context).val();
				var eOperation=$("[name=eOperation]:checked",context).val();
				var businessData=bData(eOperation);
				if(!businessData){
					return false;
				}
				$(context).dialogClose({eName:eName,eOperation:eOperation,businessData:businessData});
			});
			$(".e-operation-config",context).hide();
			$("[name=eOperation]",context).change(function(){
				var v=$("[name=eOperation]:checked",context).val();
				var showClass="."+v;
				var $hides=$(".e-operation-config",context).not(showClass);
				$(showClass,context).show();
				$hides.hide();
			});
			
			$("[name='select-common-script']",context).change(function(){
				var v=$(this).val();
				var $scriptDom=$("[name=script]",context);
				if(v==="updateEntity"){
					$scriptDom.val('${\n$dao.update($entity);\n}');
				}
			});
			function setBData(eventConfig){
				var eOperation=eventConfig.eventOperation;
				var bData=eventConfig.businessData;
				if(eOperation==="link"){
					$("[name=toType]",context).val(bData.toType);
					$("[name=title]",context).val(bData.title);
				}else if(eOperation==="bean"){
					$("[name=beanName]",context).val(bData.beanName);
				}else if(eOperation==="script"){
					$("[name=script]",context).val(bData.script);
				}
			};
			if(action=="EDIT"){
				$("[name=eName][value="+eventConfig.eventType+"]",context).attr("checked","checked");
				$("[name=eName]",context).attr("disabled","disabled");
				$("[name=eOperation][value="+eventConfig.eventOperation+"]",context).attr("checked","checked").attr("disabled","disabled").trigger("change");
				$("[name=eOperation]",context).attr("disabled","disabled");
				setBData(eventConfig);
			}
			return processConfigManager;
		}
	};
});