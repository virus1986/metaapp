;'use strict';

define(["common/utils","directives/toolbar-editors/htmleditor/itembase"],function(utils,ItemBase){
	var Button= ItemBase.extend({
		uiName: 'button',
	    valueList:null,
	    init:function(editor){
	      	this._super(editor);
	    },	    
	    getValueText:function(){
	    	if(this.styleValue==null) return "";
	    	var values=this.styleValue.split(",");
	    	return values[0];
	    },
	    execCommand: function() {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return null;
	    	$el.css(me.styleName,me.styleValue || me.cmdName);
	    },
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var state=0;
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