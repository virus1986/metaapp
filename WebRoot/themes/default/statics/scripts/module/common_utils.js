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
		resolveParams: function(url) {
			if(!url) return;
			url = url + '';
			var index = url.indexOf('?');
			if(index > -1) {
				url = url.substring(index + 1, url.length);
			}
			var pairs = url.split('&'), params = {};
			for(var i = 0; i < pairs.length; i++) {
				var pair = pairs[i];
				var indexEq = pair.indexOf('='), key = pair, value = null;
				if(indexEq > 0) {
					key = pair.substring(0, indexEq);
					value = pair.substring(indexEq + 1, pair.length);
				}
				params[key] = value;
			}
			return params;
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
/**
 * Strings.upperCamel("hello_world",'_') = HelloWorld
 */
var Strings={
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