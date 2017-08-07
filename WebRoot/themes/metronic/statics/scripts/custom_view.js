define(["require"],function(require){
	var $=jQuery;
	return {
		createNew:function(_options){
			//视图自定义所有变量定义
			var ViewGlobal={
				gridDefaults:null,
				viewJsonConfig:null,
				listEntity:{//封装grid的部分属性
					toolbar:null,
					filter:null,
					orderby:null,
					script:null ,
					idFields:null,
					quickSearch:null,
					operations:null,
					gridColumns:null,
					manyToOneRefEntities:null
				},
				viewId:null,
				imageRoot:null,
				toolbarTemplate:null,
				menuItemClass:".table-toolbar-icon-item",
			};
			var ViewUrls={
				orderColumnUrl:null,
				selectColumnUrl:null,
				viewCreateBaseUrl:null,
				orderbyConfigUrl:null,
				formConfigUrl:null,
				xmlEditUrl:null,
				refentityConfigUrl:null
			};
			var isViewNeedMerge=false;
			var customBtnMap =  {
				'create':{urlKey:'createUrl',url:'{urlRoot}/{entity}/create'},
				'del':{urlKey:'deleteUrl',url:'{urlRoot}/{entity}/delete'},
				'edit':{urlKey:'editUrl',url:'{urlRoot}/{entity}/edit'},
				'view':{urlKey:'viewUrl',url:'{urlRoot}/{entity}/view'}
			} ;
			var __context=null;
			var columnMap={};
			
			var customViewManager={};
			
			var ViewCustom={
					initParams:function(options){
						//consolelog("开始视图自定义参数 init:---------");
						//consolelog(options);
						function setArrayAttr(parentAttr,attr){
							ViewGlobal.viewJsonConfig[parentAttr]=ViewGlobal.viewJsonConfig[parentAttr]||{};
							var initValue=ViewGlobal.viewJsonConfig[parentAttr][attr];
							if(!$.isArray(initValue)){
								ViewGlobal.viewJsonConfig[parentAttr][attr]=[];
								if(initValue){
									ViewGlobal.viewJsonConfig[parentAttr][attr].push(initValue);
								}
							}
						};
						function setFilterArrayAttr(parentAttr,attr){
							var initValue=ViewGlobal.viewJsonConfig.filter[parentAttr][attr];
							if(!$.isArray(initValue)){
								ViewGlobal.viewJsonConfig.filter[parentAttr][attr]=[];
								if(initValue){
									ViewGlobal.viewJsonConfig.filter[parentAttr][attr].push(initValue);
								}
							}
						};
						
						ViewGlobal.gridDefaults = options.gridDefaults;
						ViewGlobal.viewJsonConfig=options.viewJsonConfig;
						setArrayAttr("columns","column");
						setArrayAttr("contextButtons","button");
						setArrayAttr("toolBarSetting","button");
						var filter=ViewGlobal.viewJsonConfig.filter;
						if(!filter){
							ViewGlobal.viewJsonConfig.filter={filters:{filter:[]},rules:{rule:[]},_groupOp:"and"};
						}else{
							if(!ViewGlobal.viewJsonConfig.filter.rules){
								ViewGlobal.viewJsonConfig.filter.rules={};
							}
							if(!ViewGlobal.viewJsonConfig.filter.filters){
								ViewGlobal.viewJsonConfig.filter.filters={};
							}
							setFilterArrayAttr("filters","filter");
							setFilterArrayAttr("rules","rule");
						}
						var addDialogSettings=ViewGlobal.viewJsonConfig.addDialogSettings;
						if(!addDialogSettings){
							ViewGlobal.viewJsonConfig.addDialogSettings={};
						}
						var editDialogSettings=ViewGlobal.viewJsonConfig.editDialogSettings;
						if(!editDialogSettings){
							ViewGlobal.viewJsonConfig.editDialogSettings={};
						}
						var viewDialogSettings=ViewGlobal.viewJsonConfig.viewDialogSettings;
						if(!viewDialogSettings){
							ViewGlobal.viewJsonConfig.viewDialogSettings={};
						}
						//consolelog(ViewGlobal.viewJsonConfig);
						setArrayAttr("joinEntities","entity");
						
						ViewGlobal.listEntity = options.listEntity;
						ViewGlobal.imageRoot = options.imageRoot;
						ViewGlobal.toolbarTemplate = options.toolbarTemplate;
						
						ViewGlobal.viewId=options.viewId;
						__context="#"+ViewGlobal.viewId;
						
						ViewUrls=options.viewUrls;
						
						customBtnMap.create.url = ViewGlobal.viewJsonConfig._createUrl||customBtnMap.create.url ;
						customBtnMap.edit.url = ViewGlobal.viewJsonConfig._editUrl||customBtnMap.edit.url ;
						customBtnMap.del.url = ViewGlobal.viewJsonConfig._deleteUrl||customBtnMap.del.url ;
						customBtnMap.view.url = ViewGlobal.viewJsonConfig._viewUrl||customBtnMap.view.url ;
						
						//consolelog("视图自定义参数初始化完成:----------");
						//consolelog(ViewGlobal);
					},
					initPage:function(){
						//consolelog("自定义页面初始化开始-------------");
						var columnsSetting = ViewGlobal.viewJsonConfig.columns;
						var columns = columnsSetting?columnsSetting.column:[];
						//初始化columnMap，保存视图列信息的map，用于查询某个列
						$(columns).each(function(){
							var dataField=this._dataField;
							columnMap[dataField] = this ;
							var displayName=ViewCustomTools.getColDisplayName(dataField);
							columnMap[dataField].$displayName=displayName;
						}) ;
						//consolelog("init page:columnMap");
						//consolelog(columnMap);
						ViewCustom.setTitle($("[name='displayName']",__context).val(),__context) ;
						var imageRoot = ViewGlobal.imageRoot;
						var toolbarTemplate = ViewGlobal.toolbarTemplate ;
						var toolBarSetting = ViewGlobal.viewJsonConfig.toolBarSetting;
						var toolbarBtns = toolBarSetting?toolBarSetting.button:[];
						/*$(toolbarBtns).each(function(){
							var name=this._name;
							buttonMap[name]=this;
						});*/
				
						ViewCustom.loadGrid() ;
						
						//该实体所有操作button添加到工具栏（来源于后台生成的模板）
						$(toolbarTemplate).appendTo($(".toolbar-template" , __context).empty()).show() ;
						
						//绑定快捷操作
						$(ViewGlobal.menuItemClass,__context).each(function(){
							 var me = $(this) ;
							 var id = $(this).attr("id") ;
							 var temp  = id.split("_") ;
							 var btnId = temp[1] ;
							 
							 if( ViewCustomTools.getToolbarBtn(toolbarBtns,btnId) ){//有效
							 	me.css({"position":"relative"}).append("<div class='enable-status'>"+
											   "<img  style='position:absolute;right:0px;top:0px;width:14px;' status='enable' src='"
											   +imageRoot+"/icon_tool_092.gif' ></div>") ;
							 }else{
							 	me.css({"position":"relative"}).append("<div class='enable-status'>"+
											   "<img  style='position:absolute;right:0px;top:0px;width:14px;' status='disable' src='"
											   +imageRoot+"/icon_tool_122.gif' ></div>").addClass("ui-state-disabled") ;
							 }
						}) ;
						 
						var _length = toolbarBtns.length ;
						for(var i=_length ;i>0 ;i--){
						 	var barBtn = toolbarBtns[i-1] ;
						 	var actionName = barBtn._name ;
						 	
						 	$("#toolbar_"+actionName,__context).prependTo( $(".table-toolbar-icon ul" ,__context ) ) ;
						}
						 
						
						ViewCustom.bindToolbarBtnEvents();
						ViewCustom.bindPageEvents();
						//consolelog("自定义页面初始化结束-----------");
					},
					bindToolbarBtnEvents:function(){
						var imageRoot = ViewGlobal.imageRoot;
						var draggEl = null ;
						$(ViewGlobal.menuItemClass,__context).unbind("click").bind("click",function(){
							 var me = $(this).find(">.enable-status") ;
							 var status = $(this).find("img[status]").attr("status") ;
							 if( status == "enable"){
								 me.empty()
								   .prepend("<img  status='disable' style='position:absolute;right:0px;top:0px;width:14px;' src='"+imageRoot+"/icon_tool_122.gif' >").parent().addClass("ui-state-disabled")  ;
							 }else{
								 me.empty()
								   .prepend("<img  status='enable' style='position:absolute;right:0px;top:0px;width:14px;' src='"+imageRoot+"/icon_tool_092.gif' >").parent().removeClass("ui-state-disabled")  ;
							 }
				
						 }) ;
						$(ViewGlobal.menuItemClass,__context).draggable({
								helper:"clone",
								start:function(event,ui){
									draggEl = this ;
									$(ui.helper).addClass( "toolbar-action-dragging" ) ;
								}
						}) ;
						$(ViewGlobal.menuItemClass,__context).droppable({
							accept:ViewGlobal.menuItemClass,
							drop: function( event, ui ) {
								$( this ).removeClass("toolbar-action-hover" ) ;
								$(this).before(draggEl) ;
							},
							over: function( event, ui ) {
								$(this).addClass( "toolbar-action-hover" ) ;
							},
							out: function(event,ui){
								$(this).removeClass("toolbar-action-hover" ) ;
							}
						}) ;
					},
					loadGrid:function(){//修改ViewGlobal.gridDefaults的colModel和colNames，重加载列表
						ViewCustomTools.cols2colModel();
						ViewCustom.initGrid();
						ViewCustom.bindToolbarBtnEvents();
					},
					initGrid : function(context){
						var gridDefaults=ViewGlobal.gridDefaults;
						//consolelog("初始化列表：列表参数");
						//consolelog(gridDefaults);
						$('#grid_custom__',__context).GridUnload();
						$("#logarea").html( $.json.encode(gridDefaults.colModel) ) ;
						gridDefaults.resizeStop=function(newwidth, index){
							var name=gridDefaults.colModel[index].name;
							columnMap[name]._width=newwidth;
						};
						$('#grid_custom__',__context).jqGrid(gridDefaults).navGrid('#grid_custom___pager',{
							"add" : false,
							"cloneToTop" : false,
							"del" : false,
							"edit" : false,
							"position" : "left",
							"refresh" : false,
							"search" : false,
							"view" : false,
							"toggle" : false
						},jQuery('#grid_custom__',__context).getGridParam('editDialogOptions'),
						jQuery('#grid_custom__',__context).getGridParam('addDialogOptions'),
						jQuery('#grid_custom__',__context).getGridParam('delDialogOptions'),
						jQuery('#grid_custom__',__context).getGridParam('searchDialogOptions'))
												  .bindKeys()
												  .initCustToolBar("toolbar_grid_custom__");
						$(ViewGlobal.menuItemClass,__context).unbind("click") ;
						$(".ui-jqgrid-sortable",__context).unbind("click") ;
												  
						//grid_custom___name
						$( gridDefaults.colModel ).each(function(){
							var id = "grid_custom___"+this.name ;
							var colHead=$("#"+id);
							var gridColumn=columnMap[this.name];
							//consolelog(columnMap);
							//consolelog("columnMap获取id为的字段:"+this.name);
							//consolelog(gridColumn);
							if((gridColumn._visible===false||gridColumn._visible==="false")&&colHead.length>0){
								colHead.tooltip({title:i18n.t("view.custom.hideColTitle"),placement:"bottom"});
								colHead.css({color:"#BDCFDC",background:"#F7F9FB"});
						 	}
							ViewCustom.bindColumnContext($("[id='"+id+"']"),gridColumn) ;
						}) ;
						//consolelog("in initGrid:columnMap");
						//consolelog(columnMap);
						//consolelog("end initGrid");
						
						jQuery(".ui-jqgrid-hdiv",__context).height("200px") ;
					},
					bindColumnContext:function(columnEl,column){
						var fieldName=column._dataField;
						var imageRoot=ViewGlobal.imageRoot;
						var icon = {
							'left':imageRoot+'/arrowhead2.gif',
							'center':imageRoot+'/icon_tool_062.gif',
							'right':imageRoot+'/arrowhead.gif',
							'del':imageRoot+"/icon_tool_171.gif",
							'setup':imageRoot+'/tools2.gif'
						} ;
				
						$(columnEl).attr("data-field-key",fieldName).mouseenter(function(){
						 	 var me = $(this) ;
						 	 if(me.find(".icon-chevron-down").length<1){
						 		 me.find(">div").append("<i class='icon-chevron-down' style='margin-right:2px;float:right;'></i>");
						 	 }
						 	 me.find(".icon-chevron-down").show();
							 var option = { 
						     width: 100, 
						     items: [
							      {text: i18n.t("style.align.left"),icon:icon.left,  action: function(){
							      		setTextAlign("Left",me) ;
								      }},
								      {text: i18n.t("style.align.right"),icon:icon.right,  action: function(){
							      		setTextAlign("Right",me) ;
								      }},
								      {text: i18n.t("style.align.center"),icon:icon.center,  action: function(){
							      		setTextAlign("Center",me) ;
								      }},
							      {type: "splitLine" },
							      {text: i18n.t("common.remove"),icon:icon.del,   action: function(){
							      		var fieldName=column._dataField;
							      		var del=false;
										if( columnMap[fieldName] ) 
										{
											columnMap[fieldName].$isDelete=true;
											del=true;
										}
										if(del){
											Actions.removeColumns(columnMap) ;
										}
										me.remove() ;
							      }},
							      {type: "splitLine" },
							      {text: i18n.t("common.detailSetup"),icon:icon.setup,   action: function(){
							      		var viewColAttrsUrl=Global.contextPath+"/metadata/uitemplate/viewColAttrs";
							      		var attrs=column;
							      		$.openLink(viewColAttrsUrl,{attrs:attrs},function(attrs){
							      			if(attrs){
							      				column=attrs;
							      				//consolelog("设置列属性后:columnMap");
							      				//consolelog(columnMap);
							      				//consolelog("end 设置列属性");
							      				resetColHeaders(column,me);
											}
							      		});
							      }}
							     ],
							     eventType:'click'
							  }; 
							  $(this).contextmenu(option);
							  
							  function setTextAlign(align,target){
							  	 target.css("text-align",align) ;
							  	 column._textAlign= align ;
							  };
							  function setVisible(visible,target){
								 if(visible===false||visible==="false"){
									 target.tooltip({title:i18n.t("view.custom.hideColTitle"),placement:"bottom"});
									 target.css({color:"#BDCFDC",background:"#F7F9FB"});
								 }else{
									 target.tooltip("destroy");
									 target.css({color:"#333",background:"none"});
								 }
							  };
							  function resetColHeaders(column,target){
								  var textAlign=column._textAlign;
								  setTextAlign(textAlign,target);
								  var visible=column._visible;
								  setVisible(visible,target);
							  };
						 }).mouseleave(function(){
							 var me = $(this) ;
							 me.find(".icon-chevron-down").hide();
							 me.attr("title","") ;
						 })   ;
					},
					setTitle: function(displayName){
						$(__context).parents(".ui-dialog:first").find(".win-title").html("["+displayName+"]") ;
					},
					getToolbars: function(){//获取视图已经启用的buttons
						var buttons = [] ;
						$(".table-toolbar-icon" , __context).find("[status],[status] .dropdown-menu li").each(function(){
							var status = $(this).attr("status") ;
							if(status != 'disable'){
								var id = $(this).parents("li:first").attr("id") ;
								var temp  = id.split("_") ;
								var btnId = temp[1] ;
								buttons.push(btnId) ;
							}
						}) ;
						
						ViewGlobal.listEntity.toolbar = buttons ;
						return ViewGlobal.listEntity.toolbar ;
					},
					getColumns:function(){
						var colKeys = [] ;
						$("[data-field-key]",__context).each(function(){
							var key = $(this).attr("data-field-key") ;
							colKeys.push(key) ;
						}) ;
						return colKeys ;
					},
					bindPageEvents:function(){
						//列排序
						$(".order-column-action",__context).click(function(){
							//获取已经选择列
							var colKeys = ViewCustom.getColumns() ;
							//consolelog("点击排序后：");
							//consolelog(colKeys);
							//consolelog(columnMap);
						    jQuery.openLink(ViewUrls.orderColumnUrl,{
								showType:"pop-up",
								width:300,
								height:300,
								title:i18n.t("view.custom.colDisplayOrderTitle"),
								colKeys:colKeys,
								columnMap:columnMap
							},function(returnVal){
								if(returnVal){
									var newColumns = [] ;
									$(returnVal).each(function(){
										newColumns.push(columnMap[this]) ;
									}) ;
									Actions.orderColumns(newColumns) ;
								}
							}) ;
							return false ;
						}) ;
						//选择字段
						$(".select-column-action",__context).click(function(){
							//consolelog("选择字段后：");
						 	var colKeys = ViewCustom.getColumns();
						    jQuery.openLink(ViewUrls.selectColumnUrl,{
								showType:"pop-up",
								width:500,
								height:300,
								title:i18n.t("view.custom.addColumn"),
								colKeys:colKeys
							},function(returnVal){
								//{"isIdentity":"false","isSystem":"false","name":"Name","displayName":"名称","entity":"customer"}
								var add=false;
								$(returnVal||[]).each(function(){
									if( columnMap[this.name] ) {
										return ;
									};
									columnMap[this.name] = ViewCustomTools.metaField2columnMapEle(this);
									add=true;
								}) ;
								if(add){
									Actions.selectColumns(columnMap);
								}
							}) ;
							return false ;
						}) ;
						//移除字段
						$(".remove-column-action",__context).click(function(){
						 	var colKeys = ViewCustom.getColumns() ;
						    jQuery.openLink(ViewUrls.selectColumnUrl,{
								showType:"pop-up",
								width:500,
								height:300,
								title:i18n.t("view.custom.removeColumn"),
								colKeys:colKeys,
								type:"removeColumn"
							},function(deleteCols){
								var del=false;
								$(deleteCols||[]).each(function(){
									if( columnMap[this.name] ) 
									{
										columnMap[this.name].$isDelete=true;
										del=true;
									}
								}) ;
								if(del){
									Actions.removeColumns(columnMap) ;
								}
							}) ;
							return false ;
						}) ;
						//视图属性设置
						$(".prop-view-action",__context).click(function(){
						    jQuery.openLink(ViewUrls.viewCreateBaseUrl,{
								showType:"pop-up",
								width:300,
								height:300,
								title:i18n.t("view.custom.updateTitle")
							},function(args){
								if(args==null) return;
								var displayName = args.displayName ;
								$("[name='displayName']",__context).val(displayName) ;
								ViewCustom.setTitle(displayName) ;
							}) ;
							return false ;
						}) ;
						//默认过滤条件设置
						$(".filter-column-action",__context).click(function(){
							/*var ps = jQuery('#grid_custom__',__context).getGridParam('searchDialogOptions') ;
							ps.onSearch = function(){
								ViewGlobal.viewJsonConfig.filter =JSON.parse(this.p.postData.filters)   ;
								//consolelog("点击保存条件：");
								//consolelog(this.p.postData.filters);
								//consolelog(ViewGlobal.viewJsonConfig.filter);
							};
							//consolelog("点击过滤条件设置：");
							//consolelog(ViewGlobal.viewJsonConfig.filter);
							ps.filters =  JSON.stringify(ViewGlobal.viewJsonConfig.filter) ;
							jQuery('#grid_custom__',__context).configFilterGrid( ps );
							return false ;*/
							var filters = ViewGlobal.listEntity.filter;
							var entityName = ViewGlobal.gridDefaults.entityName;
							var _joinEntities=ViewCustomTools.getJoinEntities();
							$.openLink(Global.contextPath + "/advance_search", {
								data : {
									entity : entityName,
									joinEntities:_joinEntities.join(" "),
									initJson: JSON.stringify(filters),
									isDesign: true
								} 
							}, function(res){
								if(res) {
									ViewGlobal.listEntity.filter = res;
									isViewNeedMerge = true;
								}
							});
							return;
						 }) ;
						//默认排序条件设置
						$(".orderby-column-action",__context).click(function(){
							//获取已经选择列
							//consolelog("配置排序:ViewGlobal.listEntity.orderby");
							//consolelog(ViewGlobal.listEntity.orderby);
							//var colKeys = ViewCustom.getColumns();
							var _joinEntities=ViewCustomTools.getJoinEntities();
							var entity=ViewGlobal.gridDefaults.entityName;
							var params="?entity="+entity+"&joinEntities="+_joinEntities.join(",");
							var allFieldsDataUrl=Global.contextPath+"/metadata/field/query_select_paged"+params;
						    jQuery.openLink(ViewUrls.orderbyConfigUrl,{
								showType:"pop-up",
								width:300,
								height:300,
								title:i18n.t("view.custom.configOrderTitle"),
								//colKeys:colKeys,
								//columnMap:columnMap,
								allFieldsDataUrl:allFieldsDataUrl,
								orderby:ViewGlobal.listEntity.orderby
							},function(returnVal){
								//consolelog("排序设置后：");
								//consolelog(ViewGlobal.listEntity.orderby);
								//consolelog(returnVal);
								if(returnVal){
									isViewNeedMerge=true;
									//[{'direction':{'$type':'OrderDirection','$name':'ASC'},'field':'displayOrder','orderString':'displayOrder ASC'}];
									var orderBy = [] ;
									if(returnVal["first-field"]){
										var key = returnVal["first-field"] ;
										var value = returnVal["first-order"]||"ASC" ;
										orderBy.push({'direction':value,'field':key}) ;
									}

									if(returnVal["second-field"]){
										var key = returnVal["second-field"] ;
										var value =  returnVal["second-order"]||"ASC"  ;
										orderBy.push({'direction':value,'field':key}) ;
									}

									ViewGlobal.listEntity.orderby = orderBy ;
									//consolelog("ViewGlobal.listEntity.orderby:");
									//consolelog(ViewGlobal.listEntity.orderby);
								}
							}) ;
							return false ;
						}) ;
						//快捷搜索列设置
						$(".quicksearch-column-action" , __context).click(function(){
						    jQuery.openLink(ViewUrls.selectColumnUrl,{
								showType:"pop-up",
								width:500,
								height:300,
								title:i18n.t("view.custom.configQuickSearchTitle"),
								quickSearch: ViewGlobal.listEntity.quickSearch,
							},function(returnVal){
								if( returnVal == null ) {
									return;
								} ;
								isViewNeedMerge=true;
								var _quickSearchColumn = [] ;
								$(returnVal||[]).each(function(){
									_quickSearchColumn.push({dataField:this.name}) ;
								}) ;
								ViewGlobal.listEntity.quickSearch =  {column:_quickSearchColumn} ;
								//consolelog("配置快捷搜索后：ViewGlobal.listEntity.quickSearch");
								//consolelog(ViewGlobal.listEntity.quickSearch);
							}) ;
							return false ;
						}) ;
						//视图表单设置
						$(".form-column-action",__context).click(function(){//formUrlConfig
							
							jQuery.openLink(ViewUrls.formConfigUrl,{
								 	showType:"pop-up",
								 	customBtnMap:customBtnMap,
								 	toolbars:ViewCustom.getToolbars(),
								 	viewJsonConfig: ViewGlobal.viewJsonConfig
								 },
								 function(res){
								 	 var result = res;
								 	 if(result){
								 		ViewGlobal.viewJsonConfig._createUrl=customBtnMap.create.url = result.create ;
								 		ViewGlobal.viewJsonConfig._editUrl=customBtnMap.edit.url = result.edit ;
								 		ViewGlobal.viewJsonConfig._viewUrl=customBtnMap.view.url = result.view ;
								 		ViewGlobal.viewJsonConfig.addDialogSettings._showType = result.createShowType;
								 		ViewGlobal.viewJsonConfig.editDialogSettings._showType = result.editShowType;
								 		ViewGlobal.viewJsonConfig.viewDialogSettings._showType = result.viewShowType;
								 	 }
								 }
							 );
						});
						//应用实体配置
						$(".refentity-config-action",__context).click(function(){
							jQuery.openLink(ViewUrls.refentityConfigUrl,{
								 showType:"pop-up",
								 requestType:"POST",
								 manyToOneRefEntities:ViewGlobal.listEntity.manyToOneRefEntities,
								 joinEntities:ViewGlobal.viewJsonConfig.joinEntities.entity
								 },
								 function(joinEntities){
									 if(joinEntities){
										 ViewGlobal.viewJsonConfig.joinEntities.entity=joinEntities;
										 var entity=ViewGlobal.gridDefaults.entityName;
										 var _joinEntities=[];
										 $.each(joinEntities,function(i,v){
											 _joinEntities.push(v._name);
										 });
										 var params="?entity="+entity+"&joinEntities="+_joinEntities.join(",");
										 ViewUrls.selectColumnUrl=Global.contextPath+"/metadata/field/select"+params;
									 }
								 }
							 );
						});
						//视图xml配置源码编辑
						$(".xml-action",__context).click(function(){
							 //consolelog("in xml-action");
							 if(isViewNeedMerge){
								 Actions.mergeViewXml();
							 }
							 jQuery.openLink(ViewUrls.xmlEditUrl,{
								 showType:"pop-up",
								 xmlConfig:ViewCustomTools.getViewXml(),
								 requestType:"POST"
								 },
								 function(xmlContent){
									 if(xmlContent){
										isViewNeedMerge=false;
										var viewJsonConfig=JSON.parse(xml2json(xmlContent)).grid;
										ViewGlobal.viewJsonConfig=viewJsonConfig;
									 }
								 }
							 );
						}) ;
						//保存按钮事件
						var ___context=$(__context).closest(".ui-dialog-wrapper");
						if(___context.length<1){
							___context=__context;
						}
						$(".saveEntityView", ___context).click(function(){
							var me = this ;
							if(isViewNeedMerge){
								Actions.mergeViewXml();
							}
							var xmlContent =ViewCustomTools.getViewXml();
							if(!xmlContent){
								$.messageBox.info({message:i18n.t("view.custom.configNull")});
							}
							$("[name=configData]",__context).val(xmlContent);
							var valInfo = $.validation.validate("#createViewLayoutForm") ;
							if( valInfo.isError ) {
								return false;
							}
							
							var url=$("#createViewLayoutForm", __context).attr("action");
							
							var data=$("#createViewLayoutForm", __context).toJson();
							var btnSelf=$(this);
							jQuery.restPost(url,data,function(response){
								if(typeof response =="string"){
									$.messageBox.error({message:response});
								}else if(response){
									var setUp=$(me).attr("data-setUp");
									if(setUp==1){
										var previewUrl=response.url||$("[name=url]",__context).val();
										var version=response.version;
										if(!version){
											version=$("[name=version]",__context).val()||0;
											version=parseInt(version)+1;
										}
										previewUrl=previewUrl.replace(/~/,Global.contextPath);
										previewUrl=Urls.urlParam(previewUrl,[{key:"_d",value:"preview"},{key:"action",value:"preview"}]);
										if(version){
											previewUrl=Urls.urlParam(previewUrl,[{key:"version",value:version}]);
										}
										$.openLink(previewUrl,{showType:'tab',title:i18n.t("common.preview"),width:1000});
									}
									$(me).dialogClose(response);
								}
							},{beforeSend:function(xhr){
								CommonUtil.showLoading(__context,i18n.t("common.processing"));
								btnSelf.attr("disabled","disabled");
								btnSelf.addClass("disabled");
							  },complete:function(xhr,textStatus){
									CommonUtil.hiddenLoading();
									btnSelf.removeAttr("disabled");
									btnSelf.removeClass("disabled");
							  }
							});
						}) ;
						$(".saveAndPublishEntityView", ___context).click(function(){
							var me = this ;
							if(isViewNeedMerge){
								Actions.mergeViewXml();
							}
							var xmlContent =ViewCustomTools.getViewXml();
							if(!xmlContent){
								$.messageBox.info({message:i18n.t("view.custom.configNull")});
							}
							$("[name=configData]",__context).val(xmlContent);
							var valInfo = $.validation.validate("#createViewLayoutForm") ;
							if( valInfo.isError ) {
								return false;
							}
							
							var url=$("#createViewLayoutForm", __context).attr("action");
							url=Urls.urlParam(url,[{key:'saveAndPublish',value:1}]);
							var data=$("#createViewLayoutForm", __context).toJson();
							var btnSelf=$(this);
							jQuery.restPost(url,data,function(response){
								if(typeof response =="string"){
									$.messageBox.error({message:response});
								}else if(response){
									$(me).dialogClose(response);
								}
							},{beforeSend:function(xhr){
								CommonUtil.showLoading(__context,i18n.t("common.processing"));
								btnSelf.attr("disabled","disabled");
								btnSelf.addClass("disabled");
							  },complete:function(xhr,textStatus){
									CommonUtil.hiddenLoading();
									btnSelf.removeAttr("disabled");
									btnSelf.removeClass("disabled");
							  }
							});
						}) ;
						//取消按钮事件
						$(".closeBtn", ___context).click(function(){
							$(this).dialogClose();
						}) ;
					}
					
				};
			//工具类方法定义
			var ViewCustomTools={
				getToolbarBtn:function(btns , btnId){
					var result = null ;
					$(btns).each(function(){
						if(this._name == btnId) {
							result = this ;
							return false;
						} 
					}) ;
					return result ;
				},
				getColumnDetail:function(dataField){
					var gridColumns=ViewGlobal.listEntity.gridColumns||[];
					var len=gridColumns.length;
					for(var i=0;i<len;++i){
						var _columnDetail=gridColumns[i];
						if(dataField==_columnDetail.dataField){
							return _columnDetail;
						}
					}
					return null;
				},
				col2colModelEle:function(col){
					var col=col||{};
					var key=col._dataField;
					var colModelEle={name:key,index:key,width:col._width};
					return colModelEle;
				},
				cols2colModel:function(){
					var cols = ViewGlobal.viewJsonConfig.columns.column;
					
					var col=null,text=null,colNames=[],colModel=[];
					for(var i=0;i<cols.length;++i){
						//consolelog(col);
						col=cols[i];
						text=col.$displayName;
						colNames.push(text);
						colModel.push(ViewCustomTools.col2colModelEle(col));
					}
					ViewGlobal.gridDefaults.colNames= colNames;
					ViewGlobal.gridDefaults.colModel= colModel;
				},
				getColDisplayName:function(dataField){
					var detail=ViewCustomTools.getColumnDetail(dataField);
					return detail?detail.headerText:dataField;
				},
				columnMap2cols:function(newColumnMap){
					//TODO:要保证主键字段在newColumnMap中
					var newColumns=[];
					for(var key in newColumnMap){
						var newColumn=newColumnMap[key];
						if(!newColumn.$isDelete){
							newColumns.push(newColumn);
						}
					}
					ViewGlobal.viewJsonConfig.columns.column=newColumns;
					ViewCustom.loadGrid();
				},
				metaField2columnMapEle:function(metafield){
					//{"isIdentity":"false","isSystem":"false","name":"Name","displayName":"名称","entity":"customer"}
					return {$displayName: metafield.displayName,
							_dataField:  metafield.name,
							_editable: "true",
							_fixed: "false",
							_frozen: "false",
							_primaryKey: "false",
							_resizable: "true",
							_searchable: "true",
							_textAlign: "Left",
							_visible: "true",
							_width: "150"
						};
				},
				getViewXml:function(){
					//consolelog("获取列表配置xml：");
					//consolelog(ViewGlobal.viewJsonConfig);
					Actions.setToolbarBtns();
					var content=[];
					content.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n') ;
					var gridXml=json2xml({grid:ViewGlobal.viewJsonConfig},"_","    ",{ignoreTag:"$"});
					content.push(gridXml);
					var xmlString=content.join("");
					//consolelog("列表xml配置为：\n"+xmlString);
					return xmlString;
				},
				getJoinEntities:function(){
					var _joinEntities=[];
					$.each(ViewGlobal.viewJsonConfig.joinEntities.entity,function(i,v){
						 _joinEntities.push(v._name);
					});
					return _joinEntities;
				}
			};
			//操作方法定义
			var Actions={
				orderColumns:function(newColumns){
					//consolelog("in Actions.orderColumns:");
					//consolelog(newColumns);
					ViewGlobal.viewJsonConfig.columns.column=newColumns;
					ViewCustom.loadGrid();
					//consolelog("End Actions.orderColumns:");
				},
				selectColumns:function(newColumnMap){
					//consolelog("in Actions.selectColumns:");
					//consolelog(newColumnMap);
					ViewCustomTools.columnMap2cols(newColumnMap);
					//consolelog("End Actions.selectColumns:");
				},
				removeColumns:function(newColumnMap){
					ViewCustomTools.columnMap2cols(newColumnMap);
				},
				setToolbarBtns:function(){
					var toolbarBtns=ViewCustom.getToolbars();
					var ops=ViewGlobal.listEntity.operations;
					var _buttons=ViewGlobal.viewJsonConfig.toolBarSetting.button;
					var buttons=[];
					var _buttonMap={};
					var _buttonButtons=[];
					for(var i=0;i<_buttons.length;++i){
						var _button=_buttons[i];
						_buttonMap[_button._name]=_button;
						var has=false;
						$(ops).each(function(index , op){
							if(_button._name == op.name){
								has=true;
								return false;
							}
						});
						if(!has){
							_buttonButtons.push(_button);
						}
					}
					$(toolbarBtns).each(function(index , btnId){
						$(ops).each(function(index , op){
							if(btnId == op.name){
								var button = {
										/*_isInMoreBtns:"false",
										_cssClass:"",*/
										_name:op.name//,
								};
								if(_buttonMap[btnId]){
									button=$.extend(button,_buttonMap[btnId]);
								}
								buttons.push(button);
								return false;
							}
						}) ;
					}) ;
					$(_buttonButtons).each(function(index , btn){
						buttons.push(btn);
					});
					
					ViewGlobal.viewJsonConfig.toolBarSetting.button=buttons;
				},
				mergeViewXml:function(){
					var mergeViewXmlUrl=Global.contextPath+"/metadata/uitemplate/viewXmlMerge";
					var filter=ViewGlobal.listEntity.filter;
					if(typeof ViewGlobal.listEntity.filter=="string"){
						filter=JSON.parse(ViewGlobal.listEntity.filter);
					}
					var _listEntity={
							viewJsonConfig:ViewCustomTools.getViewXml(),
							filter:filter,
							orderby:ViewGlobal.listEntity.orderby,
							quickSearch:ViewGlobal.listEntity.quickSearch
					};
					$.restPost(mergeViewXmlUrl,_listEntity,function(_listEntityRes){
						if(_listEntityRes){
							var _xmlConfig=JSON.parse(xml2json(_listEntityRes.viewJsonConfig)).grid;
							//consolelog("合并xmlconfig后：");
							//consolelog(_xmlConfig);
							ViewGlobal.viewJsonConfig.filter=_xmlConfig.filter;
							ViewGlobal.viewJsonConfig.orderby=_xmlConfig.orderby;
							ViewGlobal.viewJsonConfig.quickSearch=_xmlConfig.quickSearch;
						}
					},{async:false});
				}
			};
			customViewManager.initParams=ViewCustom.initParams;
			customViewManager.initPage=ViewCustom.initPage;
			return customViewManager;
		}
	};//End of return
});

/*(function(){
	
	window.ViewCustom={};
	
})();*/
 
 