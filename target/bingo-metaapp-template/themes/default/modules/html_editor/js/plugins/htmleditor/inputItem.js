;'use strict';

define(["common/utils","plugins/htmleditor/singleItem"],function(utils,SingleItem){
	var Button= SingleItem.extend({
		uiName: 'button',
	    init:function(editor){
	      	this._super(editor);
	    },	    
	    queryCommandState: function () {
	    	var me=this;
	    	var $el=me.getFocusEl();
	    	if($el==null) return -1;
	    	var state=0;
	    	return state;
	    }
	});	
	return Button;
});