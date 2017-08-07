/**
 * 标题控件
 */
define(["common/eventBase","services/appPd","common/classLoader"], function(EventBase,pd,classLoader) {
	return EventBase.extend({
		name:null,
		editorName:null,
		directiveDef:null,
		baseOptions:pd.bin.binModuleBaseOptions,		
		init:function(directiveName){
			var me=this;
			this._super();
			this.name=directiveName;			
			classLoader.register(directiveName,me);
		},
		getItemName:function(){
			return this.name;
		},
		getInitData:function(tElement, tAttrs){
			var data={};
			if($.isFunction(this.baseOptions.getInitData)){
				data=this.baseOptions.getInitData(tElement, tAttrs);
			}
			data.innerHtml=tElement.html();
			return data;
		},
		getSidebarItems:function(){
			
		},
		getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
			var html=$compile(sidebarItem.compileHtml)($scope);
			return html;
		}		
	});
});