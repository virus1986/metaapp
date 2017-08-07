var Page={
	init:function(context,params){
		var $context=$(context);
		if($context.length==0) $context=$("body");
		var initParams=$.extend({
			pageType:"pop-up",
			entityTabs:"entity-tabs",
			isInitForm:false,			
			isInitFormNav:false,
			isInitRelation:false
		},params,true);
		if(initParams.pageType=="in-tab"){
			Page.tabPageInit(context, initParams);
		}else{
			Page.popupPageInit(context, initParams);
		}
	},
	popupPageInit:function(context,params){
		if(params.isInitForm){
			Form.ajaxFormInit(context);
		}
		if(params.isInitFormNav){
			Page.initFormLeftNav(context);
		}
		if(params.isInitRelation){
			Page.initLeftRelation(context);
		}
	},
	tabPageInit:function(context,params){
		ToolBars.initTabFormCustomToolBar(context);
		if(params.isInitForm){
			Form.ajaxFormInit(context);
		}
		$("#"+params.entityTabs,context).tabs({
			carousel : false,
			cache:true,
			ajaxOptions:{
				cache:false
			},
			show:function(event,ui){
				Page.resizeTabsHeight(context);
			}
		});
		function saveAll(){
			var valInfo = $.validation.validate($("form",context)) ;
			if( valInfo.isError ) {
				return false;
			}
			Form.multiAjaxSubmit($("form",context),{
		    	before:function(){
					$("#saveBaseInfo",context).attr("disabled","disabled");
						CommonUtil.showLoading(context);
					},
				complete:function(){
						$("#saveBaseInfo",context).removeAttr("disabled");
						CommonUtil.hiddenLoading();
					}
			});
		};
		$("#saveBaseInfo",context).click(function(){
			var container=$(context);
			var form=container.find("form");
			if(form.length>0){
				saveAll();
			}
			return false;
		});		
		$(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *",context)
			.removeClass("ui-corner-all ui-corner-top").addClass("ui-corner-bottom");
		$(".tabs-bottom .ui-tabs-nav",context).appendTo($(".tabs-bottom",context));
		$(window).on("resize",function(){
			Page.resizeTabsHeight(context);
		});
	},
	initFormLeftNav:function(context){
		$('[data-spy="scroll"]',context).each(function(){
			var self=$(this);
			var target=$(self.attr("data-target"),context);
			if(target.length<=0) return;
			var ulObj=$("<ul>").appendTo(target);
			self.find(".form-section").each(function(index){
				var sectionId="ex-section"+index;
				var formSection=$(this);
				var title=formSection.find("caption").text();	
				if(title==""){
					return;
				}
				if(formSection.attr("id")){
					sectionId=formSection.attr("id");
				}else{
					formSection.attr("id",sectionId);
				}
				var liObj=$("<li>").appendTo(ulObj);
				if(index==0){
					liObj.addClass("current");
				}
							
				var aObj=$("<a>",{
					//"href":"#"+sectionId,
					click:function(){
						if($(this).hasClass(".relation-a")){
							self.find("#associateDiv").show();
							self.find(".form-section").hide();
						}else{
							self.find(".form-section").parent().show();
							self.find(".form-section").show();
							self.find("#associateDiv").hide();
						}
						$(this).closest("ul").find("li").each(function(){
							$(this).removeClass("current");							
						});
						$(this).parent("li").addClass("current");
					}
				}).appendTo(liObj).append("<span>"+title+"</span>");
			});
		});	
		
		if($(".form-left li",context).length<=1){
			$(".form-left",context).hide();
			$(".form-right",context).removeClass("span10");
		}else{
			$('[data-spy="scroll"]',context).each(function () {
				var $spy = $(this).scrollspy('refresh');
			});
			$(".form-right",context).css("marginLeft","0px");
		}
	},
	initLeftRelation:function(context){
		var menuExp=$(".dialog-menu-exp",context);
		$("a",menuExp).addClass("relation-a");
		$("a",menuExp).click(function(){
			var url=$(this).attr("href");
			var targetDivId=$(this).attr("target");
			var targetDiv=$(targetDivId,context);
			var associateDiv=targetDiv.find("#associateDiv");
			targetDiv.children().hide();
			if(associateDiv.length==0){
				associateDiv=$("<div/>",{"id":"associateDiv"});
				targetDiv.append(associateDiv);
			}else{
				associateDiv.show();
			}	
			CommonLoader.loadData(associateDiv,url);
			return false;
		});
	},
	fitTabContentSize:function(jTab){
		//Grid高度
		var $tabContainer=$(jTab).closest(".ui-tabs");
		var gridHeight =$tabContainer.height()-140;
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
		var $parentTabs=$container.closest(".ui-tabs");
		if($parentTabs.length>0){
			window.setTimeout(function(){
				//查找与内层Tab父同级其它元素的高度
				var siblingsHeight=0;
				$container.find(".ui-tabs").parent().prevAll().each(function(i,el){
					siblingsHeight+=$(this).height();
				});
				//查找与内层Tab同级其它元素的高度
				$container.find(".ui-tabs").prevAll().each(function(i,el){
					siblingsHeight+=$(this).height();
				});
				//获取外层tab控件
				var parentContainer=$parentTabs;
				//设置内层Tab的各个panel高度
				$(".ui-tabs-panel",$container).height(parentContainer.height()-siblingsHeight-65);
			},200);
		}
	},
	gridComplete:function(){
		var $grid=$(this);
		var gridParam=$grid.jqGrid("getGridParam");
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
	}
};

var SelectForm={
	openSelectForm:function(val,input){
		var selectFormUrl=input.attr("data-selecturl");
		var refField=input.attr("data-reffield")||"id";
		var refInputId=input.attr("id").substr(0,input.attr("id").length-5);
		jQuery.openLink(selectFormUrl,{requestType : "GET"},function(){
			var reVal=jQuery.dialogReturnValue();
			if(!reVal) return;
			input.val(reVal[0].text);
			$("#"+refInputId,input.parent().parent()).val(reVal[0][refField]);
			input.trigger('afterSelectedItem', {'sender': input, 'liEl': null,'selectedItem':reVal[0]});
		});
	}
};

var TreeOptions={
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

var consolelog=function(obj){
	if($.browser.webkit){
		console.log(obj);
	}
};

var Navigator={
	navigateToMenu:function(nodeId,type){
		var treeRoot=$("#menuadmin-tree_menumetadata .bbit-tree-ec-icon");
		if(!treeRoot.hasClass("bbit-tree-elbow-minus")){
			treeRoot.trigger("click");
		}
		var treeIcon=$(".bbit-tree-ec-icon","div[nodeid="+nodeId+"]");
		if(!treeIcon.hasClass("bbit-tree-elbow-minus")){
			treeIcon.trigger("click");
		}
		if(type=='views'){
			$("a span","div[nodeid="+nodeId+"_views]").trigger("click");
		}else if(type=='grids'){
			$("a span","div[nodeid="+nodeId+"_grids]").trigger("click");
		}else if(type=='relation'){
			$("a span","div[nodeid="+nodeId+"_relation]").trigger("click");
		}else if(type=='fields'){
			$("a span","div[nodeid="+nodeId+"_fields]").trigger("click");
		}else if(type=='operation'){
			$("a span","div[nodeid="+nodeId+"_operation]").trigger("click");
		}else if(type=='security'){
			$("a span","div[nodeid="+nodeId+"_security]").trigger("click");
		}
		var currentEleTop=treeIcon.position().top;
		var scrollTop=$("#menuTreeCon .secmenu-list").scrollTop();
		$("#menuTreeCon .secmenu-list").scrollTop(currentEleTop+scrollTop-35);
	},
	navigateToEntity:function(entityPartName){
		var treeRootNode=$("#menuadmin-tree_menumetadata");
		var treeChildScopeNodes=treeRootNode.next("ul");
		var treeRoot=$("#menuadmin-tree_menumetadata .bbit-tree-ec-icon");
		if(!treeRoot.hasClass("bbit-tree-elbow-minus")){
			treeRoot.trigger("click");
		}
		var treeIcon=treeChildScopeNodes.find("div[nodeid*="+entityPartName+"]"+" .bbit-tree-ec-icon");
		if(treeIcon.length<1){
			treeIcon=treeChildScopeNodes.find("div[title*="+entityPartName+"]"+" .bbit-tree-ec-icon");
		}
		if(treeIcon.length>0){
			
			treeIcon=$(treeIcon[0]);
			var entityNode=treeIcon.parent();
			var fieldsNode=entityNode.next("ul").find("li:first>div");
			if(!treeIcon.hasClass("bbit-tree-elbow-minus")){
				treeIcon.trigger("click");
			}
			//$("a span","div[nodeid="+nodeId+"_fields]").trigger("click");
			$("a span",fieldsNode).trigger("click");
			var currentEleTop=treeIcon.position().top;
			var scrollTop=$("#menuTreeCon .secmenu-list").scrollTop();
			$("#menuTreeCon .secmenu-list").scrollTop(currentEleTop+scrollTop-35);
		}
	}
};

jQuery.fn.extend({
	selectIcon : function(callback,/* optional */ size){
		return this.each(function(){
			size = size || null;
			if(size != null && size.width == null && size.height == null) size = null;
			var title = i18n.t("common.select");
			if(size) title = title + " " +i18n.t("icon.desc",size.width,size.height);
			else title = title + i18n.t("icon.title");
			$(this).click(function(){
				$.openLink(Global.contextPath + "/icon/icon_select", {
					width :600,
					height: 400,
					title : title,
					requestType : "GET",
					data : size
					}, function() {
							var url = jQuery.dialogReturnValue();
							callback(url);
					});
			});
		});
	},
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
function isFieldValUnique(selector){
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
}

function showCodePreviewBtn(parent, code){
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

function setCurrentTitle(context, title){
	$(context).parents(".ui-dialog").find(".ui-dialog-title").html(title);
};

var TabGridHelper={
	resetHeight:function($grid,$context){
		if($grid.closest(".ui-tabs")){
			var parentContainer=$grid.closest(".ui-tabs");
			var toolbar=$context.find(".table-toolbar");
			var toolbarHeight=toolbar.height()||0;
			if(toolbar.css("display")=='none'){
				toolbarHeight=0;
			}
			var gridHeight=parentContainer.height()-100-toolbarHeight;
			$grid.jqGrid('setGridHeight',gridHeight);
		}
	}
};
var ReloadCurrentMainTab=function(){
	var _tab=$("#tab-container").tabs();
	_tab.load({id:_tab.getSelectedId()});
};
//此方法必须传入实际的一个jquery tab对象
var ReloadSpecialCurrentTab=function($tabs){
	var _tab=$tabs;
	_tab.load({id:_tab.getSelectedId()});
};
//合并字段,table为jquery选择器或jquery对象
/*var MergeRows=function(table){
	var _gridTableTrs=$(table).find("tbody tr");
	var _len=_gridTableTrs.length;
	var i=0;
	if(_len>0){
		for(i=0;i<_len;){
			var operationTd=$(_gridTableTrs[i]).find("td:eq(0)");
			var operation=operationTd.text();
			var j=i+1;
			var rowspan=false;
			for(;j<_len;){
				var _operationTd=$(_gridTableTrs[j]).find("td:eq(0)");
				var _operation=_operationTd.text();
				if((operation)&&(operation==_operation)){
					rowspan=true;
					_operationTd.remove();
					++j;
					if(j===_len){
						++j;
					}
				}else{
					++j;
					break;
				}
			}
			var _t=j-i-1;
			if(rowspan){
				operationTd.attr("rowspan",_t);
				i+=_t;
			}else{
				++i;
			}
		}
	}
};*/


var AdvanceSearch = {
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
var KEY = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUMPAD_ENTER: 108,
    COMMA: 188
};
window.onerror = function(msg, url, line){
	consolelog("Error info:"+msg+";File position:"+url+"; Line:"+line);
	return true;
};

var EntityUtil = {
	exportEntity: function(entity, format) {
		var isMulti = $.isArray(entity) || (entity.indexOf(',') != -1)? true:false;
		var isXml = format == 'xml'? true: false;
		var url = "";
		if(isMulti){
			if(isXml) {
				url = Global.contextPath + "/metadata/entity/exportEntity/customed-entities.xml?entities=" + entity;
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
	}
};
var ToolBars={
	initTabFormCustomToolBar:function(context){
		$(context).find(".form-toolbar li.form-toolbar-button").each(function(){
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
			CommonUtil.dynRequire(null,dataFuncAttr,function(func,context){
				btnSelf.on("click",function(){
					if(func==null){
						$.messageBox.info({message:(dataFuncAttr||"")+i18n.t("error.operationUndefined")});
					}else{
						func.call(context,btnSelf,null);
					}
				});
			});
		});
	}
}; 