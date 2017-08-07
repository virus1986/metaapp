//ATTENTION:common.js @deprecated,has separated into little modules

/*
//ajax error common setup
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

jQuery.request.defaultErrorHandler =  function(xhr, textStatus, errorThrown,options){
	CommonUtil.showJsonError(xhr,options);
};

var CommonUtil={
	contains:function(sourceArray,ele){
		if(!sourceArray) {
			sourceArray=[];
		}
		for(var i=0;i<sourceArray.length;++i){
			if(sourceArray[i]===ele){
				return true;
			}
		}
		return false;
	},
	togglePanel:function (id) {
		if ($("#" + id).css("display") == "none") {
			$("#" + id).show();
		} else {
			$("#" + id).hide();
		}
	},
	parseFunc:function (jqEle,attr){
		var func=null;
		var funcStr=$(jqEle).attr(attr);
		if(funcStr=="" || typeof(funcStr)=="undefined"){
			return null;
		}
		if(funcStr.indexOf("(")>0){
			func=new Function(funcStr);
		}else{
			func=window[funcStr];
		}
		return func;				
	},
	showLoading:function(context,msg,autoHideTime){		
		if(!context){
			context=document.body;
		}
		var container=$(context);
		var left=container.width()/2-40;
		var top=container.height()/2;
		if(!msg){
			msg=i18n.t("common.processing");
		}
		var content="<div class='alert alert-info ajaxLoading' style='position:absolute; top:"+top+"px;left:"+left+"px;z-index:19999;display:none;'>";
			content+=msg+"</div>";
		container.append(content);
		$(".ajaxLoading").show();
		if(autoHideTime>0){
			window.setTimeout(function(){
				CommonUtil.hiddenLoading();
			},autoHideTime);
		}
	},
	hiddenLoading:function(timeout){
		if(!timeout){
			timeout=500;
		}
		window.setTimeout(function(){
			$(".ajaxLoading").hide();
			$(".ajaxLoading").remove();
		},timeout);
	},
	showError:function(error){
		if("string"===typeof(error)){
			$.messageBox.error({message:error,width:"800px"});
		}else{
			$.messageBox.error(error);
		}
		CommonUtil.hiddenLoading();
	},
	showJsonError:function(xhr,options){
		if(xhr.status==0){
			return;
		}else if(xhr.status=="404"){
			CommonUtil.showError({message:i18n.t("ajax.urlNotExist"),width:"400px"});
			return;
		}else if(xhr.status=="302"){
			CommonUtil.showError({message:i18n.t("ajax.refreshInfo"),width:"400px"});
			return;
		}else if(xhr.status=="12029"){
			CommonUtil.showError({message:i18n.t("ajax.requestAborted"),width:"400px"});
			return;
		}
		try{
			var jsonExceptionResp=$.parseJSON(xhr.responseText);
			CommonUtil.showError({
				title:i18n.t("error.title"),
				message:i18n.t("error.content",jsonExceptionResp.code,jsonExceptionResp.message,jsonExceptionResp.solution),
				width:"400px"
			});
		}catch(ex){
			CommonUtil.showError("<div style='width:700px;'>"+xhr.responseText+"</div>");
		}	
	},
	showSuccess:function(msg,autoHiden){
		
	},
	hashCode : function(str){
		var hash = 0;
		if (str.length == 0) return hash;
		for (var i = 0; i < str.length; i++) {
			char = str.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash;
		}
		return hash;
	},//$grid,dataFuncAttr,function
	dynRequire:function(sender,dataFuncAttr,callback){
		if(!dataFuncAttr || dataFuncAttr.length<1){
			return;
		}
		var dependencies=new Array();	
		dependencies.push("require");
		var fixPrex="grid";
		var nameSpace="",methodName="",customerFunc=null;
		if(dataFuncAttr.indexOf(".")>0){
			var splitIndex=dataFuncAttr.indexOf(".");
			nameSpace=dataFuncAttr.substring(0,splitIndex);
			methodName=dataFuncAttr.substring(splitIndex+1);
		}else{
			nameSpace=null;
			methodName=dataFuncAttr;
		}
		if(fixPrex==nameSpace){
			customerFunc=sender[methodName];
		}else{
			if(nameSpace!=null){
				dependencies.push(nameSpace);
			}else{
				customerFunc=window[methodName];
			}
		}
		dynRequire(dependencies,function(require,dynModule){
			var context=window;
			if(dynModule && customerFunc==null){
				if($.isFunction(dynModule)){
					customerFunc=dynModule;
				}else{
					customerFunc=dynModule[methodName];
					context=dynModule;
				}
			}
			if(fixPrex==nameSpace){
				context=sender;
			}
			if($.isFunction(callback)){
				callback(customerFunc,context);
			}
		});	
	},
	isEmpty:function(str){
		if(str==null || typeof(str)=="undefined" || str.trim().length<1){
			return true;
		}
		return false;
	},
	formatSizeFromByte: function(size) {
		var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'], level = 0;
		function _loop(size) {
			if(size < 1024) {
				size = Math.round(size * 10) / 10;
				return size + ' ' + unit[level];
			} else {
				level++;
				return _loop(size/1024);
			}
		}
		return _loop(size);
	}
};

(function($){
	String.prototype.endWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substring(this.length - str.length) == str)
			return true;
		else
			return false;
		return true;
	};
	String.prototype.startWith = function(str) {
		if (str == null || str == "" || this.length == 0
				|| str.length > this.length)
			return false;
		if (this.substr(0, str.length) == str)
			return true;
		else
			return false;
		return true;
	};	
})(jQuery);

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
//兼容product管理模块方法
var AjaxRequest={
		send:function(url,option){
			if(!url || url.length<1){
				return;
			}
			var options={};
			options.url=url;
			options.type="get";
			//options.dataType="json";
			options=jQuery.extend(options,option);
			jQuery.simpleRequest(options);
		}
};
var NMDialog={
		initDialogLink:function(context){
			if(!context){
				context=document;
			}
			$("a.dialoglink",context).off("click");
			$("a.dialoglink",context).click(function(){
				var _self=$(this);
				var url=_self.attr("href");
				jQuery.openLink(url,{showType:"pop-up"},function(){
					var returnVal=$.dialogReturnValue();
					var callBack=CommonUtil.parseFunc(_self,"data-callback");
					if(callBack!=null){
						callBack(returnVal);						
					}
				});
				return false;
			});
		}
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
	reloadList:function(listContainer,selectedItem){//列表重新加载方法，listContainer:容器id，selectedItem可选的触发列表行
		url = $(listContainer).attr("url");
		if(!url){
			return;
		}
		CommonLoader.loadData(listContainer, url, null, function() {
					if (selectedItem != "" || selectedItem != null) {
						$(selectedItem+" .detail").trigger('click');
					}
		});
	},
	loadForm:function (container, formObj) {
		CommonLoader.loadData(container, $(formObj).attr("action"), $(formObj).serialize(),function(){});
		return false;
	},
	reloadView:function(viewContainer,url,callback){
		if(!url){
			url = $(viewContainer).attr("url")||$(viewContainer).attr("data-url");
		}
		if(!url){
			return;
		}
		
		AjaxRequest.send(url,{
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
	},	
	loadModelList:function(container) {
		var url = $(container).attr("url")||$(container).attr("data-url");
	
		CommonLoader.loadData(container, url, null, function() {});
	},
	modelListRowAction:function(url) {
		var target = $("tr.model-list-row").find("a").each(function() {
			$(this).unbind('click');
			$(this).bind("click", function(e) {
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				var url = $(this).attr("href");
	
				$("tr.model-list-row").removeClass("current_1");
				var id = $(this).attr("id");
				$(this).parent().parent().addClass("current_1");
				CommonLoader.loadData("#main-content", url, null, function() {
				});
	
				return false;
			});
			$(this).css("cursor", "pointer");
			$(this).hover(function() {
				$(this).css("background", "#fff");
			}, function() {
				$(this).css("background", "");
			});
		});
	}
};
var Table={
		表格删除行后，下面的行name索引全部减去1；
		 * jqObject:jquery对象，当前待删除的对象
		 * indexName：name对应索引的名字，如果name为aa[].bb[].id，bb和aa就是indexName，aa的n=1，bb的n=2
		 * containerType：需要更新的容器类型
		 * n：indexName所在的索引位置
		 
		changeNameIndex:function(jqObject,indexName,containerType,n){
			if(!n){
				n=1;
			}
			var tables=jqObject.nextAll(containerType);
			$.each(tables,function(index,value){
				$.each($(value).find(":input[name*="+indexName+"]"),function(i,v){
					var name=$(v).attr("name");
					var index=Table.getIndex(name,indexName);
					index=index-1;
					var begin=name.indexOf(indexName)+indexName.length+1;
					var end=Table.getTheNIndex(name,n);
					$(v).attr("name",name.substr(0,begin)+index+name.substr(end));
				});
			});
		},
		changeOneNameIndex:function(jqObject,indexName,n){
			if(!n){
				n=1;
			}
			$.each($(jqObject).find(":input[name*="+indexName+"]"),function(i,v){
				var name=$(v).attr("name");
				var index=Table.getIndex(name,indexName);
				index=index-1;
				var begin=name.indexOf(indexName)+indexName.length+1;
				var end=Table.getTheNIndex(name,n);
				$(v).attr("name",name.substr(0,begin)+index+name.substr(end));
			});
			
		},
		getIndex:function(value,indexName){
			var name=value;
			var pattern=new RegExp(indexName+"\\[(\\d*)\\]");
			var matcher=name.match(pattern);
			if(matcher && matcher.length==2){
				var index=matcher[1];
				return index;
			}else{
				return -1;
			}
		},
		getTheNIndex:function(value,n){
			if(n<1){
				return -1;
			}
			var index=value.indexOf("]");
			for(var i=1;i<=n-1;++i){
				var v=value.substr(index+1);
				var idx=v.indexOf("]");
				index=index+idx+1;
			}
			return index;
		}
};

var ValidationEx={
		
		 * 检查当前输入框与当前容器中同一类型的其它数据项是否重复
		 * caller: 一般为输入框
		 * parent: 当前容器
		 * siblingSelector: 同一类型的其它数据项的选择表达式
		 
		chkSiblingDuplicate:function(caller, parent, siblingSelector){
			var count = 0;
			var curValue = $(caller).val();
			$(caller).closest(parent)
				.find(siblingSelector).each(function(){
					if($(this).val() == curValue){
						count++;
					}	
				}
			);
			if(count > 1){
				return {isError: true, errorInfo: i18n.t("error.valueDuplicate")};
			} else {
				return {isError: false};
			}
		}
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
var Urls={
		parseUri:function(uriTemplate,params){//params:[{key:"entityName",value:"33"}]
			for(var i=0;i<params.length;++i){
				var key=params[i].key;
				var value=params[i].value;
				var pattern = new RegExp("\\{"+key+"\\}","gi");
				uriTemplate=uriTemplate.replace(pattern,value);
			}
			return uriTemplate;
		},
	    urlParam:function(url,param){
			if(!url){
				return "";
			}
			if(!param || param.length<1){
				return url;
			}
			var _url= url.indexOf("?")>-1?url+"&":url+"?";
			for(var i=0;i<param.length;++i){
				if(i==0){
					_url+=param[i].key+"="+encodeURIComponent(param[i].value);
				}else{
					_url+="&"+param[i].key+"="+encodeURIComponent(param[i].value);
				}
			}
			return _url; 
		},
		appendParam:function(url,paramName,paramVal){
			if(!paramName){
				return;
			}
			if(paramVal==null || typeof(paramVal)=="undefined"){
				paramVal="";
			}
			var _url= url.indexOf("?")>0?url+"&":url+"?";
			_url+=paramName+"="+encodeURIComponent(paramVal);
			return _url;
		},
		appendDate:function(url){
			return Urls.appendParam(url,"_date",new Date().valueOf());
		}
};

var Page={
	init:function(context,params){
		var $context=$(context);
		if($context.length==0) $context=$("body");
		var initParams=$.extend({
			pageType:"pop-up",
			entityTabs:"entity-tabs",
			isInitForm:false,			
			isInitFormNav:false,
			isInitRelation:false
		},params,true);
		if(initParams.pageType=="in-tab"){
			Page.tabPageInit(context, initParams);
		}else{
			Page.popupPageInit(context, initParams);
		}
	},
	popupPageInit:function(context,params){
		if(params.isInitForm){
			Form.ajaxFormInit(context);
		}
		if(params.isInitFormNav){
			Page.initFormLeftNav(context);
		}
		if(params.isInitRelation){
			Page.initLeftRelation(context);
		}
	},
	tabPageInit:function(context,params){
		if(params.isInitForm){
			Form.ajaxFormInit(context);
		}
		$("#"+params.entityTabs,context).tabs({
			carousel : false,
			cache:true,
			ajaxOptions:{
				cache:false
			},
			show:function(event,ui){
				Page.resizeTabsHeight(context);
			}
		});
		$("#saveBaseInfo",context).click(function(){
			var self=$(this);
			var form=self.closest("form");
			if(form.length>0){
				form.submit();
			}
			return false;
		});		
		$(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *",context)
			.removeClass("ui-corner-all ui-corner-top").addClass("ui-corner-bottom");
		$(".tabs-bottom .ui-tabs-nav",context).appendTo($(".tabs-bottom",context));
		$(window).on("resize",function(){
			Page.resizeTabsHeight(context);
		});
	},
	initFormLeftNav:function(context){
		$('[data-spy="scroll"]',context).each(function(){
			var self=$(this);
			var target=$(self.attr("data-target"),context);
			if(target.length<=0) return;
			var ulObj=$("<ul>").appendTo(target);
			self.find(".form-section").each(function(index){
				var sectionId="ex-section"+index;
				var formSection=$(this);
				var title=formSection.find("caption").text();	
				if(title==""){
					return;
				}
				if(formSection.attr("id")){
					sectionId=formSection.attr("id");
				}else{
					formSection.attr("id",sectionId);
				}
				var liObj=$("<li>").appendTo(ulObj);
				if(index==0){
					liObj.addClass("current");
				}
							
				var aObj=$("<a>",{
					//"href":"#"+sectionId,
					click:function(){
						if($(this).hasClass(".relation-a")){
							self.find("#associateDiv").show();
							self.find(".form-section").hide();
						}else{
							self.find(".form-section").parent().show();
							self.find(".form-section").show();
							self.find("#associateDiv").hide();
						}
						$(this).closest("ul").find("li").each(function(){
							$(this).removeClass("current");							
						});
						$(this).parent("li").addClass("current");
					}
				}).appendTo(liObj).append("<span>"+title+"</span>");
			});
		});	
		
		if($(".form-left li",context).length<=1){
			$(".form-left",context).hide();
			$(".form-right",context).removeClass("span10");
		}else{
			$('[data-spy="scroll"]',context).each(function () {
				var $spy = $(this).scrollspy('refresh');
			});
			$(".form-right",context).css("marginLeft","0px");
		}
	},
	initLeftRelation:function(context){
		var menuExp=$(".dialog-menu-exp",context);
		$("a",menuExp).addClass("relation-a");
		$("a",menuExp).click(function(){
			var url=$(this).attr("href");
			var targetDivId=$(this).attr("target");
			var targetDiv=$(targetDivId,context);
			var associateDiv=targetDiv.find("#associateDiv");
			targetDiv.children().hide();
			if(associateDiv.length==0){
				associateDiv=$("<div/>",{"id":"associateDiv"});
				targetDiv.append(associateDiv);
			}else{
				associateDiv.show();
			}	
			CommonLoader.loadData(associateDiv,url);
			return false;
		});
	},
	fitTabContentSize:function(jTab){
		//Grid高度
		var $tabContainer=$(jTab).closest(".ui-tabs");
		var gridHeight =$tabContainer.height()-140;
		$(".ui-jqgrid",jTab).each(function(i){
			var jqGridId=this.id.substr(5);
			var $jqGrid=$("#"+jqGridId);
			var gridParam=$jqGrid.jqGrid("getGridParam");
			if(gridParam.height=="100%" || gridParam.autoHeight){
				$jqGrid.jqGrid("setGridHeight",gridHeight);
				$jqGrid.jqGrid("setGridParam",{"autoHeight":true});
			}
		});
	},
	resizeTabsHeight:function(context){
		//处理两层Tab嵌套情况下，内层Tab高度自适应的问题，内层Tab高度=外层Tab高度-内层Tab同级元素高度-65（Tab控件导航高度等）
		var $container=$(context);
		if($container.closest(".ui-tabs")){
			window.setTimeout(function(){
				//查找与内层Tab同级其它元素的高度
				var siblingsHeight=0;
				$container.find(".ui-tabs").parent().prevAll().each(function(i,el){
					siblingsHeight+=$(this).height();
				});
				//获取外层tab控件
				var parentContainer=$container.closest(".ui-tabs");
				//设置内层Tab的各个panel高度
				$(".ui-tabs-panel",$container).height(parentContainer.height()-siblingsHeight-65);
			},200);
		}
	},
	gridComplete:function(){
		var $grid=$(this);
		var gridParam=$grid.jqGrid("getGridParam");
		if(gridParam.autowidth){
			window.setTimeout(function(){
				var tabPanelContainer=$grid.closest(".ui-tabs-panel");
				if(tabPanelContainer.length>0){
					Page.fitTabContentSize(tabPanelContainer);
				}
				$grid.jqGrid("setGridWidth",gridParam.width);
				$grid.jqGrid("setGridParam",{autowidth:false});
			},100);
		}
	}
};

var Form={
		initValidator:function(context){
			if(!context){
				context=document;
			}
			$("form",context).each(function(){
				var options=$(this).attr("data-options");
				if(options){
					try{
						eval(" var jsonOptions = "+options) ;;
					}catch(err){
						$(this).validation();
					}
					$(this).validation(jsonOptions);
				}else{
					$(this).validation();
				}
			});
		},
		init:function(context,formCtx){
			var ___context=$(context).closest(".ui-dialog-wrapper");
			if(___context.length<1){
				___context=context;
			}
			if($(".ajaxPostBtn",___context) && $(".ajaxPostBtn",___context).length>0){
				$(".ajaxPostBtn",___context).click(function(){
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
								$(context).dialogClose(response);
							}
							
						},
						{	
							beforeSend:function(xhr){
								CommonUtil.showLoading(context,i18n.t("common.processing"));
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
			
			if($(".closeBtn",___context) && $(".closeBtn",___context).length>0){
				$(".closeBtn",___context).click(function(){
					$(context).dialogClose(null);
				});
			}
			if($("#ReloadCurrentMainTab",___context).length>0){
				$("#ReloadCurrentMainTab",___context).click(function(){
					ReloadCurrentMainTab();
				});
			}
			
			Form.ajaxFormInit(context);
		},

	ajaxFormInit:function(context){
		Form.initValidator(context);
		Form.wrapAjaxForm(context);
		Form.setReadonlyFieldStyle(context);
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
							options.complete();
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
		
		if(!options.error){
			options.error=Form._error;
		}	
		
		options.beforeSerialize=function(jqForm,option){
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
				$.each(successHandlers,function(i){
					successHandlers[i](responseData, statusText, xhr,jqForm);
				});
				$(jForm).dialogClose(responseData);
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
		if (!Form.validateForm(jqForm)) {					
			return false;
		}
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
				formField.addClass("validation-error-input");
				formField.after("<span class='validation-error-info'>"+key+"</span>");			
			}else{
				noFieldErrMsg+="<li>"+key+"</li>";
			}
		});
	}
};

var SelectForm={
	openSelectForm:function(val,input){
		var selectFormUrl=input.attr("data-selecturl");
		var refInputId=input.attr("id").substr(0,input.attr("id").length-5);
		jQuery.openLink(selectFormUrl,{requestType : "GET"},function(){
			var reVal=jQuery.dialogReturnValue();
			if(!reVal) return;
			input.val(reVal[0].text);
			$("#"+refInputId,input.parent().parent()).val(reVal[0].id);
			input.trigger('afterSelectedItem', {'sender': input, 'liEl': null,'selectedItem':reVal[0]});
		});
	}
};

;(function($){
	if($.jgrid){
	$.jgrid.extend({
		initCustom:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				//上下文菜单
				$grid.on("click",".title-field",function(e){
					var target=e.target;
					var rowId=$(target).closest("tr").attr("id");
					$grid.jqGrid("resetSelection");
					$grid.jqGrid("setSelection",rowId);
					if(target.tagName==="A"){
						$grid.viewRecord();
					}else{
						$grid.showContextMenu(e,rowId);
					}
					return false;
				});
				$grid.on("mouseover",".title-field",function(){
					var self=$(this);
					self.find(".pull-right").show();
					self.addClass("contextmenu-over");
				});
				$grid.on("mouseout",".title-field",function(){
					var self=$(this);
					self.removeClass("contextmenu-over");
					self.find(".pull-right").hide();
				});
			});
		},
		initCustToolBar:function(barId,options){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				$("#"+barId).show().appendTo("#t_"+$t.p.id);
				
				//顶部工具栏动作
				$(".table-toolbar-icon li","#"+barId).each(function(){
					var btnSelf=$(this);
					btnSelf.hover(
						function(){
							$(this).addClass("table-img-icon-selected");
						},
						function(){
							$(this).removeClass("table-img-icon-selected");
						}
					);
					
					var dataFuncAttr=btnSelf.attr("data-func");
					CommonUtil.dynRequire($grid,dataFuncAttr,function(func,context){
						btnSelf.on("click",function(){
							if(func==null){
								$.messageBox.info({message:(dataFuncAttr||"")+i18n.t("error.operationUndefined")});
							}else{
								func.call(context,btnSelf,$grid);
							}
						});
					});
				});

				// 搜索
				$(".table-toolbar-search li","#"+barId).click(function(){
					var field= $(this).attr("data-field");	
					$(".current_field","#"+barId).html($(this).text());
					$("input[name=searchField]","#"+barId).val(field);
				});				
				$("input[name=btSingleSearch]","#"+barId).bind("click",function(){
					var field=$("input[name=searchField]","#"+barId).val();
					var op=$("input[name=searchOper]","#"+barId).val();
					var fieldVal=$("input[name=searchString]","#"+barId).val();
					if(!fieldVal || !field){
						$.messageBox.info({message:i18n.t("common.searchInfo")});
						return;
					}
					var sdata={};					
					sdata["searchField"] =field;
					sdata["searchString"] = fieldVal;
					sdata["searchOper"] = op;
					sdata["filters"] = "";
					$grid.quickSearch(sdata);
				});
				$("input[name=searchString]", "#"+barId).keydown(function(event){
					if(event.which == 13){
						$("input[name=btSingleSearch]", "#"+barId).click();
						$("input[name=btMultiSearch]", "#"+barId).click();
					}
				}).keyup(function(event){
					var val = $(this).val();
					if(val == null || val == ""){
						$(".table-icon-refresh a", "#"+barId).click();
					}
				}).focus();
				$(".table-toolbar-search li:first","#"+barId).click();
				//简单查询列表，查询按钮事件绑定
				if($(".searchBtn","#"+barId).length>0){
					$("#"+barId).uiwidget();
					$(".searchBtn","#"+barId).click(function(){
						var queryParamsDom=$("#"+barId).find(":input");
						var rules=[];
						var groups=[];
						for(var i=0;i<queryParamsDom.length;++i){
							var qDom=$(queryParamsDom[i]);
							var name=qDom.attr("name");
							var value=qDom.val();
							var operator=qDom.attr("data-operator")||"cn";
							if(value){
								rules.push({"field":name,"op":operator,"data":value});
							}
						}
						for(var i in queryParams){
							if(typeof(i)=="string"){
								var operator="cn";
								if($("[name='"+i+"']","#"+barId).attr("data-operator")){
									operator=$("[name='"+i+"']","#"+barId).attr("data-operator");
								}
								if(queryParams[i]){
									rules.push({"field":i,"op":operator,"data":queryParams[i]});
								}
							}
						}
						$grid.multiFieldsQuickSearch(rules,"And",groups);
					});
					$(".resetBtn","#"+barId).click(function(){
						$("#"+barId).find(":input").val(null);
						$grid.jqGrid("setGridParam",{search:false});
						$grid.trigger("reloadGrid",[{page:1}]);
					});
				}
				//视图切换
				$(".table-toolbar-search select.switch-view-btn","#"+barId).change(function(){
					var $currentOption=$(this).find("option:selected");
					var url=$currentOption.attr("data-url");
					var title=$currentOption.text();
					$.openLink(url,{showType:'cur-tab',title:title,height:'100%'});
				});
			});
		},
		addRecord : function() {
			return this.each(function() {
				if (!this.grid) return;
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				if($.isFunction(p.onAdd) ) {
					p.onAdd($grid);
					return false;
				}
				var options=$.fn.extend(true,{
					width:800		
				},$grid.getGridParam('addDialogOptions'));
				var createFunc=$grid.getGridParam("createFunc");
				if($.isFunction(createFunc)){
					createFunc($grid);
					return;
				}else if(!CommonUtil.isEmpty(createFunc)){
					CommonUtil.dynRequire($grid,createFunc,function(func,context){
						func.call(context,$grid);
					});
					return;
				}
				var createUrl = $grid.getGridParam("createurl");
				createUrl=Urls.appendDate(createUrl);
				var showType = "pop-up", title = i18n.t("common.new");
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
					}, function() {
							var reVal = jQuery.dialogReturnValue();
							if (reVal == null){
								return;
							}
							var loadOnce=$grid.getGridParam('loadonce');
							if(loadOnce){
								$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
							}else{
								$grid.trigger("reloadGrid");
							}
							if($.isFunction(p.onAfterAdd) ) {
								p.onAfterAdd(reVal);
							}
					});
			});
		},
		delRecord :function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				if($.isFunction(p.onDelete) ) {
					p.onDelete($grid);
					return false;
				}
				var selectIds=$grid.jqGrid('getGridParam','selarrrow');
				if (selectIds.length==0){
					var _selectIdArray=[];
					var _selectId = $grid.jqGrid('getGridParam','selrow');
					if(!_selectId){
						$.messageBox.warning({message:i18n.t("common.deleteInfo")});
						return;
					}
					_selectIdArray.push(_selectId);
					selectIds=_selectIdArray;
				}
				if($.isFunction(p.onBeforeDelete) ) {
					var isOk=p.onBeforeDelete($grid);
					if(!isOk){
						return;
					}
				}
				var deleteFunc=$grid.getGridParam("deleteFunc");
				if($.isFunction(deleteFunc)){
					deleteFunc(selectIds,$grid);
					return;
				}else if(!CommonUtil.isEmpty(deleteFunc)){
					CommonUtil.dynRequire($grid,deleteFunc,function(func,context){
						func.call(context,selectIds,$grid);
					});
					return;
				}
				var delUrl = $grid.getGridParam("deleteurl");
				delUrl=Urls.appendParam(delUrl,"id",selectIds);
				delUrl=Urls.appendDate(delUrl);
				$.messageBox.confirm({
				message:i18n.t("common.deleteConfirm"),
					callback:function(result){
						if(result){
							jQuery.restGet(delUrl,null,function(response){
								if(response==null) return ;
								if(response!=null&&(response.errorMessage)){
									$.messageBox.error({message:response.errorMessage||i18n.t("common.deleteActionError")});
									return;
								}
								if($.isArray(response)&&response[0]&&(response[0].errorMessage)){
									$.messageBox.error({message:response[0].errorMessage||i18n.t("common.deleteActionError")});
									return;
								}
								var loadOnce=$grid.getGridParam('loadonce');
								if(loadOnce){
									$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
								}else{
									$grid.trigger("reloadGrid");
								}
								if($.isFunction(p.onAfterDelete) ) {
									p.onAfterDelete(response);
								}
							});
					}
				}
			});
			});
		},
		editRecord:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				if($.isFunction(p.onEdit) ) {
					p.onEdit($grid);
					return false;
				}
				var options=$.fn.extend(true,{
					width:800			
				},$grid.getGridParam('editDialogOptions'));
				var id = $grid.jqGrid('getGridParam','selrow');
				if (!id){ 											
					$.messageBox.info({message:i18n.t("common.selectRow")});;
					return;
				}
				if($.isFunction(p.onBeforeEdit) ) {
					var isOk=p.onBeforeEdit($grid);
					if(!isOk){
						return;
					}
				}
				var editFunc=$grid.getGridParam("editFunc");
				if($.isFunction(editFunc)){
					editFunc(id,$grid);
					return;
				}else if(!CommonUtil.isEmpty(editFunc)){
					CommonUtil.dynRequire($grid,editFunc,function(func,context){
						func.call(context,id,$grid);
					});
					return;
				}
				var editurl=$grid.getGridParam("editurl");	
				editurl=Urls.appendParam(editurl,"id",id);
				editurl=Urls.appendDate(editurl);
				var showType = "pop-up", title = i18n.t("common.edit");
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
					function(){
						var reVal=jQuery.dialogReturnValue();
						if(reVal==null ) return ;
						var loadOnce=$grid.getGridParam('loadonce');
						if(loadOnce){
							$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
						}else{
							$grid.trigger("reloadGrid");
						}
					}
				) ;
			});
		},
		viewRecord:function(){
			return this.each(function() {
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var id = $grid.jqGrid('getGridParam','selrow');
				if (!id){ 											
					$.messageBox.info({message:i18n.t("common.selectRow")});
					return;
				}
				var viewFunc=$grid.getGridParam("viewFunc");
				if($.isFunction(viewFunc)){
					viewFunc(id,$grid);
					return;
				}else if(!CommonUtil.isEmpty(viewFunc)){
					CommonUtil.dynRequire($grid,viewFunc,function(func,context){
						func.call(context,id,$grid);
					});
					return;
				}
				var viewurl=$grid.getGridParam("viewurl");	
				if(CommonUtil.isEmpty(viewurl)){
					$grid.editRecord();
					return;
				}
				viewurl=Urls.appendParam(viewurl,"id",id);
				viewurl=Urls.appendDate(viewurl);
				var showType = "pop-up", title = i18n.t("common.view");
				var dialogSettings = $grid.getGridParam("viewDialogSettings");
				if(dialogSettings){
					showType = dialogSettings.showType || showType;
					title = dialogSettings.caption || title;
				}
				$.openLink(viewurl,{
					showType: showType,
					width:800,
					title:title,
					iframe:false,requestType:"GET",data:{}}
				,null) ;
			});
		},
		addRelation:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var customSettings=$grid.jqGrid('getGridParam','customSettings');
				if(!customSettings.refSelectUrl){
					$.messageBox.warning({message:i18n.t("relation.objextNotSetSelectList")});
					return;
				}
				var selectUrl=customSettings.refSelectUrl;
				var relationCreateUrl=customSettings.relationCreateUrl;
				$.openLink(selectUrl, {
					requestType : "GET",
					data :customSettings.refEntityId
					},function(resp){
						if(!resp) return;
						var ids="";
						$.each(resp,function(i,item){
							ids+=item.id+",";
						});
						if(ids.length>0){
							ids=ids.substr(0,ids.length-1);
						}
						relationCreateUrl=Urls.appendParam(relationCreateUrl, "id", ids);
						jQuery.restGet(relationCreateUrl,null,function(resp){
							if(!resp) return;
							$grid.trigger("reloadGrid");
						});
				});
			});
		},	
		exportGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t);
				var id = 'temp_' + $grid.getGridParam("id");
				var entity = $grid.getGridParam("entityName");
				var url = Global.contextPath + '/entities/' + entity + '/export-records';
				window[id] = $grid;
				$.openLink(url, {
					data: {
						gridId: id	
					}
				});
			});
		},
		 用于导出实体的xml文件 
		exportEntity:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t), entity = $grid.data("entity");
				if(entity == null){
					entity = $grid.jqGrid("getGridParam", "selarrrow");
					if(entity.length <= 0){
						$.messageBox.warning({
							message:i18n.t("tool.selectEntityToExport")});
						return ;
					}
				}
				if($.isArray(entity)) entity = entity.join(',');
				$.openLink(Global.contextPath + '/metadata/entity/exportEntity/guide', {data: {
					entity: entity
				}});
			});
		},
		 导入Excel文件中的数据 
		importData:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t);
				var id = 'temp_' + $grid.getGridParam("id");
				var entity = $grid.getGridParam("entityName");
				var url = Global.contextPath + '/entities/' + entity + '/import';
				$.openLink(url, {
					data: {
						gridId: id	
					}},
					function(){
						var reVal=jQuery.dialogReturnValue();
						if(reVal==null ) return ;
						$grid.trigger("reloadGrid");
					});
			});
		},
		refreshGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				var sdata={};
				$t.p.search = false;		
				if(p.multipleSearch===false) {
					sdata[p.sField] = sdata[p.sValue] = sdata[p.sOper] = "";
				} else {
					sdata[p.sFilter] = "";
				}
				$.extend($t.p.postData,sdata);
				$($t).triggerHandler("jqGridFilterReset");
				if($.isFunction(p.onReset) ) {
					p.onReset.call($t);
				}
				var loadOnce=$grid.getGridParam('loadonce');
				if(loadOnce){
					$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
				}else{
					$grid.trigger("reloadGrid");
				}
				return false;
			});
		},
		advanceSearch:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $this = this, $grid=$($this), id = this.id, cache = AdvanceSearch.configCache[id];
//				$grid.searchGrid($grid.getGridParam('searchDialogOptions'));return;
				var entityName = this.p.entityName, joinEntities = this.p.joinEntities;
				$.openLink(Global.contextPath + "/advance_search", {
					data : {
						entity : entityName,
						joinEntities: joinEntities,
						initJson: JSON.stringify(cache)
					} 
				}, function(res){
					if(res) {
						AdvanceSearch.configCache[id] = res;
						$this.p.search = true;
						$.extend($this.p.postData,{
							filters: JSON.stringify(res),
							searchField: '',
							searchOper: '',
							searchString: ''
						});
						$($this).triggerHandler("jqGridFilterSearch");
						$($this).trigger("reloadGrid",[{page:1}]);
					}
				});
			});
		},
		filterGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				$.messageBox.info({message:i18n.t("tool.functionNotFinished")});
			});
		},
		quickSearch:function(sdata){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				$t.p.search = true;
				$.extend($t.p.postData,sdata);
				$($t).triggerHandler("jqGridFilterSearch");
				if($.isFunction(p.onSearch) ) {
					p.onSearch.call($t);
				}
				$($t).trigger("reloadGrid",[{page:1}]);
			});
		},//rules":[{"field":"orderTime","op":"le","data":endTime}];
		//groupOp:AND 或 OR
		multiFieldsQuickSearch:function(rules,groupOp,groups){
			//仅支持并列各个字段查询
			rules=rules||[];
			groupOp=groupOp||"AND";
			if(groupOp=='or'||groupOp=='OR'){
				groupOp="OR";
			}else{
				groupOp="AND";
			}
			if(!groups) groups=[];
			var filters={"groupOp":groupOp,"rules":rules,"groups":groups};
			var filtersJson=JSON.stringify(filters);
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				var sdata={filters:filtersJson};
				$.extend($t.p.postData,sdata);
				$t.p.search = true;
				$($t).trigger("reloadGrid",[{page:1}]);
			});
		},
		showContextMenu:function(evt,rowId){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var option = {width: 100, items: []}; 
				var contextBtns=$grid.jqGrid('getGridParam','contextButtons');
				if(contextBtns!=null && contextBtns.length>0){
					$.each(contextBtns,function(i,item){
						option.items.push({
							text:item.text,
							icon:window.Global.iconPath+item.buttonIcon,
							action:function(){
								CommonUtil.dynRequire($grid,item.onClick,function(func,context){
									func.call(context,rowId,$grid);
								});
							}
						});
					});
				}
				var custMenus;
				if($.isFunction($t.p.exContextMenu) ) {
					custMenus=$t.p.exContextMenu($grid);
				}else{
					custMenus=$grid.jqGrid('getGridParam','exContextMenu');
				}
				if(custMenus!=null && custMenus.length>0){
					$.merge(option.items,custMenus);
				}
				if(option.items.length>0){
					$(evt.target).contextmenu(option);
					$(evt.target).contextmenu().show(evt);
				}
			});
		},
		configGrid:function(){
			return this.each(function() {
				if (!this.grid) return;
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				var options={
					width:800		
				};				
				var configUrl = $grid.getGridParam("configUrl");
				configUrl=Urls.appendDate(configUrl);
				$.openLink(configUrl, {
					width:options.width,
					height:options.height,
					title : "",
					requestType : "GET",
					data : {}
					}, function() {
							var reVal = jQuery.dialogReturnValue();
							if (reVal == null){
								return;
							}
							var containerView=$grid.closest("[data-url]");
							if(containerView.length>0){
								CommonLoader.reloadView(containerView, null, null);
							}
					});
			});
		}
	});
	}
})(jQuery);
var TreeOptions={
		treeOptionToFlat:function (treeOption,options){
			treeOption=treeOption||[];
			var len=treeOption.length;
			options=options||{};
			for(var i=0;i<len;++i){
				var ele=treeOption[i];
				options[ele.value]=ele.name;
				var childs=ele.childs||[];
				if(childs.length>0){
					options=TreeOptions.treeOptionToFlat(childs,options);
				}
			}
			return options;
		}
};
;(function($) {
	
	if($.fn.fmatter){
	$.fn.fmatter.titleField=function(cellval, opts, rwd, act){
		if((!cellval)||cellval==""){
			return "";
		}
		var reVal="<div class=\"row-fluid title-field\" style='cursor:pointer;'>"	;
			reVal+="<a href=\"javascript://\">"+cellval+"</a>";
			reVal+="<div class='pull-right' style='display:none;margin-right:3px'><span class=\"add-on\"><i class=\"icon-chevron-down\"></i></span></div>";
			reVal+="</div>";
		return reVal;
	};
	$.fn.fmatter.filterHtml=function(cellval, opts, rwd, act){
		fmatterOpts=$.extend(true,{max:0},opts.colModel.formatoptions);
		cellval = cellval.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		cellval = cellval.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		if(fmatterOpts.max>0){
			cellval=cellval.substr(0,fmatterOpts.max)+"...";
		}
		return cellval;
	};
	$.fn.fmatter.treeOptionset=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var options=opts.colModel.formatoptions.options;
		if(options){
			try{
				options=JSON.parse(options);
				var flatOptions=TreeOptions.treeOptionToFlat(options,{});
				var optionName=flatOptions[cellval];
				if(!optionName){
					return cellVal;
				}else{
					return optionName;
				}
			}catch(e){
				$.messageBox.error({message:i18n.t("optionset.optionsNotLegal")});
				return cellval;
			}
		}else{
			return cellval;
		}
	};
	$.fn.fmatter.refEntity=function(cellval, opts, rwd, act){
		//formatoptions;
		if(cellval==null) return "";
		var userdata=$("#"+opts.gid).getGridParam("userData");
		if(userdata==null || userdata[opts.colModel.name]==null || opts.colModel.formatoptions==null) return cellval;
		var resultStr=cellval;
		var idField=opts.colModel.formatoptions.id;
		var titleField=opts.colModel.formatoptions.title || idField;
		var entityName=opts.colModel.formatoptions.entityName;
		var viewUrl=opts.colModel.formatoptions.viewUrl;
		if(!viewUrl){
			viewUrl=window.Global.contentPath+"/entities/"+entityName+"/edit";
		}
		$.each(userdata[opts.colModel.name],function(i,item){
			if(item[idField]==cellval){
				if(rwd.treeGridRoot===1){
					resultStr="<a class='refEntity' data-target-entity-id='"+cellval+"' href='javascript://' onclick=\"javascript:jQuery.openLink('"+Urls.appendParam(viewUrl,"id",cellval)+"');\">"+item[titleField]+"</a>";
				}else{
					resultStr="<a href='javascript://' onclick=\"javascript:jQuery.openLink('"+Urls.appendParam(viewUrl,"id",cellval)+"');\">"+item[titleField]+"</a>";
				}
				$(resultStr).click(function(){
					jQuery.openLink($(this).attr("href"),{showType:"pop-up",width:800});
					return false;
				});
			}
		});
		return resultStr;
	};
	$.fn.fmatter.photoField=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var _fileSavePath=cellval;
		var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
		var path=Global.contextPath;
		var realPath=path+'/ui/upload?action=download&filepath='+_filePath;//
		//var imgHtml="<img src='"+realPath+"' style=\"width:100px;height:100px;display:block;\"/>";
		var reVal="<img onmouseout=\"javascript:jQuery(this).css({width:'25px',height:'25px'});\" onmouseover=\"javascript:jQuery(this).css({width:'100px',height:'100px'});\" style=\"width:25px;height:25px;display:block;\" src='"+realPath+"'/>";
		return reVal;
	};
	$.fn.fmatter.fileField=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var _fileSavePath=cellval;
		var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
		var _fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
		var path=Global.contextPath;
		var realPath=path+'/ui/upload?action=download&filepath='+_filePath;//
		var reVal="<a href='"+realPath+"'>"+_fileName+"</a>";
		return reVal;
	};
	$.fn.fmatter.icon=function(cellvalue, options, rowObject, act){
		var icon = rowObject[options.colModel.name];
		if(icon){
			return "<img src='" + Global.iconPath + icon + "'/>";
		} else {
			return i18n.t("common.none");
		}
	};
	$.fn.fmatter.addition=function(cellvalue, options, rowObject, act){
		var addition = rowObject[options.colModel.name];
		var opt = options.colModel.formatoptions;
		var list = JSON.parse(addition);
		if(list && list.length > 0){
			var array = [], html = '', length = list.length, count = opt && opt.listShowCount, start = 0;
			if(!count) {
				count=length;
			}
			if(count>length){
				count=length;
			}
			for(var i = start; i < length; i++) {
				var item = list[i], timeStr = item.time;
				html = '';
				var date = new Date(), dateStr = "";
				
				timeStr = timeStr.replace('T', ' ').replace('Z', ' ').replace('-', ' ').replace('-', ' ')
					.replace(':', ' ').replace(':', ' ').replace('.', ' ').split(' ');
				date.setFullYear(timeStr[0], timeStr[1] - 1, timeStr[2]);
				date.setHours(timeStr[3], timeStr[4], timeStr[5], timeStr[6]);
				if(date) {
					var mon = date.getMonth() + 1, da = date.getDate(), ho = date.getHours(), mi = date.getMinutes();
					dateStr = (mon > 9? mon:'0' + mon) + '-' + (da > 9? da:'0' + da) + ' '
							+ (ho > 9? ho:'0' + ho) + ':' + (mi > 9? mi:'0' + mi);
				} else {
					dateStr = item.time;
				}
				html += '<span style="color: gray;" title="' + dateStr + '">' + dateStr + '：</span>';
				html += '<span title="' + item.content + '">' + item.content + '</span><br/>';
				array.push(html);
			}
			if((opt && opt.listOrder && opt.listOrder == 'asc') || (opt && !opt.listOrder) || !opt) {
				array.reverse();
			}
			html = array.join('');
			if(opt && opt.listMoreUrl) {
				var href = opt.listMoreUrl.replace('~', Global.contextPath);
				if(href.indexOf('?') != -1) {
					href += '&';
				} else href += '?';
				href += 'id=' + options.rowId;
				if(count) {
					if(count < length) {
						html += '&nbsp;<a href="javascript://" onclick="javascript:jQuery.openLink(\'' + href
							+ '\', {width: 400}, function(){jQuery(\'#' + options.gid
							+ '\').trigger(\'reloadGrid\');});">'+i18n.t("common.more")+'</a>';
					}
				}
			}
			return '<div title="'+i18n.t("common.content")+'">' + html + '</div>';
		} else {
			return i18n.t("common.none");
		}
	};
	$.fn.fmatter.select=function(cellvalue, options, rowObject, act){
		if(options.colModel.editoptions && options.colModel.editoptions.value){
			var options = options.colModel.editoptions.value;
			var option = options.split(";");
			for(i in option){
				var pair = option[i].split(":");
				if(pair[0] == cellvalue) return pair[1];
			}
		}
		if(cellvalue == null) return "";
		return cellvalue;
	};
	}
}(jQuery));

var consolelog=function(obj){
	if($.browser.webkit){
		console.log(obj);
	}
};

function addTabContextMenu(event,ui) {
	var imageRoot=window.Global.iconPath+"mini"; 
	var options = {
		width : 80,
		items : [ {
			text : i18n.t("common.closeOthers"),
			icon : imageRoot+"/icon_tool_012.gif",
			alias : "Close Others",
			action : closeOthers
		}, {
			text : i18n.t("common.closeAll"),
			icon : imageRoot+"/icon_tool_024.gif",
			alias : "Close All",
			action : closeAll
		} ],
		eventType : 'contextmenu'
	};

	function closeOthers() {
		var $tabs=$("[tabid^=tab_]","#tab-container");
		var tabLength=$tabs.length;
		var i=0;
		var curTabId=$(ui.tab).attr("tabid");
		for(;i<tabLength;++i){
			var id=$($tabs[i]).attr("tabid");
			if(curTabId!=id){
				$("#tab-container").tabs().remove({id:id});
			}
		}
	};
	function closeAll() {
		$("#tab-container").tabs().destroy();
		$("#default-content div").empty();
		$("#tab-container").children(":not(#default-content)").remove();
		var htmlContent=$("#content").html();
		$("#tab-container").remove();
		$("#content").html(htmlContent);
	};
	$(ui.tab).contextmenu(options);
};

function openLinkInTab(url,tabContainer,params){
	var tabContainerId=null,$tabContainer=null;
	if(typeof(tabContainer)==="undefined"){
		tabContainerId="#tab-container";
		$tabContainer=$(tabContainerId);
	}else if(typeof(tabContainer)==="string"){
		tabContainerId=tabContainer||"#tab-container";
		if(!tabContainerId.startWith("#")){
			tabContainerId="#"+tabContainerId;
		}	
		$tabContainer=$(tabContainerId);
	}else{
		$tabContainer=tabContainer;
	}
	if($(tabContainerId).length<1){
		$.messageBox.error({message:'can`t find container:'+tabContainer});
		return null;
	}
	
	var title=params.title||"new-tab";
	var iframe=params.iframe||false;
	var openInCurTab=params.curTab||false;
	var tabId="tab_"+CommonUtil.hashCode(url);
	
	//tab不存在，将当前容器转为Tab控件

	if((!$tabContainer.hasClass("ui-widget-content") && !$tabContainer.hasClass("ui-carousel-horizontal"))||$tabContainer.find(".ui-tabs-nav").length<1){
		var createTabParam={
				closable:true,
				cache:true,
				iframe:iframe,
				tabs:[],
				ajaxOptions:{
					cache:false,
					error:function(xhr, s, index, a){
						CommonUtil.showJsonError(xhr,a);
					}
				},
				load:function(event,ui){
					$(".closeBtn").hide();
					if($.isFunction(params.callback)){
						params.callback(event,ui);
					}
				},
				show:function(event,ui){
					
				}
		};
		//是否存在默认内容
		var defaultContent=$tabContainer.find(".default-content-tab").children(":first-child").html();
		if(defaultContent){
			var defaultTabId="tab_"+CommonUtil.hashCode(+window.location.pathname+(window.location.search||''));
			var contentId=$tabContainer.find(".default-content-tab").attr("id");
			createTabParam=$.extend(true,createTabParam,{
				tabs:[{id:defaultTabId,label:'default',content:contentId}]
			});
		}
		//是否为主框架上的Tab
		if(tabContainerId=="#tab-container"){
			createTabParam=$.extend(true,createTabParam,{
				load:function(event,ui){					
					addTabContextMenu(event,ui);
					if($.isFunction(params.callback)){
						params.callback(event,ui);
					}
					$(".closeBtn").hide();
				},
				add:function(event,ui){
					addTabContextMenu(event,ui);
					setTimeout(function(){
						//$(ui.panel).css("overflow-y","auto").height($tabContainer.height()-28);
						$("iframe",$(ui.panel)).height($tabContainer.height()-30);
					},500);
				}
			});
		}
		$tabContainer.tabs(createTabParam);
		//设置Tab窗口的固定高度
		if($tabContainer.parent().css("height")){
			$tabContainer.height($tabContainer.parent().height()-5);
		}
	}
	if($("a[tabid="+tabId+"]").length>0){
		//Tab已经打开，激活并强制刷新当前页面
		$tabContainer.tabs().active({id:tabId});
		$tabContainer.tabs().load({id:tabId});
	}else{	
		var addTabParam={
			id:tabId,
			label:title,
			iframe:iframe,
			url:url
		};		
		//在当前Tab中打开,删除原来的Tab，并在原来index上创建一个新的Tab
		if(openInCurTab){
			var curTabId="";
			var curTabLi=$("li.ui-tabs-selected","#tab-container");
			var curTab= curTabLi.find("a");
			if(curTab.length>0){
				curTabId=curTab.attr("tabid");
				var index=$(curTabLi).index();
				addTabParam=$.extend(true,addTabParam,{
					index:index
				});
				$tabContainer.tabs().remove({id:curTabId});
			}
		}
		//create Tab
		$tabContainer.tabs().add(addTabParam);
	}
	//active Tab
	$tabContainer.tabs().active({id:tabId});
	return {tab:$tabContainer,tabId:tabId};
};

function openCenterWindow2(URL,wndWidth,wndHeight,windowName){
	var wndLeft =20;
	var wndTop  = 10;
	if(wndWidth||wndHeight){
		wndLeft = (window.screen.width-wndWidth)/2;
		wndTop  = (window.screen.height-wndHeight)/2;
	}
	wndWidth=wndWidth||window.screen.width-30;
	wndHeight=wndHeight||window.screen.height-60;
	var form    = "width=" + wndWidth + ",height=" + wndHeight + ",left=" + wndLeft + ",top=" + wndTop + ",resizable=yes,toolbar=no,scrollbars=yes,menubar=no,location=no";
	
	return window.open(URL,windowName||'_blank');        
};
*//** 默认以pop-up【弹出div】方式弹出窗口,url如果以http://开头默认以iframe方式加载
 *  params参数说明:
 * 	1 showType可选值：pop-up、tab、win、div，默认为pop-up
 * 		a showType=pop-up ,打开弹出对话框依赖dialog控件
 * 		b showType=tab ,在target参数指定tab控件容器创建新tab打开链接
 * 		c showType=win ,以window.open方式打开链接
 * 		d showType=div ,在target参数指定div中打开链接
 *  2 iframe：
 *  	a showType取值pop-up、tab、div时可用
 *  	b 可选值:true（iframe方式加载url）和false（div方式加载url），默认为false
 *  3 target：
 *  	a showType取值tab、win、div时可用
 *  	b showType=tab时，target指定tab容器id
 *  	c showType=div时，target指定div容器id
 *  	d showType=win时，target指定window-name
 *//*
jQuery.openLink = function(url,params,callback,fixParams){
	params=$.extend(params,{},true);
	var width=params.width;
	var height=params.height;
	var title=params.title;
	var _target=params.target;
	var _iframe=(!params.iframe|| params.iframe === "false")?false:true;
	if(url.indexOf("://")>0){
		_iframe=true;
	}
	params.iframe=_iframe;
	var _showType=(!!params.showType)?params.showType:"pop-up";
	url = jQuery.utils.parseUrl(url||"") ;
	jQuery.dialogReturnValue("__init__");
	params = params||{} ;
	fixParams = fixParams||{} ;
	
	if(_showType=="win"||!($.dialog)){
		var win = openCenterWindow2(url,width, height,_target);
		win.focus();
		window._dialogArguments = params ;
		var _callbak = function(){
			if( $.unblock ){$.unblock() ; }
			if($.isFunction(callback)){
				callback(window);
			}
		};
		try{
			if( jQuery.browser.msie ){
				win.attachEvent("onunload", _callbak );
			}else{
				win.onbeforeunload = _callbak ;
			}
		}catch(e){
			
		}
		return win ;
	}else if(_showType=="tab" || _showType=="cur-tab"){
		var reVal=openLinkInTab(url,_target,
				{curTab:_showType=="cur-tab"?true:false,
				title:title,
				iframe:_iframe,
				callback:function(event,ui){
					$(ui.panel).uiwidget();
					if($.isFunction(callback)){
						callback(_target,ui);
					}
					if(event.target.id=="tab-container"){
						Page.fitTabContentSize($(ui.panel));
					}
				}});
		
	}else if(_showType=="div"){
		if(!_target){
			$.messageBox.error({message:i18n.t("common.linkUnspecifiedContainerId")});
		}
		if((typeof _target =="string")&&(!_target.startWith("#"))){
			_target="#"+_target;
		}
		if(_iframe){
			$(_target).html("<iframe style='width:100%;height:100%;' src='"+url+"'></iframe>");
			if($.isFunction(callback)){
				callback(_target);
			}
		}else{
			CommonLoader.loadData(_target, url, params.data, callback,fixParams);
		}		
	}else if($.dialog&&_showType=="pop-up"){
		jQuery.dialogReturnValue(null);
		var opts = {
				width:width,
				height:height,
				title:params.title||params.Title||fixParams.title||'',
				url:url,
				isShowLoading:false,
				requestType:params.requestType||"get",
				//data:params,
				iframe:_iframe,
				buttonBar:true,
				onload:function(){					
					var me = this ;
					if(!_iframe){
						setTimeout(function(){
							//控件初始化
							me.frwDom.uiwidget() ;
							//浏览器兼容
							me.frwDom.browserFix() ;							
							//移动标题和底部按钮
							var pageTitleCon=$(".ui-dialog-content .ui-dialog-title",me.frwDom);
							if(pageTitleCon.length>0){
								$(".ui-dialog-titlebar .ui-dialog-title",me.frwDom).html(pageTitleCon.html());
								pageTitleCon.remove();
							}
							var pageBtnsCon= $(".ui-dialog-content .ui-dialog-buttonset",me.frwDom);
							if(pageBtnsCon.length>0){
								var dialogBtnPane=$(".ui-dialog-buttonpane",me.frwDom);
								var submitBtn=pageBtnsCon.find(":submit");
								if(submitBtn.length>0){
									var btform=submitBtn.closest("form");
									submitBtn.click(function(){								
										if(btform.length>0){
											btform.submit();									
										}
										return false;
									});
									
								}
								dialogBtnPane.empty();						
								pageBtnsCon.appendTo(dialogBtnPane);
							}
						},50);
					}
				},close:function(){
					callback && callback.call(this,$.dialogReturnValue()) ;
				}
			};
			
		opts = $.extend({},params,opts,fixParams) ;
		var _dialog = jQuery.dialog(opts) ;
		return _dialog ;
	}
};
var Navigator={
	navigateToMenu:function(nodeId,type){
		var treeRoot=$("#menuadmin-tree_menumetadata .bbit-tree-ec-icon");
		if(!treeRoot.hasClass("bbit-tree-elbow-minus")){
			treeRoot.trigger("click");
		}
		var treeIcon=$(".bbit-tree-ec-icon","div[nodeid="+nodeId+"]");
		if(!treeIcon.hasClass("bbit-tree-elbow-minus")){
			treeIcon.trigger("click");
		}
		if(type=='views'){
			$("a span","div[nodeid="+nodeId+"_views]").trigger("click");
		}else if(type=='grids'){
			$("a span","div[nodeid="+nodeId+"_grids]").trigger("click");
		}else if(type=='relation'){
			$("a span","div[nodeid="+nodeId+"_relation]").trigger("click");
		}else if(type=='fields'){
			$("a span","div[nodeid="+nodeId+"_fields]").trigger("click");
		}else if(type=='operation'){
			$("a span","div[nodeid="+nodeId+"_operation]").trigger("click");
		}else if(type=='security'){
			$("a span","div[nodeid="+nodeId+"_security]").trigger("click");
		}
		var currentEleTop=treeIcon.position().top;
		var scrollTop=$("#menuTreeCon .secmenu-list").scrollTop();
		$("#menuTreeCon .secmenu-list").scrollTop(currentEleTop+scrollTop-35);
	},
	navigateToEntity:function(entityPartName){
		var treeRootNode=$("#menuadmin-tree_menumetadata");
		var treeChildScopeNodes=treeRootNode.next("ul");
		var treeRoot=$("#menuadmin-tree_menumetadata .bbit-tree-ec-icon");
		if(!treeRoot.hasClass("bbit-tree-elbow-minus")){
			treeRoot.trigger("click");
		}
		var treeIcon=treeChildScopeNodes.find("div[nodeid*="+entityPartName+"]"+" .bbit-tree-ec-icon");
		if(treeIcon.length<1){
			treeIcon=treeChildScopeNodes.find("div[title*="+entityPartName+"]"+" .bbit-tree-ec-icon");
		}
		if(treeIcon.length>0){
			
			treeIcon=$(treeIcon[0]);
			var entityNode=treeIcon.parent();
			var fieldsNode=entityNode.next("ul").find("li:first>div");
			if(!treeIcon.hasClass("bbit-tree-elbow-minus")){
				treeIcon.trigger("click");
			}
			//$("a span","div[nodeid="+nodeId+"_fields]").trigger("click");
			$("a span",fieldsNode).trigger("click");
			var currentEleTop=treeIcon.position().top;
			var scrollTop=$("#menuTreeCon .secmenu-list").scrollTop();
			$("#menuTreeCon .secmenu-list").scrollTop(currentEleTop+scrollTop-35);
		}
	}
};

jQuery.fn.extend({
	selectIcon : function(callback, optional  size){
		return this.each(function(){
			size = size || null;
			if(size != null && size.width == null && size.height == null) size = null;
			var title = i18n.t("common.select");
			if(size) title = title + " " +i18n.t("icon.desc",size.width,size.height);
			else title = title + i18n.t("icon.title");
			$(this).click(function(){
				$.openLink(Global.contextPath + "/icon/icon_select", {
					width :600,
					height: 400,
					title : title,
					requestType : "GET",
					data : size
					}, function() {
							var url = jQuery.dialogReturnValue();
							callback(url);
					});
			});
		});
	},
	editCode : function(callback,  optional  title,  optional  code){
		return this.each(function(){
			$(this).click(function(){
				$.openLink(Global.contextPath + "/code/edit", {
					width :800,
					height: 400,
					title : title || i18n.t("code.edit"),
					requestType : "POST",
					data : {
						code : code || ""
					}
					}, function() {
							var code = jQuery.dialogReturnValue();
							callback(code);
					});
			});
		});
	} 
});

$.uiwidget.register("icon", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var $btn = selector.children("button:first");
		var size = {};
		size.width = $btn.data("width");
		size.height = $btn.data("height");
		$btn.selectIcon(function(url){
			if (url != null){
				if(selector.children("img").length == 0){
					$(selector).prepend($("<img>"));
				}
				selector.children("img:first").show().attr("src", Global.iconPath + url);
				selector.children("input[type=hidden]").val(url);
			}
		}, size);
	});
});

$.uiwidget.register("code", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var oldCode = selector.children("input[type=hidden]").val();
		if(oldCode !== ""){
			showCodePreviewBtn(selector, oldCode);
		}
		selector.children("button.code-edit").editCode(function(code){
			if (code != null){
				selector.children("input[type=hidden]").val(code);
				showCodePreviewBtn(selector, code);
			}
		}, i18n.t("code.edit"), oldCode);
	});
});

$.uiwidget.register("openLink", function(selectors){
	selectors.each(function(){
		var $ts = $(this);
		var opt = {
			url: $ts.attr('data-url') || $ts.attr('href') || '',
			showType: $ts.attr('data-showType') || 'pop-up',
			data: JSON.parse($ts.attr('data-data') || null),
			callback: eval($ts.attr('data-callback'))
		};
		if(!opt.url) {
			consolelog('No data-url attribute found! Stop binding open link...');
		}
		$ts.click(function() {
			$.openLink(opt.url, {
				data: opt.data,
				showType: opt.showType
			}, $.isFunction(opt.callback)?opt.callback : null);
		});
	});
});

$.uiwidget.register("cascade", function($selectors){
	var chain = [],
		context = null,
		dataParent = 'data-parentField',
		insertFirstEmptyValueOption = true,
		handleUnusedChild = 'disable';//can be 'hide', 'disable', 'none'
	var first = true;
	var action=null;
	// [{"name": "北京市","value": "beijing","description": null,"childs": [],"default": false}]
	function getOptionset($selector) {
		return JSON.parse($selector.attr('data-optionset'));
	};
	function getChildOptionSet(optionset,parentValue){
		parentValue=parentValue||[];
		var len=parentValue.length;
		var _optionset=[];
		var value=parentValue[len-1];
		$.each(optionset,function(i,v){
			if(value===v.value){
				_optionset= v.childs;
				if(len===1){
					return false;
				}
				parentValue=parentValue.slice(0,len-1);
				_optionset=getChildOptionSet(_optionset,parentValue);
				return false;
			}
		});
		return _optionset;
	};
	
	function getOptionsThrough($this) {
		var parentName = $this.attr(dataParent);
		if(parentName) {//parentName非空
			var $parent = $('[name=' + parentName + ']', context);
			chain.push($parent.val());//chain用来记录所有父的级联字段的optionsetvalue
			return getOptionsThrough($parent);//递归直到最高层的节点
		} else {//parentName为空，表示已到最高层的节点
			var toppestParent=$this;//
			var optionset = getOptionset(toppestParent), options = [], length = chain.length;
			if(length>0){//chain如果不为空，表示当前级联控件不是最高层父节点
				optionset=getChildOptionSet(optionset,chain);
			}
			$.each(optionset,function(i,v){
				options.push({name: v.name, value: v.value});
			});
			return options;
		}
	};
	function getOptions($this) {
		chain = [];
		return getOptionsThrough($this);
	};
	function renderOptions($select, options) {
		$select.empty();
		if(null == options) {
			$select.trigger("change");
			return;
		}
		if(insertFirstEmptyValueOption) {
			$('<option></option>').text(i18n.t("common.select")).val('').appendTo($select);
		}
		$.each(options, function(){
			var option = this, $option = $('<option></option>');
			$option.val(option.value).text(option.name).appendTo($select);
		});
		$select.trigger("change");
	};
	function handleChild(hasChild, $child) {
		if(!handleUnusedChild) handleUnusedChild = 'none';
		switch(handleUnusedChild) {
			case 'hide': 
				if(hasChild) $child.show();
				else $child.hide();
				break;
			case 'disable': 
				if(hasChild) $child.attr('disabled', false);
				else $child.attr('disabled', 'true').empty();
				break;
			case 'none': 
				if(!hasChild) $child.empty();
				break;
			default: consolelog('No such way to handle unused child:' + handleUnusedChild);
		}
	};
	//数据源为实体的子字段数据获取
	function getAndSetSourceIsEntityChildDataOptions($child){
		var lookupValue=$child.attr("data-lookup-value");
		var parentField=$child.attr("data-parentField");
		//var parentDom=$("[name='"+parentField+"']",context);
		var parentLookupValue=$("[name='"+parentField+"']",context).attr("data-lookup-value");
		var parentValue=$("[name='"+parentField+"']",context).val();
		var url=Global.contextPath+"/metadata/field/getSourceIsEntityChildDataOptions";
		url=Urls.urlParam(url,[{key:'sourceEntity',value:lookupValue},{key:'targetEntity',value:parentLookupValue},{key:'targetEntityPKValue',value:parentValue}]);
		$.restGet(url,function(resp){
			//consolelog(resp);
			if(resp){
				var options=[];
				for(var i=0;i<resp.length;++i){
					var ele=resp[i];
					options.push({name:ele.name,value:ele.value});
				}
				renderOptions($child,options);
				if(options.length<1){
					handleChild(false, $child);
				}
			}
		},{async:false});
	};
	//按从高到低层级排序
	var $selectorsOrdered=[];
	function orderTop($childField){
		var len=$childField.length;
		for(var i=0;i<len;++i){
			var childFieldEle=$childField[i];
			var childName=$(childFieldEle).attr("name");
			$selectorsOrdered.push($(childFieldEle));
			var _$childField=$('[' + dataParent + '=' + childName + ']', context);
			if(_$childField.length>0){
				orderTop(_$childField);
			}
		}
	};
	$selectors.each(function(){
		var $selector = $(this);
		var parentField = $selector.attr(dataParent);
		action=$selector.attr("data-action");
		var name=$selector.attr("name");
		if(!parentField) {//最高层
			$selectorsOrdered.push($selector);
			if(!context) context = $selector.attr('data-context') || 'body';
			var $childField = $('[' + dataParent + '=' + name + ']', context);
			if($childField.length>0){
				orderTop($childField);
			}
		}
	});
	var toppestFieldValue=null;
	$.each($selectorsOrdered,function(){
		var $selector = $(this), fieldName = $selector.attr('name');
		if(!context) context = $selector.attr('data-context') || 'body';
		var parentField = $selector.attr(dataParent);
		var $childField = $('[' + dataParent + '=' + fieldName + ']', context);
		if(!parentField) {//最高层父级联字段对应控件渲染
			handleUnusedChild = $selector.attr('data-handleUnusedChild') || handleUnusedChild;
			var options = getOptions($selector);
			renderOptions($selector, options);
			toppestFieldValue=$(this).attr('data-value');
			if(toppestFieldValue){
				$(this).val(toppestFieldValue);
			}
		}
		if($childField.length > 0) {
			$selector.change(function(){//如果有子级联字段，绑定父级联控件的值change事件，激发子级联控件重新设值
				$childField.each(function(){
					var $child = $(this), options = getOptions($child);
					var lookupValue=$child.attr("data-lookup-value");
					if(first) {
						if(toppestFieldValue){
							handleChild(true, $child);
							if(lookupValue){
								getAndSetSourceIsEntityChildDataOptions($child);
							}else{
								renderOptions($child, options);	
							}
							var _dataValue=$child.attr('data-value');
							$child.val(_dataValue);
						}else{
							handleChild(false, $child);
						}
						return;
					}
					handleChild(true, $child);
					if(lookupValue){
						getAndSetSourceIsEntityChildDataOptions($child);
					}else if(options && options.length > 0){
						renderOptions($child, options);	
					}else {
						handleChild(false, $child);
						$child.change();
					}
				});
			});
		}
	});
	$.each($selectorsOrdered,function(){
		$(this).change();
	});
	first = false;
	if(action=="view"){
		$.each($selectorsOrdered,function(){
			var value=$(this).find("option:checked").text();
			$(this).after(value).hide();
		});
	}
});

$.uiwidget.register("tip", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var options = {
				trigger: 'hover',
				title: selector.attr('data-title') || i18n.t("common.ui.tip.title"),
				content: selector.attr('data-content') || i18n.t("common.ui.tip.content"),
				html: selector.attr('data-usehtml') || false
		};
		selector.popover(options);
	});
});

$.uiwidget.register("addition", function(selectors){
	selectors.each(function(){
		var $ts = $(this), list = [];
		var value = $ts.attr('data-value');
		var showField = $ts.attr('data-showField');
		var showInput = $ts.attr('data-showInput');
		var order = $ts.attr('data-formOrder');
		if(value && showField) {
			var $itemTmpl = $('.js-item', $ts);
			var list = JSON.parse(value);
			if(list && list.length) {
				for(var i = 0; i < list.length; i++) {
					var itemObj = list[i];
					var $item = $itemTmpl.clone().removeClass('hide');
					if(showField.indexOf('id') != -1 && itemObj.id) $item.find('.js-title').attr('data-id', itemObj.id);
					if(showField.indexOf('url') != -1 && itemObj.url) {
						(function(){
							var u = itemObj.url.replace('~', Global.contextPath);
							$item.find('.js-title').click(function() {
								$.openLink(u, null, function() {});
								return false;
							});
						})();
					}
					if(showField.indexOf('time') != -1 && itemObj.time) {
						var date = new Date(itemObj.time), dateStr = "";
						if(date) {
							dateStr = date.getFullYear() + i18n.t("common.date.year") + (date.getMonth() + 1) + i18n.t("common.date.month") + date.getDate()
								+ i18n.t("common.date.day") +' ' + date.getHours() + ':' + date.getMinutes();
						} else dateStr = itemObj.time;
						$item.find('.js-title').text(dateStr);
					}
					if(showField.indexOf('createdBy') != -1 && itemObj.createdBy) {
						$item.find('.js-title').append('&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;'
								+ (itemObj.createdBy));
					}
					if(showField.indexOf('content') != -1 && itemObj.content) $item.find('.js-content').text(itemObj.content);
					(order == 'asc')? $ts.prepend($item) : $ts.append($item);
				}
				$('.js-collapse', $ts).collapser({
					changeText: 0,
					target: 'next',
					effect: 'fade'
				});
			}
		} else {
			$ts.hide();
		}

		var $hide = $ts.next(), $text = $hide.next();
		if(showInput && (showInput === true || showInput == 'true' || showInput == '1' || showInput == 1)) {
			$text.blur(function() {
				var $t = $(this), val = $t.val();
				if(!$.trim(val)) return;
				list.push({time: new Date(), content: val});
				$hide.val(JSON.stringify(list));
			});
		} else {
			$text.hide();
		}
	});
});
 全局的字段唯一性验证
 *-selector元素中必须有：
 * data-entity标识是哪一个实体的字段
 * name是字段名称
 * value是字段值
 *-可选：
 * data-url指定请求验证的url，不指定则用默认
 
function isFieldValUnique(selector){
	var errorInfo = {};
	
	var entity = $(selector).attr('data-entity');
	var field = $(selector).attr('name');
	var val = $(selector).val();
	var url = $(selector).attr('data-url');
	var originVal = $(selector).attr('data-value');
	if(originVal == val) return {isError:false,errorInfo:""};
	
	if(!url) {
		url = '/entities/{entity}/isFieldValUnique';
	}
	url = url.replace('{entity}', entity);
	url = Global.contextPath + url;
	$.ajax({
		type: 'POST',
		url: url, 
		data: {field: field, value: val}, 
		success: function(response){
			if (!response) {
				errorInfo= {isError:true,errorInfo:i18n.t("error.valueDuplicate")};
			} else {
				errorInfo= {isError:false,errorInfo:""};
			}
		}, 
		async:false
	});
	return errorInfo;
}

function showCodePreviewBtn(parent, code){
	if(!parent || !code) return;
	var prevBtn = parent.children("button.codePreview");
	if(!(prevBtn && prevBtn.length > 0)){
		var btnCodePrev = $("<button class='codePreview btn' type='button' id='codePreview'>"+i18n.t("code.preview")+"</button>");
		parent.prepend(btnCodePrev);
	}
	if(code.length > 500) code = code.substring(0, 500) + "...";
	parent.children("button.codePreview").attr("data-content", code);
	$("#codePreview").popover({trigger : 'hover'});
}

function setCurrentTitle(context, title){
	$(context).parents(".ui-dialog").find(".ui-dialog-title").html(title);
};
var PlUploadUtil={
		initUpload:function(jqcontext,option,  optional  contextPath){
			contextPath = contextPath || Global.contextPath;
			var $$jqcontext;
			if(typeof jqcontext == "string"){
				context=document;
				$$jqcontext=$(jqcontext,context);
			}else if(jqcontext.domEle&&jqcontext.context){
				context=jqcontext.context;
				jqcontext=jqcontext.domEle;
				$$jqcontext=$(jqcontext,context);
			}else if(jqcontext.domEle){
				$$jqcontext=$(jqcontext.domEle);
			}else{
				$$jqcontext=$(jqcontext);
			}
			var settings=$.fn.extend(true,{
					runtimes : 'flash',
					max_file_size : '10mb',
					browse_button:null,
					container:null,
					chunk_size:'500kb',
					dragdrop:false,
					urlstream_upload:true,
					url : contextPath+'/ui/upload',
					resize : {width : 320, height : 240, quality : 90},
					flash_swf_url : contextPath+'/statics/scripts/plugins/plupload/plupload.flash.swf'
			},option);
			if(!option.filters) {
				settings.filters = [
					{title : "upload files",extensions : "*"}
				];
			}
			$$jqcontext.each(function(){
				var _self=$(this);
				var _id=$(this).attr("id");
				if (!_id) {
					_id = plupload.guid();
					$(this).attr('id', _id);
				}		
				//扩展browse_button,可以通过函数获取
				if(option && option.browse_button){					
					if($.isFunction(option.browse_button)){
						settings.browse_button=option.browse_button(_self);
					}
				}else{				
					settings.browse_button=_id;
				}
				
				//扩展container,可以通过函数获取
				if(option && option.container){					
					if($.isFunction(option.container)){
						settings.container=option.container(_self);
					}
				}else{				
					settings.container=_id;
				}
				
				var uploader = new plupload.Uploader(settings);
				
				uploader.bind('Init', function(up, params) {
					//alert(params.runtime);
				});
			
				uploader.bind('FilesAdded', function(up, files) {	
					if(settings.filesAdded){
						settings.filesAdded(up,files,_self);
					}					
					if(settings.autostart===true){
						setTimeout(function() {
							uploader.start();
						}, 10);
					}
				});
			
				uploader.bind('UploadProgress', function(up, file) {
					//alert(file.percent);
					if(settings.uploadProgress){
						settings.uploadProgress(up,file,_self);
					}	
				});
				uploader.bind('Error', function(up,err) {
					alert(i18n.t("error.uploadErrorInfo")+err.code+":"+err.message);
				});
			
				uploader.bind('FileUploaded', function(up, file,resp) {
					if(settings.fileUploaded){
						var data=$.parseJSON(resp.response);
						settings.fileUploaded(up,file,data,_self);
					}
				});
				uploader.init();
				$(this).data("uploader",uploader);
			});
		},		
		getUploader:function(domEle){
			var $obj=$(domEle);
			if($obj.length<0){
				return null;				
			}
			return $($obj.get(0)).data("uploader");
		}
};
$.uiwidget.register("photo",function(selector){
	var defaultImgPath=Global.statics+"images/100x100.gif";
	selector.each(function(){
		var _self=$(this);
		var _imgBtn=$("img.photoDisplay",_self);
		var _imgHidden=$("input.photoPath",_self);
		var _closeBtn=$("button.close",_self);
		if(_imgHidden&&_imgHidden.val()){
			var _fileSavePath=_imgHidden.val();
			var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
			_imgBtn.attr('src',Global.contextPath+'/ui/upload?action=download&filepath='+_filePath);
		}
		_closeBtn.click(function(){
			if(_imgHidden.val()){
				var _fileSavePath=_imgHidden.val();
				var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
				_imgBtn.attr('src',defaultImgPath);
				_imgHidden.val(null);
				$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+_filePath);
			}
		});
	});
	PlUploadUtil.initUpload(selector,{
		autostart:true,
		browse_button:function(container){
			return $("img",container).attr("id");
		},
		fileUploaded:function(up, file,resp,container){
			var filePath=resp.filePath;
			var fileName=file.name;
			var fileExtension=fileName.substring(fileName.lastIndexOf("."));
			$("img",container).attr("src",Global.contextPath+'/ui/upload?action=download&filepath='+filePath);
			$("input",container).val(filePath+"||"+fileName+"||"+fileExtension);
		}
	});
}) ;
$.uiwidget.register("upload",function(selector){
	var _maxSize = '10', _fileSuffix = '*';
	selector.each(function(){
		var _self=$(this);
		var _imgHidden=$("input",_self);
		var _progressBar=$(".progress div.bar",_self);
		_maxSize = _self.attr('data-maxSize');
		_fileSuffix = _self.attr('data-fileSuffix');
		if(_imgHidden&&_imgHidden.val()){
			var _fileSavePath=_imgHidden.val();
			var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
			var _fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
			_progressBar.html(_fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
			_progressBar.css({"width":"100%"});
			$(".icon-remove",_self).click(function(){
				_progressBar.html("");
				_progressBar.css({"width":"0%"});
				_imgHidden.val(null);
				$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+_filePath);
			});
			
		}
	});
	var fss = _fileSuffix.split(' ');
	var suffixs = [];
	for(var i in fss) {
		suffixs.push({title: fss[i], extensions: fss[i]});
	}
	PlUploadUtil.initUpload(selector,{
		filters: suffixs,
		max_file_size: _maxSize + 'mb', 
		autostart:true,
		browse_button:function(container){
			return $("div.uploadfile",container).attr("id");
		},
		fileUploaded:function(up, file,resp,container){
			var _progressBar=$(".progress div.bar",container);
			var filePath=resp.filePath;
			var fileName=file.name;
			var fileExtension=fileName.substring(fileName.lastIndexOf("."));
			var _imgHidden=$("input",container);
			_imgHidden.val(filePath+"||"+fileName+"||"+fileExtension);
			_progressBar.html(fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
			$(".icon-remove",container).click(function(){
				if(_imgHidden.val()){
					_progressBar.html("");
					_progressBar.css({"width":"0%"});
					_imgHidden.val(null);
					$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+filePath);
				}
			});
			_imgHidden.trigger("FileUploaded",[up, file,resp,container]);
		},
		uploadProgress:function(up,file,container){
			var _progressBar=$(".progress div.bar",container);
			var percent=file.percent+"%";
			_progressBar.css({"width":percent});
		}
	});
}) ;
TabGridHelper={
	resetHeight:function($grid,$context){
		if($grid.closest(".ui-tabs")){
			var parentContainer=$grid.closest(".ui-tabs");
			var toolbar=$context.find(".table-toolbar");
			var toolbarHeight=toolbar.height()||0;
			if(toolbar.css("display")=='none'){
				toolbarHeight=0;
			}
			var gridHeight=parentContainer.height()-100-toolbarHeight;
			$grid.jqGrid('setGridHeight',gridHeight);
		}
	}
};
var ReloadCurrentMainTab=function(){
	var _tab=$("#tab-container").tabs();
	_tab.load({id:_tab.getSelectedId()});
};
//此方法必须传入实际的一个jquery tab对象
var ReloadSpecialCurrentTab=function($tabs){
	var _tab=$tabs;
	_tab.load({id:_tab.getSelectedId()});
};
//合并字段,table为jquery选择器或jquery对象
var MergeRows=function(table){
	var _gridTableTrs=$(table).find("tbody tr");
	var _len=_gridTableTrs.length;
	var i=0;
	if(_len>0){
		for(i=0;i<_len;){
			var operationTd=$(_gridTableTrs[i]).find("td:eq(0)");
			var operation=operationTd.text();
			var j=i+1;
			var rowspan=false;
			for(;j<_len;){
				var _operationTd=$(_gridTableTrs[j]).find("td:eq(0)");
				var _operation=_operationTd.text();
				if((operation)&&(operation==_operation)){
					rowspan=true;
					_operationTd.remove();
					++j;
					if(j===_len){
						++j;
					}
				}else{
					++j;
					break;
				}
			}
			var _t=j-i-1;
			if(rowspan){
				operationTd.attr("rowspan",_t);
				i+=_t;
			}else{
				++i;
			}
		}
	}
};
*//**
 * Strings.upperCamel("hello_world",'_') = HelloWorld
 *//*
Strings={
		upperCamel:function(stringVar,split,isDeletePrefix){
			if(!stringVar){
				return "";
			}
			if(isDeletePrefix){
				var index=stringVar.indexOf(split);
				stringVar=stringVar.substring(index);
			}
			var stringArray=stringVar.split(split)||[];
			for(var i=0;i<stringArray.length;++i){
				var temp=stringArray[i];
				stringArray[i]=temp.substring(0,1).toUpperCase()+temp.substring(1).toLowerCase();
			}
			return stringArray.join("");
		}
};

var AdvanceSearch = {
		initDate: function($elem, field){
			$elem.calendar();
		},
		initDatetime: function($elem, field) {
			$elem.calendar({
				dateFmt: 'yyyy-MM-dd HH:mm:ss'
			});
		},
		initSelect: function($elem, field){
			var options = field.options;
			$.each(options, function(){
				$elem.append($('<option></option').val(this.value).text(this.name));
			});
		},
		configCache: {}
};
var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUMPAD_ENTER: 108,
    COMMA: 188
};
window.onerror = function(msg, url, line){
	consolelog("Error info:"+msg+";File position:"+url+"; Line:"+line);
	return true;
};

var EntityUtil = {
	exportEntity: function(entity, format) {
		var isMulti = $.isArray(entity) || (entity.indexOf(',') != -1)? true:false;
		var isXml = format == 'xml'? true: false;
		var url = "";
		if(isMulti){
			if(isXml) {
				url = Global.contextPath + "/metadata/entity/exportEntity/customed-entities.xml?entities=" + entity;
			} else {
				url = Global.contextPath + "/metadata/entity/exportEntity/ExportEntities.java?entities=" + entity;	
			}
		} else {
			if(isXml) {
				url = Global.contextPath + "/metadata/entity/exportEntity/" + entity + ".xml";
			} else {
				url = Global.contextPath + "/metadata/entity/exportEntity/" + entity + ".java";
			}
		}
		window.location.assign(url);
		return;
	}
};
var ToolBars={
	initTabFormCustomToolBar:function(context){
		$(context).find(".form-toolbar li.form-toolbar-button").each(function(){
			var btnSelf=$(this);
			btnSelf.hover(
					function(){
						$(this).addClass("table-img-icon-selected");
					},
					function(){
						$(this).removeClass("table-img-icon-selected");
					}
			);
			var dataFuncAttr=btnSelf.attr("data-func");
			CommonUtil.dynRequire(null,dataFuncAttr,function(func,context){
				btnSelf.on("click",function(){
					if(func==null){
						$.messageBox.info({message:(dataFuncAttr||"")+i18n.t("error.operationUndefined")});
					}else{
						func.call(context,btnSelf,null);
					}
				});
			});
		});
	}
}; */