$(function(){
	var user = $user;
	//格式化菜单为数组$siteMap
	function formatSiteMapToArray(siteMap,siteMapArray ){
		$( siteMap ).each(function(index,item){
			if(this.icon && this.icon.indexOf("icon-")!=0){
				this.icon = Global.iconPath+"/"+item.icon ;
			}			
			this.searchKey=this.text.toLowerCase()+"_"+(this.dataUrl ||"").toLowerCase()+"_"+$("<input value='"+this.text+"'/>").toPinyin().replace(/[a-z\s]*/g,'').toLowerCase();
			siteMapArray.push(this) ;
			if( item.menus && item.menus.length >0 ){
				formatSiteMapToArray(item.menus,siteMapArray) ;
			}
		}) ;
		return siteMapArray ;
	};
	var menuCon=$("#page-menus-container");
	var siteMapArray = formatSiteMapToArray( $siteMap , []  ) ;
	menuCon.data("siteMapArray",siteMapArray);
	function getSiteMapById(menuId){
		var s = null ;
		$(siteMapArray).each(function(){
			if(this.id == menuId){
				s = this ;
			}
		}) ;
		return s ;
	}
	
	//初始化菜单开始
	$(".menu-item").each(function(){
		var me = $(this) ;
		var url = $(this).attr("data-url");
		if(url ){
			if( !me.parent().find("ul.sub-menu").length ){
				var reqParams=$.extend({type:"post",dataType:"json",contentType:'text/html',async:true },{});
				jQuery.restAjax(url,{}, function(result){
					if(result.length>0){
						var container = $('<ul class="sub-menu"></ul>').appendTo($(me).parent()) ;
						container.append(
								$("#navigate-menu-template").render( result ) 
						) ;
						
						$(result).each(function(){
							this.searchKey=this.text.toLowerCase()+"_"+(this.dataUrl ||"").toLowerCase()+"_"+$("<input value='"+this.text+"'/>").toPinyin().replace(/[a-z\s]*/g,'').toLowerCase();
							siteMapArray.push(this) ;
						}) ;
						
					}else{
						$(me).find(".arrow").remove() ;
					};
				},reqParams) ;
			};
		};
	}) ;

	App.init();
	var $panelContainer = $(".menu-tab-container") ;
	var panelHeight = $(window).height() - $(".header").outerHeight(true)- $(".footer").outerHeight(true)  ;
	$panelContainer.height(panelHeight) ;
	 
	 //个人信息事件绑定
	 $(".persion-info").click(function(){
		 var userId = user.id ;
		 $.openLink(Global.contextPath+"/uamUser/edit?id="+userId,{
				width:600,
				height:400,
				showType: 'pop-up',
				title:"个人信息",
				iframe:false,requestType:"GET",data:{}},
				function(){
					
				}
			) ;
    }) ;
	 
	 //本地密码修改
	 $(".changpwd").click(function(){
		var url=Global.contextPath+"/changepwd";
		$.openLink(url,{showType:'pop-up',title:"修改密码"});				
	 });

	 //uam密码重置事件绑定
	 $(".password-reset").click(function(){
		 $.openLink(Global.contextPath+"/uamUser/reset?pop=true",{
				width:600,
				height:400,
				showType: 'pop-up',
				title:"用户密码重置",
				iframe:false,requestType:"GET",data:{}},
				function(){
					
				}
			) ;
     }) ;
	 
	//top site click
 	$("#site-list li ").click(function(){
 		var menuCode = $(this).attr("data-code") ;
 		url = Global.contextPath +"/site_"+menuCode  ;
 		window.location.href =url  ;
 		return false ;
 	}) ;
 	
 	function menuClickForNavigator(){
 		$(this).append('<span class="selected"></span>') ;
 		$(".menu-item").parent().removeClass("active") ;
		$(this).parent().addClass("active") ;
 	}
 	
 	function contentHeadRender(){
 		var curMenu = $(".page-sidebar-menu .active").find(">.menu-item") ;
 		var menuId = curMenu.attr("data-id") ;
 		var menu = getSiteMapById( menuId ) ;
		menu = menu ||{ text: curMenu.text(), description:"" } ;
 		$(".ui-tabs-panel:visible .breadcrumb").show();
		$(".ui-tabs-panel:visible .breadcrumb-item").remove() ;
		var isFirst = true ;
		//format menu description
		var _html=$(".ui-tabs-panel:visible h3.page-title").find("span").html();
		if(_html===""||!_html){
			$(".ui-tabs-panel:visible h3.page-title").find("span").html(menu.text||"");
		}
		var description=$(".ui-tabs-panel:visible h3.page-title").find("small").html();
		if(typeof(description)=="undefined" || description==null || description.length<1){
			$(".ui-tabs-panel:visible h3.page-title").find("small").html(menu.description||"");
		}
		
		//format breadcrumb data-menuid
		
		//curMenu = $(me) ;
		var breadcrumb = "" ;
		while( curMenu.length ){
			var menuText =  $.trim( curMenu.text() );
			var imgI = curMenu.find("i")[0].outerHTML ;
			breadcrumb = '<li  class="breadcrumb-item">'+imgI + '<a href="#"> '+menuText+ '</a> ' ;
			
			if(!isFirst){
				breadcrumb = breadcrumb+'<i class="icon-angle-right"></i>' ;
			}
			breadcrumb = breadcrumb+'</li>' ;
			$(breadcrumb).prependTo($(".ui-tabs-panel:visible .breadcrumb")) ;
			isFirst = false ;
			curMenu = curMenu.closest("ul").closest("li").find(">a.menu-item") ;
		}
		
		$("<li><i class='icon-home home-icon'></i> <a href='javascript://'>Home</a><i class='icon-angle-right'></i></li>").prependTo( $(".ui-tabs-panel:visible .breadcrumb") );
 	}
 	
 	$(".menu-item").live("click",function(){
		//读取菜单tree
		var menuName =  $.trim($(this).text());
		var menuUrl = $(this).attr("menu-url") ;
		
		if(menuUrl){//加载菜单
			var menuId = $(this).attr("data-id") ;
			var curMenu = $(this) ;
			var menu = getSiteMapById( menuId ) ;
			menu = menu ||{ text: curMenu.text(), description:"" } ;
			var showType=menu.showType||"tab";

			menuClickForNavigator.call(this) ;
			if(!!showType&&showType.toLowerCase()=='cur-tab'){
				$.openLink(menuUrl,{showType:'cur-tab',title:menuName},function(){
					contentHeadRender() ;
				});
			}else if(!!showType&&showType.toLowerCase()=='win'){
				$.openLink(menuUrl,{showType:'win',title:menuName,target:menuName});
			}else if(!!showType&&showType.toLowerCase()=='pop-up'){
				$.openLink(menuUrl,{showType:'pop-up',title:menuName});
			}else{
				$.openLink(menuUrl,{showType:'tab',title:menuName},function(){
					contentHeadRender() ;
				});
			}
			//$.openLink(menuUrl,{showType:'tab',title: menuName});
		};
	}) ;
 	
 	  $(".sys-select").bind("click", function () {
          $(".collapsebar").animate({ top: "0px" }).bind("mouseleave", function () {
              $(this).animate({ top: "-104px" });
          });
      });
      $(".drop-list").bind("click", function () {
          $(".drop-list-cont").slideToggle("slow");
      });
 	  
      //begin 导航全局搜索模块
      // Highlight an item in the results dropdown
      function selectDropdownItem (item) {
		   if(item) {
			   	if(selected_dropdown_item) {
			   		deselectDropdownItem($(selected_dropdown_item));
			   	}
			   	item.addClass("input-img-selected-item");
		            selected_dropdown_item = item;
		        }
		    };
		    var searchItemSelectedDom=null;
		    //var popContainer=$("input","#nav-global-search").next(".searchResultBox");
		    $("#page-menus-container").on("mouseleave","#nav-global-search .searchResultBox",function(event){
		    	if(!$("input","#nav-global-search").is(":focus")){
		    		$(this).hide();
		    		searchItemSelectedDom=null;
		    	}
		    });
		   
		    $(document).click(function(){
		    	var popContainer=$("input","#nav-global-search").next(".searchResultBox");
		    	if(!$("input","#nav-global-search").is(":focus")){
		    		popContainer.hide();
		    		searchItemSelectedDom=null;
		    	}
		    });
		    $("#page-menus-container").on("keydown","#nav-global-search input",function(event){
		    	var popContainer=$("input","#nav-global-search").next(".searchResultBox");
		    	switch(event.keyCode) {
		    	case KEY.LEFT:
		    	case KEY.RIGHT:
		    	case KEY.UP:
		    	case KEY.DOWN:
		    		if(!searchItemSelectedDom){
		    			if(popContainer.find(".searchItem:first").length>0){
		    				searchItemSelectedDom=popContainer.find(".searchItem:first");
		    			}
		    		}else{
		    			if(event.keyCode==KEY.DOWN|| event.keyCode === KEY.RIGHT){
		    				if(searchItemSelectedDom.next(".searchItem").length>0){
		    					searchItemSelectedDom.removeClass("input-img-selected-item");
		    					searchItemSelectedDom=searchItemSelectedDom.next(".searchItem");
		    				}
		    			}else{
		    				if(searchItemSelectedDom.prev(".searchItem").length>0){
		    					searchItemSelectedDom.removeClass("input-img-selected-item");
		    					searchItemSelectedDom=searchItemSelectedDom.prev(".searchItem");
		    				}
		    			}
		    		}
		    		if(searchItemSelectedDom){
		    			searchItemSelectedDom.addClass("input-img-selected-item");
		    		}
		    		return false;
		    		break;
		    	case KEY.BACKSPACE:
		    		setTimeout(function(){doSearch();}, 5);
		    	case KEY.ESCAPE:
		    		popContainer.hide();
		    		break;
		    	case KEY.TAB:
		    	case KEY.ENTER:
		    		if(searchItemSelectedDom){
		    			doNavigate(searchItemSelectedDom);
		    		}
	    			popContainer.hide();
	    			searchItemSelectedDom=null;
	    			return false;
	    			break;
		    	case KEY.NUMPAD_ENTER:
		    	default:
		    		if(String.fromCharCode(event.which)){
		    			setTimeout(function(){doSearch();}, 5);
		    		}
		    	break;
		    }
		});
		function doNavigate(searchItemSelectedDom){
			var id=$(searchItemSelectedDom).attr("data-id");
			if(searchItemSelectedDom.hasClass("navMenuSearchItem")){
				_navigateToMenu(id,"menu");
			}else if(searchItemSelectedDom.hasClass("entitySearchItem")){
				_navigateToMenu(id,"entity");
			}
		};
		function doSearch(){
			var searchString=$("input","#nav-global-search").val();
			var inputSearch=$("input","#nav-global-search");
			var popContainer=$("input","#nav-global-search").next(".searchResultBox");
			if( !searchString ) return ;
			//客户端匹配
			var searchedSiteMap = [] ;
			$( siteMapArray ).each(function(){
				var text = this.searchKey ;
				if( text.indexOf(searchString)>=0 ){
					searchedSiteMap.push(this) ;
				}
			}) ;
			if(searchedSiteMap.length >0 ){
				var html = $("#navigate-search-template").render( searchedSiteMap )  ;
				html = '<ul  class="dropdown-menu" style="width:100%;position:static;display: block;">'+html+'</ul>' ;
				popContainer.html(html).css({
	                position: "absolute",
	                top: inputSearch.outerHeight()+54,//self.offset().top + 
	                left: inputSearch.offset().left,//inputSearch.offset().left
	                zIndex: 2000,
	                width:$("#nav-global-search").width()-4
	            }).show();
				
				popContainer.off("mousedown",".navMenuSearchItem");
				popContainer.on("mousedown",".navMenuSearchItem",function(){
					var id=$(this).attr("data-id");
					_navigateToMenu(id,"menu");
					popContainer.hide();
				});
				popContainer.off("mousedown",".entitySearchItem");
				popContainer.on("mousedown",".entitySearchItem",function(){
					var id=$(this).attr("data-id");
					_navigateToMenu(id,"entity");
					popContainer.hide();
				});
			}
			return ;
		};
		function getSingleNavSearchDetail(id,results){
			for(var i=0;i<results.length;++i){
				if(id==results[i].id){
					return results[i];
				}
			}
		};
		function navigateToDeepMenu(parentIds){
			for(var i=1;i<parentIds.length;++i){
				var nodeId=parentIds[i];
				var parentIcon=$(".bbit-tree-ec-icon","div[nodeid="+nodeId+"]");
				if(!parentIcon.hasClass("bbit-tree-elbow-minus")){
					parentIcon.trigger("click");
				};
			};
		};
		function _navigateToMenu(id,type){
			//打开父节点
			var me = $(".menu-item[data-id='"+id+"']") ;
			var self = me ;
			var parentUl = self.closest("ul.sub-menu") ;
			while(parentUl.length){
				var ulParentLi = parentUl.closest("li") ;
				ulParentLi.addClass("open") ;
				ulParentLi.find(">a").find(".arrow").addClass("open") ;
				ulParentLi.find(">ul").show();
				
				parentUl = ulParentLi.closest("ul.sub-menu") ;
			}
			
			me.trigger("click");
		};
		// end 导航全局搜索模块
		 
}) ;