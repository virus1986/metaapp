(function($){
	function openCenterWindow2(URL,wndWidth,wndHeight,windowName){
		/*var wndLeft =20;
		var wndTop  = 10;
		if(wndWidth||wndHeight){
			wndLeft = (window.screen.width-wndWidth)/2;
			wndTop  = (window.screen.height-wndHeight)/2;
		}
		wndWidth=wndWidth||window.screen.width-30;
		wndHeight=wndHeight||window.screen.height-60;
		var form    = "width=" + wndWidth + ",height=" + wndHeight + ",left=" + wndLeft + ",top=" + wndTop + ",resizable=yes,toolbar=no,scrollbars=yes,menubar=no,location=no";
		*/
		return window.open(URL,windowName||'_blank');        
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
			$("#tab-container").tabs().destroy();
			$("#default-content div").empty();
			$("#tab-container").children(":not(#default-content)").remove();
			var htmlContent=$("#content").html();
			$("#tab-container").remove();
			$("#content").html(htmlContent);
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
		
		var title=params.title||"new-tab";
		var iframe=params.iframe||false;
		var openInCurTab=params.curTab||false;
		var tabId="tab_"+CommonUtil.hashCode(url);
		
		//tab不存在，将当前容器转为Tab控件

		if((!$tabContainer.hasClass("ui-widget-content") && !$tabContainer.hasClass("ui-carousel-horizontal"))||$tabContainer.find(".ui-tabs-nav").length<1){
			var createTabParam={
					closable:true,
					cache:true,
					iframe:iframe,
					tabs:[],
					ajaxOptions:{
						cache:false,
						error:function(xhr, s, index, a){
							CommonUtil.showJsonError(xhr,a);
						}
					},
					load:function(event,ui){
						$(".closeBtn").hide();
						if($.isFunction(params.callback)){
							params.callback(event,ui);
						}
					},
					show:function(event,ui){
						
					}
			};
			//是否存在默认内容
			var defaultContent=$tabContainer.find(".default-content-tab").children(":first-child").html();
			if(defaultContent){
				var defaultTabId="tab_"+CommonUtil.hashCode(+window.location.pathname+(window.location.search||''));
				var contentId=$tabContainer.find(".default-content-tab").attr("id");
				createTabParam=$.extend(true,createTabParam,{
					tabs:[{id:defaultTabId,label:'default',content:contentId}]
				});
			}
			//是否为主框架上的Tab
			if(tabContainerId=="#tab-container"){
				createTabParam=$.extend(true,createTabParam,{
					load:function(event,ui){					
						addTabContextMenu(event,ui);
						if($.isFunction(params.callback)){
							params.callback(event,ui);
						}
						$(".closeBtn").hide();
					},
					add:function(event,ui){
						addTabContextMenu(event,ui);
						setTimeout(function(){
							//$(ui.panel).css("overflow-y","auto").height($tabContainer.height()-28);
							$("iframe",$(ui.panel)).height($tabContainer.height()-30);
						},500);
					}
				});
			}
			$tabContainer.tabs(createTabParam);
			//设置Tab窗口的固定高度
			if($tabContainer.parent().css("height")){
				$tabContainer.height($tabContainer.parent().height()-5);
			}
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
		return {tab:$tabContainer,tabId:tabId};
	};
	/** 默认以pop-up【弹出div】方式弹出窗口,url如果以http://开头默认以iframe方式加载
	 *  params参数说明:
	 * 	1 showType可选值：pop-up、tab、win、div，默认为pop-up
	 * 		a showType=pop-up ,打开弹出对话框依赖dialog控件
	 * 		b showType=tab ,在target参数指定tab控件容器创建新tab打开链接
	 * 		c showType=win ,以window.open方式打开链接
	 * 		d showType=div ,在target参数指定div中打开链接
	 *  2 iframe：
	 *  	a showType取值pop-up、tab、div时可用
	 *  	b 可选值:true（iframe方式加载url）和false（div方式加载url），默认为false
	 *  3 target：
	 *  	a showType取值tab、win、div时可用
	 *  	b showType=tab时，target指定tab容器id
	 *  	c showType=div时，target指定div容器id
	 *  	d showType=win时，target指定window-name
	 */
	jQuery.openLink = function(url,params,callback,fixParams){
		params=$.extend(params,{},true);
		var width=params.width;
		var height=params.height;
		var title=params.title;
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
			var reVal=openLinkInTab(url,_target,
					{curTab:_showType=="cur-tab"?true:false,
					title:title,
					iframe:_iframe,
					callback:function(event,ui){
						$(ui.panel).uiwidget();
						if($.isFunction(callback)){
							callback(_target,ui);
						}
						if(event.target.id=="tab-container"){
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
			jQuery.dialogReturnValue(null);
			var opts = {
					width:width,
					height:height,
					title:params.title||params.Title||fixParams.title||'',
					url:url,
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
								//浏览器兼容
								me.frwDom.browserFix() ;							
								//移动标题和底部按钮
								var pageTitleCon=$(".ui-dialog-content .ui-dialog-title",me.frwDom);
								if(pageTitleCon.length>0){
									$(".ui-dialog-titlebar .ui-dialog-title",me.frwDom).html(pageTitleCon.html());
									pageTitleCon.remove();
								}
								var pageBtnsCon= $(".ui-dialog-content .ui-dialog-buttonset",me.frwDom);
								if(pageBtnsCon.length>0){
									var dialogBtnPane=$(".ui-dialog-buttonpane",me.frwDom);
									var submitBtn=pageBtnsCon.find(":submit");
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
									pageBtnsCon.appendTo(dialogBtnPane);
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
		}
	};
})(jQuery);