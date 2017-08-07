;'use strict';

define(["services/appPd","common/utils","common/domUtils","directives/toolbar-editors/htmleditor/itembase","directives/toolbar-editors/htmleditor/editor"],function(pd,utils,domUtils,ItemBase,editor){
	
	function getTdAttrForInt($el,attrName,defaultValue){
		var attrValue=$el.attr(attrName)?parseInt($el.attr(attrName)):defaultValue;
		return attrValue;
	}
	//添加列操作
	editor.register(ItemBase.extend({
		label:"添加列",
		cmdName:"addColumn",
		uiName: 'column-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		this.addColumnAfterTd($el);
	    		$el.cellPos(true);
	    	}else{
	    		this.addColumnAfterTable($el);
	    	}
	    },
	    addColumnAfterTd:function($td){
	    	var cloneTd=$td.clone().empty();
	    	var tdIndex=domUtils.getTdIndex($td);
	    	$("tr",$td.closest("table")).each(function(){
	    		var $tr=$(this);
	    		domUtils.insertTd($tr,tdIndex,cloneTd.clone());
	    	});
	    },
	    addColumnAfterTable:function($table){
	    	$("tr",$table).append("<td></td>");
	    },
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="table" || tagName=="td" || tagName=="th") return 0;
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    }
	}));
	
	//添加行操作
	editor.register(ItemBase.extend({
		label:"向下添加行",
		cmdName:"addRow",
		uiName: 'row-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		this.addRowAfterTd($el);
	    		$el.cellPos(true);
	    	}else{
	    		this.addRowAfterTable($el);
	    	}
	    },
	    addRowAfterTd:function($td){
	    	var cloneTr=$td.parent().clone();
	    	$("td,th",cloneTr).empty();
	    	$td.parent().after(cloneTr);
	    },
	    addRowAfterTable:function($table){
	    	var lastTr=$("tr:last-child",$table);
	    	var cloneTr=lastTr.clone();
	    	$("td,th",cloneTr).empty();
	    	lastTr.after(cloneTr);
	    },
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="table" || tagName=="td" || tagName=="th") return 0;
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    }
	}));
	editor.register(ItemBase.extend({
		label:"向上添加行",
		cmdName:"addRowUp",
		uiName: 'row-button-up',	    
		execCommand: function() {
			var me=this;
			var $el=me.getFocusEl();
			var tagName=$el.prop("tagName").toLowerCase();
			if(tagName=="td" || tagName=="th"){
				this.addRowBeforeTd($el);
				$el.cellPos(true);
			}else{
				this.addRowBeforeTable($el);
			}
		},
		addRowBeforeTd:function($td){
			var cloneTr=$td.parent().clone();
			$("td,th",cloneTr).empty();
			$td.parent().before(cloneTr);
		},
		addRowBeforeTable:function($table){
			var firstTr=$("tr:first-child",$table);
			var cloneTr=firstTr.clone();
			$("td,th",cloneTr).empty();
			firstTr.before(cloneTr);
		},
		queryCommandState: function () {
			var me=this;
			var $el=me.getFocusEl();
			if($el==null) return -1;
			var tagName=$el.prop("tagName").toLowerCase();
			if(tagName=="table" || tagName=="td" || tagName=="th") return 0;
			return -1;
		},	        
		queryCommandValue: function () {
			return "";
		}
	}));
	//向左合并列
	editor.register(ItemBase.extend({
		label:"向左合并列",
		cmdName:"mergeLeft",
		uiName: 'merge-left-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var colspan=getTdAttrForInt($el,"colspan",1);
	    	var prevTd=this.getPrevTd($el);
	    	if(prevTd==null) return ;
	    	$el.attr("colspan",colspan+prevTd.colspan);	    
	    	prevTd.td.remove();
	    },	
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		var prevTd=this.getPrevTd($el);
	    		if(prevTd==null){
	    			return -1;
	    		}
	    		return 0;
	    	}	    	
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    },
	    getPrevTd:function($td){
	    	var rowspan=getTdAttrForInt($td,"rowspan",1);
	    	var colspan=getTdAttrForInt($td,"colspan",1);

    		var prevTd=domUtils.getTd($td.parent(),$td.cellPos(true).left-1);    		
    		if(prevTd==null){
    			return null;
    		}    		
    		if(prevTd.rowspan!=rowspan || prevTd.cellPos.top!=$td.cellPos().top){
    			return null;
    		}
    		return prevTd;
	    }
	}));
	//向右合并列
	editor.register(ItemBase.extend({
		label:"向右合并列",
		cmdName:"mergeRight",
		uiName: 'merge-right-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var colspan=getTdAttrForInt($el,"colspan",1);
	    	var nextTd=this.getNextTd($el);
	    	if(nextTd==null) return ;
	    	$el.attr("colspan",colspan+nextTd.colspan);	    
	    	nextTd.td.remove();
	    },	
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		var nextTd=this.getNextTd($el);
	    		if(nextTd==null){
	    			return -1;
	    		}
	    		return 0;
	    	}	    	
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    },
	    getNextTd:function($td){
	    	var rowspan=getTdAttrForInt($td,"rowspan",1);
	    	var colspan=getTdAttrForInt($td,"colspan",1);

    		var nextTd=domUtils.getTd($td.parent(),$td.cellPos(true).left+colspan);    		
    		if(nextTd==null){
    			return null;
    		}    		
    		if(nextTd.rowspan!=rowspan || nextTd.cellPos.top!=$td.cellPos().top){
    			return null;
    		}
    		return nextTd;
	    }
	}));
	
	//向下合并行
	editor.register(ItemBase.extend({
		label:"向下合并行",
		cmdName:"mergeDown",
		uiName: 'merge-down-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var rowspan=getTdAttrForInt($el,"rowspan",1);
	    	var nextTd=this.getNextTd($el);
	    	if(nextTd==null) return ;
	    	$el.attr("rowspan",rowspan+getTdAttrForInt($(nextTd.td),"rowspan",1));	    	
    		$(nextTd.td).remove();
	    },	
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		var nextTd=this.getNextTd($el);
	    		if(nextTd==null){
	    			return -1;
	    		}
	    		return 0;
	    	}	    	
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    },
	    getNextTd:function($td){
	    	var rowspan=getTdAttrForInt($td,"rowspan",1);
	    	var colspan=getTdAttrForInt($td,"colspan",1);
	    	
	    	var nextTr=$td.parent();
    		for(var i=0;i<rowspan;i++){
    			nextTr=nextTr.next();
    		}
    		var nextTd=domUtils.getTd(nextTr,$td.cellPos().left);
    		
    		if(nextTd==null){
    			return null;
    		}
    		if(nextTd.cellPos.left!=$td.cellPos().left || nextTd.colspan!=colspan){
    			return null;
    		}
    		return nextTd;
	    }
	}));
	
	//拆分单元格
	editor.register(ItemBase.extend({
		label:"拆分单元格",
		cmdName:"splitCells",
		uiName: 'split-cells-button',	    
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	var left=$el.cellPos().left;
	    	var rowspan=getTdAttrForInt($el,"rowspan",1);
	    	var colspan=getTdAttrForInt($el,"colspan",1);
	    	$el.removeAttr("rowspan").removeAttr("colspan");
	    	var cloneTd=$el.clone().empty();
	    	var emptyTd=cloneTd.clone();
	    	for(var i=1;i<colspan;i++){
	    		if(cloneTd.is("th")){
	    			$el.after("<td></td>");
	    			emptyTd.after("<td></td>");
	    		}else{
	    			$el.after(cloneTd.clone());
	    			emptyTd.after(cloneTd.clone());
	    		}
	    	}
	    	
	    	var $curTr=$el.parent().next();
	    	for(var row=1;row<rowspan;row++){
	    		var selectedTd=null;
	    		$("td,th",$curTr).each(function(){
	    			var $td=$(this);
	    			if($td.cellPos().left<left && $td.next().length>0 && $td.next().cellPos().left>left){
	    				selectedTd=$td;
	    				return false;
	    			}	    			
	    		});  
	    		if(selectedTd!=null){
	    			selectedTd.after(emptyTd.clone());
	    		}else{
	    			$curTr.prepend(emptyTd.clone());
	    		}
	    		$curTr=$curTr.next();
	    	}    	
	    },	
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var tagName=$el.prop("tagName").toLowerCase();
	    	if(tagName=="td" || tagName=="th"){
	    		var rowspan=getTdAttrForInt($el,"rowspan",1);
	    		var colspan=getTdAttrForInt($el,"colspan",1);
	    		if(rowspan==1 && colspan==1){
	    			return -1;
	    		}
	    		return 0;
	    	}	    	
	    	return -1;
	    },	        
	    queryCommandValue: function () {
	    	return "";
	    }
	}));
	
	
});