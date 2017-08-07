//注意：此文件依赖global.contextPath，请放置在global.contextPath变量定义之后
//国际化文件必须在需要国际化的界面之前加载
;(function($) {
	$.format = function (source, params) { 
		if (arguments.length == 1||!params) {
			return source;
		}
		if (arguments.length > 2 && params.constructor != Array) { 
			params = $.makeArray(arguments).slice(1); 
		} 
		if (params.constructor != Array) { 
			params = [params]; 
		} 
		$.each(params, function (i, n) { 
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n); 
		}); 
		return source; 
	};
	//添加国际化支持
	window.i18n={
			messages:{},
			t:function(key, params){
				if(!i18n.messages){
					return "";
				}
				if(!i18n.messages[key]){
					return "??"+key+"??";
				}
				if (arguments.length > 2 && params.constructor != Array) { 
					params = $.makeArray(arguments).slice(1); 
				} 
				return $.format(i18n.messages[key],params);
			},
			loadAndAppendByUrl:function(resUrl){
				$.ajax({
					  url: resUrl,
					  dataType: 'json',
					  async:false,
					  success: function(jsonObj){
							if($.isPlainObject(jsonObj)){
								for ( var key in jsonObj) {
									i18n.messages[key]=jsonObj[key];
								}
							}
						}
					});
			},
			loadAndAppendMessages:function(messageNamespace){
				$.ajax({
					  url: Global.contextPath+'/i18n/messages?namespace='+messageNamespace,
					  dataType: 'json',
					  async:false,
					  success: function(jsonObj){
							if($.isPlainObject(jsonObj)){
								for ( var key in jsonObj) {
									i18n.messages[key]=jsonObj[key];
								}
							}
						}
					});
			},
			loadMessages:function(){
				$.ajax({
					  url: Global.contextPath+'/i18n/all',
					  dataType: 'json',
					  async:false,
					  success: function(t){
							i18n.messages=t;
						}
					});
			}
	};
	i18n.loadMessages();
}(jQuery));