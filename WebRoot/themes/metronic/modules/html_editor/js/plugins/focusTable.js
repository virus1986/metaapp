/**
 * Table选区额外处理
 * 
 */
define(["services/appPd","common/domUtils"],function(pd,domUtils){
	pd.on("focusChanged",function(focusInfo){
		if(canHandle(focusInfo.pre)){
			disSelected(focusInfo.frameScope,focusInfo.frame,focusInfo.pre);
		}
		if(canHandle(focusInfo.current)){
			addToolBar(focusInfo.frameScope,focusInfo.frame);
			selected(focusInfo.frameScope,focusInfo.frame,focusInfo.current);
		}
	});
	pd.on("focusRefreshed",function(focusInfo){
		if(canHandle(focusInfo.current)){
			selected(focusInfo.frameScope,focusInfo.frame,focusInfo.current);
		}
	});
	
	function addToolBar($scope,iElement){
		var html="<div class='i-table-titlebar' style='display:none'>"
			+"<div class='i-resize-column active'>"
			+"	<div class='i-resize-handle'></div>"
			+"	<div class='i-table-resize-display'></div>"
			+"</div>"
			+"<div class='i-table-titlerow' >"
			+"	<div class='i-table-move' title='Move Row'></div>"
			+"	<div class='i-table-delete' title='Delete Row'></div>"
			+"	<div class='i-table-rowghost' title='rowghost'></div>"
			+"</div>"
			+"<div class='i-table-titlecol'>"
			+"	<div class='i-table-move' title='Move Column'></div>"
			+"	<div class='i-table-delete' title='Delete Column'></div>"
			+"	<div class='i-table-colghost' title='rowghost'></div>"
			+"</div>"
			+"</div>";
		iElement.append(html);
	}
	
	function selected($scope,iElement,focus){
		var $table=$(focus.el);
		var rowSize=$("tr",$table).length;
		var colSize=$("tr:eq(0)",$table).children().length;
		var $curTd=null,isDragging=false,placeHolder=null;
		$("td,th",$table).off("mouseover").off("mouseout").mouseover(function () {
				if(isDragging || (rowSize <=1 && colSize<=1 )) return;
				
				var $td=$(this);
				$curTd=$td;	
				$(".i-titlebar",iElement).hide();
				$(".i-table-titlebar",iElement).show();	
				if($td.index()<colSize-1){
					$(".i-resize-column",iElement).css({
						left:$td.offset().left-$scope.style.left+$td.outerWidth()-1,
						top:0,
						height:$table.outerHeight(),
						display:"block"
					});
				}else{
					$(".i-resize-column",iElement).hide();
				}
				if(rowSize>1){
					$(".i-table-titlerow",iElement).css({
						top:$td.offset().top-$scope.style.top+12						
					});
					$(".i-table-titlerow .i-table-delete",iElement).css({
						left:$table.width()
					});
				}else{
					$(".i-table-titlerow",iElement).hide();
				}
				if(colSize>1){
					$(".i-table-titlecol",iElement).css({
						left:$td.offset().left-$scope.style.left+$td.width()/2
					});
				}else{
					$(".i-table-titlecol",iElement).hide();
				}
			}).mouseout(function () {
				if(isDragging) return;
				$(".i-titlebar",iElement).show();
		});
		
		//删除行
		$(".i-table-titlerow .i-table-delete",iElement).off("click").click(function(){
			$curTd.parent().remove();
			$scope.$apply(function(){
				$scope.refresh();
				$(".i-table-titlebar",iElement).hide();
			});
		});
		
		//拖动行
		$(".i-table-titlerow",iElement).draggable({
			axis:"y",
			handle:".i-table-move",
			containment:$table,
			start: function(event,ui){
				isDragging=true;
				var rowghost=$(".i-table-titlerow .i-table-rowghost",iElement);
				rowghost.css({
					width:$table.width()
				});
				rowghost.show();
				
				var placeHolder=$curTd.parent();
				placeHolder.addClass("i-table-active");
			},
			drag:function(event,ui){
				var prePl=placeHolder;
				$("tr",$table).each(function(){
					var $tr=$(this);
					var trOffset=$tr.offset();
					var trHeight=$tr.height();
					if(event.pageY>trOffset.top-trHeight/2 && event.pageY<trOffset.top+trHeight/2){
						placeHolder=$tr;
						return false;
					}
				});
				if(prePl==placeHolder){
					return;
				}
				if(prePl!=null){
					prePl.removeClass("i-table-active");
				}
				placeHolder.addClass("i-table-active");
			},
			stop:function(event,ui){
				isDragging=false;
				var rowghost=$(".i-table-titlerow .i-table-rowghost",iElement);
				rowghost.css({width:"0px"});
				rowghost.hide();
				placeHolder.removeClass("i-table-active");
			
				var $dragTr=$curTd.parent();				
				if(placeHolder==$dragTr){
					return;
				}
				placeHolder.after($dragTr);
			},
		});
			
			//删除列
		$(".i-table-titlecol .i-table-delete",iElement).off("click").click(function(){
			if($curTd==null) return;
			
			var tdIndex=domUtils.getTdIndex($curTd);
			$("tr",$table).each(function(){
				var $tr=$(this);
				domUtils.removeTd($tr,tdIndex);
			});			
			$scope.$apply(function(){
				$scope.refresh();
			});
		});
		//拖动列
		$(".i-table-titlecol",iElement).draggable({
			axis:"x",
			handle:".i-table-move",
			containment:$table,
			start: function(event,ui){
				isDragging=true;
				var colghost=$(".i-table-titlecol .i-table-colghost",iElement);
				colghost.css({
					height:$table.height()
				});
				colghost.show();
				
				var placeHolder=$curTd;
					placeHolder.addClass("i-table-active");
				$(".i-titlebar",iElement).hide();
			},
			drag:function(event,ui){
				var prePl=placeHolder;					
				$("tr:eq(0)",$table).children().each(function(i,item){
					var $td=$(item);
					var tdOffset=$td.offset();
					var tdWidth=$td.width();
					if(event.pageX>tdOffset.left-5 && event.pageX<tdOffset.left+tdWidth){
						placeHolder=$td;
						return false;
					}
						
				});
				if(prePl==placeHolder){
					return;
				}
				if(prePl!=null){
					prePl.removeClass("i-table-active");
				}
				placeHolder.addClass("i-table-active");
			},
			stop:function(event,ui){
			isDragging=false;
				$(".i-titlebar",iElement).show();
					var colghost=$(".i-table-titlecol .i-table-colghost",iElement);
				colghost.css({height:"0px"});
				colghost.hide();
				placeHolder.removeClass("i-table-active");
				
				if(placeHolder==$curTd){
					return;
				}
				var plTdIndex=placeHolder.index();
				var selectTdIndex=$curTd.index();
				$("tr",$table).each(function(){
					var plTd=$(this).children()[plTdIndex];
					var selectTd=$(this).children()[selectTdIndex];
					$(plTd).after(selectTd);
				});
			},
		});
			
		$(".i-resize-column",iElement).draggable({
			axis:"x",
			handle:".i-resize-handle",
			containment:$table,
			start: function(event,ui){
				isDragging=true;
			},
			stop:function(event,ui){
				isDragging=false;
				var selectTdIndex=$curTd.index();
				var tdInFirstTr=$($("tr:eq(0)",$table).children()[selectTdIndex]);
				var xDistance=ui.position.left-ui.originalPosition.left;
				tdInFirstTr.css({width:tdInFirstTr.width()+xDistance});
			}
		});
	}
	
	function disSelected($scope,iElement,oldFocus){
		var $table=$(oldFocus.el);
		$("td,th",$table).off("mouseover").off("mouseout");
		$(".i-table-titlebar",iElement).remove();
	}
	

	function canHandle(focus){
		if(focus==null || focus.el==null) return false;
		var type=focus.type;
		if(focus.type!="bin"  && focus.type!="container"){
			type=$(focus.el).prop("tagName").toLowerCase();
		}
		if(type=="table"){
			return true;
		}
		return false;
	}
	
});
