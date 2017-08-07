/**
 * 工具类
 */
define([],function(){	
	var module={};
	
	var getContextPath=function(){
		return window.Global.contextPath;
	};
	
	var getViewBasePath=function(){
		return getContextPath()+"/themes/default/modules/html_editor/partials/";
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
    
    
	return module;
});
