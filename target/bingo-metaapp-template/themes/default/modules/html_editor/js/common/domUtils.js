/**
 * 文档操作工具类
 */
define(["cellPos"],function(){	
	var module={};
	var $mainContainer=$("#edit-page-designer");
	var binWrapperClass="i-wrapper";
	var containerWrapperClass="i-layout-info";
	var containerClass="i-column";
	
	/**
	 * 判断position是否在编辑区
	 */
	var isInMainContainer=function(position){
		var l = $mainContainer.offset().left,
			t = $mainContainer.offset().top,
			r = l + $mainContainer[0].scrollWidth,
			b = t + $mainContainer[0].scrollHeight;
		if(position.x>l && position.x<r
				&& position.y>t && position.y<b){
			return true;
		}
	};
	
	/**
	 * 判断当前el是否需要被选中
	 */
	module.isNotNeedFocus=function(el){
		var notNeed=false;
		if(module.isMainContainer(el)){
			notNeed=true;
		}
		if(el.closest(".tab-pane-placeholder").length>0){
			notNeed=true;
		}
		return notNeed;
	};
	/**
	 * 判断当前el是否为主编辑区
	 */
	var isMainContainer=module.isMainContainer=function(el){
		return $(el).attr("id")==$mainContainer.attr("id");
	};
	
	/**
	 * 获取el所在的Bin容器，如果el不在Bin中，则返回空
	 */
	var getBinWrapper=module.getBinWrapper=function(el){
		var binWrapper=$(el).closest("."+binWrapperClass);
		if(binWrapper.length==0){
			return null;
		}
		return binWrapper;
	};
	
	/**
	 * 判断当前el是否为bin的包装器
	 */
	var isBinWrapper=module.isBinWrapper=function(el){
		return $(el).hasClass(binWrapperClass);
	};
	
	/**
	 * 判断当前el是否为容器类外层包括器
	 */
	var containerWrapperTag=["table","tr","ul","ol","tbody"];
	var isContainerWrapper=module.isContainerWrapper=function(el){
		var $el=$(el);
		if($el.hasClass(containerWrapperClass)
				|| el.hasClass(binWrapperClass)){
			return true;
		}
		var tagName=$el.prop("tagName").toLowerCase();
		if(_.contains(containerWrapperTag,tagName)){
			return true;
		}
		return false;
	};
	
	/**
	 * 判断当前el是否为容器内条目
	 */
	var containerItemTag=["td","th","li","caption"];
	var isContainerItem=module.isContainerItem=function(el){
		var $el=$(el);
		if($el.hasClass(containerClass)){
			return true;
		}
		var tagName=$el.prop("tagName").toLowerCase();
		if(_.contains(containerItemTag,tagName)){
			return true;
		}
		return false;
	};
	
	/**
	 * 判断当前元素是否被拖动
	 */
	var unDraggableTag=["td","th","caption"];
	var canDraggable=module.canDraggable=function(el){
		var $el=$(el);
		if($el.hasClass("unDraggable")){
			return false;
		}
		var tagName=$el.prop("tagName").toLowerCase();
		if(_.contains(unDraggableTag,tagName)){
			return false;
		}
		return true;
	};
	
	/**
	 * 判断当前元素是否被拖动
	 */
	var unDeleteTag=["td","th","caption"];
	var canDelete=module.canDelete=function(el){
		var $el=$(el);		
		var tagName=$el.prop("tagName").toLowerCase();
		if(_.contains(unDeleteTag,tagName)){
			return false;
		}
		return true;
	};
	
	/**
	 * 获取td在tr中索引，考虑colspan的情况
	 */
	var getTdIndex=module.getTdIndex=function($td){
		return $td.cellPos().left;
	};
	
	/**
	 * 获取指定索引的td
	 */
	var getTd=module.getTd=function($tr,tdIndex){
		var selectedTd=null;
		$("td,th",$tr).each(function(){
			var $td=$(this);
			var left=$td.cellPos().left;
			var colspan=$td.attr("colspan")?parseInt($td.attr("colspan")):1;
			if(left<=tdIndex && left+colspan-1>=tdIndex){
				selectedTd=$td;
				return false;
			}
		});
		if(selectedTd==null){
			return null;
		}
		return {
			td:selectedTd,
			cellPos:$(selectedTd).cellPos(),
			colspan:$(selectedTd).attr("colspan")?parseInt($(selectedTd).attr("colspan")):1,
			rowspan:$(selectedTd).attr("rowspan")?parseInt($(selectedTd).attr("rowspan")):1,
		};
	};
	
	/**
	 * 删除指定序号下的td;
	 */
	var removeTd=module.removeTd=function($tr,tdIndex){
		var selectedTd=getTd($tr,tdIndex);
		if(selectedTd==null){
			return ;
		}		
		if(selectedTd.colspan>1){
			$(selectedTd.td).attr("colspan",selectedTd.colspan-1);
		}else{
			$(selectedTd.td).remove();
		}
	};
	
	var insertTd=module.insertTd=function($tr,tdIndex,$td){
		var selectedTd=getTd($tr,tdIndex);		
		if(selectedTd==null){
			return null;
		}
		if(tdIndex>=selectedTd.cellPos.left+selectedTd.colspan-1){
			$(selectedTd.td).after($td);
		}else{
			$(selectedTd.td).attr("colspan",selectedTd.colspan+1);
		}
	};
	
	/**
	 * 
	 */
	module.focusFinder=(function(){
		var finder={tagFinder:{},cssFinder:{}};
		
		finder.tagFinder["li"]=function(event,$el){
			return $el.closest("ul");
		};
		
		finder.tagFinder["td"]=function(event,$el){
			var l=$el.offset().left,
			t=$el.offset().top,
			r=l+event.target.offsetWidth,
			b=t+event.target.offsetHeight;
			if(event.pageY>t+5 && event.pageY<b-5 
					&& event.pageX>l+5 && event.pageX<r-5 ){
				
			}else{
				return $el.closest("table");
			}
		};
		
		function find(event,$el){
			var newEl=getBinWrapper($el);
			if(newEl!=null){
				return newEl;
			}
			
			var tag=$el.prop("tagName").toLowerCase();
			if($.isFunction(finder.tagFinder[tag])){
				newEl=finder.tagFinder[tag](event,$el);
			}
			if(newEl!=null){
				return newEl;
			}
			
			var cssClass=$el.attr("class") || "";
			$.each(cssClass.split("\s+"),function(i,item){
				var cssName=item.toLowerCase();
				if($.isFunction(finder.cssFinder[cssName])){
					newEl=finder.cssFinder[cssName](event,$el);
				}
				if(newEl!=null){
					return false;
				}
			});
			if(newEl==null){
				newEl=$el;
			}
			return newEl;
		};
		return {find:find} ;
	})();
	
	module.draggable=function(el,options){
		var placeHolder={};
    	var preDropEl={}; 
    	var exOptions=$.extend({},options,{
    		zIndex:10000,
    		handle:".i-titlebar-move",
    		opacity: 0.35,
    		appendTo:"div#myHelperHolder",
    		revert:true,
    		cursorAt:{top:-10,left:120},
    		helper:function(){
    			var html="<div class='editFocus'>"
						 +" <div class='editFocusStdChrome'>"
						 +"		<div class='editFocusFrame editFocusFrameLEFT'  style='height: 28px; left: -6px; top: -6px; '></div>"
						 +"		<div class='editFocusFrame editFocusFrameRIGHT' style='height: 28px; left: 242px; top: -6px; '></div>"
						 +"		<div class='editFocusFrame editFocusFrameTOP'  style='width: 250px; left: -6px; top: -6px; '></div>"
						 +"		<div class='editFocusFrame editFocusFrameBOTTOM' style='width: 250px;left: -6px; top: 22px; '></div>"
						 +"	</div>"
						 +"	<div class='i-titlebar i-titlebar-active active' style='left: 120px;'>"
						 +"		<div class='i-titlebar-wrap'>"
						 +"		<div class='i-titlebar-padding'></div>"
						 +"			<a class='i-titlebar-move i-titlebar-button ' data-tooltip='Drag to Move'><span class='icon'></span></a>"
						 +"			<div class='i-titlebar-tooltip'>"
						 +"				<span class='icon'></span>Drag above, below or to the sides of any	module."
						 +"			</div>"
						 +"		</div>"
						 +"	</div>"
						 +"</div>";
    			return html;
    		},
    		start: function(event,ui){
    			createPlaceHolder();
    			if($.isFunction(options.start)){
    				options.start(event,ui,placeHolder);
    			}
	      	},
	      	drag: function(event,ui) {
	      		movePlaceHolder(event,ui,options);
	      		if($.isFunction(options.drag)){
    				options.drag(event,ui,placeHolder);
    			}
	      		
	      		$(this).draggable("option", "revert", !placeHolder.visible);
	      	},
	      	stop: function(event,ui) {
	      		ui.item=$(this);
	      		if(placeHolder.visible && $.isFunction(options.accept)){
	      			options.accept(event,ui,placeHolder);
	      		}
	      		if($.isFunction(options.stop)){
    				options.stop(event,ui,placeHolder);
    			}
	      		destroyPlaceHolder();
	      	}
    	});
    	
    	$(el).draggable(exOptions);   	
    	
    	function createPlaceHolder(){
    		var pl=$('<div id="i-bin-overlay" class="i-bin-overlay-horizontal i-bin-overlay-arrow " style="display: none; position: relative; left: auto; right: auto; float: none; margin: -1px 0px -1px -1px; top: 0px;">'
    							+'<div class="i-bin-overlay-nub1"></div>'
    							+'<div class="i-bin-overlay-nub2"></div>'
    							+'<div class="i-bin-overlay-arrow"></div>'
    							+'</div>');
    		placeHolder={pl:pl,curDropEl:null,visible:false};
    	};
    	
    	function destroyPlaceHolder(){
    		placeHolder.pl.remove();
    		placeHolder=null;
    	}
    	module.defaultRefuse=function(event,ui,placeholder,newAddItemDom){
    		var embeds={li:"ul",th:"tr",td:"tr"};
    		var curDropEl=placeholder.curDropEl;
    		var direction=placeholder.direction;
    		var parentTag;
    		if(direction=="in"){
    			parentTag=curDropEl.prop("tagName").toLowerCase();
    		}else{
    			parentTag=curDropEl.parent().prop("tagName").toLowerCase();
    		}
    		var childName=newAddItemDom.prop("tagName").toLowerCase();
    		if(embeds[childName]&&embeds[childName]!=parentTag){
    			return true;
    		}
    		return false;
    	} ;	
    	function movePlaceHolder(event,ui,options){
    		var position={
    				x:event.pageX-40,
    				y:event.pageY+20,
    		};
    		if(!isInMainContainer(position)){
    			placeHolder.pl.hide();
    			placeHolder.visible=false;
    			return;
    		}
    		var curDropEl = $(document.elementFromPoint(position.x-window.pageXOffset,position.y-window.pageYOffset));
    		if(curDropEl.closest("#i-bin-overlay").length>0 || curDropEl.length==0){
    			//偶尔会定位到placeholder自己
    			return;
    		}
    		
    		var wrapper=((preDropEl.el==curDropEl)?preDropEl.Wrapper:getBinWrapper(curDropEl)) || curDropEl ;
    		var dType=(preDropEl.el==curDropEl)?preDropEl.dType:getDirectionType(wrapper);	
    		var direction=intersect(wrapper,position,dType);    		
    		if(preDropEl.el==curDropEl && preDropEl.direction==direction){
    			return;
    		}
    		if($.isFunction(options.refuse)){//如果该元素位置不允许插入占位符，直接拒绝
    			if(options.refuse(event,ui,curDropEl,direction)){
    				return;
    			}
    		}
    		placeHolder.pl.show();
    		placeHolder.visible=true;
    		placeHolder.curDropEl=curDropEl;
    		placeHolder.direction=direction;
    		
    		if(direction=="top"){
        		wrapper.before(placeHolder.pl);
        	}else if(direction=="bottom"){
        		wrapper.after(placeHolder.pl);
        	}else{
        		wrapper.append(placeHolder.pl);
        	}
    		
    		preDropEl.el=curDropEl;
    		preDropEl.direction=direction;
    		preDropEl.dType=dType;
    		preDropEl.Wrapper=wrapper;
    	}
    	
    	//确定placeholder与待drop目标的关系，
    	//up:在drop目标元素前显示占位符,in：在drop目标元素内显示占位符，down：在drop目标元素下显示占位符
    	function intersect(dEl,position,dType){
    		var val="in",
    			t = dEl.offset().top,
    			b = t + dEl[0].offsetHeight;
    		if(dType=="inner"){
    			val="in";
    		}else if(dType=="outer"){
    			if(position.y<(t+b)/2){
    				val="top";
    			}else{
    				val="bottom";
    			}
    		}else{
    			if(position.y<t+15){
        			val="top";
        		}else if(position.y>b-15){
        			val="bottom";
        		}else{
        			val="in";
        		}        		
    		}    		
    		return val;
    	};
    	
    	//获取元素支持的占位符类型
    	//all:支持所有占位符，outer只允许外部放置占位符（top/bottom） ，inner只允许内部放置占位符（in）
    	function getDirectionType(dEl){
    		var type="all";
			if(isContainerWrapper(dEl)){
				type="outer";
			}else if(isContainerItem(dEl)){
				type="inner";
			}else{
				type="all";
			}
			return type;
    	};
    };
	
    
	return module;
});
