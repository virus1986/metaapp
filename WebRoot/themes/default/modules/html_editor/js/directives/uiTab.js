/**
 * Directive that defines a jquery-ui-tab that can edit tab content or url
 */

define(['angular',"directives/directives","common/utils","common/classLoader","services/sidebarItems",
        "services/appPd","services/layoutService","services/templates","services/binManager"], function(angular,directiveModule,utils,classLoader,sidebarItems,appConfig,layoutService,templates) {
	'use strict';
	pd.on("focusChanged",function(focusInfo){
		var ele=$(focusInfo.current);
		if(ele.closest("ul").parent("[ui-tab]").length>0){
			focusInfo.frameScope.titlebar={canSetting:false,canDelete:false,canDrag:false};
		}
	});
	var directiveName="uiTab";
	var extendAttrs={
			name:directiveName,
			directiveDef:null,
			getSidebarItems:function(){
				return {
					parentName:null,
					name:directiveName,
					moduleName:directiveName,
					paletteItemHtml:'ui-tab'+
					'<span class="i-titlebar-move label"><i class="icon-move"></i>拖动</span>',
					compileHtml:"<div ui-tab></div>",//required attribute for dynamic compile
					sourcePreprocess:function(element){
						$(element).removeClass("tabbable tabs-below");
						$(element).children("ul").removeClass("nav nav-tabs");
						$(element).find(".tab-pane-placeholder").remove();
					},
					editorName:"uiTabEditor",
					postLinkCallback:function(scope, iElement, iAttrs,controller){
						if(scope.isBottomTab){
							iElement.addClass("tabbable tabs-below");
							iElement.children("ul").addClass("nav nav-tabs");
						}else{
							iElement.addClass("tabbable");
							iElement.children("ul").addClass("nav nav-tabs");
						}
					}
				};
			},
			getItemName:function(iElement){//iElement: bin postlink element
				return directiveName;
			},
			getCompiledHtml:function($compile,$scope,$ui,sidebarItem){
				return $compile(sidebarItem.compileHtml)($scope);
			},
			paletteItemPostProcess:function($el){
				
			}
	};
	var directive=directiveModule.directive(directiveName,["$compile","appConfig","templates","binManager", function factory($compile,appConfig,templates,binManager) {
		var directiveDefinition = {
		name:directiveName,
	    priority: 0,
	    scope:true,
	    restrict: 'A',
	    controller:["$scope", "$element", "$attrs",function($scope, $element, $attrs) {
	    	$scope.isBottomTab=$element.hasClass("tabs-bottom");
	    }],
	    compile:function compile(tElement, tAttrs) {
	    	return {
	    		pre:function(scope, iElement, iAttrs,controller){
	    			layoutService.registerLayoutBin(directiveName,scope, iElement);
	    		},
	    		post:function(scope, iElement, iAttrs,controller){
	    			if($.isFunction(scope.item.postLinkCallback)){
	    				scope.item.postLinkCallback(scope, iElement, iAttrs,controller);
	    			};
	    			var tabUl=iElement.children("ul");
	    			var tabsMap={};
	    			scope.addNewTab=function(tabElement,contendDivId,navLi,isUseUrl,useHref){
	    				var a=$(navLi).children("a");
	    				var aTab=a.data("cid",contendDivId);
						var contentDiv=$(templates.tabContent(contendDivId,isUseUrl));
						contentDiv.find("input").blur(function(){
    						var href=$(this).val();
    						if(!!href){
    							a.attr("href",href);
    							if(!useHref){
    								a.attr("th:href","${themes.resolveAppPath('"+href+"')}");
    							}
    						}
    					});
						tabUl.append(navLi);
						if(scope.isBottomTab){
							$(tabElement).prepend(contentDiv);
						}else{
							$(tabElement).append(contentDiv);
						}
						var tab={a:aTab,contentDiv:contentDiv};
						tabsMap[contendDivId]=tab;
	    			};
	    			if(tabUl.length===0){
	    				/*tabUl=$("<ul class='nav nav-tabs'>"+
	    						'<li class="active">'+
					'<a href="#__tab1">tab1</a><span></span>'+
								'</li>'+
	    						+"</ul>");
	    				iElement.addClass("tabbable");
	    				if(scope.isBottomTab){
	    					iElement.addClass("tabs-below");
	    					iElement.append(tabUl);
	    				}else{
	    					iElement.prepend(tabUl);
	    				}*/
	    				return;
	    			}
	    			
	    			tabUl.find("li>a").each(function(){
	    				var a=$(this);
	    				var href=a.attr("th:href"),useRef=false;
	    				if(!href){
	    					href=a.attr("href");
	    					useRef=true;
	    				}
	    				var contentDiv=null,contendDivId=href,tab=null;
	    				if(_.str.startsWith(href,"'#")||_.str.startsWith(href,'"#')){
	    					contendDivId=_.str.splice(href,1,1);
	    					iElement.children().each(function(){
	    						var thId=$(this).attr("th:id");
	    						if(contendDivId==thId){
	    							contentDiv=$(this);
	    							return false;
	    						}
	    					});
	    					a.data("cid",contendDivId);
	    					tab= {a:a,contentDiv:contentDiv};
		    				tabsMap[contendDivId]=tab;
	    				}else if(_.str.startsWith(href,"#")&&iElement.find(href).length>0){
	    					contendDivId=_.str.splice(href,0,1);
	    					contentDiv=iElement.find("#"+contendDivId);
	    					a.data("cid",contendDivId);
	    					tab= {a:a,contentDiv:contentDiv};
		    				tabsMap[contendDivId]=tab;
	    				}else{
	    					contendDivId=utils.newGuid();
	    					scope.addNewTab(iElement,contendDivId,a.closest("li"),true,useRef);
	    				}
	    			});
	    			scope.tabsMap=tabsMap;
	    			tabUl.on("click","li>a",function(e){
	    				e.preventDefault();
	    				var a=$(this);
	    				if(a.closest(".i-wrapper").length>0){
	    					return;
	    				}
    					$.each(tabsMap,function(i,tab){
    						tab.contentDiv.hide();
    						tab.a.parent("li").removeClass("active");
    					});
    					var $contentDiv=tabsMap[a.data("cid")]&&tabsMap[a.data("cid")].contentDiv;
    					if(!$contentDiv){
    						return;
    					}
    					$contentDiv.show();
    					var href=a.attr("href");
    					$contentDiv.find("[name=href]").val(href);
    					a.parent("li").addClass("active");
	    			});
	    			tabUl.find("li>a:first").trigger("click");
	    		}
	    	};
	    }
	  };
	  extendAttrs.directiveDef=directiveDefinition;
	  return directiveDefinition;
	}]);
	classLoader.register(directiveName,extendAttrs);
	//return all the attributes 
	return extendAttrs;
});