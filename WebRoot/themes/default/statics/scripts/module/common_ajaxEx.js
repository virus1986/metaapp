jQuery.simpleRequest = function(params) {
	var requestParams=$.extend({
		async:true,
		type:"post",
		isShowLoading:true,
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
	
	$.ajax(requestParams);
};
jQuery.restAjax = function(restUrl, data, callback, reqParams) {
	callback = callback || {};
	data = data || {};
	data=JSON.stringify(data);
	reqParams = reqParams || {};
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
;(function($){
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
				CommonUtil.showLoading(null,i18n.t("common.processing"));
			}
		};	
		function complete(xhr, textStatus,options){
			CommonUtil.hiddenLoading();
		};
	};
}(jQuery));
//override kissu common.js ajax defaultErrorHandler
jQuery.request.defaultErrorHandler =  function(xhr, textStatus, errorThrown,options){
	CommonUtil.showJsonError(xhr,options);
};
var CommonLoader = {
		// 加载html页面到指定id的区域
		loadData : function(container, url, _data, _callback,_params) {
			var data=null;
			var callback=_callback;
			var params=_params;
			if($.isFunction(_data)){
				callback=_data;
				params=_callback;
			}else{
				data=_data;
			}
			var options={
					type : "GET",
					url : url,
					cache : false,
					data : data,
					isShowLoading:true,
					success : function(html) {
						if (!!container) {
							$(container).html(html);
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
				success:function(resp){
					$(viewContainer).replaceWith($(resp));
					if(callback){
						callback();
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					$(viewContainer)
							.html("<div style='z-index:99999;' class=\"ajaxError\">" +
									"<a href=\"javascript:CommonLoader.reloadView('#"+ $(viewContainer).attr("id")+"','"+url+"');\">"+i18n.t("error.loadError")+"</a>。<div>");
				}
			});
		}
	};