;(function($){
	jQuery.simpleRequest = function(params) {
		var requestParams=$.extend({
			async:true,
			type:"post",
			cache:false,
			isShowLoading:false,
			success:function(response) {
				if (!!response && typeof response.returnCode != 'undefined'
						&& response.returnCode != 200) {
					if($.isFunction(params.error)){
						params.error(null, response.returnCode, response.error, url);
					}else{
						CommonUtil.showError("Request:"+params.url+"failed! ##Status:"+textStatus);
					}
				}
			}		
		},params,true);
		
		return $.ajax(requestParams);
	};
	jQuery.restAjax = function(restUrl, data, callback, reqParams) {
		callback = callback || {};
		data = data || {};
		reqParams = reqParams || {};
		if(!("application/x-www-form-urlencoded"===reqParams.contentType)){
			data=JSON.stringify(data);
		}
		if(reqParams.type=="get"){
			reqParams.data=null;
		}else{
			reqParams.data = data;
		}
		reqParams.type = reqParams.type || 'post';
		reqParams.url = restUrl ? restUrl : reqParams.url;
		reqParams.dataType = reqParams.dataType ? reqParams.dataType : 'json';
		reqParams.contentType = reqParams.contentType ? reqParams.contentType : 'application/json';
		//process callback
		if (callback.success) {
			reqParams.success = callback.success;
		}

		if (callback.error) {
			reqParams.error = callback.error;
		}

		if (jQuery.isFunction(callback)) {
			reqParams.success = callback;
		}
		jQuery.simpleRequest(reqParams);
	};

	jQuery.restGet=function(restUrl, data, callback,_reqParams){ 
		var __reqParams={type:"get",dataType:"json",contentType:'application/json'};
		var reqParams;
		if(jQuery.isFunction(data)){
			reqParams=$.extend(__reqParams,callback);
			jQuery.restAjax(restUrl, null, data,reqParams);
		}else{
			reqParams=$.extend(__reqParams,_reqParams);
			jQuery.restAjax(restUrl, data, callback,reqParams);
		}
	};

	jQuery.restPost=function(restUrl, data, callback,_reqParams){
		var reqParams=$.extend({type:"post",dataType:"json",contentType:'application/json'},_reqParams);
		if(_reqParams&&_reqParams.button){
			var button=_reqParams.button;
			var context=_reqParams.context||button.closest(".panel")||button.parent().parent();
			var options={
				beforeSend:function(xhr){
					CommonUtil.showLoading(context,i18n.t("common.processing"));
					button.attr("disabled","disabled");
					button.addClass("disabled");
				},
				complete:function(xhr,textStatus){
					CommonUtil.hiddenLoading();
					button.removeAttr("disabled");
					button.removeClass("disabled");
			    }
			};
			reqParams=$.extend(reqParams,options);
		}
		jQuery.restAjax(restUrl, data, callback,reqParams);
	};
	jQuery.formPost=function(restUrl, data, callback,_reqParams){
		var reqParams=$.extend({type:"post",dataType:"json",contentType:'application/x-www-form-urlencoded'},_reqParams);
		jQuery.restAjax(restUrl, data, callback,reqParams);
	};
	jQuery.restPut=function(restUrl, data, callback,_reqParams){
		var reqParams=$.extend({type:"put",dataType:"json",contentType:'application/json'},_reqParams);
		jQuery.restAjax(restUrl, data, callback,reqParams);
	};
	jQuery.restDelete=function(restUrl, data, callback,_reqParams){
		var reqParams=$.extend({type:"delete",dataType:"json",contentType:'application/json'},_reqParams);
		jQuery.restAjax(restUrl, data, callback,reqParams);
	};
	/**
	 * ajax统一异常处理、
	 */
	if($.ajaxSetup){
		var ajaxOption={};
		ajaxOption.beforeSend=function(xhr){
			var options=this;
			beforeSend(xhr,options);
		};		
		ajaxOption.error=function(xhr, textStatus, errorThrown){
			var options=this;
			error(xhr, textStatus, errorThrown,options);
		};		
		ajaxOption.success=function(data, textStatus, jqXHR){
			var options=this;
			success(data, textStatus, jqXHR,options);
		};		
		ajaxOption.complete=function(xhr, textStatus){
			var options=this;
			complete(xhr, textStatus,options);
		};		
		$.ajaxSetup(ajaxOption);
		
		function success(data, textStatus, xhr,options){
			
		};		
		function error(xhr, textStatus, errorThrown,options){
			CommonUtil.showJsonError(xhr,options);
		};		
		function beforeSend(xhr,options){
			if(options.isShowLoading==true){
				CommonUtil.showLoading(null,"");
			}
		};	
		function complete(xhr, textStatus,options){
			if(options.isShowLoading==true){
				CommonUtil.hiddenLoading();
			}
		};
	};
	//override kissu common.js ajax defaultErrorHandler
	if(jQuery.request&&jQuery.request.defaultErrorHandler){
		jQuery.request.defaultErrorHandler =  function(xhr, textStatus, errorThrown,options){
			CommonUtil.showJsonError(xhr,options);
		};
	}
	window.CommonLoader = {
			// 加载html页面到指定id的区域
			loadData : function(container, url, _data, _callback,_params) {
				var data=null;
				var callback=_callback;
				var params=_params||{};
				if($.isFunction(_data)){
					callback=_data;
					params=_callback||{};
				}else{
					data=_data;
				}
				if(params.json){
					params.contentType='application/json';
					data=JSON.stringify(data||{});
				}
				var options={
						type :params.type|| "GET",
						url : url,
						cache : false,
						data : data,
						isShowLoading:false,
						success : function(html) {
							if (!!container) {								
								$(container).html(html);
								//控件初始化
								$(container).uiwidget() ;
								Page.enableUniform(container) ;
							}
							if (callback != null) {
								callback(html);
							}
						}
					};
				options=$.extend(options,params);
				jQuery.simpleRequest(options);
			},
			reloadView:function(viewContainer,url,callback){
				if(!url){
					url = $(viewContainer).attr("url")||$(viewContainer).attr("data-url");
				}
				if(!url || url.length<1){
					return;
				}
				jQuery.simpleRequest({
					url:url,
					type:"get",
					dataType:"html",
					cache:false,
					isShowLoading:false,
					success:function(resp){
						$(viewContainer).replaceWith($(resp));
						if(callback){
							callback();
						}
					},
					error : function(XMLHttpRequest, textStatus, errorThrown) {
						$(viewContainer).html("<div style='z-index:99999;' class=\"ajaxError\">" +"<a href=\"javascript:CommonLoader.reloadView('#"+ $(viewContainer).attr("id")+"','"+url+"');\">"+i18n.t("error.loadError")+"</a>。<div>");
					}
				});
			}
		};
}(jQuery));