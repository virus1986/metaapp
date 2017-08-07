/*global define*/
'use strict';
/**
 * Directive that support entity fields.
 */

define(['angular',"directives/directives","services/appPd","common/classLoader","common/utils"], function(angular,directiveModule,appConfig,classLoader,utils) {
	//attributes that directive not needed,but business requirement.
	var directiveName="pdMetaField";
	var extendAttrs=$.extend({},appConfig.bin.binModuleItemUniqueOptions,{
		name:directiveName,
		editorName:"metaFieldEditor",
		getSidebarItems:function(){
			var items=[];
			$.ajax({
				url:Global.contextPath+"/html_editor/"+Global.entityName+"/metafield/",
				async:false,
				type:"get",
				dataType:"json",
				contentType:"application/json",
				success:function(data){
					if(!data){
						if(console){
							console.log("MetaEntity ["+Global.entityName+"] not exists!");
						}
					}
					if(data&&$.isArray(data)){
						$.each(data,function(i,item){
							var compileHtml=null;
							var sourceCompileHtml=null;
							if(item.type=="1"){
								compileHtml="<div pd-bin='"+directiveName+"' meta:ref='"+item.dataField+"' placeholder='"+item.label+"'/>";
								sourceCompileHtml="<input meta:ref='{{:data.metaRef}}'/>";
							}else{
								compileHtml="<div pd-bin='"+directiveName+"' meta:field='"+item.dataField+"' placeholder='"+item.label+"'/>";
								sourceCompileHtml="<input meta:field='{{:data.metaField}}'/>";
							}
							items.push({
								unique:true,
								parentName:"fields",
								name:item.dataField,
								field:item,
								moduleName:directiveName,
								paletteItemHtml:"<div class=\"i-field\" data-field-display-name=\""+item.label+"\" data-field-name=\""+item.dataField+"\">"+item.label+"</div>"+
								'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
								compileHtml:compileHtml,//required attribute for dynamic compile
								sourceCompileHtml:sourceCompileHtml,
								dropPostProcess:function(newAddItemDom,sidebarItem){//processor after field inserted into document
									var $fieldInput=$(newAddItemDom);
									var label=$fieldInput.attr("placeholder");
									var $thisTd=$fieldInput.parent();
									var fieldSelector="[pd-bin=pdMetaField]";
									if($thisTd.length==1){
										var $parentLabel=$thisTd.prev("th").find("label");
										if($parentLabel.length==0){
											$thisTd.prev("th").append("<label contenteditable='true'>"+label+"</label>");
											return;
										}
										if($parentLabel.text()===label){
											if($thisTd.find(fieldSelector).length>0){
												$parentLabel.text($($thisTd.find(fieldSelector)[0]).attr("placeholder"));
											}else{
												$parentLabel.text("");
											}
										}
										if($thisTd.find(fieldSelector).index($fieldInput)===0){
											$parentLabel.text(label);
										}
									}
								}
							});
						});
					}
				}
			});
			return items;
		},
		getItemName:function(iElement){//iElement: bin postlink element
			var ele=$(iElement).find("["+_.str.dasherize(directiveName)+"]");
			if(ele.length===0){
				ele=$(iElement);
			}
			var name=ele.attr('meta:field');
			if(!name){
				name=ele.attr('meta:ref');
			}
			return name;
		},
		directiveDef:null,
	});
	directiveModule.directive(directiveName, ["$http","binManager","sidebarItems",function($http,binManager,sidebarItems) {
		var directiveDef={
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("metafield/template.html"),
			name:directiveName
		};
		directiveDef.link=function postLink(scope, iElement, iAttrs) {
			var itemName,item;
			if($.isFunction(scope.module.getItemName)&&!iElement.attr("placeholder")){
				itemName=scope.module.getItemName(iElement);
				item=sidebarItems.getItemInFlat(itemName);
				if(!item){
					if(console){
						console.log("Field ["+itemName+"] not exists!");
					}
				}else{
					iElement.attr("placeholder",item.field.label);
				}
			}
		};
		directiveDef.controller=function($scope, $element, $attrs, $transclude) {
			$scope.data=$scope.data||{};
		};
		extendAttrs.directiveDef=directiveDef;
		return directiveDef;
	}]);
	classLoader.register(directiveName,extendAttrs);
	return extendAttrs;
});