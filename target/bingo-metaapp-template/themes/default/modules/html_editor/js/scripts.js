function domReadyFunc(_options){
	var options=_options||{};
	var contentCss=options.contentCss;
	var layout=options.layout;
	var layoutSaveUrl=options.layoutSaveUrl;
	var localStoreFormKey="layoutdata-form"+options.formId;
	CKEDITOR.disableAutoInline = true;
	//restoreData();
	$(".demo").html(layout.configData);
	//$(".demo").find("[class*=span]").addClass("column");
	
	var timerSave = 1000;
	var stopsave = 0;
	var startdrag = 0;
	var demoHtml = $(".demo").html();
	var currenteditor = null;
	var layouthistory=null; 
	
	function supportstorage() {
		if (typeof window.localStorage=='object') 
			return true;
		else
			return false;		
	}

	function handleSaveLayout() {
		var e = $(".demo").html();
		if (!stopsave && e != demoHtml) {
			stopsave++;
			demoHtml = e;
			saveLayout();
			stopsave--;
		}
	}

	
	function saveLayout(){
		var data = layouthistory;
		if (!data) {
			data={};
			data.count = 0;
			data.list = [];
		}
		if (data.list.length>data.count) {
			for (var i=data.count;i<data.list.length;i++)
				data.list[i]=null;
		}
		data.list[data.count] = demoHtml;
		data.count++;
		if (supportstorage()) {
			localStorage.setItem(localStoreFormKey,JSON.stringify(data));
		}
		layouthistory = data;
	}

	function undoLayout() {
		var data = layouthistory;
		//console.log(data);
		if (data) {
			if (data.count<2) return false;
			demoHtml = data.list[data.count-2];
			data.count--;
			$('.demo').html(demoHtml);
			if (supportstorage()) {
				localStorage.setItem(localStoreFormKey,JSON.stringify(data));
			}
			return true;
		}
		return false;
	}

	function redoLayout() {
		var data = layouthistory;
		if (data) {
			if (data.list[data.count]) {
				demoHtml = data.list[data.count];
				data.count++;
				$('.demo').html(demoHtml);
				if (supportstorage()) {
					localStorage.setItem(localStoreFormKey,JSON.stringify(data));
				}
				return true;
			}
		}
		return false;
	}
	function gridSystemGenerator() {
		$(".lyrow .preview input").bind("keyup", function() {
			/*Begin 添加表格布局，根据设置的行列渲染表格布局*/
			var isRow=$(this).hasClass("table-row");
			var isCol=$(this).hasClass("table-col");
			var isTableLayout=isRow||isCol;
			var isNormalTableRow=$(this).hasClass("normal-row");
			var isNormalTableCol=$(this).hasClass("normal-col");
			var isNormalTableLayout=isNormalTableRow||isNormalTableCol;
			if(isTableLayout||isNormalTableLayout){
				var row,col;
				if(isRow||isNormalTableRow){
					row=$(this).val();
					col=$(this).next().val(); 
				}else{
					col=$(this).val();
					row=$(this).prev().val();
				}
				if($.isNumeric(row)&&$.isNumeric(col)&&row>0&&col>0){
					var _col=col*2,rows=[],cols=[];
					for(var i=0;i<col;++i){
						cols.push(1);
					}
					for(var i=0;i<row;++i){
						rows.push({cols:cols});
					}
					var data=null,_html=null;
					if(isTableLayout){
						data={actualCols:_col,rows:rows};
						_html=$("#formTableTemplate").render(data);
					}else if(isNormalTableLayout){
						data={actualCols:col,rows:rows};
						_html=$("#normalTableTemplate").render(data);
					}
					if((!_html)||(!data)){
						return;
					}
					$(this).parent().next().html(_html);
					$(this).parent().prev().show();
				}else{
					$(this).parent().prev().hide();
				}
				return;
			}/*End 添加表格布局，根据设置的行列渲染表格布局*/
			
			var e = 0;
			var t = "";
			var n = $(this).val().split(" ", 12);
			$.each(n, function(n, r) {
				e = e + parseInt(r);
				t += '<div class="span' + r + ' column normal"></div>';
			});
			if (e == 12) {
				$(this).parent().next().children().html(t);
				$(this).parent().prev().show();
			} else {
				$(this).parent().prev().hide();
			}
		});
	}
	/*Begin 添加表格布局，处理表格拖动合并*/
	function bindTableLayoutTdColspan(_context){
		var $context=_context||".demo";
		if($(".lyrow .view table td .ui-resizable-e",$context).draggable()){
			$(".lyrow .view table td .ui-resizable-e",$context).draggable("destroy");
		}
		if($(".lyrow .view table td",$context).resizable()){
			$(".lyrow .view table td",$context).resizable("destroy");
		}
		$(".lyrow .view table:not(.layout-table) td",$context).each(function(){
			var $thisTdRes=$(this);
			var $thisTd=$thisTdRes;
			var $thisTr=$thisTd.parent();
			var $table=$thisTr.parent().parent();
			
			var thisTdColspan=$thisTd.attr("colspan")||1;
			
			var maxWidth=$thisTr.width();
			$thisTdRes.resizable({
				handles: "e",
				maxWidth:maxWidth,
				start:function(event , ui){
				},
				stop: function(event, ui) {
					var $nextTh=$thisTd.next("th");
					var $nextTd=$nextTh.next("td");
					if($nextTh.length>0&&$nextTd.length>0){
						var nextThColspan=$nextTh.attr("colspan")||1;
						var nextTdColspan=$nextTd.attr("colspan")||1;
						if($nextTd.children(":not(.ui-resizable-e)").length>0){
							addRow($table,$thisTr,$nextTd,$nextTh);
						}
						$nextTh.remove();
						$nextTd.remove();
						$thisTd.attr("colspan",thisTdColspan*1+nextTdColspan*1+nextThColspan*1);
					}
				}
			});
		});
	};/*End 添加表格布局处理表格拖动合并*/
	function addRow($table,$currentTr,$nextTd,$nextTh){
		var $sampleRow=$table.find("tr:eq(0)");
		$sampleRow=$sampleRow.clone();
		$sampleRow.find("td").empty();
		$sampleRow.find("th label").empty();
		if($nextTd && $nextTh){
			$sampleRow.find("th:first").html($nextTh.html());
			$sampleRow.find("td:first").html($nextTd.html());
		}
		if($currentTr){
			$currentTr.after($sampleRow);
		}else{
			$table.find("tr:last").after($sampleRow);
		}
		 bindTableLayoutTdColspan();
		$("td.column.field",$sampleRow).sortable({
			opacity: .35,
			connectWith: "form .column",
			start: function(e,t) {
				if (!startdrag) stopsave++;
				startdrag = 1;
			},
			stop: function(e,t) {
				if(stopsave>0) stopsave--;
				disableDragField(t,$(this));
				startdrag = 0;
			}
		});
	};
	function configurationElm(e, t) {
		$(".demo").delegate(".configuration > a", "click", function(e) {
			e.preventDefault();
			var t = $(this).parent().parent().next().next().children();
			$(this).toggleClass("active");
			if($(this).attr("rel")){
				t.toggleClass($(this).attr("rel"));
			}
		});
		/*Begin 添加表格布局tr点击事件*/
		$(".demo").delegate(".lyrow .view table:not(.layout-table) tr", "click", function(e) {
			e.preventDefault();
			if(e.target.tagName=='TD'||e.target.tagName=='TH'){
				$(this).toggleClass("active");
				$(this).siblings().removeClass("active");
			}
		});/*End 添加表格布局tr点击事件*/
		bindTableLayoutTdColspan();
		$(".demo").delegate(".configuration .dropdown-menu a", "click", function(e) {
			e.preventDefault();
			/*Begin 添加表格布局设置操作事件绑定*/
			var addTableRow=$(this).hasClass("addTableRow");
			var deleteTableRow=$(this).hasClass("deleteTableRow");
			if(addTableRow||deleteTableRow){
				var $table=$(this).closest(".lyrow").find(".view table");
				if(addTableRow){
					addRow($table);
					return;
				}
				if(deleteTableRow){
					if($table.find("tr").length===1){
						alert("最后一行无法删除！");
						return;
					}
					var $deleteRow=$table.find("tr.active");
					$deleteRow.remove();
					return ;
				}
			}/*End 添加表格布局设置操作事件绑定*/
			var t = $(this).parent().parent().parent();
			var n = t.parent().parent().parent().find(".view").children();
			t.find("li").removeClass("active");
			$(this).parent().addClass("active");
			var r = "";
			t.find("a").each(function() {
				r += $(this).attr("rel") + " ";
			});
			t.parent().removeClass("open");
			n.removeClass(r);
			n.addClass($(this).attr("rel"));
		});
		
		toggleUniqueDraggableInDemo();
	}
	function toggleUniqueDraggableInDemo(){
		/*Begin 如果字段选项在布局中，左侧该字段项的draggable将禁用*/
		$(".sidebar-nav .box.field-item").draggable("enable");
		$(".demo .box.field-item").each(function(){
			var dataField=$(this).attr("data-field");
			$(".sidebar-nav .box[data-field='"+dataField+"']").draggable("disable");
		});/*End 如果字段选项在布局中，左侧该字段项的draggable将禁用*/
		/*Begin 如果关系列表选项在布局中，左侧该字段项的draggable将禁用*/
		$(".sidebar-nav .box.relation-grid").draggable("enable");
		$(".demo .box.relation-grid").each(function(){
			var dataRelation=$(this).attr("data-relation");
			$(".sidebar-nav .box[data-relation='"+dataRelation+"']").draggable("disable");
		});/*End 如果关系列表选项在布局中，左侧该字段项的draggable将禁用*/
		//如果基础表单布局已经存在，不可再选
		if($(".demo .lyrow.base-form-layout").length>0){
			$(".sidebar-nav .lyrow.base-form-layout").draggable("disable");
		}else{
			$(".sidebar-nav .lyrow.base-form-layout").draggable("enable");
		}
		if($(".demo .lyrow.autofields").length>0){
			$(".sidebar-nav .lyrow.autofields").draggable("disable");
		}else{
			$(".sidebar-nav .lyrow.autofields").draggable("enable");
		}
	};
	function enableUniqueDraggableNotInDemo($parent){
		//如果是字段项，移除后将启用该字段项的draggable，以便可以拖动到布局中
		if($parent.hasClass("field-item")){
			var $parentLabel=$parent.closest("td").prev("th").find("label");
			var dataField=$parent.attr("data-field");
			var label=$parent.attr("data-label");
			if($parentLabel.text()===label){
				if($parent.siblings(".field-item").length>0){
					$parentLabel.text($($parent.siblings(".field-item")[0]).attr("data-label"));
				}else{
					$parentLabel.text("");
				}
			}
			$(".sidebar-nav .box[data-field='"+dataField+"']").draggable("enable");
		}
		/*Begin 如果字段选项在布局中也被删除，左侧该字段项的draggable将启用*/
		$(".box.field-item",$parent).each(function(){
			var dataField=$(this).attr("data-field");
			$(".sidebar-nav .box[data-field='"+dataField+"']").draggable("enable");
		});/*End 如果字段选项在布局中也被删除，左侧该字段项的draggable将启用*/
		//如果基础表单布局被删除了，则左侧可以拖动基础布局
		if($parent.hasClass("base-form-layout")||$parent.find(".base-form-layout").length>0){
			$(".sidebar-nav .lyrow.base-form-layout").draggable("enable");
		}
		//自动字段区激活
		if($parent.hasClass("autofields")||$parent.find(".autofields").length>0){
			$(".sidebar-nav .lyrow.autofields").draggable("enable");
		}
		//如果是关系列表，移除后将启用draggable
		if($parent.hasClass("relation-grid")){
			var dataRelation=$parent.attr("data-relation");
			$(".sidebar-nav .box[data-relation='"+dataRelation+"']").draggable("enable");
		}
		$(".box.relation-grid",$parent).each(function(){
			var dataRelation=$(this).attr("data-relation");
			$(".sidebar-nav .box[data-relation='"+dataRelation+"']").draggable("enable");
		});
	};
	//删除按钮事件绑定
	function removeElm() {
		$(".demo").delegate(".remove", "click", function(e) {
			e.preventDefault();
			var $parent=$(this).parent().parent();
			enableUniqueDraggableNotInDemo($parent);
			$parent.remove();
			if (!$(".demo .lyrow").length > 0) {
				clearDemo();
			}
		});
	};
	function clearDemo() {
		$(".demo").empty();
		//增加脚本隐藏区域
		$(".demo").html('<textarea style="display: none;" id="script"></textarea>');
		$(".sidebar-nav .lyrow.base-form-layout").draggable("enable");
		$(".sidebar-nav .box.field-item").draggable("enable");
		$(".sidebar-nav .box.relation-grid").draggable("enable");
		layouthistory = null;
		if (supportstorage())
			localStorage.removeItem(localStoreFormKey);
	}
	function removeMenuClasses() {
		$("#menu-layoutit li button").removeClass("active");
	}
	function changeStructure(e, t) {
		$("#download-layout ." + e).removeClass(e).addClass(t);
	}
	function cleanHtml(e) {
		//var $parent=$(e).parent();
		//$parent.append($(e).children().html());
		$(e).before($(e).children().children());
	}
	var downloadEditor=null;
	function initDownloadEditor(domId,content){
		downloadEditor = ace.edit(domId);
		downloadEditor.setValue(content);
		downloadEditor.setTheme("ace/theme/terminal");
		downloadEditor.getSession().setMode("ace/mode/html");
		downloadEditor.setShowPrintMargin(false);
		downloadEditor.gotoLine(0,0,false);
	};
	//配置转换为模板
	function downloadLayoutSrc() {
		$("#download-layout").children().html($(".demo").html());
		var script=$("#download-layout").children().find("#script").val();
		//var domScript='/*<![CDATA[*/\n';
		var domScript='';
		if(script){
			domScript+=script;
		}
		//domScript+='\n/*]]>*/';
		var t = $("#download-layout").children();
		t.find("#script").remove();
		t.find(".tabbable .tab-content").removeClass("tab-content");
		t.find(".tabs-bottom,.tabs-vertical").removeClass("tabbable tabs-below tabs-left");
		t.find(".bottom-tabs-ul,.vertical-tabs-ul").removeClass("nav nav-tabs");
		var $relationSection=t.find(".relations-section");
		if($relationSection && $relationSection.length===1){
			var excludes= $relationSection.attr("data-exclude-relation-names");
			$relationSection.replaceWith("<meta:relation data-exclude-relation-names='"+excludes+"' view-container='.form-right'></meta:relation>");
		}
		t.find(".autofields-section").replaceWith("<meta:fields title='扩展信息' colNum='2'></meta:fields>");
		//t.find(".relation-grid-placeholder").parent().attr("data-wrapper","relation-grid");
		t.find(".relation-grid-placeholder").each(function(){
			var $self=$(this);
			var attrs = {
				'_th:if':"${action=='EDIT'}",
				'entityname' : $self.attr("entityname"),
				'data-sourceentity':$self.attr("data-sourceentity"),
				'view' : $self.attr("view"),
				'data-relation':$self.attr('data-relation'),
				'_th:attr':$self.attr('th:attr')?$self.attr('th:attr'):'ref-'+$self.attr("data-refto-field-name")+'=${entity[\''+$self.attr("data-ref-field-name")+'\']}'
			};
			$self.replaceWith($("<meta:grid></meta:grid>").attr(attrs));
		});
		t.find(".preview, .toolbar,.configuration, .drag, .remove,.CRC").remove();
		t.find(".lyrow").addClass("removeClean");
		t.find(".box-element").addClass("removeClean");
		t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".lyrow .lyrow .lyrow .lyrow .removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".lyrow .lyrow .lyrow .removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".lyrow .lyrow .removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".lyrow .removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".removeClean").each(function() {
			cleanHtml(this);
		});
		t.find(".removeClean").remove();
		$("#download-layout .column").removeClass("ui-sortable normal");
		$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
		//删除表格布局的td的column class
		$("#download-layout td.column").removeClass("column field");
		$("#download-layout td").find(".ui-resizable-e").remove();
		if ($("#download-layout .container").length > 0) {
			changeStructure("row-fluid", "row");
		}
		if(script){
			var $domScript=$("<script th:inline='javascript'></script>");
			$("#download-layout").children().children().append($domScript);
			$domScript.text(domScript);
		}
		var formatSrc = $.htmlClean($("#download-layout").children().html(), {
			format: true,
			allowedAttributes: [
				["id"],["target"],
				["class"],["style"],
				["role"],
				["aria-hidden"],
				["aria-labelledby"],
				["colnum",["meta:fields"]],
				["title",["meta:fields"]],
				["view-container",["meta:relation"]],
				["view",["meta:grid"]],
				["entityname",["meta:grid"]],
				["model",["meta:relation"]]
			],
			allowedAttrPrefix:["_meta:","_th:","data-","ref-","meta:","th:"],
			disAllowedClasses:[
               ["ui-sortable"],
               ["ui-draggable"],
               ["ui-resizable"]
            ],
            includeNamespaces:["meta:"],
		});
		//$("#download-layout").children().html(formatSrc);
		
		//设置模板到表单layout的template中
		layout.template=formatSrc;
		
		//$("#downloadModal textarea").empty();
		//$("#downloadModal textarea").val(formatSrc)
		initDownloadEditor("downloadeditor",formatSrc);
	};
	function resizeContainer() {
		$("body").css("min-height", $(window).height() - 90);
		$(".demo").css("min-height", $(window).height() - 160);
	};
	$(window).resize(function(){
		resizeContainer();
	});

	function restoreData(){
		if (supportstorage()) {
			layouthistory = JSON.parse(localStorage.getItem(localStoreFormKey));
			if (!layouthistory) return false;
			demoHtml = layouthistory.list[layouthistory.count-1];
			if (demoHtml) $(".demo").html(demoHtml);
		}
	}
	//当sortable为字段控件时，增加后将不可再添加该字段
	function disableDragField(t,$thisTd){
		var $item=$(t.item);
		var isFieldItem=$item.hasClass("field-item");
		if(isFieldItem){
			var dataField=$item.attr("data-field");
			var label=$item.attr("data-label");
			if($thisTd){
				var $parentLabel=$thisTd.prev().find("label");
				if($parentLabel.text()===label){
					if($thisTd.find(".field-item").length>0){
						$parentLabel.text($($thisTd.find(".field-item")[0]).attr("data-label"));
					}else{
						$parentLabel.text("");
					}
				}
				if($item.closest("td").find(".field-item").index($item)===0){
					$item.closest("td").prev("th").find("label").text(label);
				}
			}
			$(".sidebar-nav .box[data-field='"+dataField+"']").draggable("disable");
		}
	};
	function disableDragRelationGrid(t,$thisTd){
		var $item=$(t.item);
		var isRelationGridItem=$item.hasClass("relation-grid");
		if(isRelationGridItem){
			var dataRelation=$item.attr("data-relation");
			$(".sidebar-nav .box[data-relation='"+dataRelation+"']").draggable("disable");
		}
	};
	//当sortable为基础表单布局控件时，设置默认脚本到script区域
	function setScriptForFormLayout(t){
		var $item=$(t.item);
		var isBaseFormLayoutItem=$item.hasClass("base-form-layout");
		if(isBaseFormLayoutItem){
			toggleUniqueDraggableInDemo();
			var script=$item.find("#script").val();
			$item.find("#script").remove();
			$(".demo #script").html(script);
		}
	};
	function addConteneditable(){
		$(".demo table caption,.demo table th label,.demo .widget-box .widget-title h5,.demo label.form-label").removeAttr("contenteditable");
		$(".demo table caption,.demo table th label,.demo .widget-box .widget-title h5,.demo label.form-label").attr("contenteditable",true);
	};
	var contenthandle = CKEDITOR.replace( 'contenteditor' ,{
		language: 'zh-cn',
		contentsCss: [contentCss],
		allowedContent: true
	});
	resizeContainer();
	var sortableOptions={
		opacity: .35,
		handle:".drag",
		start: function(e,t) {
			if (!startdrag) stopsave++;
			startdrag = 1;
		}
	};
	function initSortableEleTdField($context,first){
		$("td.column.field",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					connectWith: "form .column",
					stop: function(e,t) {
						if(stopsave>0) stopsave--;
						disableDragField(t,$(this));
						startdrag = 0;
					}
				},sortableOptions));
			};
		});
	};
	function initSortableNormalColumn($context,first){
		$(".column.normal",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					connectWith: ".column",
					stop: function(e,t) {
						/*if(t.item.hasClass("field-item")){
							t.item.before($("#fieldLabelTemplate").render({"label":t.item.attr("data-label")}));
						}*/
						if(stopsave>0) stopsave--;
						startdrag = 0;
					}
				},sortableOptions));
			}
		});
	};
	function initSortableEle(first){
		var $context=".demo";
		$(".apply-panel",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					items:".form-parallel-item",
					connectWith: ".apply-panel",
					stop: function(e,t) {
						if(stopsave>0) stopsave--;
						disableDragRelationGrid(t,$(this));
						startdrag = 0;
					}
				},sortableOptions));
			}
		});
		initSortableNormalColumn($context,first);
		$(".form-sections",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					//items:".form-part",
					connectWith: ".form-sections",
					stop: function(e,t) {
						if(t.item.hasClass("autofields")){
							$(".sidebar-nav .lyrow.autofields").draggable("disable");
						}
						if(stopsave>0) stopsave--;
						initSortableEle();//.form-section and td.column
						setScriptForFormLayout(t);
						addConteneditable();
						startdrag = 0;
					}
				},sortableOptions));
			}
		});
		$(".form-section",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					//items:".form-table",
					connectWith: ".form-section,.widget-content",
					stop: function(e,t) {
						if(stopsave>0) stopsave--;
						initSortableEle();//td.column
						addConteneditable();
						startdrag = 0;
					}
				},sortableOptions));
			};
		});
		$(".widget-content",$context).each(function(){
			if((!$(this).hasClass("ui-sortable"))||first){
				$(this).sortable($.extend({
					//items:".form-table",
					connectWith: ".form-section,.widget-content",
					stop: function(e,t) {
						if(stopsave>0) stopsave--;
						initSortableEle();//td.column
						addConteneditable();
						startdrag = 0;
					}
				},sortableOptions));
			};
		});
		initSortableEleTdField($context,first);
	};
	var draggableOptions={
			helper: "clone",
			handle: ".drag",
			start: function(e,t) {
				if (!startdrag) stopsave++;
				startdrag = 1;
			},
			drag: function(e, t) {
				t.helper.width(400);
			}
		};
	function initDraggableEle(){
		/*初始化表单基础布局draggable*/
		$(".sidebar-nav .lyrow.base-form-layout").draggable($.extend({
			connectToSortable: ".demo,.demo .column.normal",
			stop: function(e, t) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
				initSortableEle();
				bindTableLayoutTdColspan();
			}
		},draggableOptions));
		$(".sidebar-nav .lyrow.form-part").draggable($.extend({
			connectToSortable: ".form-sections,form .column.normal",
			stop: function(e, t) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
			}
		},draggableOptions));
		$(".sidebar-nav .lyrow.form-table").draggable($.extend({
			connectToSortable: ".form-section,.widget-content",
			stop: function(e, t) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
				bindTableLayoutTdColspan();
			}
		},draggableOptions));
		
		/*初始化可在表单布局中使用的字段draggable*/
		$(".sidebar-nav .box.field-item").draggable($.extend({
			connectToSortable: "td.column.field,form .column.normal",
			stop: function(e,ui) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
			}
		},draggableOptions));/*end 初始化可在表单布局中使用的字段draggable*/
		$(".sidebar-nav .lyrow.normal").draggable($.extend({
			connectToSortable: ".demo,.demo .column.normal,.demo .form-sections",
			stop: function(e, t) {
				initSortableNormalColumn(".demo",false);
				if(stopsave>0) stopsave--;
				startdrag = 0;
			}
		},draggableOptions));
		$(".sidebar-nav .box.normal").draggable($.extend({
			connectToSortable: ".demo .column.normal,.demo td.column",
			stop: function(e, t) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
			}
		},draggableOptions));
		$(".sidebar-nav .box.relation-grid").draggable($.extend({
			connectToSortable: ".demo .apply-panel",
			stop: function(e, t) {
				if(stopsave>0) stopsave--;
				startdrag = 0;
			}
		},draggableOptions));
	};
	initDraggableEle();
	//first表示页面是第一次初始化
	function initContainer(first){
		$(".demo").sortable($.extend({
			//items:".lyrow.base-form-layout,.lyrow.normal",
			connectWith: ".demo",
			stop: function(e,t) {
				if(stopsave>0) stopsave--;
				initSortableEle();//all
				setScriptForFormLayout(t);
				addConteneditable();
				startdrag = 0;
			}
		},sortableOptions));
		initSortableEle(first);
		configurationElm();
		addConteneditable();
	};
	initContainer(true);
	$('body.edit .demo').on("click","[data-target=#editorModal]",function(e) {
		e.preventDefault();
		currenteditor = $(this).parent().parent().find('.view');
		var eText = currenteditor.html();
		contenthandle.setData(eText);
	});
	$("#savecontent").click(function(e) {
		e.preventDefault();
		currenteditor.html($(contenthandle.getData()).html());
	});
	var $currentSourceContainer=null;
	var simpleSourceEditor=null;
	function initSimpleSourceEditor(domId,content){
		simpleSourceEditor = ace.edit(domId);
		simpleSourceEditor.setValue(content);
		simpleSourceEditor.setTheme("ace/theme/eclipse");
		simpleSourceEditor.getSession().setMode("ace/mode/html");
		simpleSourceEditor.setShowPrintMargin(false);
		simpleSourceEditor.gotoLine(0,0,false);
	}
	$('body.edit .demo').on("click","[data-target=#simpleEditorModal]",function(e) {
		e.preventDefault();
		$currentSourceContainer = $(this).parent().parent().parent().find('.view');
		var sourceHtml = $currentSourceContainer.html();
		initSimpleSourceEditor("simplecontenteditor",sourceHtml);
	});
	$("#savesimplecontent").click(function(e) {
		e.preventDefault();
		var newSourceHtml=null;
		if(simpleSourceEditor){
			newSourceHtml=simpleSourceEditor.getValue();
			if($currentSourceContainer){
				$currentSourceContainer.html(newSourceHtml);
			}
			if($currentSourceContainer.parent().hasClass("form-table")){
				bindTableLayoutTdColspan($currentSourceContainer);
				initSortableEleTdField($currentSourceContainer,true);
			}
		}
	});
	var $currentFormToolbar=null;
	$('body.edit .demo').on("click","[data-target=#toolbarConfigModal]",function(e) {
		e.preventDefault();
		$currentFormToolbar=$(this).closest(".lyrow").find(".form-toolbar ul");
		var existsButtons=$currentFormToolbar.find("li.form-toolbar-button");
		var $toolbarModelBody=$("#toolbarConfigModal .modal-body");
		$toolbarModelBody.find("input:checked").removeProp("checked");
		for(var i=0;i<existsButtons.length;++i){
			var dataFunc=$(existsButtons[i]).attr("data-func");
			var $currentInput=$toolbarModelBody.find("input[value='"+dataFunc+"']");
			$currentInput.prop("checked",true);
			$currentInput.parent().insertBefore($toolbarModelBody.find(".checkbox:eq("+i+")"));
		}
	});
	$("#toolbarConfigModal .modal-body").sortable({
		opacity: .35,
		items:".checkbox",
		connectWith: "#toolbarConfigModal .modal-body",
		stop: function(e,t) {
			
		}
	});
	$("#saveToolbarSetup").click(function(e){
		e.preventDefault();
		var $toolbarModelBody=$("#toolbarConfigModal .modal-body");
		var addButtons=$toolbarModelBody.find("input:checked");
		var datas=[];
		for(var i=0;i<addButtons.length;++i){
			var $button=$(addButtons[i]);
			var mainFunc=$button.val();
			var displayName=$button.attr("data-displayName");
			var icon=$button.attr("data-icon");;
			datas.push({"mainFunc":mainFunc,"displayName":displayName,"icon":icon});
		}
		if($currentFormToolbar){
			$currentFormToolbar.find(".form-toolbar-button").remove();
			$currentFormToolbar.append($("#addToolbarButtonTemplate").render(datas));
		}
	});
	var $currentEditTabUl=null;//当前编辑的tab
	$('body.edit .demo').on("click","[data-target=#editTabModal]",function(e) {
		e.preventDefault();
		$currentEditTabUl=$(this).closest(".lyrow").find(".tabbable .nav-tabs");
		var tabsRelation=$currentEditTabUl.find("li:gt(0)").not(".new-added");
		var tabsNew=$currentEditTabUl.find("li.new-added");
		var tabs=[];
		if(tabsRelation.length>0){
			for(var i=0;i<tabsRelation.length;++i){
				var $a=$(tabsRelation[i]).find("a");
				var text=$a.text();
				var href=$a.attr("href");
				tabs.push({text:text,href:href,tabId:href});
			}
		}
		if(tabsNew.length>0){
			for(var i=0;i<tabsNew.length;++i){
				var $aNew=$(tabsNew[i]).find("a");
				var text=$aNew.text();
				var href=$aNew.attr("href");
				tabs.push({text:text,add:true,href:href,tabId:href});
			}
		}
		$("#accordion-edit-tab").html($("#editTabTemplate").render(tabs));
	});
	$("#editTabModal").on("click",".remove-tab",function(e){
		e.preventDefault();
		var $curAccordion=$(this).closest(".accordion-group");
		var href=$curAccordion.attr("data-tabId");
		if($currentEditTabUl&&$currentEditTabUl.length===1){
			$currentEditTabUl.find("li a[href='"+href+"']").parent().remove();
			$curAccordion.remove();
		}
	});
	$("#editTabModal").on("change",".accordion-inner input",function(e){
		e.preventDefault();
		var $curAccordion=$(this).closest(".accordion-group");
		var href=$curAccordion.attr("data-tabId");
		var name=$(this).attr("name");
		var value=$(this).val();
		if($currentEditTabUl&&$currentEditTabUl.length===1){
			var $a=$currentEditTabUl.find("li a[href='"+href+"']");
			if(name=="text"){
				$a.html(value);
				$curAccordion.find(".accordion-heading .accordion-toggle").text(value);
			}else if(name=="href"){
				$a.attr("href",value);
				$a.attr("_th:href","${themes.resolveAppPath('"+value+"')");
				$curAccordion.attr("data-tabId",value);
			}
		}
	});
	$('body.edit .demo').on("click","[data-target=#addTabModal]",function(e) {
		e.preventDefault();
		$currentEditTabUl=$(this).closest(".lyrow").find(".tabbable .nav-tabs");
	});
	$("#add-tab").click(function(){
		if($currentEditTabUl&&$currentEditTabUl.length===1){
			var $tabForm=$("#add-tab-form");
			var text=$tabForm.find("[name=text]").val();
			var href=$tabForm.find("[name=href]").val();
			//TODO 检测href唯一性
			if((!text)||(!href)){
				return false;
			}
			var tab=[{text:text,href:href}];
			$currentEditTabUl.append($("#addTabTemplate").render(tab));
		}
	});
	var $relationContainer=null;
	$('body.edit .demo').on("click","[data-target=#relationConfigModal]",function(e) {
		e.preventDefault();
		$("#relationConfigModal").find(":checkbox").attr("checked",true);
		$relationContainer=$(this).closest(".box").find(".view .relations-section");
		var excludeRelations=$relationContainer.attr("data-exclude-relation-names");
		if(typeof excludeRelations ==="string"){
			var excludes=excludeRelations.split(",");
			for(var i=0;i<excludes.length;++i){
				$("#relationConfigModal [value="+excludes[i]+"]").removeAttr("checked");
			}
		}
	});
	$("#saveRelationSetup").click(function(e){
		e.preventDefault();
		var excludeRelations=$("#relationConfigModal").find("input:not(:checked)");
		var excludes=[];
		for(var i=0;i<excludeRelations.length;++i){
			excludes.push($(excludeRelations[i]).val());
		}
		if(excludes.length>0){
			if($relationContainer){
				$relationContainer.attr("data-exclude-relation-names",excludes.join(","));
			}
		}
	});
	$("[data-target=#downloadModal]").click(function(e) {
		e.preventDefault();
		downloadLayoutSrc();
	});
	var editor=null;
	function initEditor(domId,content){
	    editor = ace.edit(domId);
	    editor.setValue(content);
	    editor.setTheme("ace/theme/tomorrow_night_eighties");
    	editor.getSession().setMode("ace/mode/javascript");
	    editor.setShowPrintMargin(false);
	    editor.gotoLine(0,0,false);
	}
	$("[data-target=#scriptModal]").click(function(e) {
		e.preventDefault();
		//$('#scripteditor').val($(".demo #script").val());
		initEditor("scripteditor",$(".demo #script").val());
	});
	$("#savescript").click(function(){
		//var script=$('#scripteditor').val();
		var content=editor.getValue();
		$('.demo #script').html(content);
		return;
	});
	var sourceHtmlEditor=null;
	function initSourceHtmlEditor(domId,content){
		sourceHtmlEditor = ace.edit(domId);
		sourceHtmlEditor.setValue(content);
		sourceHtmlEditor.setTheme("ace/theme/eclipse");
		sourceHtmlEditor.getSession().setMode("ace/mode/html");
		sourceHtmlEditor.setShowPrintMargin(false);
		sourceHtmlEditor.gotoLine(0,0,false);
	}
	function saveMainSourceToDemo(){
		var content=sourceHtmlEditor.getValue();
		$('.demo').html(content);
		initContainer(true);
	};
	$("#toggleSourceAndDesigner").click(function(e) {
		e.preventDefault();
		if($(".edit .demo").is(":hidden")){
			saveMainSourceToDemo();
			$(this).find("span").text("源码");
			$("#edit-main-source").hide();
			$(".edit .demo").show();
			$("#menu-layoutit button").not("#toggleSourceAndDesigner").removeAttr("disabled");
		}else{
			initSourceHtmlEditor("edit-main-source",$(".demo").html());
			$(this).find("span").text("设计");
			$(".edit .demo").hide();
			$("#edit-main-source").show();
			$("#menu-layoutit button").not("#toggleSourceAndDesigner").attr("disabled","disabled");
		}
		resizeContainer();
	});
	$("#save-form-attr").click(function(){
		var $form=$('#form-attr-edit-form');
		var displayName=$form.find("[name=displayName]").val();
		var type=$form.find("[name=type]:checked").val();
		var converter=$form.find("[name=converter]:checked").val();
		if(!displayName) return false;
		layout.displayName=displayName;
		layout.type=type;
		layout.converter=converter;
		return;
	});
	$("[data-target=#shareModal]").click(function(e) {
		if($(".demo .base-form-layout").length===0){
			alert("表单模板不存在！请添加后再保存！");
			return false;
		}
		e.preventDefault();
		handleSaveLayout();
		//设置表单layout的配置数据
		//layout.configData=$(".demo").html();
		//设置表单layout的模板数据
		downloadLayoutSrc();
		//save to Db [configData:layout.configData,]
		var _layout={displayName:layout.displayName,type:layout.type,converter:layout.converter,template:layout.template,id:layout.id};
		$.ajax({  
			type: "POST",
			dataType:"json",
			contentType:'application/json',
			url: layoutSaveUrl,  
			data: JSON.stringify(_layout),  
			success: function(data) {
				$("#shareModal").modal('hide');
				window.close();
			}
		});
	});
	$('body.edit .demo').on("click",".form-toolbar a,.bottom-tabs-ul a",function(e){
		e.preventDefault();
		return false;
	});
	$("#edit").click(function() {
		$("body").removeClass("devpreview sourcepreview");
		$("body").addClass("edit");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#devpreview").click(function() {
		$("body").removeClass("edit sourcepreview");
		$("body").addClass("devpreview");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#sourcepreview").click(function() {
		$("body").removeClass("edit");
		$("body").addClass("devpreview sourcepreview");
		removeMenuClasses();
		$(this).addClass("active");
		return false;
	});
	$("#fluidPage").click(function(e) {
		e.preventDefault();
		changeStructure("container", "container-fluid");
		$("#fixedPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc();
	});
	$("#fixedPage").click(function(e) {
		e.preventDefault();
		changeStructure("container-fluid", "container");
		$("#fluidPage").removeClass("active");
		$(this).addClass("active");
		downloadLayoutSrc();
	});
	$(".nav-header").click(function() {
		$(".sidebar-nav .boxes, .sidebar-nav .rows").hide();
		$(this).next().slideDown();
	});
	$("#clear").click(function(e) {
		e.preventDefault();
		var sureClear=confirm("确定清空页面和本地存储吗？清除后将无法【撤销】！");
		if(!sureClear){
			return false;
		}
		clearDemo();
	});
	$('#undo').click(function(){
		stopsave++;
		if (undoLayout()) initContainer(true);
		stopsave--;
	});
	$('#redo').click(function(){
		stopsave++;
		if (redoLayout()) initContainer(true);
		stopsave--;
	});
	removeElm();
	gridSystemGenerator();
	setInterval(function() {
		handleSaveLayout();
	}, timerSave);
}