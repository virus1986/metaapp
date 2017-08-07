define([ 'angular', 'services/services','services/appPd','common/utils'], function(angular, serviceModule,appConfig,utils) {
	
	var templates={
		layout:function(layoutInfo){
			if(layoutInfo){
				layoutInfo=_.str.trim(layoutInfo," ");
				var t = "";
				var n = layoutInfo.split(" ", 12);
				$.each(n, function(n, r) {
					t += '<div class="span' + r + ' i-column"></div>';
				});
				return t;
			}
		},
		table:function(tableLayoutInfo){
			var row,col;
			var table="<tbody>";
			if(tableLayoutInfo){
				row=tableLayoutInfo.row||4;
				col=tableLayoutInfo.col||4;
				var width=100/col;
				for(var i=0;i<row;++i){
					table+="<tr>";
					for(var j=0;j<col;++j){
						table+="<td class='i-column'>";
						table+="</td>";
					}
					table+="</tr>";
				}
			}
			table+="</tbody>";
			return table;
		},
		tabContent:function(contendDivId,useUrl){
			var content="<div id='"+contendDivId+"' class='hide tab-pane'>" ;
			if(useUrl){
				content="<div id='"+contendDivId+"' class='hide tab-pane-placeholder tab-pane form-horizontal'>" ;
				content+='<div class="control-group">'+
					'<label class="control-label">访问地址：</label>'+
					' <div class="controls">'+
					'  <input type="text" name="href" required="required" style="width:80%;"/>'+
					'  <br/> <span class="label badge-important">可用~代表应用上下文</span>'+
					' </div>'+
					'  </div>';
			}
			content+="</div>";
			return content;
		}
	};	
	
	serviceModule.factory('templates',["$templateCache",function($templateCache) {
		templates.tmpl=function(templateUrl){
			if(!templateUrl){
				alert("template url must not be null");
			}
			if(!_.str.startsWith(templateUrl,"/")){
				templateUrl=utils.resolveTemplateUrl(templateUrl);
			}
			var templateContent=null;
			if($templateCache.get(templateUrl)){
				return $templateCache.get(templateUrl);
			}
			$.ajax({
				url:templateUrl,
				async:false,
				type:"get",
				dataType:"text",
				contentType:"text/plain",
				success:function(data){
					templateContent=data;
					$templateCache.put(templateUrl,templateContent);
				}
			});
			return templateContent;
		};
		return templates;
	}]);
	
	return templates;
});
