;(function($) {
	window.dynRequire=require.config({
		context:"dynamic module require",
		baseUrl:Global.contextPath+"/scriptlib/download/"
	});
	window.reqModule=require.config({
		context:"dynamic module in themes/static/scripts folder",
		baseUrl:Global.statics+"scripts/",
		paths:{
			ace:Global.contextPath+"/statics/scripts/plugins/ace/src-min-noconflict/ace",
			ueditor:Global.contextPath+"/statics/scripts/plugins/ueditor/editor_all_min"
		},
		shim:{
			ace: {
				exports: 'ace'
			}
		}
	});
}(jQuery));