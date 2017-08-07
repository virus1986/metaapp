;(function($){
	window.CommonUtil={
			isIE:function (){
					if($.browser.msie || ($.browser.mozilla && $.browser.version=="11.0")){
						return true;
					}
					return false;
				},
			floatTo2: function(val) {
				if(!val) {
					consolelog('no value to float to 2!');
					return 0;
				} else {
					return Math.round(val * 100) / 100;
				}
			},
			containsEquals:function(sourceArray,ele,key1,key2){
				if(!sourceArray) {
					sourceArray=[];
				}
				for(var i=0;i<sourceArray.length;++i){
					if(key2){
						if(sourceArray[i][key1]===ele[key1] && sourceArray[i][key2]===ele[key2]){
							return true;
						}
					}else if(key1 && sourceArray[i][key1]===ele[key1]){
						return true;
					}else if(sourceArray[i].id===ele.id){
						return true;
					}
				}
				return false;
			},
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
			showLoading:function(context,msg,isolate,autoHideTime){		
				/*if(!context){
					context=document.body;
				}*/
				context=document.body;
				var className="ajaxLoading";
				var $loading=$(".ajaxLoading");
				if(isolate){
					className+=new Date().valueOf();	
					if($loading.length>0){
						$loading.removeClass("ajaxLoading");
						$loading.addClass(className);
					}else{
						$loading=$("."+className);
					}
				}
				
				var container=$(context);
				var pageSidebarWidth=$(".page-sidebar").outerWidth()||20;
				var left=(document.body.clientWidth-pageSidebarWidth)/2;
				var top=250;
				if(!msg){
					msg=i18n.t("common.processing");
				}
				
				if($loading.length==0){
					$loading=$("<div class='alert alert-info "+className+"' style='position:fixed;z-index:19999;display:none;'></div>");
					container.append($loading);
				}
				$loading.html("<i class='loading-small'></i><span>"+msg +"</span>");
				$loading.css({top:top,left:left});

				$("."+className).show();
				if(autoHideTime>0){
					window.setTimeout(function(){
						CommonUtil.hiddenLoading();
					},autoHideTime);
				}
				return className;
			},
			hiddenLoading:function(timeout,selector){
				if(!timeout){
					timeout=500;
				}
				selector=selector || "ajaxLoading";
				window.setTimeout(function(){
					$("."+selector).hide();
					$("."+selector).remove();
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
				}else if(xhr.status=="401"){
					$.messageBox.confirm({
						message:"登录已超时，是否刷新页面，重新登录？",
						callback:function(result){
								if(result){
									window.history.go(0);
								}
						}
					});					
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
					var html="<h2 class='error-title-h2'>功能出现异常，请联系管理员!也可点击下方按钮查看错误详情!</h2>";
					html+='<button type="button" class="btn mini red" data-toggle="collapse" data-target="#function-error-detail">查看详情</button>';
					html+='<div id="function-error-detail" class="collapse">'+xhr.responseText+'</div>'
					CommonUtil.showError("<div style='width:700px;margin:0px auto;'>"+html+"</div>");
					//CommonUtil.showError("<div style='width:700px;margin:0px auto;'>"+xhr.responseText+"</div>");
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
			},
			arrRemove:function(arr,index){
				return arr.slice(0,index).concat(arr.slice(index+1,arr.length));
			}
		};
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
		String.prototype.trim = function(str) {
			return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
		window.Urls={
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
						return url+"";
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
						return url+"";
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
				},
				parseDownloadPath:function(pathInfo,serverPath){
					if(!serverPath){
						serverPath=Global.contextPath;
					}
					var basePath=serverPath + '/ui/download?filePath=';
					if((!pathInfo)||pathInfo==="[]"){
						return "";
					}
					var filePath="",fileId="",fileName="";
					if(pathInfo.startWith("[")){
						var pathJson=JSON.parse(pathInfo)[0];
						filePath=pathJson.filePath||"";
						fileId=pathJson.diskId||"";
						fileName=pathJson.name||"";
					}else{
						var paths=pathInfo.split('||');
						filePath=paths[0];
						if(paths.length>1){
							fileName=paths[1];
						}else{
							fileName=pathInfo.substring(pathInfo.lastIndexOf("/")+1);
						}
					}
					return basePath+filePath+"&fileId="+fileId+"&name="+fileName;
				},
				parseFile:function (pathInfo,serverPath){
					if(!serverPath){
						serverPath=Global.contextPath;
					}
					var basePath=serverPath + '/ui/download?filePath=';
					if((!pathInfo)||pathInfo==="[]"){
						return "";
					}
					var filePath="",fileId="",fileName="";
					if(pathInfo.startWith("[")){
						var pathJson=JSON.parse(pathInfo)[0];
						filePath=pathJson.filePath||"";
						fileId=pathJson.diskId||"";
						fileName=pathJson.name||"";
					}else{
						var paths=pathInfo.split('||');
						filePath=paths[0];
						if(paths.length>1){
							fileName=paths[1];
						}else{
							fileName=pathInfo.substring(pathInfo.lastIndexOf("/")+1);
						}
					}
					return {filePath:filePath,diskId:fileId,fileName:fileName,downloadPath:basePath+filePath+"&fileId="+fileId+"&name="+fileName};
				},
				uploadUrls:function(serverPath){
					if(!serverPath){
						serverPath=Global.contextPath;
					}
					var fsUploadPath=serverPath+'/ui/upload';
					var fsDownloadPath=serverPath+'/ui/download';
					var fsDeletePath=fsUploadPath+"?action=delete";
					var diskUploadPath=fsUploadPath;//'/imDisk/putfile'
					var diskDownloadPath=fsDownloadPath;//'/imDisk/DownloadFile'
					var diskDeletePath=fsDeletePath;
					return {
						fsUploadPath:fsUploadPath,
						fsDownloadPath:fsDownloadPath,
						fsDeletePath:fsDeletePath,
						diskUploadPath:diskUploadPath+"?usedisk=1",
						diskDownloadPath:diskDownloadPath,
						diskDeletePath:diskDeletePath
					};
				}
		};
		/**
		 * Strings.upperCamel("hello_world",'_') = HelloWorld
		 */
		window.Strings={
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
		window.MoneyCN={
				convertCurrency : function (currencyDigits) {
					// Constants:
					var MAXIMUM_NUMBER = 99999999999.99;
					// Predefine the radix characters and currency symbols for output:
					var CN_ZERO = "零";
					var CN_ONE = "壹";
					var CN_TWO = "贰";
					var CN_THREE = "叁";
					var CN_FOUR = "肆";
					var CN_FIVE = "伍";
					var CN_SIX = "陆";
					var CN_SEVEN = "柒";
					var CN_EIGHT = "捌";
					var CN_NINE = "玖";
					var CN_TEN = "拾";
					var CN_HUNDRED = "佰";
					var CN_THOUSAND = "仟";
					var CN_TEN_THOUSAND = "万";
					var CN_HUNDRED_MILLION = "亿";
					//var CN_SYMBOL = "￥:";
					var CN_SYMBOL="";
					var CN_DOLLAR = "元";
					var CN_TEN_CENT = "角";
					var CN_CENT = "分";
					var CN_INTEGER = "整";

					// Variables:
					var integral; // Represent integral part of digit number.
					var decimal; // Represent decimal part of digit number.
					var outputCharacters; // The output result.
					var parts;
					var digits, radices, bigRadices, decimals;
					var zeroCount;
					var i, p, d;
					var quotient, modulus;

					// Validate input string:
					currencyDigits = currencyDigits.toString();
					if (currencyDigits == "") {
						alert("请输入要转换的数字!");
						return "";
					}
					if (currencyDigits.match(/[^,.\d]/) != null) {
						alert("数字中含有非法字符!");
						return "";
					}
					if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
						alert("错误的数字格式!");
						return "";
					}

					// Normalize the format of input digits:
					currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
					currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
					// Assert the number is not greater than the maximum number.
					if (Number(currencyDigits) > MAXIMUM_NUMBER) {
						alert("超出转换最大范围!");
						return "";
					}
					// Process the coversion from currency digits to characters:
					// Separate integral and decimal parts before processing coversion:
					parts = currencyDigits.split(".");
					if (parts.length > 1) {
						integral = parts[0];
						decimal = parts[1];
						// Cut down redundant decimal digits that are after the second.
						decimal = decimal.substr(0, 2);
					}
					else {
						integral = parts[0];
						decimal = "";
					}
					// Prepare the characters corresponding to the digits:
					digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
					radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
					bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
					decimals = new Array(CN_TEN_CENT, CN_CENT);
					// Start processing:
					outputCharacters = "";
					// Process integral part if it is larger than 0:
					if (Number(integral) > 0) {
						zeroCount = 0;
						for(i=0;i<integral.length;i++){
							p = integral.length-i-1;
							d = integral.substr(i, 1);
							quotient = p/4;
							modulus = p%4;
							if (d == "0") {
								zeroCount++;
							}
							else {
								if (zeroCount > 0){
									outputCharacters += digits[0];
								}
								zeroCount = 0;
								outputCharacters += digits[Number(d)] + radices[modulus];
							}
							if (modulus == 0 && zeroCount < 4) {
								outputCharacters += bigRadices[quotient];
							}
						}
						outputCharacters += CN_DOLLAR;
					}
					// Process decimal part if there is:
					if (decimal != "") {
						for (i = 0; i < decimal.length; i++) {
							d = decimal.substr(i, 1);
							if (d != "0") {
								outputCharacters += digits[Number(d)] + decimals[i];
							}
						}
					}
					// Confirm and return the final output string:
					if (outputCharacters == "") {
						outputCharacters = CN_ZERO + CN_DOLLAR;
					}
					if (decimal == "") {
						outputCharacters += CN_INTEGER;
					}
					outputCharacters = CN_SYMBOL + outputCharacters;
					return outputCharacters;
				}
		}
		window.KEY = {
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

		window.CFUtils = {
			//解析表达式
			analysisExpression:function (expression,self){
				var methods = {
					getEntity:function(expression,self,method,mName){
						var exp = {};
						var reArgument = new RegExp("\\(.*\\)");
						var reField = new RegExp("\\.[a-zA-Z_][a-zA-Z0-9_]*");
						var a = reArgument.exec(expression);
						if(a==null || typeof(a)=="undefined"){
							return null;
						}
						a = (a+"").replace("(", "").replace(")", "").split(",");
						var f = reField.exec(expression)+"";
						exp.method = method;
						exp.methodName = mName;
						if(a.length != 2){
							return null;
						}
						exp.arg = a[0];
						if(a[1].startWith("'")&&a[1].endWith("'")){
							exp.field = a[1].replace("'","").replace("'","");
						}else if(a[1].startWith("\"")&&a[1].endWith("\"")){
							exp.field = a[1].replace("\"","").replace("\"","");
						}else{
							return null;
						}
						exp.caseCadeEntity = self.attr("data-entity");
						exp.caseCadeInputText = self;
						return exp;
					}
				};
				var exp = null;
				
				var startwith = expression.startWith("@{");
				var endwith = expression.endWith("}");
				if(startwith&&endwith){
					var reMethod = new RegExp("[a-zA-Z_][a-zA-Z0-9_]*\\(");
					var m = reMethod.exec(expression)+"";
					if(!CFUtils.isUndefined(m)&&m!=""&&m!=null&&
							!CFUtils.isUndefined(methods[m.replace("(", "")])){
						method = methods[m.replace("(", "")];
						exp = method(expression,self,method,m.replace("(", ""));
					}
				}
				return exp;
			},
			//改变self的值并抛出change事件
			changeSelfValue:function (self,result){
				var sval = self.val();
				if(sval != result){
					self.val(result);
					self.trigger("change",{input:self,result:result});
				}
			},
			//判断是否undefined
			isUndefined:function (arg){
				if(typeof(arg) == "undefined"){
					return true;
				}else{
					return false;
				}
			},
			//根据字段ID判断是否从表字段
			isSlaveField:function(id){
				if(id.indexOf("[")!=-1&&
						id.indexOf("]")!=-1&&
						id.indexOf(".")!=-1&&
						id.indexOf("_slave")!=-1){
					return true;
				}else{
					return false;
				}
			},
			//根据传入的DOM元素找到影响改元素的DOM元素
			bindChangeEvent:function(self,callBack){
				var expression = self.attr("data-expression");
				if(CFUtils.isUndefined(expression)){
					return;
				}
				var exp = CFUtils.analysisExpression(expression,self);
				if(exp == null){
					return;
				}
				var parentElement;
				if(CFUtils.isSlaveField(self.attr("id"))){
					parentElement = $("input[name$="+exp.arg+"]",self.closest("tr"));
				}else{
					parentElement =$("#"+exp.arg,self.closest("form"));
				}
				exp.sourceEntity = parentElement.attr("data-entity")||"";
				parentElement.on("change",function(){
					var filter='{"field":"id","op":"eq","data":"'+parentElement.val()+'"}';
					jQuery.simpleRequest({
						data:{
							search:true,
							expand:exp.field,
							filters:'{"groupOp":"OR","rules":['+filter+']}',
							
						},
						type: 'post',
						url :Global.contextPath + "/entities/"+exp.sourceEntity+"/query2",
						dataType :'json',
						success :function(response){
							callBack(response,exp);
						}
					});
				});
			}
		};
		window.UploadUtils={
				fileNameSpecials:/[,|#|\/|\\|<|>|\*|\?]+/ig,
				fileNameSpecialsInfo:"文件名不允许有英文逗号等如下特殊字符: , # / \ < > * ?"
		};
}(jQuery));
