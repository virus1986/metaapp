(function($){
	function openCenterWindow2(URL,wndWidth,wndHeight,windowName){
		wndWidth=wndWidth||1000;
		wndHeight=wndHeight||600;
		var wndLeft = (window.screen.width-wndWidth)/2;
		//var wndTop  = (window.screen.height-wndHeight)/2;
		var wndTop  = 30;
		var form    = "width=" + wndWidth + ",height=" + wndHeight + ",left=" + wndLeft + ",top=" + wndTop + ",resizable=yes";
		 return window.open(URL,windowName||'',form);        
	};
	function addTabContextMenu(event,ui) {
		var imageRoot=window.Global.iconPath+"mini"; 
		var options = {
			width : 80,
			items : [ {
				text : i18n.t("common.closeOthers"),
				icon : imageRoot+"/icon_tool_012.gif",
				alias : "Close Others",
				action : closeOthers
			}, {
				text : i18n.t("common.closeAll"),
				icon : imageRoot+"/icon_tool_024.gif",
				alias : "Close All",
				action : closeAll
			} ],
			eventType : 'contextmenu'
		};

		function closeOthers() {
			var $tabs=$("[tabid^=tab_]","#tab-container");
			var tabLength=$tabs.length;
			var i=0;
			var curTabId=$(ui.tab).attr("tabid");
			for(;i<tabLength;++i){
				var id=$($tabs[i]).attr("tabid");
				if(curTabId!=id){
					$("#tab-container").tabs().remove({id:id});
				}
			}
		};
		function closeAll() {
			//$("#tab-container").tabs().destroy();
			//$("#default-content div").empty();
			//$("#tab-container").children(":not(#default-content)").remove();
			//var htmlContent=$("#content").html();
			//$("#tab-container").remove();
			//$("#content").html(htmlContent);
			var $tabs=$("[tabid^=tab_]","#tab-container");
			var tabLength=$tabs.length;
			var i=0;
			for(;i<tabLength;++i){
				var id=$($tabs[i]).attr("tabid");
				var href=$($tabs[i]).attr("href");
				if(href!="#default-content"){
					$("#tab-container").tabs().remove({id:id});
				}
			}
		};
		$(ui.tab).contextmenu(options);
	};
	function openLinkInTab(url,tabContainer,params){
		var tabContainerId=null,$tabContainer=null;
		if(typeof(tabContainer)==="undefined"){
			tabContainerId="#tab-container";
			$tabContainer=$(tabContainerId);
		}else if(typeof(tabContainer)==="string"){
			tabContainerId=tabContainer||"#tab-container";
			if(!tabContainerId.startWith("#")){
				tabContainerId="#"+tabContainerId;
			}	
			$tabContainer=$(tabContainerId);
		}else{
			$tabContainer=tabContainer;
		}
		if($(tabContainerId).length<1){
			$.messageBox.error({message:'can`t find container:'+tabContainer});
			return null;
		}
		
		$tabContainer.on("contentload",function(){
			if($.isFunction(params.userCallback)){
				params.userCallback.call($tabContainer);
			}
		});
		
		var title=params.title||"new-tab";
		var iframe=params.iframe||false;
		var openInCurTab=params.curTab||false;
		var tabId="tab_"+CommonUtil.hashCode(url);
		
		//tab不存在，将当前容器转为Tab控件

		if($tabContainer.find(".ui-tabs-nav").length<1){
			var createTabParam={
					closable:true,
					cache:true,
					iframe:iframe,
					panelContainer:$(".menu-tab-container"),
					tabs:[],
					ajaxOptions:{
						cache:false,
						error:function(xhr, s, index, a){
							CommonUtil.showJsonError(xhr,a);
						}
					},
					load:function(event,ui){
						$tabContainer.trigger("contentload");
						$tabContainer.off("contentload");
						$(".closeBtn").hide();
						if($.isFunction(params.callback)){
							params.callback(event,ui);
						}
					},
					show:function(event,ui){
						
					}
			};
			//是否存在默认内容
			//var defaultContent=$tabContainer.find(".default-content-tab").children(":first-child").html();
			var defaultContent=createTabParam.panelContainer.find(".default-content-tab").children(":first-child").html();
			if(defaultContent){
				var defaultTabId="tab_"+CommonUtil.hashCode(+window.location.pathname+(window.location.search||''));
				var contentId=createTabParam.panelContainer.find(".default-content-tab").attr("id");
				var contentTitle=createTabParam.panelContainer.find(".default-content-tab").find(".page-title").text();
				createTabParam=$.extend(true,createTabParam,{
					tabs:[{id:defaultTabId,label:contentTitle||'默认内容',content:contentId}]
				});
			}
			//是否为主框架上的Tab
			if(tabContainerId=="#tab-container"){
				createTabParam=$.extend(true,createTabParam,{
					load:function(event,ui){
						$tabContainer.trigger("contentload");
						$tabContainer.off("contentload");
						addTabContextMenu(event,ui);
						if($.isFunction(params.callback)){
							params.callback(event,ui);
						}
						$(".closeBtn").hide();
					},
					add:function(event,ui){
						addTabContextMenu(event,ui);
						/*setTimeout(function(){
							//$(ui.panel).css("overflow-y","auto").height($tabContainer.height()-28);
							$("iframe",$(ui.panel)).height($tabContainer.height()-30);
						},500);*/
					}
				});
			}
		
			$tabContainer.tabs(createTabParam);
		}
		if($("a[tabid="+tabId+"]").length>0){
			//Tab已经打开，激活并强制刷新当前页面
			$tabContainer.tabs().active({id:tabId});
			$tabContainer.tabs().load({id:tabId});
		}else{	
			var addTabParam={
				id:tabId,
				label:title,
				iframe:iframe,
				url:url
			};		
			//在当前Tab中打开,删除原来的Tab，并在原来index上创建一个新的Tab
			if(openInCurTab){
				var curTabId="";
				var curTabLi=$("li.ui-tabs-selected","#tab-container");
				var curTab= curTabLi.find("a");
				if(curTab.length>0){
					curTabId=curTab.attr("tabid");
					var index=$(curTabLi).index();
					addTabParam=$.extend(true,addTabParam,{
						index:index
					});
					$tabContainer.tabs().remove({id:curTabId});
				}
			}
			//create Tab
			$tabContainer.tabs().add(addTabParam);
		}
		//active Tab
		$tabContainer.tabs().active({id:tabId});
		//设置Tab窗口的固定高度
		//$tabContainer.height($tabContainer.parent().height()-5);
		if($tabContainer.hasClass("fix-height")){
			$panelContainer = $(".menu-tab-container") ;
			var panelHeight = $(window).height() - $(".header").outerHeight(true)- $(".footer").outerHeight(true)  ;
			$panelContainer.height(panelHeight) ;
			setTimeout(function(){			
				$panelContainer.find(">.ui-tabs-panel:visible").height(panelHeight) ;
				$panelContainer.find(">.ui-tabs-panel:visible>iframe").height($tabContainer.height()-30);
			},200);
		}

		return {tab:$tabContainer,tabId:tabId};
	};
	/** 默认以pop-up【弹出div】方式弹出窗口,url如果以http://开头默认以iframe方式加载
	 *  params参数说明:
	 * 	1 showType可选值：pop-up、tab、win、div，默认为pop-up
	 * 		a showType=pop-up ,打开弹出对话框依赖dialog控件
	 * 		b showType=tab ,在target参数指定tab控件容器创建新tab打开链接
	 * 		c showType=win ,以window.open方式打开链接
	 * 		d showType=div ,在target参数指定div中打开链接
	 * 		e showType=iframe ,当前页面弹出一个全屏的Iframe ,在iframe中显示外部链接
	 *  2 iframe：
	 *  	a showType取值pop-up、tab、div时可用
	 *  	b 可选值:true（iframe方式加载url）和false（div方式加载url），默认为false
	 *  3 target：
	 *  	a showType取值tab、win、div时可用
	 *  	b showType=tab时，target指定tab容器id
	 *  	c showType=div时，target指定div容器id
	 *  	d showType=win时，target指定window-name
	 */
	jQuery.openLink = function(url,_params,_callback,_fixParams){
		var params=_params;
		var callback=_callback;
		var fixParams=_fixParams;
		if($.isFunction(_params)){
			params={};
			callback=_params;
			fixParams={};
		}
		params=$.extend(params,{},true);
		var width=params.width;
		var height=params.height;
		var title=params.title;
		var contentSelector=null;
		var cs=params.contentSelector||(jQuery.isPlainObject(url)&&url.contentSelector);
		if(cs){
			contentSelector=cs;
			url="";
			params.showType="pop-up";
		}
		var _target=params.target;
		var _iframe=(!params.iframe|| params.iframe === "false")?false:true;
		if(url.indexOf("://")>0){
			_iframe=true;
		}
		params.iframe=_iframe;
		var _showType=(!!params.showType)?params.showType:"pop-up";
		url = jQuery.utils.parseUrl(url||"") ;
		jQuery.dialogReturnValue("__init__");
		params = params||{} ;
		fixParams = fixParams||{} ;
		
		if(_showType=="win"||!($.dialog)){
			var win = openCenterWindow2(url,width, height,_target);
			win.focus();
			window._dialogArguments = params ;
			var _callbak = function(){
				if( $.unblock ){$.unblock() ; }
				if($.isFunction(callback)){
					callback(window);
				}
			};
			try{
				if( jQuery.browser.msie ){
					win.attachEvent("onunload", _callbak );
				}else{
					win.onbeforeunload = _callbak ;
				}
			}catch(e){
				
			}
			return win ;
		}else if(_showType=="tab" || _showType=="cur-tab"){
			var __tabCallback=callback;
			var reVal=openLinkInTab(url,_target,
					{curTab:_showType=="cur-tab"?true:false,
					title:title,
					iframe:_iframe,
					userCallback:function(){
						if($.isFunction(__tabCallback)){
							__tabCallback.call(this);
						}
					},
					callback:function(event,ui){
						$(ui.panel).uiwidget();
						Page.enableUniform(ui.panel) ;
						if($(event.target).hasClass("fix-height")){
							Page.fitTabContentSize($(ui.panel));
						}
					}});
			
		}else if(_showType=="div"){
			if(!_target){
				$.messageBox.error({message:i18n.t("common.linkUnspecifiedContainerId")});
			}
			if((typeof _target =="string")&&(!_target.startWith("#"))){
				_target="#"+_target;
			}
			if(_iframe){
				$(_target).html("<iframe style='width:100%;height:100%;' src='"+url+"'></iframe>");
				if($.isFunction(callback)){
					callback(_target);
				}
			}else{
				CommonLoader.loadData(_target, url, params.data, callback,fixParams);
			}		
		}else if($.dialog&&_showType=="pop-up"){
			//打开对话框等宽等高
			var firstDialog = $(".ui-dialog:first>.ui-dialog-content") ;
			if( firstDialog ){
				height = height>firstDialog.height()?height: firstDialog.height();
				width  = width>firstDialog.width()?width:firstDialog.width() ;
			}
			jQuery.dialogReturnValue(null);
			var opts = {
					width:width,
					height:height,
					title:params.title||params.Title||fixParams.title||'',
					url:url,
					contentSelector:contentSelector,
					isShowLoading:false,
					requestType:params.requestType||"get",
					//data:params,
					iframe:_iframe,
					buttonBar:true,
					onload:function(){					
						var me = this ;
						if(!_iframe){
							setTimeout(function(){
								//控件初始化
								me.frwDom.uiwidget() ;
								Page.enableUniform(me.frwDom) ;
								//浏览器兼容
								me.frwDom.browserFix() ;
								
								var pageTitleCon=$(".ui-dialog-content .ui-dialog-title",me.frwDom).not(".ui-dialog-content .ui-tabs .ui-dialog-title");
								var pageBtnsCon= $(".ui-dialog-content .ui-dialog-buttonset",me.frwDom).not(".ui-dialog-content .ui-tabs .ui-dialog-buttonset");
								
								var $contentPane=$(".dialog-content",me.frwDom);
								var _height=$contentPane.height();
								if(pageTitleCon.length>0&& !pageTitleCon.is(":hidden")){
									_height=_height-pageTitleCon.height()+5;
								}
								if(pageBtnsCon.length>0 && !pageBtnsCon.is(":hidden")){
									_height=_height-pageBtnsCon.height();
								}
								$contentPane.height(_height);
								
								//移动标题和底部按钮
								if(pageTitleCon.length>0){
									$(".ui-dialog-titlebar .ui-dialog-title",me.frwDom).html($(pageTitleCon[0]).html());
									$(pageTitleCon[0]).remove();
								}
								if(pageBtnsCon.length>0){
									var dialogBtnPane=$(".ui-dialog-buttonpane",me.frwDom);
									var submitBtn=$(pageBtnsCon[0]).find(":submit");
									if(submitBtn.length>0){
										var btform=submitBtn.closest("form");
										submitBtn.click(function(){								
											if(btform.length>0){
												btform.submit();									
											}
											return false;
										});
										
									}
									dialogBtnPane.empty();						
									$(pageBtnsCon[0]).appendTo(dialogBtnPane);
								}
								
							},50);
						}
					},close:function(){
						callback && callback.call(this,$.dialogReturnValue()) ;
					}
				};
				
			opts = $.extend({},params,opts,fixParams) ;
			var _dialog = jQuery.dialog(opts) ;
			return _dialog ;
		}else if(_showType=="slide"){			
			var id="iframe_"+CommonUtil.hashCode(url);	
			url=Urls.appendParam(url,"_iframe_id",id);
			var height=window.innerHeight-5;
			var $container=$("<div id='"+id+"' class='pop-iframe'>"
							+"	<div class='color-mode-icons icon-color-close' style='display: block;'></div>"
							+"	<div class='mask-layout'>"
							+"		<div class='color-panel'></div>"
							+"		<div class='loading'></div>"
							+"	</div>"
							+"</div>");
			$("body").append($container);
			$("body").data("curIframe",id);
			$container.data("options",{
				callback:_callback,
				params:_params,
				fixParams:_fixParams
			});
			$(".icon-color-close").click(function(){
				Page.closeIframe(id, null);
			});
			$container.animate({left:0},"slow",function(){
				var $iframe=$("<iframe src='"+url+"' style='height:"+height+"px;' frameborder='no' border='0' marginwidth='0' marginheight='0' allowtransparency='yes'></iframe>");
				$iframe.bind("load",function(){
					$(".mask-layout").fadeOut("slow");
					$iframe.fadeIn("slow");
				});
				$container.append($iframe);	
			});
		}else{
			$.messageBox.info({message:_showType+'未支持:showType可选值：pop-up、tab、win、div，默认为pop-up'});
		}
	};
})(jQuery);