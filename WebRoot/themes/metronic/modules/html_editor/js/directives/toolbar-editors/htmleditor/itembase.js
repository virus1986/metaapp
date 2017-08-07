;'use strict';

define(["services/appPd","common/utils","directives/toolbar-editors/htmleditor/stateful"],function(pd,utils,Stateful){
	var Button= Stateful.extend({
		id:utils.newGuid(),
		editor:null,
		cmdName:null,
		styleName:"",
	    styleValue:null,
		label: '',
        showIcon: true,
        showText: true,
        itemDom:null,
		init:function(editor){
			this._super();
			this.editor=editor;
			this.onFocusChanged();
		},
		setValue:function(val){
	    	this.styleValue=val;
	    },
		onClick:function (){
	        this.execCommand();
	        this.editor.trigger("focusChanged",this.editor.focusEl,true);	
	        if(pd){
	        	pd.refreshFocus();
	        }
	    },
	    onFocusChanged:function(){
        	var me=this;
        	me.editor.on("focusChanged",function(causeByUi, uiReady){
        		var state = me.queryCommandState();
                me.setState(state);
        	});
       },
		/**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @name execCommand
         */
        execCommand: function(val) {
        	var me=this;
        	var $el=me.getFocusEl();
        	if($el==null) return null;
        	if(this.queryCommandState()==1){
        		$el.css(me.cmdName,"");
        	}else{
        		$el.css(me.cmdName,val);
        	}
        },
        
        /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @name  queryCommandState
         * @desc
         * * ''-1'' 当前命令不可用
         * * ''0'' 当前命令可用
         * * ''1'' 当前命令已经执行过了
         */
        queryCommandState: function () {
        	var me=this;
        	var $el=me.getFocusEl();
        	if($el==null) return -1;
        	var state=($el.css(me.cmdName)==null?0:1);
        	return state;
        },
        
        /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @name  queryCommandValue
         */
        queryCommandValue: function (cmdName) {
        	var me=this;
        	var $el=me.getFocusEl();
        	if($el==null) return null;
        	if(!cmdName){
        		cmdName=me.cmdName;
        	}
        	return $el.css(cmdName);
        },
        /**
         * 获取当前页面选中的元素
         * @returns
         */
        getFocusEl:function(){
        	var el= this.editor.focusEl;
        	if(el!=null){
        		return $(el);
        	}
        	return null;
        },        
        /** 获取工具栏菜单的dom元素
         * @param name
         * @returns
         */
        getDom:function () {
            return this.itemDom;
        }
	});	
	return Button;
});