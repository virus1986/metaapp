define(["require"],function(require){
	return {
		createNew:function(_options){
			var layout = null ;
			var context = null ;
			var metadataFields  = null ;
			var xmlConfig = null ;
			var imageRoot = null ;
			var draggEl = null ;
			var customBaseUrl = null ;
			
			var CustomForm={
					configJson: null ,
					
					/*{
						layout:layout,
						context :context,
						metadataFields:metadataFields,
						xmlConfig:xmlConfig,
						imageRoot:xmlConfig,
						draggEl:draggEl
					}*/
					contextInit:function(options){
						layout = options.layout ;
						context = options.context ;
						metadataFields = options.metadataFields ;
						xmlConfig = options.xmlConfig ;
						imageRoot = options.imageRoot ;
						draggEl = options.draggEl ;
						customBaseUrl = options.customBaseUrl ;
					},
					//初始化列
					initCols:function(cols){
						$(cols).each(function(){
							var dataFieldName = this.dataField ;
							var label = this.label ;
							var contentType = this.contentType ;
							var refEntityName = this.refEntityName ;
							var relationName = this.relationName ;//~/
							var key = dataFieldName||relationName ;
							var nullable = this.nullable ;
							var nullableHtml = nullable===false?"<font color='red'>*</font>":"" ;
							if( CustomForm.__isHidden(key) ) return ;
							
							var attr = [] ;
							attr.push(" key='"+key+"' ") ;
							if( nullable===false ){
								attr.push(" required='true' ") ;
							}
							
							if( dataFieldName ){
								if(contentType)attr.push(" contentType='"+contentType+"' ") ;
								if(dataFieldName)attr.push(" dataFieldName='"+dataFieldName+"' ") ;//dataFieldName refEntityName relationName
								$(".col-container-fields" ,context).append("<li class='form-col' title='"+label+"'><span "+attr.join("")+">"+nullableHtml+""+label+"</span></li>") ;
							}else if(this.type == "ManyToOne" || this.type == "ManyToMany"){
								
								if(contentType)attr.push(" contentType='"+contentType+"' ") ;
								if(refEntityName)attr.push(" refEntityName='"+refEntityName+"' ") ;
								if(relationName)attr.push(" relationName='"+relationName+"' ") ;
								$(".col-container-relation" ,context).append("<li class='form-col' title='"+label+"'><span "+attr.join("")+">"+nullableHtml+""+label+"</span></li>") ;
							}
						}) ;
					},
					setTitle: function(displayName){
						$(context).parents(".ui-dialog:first").find(".win-title").html("["+displayName+"]") ;
					},
					eventBind:function(){
						$(".form-col",context).draggable({
							helper:"clone",
							cancel:".ui-state-disabled",
							start:function(event,ui){
								$(document).bind("contextmenu",function(){return false;}); 
								$(document).bind("selectstart",function(){return false;}); 
								//$(document).keydown(function(){return key(arguments[0])}); 
								$(ui.helper).addClass("design-dragging");
							}
						}) ;
						//自动字段设置绑定事件
						$(".autoFieldAreaSetup",context).click(function(){
							var auto=$(this).find("[name=autoFieldAreaSetup]:checked");
							var _autoFieldsConfig=CustomForm.configJson.autoFieldsConfig;
							if(!_autoFieldsConfig){
								_autoFieldsConfig={showAutoFields:false};
							}
							if(auto.length>0){
								_autoFieldsConfig.showAutoFields=true;
							}else{
								_autoFieldsConfig.showAutoFields=false;
							}
						});
						$(".design-action-prop",context).click(function(){
							var target = $(".design-col.design-active",context) ;
							if(target.length>0){
								var colAttrUrl=Global.contextPath+"/metadata/uitemplate/formColAttrs";
								var attrs=target.data("data-attrs")||[];
								jQuery.openLink(colAttrUrl ,{
									attrs:attrs
								},function(attrs){
									if(attrs){
										target.data("data-attrs",attrs);
									}
								});
								return false;
							}
							jQuery.openLink(customBaseUrl ,{
								showType:"pop-up",
								width:300,
								height:300,
								title:i18n.t("form.custom.updateTitle")
							},function(data){
								var args = jQuery.dialogReturnValue() ;
								if(args &&  args.displayName){
									var displayName = args.displayName ;
									$("[name='displayName']",context).val(displayName) ;
									CustomForm.setTitle(displayName) ;
								}
								//$(context).parents(".ui-dialog:first").find(".win-title").html("["+displayName+"]") ;
								//displayName
							}) ;
							return false ;
						}) ;

						$(".design-toolbar-section",context).click(function(){
							var col = $(this).attr("col") ;
							var html = CustomForm.__createDefaultSection( parseInt(col) ) ;
							var targetContext = $(html.join("")).appendTo( $(".design-container",context) ) ;
							CustomForm.__designEventBind(targetContext) ;
						}) ;

						$(".design-action-delete",context).click(function(){
							if($(this).hasClass("disabled")) return ;
							CustomForm.__doDelete() ;
							CustomForm.__actionRender() ;
						}) ;

						$(".design-action-addRow",context).click(function(){
							if($(this).hasClass("disabled")) return ;
							CustomForm.__doAddRow() ;
							CustomForm.__actionRender() ;
						}) ;
						
						$("#display_fields",context).click(function(){
							CustomForm.formatColResource() ;
						}) ;
						var ___context=$(context).closest(".ui-dialog-wrapper");
						if(___context.length<1){
							___context=context;
						}
						$(".closeBtn",___context).click(function(){
							$(this).dialogClose() ;
						}) ;
						$(".saveEntityForm",___context).click(function(){
							var sections = CustomForm.formatDesignToSectionsJson() ;
							var xml = CustomForm.formatJsonToXml(sections) ;
							$("[name='configData']",context).val(xml) ;
							
							$(this).attr("disabled","disabled");
							$(this).addClass("disabled");
							var url=$("#createFormForm", context).attr("action");
							var data=$("#createFormForm", context).toJson();
							jQuery.restPost(url,data,function(response){
								jQuery.dialogReturnValue(response);
								$(context).dialogClose();
							});
							
						}) ;
						$(".saveAndToHtml", ___context).click(function(){
							var me = this ;
							$.messageBox.confirm({
								message:i18n.t("form.custom.toHtmlAlert"),
								callback:function(result){
									if(result){
										var sections = CustomForm.formatDesignToSectionsJson() ;
										var xmlContent = CustomForm.formatJsonToXml(sections) ;
										$("[name=configData]",context).val(xmlContent);
										var valInfo = $.validation.validate("#createFormForm") ;
										if( valInfo.isError ) {
											return false;
										}
										$(this).attr("disabled","disabled");
										$(this).addClass("disabled");
										var url=$("#createFormForm", context).attr("action");
										var data=$("#createFormForm", context).toJson();
										
										//$(me).dialogClose() ;
										
										jQuery.restPost(Urls.urlParam(url,[{key:"_template",value:"1"}]),data,function(response){
												if(response==null){
													return ;
												}
												var editUrl=Global.contextPath+"/metadata/uitemplate/form_custom?action=edit&layout=form&entity="+response.entityName+"&id="+response.id;
												$(context).dialogReload({url:editUrl});
										});
									}
								}
							});
							
							
							return false ;
							
							$.messageBox.confirm({
								message:i18n.t("form.custom.toHtmlAlert"),
								callback:function(result){
									if(result){
										var sections = CustomForm.formatDesignToSectionsJson() ;
										var xmlContent = CustomForm.formatJsonToXml(sections) ;
										$("[name=configData]",context).val(xmlContent);
										var valInfo = $.validation.validate("#createFormForm") ;
										if( valInfo.isError ) {
											return false;
										}
										$(this).attr("disabled","disabled");
										$(this).addClass("disabled");
										var url=$("#createFormForm", context).attr("action");
										var data=$("#createFormForm", context).toJson();
										
										jQuery.restPost(Urls.urlParam(url,[{key:"_template",value:"1"}]),data,function(response){
											document.getElementById('ctlFlash').setText(response.template);
											$(context).data("template","yes");
											$("button.saveAndToHtml").hide();
										});
									}
								}
							});
						});
					},
					formatColResource : function(){
						$(".col-container" ,context).find("[key]").parent().removeClass("ui-state-disabled disabled") ;
						$(".design-col",context).find("input[key]").each(function(){
							var key = $(this).attr("key") ;
							$(".col-container" ,context).find("[key='"+key+"']").parent().addClass("ui-state-disabled disabled") ;
						}) ;
						
						var ck = $("#display_fields",context) ;
						if( ck.attr("checked") ){
							ck.parents(".fields-conatiner:first").find(".col-container li.disabled").hide() ;
						}else{
							ck.parents(".fields-conatiner:first").find(".col-container li.disabled").show() ;
						}
						
						//format required
						$(".design-col",context).find("font").remove();
						
						$(".form-col" , context).each(function(){
							var required = $(this).find("span").attr("required");
							///dataFieldName refEntityName relationName
							var dataFieldName = $(this).find("span").attr("dataFieldName");
							var refEntityName = $(this).find("span").attr("refEntityName");
							var relationName = $(this).find("span").attr("relationName");
							if( required ){
								if( dataFieldName ){
									$(".design-col[dataFieldName='"+dataFieldName+"']",context).find("label").prepend("<font color=red>*</font>") ;
								}else if( refEntityName && relationName ){
									$(".design-col[refEntityName='"+refEntityName+"'][relationName='"+relationName+"']",context)
										.find("label").prepend("<font color=red>*</font>") ;
								}
							}
						}) ;
						
//						var cIndex = $(".form-col" , context).find("span[required]").length ;
//						var dIndex = $(".design-col label font" , context).length ;
						
//						if( cIndex > dIndex  ){
//							$(context).parents(".ui-dialog-wrapper:first").find(".saveEntityForm").attr("disabled","disabled").addClass("disabled") ;
//							$(context).parents(".ui-dialog-wrapper:first").find(".saveAndToHtml").attr("disabled","disabled").addClass("disabled") ;
//						}else{
//							$(context).parents(".ui-dialog-wrapper:first").find(".saveEntityForm").removeAttr("disabled").removeClass("disabled") ;
//							$(context).parents(".ui-dialog-wrapper:first").find(".saveAndToHtml").removeAttr("disabled").removeClass("disabled") ;
//						}
					},
					formatJsonToXml:function(sections){
						CustomForm.configJson.sections = sections ;
						return CustomForm.__buildXml(CustomForm.configJson) ;
					},
					formatDesignToSectionsJson : function(){
						var sections = [] ;
						$(".design-block",context).each(function(){
							var section = {} ;
							sections.push(section) ;
							section.colNum = $(this).attr("colNum") ;
							section.name   = $.trim( $(this).find(".design-title").text() ) ;
							section.rows = [] ;
						
							$(this).find(".design-row").each(function(){
								var row = {} ;
								section.rows.push(row) ;
								row.capacity = $(this).attr("capacity") ;
								row.cells    = [] ;
								$(this).find(".design-col").each(function(){
									var key = $(this).find("input[key]").attr("key") ;
									var contentType = $(this).attr("contentType") ;

									var cell = {} ;
									row.cells.push(cell) ;
									cell.colspan = $(this).attr("colspan") ;
									cell.contentType = contentType ;
									cell.content = {
										//id:$(this).attr("id") 
									};
									cell.attrs=$(this).data("data-attrs");
									if( contentType == "RefEntityControl"){
										cell.content.refEntityName = $(this).attr("refEntityName") ;
										cell.content.relationName = $(this).attr("relationName") ;
									}else{
										cell.content.dataFieldName = $(this).attr("dataFieldName") ;
									}
								}) ;
							}) ;
						}) ;
						return sections ;
					},
					parseXmlToJson : function(){//parase xml to json
						var jsonConfig = {} ;
						CustomForm.configJson = jsonConfig ;
						var xmlconfig = $(xmlConfig) ;
						//自动字段区域设置
						jsonConfig.autoFieldsConfig={showAutoFields:false};
						var $autoFieldsConfigEle=xmlconfig.find("autoFieldsConfig");
						if($autoFieldsConfigEle){
							var _showAutoFields=$autoFieldsConfigEle.attr("showAutoFields");
							jsonConfig.autoFieldsConfig.showAutoFields=_showAutoFields||false;
						}

						jsonConfig.hiddenFields = [] ;
						xmlconfig.find("hiddenField").each(function(){
							jsonConfig.hiddenFields.push({ id: $.trim($(this).text()) }) ;
						}) ;

						jsonConfig.sections = [] ;
						xmlconfig.find("section").each(function(){
							var section = {} ;
							jsonConfig.sections.push(section) ;
							section.colNum = $(this).attr("colNum") ;
							section.name   = $(this).attr("name") ;
							section.rows = [] ;
							
							$(this).find("rows").each(function(){
								var row = {} ;
								section.rows.push(row) ;
								row.capacity = $(this).attr("capacity") ;
								row.cells = [] ;
								$(this).find("cell").each(function(){
									var cell = {} ;
									row.cells.push(cell) ;
									cell.colspan = $(this).attr("colspan") ;
									cell.contentType = $(this).attr("contentType") ;
									cell.content = {} ;
									var contentEl = $(this).find("content") ;

									//contentEl.attr("id") && ( cell.content.id = contentEl.attr("id")) ;
									contentEl.attr("refEntityName") && ( cell.content.refEntityName = contentEl.attr("refEntityName")) ;
									contentEl.attr("relationName") && (cell.content.relationName = contentEl.attr("relationName")) ;
									contentEl.attr("dataFieldName") && ( cell.content.dataFieldName = contentEl.attr("dataFieldName")) ;
									//字段属性设置
									var attrsEl=$(this).find("attrs");
									cell.attrs=[];
									$(attrsEl).find("attr").each(function(){
										var key=$(this).attr("key");
										var value=$(this).attr("value");
										cell.attrs.push({key:key,value:value});
									});
								}) ;
							}) ;
						}) ;
						return jsonConfig ;
					},
					parseConfigToHtml :function(json){//c
					
						var jsonConfig = json||CustomForm.parseXmlToJson() ;
					
						var html = [] ;
						$(jsonConfig.sections).each(function(){
							var _html = CustomForm.__createSection(this) ;
							html.push(_html.join("\n")) ;
						}) ;

						var targetContext = $(html.join("")).appendTo( $(".design-container").empty() ) ;

						//setTimeout(function(){
							CustomForm.__designEventBind(targetContext) ;
							CustomForm.formatColResource() ;
						//},100) ;
						$(".design-col",context).each(function(){
							var self=$(this);
							var contentType=self.attr("contenttype");
							//use for ref
							var refEntityName=self.attr("refentityname");
							var relationName=self.attr("relationname");
							//use for ordinary control
							var dataFieldName=self.attr("datafieldname");
							var __sections=$(jsonConfig.sections);
							var finish=false;
							for(var i=0;i<__sections.length;++i){
								var _rows=__sections[i].rows||[];
								for(var j=0;j<_rows.length;++j){
									var _cells=_rows[j].cells||[];
									for(var k=0;k<_cells.length;++k){
										var _cell=_cells[k];
										var _attrs=_cell.attrs;
										if(contentType=="RefEntityControl"){
											if(_cell.content&&refEntityName&&(_cell.content.refEntityName===refEntityName&&_cell.content.relationName===relationName)){
												self.data("data-attrs",_attrs);
												finish=true;
												break;
											}
										}else if(contentType=="Control"){
											if(_cell.content&&dataFieldName&&(_cell.content.dataFieldName===dataFieldName)){
												self.data("data-attrs",_attrs);
												finish=true;
												break;
											}
										}
									}
									if(finish){
										break;
									}
								}
								if(finish){
									break;
								}
							}
						});
					},
					/**
					<div class="design-block" colNum="" name="">
								<div class="design-title">XXXXXX</div>
								<div class="design-row row-fluid" capacity="">
									<div class="span6 first design-col" colspan="" contentType="" id="" refEntityName="" relationName="" dataFieldName="">
										<span>&nbsp;</span>
									</div>
									<div class="span6 design-col"><span>&nbsp;</span></div>
								</div>
								<div class="design-row row-fluid">
									<div class="span6 first design-col"><span>&nbsp;</span></div>
									<div class="span6 design-col"><span>&nbsp;</span></div>
								</div>
							</div>
					*/
					__createSection :function(section){
						var html = [] ;
						html.push('<div class="design-block" colNum="'+section.colNum+'">') ;
						html.push('		<div class="design-title">'+section.name+'</div>') ;
						$(section.rows).each(function(){
							if(this.cells && this.cells.length >=1)
								html.push('<div class="design-row row-fluid" capacity="'+this.capacity+'">') ;
							$(this.cells).each(function(index){
								//alert( $.json.encode(this) ) ;
								var attrs = [] ;
								var colspan = this.colspan=='undefined'?1:this.colspan ;
								if(this.colspan) attrs.push(' colspan="'+colspan+'" ') ;
								if(this.contentType) attrs.push(' contentType="'+this.contentType+'" ') ;
								//if(this.content.id) attrs.push(' id="'+this.content.id+'" ') ;
								if(this.content.refEntityName) attrs.push(' refEntityName="'+this.content.refEntityName+'" ') ;
								if(this.content.relationName) attrs.push(' relationName="'+this.content.relationName+'" ') ;
								if(this.content.dataFieldName) attrs.push(' dataFieldName="'+this.content.dataFieldName+'" ') ;

								var key = this.content.dataFieldName||this.content.relationName ;
								var clz = (12/section.colNum)*colspan ;
								var _designColHtml="";
								if(index==0)
									_designColHtml=('<div class="span'+clz+' first design-col" '+attrs.join("")+'>') ;
								else
									_designColHtml=('<div class="span'+clz+' design-col" '+attrs.join("")+'>') ;
								html.push(_designColHtml);
								if(key){
									var label = CustomForm.__getLabel(key) ;
									html.push('<span><label>'+label+'</label><input key="'+key+'" class="width'+section.colNum+'" type="text"></span>') ;
								}else{
									html.push('<span>&nbsp;</span>') ;
								}
								
								html.push('</div>') ;
							}) ;
							if(this.cells && this.cells.length >=1)
								html.push('</div>') ;
						}) ;
						html.push('</div>') ;

						return html ;
					},
					__createDefaultSection :function(colLength){
						var html = [] ;
						html.push('<div class="design-block" colNum="'+colLength+'">') ;
						html.push('		<div class="design-title" title="'+i18n.t("form.custom.doubleClickEdit")+'">'+i18n.t("form.custom.sectionName")+'</div>') ;
						for(var i=0 ;i<2 ;i++){
							html.push('<div class="design-row row-fluid" capacity="'+colLength+'">') ;
							var clz = 12/colLength ;
							for(var j=0 ;j<colLength ;j++){
								if(j==0)
									html.push('<div class="span'+clz+' first design-col" colspan="1">') ;
								else
									html.push('<div class="span'+clz+'  design-col"  colspan="1">') ;
								html.push('<span>&nbsp;</span>') ;
								html.push('</div>') ;
							}
							html.push('</div>') ;
						}
						html.push('</div>') ;

						return html ;
					},
					__getLabel:function(key){
						var result = "" ;
						$(metadataFields).each(function(){
							if( key == this.dataField || key == this.relationName )
								result = this.label ;
						}) ;
						return result||key ;
					},
					__buildXml:function( jsonConfig ){
						var xml = [] ;
						xml.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>') ;
						xml.push('<form xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">') ;
						//
						var _showAutoFields=jsonConfig.autoFieldsConfig.showAutoFields||false;
						xml.push('	<autoFieldsConfig showAutoFields="'+_showAutoFields+'">');
						xml.push("	</autoFieldsConfig>") ;
						//hiddenFields
						xml.push("	<hiddenFields>") ;
						$(jsonConfig.hiddenFields).each(function(){
							xml.push("		<hiddenField>"+this.id+"</hiddenField>") ;
						}) ;
						xml.push("	</hiddenFields>") ;
						//sections
						xml.push("	<sections>") ;
						$(jsonConfig.sections).each(function(){
							xml.push('		<section colNum="'+this.colNum+'" name="'+this.name+'">') ;
							$(this.rows).each(function(){
								xml.push('			<rows capacity="'+this.capacity+'">') ;
								$(this.cells).each(function(){
									xml.push('				<cell colspan="'+this.colspan+'" contentType="'+this.contentType+'">') ;
									var atts = [] ;
									atts.push(' xsi:type="'+toLowerCaseFirstCase(this.contentType)+'" ') ;
									//if(this.content.id) atts.push(' id="'+this.content.id+'" ') ;
									if(this.content.refEntityName) atts.push(' refEntityName="'+this.content.refEntityName+'" ') ;
									if(this.content.relationName) atts.push(' relationName="'+this.content.relationName+'" ') ;
									if(this.content.dataFieldName) atts.push(' dataFieldName="'+this.content.dataFieldName+'" ') ;
										
									xml.push('					<content  '+atts.join("")+'/>') ;
									xml.push('					<attrs>') ;
									$(this.attrs).each(function(){
										xml.push('						<attr  key="'+this.key+'" value="'+this.value+'"/>') ;
									});
									xml.push('					</attrs>') ;
									xml.push('				</cell>') ;
								}) ;
								xml.push('			</rows>') ;
							}) ;
							xml.push('		</section>') ;
						}) ;
						xml.push("	</sections>") ;
						xml.push("</form>") ;

						return xml.join("\n") ;

						function toLowerCaseFirstCase(content){
							if( !content ) return content ;
							var first = content.substring(0,1) ;
							var after = content.substring(1,content.length) ;
							return first.toLowerCase()+after ;
						}
					},
					__removeCol :function(el){
						el.removeAttr("contentType") ;
						el.removeAttr("refEntityName") ;
						el.removeAttr("relationName") ;
						el.removeAttr("dataFieldName") ;
						
					},
					__addCol : function(target,sourceCol , html ){
						if( !target.find("input").length ){//如果未渲染
							target.find("span").html(html) ;
						}else{
							var t = $(target)[0].outerHTML ;
							target.before(t) ;
							target.prev().find("span").html(html) ;
							target = target.prev() ;
						}
						var contentType = sourceCol.attr("contentType") ;
						target.attr("contentType",contentType ) ;
						if( contentType == 'Control'){
							target.removeAttr("refEntityName") ;
							target.removeAttr("relationName") ;
							target.attr("dataFieldName",sourceCol.attr("dataFieldName")) ;
						}else{
							target.removeAttr("dataFieldName") ;
							target.attr("refEntityName",sourceCol.attr("refEntityName")) ;
							target.attr("relationName",sourceCol.attr("relationName")) ;
						}
						
					},
					__isHidden : function(key){
						var isHidden = false ;
						$(CustomForm.configJson.hiddenFields).each(function(){
							if( this.id  == key)isHidden = true  ;
						}) ;
						return isHidden ;
					},
					__designEventBind :function(context,parentContext){

						//$(".design-col",context).draggable("destroy") ;
						$(".design-col input",context).parents(".design-col").draggable({
							helper:"clone",
							start:function(event,ui){
								if(!$(this).find("input").length) return false ;
								draggEl = this ;
								$(document).bind("contextmenu",function(){return false;}); 
								$(document).bind("selectstart",function(){return false;}); 
								//$(document).keydown(function(){return key(arguments[0])}); 
								$(ui.helper).addClass("design-dragging");
							}
						}) ;

						var colNum = $(".design-col:first",context).parents(".design-block").attr("colNum") ;
						var proxy = $("<div class='design-row row-fluid'><div class='span"+(12/colNum)+
							" design-col' style='border:1px solid red;'><span><label>&nbsp;</label></span></div></div>")
											.appendTo( $(".design-col:first",context).parents(".design-block") );
											
						var gridWidth = proxy.find(".design-col").outerWidth(true) + 13;
						proxy.remove() ;
						$(".design-col >span",context).resizable("destroy") ;
						$(".design-col >span",context).resizable({
							handles: "e",
							//containment: ".design-row",
							grid: [gridWidth , gridWidth],
							start:function(event , ui){
								var oriWidth = $(this).parent().width() ;
								$(this).attr("oriWidth",oriWidth) ;
								$(document).bind("contextmenu",function(){return false;}); 
								$(document).bind("selectstart",function(){return false;}); 
								$(this).parent().addClass( "design-hover" ) ;
							},stop: function(event, ui) {
								var oriWidth = $(this).attr("oriWidth") ;
								var newWidth = $(this).width()  ;
								var precent = newWidth/oriWidth  ;
								var colNum = $(this).parents(".design-block:first").attr("colNum");
								var ownerColspan = $(this).parent().attr("colspan") ;
								var clzSpan = "span"+( (12/colNum)*ownerColspan ) ;
								var _colspan = 0 ;
								var _spanCol = 0 ;

								_colspan = Math.round( ownerColspan * precent) ;
								
								_spanCol = (12/colNum)*_colspan ;
								
								if(_colspan>0)$(this).parent().attr("colspan",_colspan).removeClass(clzSpan).addClass("span"+ _spanCol ) ;
								
								CustomForm.__rebuildRow( this ,true) ;
								$(this).css({'width':'',height:''})
								CustomForm.__designEventBind($(this).parents(".design-block:first")) ;

								//fill null row
								$(this).parent().removeClass( "design-hover" ) ;
							}
						});
						
						$(".design-row",context).draggable({
							helper:"clone",
							start:function(event,ui){
								if(!$(this).find("input").length) return false ;
								draggEl = this ;
								$(document).bind("contextmenu",function(){return false;}); 
								$(document).bind("selectstart",function(){return false;}); 
								//$(document).keydown(function(){return key(arguments[0])}); 
								$(ui.helper).addClass("design-dragging").width( $(draggEl).outerWidth(true) );
							}
						}) ;
						
						$(".design-row",context).droppable({
							accept:".design-row",
							drop: function( event, ui ) {
								CustomForm.__clearActive() ;
								$( this ).removeClass("design-hover") ;
								$( draggEl ).addClass( "design-active design-row-active" ) ;
								$(this).before(draggEl) ;
							},
							over: function( event, ui ) {
								$(this).addClass( "design-hover" ) ;
							},
							out: function(event,ui){
								$(this).removeClass("design-hover" ) ;
							}
						}) ;
						
						$(".design-block",parentContext).draggable({
							helper:"clone",
							start:function(event,ui){
								if(!$(this).find("input").length) return false ;
								draggEl = this ;
								$(document).bind("contextmenu",function(){return false;}); 
								$(document).bind("selectstart",function(){return false;}); 
								//$(document).keydown(function(){return key(arguments[0])}); 
								$(ui.helper).addClass("design-dragging").width($(draggEl).width());
							}
						}) ;
						
						$(".design-block",parentContext).droppable({
							accept:".design-block",
							drop: function( event, ui ) {
								CustomForm.__clearActive() ;
								$( this ).removeClass("design-hover");
								$( draggEl ).addClass( "design-active design-block-active" ) ;
								//alert( ui.helper[0].outerHTML );
								$(this).before(draggEl) ;
							},
							over: function( event, ui ) {
								$(this).addClass( "design-hover" ) ;
							},
							out: function(event,ui){
								$(this).removeClass("design-hover" ) ;
							}
						}) ;

						$(".design-col",context).droppable({
							accept:".form-col,.design-col",
							drop: function( event, ui ) {
								CustomForm.__clearActive() ;
								$( this ).removeClass("design-hover");//.addClass( "design-active design-col-active" ) ;
								var col = ui.helper ;

								var rowNum = $(this).parents(".design-block:first").attr("colNum");
							
								if( ui.helper.hasClass("form-col") ){
									var key = col.find("span").attr("key") ;
									var label = col.text().replace("*","") ;
									
									var html = '<label>'+label+'</label><input  class="width'+rowNum+'" key="'+key+'" type="text">' ;
									
									$(document).unbind("contextmenu"); 
									$(document).unbind("selectstart"); 
									
									CustomForm.__addCol( $(this),ui.helper.find("span") ,html ) ;
								}else{
									//col
									var key = col.attr("dataFieldName")||col.attr("relationName") ;

									var label = col.find("label").text() ;
									var label = label.replace("*","") ;
									var html = '<label>'+label+'</label><input  class="width'+rowNum+'" key="'+key+'" type="text">' ;
									$(document).unbind("contextmenu"); 
									$(document).unbind("selectstart"); 
									CustomForm.__addCol( $(this),ui.helper ,html) ;
						
									var source = $(draggEl)  ;

									source.empty().append("<span>&nbsp;</span>");
									CustomForm.__removeCol( source ) ;
									source.remove() ;
									ui.helper.remove();

								}

								CustomForm.formatColResource() ; 
								CustomForm.__rebuildRow( $( this ) ) ; 
								CustomForm.__clearActive() ;
								
								CustomForm.__fillNullCell($(this)) ; 
								CustomForm.__designEventBind($(this).parents(".design-block:first")) ;
								
							},
							over: function( event, ui ) {
								$(this).addClass( "design-hover" ) ;
							},
							out: function(event,ui){
								$(this).removeClass("design-hover" ) ;
							}
						}) ;

						$(".design-col",parentContext).unbind("click").bind('click',function(event){
							CustomForm.__clearActive() ;
							$(this).addClass("design-active design-col-active") ;
							event.stopPropagation() ;
							CustomForm.__actionRender() ;
							return false ;
						}) ;

						$(".design-row",parentContext).unbind("click").bind('click',function(event){
							CustomForm.__clearActive() ;
							$(this).addClass("design-active design-row-active") ;
							event.stopPropagation() ;
							CustomForm.__actionRender() ;
						}) ;

						$(".design-block",parentContext).unbind("click").bind('click',function(event){//design-block
							CustomForm.__clearActive() ;
							$(this).addClass("design-active design-block-active") ;
							event.stopPropagation() ;
							CustomForm.__actionRender() ;
						}) ;

						//title 
						$(".design-title",parentContext).each(function(){
							$(this).mouseenter(function(){
								$(this).find(".design-edit-title").remove()
									.append("<div class='design-edit-title' title='"+i18n.t("common.edit")+"'><img src='"+imageRoot+"ico_edit.png'></div>") ;
							}).mouseleave(function(){
								$(this).find(".design-edit-title").remove() ;
							}) ;
							
							$(this).unbind("dblclick").bind("dblclick",function(){
								if($(this).find("input")[0]) return ;
								var me = this ;
								var title = $.trim($(this).text()) ;
								$("<input type='text' value='"+title+"'>").attr("raw",title)
								.appendTo( $(this).empty() )
								.on("blur",function(){
									var title = $(this).val()||title ;
									$(me).html(title);
								}) ;;
							})
						}) ;
						

						$(".design-edit-title",parentContext).unbind("click").bind("click",function(){
							CustomForm.formatColResource() ;
						}) ;
					},
					__clearActive : function(){
						$(".design-active",context).removeClass("design-row-active design-col-active design-active design-block-active") ;
					},
					__doDelete : function(){
						var target = $(".design-active",context) ;
						CustomForm.__clearActive() ;
						
						if(target.hasClass("design-col")){
							target.empty().append("<span>&nbsp;</span>");
							CustomForm.__removeCol( target ) ;
							CustomForm.formatColResource() ;
						}else if(target.hasClass("design-row")){
							target.remove();
							CustomForm.formatColResource() ;
						}else if(target.hasClass("design-block")){
							if( $(".design-block",context).length <= 1 ){
								$.messageBox.warning({message:i18n.t("form.custom.lastSectionCanNotDelete")});
							}else{
								var _p = target.parent() ;
								target.remove();
								CustomForm.formatColResource() ;
							}
						}
					},
					__doAddRow : function(_target , targetRow ){
						var target = _target||$(".design-active",context) ;
						if(!target.hasClass("design-block")){
							target = target.parents(".design-block:first") ;
						}
						CustomForm.__clearActive() ;

						var cols = parseInt( target.attr("colNum") );

						var html = [] ;
						html.push('<div class="design-row design-active design-row-active row-fluid" capacity="'+cols+'">') ;
						var clz = 12/cols ;
						for(var j=0 ;j<cols ;j++){
							if(j==0)
								html.push('<div class="span'+clz+' first design-col" colspan="1">') ;
							else
								html.push('<div class="span'+clz+' design-col"  colspan="1">') ;
							html.push('<span>&nbsp;</span>') ;
							html.push('</div>') ;
						}
						html.push('</div>') ;
						var row = null ;
						if( targetRow ){
							targetRow.after(html.join("")) ;
							row = targetRow.next() ;
						}else{
							row = $(html.join("")).appendTo( target ) ;
							CustomForm.__designEventBind(row) ;
						}
						return row ;
					},
					__actionRender : function(){
						var _c = $(".design-active",context) ;
						
						if( _c.length ){//you active
							//if( _c.hasClass("design-block") ){
								$(".design-action-addRow",context).removeAttr("disabeld").removeClass("ui-state-disabled disabled");
							//}else{
							//	$(".design-action-addRow",context).attr("disabled",true).addClass("ui-state-disabled disabled");
							//}
							$(".design-action-delete",context).removeAttr("disabeld").removeClass("ui-state-disabled disabled");
						}else{
							$(".design-action-delete,.design-action-addRow",context).attr("disabled",true).addClass("ui-state-disabled disabled");
							$(".design-action-addRow",context).attr("disabled",true).addClass("ui-state-disabled disabled");
						}
					},
					__rebuildRow :function(target,isFillNullCell){
						var row = $(target).parents(".design-row:first") ;
						row.find(".design-col:first").addClass("first") ;
						row.find(".design-col:gt(0)").removeClass("first") ;
						var colNum = $(target).parents(".design-block:first").attr("colNum")  ;

						var totalCols = 0 ;
						var rowNum    = 0 ;
						var newRow    = null ;
						var colEls = row.find(".design-col") ;
						
						colEls.each(function(){
							//if( ( !$(this).hasClass("ui-draggable")) || $(this).hasClass("design-dragging") )return ;
							
							var colspan = parseInt($(this).attr("colspan")) ;
							totalCols += colspan ;

							if( totalCols <= colNum ){
							}else{
								totalCols = colspan ;
								rowNum++ ;
							}

							if( rowNum == 0 ){//do nothing 
								return ;
							}else{
								if( $(this).find("input").get(0) ){
									newRow = newRow||CustomForm.__doAddRow( $(target) , $(target).parents(".design-row:first") ) ;
									newRow.find(".design-col:last").remove();
									newRow.prepend(this) ;
									newRow.find(".design-col:first").addClass("first") ;
									newRow.find(".design-col:gt(0)").removeClass("first") ;
									newRow.find(".design-col").each(function(){
										if(!$(this).find("input").length) $(this).remove();
									}) ;
								}else{
									$(this).remove() ;
								}
							}
						}) ;
						//fill null cell
						if(isFillNullCell){
							CustomForm.__fillNullCell(target) ;
						}
					},
					__fillNullCell :function(target){
						var colNum = $(target).parents(".design-block:first").attr("colNum")  ;
						$(target).parents(".design-block:first").find(".design-row").each(function(){
							var colspan = 0 ;
							$(this).find(".design-col").each(function(){
								 colspan += parseInt($(this).attr("colspan")) ;
							}) ;

							var cc = colNum - colspan ;
							if(cc > 0 ){
								for(var i = 0 ;i<cc ;i++){
									var html = [] ;
									html.push('<div class="span'+(12/colNum)+'  design-col"  colspan="1">') ;
									html.push('<span>&nbsp;</span>') ;
									html.push('</div>') ;
									$(this).append(html.join("")) ;
								}
							}
						}) ;
						
						//清除null row
						/*var nullRowIndex = 0 ;
						$(target).parents(".design-block:first").find(".design-row").each(function(){
							if( !$(this).find("input")[0] )nullRowIndex++ ;
							if(nullRowIndex>1){
								$(this).remove();
							}
						}) ;*/
					}
			};
			
			var customFormManager={};
			customFormManager.contextInit=CustomForm.contextInit;
			customFormManager.parseXmlToJson=CustomForm.parseXmlToJson;
			customFormManager.initCols=CustomForm.initCols;
			customFormManager.parseConfigToHtml=CustomForm.parseConfigToHtml;
			customFormManager.eventBind=CustomForm.eventBind;
			customFormManager.__actionRender=CustomForm.__actionRender;
			customFormManager.setTitle=CustomForm.setTitle;
			return customFormManager;
		}
	};//End of return
});
/*(function(){
	window.CustomForm = {}
})() ;*/