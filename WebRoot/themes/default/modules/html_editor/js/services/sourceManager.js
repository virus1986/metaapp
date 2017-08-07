define([ 'angular', 'services/services',"services/binManager"], function(angular, serviceModule) {
	
	var sourceManager={};
	serviceModule.factory('sourceManager',["binManager",function(binManager) {
		function cloneDesignerSourceDom(){
			var cloneDom=$("#edit-page-designer").clone();
			var wrapperClass=".i-wrapper";
			cloneDom.find(wrapperClass).children().each(function(){
				var wrapper=$(this).closest(wrapperClass);
				var binId=wrapper.attr("bin-id");
				if(!binId){
					wrapper.remove();
					return;
				}
				var sourceCompileHtml=null;
				var pdBin=wrapper.attr('pd-bin');
				var bin=binManager.findBin(binId);
				var $append=null;
				if(bin){
					var item=bin.item;
					if(item==null){
						wrapper.remove();
						return;
					}
					sourceCompileHtml=item.sourceCompileHtml;
				}
				if(sourceCompileHtml&&sourceCompileHtml!=""){
					if(_.str.include(sourceCompileHtml,"{{")){
						$append= $($.templates(sourceCompileHtml).render({data:bin.data}));
						$append.attr("pd-bin",pdBin);
						$append.removeClass(/^ng/);
					}else{
						$append=$(sourceCompileHtml);
						if(bin.data){
							for(var key in bin.data){
								if(key=="text"){
									$append.html(bin.data[key]);
								}else{
									if(!angular.isObject(bin.data[key])){
										$append.attr(_.str.dasherize(key),bin.data[key]);
									}
								}
							}
						}
					}
				}else{
					$append=$("<div></div>").attr("pd-bin",pdBin);
					if(bin.data){
						for(var key in bin.data){
							if(key=="text"){
								$append.html(bin.data[key]);
							}else{
								if(!angular.isObject(bin.data[key])){
									$append.attr(key,bin.data[key]);
								}
							}
						}
					}
				}
				wrapper.after($append);
				wrapper.remove();
			});
			return cloneDom;
		};
		function sourcePreprocess(cloneDom){
			cloneDom.find('[bin-id],[layout-id]').each(function(i,ele){
				var self=$(ele);
				var id=self.attr("bin-id");
				if(!id||id==""){
					id=self.attr("layout-id");
				}
				if(!!id){
					var bin=binManager.findBin(id);
					//bin.item.sourcePreprocess: used to remove some dirty data from to saved template
					if(bin&&bin.item&&$.isFunction(bin.item.sourcePreprocess)){
						bin.item.sourcePreprocess(self);
					}
				}
			});
		};
		sourceManager.getMainPageDesignerSource=function(){
			var cloneDom=cloneDesignerSourceDom();
			sourcePreprocess(cloneDom);
			binManager.clear();
			return cloneDom.html();
		};	
		sourceManager.getToSavedTemplate=function(){
			var cloneDom=cloneDesignerSourceDom();
			sourcePreprocess(cloneDom);
			var scriptContent=window.pd.$scope.designer.scriptContent;
			if(scriptContent&&scriptContent!=""){
				var $domScript=$("<script th:inline='javascript'></script>");
				if(cloneDom.children().length!=1){
					var $newChildren=$("<div th:id='${viewId}'></div>").append(cloneDom.children());
					cloneDom.empty();
					cloneDom.append($newChildren);
				}
				cloneDom.children().append($domScript);
				$domScript.text(scriptContent);
			}
			var originTemplate=cloneDom.html();
			var tagSelfClosingRE=/(<\s*(area|base|br|col|command|embed|hr|img|input|keygen|link|param|source|track|wbr)\s*(([\w\-:]+)=(".*?"|'.*?'|[^\s>]*))*[^\/>]*)>/gi;
			originTemplate=originTemplate.replace(tagSelfClosingRE,"$1/>");
			return originTemplate;
		};
		return sourceManager;
	}]);
	
	return sourceManager;
});
