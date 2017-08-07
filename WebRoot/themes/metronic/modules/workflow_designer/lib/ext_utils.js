var ExtUtils={};
/**
 * title:'',height:333,width:444,id:'',url:'',ok:func,cancel:func
 * */
ExtUtils.openWindow=function(url,ok,cancel,params,extOptions){
	params=params||{};
	var innerContentId=params.id||Math.uuid();
	var winHeight=jQuery(window).height();
	var winWidth=jQuery(window).width()-130;
	var _options={
			layout : 'anchor',
			autoCreate : true,
			title:params.title||'window title',
			height : params.height||winHeight,
			width : params.width||winWidth,
			modal : true,
			collapsible : false,
			fixedcenter : true,
			shadow : true,
			resizable : true,
			proxyDrag : true,
			autoScroll : true,
			keys : [ {
				key : 27,
				fn : function() {
					dialog.hide();
				}
			} ],
			listeners : {
				hide : function() {
					dialog.destroy();
				}
			},
			items : [ {
				xtype : "component",
				id : innerContentId,
				autoEl : {
					tag : "iframe",
					src : url,
					width : params.iframeWidth||"99.6%",
					height : params.iframeHeight||"800px",
					scroll:"no"
				}
			} ],
			buttons : [
					{
						text : ORYX.I18N.PropertyWindow.ok,
						handler : function() {
							var outValue = document.getElementById(innerContentId).contentWindow.getEditorValue();
							if(jQuery.isFunction(ok)){
								ok(outValue);
							}
						}
					},
					{
						text : ORYX.I18N.PropertyWindow.cancel,
						handler : function() {
							if(jQuery.isFunction(cancel)){
								cancel();
							}
							dialog.hide();
						}
					} ]
	};
	var _options=jQuery.extend(_options,extOptions);
	var dialog = new Ext.Window(_options);
	dialog.show();
	return dialog;
};