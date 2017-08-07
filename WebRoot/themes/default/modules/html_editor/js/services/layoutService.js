//service that define pdLayout sidebar items,user can add items here!
define([ 'angular', 'services/services',"common/utils","common/classLoader","services/sidebarItems","services/binManager","services/scriptService"], 
		function(angular, serviceModule,utils,classLoader,sidebarItems,binManager,scriptService) {
	var layoutService={};
	var pdLayoutDdirectiveName="pdLayout";
	layoutService.registerLayoutBin=function(directiveName,scope, iElement){
		var layoutId=utils.newGuid();
		scope.layoutId=layoutId;
		iElement.attr("layout-id",layoutId);
		var currentModule=classLoader.getModule(directiveName);
		scope.module=currentModule;
		var itemName=scope.module.getItemName(iElement);
		scope.item=sidebarItems.getItemInFlat(itemName);
		//register layout scope to binManager
		var layoutScope=binManager.createBin(iElement,layoutId);
		$.extend(scope,layoutScope);
		binManager.addBin(scope);
	};
	layoutService.getPdLayoutSidebarItems=function(){
		return layoutService.pdLayoutSidebarItems;
	};
	layoutService.pdLayoutSidebarItems=[
			{
				parentName:"layouts",
				name:pdLayoutDdirectiveName,
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'布局:<input value="6 6" type="text" class="input-mini sidebar-input i-layout-info"/>'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout=''></div>"//required attribute for dynamic compile
			},{
				parentName:"templates",
				unique:true,
				name:"form_poupup",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'弹出式表单'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='form_poupup'></div>",//required attribute for dynamic compile
				templatePath:'form/template-popup.html',
				beforeDelete:function(bin){
					scriptService.removeScript(bin);
				},
				postLinkCallback:function(scope, iElement, iAttrs,controller){
					scriptService.addScriptByDom(scope, iElement);
				}
			},{
				parentName:"templates",
				unique:true,
				name:"form_tab",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'Tab式表单'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='form_tab'></div>",//required attribute for dynamic compile
				templatePath:'form/template-tab.html',
				beforeDelete:function(bin){
					scriptService.removeScript(bin);
				},
				postLinkCallback:function(scope, iElement, iAttrs,controller){
					scriptService.addScriptByDom(scope, iElement);
				}
			},
			{
				parentName:"templates",
				name:"form_section1",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'表单节1'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='form_section1'></div>",//required attribute for dynamic compile
				templatePath:'form/template_form_section1.html'
			},
			{
				parentName:"templates",
				name:"form_section2",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'表单节2'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='form_section2'></div>",//required attribute for dynamic compile
				templatePath:'form/template_form_section2.html'
			}
	];
	serviceModule.factory('layoutService',[function() {
		return layoutService;
	}]);
	return layoutService;
});