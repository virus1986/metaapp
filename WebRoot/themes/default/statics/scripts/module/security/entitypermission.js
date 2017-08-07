define(["require"],function(require){
    return {
    	createNew:function(params)
    	{
    		var options=$.extend(true,{
    			viewId:null,
    			context:null,
    			entityName:null
	    	},params);
	    	
	    	if(!options.context ){
	    		if(options.viewId){
	    			options.context=$("#"+options.viewId);
	    		}else{
	    			options.context=$(document);
	    		}
	    	}
	    	
	    	//关闭权限控制
	    	var turnOffPermission=function (sender,permissionId){
		       	$.messageBox.confirm({message:i18n.t("permission.turnoffAlert"),
					callback:function(result){
						if(result){
							var url=Global.contextPath+"/sec/entities/turnoff";
							url=Urls.appendParam(url,"id",permissionId);
							url=Urls.appendDate(url);
							jQuery.restGet(url,null,function(response){
								sender.bootstrapSwitch("toggleActivation");
								var firstTr=null;
								sender.closest("tbody").find("tr").each(function(i,el){
									if(i==0){
										firstTr=$(this);
										firstTr.find("td:gt(1)").remove();
										firstTr.find("td").attr("rowspan",1);
										firstTr.attr("id","");
										$(buildNotInControlTd()).appendTo(firstTr);
										return;
									}
									$(this).remove();
								});
							});
						}else{
							sender.bootstrapSwitch("toggleActivation");
							sender.bootstrapSwitch("setState",true,true);
						}
					}
				});
			};
			
			//开启权限控制
			var turnOnPermission=function(sender,permissionId){
				var url=Global.contextPath+"/sec/entities/turnon";
		       	url=Urls.appendParam(url,"id",permissionId);
		       	url=Urls.appendDate(url);
		       	jQuery.restGet(url,null,function(response){
					 sender.bootstrapSwitch("toggleActivation");
					 var firstTr=sender.closest("tr");
					 var tbodyEl=firstTr.closest("tbody");
					 firstTr.find("td:gt(1)").remove();
					 if(options.roles.length==0){
					 	$(buildInControlTd(null,false)).appendTo(firstTr);
					 }else{
					 	firstTr.find("td").attr("rowspan",options.roles.length);
					 	$.each(options.roles,function(i,role){
					 		if(i==0){
					 			$(buildInControlTd(role,false)).appendTo(firstTr);
					 			firstTr.attr("id",role.id);
					 			return;
					 		}
					 		$("<tr id='"+role.id+"'>"+buildInControlTd(role,false)+"</tr>").appendTo(tbodyEl);
					 	});
					 }
				});
			};
			
			//添加权限
			var addPermission=function(sender){
				chkPermissionRule(sender);
				var trEl=sender.closest("tr");
				var tbodyEl=sender.closest("tbody");
				var permissionId=tbodyEl.attr("id");
				var roleId=trEl.attr("id");
				var ruleId=trEl.find(".permission-rule").attr("data-ruleId");
				var url=Global.contextPath+"/sec/entities/addrolepermission";
				url=Urls.appendParam(url,"operationId",permissionId);
				url=Urls.appendParam(url,"roleId",roleId);
				url=Urls.appendParam(url,"ruleId",ruleId);
				url=Urls.appendDate(url);
				jQuery.restGet(url,null,function(response){
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
				var tbodyEl=sender.closest("tbody");
				var permissionId=tbodyEl.attr("id");
				var roleId=trEl.attr("id");
				var url=Global.contextPath+"/sec/entities/delrolepermission";
				url=Urls.appendParam(url,"operationId",permissionId);
				url=Urls.appendParam(url,"roleId",roleId);
				url=Urls.appendDate(url);
				jQuery.restGet(url,null,function(response){
					if(response){
						var permissionIcon=Global.iconPath+"led-icons/cross.png";
						sender.find("img").attr("src",permissionIcon);
						sender.attr("data-status",0);
						sender.closest("td").next().empty();
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
			}
			
			var addRolesToUI=function(tableEl,roles){
				if(!roles || roles.length==0) return;
				var newRole=[];
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
				$("tbody",tableEl).each(function(i){
					var tbodyEl=$(this);
					var status=tbodyEl.find(".switch").bootstrapSwitch("status");
					if(!status) return;
					var firstTr=tbodyEl.find("tr:first");
					firstTr.find("td:lt(2)").attr("rowspan",options.roles.length);
				 	$.each(newRole,function(i,role){
				 		if(i==0 && typeof(firstTr.attr("id"))=="undefined"){
				 			firstTr.find("td:gt(1)").remove();
				 			firstTr.attr("id",role.id);
				 			$(buildInControlTd(role,false)).appendTo(firstTr);
				 			return;
				 		}
				 		$("<tr id='"+role.id+"'>"+buildInControlTd(role,false)+"</tr>").appendTo(tbodyEl);
				 	});
				});
			}
			
			var populateRuleMenu=function(sender,evt){
				var imageRoot=Global.themePath+"/statics/images/icons/mini"; 
				var option = {width:50, items: []}; 
				if(options.rules!=null && options.rules.length>0){
					$.each(options.rules,function(i,item){
						var icon="/icon_tool_523.gif";
						if(item.scopeType=="4"){
							icon="/icon_tool_185.gif";
						}
						option.items.push({
							icon:imageRoot+icon,
							text:item.name,
							action:function(){
								sender.attr("data-ruleId",item.id);
								sender.find("span").text(item.name);
								addPermission(sender);
							}
						});
					});
				}
					
				option.items.push({type: "splitLine" });
				option.items.push({
					icon:imageRoot+"/icon_tool_087.gif",
					text:i18n.t("permissionrule.new"),
					action:function(){
						var url=Global.contextPath+"/entities/PermissionRule/create?scopeType=2&operationId="+options.entityName;
						$.openLink(url, {
							title : i18n.t("permissionrule.new"),
							requestType : "GET"
							}, function() {
								var reVal=jQuery.dialogReturnValue();
								if(!reVal || reVal.length==0) return;
								reloadPage();
						});
					}
				});
				
				if(option.items.length>0){
					$(evt.target).contextmenu(option);
					$(evt.target).contextmenu().show(evt);
				}
				return false;	
			}
			
			var reloadPage=function(){
				var $tab=options.context.closest(".ui-tabs").tabs();
				$tab.load({id:$tab.getSelectedId()});
			}
			
			//检查是否设置的访问规则
			var chkPermissionRule=function(sender){
				if(options.rules.length==0){
					return;
				}
				var trEl=sender.closest("tr");
				if(trEl.find(".permission-rule").length>0){
					return;
				}
				trEl.find("td:last").empty().append($(buildPermissionRuleHtml(options.rules[options.rules.length-1])));
			}
			
			var buildInControlTd=function(role,hasPermission){
				var dataStatus="1";
				var permissionIcon=Global.iconPath+"led-icons/accept.png";
				if(!hasPermission){
					dataStatus="0";
					permissionIcon=Global.iconPath+"led-icons/cross.png";
				}
				var html="";
				if(role==null){
					html+="<td><a href='javascript://' class='add-roles'>"+i18n.t("role.add")+"</a></td>";
					permissionIcon="";
				}else{
					html+="<td>"+role.name+"</td>";
				}
				html+="<td style='text-align: center;'><a class='role-permission'  data-status='"+dataStatus+"'><img src='"+permissionIcon+"'/></a></td>";
				if(!hasPermission || options.rules.length==0){
					html+="<td>&nbsp;</td>";
				}else{
					html+="<td>"+buildPermissionRuleHtml(options.rules.length-1)+"</td>";
				}
				return html;
			}
			
			var buildNotInControlTd=function(){
				var html="";
				html+="<td>"+i18n.t("permission.turnonInfo")+"</td>";
				html+="<td>&nbsp;</td>";
				html+="<td>&nbsp;</td>";
				return html;
			}
			
			var buildPermissionRuleHtml=function(rule){
				var html="";
				html+="<a class='permission-rule' href='javascript://'  data-ruleId='"+rule.id+"'>";
				html+="		<span>"+rule.name+"</span><b class='caret' style='vertical-align: middle;'></b>";
				html+="</a>";
				return html;
			}
			
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
	    	module.populateRuleMenu=populateRuleMenu;
			//将模块返回
			return module;
    	}
    }
});


