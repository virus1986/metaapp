;'use strict';

define(["common/utils","directives/toolbar-editors/htmleditor/itembase"],function(utils,ItemBase){
	var Button= ItemBase.extend({
		uiName: 'dropdown',
	    init:function(editor){
	      	this._super(editor);
	    },		
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return null;
	    	if(this.queryCommandState()==1){
	    		$el.css(me.styleName,"");
	    	}else{
	    		$el.css(me.styleName,me.styleValue || me.cmdName);
	    	}
	    },	    
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var state=($el.css(me.styleName)==(me.styleValue || me.cmdName)?1:0);
	    	return state;
	    },
	        
	    queryCommandValue: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return null;
	    	return $el.css(me.styleName);
	    }
	
	});	
	return Button;
});