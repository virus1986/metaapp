/**
 * 
 */
define(['angular',"directives/directives","directives/pdBinBase","common/utils","services/relationService"], 
		function(angular,directiveModule,BinBase,utils,relationService){
	//attributes that directive not needed,but business requirement.
	var directiveName="pdMetaSlaveTable";
	var ExtendAttrs=BinBase.extend({
		editorName:"metaSlaveTableEditor",
		paletteItemPostProcess:function($el){
			$el.on("enableDrag",function(e){
				$el.draggable("enable");
			});
			$el.on("disableDrag",function(e){
				$el.draggable("disable");
			});
		},
		getSidebarItems:function(){
			var items=[];
			var relationLinks=relationService.relationLinks;
			$.each(relationLinks,function(i,item){
				var compileHtml=null;
				var sourceCompileHtml=null;
				var gridId=item.targetEntityName+"_"+item.relationName+"_slave";
				var attrs="pd-bin='"+directiveName+"' grid-id='"+gridId+"'"+" entityname='"+item.targetEntityName+"'";
				compileHtml="<div "+attrs+" view='associate'/>";
				sourceCompileHtml="<meta:slave-table "+attrs+" data-options=\"{{:data.options}}\"></meta:slave-table>";
				
				items.push({
					unique:true,
					parentName:"relations",
					name:gridId,
					moduleName:directiveName,
					paletteItemHtml:"<div>"+item.relationDisplayName+"从表</div>"+
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
		directiveDef:{
			priority: 0,
			replace: true,
			transclude: false,
			restrict: 'A',
			templateUrl:utils.resolveTemplateUrl("slavetable/template.html"),
			name:this.name,
			link:function postLink(scope, iElement, iAttrs) {
				
			},
			controller:function($scope, $element, $attrs, $transclude,$http) {
				$scope.data=$scope.data||{};
				$scope.data.options=$scope.data.options||"{addTitle:'添加配置',delTitle:'删除',copyTitle:'复制'}";
				$scope.data.gridCols=[];
				var url=Global.contextPath+"/html_editor/"+Global.entityName+"/relation/"+$scope.data.entityname+"/grid";
				$http.get(url).success(function(cols){
					if(cols&&$.isArray(cols)){
						$scope.data.gridCols=cols;
					}
				});
			}
		}
	});
	var extendAttrs=new ExtendAttrs(directiveName);
	directiveModule.directive(directiveName, ["$http","binManager",function($http,binManager) {
		
		return extendAttrs.directiveDef;
	}]);
	return extendAttrs;
});