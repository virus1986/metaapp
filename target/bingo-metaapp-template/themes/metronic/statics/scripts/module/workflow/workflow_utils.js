define(["require"],function(require){
	var $=jQuery;
	return {
		createNew:function(_options){
			var workflowUtils={};
			workflowUtils.selectActors=function(callback,params){//only select user actor
				/*var selectUserUrl=Global.contextPath+"/entities/user/treeList/uamOrganization?view=select_tree_list&refField=orgId&mode=multi";
				$.openLink(selectUserUrl,{width:800},function(users){
					if(users){
						var cActors=[];
						for(var i=0;i<users.length;++i){
							cActors.push({id:users[i].id,name:users[i].text||users[i].name,type:"user"})
						}
						if($.isFunction(callback)){
							callback(cActors);
						}
					}else{
						if($.isFunction(callback)){
							callback(false);
						}
					}
				});*/
				var _params=params||{dept:false,group:false};
				var selectUserUrl=Global.contextPath+"/workflow/process/selectUserOrDeptOrGroup";
				if((!_params.dept)&&(!_params.group)){
					selectUserUrl=Urls.appendParam(selectUserUrl,"hidename","dept,group");
				}else if(!_params.dept){
					selectUserUrl=Urls.appendParam(selectUserUrl,"hidename","dept");
				}else if(!_params.group){
					selectUserUrl=Urls.appendParam(selectUserUrl,"hidename","group");
				}
				
				$.openLink(selectUserUrl,{width:800},function(cActors){
					if(cActors){
						if($.isFunction(callback)){
							callback(cActors);
						}
					}else{
						if($.isFunction(callback)){
							callback(false);
						}
					}
				});
			};
			return workflowUtils;
		}
};
});
