;(function($){
	window.Page={
			init:function(context,options){
				var $context=$(context);
				if($context.length==0) $context=$("body");
				
				Form.init($context,options);			
				if($context.closest(".ui-tabs-panel")){
					Page.tabPageInit($context,options);
				}
			},
			/*popupPageInit:function(context,options){
				
			},*/
			tabPageInit:function(context,options){
				
			},	
			fitTabContentSize:function(jTab){
				//Grid高度
				var gridHeight =jTab.height() 
					-$(".breadcrumb",jTab).outerHeight(true)
					-$(".custom-fit",jTab).outerHeight(true)
					-$(".table-toolbar",jTab).outerHeight(true)-125;
				$(".ui-jqgrid",jTab).each(function(i){
					var jqGridId=this.id.substr(5);
					var $jqGrid=$("#"+jqGridId);
					var gridParam=$jqGrid.jqGrid("getGridParam");
					if(gridParam.height=="100%" || gridParam.autoHeight){
						$jqGrid.jqGrid("setGridHeight",gridHeight);
						$jqGrid.jqGrid("setGridParam",{"autoHeight":true});
					}
				});
			},
			resizeTabsHeight:function(context){
				//处理两层Tab嵌套情况下，内层Tab高度自适应的问题，内层Tab高度=外层Tab高度-内层Tab同级元素高度-65（Tab控件导航高度等）
				var $container=$(context);
				if($container.closest(".ui-tabs")){
					window.setTimeout(function(){
						//查找与内层Tab同级其它元素的高度
						var siblingsHeight=0;
						$container.find(".ui-tabs").parent().prevAll().each(function(i,el){
							siblingsHeight+=$(this).height();
						});
						//获取外层tab控件
						var parentContainer=$container.closest(".ui-tabs");
						//设置内层Tab的各个panel高度
						$(".ui-tabs-panel",$container).height(parentContainer.height()-siblingsHeight-60);
						
					},200);
				}
			},
			gridComplete:function(){
				var self=this;
				var $grid=$(self);
				var gridParam=$grid.jqGrid("getGridParam");
				if($.isFunction(gridParam.beforeGridComplete)){
					gridParam.beforeGridComplete.call(self);
				}
				if(gridParam.autowidth){
					window.setTimeout(function(){
						var tabPanelContainer=$grid.closest(".ui-tabs-panel");
						if(tabPanelContainer.length>0){
							Page.fitTabContentSize(tabPanelContainer);
						}
						$grid.jqGrid("setGridWidth",gridParam.width);
						$grid.jqGrid("setGridParam",{autowidth:false});
					},100);
				}
				if($.isFunction(gridParam.afterGridComplete)){
					gridParam.afterGridComplete.call(self);
				}
			},
			enableUniform:function(context){
				//样式
				var $uniformed = $(":checkbox,:radio",context).not(".skipThese,.cbox");
				if(!!jQuery.fn.uniform){
					$uniformed.uniform();
				}
				
			},
			autoInputWidth:function(context){
				//自适应texteare的宽度
				$(".autowidth",context).each(function(){
					var parent=$(this).parent().parent();
				});
			},
			updateJQGridPagerIcons :function($grid){
				var $pgTable=$grid.closest(".ui-jqgrid").find(".ui-pg-table");
				var replacement = 
				{
					'ui-icon-seek-first' : ['icon-double-angle-left bigger-140','首页'],
					'ui-icon-seek-prev' : ['icon-angle-left bigger-140','上一页'],
					'ui-icon-seek-next' : ['icon-angle-right bigger-140','下一页'],
					'ui-icon-seek-end' : ['icon-double-angle-right bigger-140','尾页']
				};
				$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon',$pgTable).each(function(){
					var icon = $(this);
					var $class = $.trim(icon.attr('class').replace('ui-icon', ''));			
					if($class in replacement){
						icon.attr('class', 'ui-icon '+replacement[$class][0]);
						icon.attr('title', replacement[$class][1]);
					}
				});
			},
			closeIframe:function(id,val){
				var $iframe=$('#'+id);
				if($iframe.length<1) return;
				var options=$iframe.data("options");
				if($.isFunction(options.callback)){
					options.callback(val);
				}		
				$iframe.animate({left:2000,opacity:0},"slow",function(){
					$iframe.remove();
				});
				
			},
			resultToIframe:function(id,val){
				var $iframe=$('#'+id);
				if($iframe.length<1) return;
				var options=$iframe.data("options")||{};
				if($.isFunction(options.callback)){
					options.callback(val);
				}		
			},
			getDialogHeightByViewObj:function(_viewObj){
				var viewObj=$(_viewObj);
				var contentHeight=viewObj.outerHeight(true),tempHeight;
				var dialogContent=viewObj.closest(".ui-dialog-content");
				var header,footer,tabs;
				if(dialogContent.length>0){
					tempHeight = dialogContent.outerHeight(true);
					header=dialogContent.siblings(".ui-dialog-titlebar").outerHeight(true);
					footer=dialogContent.siblings(".ui-dialog-buttonpane").outerHeight(true);
					tabs=dialogContent.find(".nav-tabs").outerHeight(true);
				}else if(viewObj.closest(".panel").length>0){
					tempHeight = viewObj.closest(".panel").outerHeight(true);
				}else{
					tempHeight = viewObj.parent().parent().outerHeight(true);
				}
				if(tempHeight>contentHeight){
					contentHeight=tempHeight;
				}
				//if(header){contentHeight-=header;}
				//if(footer){contentHeight-=footer;}
				if(tabs){contentHeight-=tabs;}
				return contentHeight||viewObj.outerHeight(true)||400;
			},
			addWfTab:function(context,tabs){//tabs=[{id:,label:,url:}]
				var viewId=$(context).attr("id");
				var $workflowMainTab=$(context).closest(".ui-tabs");
				$.each(tabs,function(i,tab){
					var id=viewId+"-"+tab.id;
					var newTabFrame=$("<div id='"+id+"'  style='text-align: center;' ></div>");
					CommonLoader.loadData(newTabFrame, tab.url);
					$workflowMainTab.append(newTabFrame);
					$workflowMainTab.tabs().add({
						id:id,
						label:tab.label,
						iframe:false,
						closable:false,
						url:"#"+id
					});
					setTimeout(function(){
						$("[tabid='"+id+"']",$workflowMainTab).removeClass("btn").removeClass("mini");
						$(".ui-tab-close",$workflowMainTab).remove();
					},100);
				});
			},
			enableWorkflowDoc:function(context,fileInput,tabTitle,wfInfo){
				var container=$(context).closest("div.workflow-approve-container");
				var viewId=container.attr("id");
				var $fileInput=$("[name='"+fileInput+"']",context);
				var $workflowMainTab=$fileInput.closest(".ui-tabs");
				var docFrameId="docFrame"+viewId;
				if($fileInput.length==0){
					$.messageBox.warn({message:"流程表单未配置正文字段，请联系管理员配置！"});
					return ;
				}
				setTimeout(function(){
					$("[tabid='"+docFrameId+"']",$workflowMainTab).removeClass("btn").removeClass("mini");
					$(".ui-tab-close",$workflowMainTab).remove();
					$workflowMainTab.tabs({
						show:function(event,params){
							if(params.panel.id!=docFrameId){
								return;
							}
							var url=Global.contextPath + "/workflow/process/doc?_inframe=1";
					        url=Urls.appendParam(url,"filepath",$fileInput.val());
					        if(wfInfo&&wfInfo.wfProcId&&wfInfo.wfProcId!=""){
					        	url=Urls.appendParam(url,"businessProcId",wfInfo.wfProcId);
					        }
					        if(wfInfo){
					        	if(!wfInfo.wfType){
					        		url=Urls.appendParam(url,"wftype","draft");
					        	}else{
					        		url=Urls.appendParam(url,"wftype",wfInfo.wfType);
					        	}
					        }
					        if($fileInput.is('[readonly]')){
					        	url=Urls.appendParam(url,"_status","2");
					        }else{
					        	if(wfInfo && wfInfo.wfType!="draft"){
					        		url=Urls.appendParam(url,"_status","1");
					        	}
					        }
					        url=Urls.appendDate(url);
					        $.openLink(url, {
					            showType:'slide',
								requestType : "GET"
								}, function(res){
									$workflowMainTab.tabs().active({id:context.closest(".tab-pane").attr("id")});
									if(res){
										$fileInput.val(res.serverFilePath);
									}
								});
						}
					});
				},100);
			},	
			initTreelistPage:function(options){
				if(!options){
					return;
				}
				var context=options.context;
				var viewId=options.viewId;
				var grid=options.grid;
				var gridParam=grid.jqGrid("getGridParam");
				var relationEntityDisplayName=options.relationEntityDisplayName;
				var sourceEntityDisplayName=options.sourceEntityDisplayName;
				var relationFieldName=options.relationFieldName;
				var relationType=options.relationType;
				var joinEntityName=options.joinEntityName;
				var joinEntityTargetField=options.joinEntityTargetField;
				var mode=options.mode||"multi";
				var isSetTimeout=options.isSetTimeout;
				var treeNavigationSettings=options.treeNavigationSettings||{};
				var isSelfRelation = sourceEntityDisplayName == relationEntityDisplayName ;
				var rootIconUrl=Global.iconPath;
				
				function toTreeNode(nodeId){
					var treeRoot=$("#"+viewId +" .list-tree").find(".bbit-tree-ec-icon");
					if(!treeRoot.hasClass("bbit-tree-elbow-minus")){
						treeRoot.trigger("click");
					}
					var treeIcon=$(".bbit-tree-ec-icon","div[nodeid="+nodeId+"]");
					if(!treeIcon.hasClass("bbit-tree-elbow-minus")){
						treeIcon.trigger("click");
					}
				}
				
				function menuAddAction(){
					var id = this.data.id ;
					
					var callback = isSelfRelation?function(){}:function(returnVal){
						$("#"+viewId +" .list-tree").tree().reload();
						$("#"+viewId +" .list-tree").find("[nodeid='"+id+"']").find(".bbit-tree-ec-icon").click() ;
					} ;
					
					grid.addRecord(null,null,[{key:relationFieldName,value:id}],callback) ;
				}
				
				function menuUpdateAction(){
					var id = this.data.id ;
					grid.editRecord(null,null,id,function(returnVal){
		
					}) ;
				}
				
				function menuDeleteAction(){
					var id = this.data.id ;
					grid.delRecord(null,null, [id], function(returnVal){
		
					}) ;	
				}
				context.uiwidget() ;
				if(isSetTimeout===undefined){
					isSetTimeout=false;
				}
				
				if(gridParam.securityContext && "manage"==gridParam.securityContext.toLowerCase()){
					options.treeLoadUrl=Urls.appendParam(options.treeLoadUrl,"_manage","1");
					options.recursiveQuery=Urls.appendParam(options.recursiveQuery,"_manage","1");
					if(treeNavigationSettings.url){
						treeNavigationSettings.url=Urls.appendParam(treeNavigationSettings.url,"_manage","1");
					}
				}
				
				if(options.showRoot){
					treeNavigationSettings=$.extend({
						rootId   :   'root',
						rootText :   relationEntityDisplayName
					},treeNavigationSettings);
				}
				if(treeNavigationSettings.rootText){
					if(!treeNavigationSettings.rootId){
						treeNavigationSettings.rootId="root";
					}
					treeNavigationSettings.rootText=treeNavigationSettings.rootText.replace("$relationEntity$",relationEntityDisplayName);
				}
				
				var treeConfig=$.extend({
						source 		: 'remote',
						method 		: 'post',
						asyn		: false,
						url			: options.treeLoadUrl,
						expandLevel : 1,
						nodeFormat 	: function(record) {
							var nd = record;
							if(nd.hasChildren|| 
					        		( false == nd.complete && typeof(nd.hasChildren)=='undefined'  )||
					        		(nd.childNodes && nd.childNodes.length>0  ) ){
								record.icon  = rootIconUrl+"mini/icon_tool_064.gif" ;
				        	}else{
				        		record.icon  = rootIconUrl+"mini/icon_tool_145.gif" ;
					        }
							
							return record;
						},
						onNodeClick: function(id, text, record,node){
							var isContinue=true;
							if($.isFunction(options.onNodeClick)){
								isContinue=options.onNodeClick(id, text, record,node);
							}
							if(!isContinue){
								return false;
							}
							if(id != 'root'){
								options.treeSelected={id:id,text:text};
								var newRecursiveQuery=Urls.appendParam(options.recursiveQuery,"rootId",id);
								
								//获取递归子节点ID
								var reqParams=$.extend({type:"post",dataType:"json",contentType:'application/x-www-form-urlencoded'},{});
								jQuery.restAjax(newRecursiveQuery, treeNavigationSettings.params, function(result){
									result = result||[] ;
									var args={grid:grid,context:context,children:result};
									var rules = null;
									if(relationType==="ManyToMany"){
										 rules = [{"field":options.entityName+"."+options.entityIdField,"op":"insql","data":"select "+joinEntityName+"."+relationFieldName
											 +" from "+joinEntityName+" "+joinEntityName+" where "+joinEntityName+"."+joinEntityTargetField+" in('"+result.join("','")+"')"}];
									}else{
										 rules = [{"field":relationFieldName,"op":"insql","data":"'"+result.join("','")+"'"}];
									}
									args.rules = rules ;
									if($.isFunction(options.beforeGridSearch)){
										options.beforeGridSearch(args);
									}						
									grid.multiFieldsQuickSearch(args.rules);
								},reqParams);
							}else{
								grid.multiFieldsQuickSearch([]);
								options.treeSelected=null;
							}
							
						},
						contextMenu : function(record) {
							if(options.select){
								return null;
							}
							//自关联
							var add=i18n.t("common.add");
							if( isSelfRelation ){
								if(record.id == 'root'){
									return {items:[{ text: add, icon: rootIconUrl+"led-icons/add.png",id: record.id, action: menuAddAction}]} ;
								}else{
									return {
										items : [{ text: add, icon: rootIconUrl+"led-icons/add.png",id: record.id, action: menuAddAction},
					                             { text: i18n.t("common.edit"), icon: rootIconUrl+"led-icons/application_edit.png",id: record.id, action: menuUpdateAction },
					                             { type: "splitLine" },
					                             { text: i18n.t("common.delete"), icon: rootIconUrl+"led-icons/delete.png",id: record.id, action: menuDeleteAction }]
									};
								}
							}else{
								return {items:[{ text: add+sourceEntityDisplayName, icon: rootIconUrl+"led-icons/add.png",id: record.id, action: menuAddAction}]} ;
							}
							
						}
				},treeNavigationSettings);		
				$("#"+viewId +" .list-tree").tree(treeConfig);
				
				//绑定Grid上的增、删、改等事件
				var gridCreateUrl=grid.getGridParam("createurl");
				grid.jqGrid("setGridParam",{
					onAdd:function($grid){
						var createUrl= gridCreateUrl;
						if(options.treeSelected){
							createUrl=Urls.appendParam(createUrl,relationFieldName,options.treeSelected.id);
						}
						$grid.jqGrid("setGridParam",{createurl:createUrl});
						return true;
					},
					onAfterImport:function($grid,reVal){
						$("#"+viewId +" .list-tree").tree().reload();
					}
				});
				if(isSelfRelation){
					grid.jqGrid("setGridParam",{
						onAfterAdd:function($grid,reVal){
							$("#"+viewId +" .list-tree").tree().reload();
						},
						onAfterEdit:function($grid,reVal){
							$("#"+viewId +" .list-tree").tree().reload();
						},
						onAfterDelete:function($grid,reVal){
							$("#"+viewId +" .list-tree").tree().reload();
						}
					});
				}		
				
				//选择视图				
				var contentHeight=Page.getDialogHeightByViewObj(context);
				if(options.select){
					$(".selected-rows",context).show();
					if(mode=="single"){
						$(".ui-jqgrid-htable .cbox",context).hide();
					}
					grid.jqGrid("setGridParam",{edit:false,del:false,setup:false,
						beforeSelectRow:function(rowid, e)
						{
							if(options.mode=="single"){
								grid.jqGrid("resetSelection");
							}
						    return true;
						},
						onSelectRow:function(rowid,status,event,reset){
							if(reset){
								options.selectedRow={};
							}
							var refRow=grid.getRowData(rowid);
							var row=grid.getRowDataInitial(rowid);
							if(status){
								if(options.mode == 'single') {
									options.selectedRow = {};
								}
								var text =  row.displayName||row.name||grid.jqGrid("getCell",rowid,3) || grid.jqGrid("getCell",rowid,4) ;
								row.text=text;
								options.selectedRow[rowid]=row;
								options.selectedRow[rowid].refRow=refRow;
								grid.trigger("checkedRow",{id:rowid,text:text});
							}else{
								delete options.selectedRow[rowid];
								grid.trigger("uncheckedRow",rowid);
							}
							var html="";
							$.each(options.selectedRow,function(key,row){
								html+='<span class="label label-success">'+row.text+'</span>';
							});
							$(".selected-rows",context).html(html);
						},
						onSelectAll:function(rowIds,status){
							$.each(rowIds,function(i,rowid){
								if(status){
									var row=grid.getRowDataInitial(rowid);
									var text =  row.displayName||row.name||grid.jqGrid("getCell",rowid,3) || grid.jqGrid("getCell",rowid,4) ;
									row.text=text;
									options.selectedRow[rowid]=row;
									options.selectedRow[rowid].refRow=grid.getRowData(rowid);
									grid.trigger("checkedRow",{id:rowid,text:text});
								}else{
									delete options.selectedRow[rowid];
									grid.trigger("uncheckedRow",rowid);
								}
							});
							var html="";
							$.each(options.selectedRow,function(key,row){
								html+='<span class="label label-success">'+row.text+'</span>';
							});
							$(".selected-rows",context).html(html);
						}
					});
					$(".closeBtn",context).click(function(){
						$(context).dialogClose();
					});	
					var selectedConHeight=$(context).find(".selected-rows").height();
					var gridToolbarHeight=$(context).find(".ui-jqgrid .table-toolbar").height();
					var gridPagerHeight=$(context).find(".ui-jqgrid .ui-jqgrid-pager").height();
					var minus=0;
					if(selectedConHeight){minus+=selectedConHeight;}
					if(gridToolbarHeight){minus+=gridToolbarHeight;}
					if(gridPagerHeight){minus+=gridPagerHeight;}
					grid.jqGrid("setGridHeight",(contentHeight-minus-75)+"px");//228
				}
				
				var resizeGridZInterval=null;
				function resizeGridOnly(){
					var treeContainer=$(".search-tree",context);
					var containerWidth=treeContainer.parent().width();
					if(containerWidth>0&&resizeGridZInterval){
						clearInterval(resizeGridZInterval);
					}
					grid.jqGrid("setGridWidth",containerWidth-treeContainer.width());
				};
				function resizeGrid(){
					var treeContainer=$(".search-tree",context);
					var containerWidth=treeContainer.parent().width();
					if(containerWidth<800 && treeContainer.width()>10){
						var collapsed=$(".collapsed",context);
						treeContainer.find(".list-tree-head").hide();
						treeContainer.find(".list-tree").hide();
						$(".icon-forward",treeContainer).removeClass("icon-forward").addClass("icon-backward");				
						collapsed.data("preWidth",treeContainer.width());
						treeContainer.width(0);
						collapsed.data("status","hide");
					}
					grid.jqGrid("setGridWidth",containerWidth-treeContainer.width());
				}
					
				
				//收缩树
				$(".collapsed",context).click(function(){
					var $me=$(this);
					var isLeftTree=$me.closest(".tree-search-grid-list").hasClass("left");
					var status=$me.data("status")||"show";
					var treeContainer=$me.closest(".search-tree");
					var containerWidth=treeContainer.parent().width();
					if(status=="show"){
						$(".icon-forward",treeContainer).removeClass("icon-forward").addClass("icon-backward");				
						$me.data("preWidth",treeContainer.width());
						treeContainer.find(".list-tree-head").hide();
						treeContainer.find(".list-tree").hide();
						treeContainer.animate({right:-treeContainer.width()},"normal",function(){
							if(isLeftTree){
								$me.css({left:0,right:'auto'});
								treeContainer.width(0).css({left:0});
								$(treeContainer).prev(".grid-con").css({'margin-left':'0px'});
							}else{
								treeContainer.width(0).css({right:0});
								$(treeContainer).prev(".grid-con").css({'margin-right':'0px'});
							}
						});
						grid.jqGrid("setGridWidth",containerWidth);
						$me.data("status","hide");	
					}else{
						$(".icon-backward",treeContainer).removeClass("icon-backward").addClass("icon-forward");
						treeContainer.css({right:-$me.data("preWidth")}).width($me.data("preWidth"));
						treeContainer.find(".list-tree-head").show();
						treeContainer.find(".list-tree").show();
						if(isLeftTree){
							$me.css({left:'auto',right:0});
							treeContainer.animate({left:0},"normal",function(){					
								grid.jqGrid("setGridWidth",containerWidth-treeContainer.width());
								$(treeContainer).prev(".grid-con").css({'margin-left':'200px'});
							});
						}else{
							treeContainer.animate({right:0},"normal",function(){					
								grid.jqGrid("setGridWidth",containerWidth-treeContainer.width());
								$(treeContainer).prev(".grid-con").css({'margin-right':'200px'});
							});
						}
						$me.data("status","show");
					}			
				});
				
				//刷新树列表
				$(".search-tree .head-caption",context).click(function(){
					options.treeSelected=null;
					grid.refreshGrid();					
				});
				
				if(options.resize){
					$(window).resize(function(){
						resizeGrid();
					});
				}
				//resize grid in tab for some special case
				if(isSetTimeout){
					resizeGridZInterval=setInterval(function(){
						resizeGridOnly();
					},100);
				}
				//set height and scroll of left tree
				if($(context).find(".tree-search-grid-list").hasClass("left")){
					setTimeout(function(){
						contentHeight=$(".tree-search-grid-list",context).height()-$(".list-tree-head",context).height();
						$(".list-tree",context).css({'height':contentHeight+'px','overflow-y':'auto'});
					},100);
				}
			},
			initSelectPage:function(options){
				if(!options){
					return;
				}
				var context=options.context;
				var viewId=options.viewId;
				var grid=options.grid;
				var mode=options.mode;
				var gridParam=grid.jqGrid("getGridParam");
				options.selectedRow={};
				grid.jqGrid("setGridParam",{
					beforeSelectRow:function(rowid, e)
					{
						if(options.mode=="single"){
							grid.jqGrid("resetSelection");
						}
					    return true;
					},
					onSelectRow:function(rowid,status,event,reset){
						if(reset){
							options.selectedRow={};
						}
						var refRow=grid.getRowData(rowid);
						var row=grid.getRowDataInitial(rowid);
						if(status){
							if(options.mode == 'single') {
								options.selectedRow = {};
							}
							var text = row.displayName||row.name||grid.jqGrid("getCell",rowid,3) || grid.jqGrid("getCell",rowid,4) ;
							row.text=text;
							options.selectedRow[rowid]=row;
							options.selectedRow[rowid].refRow=refRow;
							grid.trigger("checkedRow",{id:rowid,text:text});
						}else{
							delete options.selectedRow[rowid];
							grid.trigger("uncheckedRow",rowid);
						}
						var html="";
						$.each(options.selectedRow,function(key,row){
							html+='<span class="label label-success">'+row.text+'</span>';
						});
						$(".selected-rows",context).html(html);
						var reVal=new Array();
						$.each(options.selectedRow,function(key,row){
							reVal.push($.extend({
								id:key,
								text:row.text||row.name
							},row));
						});
						grid.trigger("selectedRow",[reVal]);
					},
					onSelectAll:function(rowIds,status){
						$.each(rowIds,function(i,rowid){
							if(status){
								var row=grid.getRowDataInitial(rowid);
								var text = row.displayName||row.name||grid.jqGrid("getCell",rowid,3) || grid.jqGrid("getCell",rowid,4) ;
								row.text=text;
								options.selectedRow[rowid]=row;
								options.selectedRow[rowid].refRow=grid.getRowData(rowid);
								grid.trigger("checkedRow",{id:rowid,text:text});
							}else{
								delete options.selectedRow[rowid];
								grid.trigger("uncheckedRow",rowid);
							}
						});
						var html="";
						$.each(options.selectedRow,function(key,row){
							html+='<span class="label label-success">'+row.text+'</span>';
						});
						$(".selected-rows",context).html(html);
					}
				});
				$(".closeBtn",context).click(function(){
					$(context).dialogClose();
				});	
				$(".saveBtn",context).click(function(){
					if ($.isEmptyObject(options.selectedRow)){ 											
						$.messageBox.warning({message:i18n.t("common.selectRow")});
						return;
					}
					var reVal=new Array();
					$.each(options.selectedRow,function(key,row){
						var refRow=row.refRow;
						reVal.push($.extend({
							id:key,
							text:row.text||row.name
						},row));
					});
					$(context).dialogClose(reVal);
				});
				if(mode=="single"){
					$(".ui-jqgrid-htable .cbox",context).hide();
				}else{
					$(".selected-rows",context).show();
				}
				if(options.singleShow){
					$(".selected-rows",context).show();
				}
			}
		};

		window.SelectForm={
			openDropdownGrid:function(val,input){
				if(input.attr("disabled")=="disabled"){
					return;
				}
				var selectFormUrl=input.attr("data-selecturl");
				var refInputId=input.attr("id").substr(0,input.attr("id").length-5);
				var closestInputs = input.parent().parent().find("input");
				var refinput;
				closestInputs.each(function(index,_refInput){
					if($(_refInput).attr("id")==refInputId){
						refinput = $(_refInput);
					}
				});
				var selectedIds = refinput.val();
				if($.trim(selectedIds)!=""){
					selectFormUrl = Urls.appendParam(selectFormUrl,"selectedIds",selectedIds);
				}
				var params={
					sender:input,
					refInput:refinput,
					url:selectFormUrl,
					returnValue:true
				};
				//input.trigger("beforeSelect",params);
				refinput.trigger("beforeSelect",params);
				if(!params.returnValue){
					return;
				}
				var container=input.parent().next(".lookup-grid-con");
				var containerWidth=input.parent().parent().width();
				container.css({'width':containerWidth,'overflow':'auto'});
				if(container.find(".ui-jqgrid-container").length>0){
					container.show();
				}else{
					CommonLoader.loadData(container,params.url,function(){
						var $gridCon=container.find(".ui-jqgrid-container");
						$gridCon.width(containerWidth).parent().css({"min-width":"inherit","width":containerWidth+"px"});
						var $grid=container.find(".ui-jqgrid-bdiv table");
						$grid.jqGrid("setGridWidth",containerWidth-5);
						container.show();
						if(container.data("hidetoolbar"=="true")){
							container.find(".ui-userdata").hide();
						}
						if(container.data("hidepager"=="true")){
							container.find(".ui-jqgrid-pager").hide();
						}
						$grid.on("checkedRow",function(event,reVal){
							container.hide();
							if(!reVal) return;
							var _id = [] ;
							var _text = [] ;
							var returnVal = null;
							if($.isArray(reVal)){
								$(reVal).each(function(){
									_id.push( this.id ) ;
									_text.push(this.text) ;
								}) ;
								returnVal = reVal[0];
							}else{
								_id.push( reVal.id ) ;
								_text.push(reVal.text) ;
								returnVal = reVal;
							}
							if(refinput){
								if(refinput.val()!=_id.join(",")){
									refinput.val( _id.join(",") );
									refinput.trigger('change', {'sender': input, 'liEl': null,'selectedItem':returnVal});
								}
							}
							if(input.val()!=_text.join(",")){
								input.val( _text.join(",") );
								$.validation.closePrompt(input);
								input.trigger('change', {'sender': input, 'liEl': null,'selectedItem':returnVal});
							}
							refinput.trigger('afterSelectedItem', {'sender': input, 'liEl': null,'selectedItem':returnVal});
						});
						$(document).click(function(e){
							var $target=$(e.target);
							if($target.hasClass("lookup-grid-con")||$target.closest(".lookup-grid-con").length>0){
								return false;
							}
							container.hide();
						});
					});
				}
			},	
			openSelectForm:function(val,input){
				if(input.attr("disabled")=="disabled"){
					return;
				}
				var selectFormUrl=input.attr("data-selecturl");
				var refInputId=input.attr("id").substr(0,input.attr("id").length-5);
				var closestInputs = input.parent().parent().find("input");
				var refinput;
				closestInputs.each(function(index,_refInput){
					if($(_refInput).attr("id")==refInputId){
						refinput = $(_refInput);
					}
				});
				var selectedIds = refinput.val();
				if($.trim(selectedIds)!=""){
					selectFormUrl = Urls.appendParam(selectFormUrl,"selectedIds",selectedIds);
				}
				var params={
					sender:input,
					refInput:refinput,
					url:selectFormUrl,
					returnValue:true
				};
				//input.trigger("beforeSelect",params);
				refinput.trigger("beforeSelect",params);
				if(!params.returnValue){
					return;
				}
				
				jQuery.openLink(params.url,{requestType : "GET"},function(){
					var reVal=jQuery.dialogReturnValue();
					if(!reVal) return;
					//多选处理
					var _id = [] ;
					var _text = [] ;
					$(reVal).each(function(){
						_id.push( this.id ) ;
						_text.push(this.text) ;
					}) ;
					var returnVal = reVal[0];
					if(!$.isArray(reVal)){
						returnVal = reVal;
					}
					if(refinput){
						if(refinput.val()!=_id.join(",")){
							refinput.val( _id.join(",") );
							refinput.trigger('change', {'sender': input, 'liEl': null,'selectedItem':returnVal});
						}
					}
					if(input.val()!=_text.join(",")){
						input.val( _text.join(",") );
						$.validation.closePrompt(input);
						input.trigger('change', {'sender': input, 'liEl': null,'selectedItem':returnVal});
					}
					
					refinput.trigger('afterSelectedItem', {'sender': input, 'liEl': null,'selectedItem':returnVal});
				});
			},
			selectField:function(val,input){
				var selectFormUrl=Global.contextPath+input.attr("data-selecturl");
				var isFullUrl=input.attr("data-fullurl");
				if(isFullUrl=="1"){
					selectFormUrl=input.attr("data-selecturl");
				}
				var fieldName=input.attr("data-selectfield");
				var fieldHiddenName=input.attr("data-selectfield-hidden");
				var hiddenField=input.parent().parent().find("input:hidden");
				input.trigger("click");
				jQuery.openLink(selectFormUrl,{requestType : "GET",height:300},function(){
					var reVal=jQuery.dialogReturnValue();
					if(!reVal) return;
					input.val(reVal[0][fieldName]);
					if(hiddenField&&hiddenField.length===1){
						if(fieldHiddenName){
							hiddenField.val(reVal[0][fieldHiddenName]);
						}else{
							hiddenField.val(reVal[0].id);
						}
					}
				});
			}
		};

		window.TreeOptions={
				treeOptionToFlat:function (treeOption,options){
					treeOption=treeOption||[];
					var len=treeOption.length;
					options=options||{};
					for(var i=0;i<len;++i){
						var ele=treeOption[i];
						options[ele.value]=ele.name;
						var childs=ele.childs||[];
						if(childs.length>0){
							options=TreeOptions.treeOptionToFlat(childs,options);
						}
					}
					return options;
				}
		};

		window.consolelog=function(obj){
			if($.browser.webkit){
				console.log(obj);
			}
		};

		jQuery.fn.extend({
			editCode : function(callback, /* optional */ title, /* optional */ code){
				return this.each(function(){
					$(this).click(function(){
						$.openLink(Global.contextPath + "/code/edit", {
							width :800,
							height: 400,
							title : title || i18n.t("code.edit"),
							requestType : "POST",
							data : {
								code : code || ""
							}
							}, function() {
									var code = jQuery.dialogReturnValue();
									callback(code);
							});
					});
				});
			} 
		});


		/* 全局的字段唯一性验证
		 *-selector元素中必须有：
		 * data-entity标识是哪一个实体的字段
		 * name是字段名称
		 * value是字段值
		 *-可选：
		 * data-url指定请求验证的url，不指定则用默认
		 */
		window.isFieldValUnique=function(selector){
			var errorInfo = {};
			
			var entity = $(selector).attr('data-entity');
			var field = $(selector).attr('name');
			var val = $(selector).val();
			var url = $(selector).attr('data-url');
			var originVal = $(selector).attr('data-value');
			if(originVal == val) return {isError:false,errorInfo:""};
			
			if(!url) {
				url = '/entities/{entity}/isFieldValUnique';
			}
			url = url.replace('{entity}', entity);
			url = Global.contextPath + url;
			$.ajax({
				type: 'POST',
				url: url, 
				data: {field: field, value: val}, 
				success: function(response){
					if (!response) {
						errorInfo= {isError:true,errorInfo:i18n.t("error.valueDuplicate")};
					} else {
						errorInfo= {isError:false,errorInfo:""};
					}
				}, 
				async:false
			});
			return errorInfo;
		};
		window.entityNameUnique=function (caller) {
			var entityName = $(caller).val();
			var contextPath = Global.contextPath;
			var errorInfo = {};
			jQuery.restGet(contextPath + "/validation/entity_name_unique?entity="
					+ entityName, null, function(response) {
				if (!response) {
					errorInfo = {
						isError : true,
						errorInfo : i18n.t("metaentity.entityAlreadyExist")
					};
				} else {
					errorInfo = {
						isError : false,
						errorInfo : ""
					};
				}
			}, {
				async : false,
				isShowLoading : false
			});
			return errorInfo;
		};
		//data-validator="func[formValidatorFunc.ge,name]"
		window.formValidatorFunc={
				gt:function(selector,etype,targetName){
					var errorInfo = {isError:false,errorInfo:""};
					var sourceValue=$(selector).val();
					var ctx="[name='"+targetName+"']";
					var targetDom=$(selector).closest("table").find(ctx);
					if(targetDom.length!=1){
						targetDom=$(selector).closest("form").find(ctx);
					}
					var targetValue=targetDom.val();
					if(sourceValue&&targetValue){
						if(sourceValue<=targetValue){
							errorInfo.isError=true;
							errorInfo.errorInfo="值必须大于目标字段"+targetName+"值";
						}
					}
					return errorInfo;
				},
				ge:function(selector,etype,targetName){
					var errorInfo = {isError:false,errorInfo:""};
					var sourceValue=$(selector).val();
					var ctx="[name='"+targetName+"']";
					var targetDom=$(selector).closest("table").find(ctx);
					if(targetDom.length!=1){
						targetDom=$(selector).closest("form").find(ctx);
					}
					var targetValue=targetDom.val();
					if(sourceValue&&targetValue){
						if(sourceValue<targetValue){
							errorInfo.isError=true;
							errorInfo.errorInfo="值必须大于等于目标字段"+targetName+"值";
						}
					}
					return errorInfo;
				},
				lt:function(selector,etype,targetName){
					var errorInfo = {isError:false,errorInfo:""};
					var sourceValue=$(selector).val();
					var ctx="[name='"+targetName+"']";
					var targetDom=$(selector).closest("table").find(ctx);
					if(targetDom.length!=1){
						targetDom=$(selector).closest("form").find(ctx);
					}
					var targetValue=targetDom.val();
					if(sourceValue&&targetValue){
						if(sourceValue>=targetValue){
							errorInfo.isError=true;
							errorInfo.errorInfo="值必须小于目标字段"+targetName+"值";
						}
					}
					return errorInfo;
				},
				le:function(selector,etype,targetName){
					var errorInfo = {isError:false,errorInfo:""};
					var sourceValue=$(selector).val();
					var ctx="[name='"+targetName+"']";
					var targetDom=$(selector).closest("table").find(ctx);
					if(targetDom.length!=1){
						targetDom=$(selector).closest("form").find(ctx);
					}
					var targetValue=targetDom.val();
					if(sourceValue&&targetValue){
						if(sourceValue>targetValue){
							errorInfo.isError=true;
							errorInfo.errorInfo="值必须小于等于目标字段"+targetName+"值";
						}
					}
					return errorInfo;
				}
		};
		

		window.showCodePreviewBtn =function(parent, code){
			if(!parent || !code) return;
			var prevBtn = parent.children("button.codePreview");
			if(!(prevBtn && prevBtn.length > 0)){
				var btnCodePrev = $("<button class='codePreview btn' type='button' id='codePreview'>"+i18n.t("code.preview")+"</button>");
				parent.prepend(btnCodePrev);
			}
			if(code.length > 500) code = code.substring(0, 500) + "...";
			parent.children("button.codePreview").attr("data-content", code);
			$("#codePreview").popover({trigger : 'hover'});
		}

		window.setCurrentTitle=function(context, title){
			$(context).parents(".ui-dialog").find(".ui-dialog-title").html(title);
		};


		window.TabUtils={
			mainTabId:"#tab-container",
			buildParam:function(param){
				var options={
					context:this.mainTabId,
					callback:null
				};
				if($.isFunction(param)){
					options.callback=param;
				}else if($.isPlainObject(param)){
					options=$.extend(options,param);
				}else{
					if(param){
						options.context=param;
					}			
				}
				return options;
			},
			getMainTab:function(){
				return $(this.mainTabId).tabs();
			},
			getTab:function(options){
				var _tab=null;
				var $context=$(options.context);
				if(options.context){
					if($context.hasClass("ui-tabs")){
						_tab=$context.tabs();
					}else{
						var panel=$context.closest(".ui-tabs-panel");
						if(panel.parent().hasClass("menu-tab-container")){
							_tab=this.getMainTab();
						}else{
							_tab=panel.closest(".ui-tabs").tabs();
						}
					}
				}else{
					_tab=this.getMainTab();
				}
				if(_tab.length==0){
					return null;
				}
				return _tab;
			},
			getSelectedTabId:function(param){
				var options=this.buildParam(param);			
				var _tab=this.getTab(options);
				if(_tab==null){
					return;
				}
				return _tab.getSelectedId();
			},
			closeTab:function(param,selectedId){
				var options=this.buildParam(param);			
				var _tab=this.getTab(options);
				if(_tab==null){
					return;
				}
				_tab.remove({id:selectedId||_tab.getSelectedId()});
				if($.isFunction(options.callback)){
					options.callback.call(_tab);
				}
			},
			reloadTab:function(param){
				var options=this.buildParam(param);			
				var _tab=this.getTab(options);
				if(_tab==null){
					return;
				}
				var selectTabDivId=_tab.getSelectedId();
				var breadcrumb=$("#breadcrumbs ul.breadcrumb",".menu-tab-container #"+selectTabDivId).html();
				var $tabContainer=_tab.load({id:_tab.getSelectedId()});
				$tabContainer.on("contentload",function(){
					if(breadcrumb){
						$("#breadcrumbs ul.breadcrumb",".menu-tab-container #"+selectTabDivId).html(breadcrumb);
					}
				});
				if($.isFunction(options.callback)){
					options.callback.call(_tab);
				}
			},
			reloadTabGrid:function(param){
				var options=this.buildParam(param);			
				var _tab=this.getTab(options);
				if(_tab==null){
					return;
				}
				var selectTabDivId=_tab.getSelectedId();
				var $grid=$(".ui-jqgrid-btable","#"+selectTabDivId);
				if($grid.length<=0){
					this.reloadTab();
					return;
				}		
				$grid.trigger("reloadGrid");		
				if($.isFunction(options.callback)){
					options.callback.call(_tab);
				}
			}
			
		};




		window.AdvanceSearch = {
				initDate: function($elem, field){
					$elem.calendar();
				},
				initDatetime: function($elem, field) {
					$elem.calendar({
						dateFmt: 'yyyy-MM-dd HH:mm:ss'
					});
				},
				initSelect: function($elem, field){
					var options = field.options;
					$.each(options, function(){
						$elem.append($('<option></option').val(this.value).text(this.name));
					});
				},
				configCache: {}
		};

		//window.onerror = function(msg, url, line){
//			consolelog("Error info:"+msg+";File position:"+url+"; Line:"+line);
//			return true;
		//};

		window.EntityUtil = {
			exportEntity: function(entity, format) {
				var isMulti = $.isArray(entity) || (entity.indexOf(',') != -1)? true:false;
				var isXml = format == 'xml'? true: false;
				var url = "";
				if(isMulti){
					if(isXml) {
						//url = Global.contextPath + "/metadata/entity/exportEntity/customed-entities.xml?entities=" + entity;
						url = Global.contextPath + "/metadata/entity/exportEntityByPack/customed-entities.xml?entities=" + entity;
					} else {
						url = Global.contextPath + "/metadata/entity/exportEntity/ExportEntities.java?entities=" + entity;	
					}
				} else {
					if(isXml) {
						url = Global.contextPath + "/metadata/entity/exportEntity/" + entity + ".xml";
					} else {
						url = Global.contextPath + "/metadata/entity/exportEntity/" + entity + ".java";
					}
				}
				window.location.assign(url);
				return;
			},
			getEntity:function(entityName,id){
				var response={};
				try{
					var url=Global.contextPath + "/entities/"+entityName+"/get?id="+id;
					response=jQuery.simpleRequest({
						type: 'get',
						url :url,
						dataType :'json',
						async:false				
					});
				}catch(e){
					
				}
				if(!response){
					response={};
				}
				return response.responseJSON;
			}
		};
}(jQuery));