/**
 * 工具类
 */
define([],function(){	
	var module={};
	
	var getThemePath=function(){
		return window.Global.themePath;
	};
	
	var getViewBasePath=function(){
		return getThemePath()+"/modules/html_editor/partials/";
	};
	module.getViewBasePath=getViewBasePath;
	
	var resolveTemplateUrl=function(templatePath){
		return getViewBasePath()+templatePath;
	};
	module.resolveTemplateUrl=resolveTemplateUrl;
	
	module.isBlank = function isBlank(input) {
		if(typeof(input)=="undefined" || input==null) return true;
        return /^\s*$/.test(input);
    };
    
    
    module.camel2Snake=function(input,splitChar){
    	if(module.isBlank(splitChar)){
    		splitChar="-";
    	}
    	var out = input.replace(/^\s*/, "");  // strip leading spaces
        out = out.replace(/^[a-z]|[^\s][A-Z]/g, function(str, offset) {
            if (offset == 0) {
                return str.toLowerCase();
            } else {
                return (str.substr(0,1) + splitChar + str.substr(1).toLowerCase());
            }
        });
        return out;
    };
    
    module.newGuid=function(){
    	var guid = "";
        for (var i = 1; i <= 32; i++){
          var n = Math.floor(Math.random()*16.0).toString(16);
          guid +=   n;
          if((i==8)||(i==12)||(i==16)||(i==20))
            guid += "-";
        }
        return guid;    
    };
    
    module.getParameter=function(paras, url)  
    {  
    	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");  
    	var paraObj = {} ; 
    	for (var i=0; j=paraString[i]; i++){  
    		paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);  
    	}  
    	var returnValue = paraObj[paras.toLowerCase()];  
    	if(typeof(returnValue)=="undefined"){  
    		return "";  
    	}else{  
    		return returnValue;  
    	}     
    };
    
    module.formatXml=function(xml) {
        var formatted = '';
        var reg1=/[\r|\n]+/g;
        xml = xml.replace(reg1,'');
        var reg = /(>)\s{0,}(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, _node) {
            var indent = 0;
            var node=_.str.trim(_node);
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }
     
            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }
     
            formatted += padding + node + '\r\n';
            pad += indent;
        });
     
        return formatted;
    };
    module.urls={
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
		}
	};
    
    
	return module;
});
