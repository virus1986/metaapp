define(["require"],function(require){
	var $=jQuery;
	return {
		createNew:function(_options){
			var workflowManager={};
			var context = _options.context;
			var action = _options.action;
			if("CREATE"===action){
				$('[name=procTitleDef]',context).val('{申请人}_{流程名称}({date:yyyyMMdd}{seq:4})');
				var userjson=_options.userjson;
				if(userjson){
					var $procManagerCon=$(".proc-manager-con",context);
					var ti=$procManagerCon.find("[data-widget='tokeninput']");
					if(ti.data("widgetOverTag")){//token input already initialized
						ti.tokenInput("add", userjson);
					}else{//token input have not initialized,use widgetOver event
						ti.on("widgetOver",function(){
							ti.tokenInput("add", userjson);
						});
					}
				}
			}
			var inputText=$(".select-actor",context).siblings("input#firstStepActorsText");
			var inputId=$(".select-actor",context).siblings("input#firstStepActorsId");
			var ul=$(".select-actor",context).siblings("ul.token-input-list-facebook");
			function rebuildFirstStepActors(users,ul,inputText,inputId,noChangeUl,init){
				if(init){
					users=[];
					var initText=inputText.val();
					var initId=inputId.val();
					if(initId&&initText){
						var ids=initId.split(" ");
						var names=initText.split(" ");
						users=[];
						for(var i=0;i<ids.length;++i){
							if(ids[i]){
								users.push({id:ids[i],text:names[i]||ids[i]});
							}
						}
					}
				}else if(users){
					users=users;
				}else{
					users=[];
					$("li.token-input-token-facebook",ul).each(function(){
						var self=$(this);
						var id=self.data("actorid"),text=self.data("actorname");
						users.push({id:id,text:text});
					});
				}
				if(users&&users.length>0){
					var cActors=[];
					var usrNames="",ids="",tHtml=[];
					for(var i=0;i<users.length;++i){
						var actor={id:users[i].id,name:users[i].text,type:"user"};
						cActors.push(actor);
						ids+=actor.id+"  ";
						usrNames+=actor.name+"  ";
						if(!noChangeUl){
							tHtml.push('<li data-actorname="'+actor.name+'" data-actorid="'+actor.id+'" class="token-input-token-facebook"><p>'+actor.name+'</p><span class="token-input-delete-token-facebook">×</span></li>');
						}
					}	
					inputText.val(usrNames);
					inputId.val(ids);
					if(!noChangeUl){
						ul.html(tHtml.join(""));
					}
					$(".token-input-delete-token-facebook",ul).click(function(){
						$(this).parent().remove();
						rebuildFirstStepActors(null,ul,inputText,inputId,true);
					});
				}else{
					inputText.val("");
					inputId.val("");
					ul.html("");
				}
			};
			if(ul.length===1){//only initialize when first step select actor control exists
				rebuildFirstStepActors(null,ul,inputText,inputId,false,true)
			}
			$(context).on("click",".select-actor",function(e){
				var selectUserUrl=Global.contextPath+"/entities/user/treeList/uamOrganization?view=select_tree_list&refField=orgId&mode=multi";
				$.openLink(selectUserUrl,function(users){
					if(users){
						rebuildFirstStepActors(users,ul,inputText,inputId,false);
					}
				});
			});
			function setFormUrl(res){
				var entityName=res.entityName;
				var name=res.name;
				var url=res.url;
				if(!url){
					url="~/entities/"+entityName+"/form?view="+name;
				}
				$("[name=formUrl]",context).val(url);
				$("[name=entityName]",context).val(res.entityName);
				setFieldDefExpOptions();
			};
			$(context).on("click",".select-workflow-form",function(){
				$.openLink(Global.contextPath+"/entities/metauitemplate/select?view=select_workflow&converter=form_template_workflow&mode=single",{
	        		showType:'pop-up'},function(resp){
	        			if(resp&&resp[0]){
	        				var res=resp[0];
	        				setFormUrl(res);
	        			}
	        		});
			});
			$(context).on("click",".create-workflow-form",function(){
				var formCreateUrl=Global.contextPath+"/metadata/uitemplate/form_create_base_workflow";
				$.openLink(formCreateUrl,{
	        		showType:'pop-up'},function(res){
	        			if(res){
	        				setFormUrl(res);
	        			}
	        		});
			});
			$(context).on("click",".edit-workflow-form",function(){
				var formUrl=$("[name=formUrl]",context).val();
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
				var editFormUrl=Global.contextPath + "/html_editor/?publish=1";
				editFormUrl=Urls.appendParam(editFormUrl,"entityName",entityName);
				editFormUrl=Urls.appendParam(editFormUrl,"viewname",viewName);
				$.openLink(editFormUrl,{
	        		showType:'slide',target:'_'+entityName+'_'+viewName,},function(resp){
	        			
	        		});
			});
			var startPos=undefined;
			$("[name=procTitleDef]",context).click(function(){
				startPos=$("[name=procTitleDef]",context).getCurPos();
			});
			$("[name=procTitleDef]",context).keydown(function(){
				startPos=$("[name=procTitleDef]",context).getCurPos()+1;
			});
			$("select.select-def-exp",context).change(function(){
				var defExp=$(this).val();
				var textArea=$("[name=procTitleDef]",context);
				if(defExp){
					textArea.insertAtCursor(defExp,startPos);
				}
			});
			var loadFields={};
			function setFieldDefExpOptions(){//load entity field for wfprocinst title definition
				var entityName=$("[name=entityName]",context).val();
				var entityFieldsUrl=Global.contextPath+"/metadata/entity/fieldJson";
				if(!entityName){
					var formUrl=$("[name=formUrl]",context).val();
					if(formUrl){
						entityName=formUrl.split("/").length>3?formUrl.split("/")[2]:null;
					}
				}
				if(entityName&&!loadFields[entityName]){
					entityFieldsUrl=Urls.appendParam(entityFieldsUrl,"entity",entityName);
					$.restGet(entityFieldsUrl,function(res){
						if(res&&$.isArray(res)){
							var html=[];
							html.push("<option value=''>--选择--</option>");
							$.each(res,function(i,field){
								html.push("<option value='{form."+field.key+"}'>"+field.value+"</option>");
							});
							$("[name='select-formfield-def-exp']",context).html(html.join());
							loadFields[entityName]=true;
						}
					});
				}
			};
			setFieldDefExpOptions();
			$("input[name=enableDoc]",context).change(function(){
				var dcoTemplateContainer = $(this).closest("tr").find(".docTemplateTd");
				var val = $(this).val();
				if(val==0){
					dcoTemplateContainer.hide();
				}else if (val==1){
					dcoTemplateContainer.show();
				}
			});
			$("input[name=enableDoc]:checked",context).change();
			$(".design-workflow",context).click(function(){
				var procDefId=$("[name=procDefId]",context).val();
				var procId = $("input[name=procId]",context).val();
				var designerUrl=Global.contextPath+"/wfdesigner/editor?profile=p1&flowid="+procDefId;
				designerUrl=Urls.appendParam(designerUrl,"procid",procId);
				$.openLink(designerUrl,{
		   			showType:'slide',target:'designer_'+procDefId},function(res){
			   			if(res){
			   				if(res.procdefid&&res.procdefkey){
			   					var updateUrl=Global.contextPath+"/entities/wfproc/edit?action=EDIT&id="+procId;
			       				$.post(updateUrl,{procId:procId,procDefId:res.procdefid,procDefKey:res.procdefkey},function(res){
			       					$("[name=procDefKey]",context).val(res.procDefKey);
			       					$("[name=procDefId]",context).val(res.procDefId);
			       				});
			   				}
			   			}
		   			});
			});
			$("[data-uneditable]",context).each(function(){
				var uneditable = $(this).attr("data-uneditable");
				if(uneditable && uneditable == "true"){
					/*
					 *间接做到不可编辑，又保留选择的操作 
					 */
					$(this).focus(function(){
						$(this).blur();
					});			
				}
			});
			
		}
	};
});