;(function($){
	/**
	 * 在Page.init中初始化form的事件,Page.init(context,{eventName:function(){....     }});
	 * 事件：
	 * beforeSerialize参数：(jqForm,options)
	 * beforeSubmit参数：(arr, jqForm, options)
	 * complete参数:(xhr,textStatus)
	 * successHandlers参数:(responseData, statusText, xhr,jqForm)
	 * error参数:(xhr,textStatus)
	 * completeHandlers参数:(xhr,textStatus,jForm)
	 */
	window.Form={
			init:function(context,opts){
				var options=$.extend({
					extendContext:true
				},opts);
				var ___context=$(context);
				if(options.extendContext && $(context).closest(".ui-dialog-wrapper").length>0){
					___context=$(context).closest(".ui-dialog-wrapper");
				}
				
				if(___context.length<1){
					___context=context;
				}
				Form.setReadonlyFieldStyle(___context);
				Form.restFormInit(___context,options);
				Form.ajaxFormInit(___context,options);
				
				if($(".closeBtn",___context) && $(".closeBtn",___context).length>0){
					$(".closeBtn",___context).click(function(){
						$(context).dialogClose(null);
					});
				}
				
				if($(".refresh",___context).length>0){
					$(".refresh",___context).click(function(){
						TabUtils.reloadTab();
					});
				}
			},
			restFormInit:function(context,options){
				//将Form的数据序列化成Join，通过Rest方式Post表单数据
				if($(".ajaxPostBtn",context) && $(".ajaxPostBtn",context).length>0){
					var formCtx=$("form",context);
					$(".ajaxPostBtn",context).click(function(){
						var btnSelf=$(this);
						var valInfo = $.validation.validate(formCtx) ;
						if( valInfo.isError ) {
							return false;
						}
						if($(formCtx) && $(formCtx).data("onsubmit")){
							var isOk=$(formCtx).data("onsubmit")();
							if(isOk==false){
								return;
							}
						}
						
						var url=$(formCtx).attr("action");
						var data=$(formCtx).toJson();
						
						jQuery.restPost(url,data,
							function(response){
								var onFormCallback = CommonUtil.parseFunc($(formCtx,context),"data-callback");
								if(onFormCallback){
									onFormCallback();
								}
								if(btnSelf.closest(".ui-dialog").length>0){
									formCtx.dialogClose(response);
								}
							},
							{	
								beforeSend:function(xhr){
									CommonUtil.showLoading(context,i18n.t("common.submiting"));
									btnSelf.attr("disabled","disabled");
									btnSelf.addClass("disabled");
								},
								complete:function(xhr,textStatus){
									CommonUtil.hiddenLoading();
									btnSelf.removeAttr("disabled");
									btnSelf.removeClass("disabled");
								}
							});
					});
				}
			},		
			ajaxFormInit:function(context,options){
				//以ajax方式模拟form的Post，提交表单
				Form.wrapAjaxForm(context,options);	
				
				//处理Tab页面顶部菜单保存
				function saveAll(){
					var valInfo = $.validation.validate($("form",context)) ;
					if( valInfo.isError ) {
						return false;
					}
					Form.multiAjaxSubmit($("form",context),{
				    	before:function(){
							$("#saveBaseInfo",context).attr("disabled","disabled");
							CommonUtil.showLoading(context,i18n.t("common.submiting"));
						},
						complete:function(){
							$("#saveBaseInfo",context).removeAttr("disabled");
							CommonUtil.hiddenLoading();
						}
					});
				};
				$("#saveBaseInfo",context).click(function(){
					var container=$(context);
					var form=container.find("form");
					if(form.length>0){
						saveAll();
					}
					return false;
				});		
			},
			setReadonlyFieldStyle:function(context){
				$(":input[readonly]").each(function(){
					$(this).addClass("disabled");
					$(this).focus(function(){
						$(this).blur();
					});
				});
			},
			resetForm:function(form){
				$(form).resetForm();
			},
			storePreVal:function(formFiled){
				$(formFiled).data("preVal",$(formFiled).val());
			},
			getPreVal:function(formFiled){
				return $(formFiled).data("preVal");
			},
			validateForm:function(jqForm){
				var pass=true;
				var valInfo = $.validation.validate(jqForm) ;
				if( valInfo.isError ) {
					pass=false;
				}
				return pass;
			},
			wrapAjaxForm:function(context,options) {
				if(!context){
					context=document;
				}
				$("form.ajaxpost",context).each(function(){
					var $form=$(this);
					$form.ajaxForm(Form.extendOption(options,$form));
				});
			},

			multiAjaxSubmit:function(jqForms,options){
				var length=$(jqForms).length;
				if(length<1){
					return;
				}
				
				if(options && options.before){
					options.before();
				}
				$(jqForms).each(function(i,domEle){
					var extendOp=Form.extendOption({
						isInMutiSubmit:true,
						complete:function(xhr,textStatus){
							length=length-1;
							if(length===0){
								if(options && options.complete){
									options.complete(xhr,textStatus);
								}
							}
						}	
					},$(this));	
					$(this).ajaxSubmit(extendOp);
				});
			},
			
			bindClickForDialog : function(context){
				var $parent = $(context).parent();
				if($parent.hasClass("ui-dialog-content")){
					$parent = $parent.parent(".ui-dialog");
					$parent.find(".btn-ok").click(function(){
						var form = $parent.find("form");
						if(form && form.length > 0){
							Form.multiAjaxSubmit(form);	
						} else {
							$parent.children("div:first").dialogClose();
						}
					});
				}
			},
			
			extendOption:function(exOptions,jForm){
				var successHandlers=new Array();
				var beforeSubmitHandlers=new Array();
				var beforeSerializeHandlers=new Array();
				var completeHandlers=new Array();

				var options=$.fn.extend(true,{
					dataType:"json",
					ignorefile:true,
					isInMutiSubmit:false,
					businessException:Form._businessException
				},exOptions);
					
				beforeSubmitHandlers.push(Form._beforeSubmit);

				if(jForm && jForm.data("onsubmit")){
					beforeSubmitHandlers.push(jForm.data("onsubmit"));
				}
				if(jForm && jForm.attr("onsubmit")){	
					var onsubmitFunc=CommonUtil.parseFunc(jForm,"onsubmit");
					beforeSubmitHandlers.push(onsubmitFunc);
					jForm.data("onsubmit",onsubmitFunc);
					$(jForm).removeAttr("onsubmit");
				}
				if(options.beforeSubmit){
					beforeSubmitHandlers.push(options.beforeSubmit);
				}
						
				completeHandlers.push(Form._complete);
				if(options.complete){
					completeHandlers.push(options.complete);
				}
				
				if(!options.isInMutiSubmit){
					beforeSubmitHandlers.push(function(){CommonUtil.showLoading(jForm,i18n.t("common.submiting"));});
					completeHandlers.push(function(){CommonUtil.hiddenLoading();});
				}		
				successHandlers.push(Form._success);
				if(options.success){
					successHandlers.push(options.success);
				}
				
				beforeSerializeHandlers.push(function(jqForm,option){
					var isOk=true;
					//富文本编辑器内容同步
					$("textarea[data-widget]",jqForm).each(function(){
						var editor=$(this).data("ueditor");
						if(editor){
							editor.sync();
						}
					});
					if(jqForm && jqForm.data("beforeSerialize")){
						var beforeSerializeHandler=jqForm.data("beforeSerialize");
						if($.isFunction(beforeSerializeHandler)){
							isOk=beforeSerializeHandler(jqForm,option);
						}
					}
					return isOk;
				});
				if(options.beforeSerialize){
					beforeSerializeHandlers.push(options.beforeSerialize);
				}
						
				if(!options.error){
					options.error=Form._error;
				}	
				
				options.beforeSerialize=function(jqForm,option){
					var isOk=true;
					if($.isFunction(options.beforeValidate)){
						isOk=options.beforeValidate(jqForm, options);
					}
					if(!isOk){
						return false;
					}
					if (!Form.validateForm(jqForm)) {	
						isOk= false;
					}
					if(isOk){
						$.each(beforeSerializeHandlers,function(i){
							if(isOk===false) return false;
							isOk=beforeSerializeHandlers[i](jqForm, options);
						});			
					}
					jqForm.trigger("afterSerialize",isOk);
					return isOk;
				};
				
				options.complete=function(xhr,textStatus){
					$.each(completeHandlers,function(i){
						completeHandlers[i](xhr,textStatus,jForm);
					});			
				};
				
				options.beforeSubmit=function(arr, jqForm, options){
					var isOk=true;
					$.each(beforeSubmitHandlers,function(i){
						if(isOk===false) return false;
						isOk=beforeSubmitHandlers[i](arr, jqForm, options);
					});
					if(isOk===false){
						options.complete(null,null);
					}
					return isOk;
				};
				
				options.success=function(responseData, statusText, xhr,jqForm){
					if(responseData.returnCode && responseData.returnCode!=200){
						//500错误
						options.error(xhr,responseData.returnCode,responseData);
						return;
					}
					if(false===responseData.isValid){
						//逻辑业务验证
						options.businessException(responseData,jqForm);				
					}else{
						//成功
						var successCallback=jqForm.data("success");
						if($.isFunction(successCallback)){
							successCallback(responseData);
						}
						$.each(successHandlers,function(i){
							successHandlers[i](responseData, statusText, xhr,jqForm);
						});
						if($(jForm).closest(".ui-dialog").length>0){
							$(jForm).dialogClose(responseData);
						}
					}
				};
			
				return options;
			},	
			
			_success:function(responseData, statusText, xhr,jqForm) {	
				var onFormCallback = CommonUtil.parseFunc($(jqForm),"data-callback");
				if (onFormCallback != null){
					onFormCallback(responseData, statusText, xhr,jqForm);
				}
				$(jqForm).trigger({type:"callback",
					responseData:responseData,
					statusText:statusText, 
					xhr:xhr,
					jqForm:jqForm
				});
			},
			
			_beforeSubmit:function(arr,jqForm, options){
				var context=$(jqForm).closest(".ui-dialog");
				if(!context){
					context=$(jqForm);
				}
				context.find("input:submit").attr("disabled",	"disabled");		
				context.find("button[type=submit]").attr("disabled",	"disabled");		
				context.find(".btn.submit").attr("disabled",	"disabled");
				$(".validation-error-input",jqForm).removeClass("validation-error-input");
				$(".validation-error-info",jqForm).remove();
			},
			
			_error:function(xhr, textStatus, errorThrown){
				try{
					if(xhr.status=="404"){
						CommonUtil.showError(i18n.t("ajax.urlNotExist"));
						return;
					}
					CommonUtil.showJsonError(xhr,null);
				}catch(ex){
					CommonUtil.showError(xhr.responseText);
				}
				
			},
			
			_complete:function(xhr,textStatus,jqForm){
				var context;
				if(!jqForm){
					context=$("body");
				}else{
					context=$(jqForm).closest(".ui-dialog");
					if(!context){
						context=$(jqForm);
					}
				}
				context.find("input:submit").removeAttr("disabled");		
				context.find("button[type=submit]").removeAttr("disabled");		
				context.find(".btn.submit").removeAttr("disabled");		
			},
			
			_businessException:function(responseData,jqForm){
				if(!responseData.errors){
					return;
				}
				var noFieldErrMsg="";
				$.each(responseData.errors,function(key,value){
					var formField= $(jqForm).find(":input[name="+key+"]");
					if(formField.length>0){
						var preStatus=formField.parent().addClass("error").find(".tipsy-error");
						preStatus.remove();
						formField.attr("errorinfo",value);
						formField.after("<span class='tipsy-container tipsy-error'></span>");
						formField.after("<span class='tipsy-error'>"+value+"</span>");
					}else{
						noFieldErrMsg+="<li>"+value+"</li>";
					}
				});
			}
		};
}(jQuery));
