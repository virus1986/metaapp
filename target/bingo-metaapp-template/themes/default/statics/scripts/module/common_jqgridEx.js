//jqgrid settings extend
;(function($){
	if($.jgrid){
	$.jgrid.extend({
		initCustom:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				//上下文菜单
				$grid.on("click",".title-field",function(e){
					var target=e.target;
					var rowId=$(target).closest("tr").attr("id");
					$grid.jqGrid("resetSelection");
					$grid.jqGrid("setSelection",rowId);
					if(target.tagName==="A"){
						$grid.viewRecord();
					}else{
						$grid.showContextMenu(e,rowId);
					}
					return false;
				});
				$grid.on("mouseover",".title-field",function(){
					var self=$(this);
					self.find(".pull-right").show();
					self.addClass("contextmenu-over");
				});
				$grid.on("mouseout",".title-field",function(){
					var self=$(this);
					self.removeClass("contextmenu-over");
					self.find(".pull-right").hide();
				});
			});
		},
		initCustToolBar:function(barId,options){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				$("#"+barId).show().appendTo("#t_"+$t.p.id);
				
				//顶部工具栏动作
				$(".table-toolbar-icon li","#"+barId).each(function(){
					var btnSelf=$(this);
					btnSelf.hover(
						function(){
							$(this).addClass("table-img-icon-selected");
						},
						function(){
							$(this).removeClass("table-img-icon-selected");
						}
					);
					
					var dataFuncAttr=btnSelf.attr("data-func");
					CommonUtil.dynRequire($grid,dataFuncAttr,function(func,context){
						btnSelf.on("click",function(){
							if(func==null){
								$.messageBox.info({message:(dataFuncAttr||"")+i18n.t("error.operationUndefined")});
							}else{
								func.call(context,btnSelf,$grid);
							}
						});
					});
				});

				// 搜索
				$(".table-toolbar-search li","#"+barId).click(function(){
					var field= $(this).attr("data-field");	
					$(".current_field","#"+barId).html($(this).text());
					$("input[name=searchField]","#"+barId).val(field);
				});				
				$("input[name=btSingleSearch]","#"+barId).bind("click",function(){
					var field=$("input[name=searchField]","#"+barId).val();
					var op=$("input[name=searchOper]","#"+barId).val();
					var fieldVal=$("input[name=searchString]","#"+barId).val();
					if(!fieldVal || !field){
						$.messageBox.info({message:i18n.t("common.searchInfo")});
						return;
					}
					var sdata={};					
					sdata["searchField"] =field;
					sdata["searchString"] = fieldVal;
					sdata["searchOper"] = op;
					sdata["filters"] = "";
					$grid.quickSearch(sdata);
				});
				$("input[name=searchString]", "#"+barId).keydown(function(event){
					if(event.which == 13){
						$("input[name=btSingleSearch]", "#"+barId).click();
						$("input[name=btMultiSearch]", "#"+barId).click();
					}
				}).keyup(function(event){
					var val = $(this).val();
					if(val == null || val == ""){
						$(".table-icon-refresh a", "#"+barId).click();
					}
				}).focus();
				$(".table-toolbar-search li:first","#"+barId).click();
				//简单查询列表，查询按钮事件绑定
				if($(".searchBtn","#"+barId).length>0){
					$("#"+barId).uiwidget();
					$(".searchBtn","#"+barId).click(function(){
						var queryParamsDom=$("#"+barId).find(":input");
						var rules=[];
						var groups=[];
						for(var i=0;i<queryParamsDom.length;++i){
							var qDom=$(queryParamsDom[i]);
							var name=qDom.attr("name");
							var value=qDom.val();
							var operator=qDom.attr("data-operator")||"cn";
							if(value){
								rules.push({"field":name,"op":operator,"data":value});
							}
						}
						/*for(var i in queryParams){
							if(typeof(i)=="string"){
								var operator="cn";
								if($("[name='"+i+"']","#"+barId).attr("data-operator")){
									operator=$("[name='"+i+"']","#"+barId).attr("data-operator");
								}
								if(queryParams[i]){
									rules.push({"field":i,"op":operator,"data":queryParams[i]});
								}
							}
						}*/
						$grid.multiFieldsQuickSearch(rules,"And",groups);
					});
					$(".resetBtn","#"+barId).click(function(){
						$("#"+barId).find(":input").val(null);
						$grid.jqGrid("setGridParam",{search:false});
						$grid.trigger("reloadGrid",[{page:1}]);
					});
				}
				//视图切换
				$(".table-toolbar-search select.switch-view-btn","#"+barId).change(function(){
					var $currentOption=$(this).find("option:selected");
					var url=$currentOption.attr("data-url");
					var title=$currentOption.text();
					$.openLink(url,{showType:'cur-tab',title:title,height:'100%'});
				});
			});
		},
		addRecord : function() {
			return this.each(function() {
				if (!this.grid) return;
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				if($.isFunction(p.onAdd) ) {
					p.onAdd($grid);
					return false;
				}
				var options=$.fn.extend(true,{
					width:800		
				},$grid.getGridParam('addDialogOptions'));
				var createFunc=$grid.getGridParam("createFunc");
				if($.isFunction(createFunc)){
					createFunc($grid);
					return;
				}else if(!CommonUtil.isEmpty(createFunc)){
					CommonUtil.dynRequire($grid,createFunc,function(func,context){
						func.call(context,$grid);
					});
					return;
				}
				var createUrl = $grid.getGridParam("createurl");
				createUrl=Urls.appendDate(createUrl);
				var showType = "pop-up", title = i18n.t("common.new");
				var dialogSettings = $grid.getGridParam("addDialogSettings");
				if(dialogSettings){
					showType = dialogSettings.showType || showType;
					title = dialogSettings.caption || title;
				}
				$.openLink(createUrl, {
					width:options.width,
					height:options.height,
					showType: showType,
					title : title,
					requestType : "GET",
					data : {}
					}, function() {
							var reVal = jQuery.dialogReturnValue();
							if (reVal == null){
								return;
							}
							var loadOnce=$grid.getGridParam('loadonce');
							if(loadOnce){
								$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
							}else{
								$grid.trigger("reloadGrid");
							}
							if($.isFunction(p.onAfterAdd) ) {
								p.onAfterAdd(reVal);
							}
					});
			});
		},
		delRecord :function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				if($.isFunction(p.onDelete) ) {
					p.onDelete($grid);
					return false;
				}
				var selectIds=$grid.jqGrid('getGridParam','selarrrow');
				if (selectIds.length==0){
					var _selectIdArray=[];
					var _selectId = $grid.jqGrid('getGridParam','selrow');
					if(!_selectId){
						$.messageBox.warning({message:i18n.t("common.deleteInfo")});
						return;
					}
					_selectIdArray.push(_selectId);
					selectIds=_selectIdArray;
				}
				if($.isFunction(p.onBeforeDelete) ) {
					var isOk=p.onBeforeDelete($grid);
					if(!isOk){
						return;
					}
				}
				var deleteFunc=$grid.getGridParam("deleteFunc");
				if($.isFunction(deleteFunc)){
					deleteFunc(selectIds,$grid);
					return;
				}else if(!CommonUtil.isEmpty(deleteFunc)){
					CommonUtil.dynRequire($grid,deleteFunc,function(func,context){
						func.call(context,selectIds,$grid);
					});
					return;
				}
				var delUrl = $grid.getGridParam("deleteurl");
				delUrl=Urls.appendParam(delUrl,"id",selectIds);
				delUrl=Urls.appendDate(delUrl);
				$.messageBox.confirm({
				message:i18n.t("common.deleteConfirm"),
					callback:function(result){
						if(result){
							jQuery.restGet(delUrl,null,function(response){
								if(response==null) return ;
								if(response!=null&&(response.errorMessage)){
									$.messageBox.error({message:response.errorMessage||i18n.t("common.deleteActionError")});
									return;
								}
								if($.isArray(response)&&response[0]&&(response[0].errorMessage)){
									$.messageBox.error({message:response[0].errorMessage||i18n.t("common.deleteActionError")});
									return;
								}
								var loadOnce=$grid.getGridParam('loadonce');
								if(loadOnce){
									$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
								}else{
									$grid.trigger("reloadGrid");
								}
								if($.isFunction(p.onAfterDelete) ) {
									p.onAfterDelete(response);
								}
							});
					}
				}
			});
			});
		},
		editRecord:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				if($.isFunction(p.onEdit) ) {
					p.onEdit($grid);
					return false;
				}
				var options=$.fn.extend(true,{
					width:800			
				},$grid.getGridParam('editDialogOptions'));
				var id = $grid.jqGrid('getGridParam','selrow');
				if (!id){ 											
					$.messageBox.info({message:i18n.t("common.selectRow")});;
					return;
				}
				if($.isFunction(p.onBeforeEdit) ) {
					var isOk=p.onBeforeEdit($grid);
					if(!isOk){
						return;
					}
				}
				var editFunc=$grid.getGridParam("editFunc");
				if($.isFunction(editFunc)){
					editFunc(id,$grid);
					return;
				}else if(!CommonUtil.isEmpty(editFunc)){
					CommonUtil.dynRequire($grid,editFunc,function(func,context){
						func.call(context,id,$grid);
					});
					return;
				}
				var editurl=$grid.getGridParam("editurl");	
				editurl=Urls.appendParam(editurl,"id",id);
				editurl=Urls.appendDate(editurl);
				var showType = "pop-up", title = i18n.t("common.edit");
				var dialogSettings = $grid.getGridParam("editDialogSettings");
				if(dialogSettings){
					showType = dialogSettings.showType || showType;
					title = dialogSettings.caption || title;
				}
				$.openLink(editurl,{
					width:options.width,
					height:options.height,
					showType: showType,
					title:title,
					iframe:false,requestType:"GET",data:{}},
					function(){
						var reVal=jQuery.dialogReturnValue();
						if(reVal==null ) return ;
						var loadOnce=$grid.getGridParam('loadonce');
						if(loadOnce){
							$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
						}else{
							$grid.trigger("reloadGrid");
						}
					}
				) ;
			});
		},
		viewRecord:function(){
			return this.each(function() {
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var id = $grid.jqGrid('getGridParam','selrow');
				if (!id){ 											
					$.messageBox.info({message:i18n.t("common.selectRow")});
					return;
				}
				var viewFunc=$grid.getGridParam("viewFunc");
				if($.isFunction(viewFunc)){
					viewFunc(id,$grid);
					return;
				}else if(!CommonUtil.isEmpty(viewFunc)){
					CommonUtil.dynRequire($grid,viewFunc,function(func,context){
						func.call(context,id,$grid);
					});
					return;
				}
				var viewurl=$grid.getGridParam("viewurl");	
				if(CommonUtil.isEmpty(viewurl)){
					$grid.editRecord();
					return;
				}
				viewurl=Urls.appendParam(viewurl,"id",id);
				viewurl=Urls.appendDate(viewurl);
				var showType = "pop-up", title = i18n.t("common.view");
				var dialogSettings = $grid.getGridParam("viewDialogSettings");
				if(dialogSettings){
					showType = dialogSettings.showType || showType;
					title = dialogSettings.caption || title;
				}
				$.openLink(viewurl,{
					showType: showType,
					width:800,
					title:title,
					iframe:false,requestType:"GET",data:{}}
				,null) ;
			});
		},
		addRelation:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var customSettings=$grid.jqGrid('getGridParam','customSettings');
				if(!customSettings.refSelectUrl){
					$.messageBox.warning({message:i18n.t("relation.objextNotSetSelectList")});
					return;
				}
				var selectUrl=customSettings.refSelectUrl;
				var relationCreateUrl=customSettings.relationCreateUrl;
				$.openLink(selectUrl, {
					requestType : "GET",
					data :customSettings.refEntityId
					},function(resp){
						if(!resp) return;
						var ids="";
						$.each(resp,function(i,item){
							ids+=item.id+",";
						});
						if(ids.length>0){
							ids=ids.substr(0,ids.length-1);
						}
						relationCreateUrl=Urls.appendParam(relationCreateUrl, "id", ids);
						jQuery.restGet(relationCreateUrl,null,function(resp){
							if(!resp) return;
							$grid.trigger("reloadGrid");
						});
				});
			});
		},	
		exportGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t);
				var id = 'temp_' + $grid.getGridParam("id");
				var entity = $grid.getGridParam("entityName");
				var url = Global.contextPath + '/entities/' + entity + '/export-records';
				window[id] = $grid;
				$.openLink(url, {
					data: {
						gridId: id	
					}
				});
			});
		},
		/* 用于导出实体的xml文件 */
		exportEntity:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t), entity = $grid.data("entity");
				if(entity == null){
					entity = $grid.jqGrid("getGridParam", "selarrrow");
					if(entity.length <= 0){
						$.messageBox.warning({
							message:i18n.t("tool.selectEntityToExport")});
						return ;
					}
				}
				if($.isArray(entity)) entity = entity.join(',');
				$.openLink(Global.contextPath + '/metadata/entity/exportEntity/guide', {data: {
					entity: entity
				}});
			});
		},
		/* 导入Excel文件中的数据 */
		importData:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this, $grid=$($t);
				var id = 'temp_' + $grid.getGridParam("id");
				var entity = $grid.getGridParam("entityName");
				var url = Global.contextPath + '/entities/' + entity + '/import';
				$.openLink(url, {
					data: {
						gridId: id	
					}},
					function(){
						var reVal=jQuery.dialogReturnValue();
						if(reVal==null ) return ;
						$grid.trigger("reloadGrid");
					});
			});
		},
		refreshGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				var sdata={};
				$t.p.search = false;		
				if(p.multipleSearch===false) {
					sdata[p.sField] = sdata[p.sValue] = sdata[p.sOper] = "";
				} else {
					sdata[p.sFilter] = "";
				}
				$.extend($t.p.postData,sdata);
				$($t).triggerHandler("jqGridFilterReset");
				if($.isFunction(p.onReset) ) {
					p.onReset.call($t);
				}
				var loadOnce=$grid.getGridParam('loadonce');
				if(loadOnce){
					$grid.setGridParam({datatype:'json', page:1}).trigger("reloadGrid");
				}else{
					$grid.trigger("reloadGrid");
				}
				return false;
			});
		},
		advanceSearch:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $this = this, $grid=$($this), id = this.id, cache = AdvanceSearch.configCache[id];
//				$grid.searchGrid($grid.getGridParam('searchDialogOptions'));return;
				var entityName = this.p.entityName, joinEntities = this.p.joinEntities;
				$.openLink(Global.contextPath + "/advance_search", {
					data : {
						entity : entityName,
						joinEntities: joinEntities,
						initJson: JSON.stringify(cache)
					} 
				}, function(res){
					if(res) {
						AdvanceSearch.configCache[id] = res;
						$this.p.search = true;
						$.extend($this.p.postData,{
							filters: JSON.stringify(res),
							searchField: '',
							searchOper: '',
							searchString: ''
						});
						$($this).triggerHandler("jqGridFilterSearch");
						$($this).trigger("reloadGrid",[{page:1}]);
					}
				});
			});
		},
		filterGrid:function(){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				$.messageBox.info({message:i18n.t("tool.functionNotFinished")});
			});
		},
		quickSearch:function(sdata){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				$t.p.search = true;
				$.extend($t.p.postData,sdata);
				$($t).triggerHandler("jqGridFilterSearch");
				if($.isFunction(p.onSearch) ) {
					p.onSearch.call($t);
				}
				$($t).trigger("reloadGrid",[{page:1}]);
			});
		},//rules":[{"field":"orderTime","op":"le","data":endTime}];
		//groupOp:AND 或 OR
		multiFieldsQuickSearch:function(rules,groupOp,groups){
			//仅支持并列各个字段查询
			rules=rules||[];
			groupOp=groupOp||"AND";
			if(groupOp=='or'||groupOp=='OR'){
				groupOp="OR";
			}else{
				groupOp="AND";
			}
			if(!groups) groups=[];
			var filters={"groupOp":groupOp,"rules":rules,"groups":groups};
			var filtersJson=JSON.stringify(filters);
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var p=$t.p;
				var sdata={filters:filtersJson};
				$.extend($t.p.postData,sdata);
				$t.p.search = true;
				$($t).trigger("reloadGrid",[{page:1}]);
			});
		},
		showContextMenu:function(evt,rowId){
			return this.each(function(){
				if ( !this.grid ) {return;}
				var $t = this;
				var $grid=$($t);
				var option = {width: 100, items: []}; 
				var contextBtns=$grid.jqGrid('getGridParam','contextButtons');
				if(contextBtns!=null && contextBtns.length>0){
					$.each(contextBtns,function(i,item){
						option.items.push({
							text:item.text,
							icon:window.Global.iconPath+item.buttonIcon,
							action:function(){
								CommonUtil.dynRequire($grid,item.onClick,function(func,context){
									func.call(context,rowId,$grid);
								});
							}
						});
					});
				}
				var custMenus;
				if($.isFunction($t.p.exContextMenu) ) {
					custMenus=$t.p.exContextMenu($grid);
				}else{
					custMenus=$grid.jqGrid('getGridParam','exContextMenu');
				}
				
				if(custMenus!=null && custMenus.length>0){
					$.merge(option.items,custMenus);
				}
				
				var onShow=$grid.jqGrid('getGridParam','onContextMenu');
				if($.isFunction(onShow)){
					onShow.call($grid,option,rowId);
				}
				
				if(option.items.length>0){
					$(evt.target).contextmenu(option);
					$(evt.target).contextmenu().show(evt);
				}
			});
		},
		configGrid:function(){
			return this.each(function() {
				if (!this.grid) return;
				var $t = this;
				var p=$t.p;
				var $grid=$($t);
				var options={
					width:800		
				};				
				var configUrl = $grid.getGridParam("configUrl");
				configUrl=Urls.appendDate(configUrl);
				$.openLink(configUrl, {
					width:options.width,
					height:options.height,
					title : "",
					requestType : "GET",
					data : {}
					}, function() {
							var reVal = jQuery.dialogReturnValue();
							if (reVal == null){
								return;
							}
							var containerView=$grid.closest("[data-url]");
							if(containerView.length>0){
								CommonLoader.reloadView(containerView, null, null);
							}
					});
			});
		}
	});
	}
})(jQuery);
//jqgrid formatter extend
;(function($) {
	
	if($.fn.fmatter){
	$.fn.fmatter.titleField=function(cellval, opts, rwd, act){
		if((!cellval)||cellval==""){
			return "";
		}
		var reVal="<div class=\"row-fluid title-field\" style='cursor:pointer;'>"	;
			reVal+="<a href=\"javascript://\" style='display:inline-block;max-width:92%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>"+cellval+"</a>";
			reVal+="<div class='pull-right' style='display:none;margin-right:3px'><span class=\"add-on\"><i class=\"icon-chevron-down\"></i></span></div>";
			reVal+="</div>";
		return reVal;
	};
	$.fn.fmatter.filterHtml=function(cellval, opts, rwd, act){
		fmatterOpts=$.extend(true,{max:0},opts.colModel.formatoptions);
		cellval = cellval.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		cellval = cellval.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		if(fmatterOpts.max>0){
			cellval=cellval.substr(0,fmatterOpts.max)+"...";
		}
		return cellval;
	};
	$.fn.fmatter.treeOptionset=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var options=opts.colModel.formatoptions.options;
		if(options){
			try{
				options=JSON.parse(options);
				var flatOptions=TreeOptions.treeOptionToFlat(options,{});
				var optionName=flatOptions[cellval];
				if(!optionName){
					return cellVal;
				}else{
					return optionName;
				}
			}catch(e){
				$.messageBox.error({message:i18n.t("optionset.optionsNotLegal")});
				return cellval;
			}
		}else{
			return cellval;
		}
	};
	$.fn.fmatter.refEntity=function(cellval, opts, rwd, act){
		//formatoptions;
		if(cellval==null) return "";
		var userdata=$("#"+opts.gid).getGridParam("userData");
		if(userdata==null || userdata[opts.colModel.name]==null || opts.colModel.formatoptions==null) return cellval;
		var resultStr=cellval;
		var idField=opts.colModel.formatoptions.id;
		var refField=opts.colModel.formatoptions.refField;
		var refNotIdField=false;
		if(refField){
			refNotIdField=true;
		}else{
			refField=idField;
		}
		var titleField=opts.colModel.formatoptions.title || idField;
		var entityName=opts.colModel.formatoptions.entityName;
		var viewUrl=opts.colModel.formatoptions.viewUrl;
		if(!viewUrl){
			viewUrl=window.Global.contentPath+"/entities/"+entityName+"/edit";
		}
		$.each(userdata[opts.colModel.name],function(i,item){
			var idValue=item[idField];
			var refFieldValue=item[refField];
			var titleValue=item[titleField];
			if(refNotIdField&&idValue!=refFieldValue){
				titleValue=refFieldValue;
			}
			if(refFieldValue==cellval){
				if(rwd.treeGridRoot===1){
					resultStr="<a class='refEntity' data-target-entity-id='"+idValue+"' href='javascript://' onclick=\"javascript:jQuery.openLink('"+Urls.appendParam(viewUrl,"id",idValue)+"');\">"+titleValue+"</a>";
				}else{
					resultStr="<a href='javascript://' onclick=\"javascript:jQuery.openLink('"+Urls.appendParam(viewUrl,"id",idValue)+"');\">"+titleValue+"</a>";
				}
				$(resultStr).click(function(){
					jQuery.openLink($(this).attr("href"),{showType:"pop-up",width:800});
					return false;
				});
			}
		});
		return resultStr;
	};
	$.fn.fmatter.photoField=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var _fileSavePath=cellval;
		var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
		var path=Global.contextPath;
		var realPath=path+'/ui/upload?action=download&filepath='+_filePath;//
		//var imgHtml="<img src='"+realPath+"' style=\"width:100px;height:100px;display:block;\"/>";
		var reVal="<img onmouseout=\"javascript:jQuery(this).css({width:'25px',height:'25px'});\" onmouseover=\"javascript:jQuery(this).css({width:'100px',height:'100px'});\" style=\"width:25px;height:25px;display:block;\" src='"+realPath+"'/>";
		return reVal;
	};
	$.fn.fmatter.fileField=function(cellval, opts, rwd, act){
		if(cellval==null) return "";
		var _fileSavePath=cellval;
		var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
		var _fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
		var path=Global.contextPath;
		var realPath=path+'/ui/upload?action=download&filepath='+_filePath;//
		var reVal="<a href='"+realPath+"'>"+_fileName+"</a>";
		return reVal;
	};
	$.fn.fmatter.icon=function(cellvalue, options, rowObject, act){
		var icon = rowObject[options.colModel.name];
		if(icon){
			return "<img src='" + Global.iconPath + icon + "'/>";
		} else {
			return i18n.t("common.none");
		}
	};
	$.fn.fmatter.addition=function(cellvalue, options, rowObject, act){
		var addition = rowObject[options.colModel.name];
		var opt = options.colModel.formatoptions;
		var list = JSON.parse(addition);
		if(list && list.length > 0){
			var array = [], html = '', length = list.length, count = opt && opt.listShowCount, start = 0;
			if(!count) {
				count=length;
			}
			if(count>length){
				count=length;
			}
			for(var i = start; i < length; i++) {
				var item = list[i], timeStr = item.time;
				html = '';
				var date = new Date(), dateStr = "";
				
				timeStr = timeStr.replace('T', ' ').replace('Z', ' ').replace('-', ' ').replace('-', ' ')
					.replace(':', ' ').replace(':', ' ').replace('.', ' ').split(' ');
				date.setFullYear(timeStr[0], timeStr[1] - 1, timeStr[2]);
				date.setHours(timeStr[3], timeStr[4], timeStr[5], timeStr[6]);
				if(date) {
					var mon = date.getMonth() + 1, da = date.getDate(), ho = date.getHours(), mi = date.getMinutes();
					dateStr = (mon > 9? mon:'0' + mon) + '-' + (da > 9? da:'0' + da) + ' '
							+ (ho > 9? ho:'0' + ho) + ':' + (mi > 9? mi:'0' + mi);
				} else {
					dateStr = item.time;
				}
				html += '<span style="color: gray;" title="' + dateStr + '">' + dateStr + '：</span>';
				html += '<span title="' + item.content + '">' + item.content + '</span><br/>';
				array.push(html);
			}
			if((opt && opt.listOrder && opt.listOrder == 'asc') || (opt && !opt.listOrder) || !opt) {
				array.reverse();
			}
			html = array.join('');
			if(opt && opt.listMoreUrl) {
				var href = opt.listMoreUrl.replace('~', Global.contextPath);
				if(href.indexOf('?') != -1) {
					href += '&';
				} else href += '?';
				href += 'id=' + options.rowId;
				if(count) {
					if(count < length) {
						html += '&nbsp;<a href="javascript://" onclick="javascript:jQuery.openLink(\'' + href
							+ '\', {width: 400}, function(){jQuery(\'#' + options.gid
							+ '\').trigger(\'reloadGrid\');});">'+i18n.t("common.more")+'</a>';
					}
				}
			}
			return '<div title="'+i18n.t("common.content")+'">' + html + '</div>';
		} else {
			return i18n.t("common.none");
		}
	};
	$.fn.fmatter.select=function(cellvalue, options, rowObject, act){
		if(options.colModel.editoptions && options.colModel.editoptions.value){
			var options = options.colModel.editoptions.value;
			var option = options.split(";");
			for(i in option){
				var pair = option[i].split(":");
				if(pair[0] == cellvalue) return pair[1];
			}
		}
		if(cellvalue == null) return "";
		return cellvalue;
	};
	}
}(jQuery));