define(["require"],function(require){
    return {
    	createNew:function(params)
    	{
    		var options=$.extend(true,{
    			viewId:null,
    			context:null
	    	},params);
	    	
	    	if(!options.context ){
	    		if(options.viewId){
	    			options.context=$("#"+options.viewId);
	    		}else{
	    			options.context=$(document);
	    		}
	    	}
	    	
	    	//关闭权限控制
	    	var turnOffPermission=function (sender,metaObjId){
		       	$.messageBox.confirm({message:i18n.t("permission.turnoffAlert"),
					callback:function(result){
						if(result){
							var url=Global.contextPath+"/portal/menu/turnoff";
							url=Urls.appendParam(url,"id",metaObjId);
							url=Urls.appendDate(url);
							jQuery.restPost(url,null,function(response){
								if(response){
									sender.bootstrapSwitch("toggleActivation");
									var trEl=$(sender).closest("tr");
									$("td:gt(1)",trEl).remove();
									trEl.append(buildNotInControlTd(sender));
								}
							});
						}else{
							sender.bootstrapSwitch("toggleActivation");
							sender.bootstrapSwitch("setState",true,true);
						}
					}
				});
			};
			
			//开启权限控制
			var turnOnPermission=function(sender,metaObjId){
				var url=Global.contextPath+"/portal/menu/turnon";
		       	url=Urls.appendParam(url,"id",metaObjId);
		       	url=Urls.appendDate(url);
		       	jQuery.restPost(url,null,function(response){
		       		if(response){
		       			sender.bootstrapSwitch("toggleActivation");
		       			var trEl=$(sender).closest("tr");
		       			$("td:gt(1)",trEl).remove();
		       			trEl.append(buildInControlTd(sender));
		       			
		       			//开启角色的可访问权限
		       			$(".role-permission",trEl).each(function(){
		       				var me=$(this);
		       				if(me.closest("td").is(":hidden")){
		       					return;
		       				}
		       				addPermission(me);
		       			});
		       		}
				});
			};
			
			//添加权限
			var addPermission=function(sender){
				var trEl=sender.closest("tr");
				var tdEl=sender.closest("td");
				var roleTdEl=$("tr:first",trEl.closest("table")).find("th:eq("+tdEl.index()+")");
				var permissionId=trEl.attr("id");
				var roleId=roleTdEl.attr("id");
				var url=Global.contextPath+"/sec/entities/addrolepermission";
				url=Urls.appendParam(url,"operationId",permissionId);
				url=Urls.appendParam(url,"roleId",roleId);
				url=Urls.appendDate(url);
				jQuery.restPost(url,null,function(response){
					if(response){
						var permissionIcon=Global.iconPath+"led-icons/accept.png";
						sender.find("img").attr("src",permissionIcon);
						sender.attr("data-status",1);
					}
				});
			};
			
			//删除权限
			var delPermission=function(sender){
				var trEl=sender.closest("tr");
				var tdEl=sender.closest("td");
				var roleTdEl=$("tr:first",trEl.closest("table")).find("th:eq("+tdEl.index()+")");
				var permissionId=trEl.attr("id");
				var roleId=roleTdEl.attr("id");
				var url=Global.contextPath+"/sec/entities/delrolepermission";
				url=Urls.appendParam(url,"operationId",permissionId);
				url=Urls.appendParam(url,"roleId",roleId);
				url=Urls.appendDate(url);
				jQuery.restPost(url,null,function(response){
					if(response){
						var permissionIcon=Global.iconPath+"led-icons/cross.png";
						sender.find("img").attr("src",permissionIcon);
						sender.attr("data-status",0);
					}
				});
			};
			
			//添加角色
			var addRoles=function(sender){
				var url=Global.contextPath+"/entities/Role/select?mode=multi";
				$.openLink(url, {
					title : i18n.t("role.select"),
					requestType : "GET"
					}, function() {
						var reVal=jQuery.dialogReturnValue();
						if(!reVal || reVal.length==0) return;
						var tableEl=sender.closest("table");
						addRolesToUI(tableEl,reVal);
				});
			};
			
			var toggleNode=function(sender){
				var trEl=sender.closest("tr");
				var status=sender.attr("data-status");
				var curLevel=trEl.attr("data-level");
				if(status==1){
					sender.attr("data-status","0");
					sender.removeClass("icon-chevron-down");
					sender.addClass("icon-chevron-right");
					var nextTr=trEl.next();
					if(nextTr.length>0 && nextTr.attr("data-level")>curLevel){
						trEl.nextUntil("[data-level="+curLevel+"]").hide();
					}
				}else{
					sender.attr("data-status","1");
					sender.removeClass("icon-chevron-right");
					sender.addClass("icon-chevron-down");
					var nextTr=trEl.next();
					if(nextTr.length>0 && nextTr.attr("data-level")>curLevel){
						trEl.nextUntil("[data-level="+curLevel+"]").show();
					}
				}
			};
			
			var collapseToLevel=function(tableEl,level){
				$("tr:gt(0)",tableEl).each(function(i,el){
					var self=$(this);
					var trLevel=self.attr("data-level");
					var collapseIcon=self.find(".node-collapse");
					if(trLevel==level){
						self.show();
						collapseIcon.attr("data-status","0");
						collapseIcon.removeClass("icon-chevron-down");
						collapseIcon.addClass("icon-chevron-right");
					}else if(trLevel>level){
						self.hide();
						collapseIcon.attr("data-status","0");
						collapseIcon.removeClass("icon-chevron-down");
						collapseIcon.addClass("icon-chevron-right");
					}else{
						self.show();
						collapseIcon.attr("data-status","1");
						collapseIcon.removeClass("icon-chevron-right");
						collapseIcon.addClass("icon-chevron-down");
					}
				});
			};
			
			var addRolesToUI=function(tableEl,roles){
				if(!roles || roles.length==0) return;
				var newRole=[];
				if(options.roles==null || options.roles.length==0){
					$("th:nth-child(3)",tableEl).remove();
					$("td:nth-child(3)",tableEl).remove();
				}
				$.each(roles,function(i,item){
					var isExist=false;
					$.each(options.roles,function(j,role){
						if(role.id==item.id){
							isExist=true;
							return false;
						}
					});						
					if(!isExist){
						newRole.push({id:item.id,name:item.text});
						options.roles.push({id:item.id,name:item.text});
					}
				});
				
				var dataStatus="0";
				var permissionIcon=Global.iconPath+"led-icons/cross.png";
				$("tr",tableEl).each(function(trIndex,el){
					var trEl=$(this);
					var status=trEl.find(".switch").bootstrapSwitch("status");
					var lastTd=$(":last",trEl);
				 	$.each(newRole,function(i,role){
				 		var html="";
				 		if(trIndex==0){
				 			html+="<th class='permission-role width120' id='"+role.id+"'><span>"+role.name+"</span>[<a class='hide-role' href='javascript://'>"+i18n.t("common.hide")+"</a>]</th>";
				 		}else{
				 			if(status){
				 				html+="<td class='width120' style='text-align: center;'><a class='role-permission' title='"+role.name+"'  data-status='"+dataStatus+"'><img src='"+permissionIcon+"'/></a></td>";
				 			}else{
				 				html+="<td class='width120'>&nbsp;</td>";
				 			}
				 		}
				 		lastTd.before(html);
				 	});
				});
				showRoleColumn(tableEl,roles);
			};
			
			var showRoleColumn=function(tableEl,roles){
				$("th",tableEl).each(function(i,el){
					var thRoleId=$(el).attr("id");
					var isDisplay=true;
					if($(el).css("display")=="none"){
						isDisplay=false;
					}
					if(isDisplay){
						return;
					}
					var needShow=false;
					$.each(roles,function(i,role){
						if(role.id==thRoleId){
							needShow=true;
							return false;
						}
					})
					if(needShow){
						$(el).show();
						$("td:nth-child("+(i+1)+")",tableEl).show();
					}
				});
			};
			
			var hideRoleColumn=function(tableEl,roleId){
				var roleIndex=-1;
				$("th",tableEl).each(function(i,el){
					var thRoleId=$(el).attr("id");
					if(roleId==thRoleId){
						roleIndex=i;
						$(el).hide();
						return false;
					}
				});
				if(roleIndex==-1){
					return ;
				}
				$("td:nth-child("+(roleIndex+1)+")",tableEl).hide();
			};
						
			var buildInControlTd=function(sender){
				var dataStatus="0";
				var permissionIcon=Global.iconPath+"led-icons/cross.png";
				var html="";
				if(options.roles==null || options.roles.length==0){
					html+="<td stype='wdith:200px'>&nbsp;</td>";
					html+="<td>&nbsp;</td>";
				}else{
					var tabelEl=$(sender).closest("table");
					$("thead th:gt(1)",tabelEl).each(function(){
						var me=$(this);
						var $td=$("<td class='wdith120' style='text-align: center;'><a class='role-permission'  data-status='"+dataStatus+"'><img src='"+permissionIcon+"'/></a></td>");
						if(me.is(":last-child")){
							$td.removeClass("wdith120");
							$td.html("");
						}
						if(me.is(":hidden")){
							$td.hide();
						}
						html+=$td[0].outerHTML;
					});					
				}				
				return html;
			};
			
			var buildNotInControlTd=function(sender){
				var html="";
				var tabelEl=$(sender).closest("table");
				$("thead th:gt(1)",tabelEl).each(function(){
					var me=$(this);
					var $td=$("<td class='wdith120'>&nbsp;</td>");
					if(me.is(":last-child")){
						$td.removeClass("wdith120");
					}
					if(me.is(":hidden")){
						$td.hide();
					}
					html+=$td[0].outerHTML;
				});
				return html;
			};
			
			
			//构造module,设置对象开放接口，并将module返回
			var module={};
	    	module.options=options;	
	    	module.context=options.context;
	    	module.turnOffPermission=turnOffPermission;
	    	module.turnOnPermission=turnOnPermission;
	    	module.addPermission=addPermission;
	    	module.delPermission=delPermission;
	    	module.addRoles=addRoles;
	    	module.addRolesToUI=addRolesToUI;
	    	module.hideRoleColumn=hideRoleColumn;
	    	module.toggleNode=toggleNode;
	    	module.collapseToLevel=collapseToLevel;
			//将模块返回
			return module;
    	}
    };
});