/*global define*/
'use strict';
/**
 * Directive that support entity fields.
 */

define(['angular',"directives/directives","services/appPd","common/classLoader",
        "common/utils","services/relationService"], 
		function(angular,directiveModule,appConfig,classLoader,utils,relationService) {
	//attributes that directive not needed,but business requirement.
	var directiveName="pdMetaGrid";
	var extendAttrs=$.extend({},appConfig.bin.binModuleItemUniqueOptions,{
		name:directiveName,
		getSidebarItems:function(){
			var items=[];
			var relationLinks=relationService.relationLinks;
			$.each(relationLinks,function(i,item){
				var compileHtml=null;
				var sourceCompileHtml=null;
				var gridId=item.targetEntityName+"_"+item.relationName;
				var attrs=" entityname='"+item.targetEntityName+
				    "' relation='::"+item.relationName+
				    "' relationdisplayname='"+item.relationDisplayName+
				    "' sourceentity='"+item.sourceEntityName+
				    "' th:attr='"+'ref-'+item.reftoFieldName+'=${entity["'+item.refFieldName+'"]}'+
				    "' grid-id='"+gridId+
				    "' ";
				var attrsTmpl=" entityname='{{:data.entityname"+
					"}}' data-relation='{{:data.relation"+
					"}}' data-sourceentity='{{:data.sourceentity"+
					"}}' th:attr='{{:data.thAttr"+
					"}}' relationdisplayname='{{:data.relationdisplayname"+
					"}}' grid-id='{{:data.gridId"+
					"}}' ";
				compileHtml="<div pd-bin='"+directiveName+"'"+attrs+" view='associate'/>";
				sourceCompileHtml="<meta:grid th:if=\"${action=='EDIT'}\" "+attrsTmpl+"></meta:grid>";
				
				items.push({
					unique:true,
					parentName:"relations",
					name:gridId,
					moduleName:directiveName,
					paletteItemHtml:"<div>"+item.relationDisplayName+"</div>"+
					'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
					compileHtml:compileHtml,//required attribute for dynamic compile
					sourceCompileHtml:sourceCompileHtml
				});
			});
			return items;
		},
		getItemName:function(iElement){//iElement: bin postlink element
			var ele=$(iElement).find("[grid-id]");
			var name=ele.attr('grid-id');
			return name;
		},
		directiveDef:null,
	});
	directiveModule.directive(directiveName, ["$http","binManager",function($http,binManager) {
		var directiveDef={
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("metagrid/template.html"),
			name:directiveName
		};
		directiveDef.link=function postLink(scope, iElement, iAttrs) {
		};
		directiveDef.controller=function($scope, $element, $attrs, $transclude) {
			$scope.data=$scope.data||{};
			$scope.data.gridCols=[];
			var url=Global.contextPath+"/html_editor/"+Global.entityName+"/relation/"+$scope.data.entityname+"/grid";
			$http.get(url).success(function(cols){
				if(cols&&$.isArray(cols)){
					$scope.data.gridCols=cols;
				}
			});
		};
		extendAttrs.directiveDef=directiveDef;
		return directiveDef;
	}]);
	classLoader.register(directiveName,extendAttrs);
	return extendAttrs;
});