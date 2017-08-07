define([ 'angular', 'services/services'], function(angular, serviceModule) {
	
	var scriptService={};
	var scriptStack=[];
	scriptService.addScriptByDom=function(scope,iElement){
		var $el=$(iElement);
		var $scripts=$el.find("#script");
		var scripts="";
		if($scripts.length>0){
			$scripts.each(function(){
				scripts+=$(this).text();
			});
			scriptService.addScript(scope,scripts);
			$scripts.remove();
		}
	};
	scriptService.addScript=function(scope,script){
		var scriptItem={};
		if(script){
			scriptItem[scope.layoutId]=true;
			scriptItem["script"]=script;
			scriptStack.push({"base":scope.designer.scriptContent});
			scriptStack.push(scriptItem);
			scope.designer.scriptContent+=script;
		}
	};
	scriptService.removeScript=function(scope){
		var i=0,len=scriptStack.length,scripts=null;
		var j,_item;
		for(;i<len;++i){
			if(scriptStack[i][scope.layoutId]){
				scripts=scriptStack[i-1]["base"];
				for(j=i+2;j<len;j=j+2){
					_item= scriptStack[j];
					scripts+=_item.script;
				}
				scriptStack.splice(i-1,2);
				break;
			}
		}
		
		scope.designer.scriptContent=scripts;
	};
	serviceModule.factory('scriptService',[function() {
		return scriptService;
	}]);
	return scriptService;
});