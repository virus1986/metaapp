define(["require"],function(require){
	var reloadAllMenus=function(){
		var menuCon=$("#page-menus-container");
		var siteMapArray=menuCon.data("siteMapArray");
		$(".menu-item",menuCon).each(function(){
			var me = $(this) ;
			var url = $(this).attr("data-url");
			if(url ){
				if( !me.parent().find("ul.sub-menu").length ){
					var reqParams=$.extend({type:"post",dataType:"json",contentType:'text/html',async:false },{});
					jQuery.restAjax(url,{}, function(result){
						if(result.length>0){
							var container = $('<ul class="sub-menu"></ul>').appendTo($(me).parent()) ;
							container.append($("#navigate-menu-template").render( result ) ) ;
							
							$(result).each(function(){
								var self=this;
								if(!CommonUtil.containsEquals(siteMapArray,self)){
									self.searchKey=self.text.toLowerCase()+"_"+(self.dataUrl ||"").toLowerCase()+"_"+$("<input value='"+self.text+"'/>").toPinyin().replace(/[a-z\s]*/g,'').toLowerCase();
									if(siteMapArray){
										siteMapArray.push(self) ;
									}
								}
							}) ;
							
						}else{
							$(me).find(".arrow").remove() ;
						};
					},reqParams) ;
				};
			};
		}) ;
	};
	return {
		navigator:{
			reloadRoot:function(){
				var reloadUrl=Global.contextPath+"/portal/menu/reloadRoot";
				var menuCon=$("#page-menus-container");
				CommonLoader.loadData(null, reloadUrl, null, function(rootMenuHtml){
					menuCon.html($(rootMenuHtml).html());
					reloadAllMenus();
				})
			},
			reloadAllSubMenus:function(){
				reloadAllMenus();
			},
			reloadMenu:function(menuId){
				var menuCon=$("#page-menus-container");
				var siteMapArray=menuCon.data("siteMapArray");
				var me=$("li[data-menuid="+menuId+"]>a.menu-item","#page-menus-container");
				var url = me.attr("data-url");
				if(url ){
					if(me.parent().find("ul.sub-menu").length){
						me.parent().find("ul.sub-menu").remove();
					};
					var reqParams=$.extend({type:"post",dataType:"json",contentType:'text/html',async:false },{});
					jQuery.restAjax(url,{}, function(result){
						if(result.length>0){
							var container = $('<ul class="sub-menu"></ul>').appendTo($(me).parent()) ;
							container.append($("#navigate-menu-template").render( result ));
							$(result).each(function(){
								var self=this;
								if(!CommonUtil.containsEquals(siteMapArray,self)){
									self.searchKey=self.text.toLowerCase()+"_"+(self.dataUrl ||"").toLowerCase()+"_"+$("<input value='"+self.text+"'/>").toPinyin().replace(/[a-z\s]*/g,'').toLowerCase();
									if(siteMapArray){
										siteMapArray.push(self) ;
									}
								}
							}) ;
						}else{
							me.find(".arrow").remove() ;
						};
					},reqParams) ;
				};
			},
			navigateToEntity:function(entityName,type){
				var me = $(".menu-item[data-id='"+entityName+"_"+type+"']") ;
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
			}
		}
	}
});
