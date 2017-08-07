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
	layoutService.baseFormTemplates={
			"wftwo":"form/template-workflow-withheader-4col.html",
			"wfthree":"form/template-workflow-withheader-6col.html",
			"popup":"form/template-popup.html",
			"tab":"form/template-tab.html"
	};
	function defaultRefuse(event,ui,placeholder,newAddItemDom){
		if(placeholder.prop("tagName").toLowerCase()==="form"){
			return false;
		}
		return true;
	} ;	
	layoutService.pdLayoutSidebarItems=[
			{
				parentName:"layouts",
				name:pdLayoutDdirectiveName,
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'布局:<input value="6 6" type="text" class="input-mini sidebar-input i-layout-info"/>'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout=''></div>"//required attribute for dynamic compile
			},
			{
				parentName:"templates",
				name:"form_section2",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'2列分组'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='form_section2'></div>",//required attribute for dynamic compile
				templatePath:'form/form_group2cols.html',
				refuse:defaultRefuse
			},
			{
				parentName:"templates",
				name:"template_form_section_withheader_col6",
				moduleName:pdLayoutDdirectiveName,
				paletteItemHtml:'3列分组'+
				'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
				compileHtml:"<div pd-layout='template_form_section_withheader_col6'></div>",//required attribute for dynamic compile
				templatePath:'form/form_group3cols.html',
				refuse:defaultRefuse
			}
			
	];
	serviceModule.factory('layoutService',[function() {
		return layoutService;
	}]);
	return layoutService;
});