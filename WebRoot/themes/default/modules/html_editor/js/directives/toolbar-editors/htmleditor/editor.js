;'use strict';

define(["common/eventBase","services/appPd"],function(EventBase,pd){
	var Editor= EventBase.extend({
		items:null,
		options:null,
		focusEl:null,
		isEnabled:true,
		init:function(opts){
			this._super();
			this.setOpt(opts);
		},
		setOpt:function(key,val){
			 var obj = {};
	         if (_.isString(key)) {
	        	 obj[key] = val;
	         } else {
	        	 obj = key;
	         }
	         if(this.options==null){
	        	 this.options={};
	         }
	         $.extend(this.options,obj);
		},
		register:function(cmdClass){
			var me=this;
			var instance=new cmdClass(me);
			this.getAllItem()[instance.cmdName.toLowerCase()]=instance;
			return instance;
		},
		addItem:function(cmdName,item){
			this.getAllItem()[cmdName.toLowerCase()]=item;
		},
		getItem:function(cmdName){
			return this.getAllItem()[cmdName.toLowerCase()];
		},
		getAllItem:function(){
			if(this.items==null){
				this.items={};
			}
			return this.items;
		},
		
		/**
		 * 
		 * @param focusEl 当前选中的Html元素
		 */
		selectionChange: function (focusEl) {
			var me=this;
			/*
			me.focusEl=null;
			if(focusFrameScope.focus==null){
				//TODO:选区清除
				return ;
			}
			if(focusFrameScope.focus.type!="html"){
				//TODO:其它类型的对象选中
				return ;
			}*/
			me.focusEl=focusEl;
			me.trigger("focusChanged",focusEl,true);
		},
		_callCmdFn: function (fnName, args) {
            var cmdName = args[0].toLowerCase(),
                cmd, cmdFn;
            cmd = this.items[cmdName];
            cmdFn = cmd && cmd[fnName];
            if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
                return 0;
            } else if (cmdFn) {
                return cmdFn.apply(cmd, _.without(args,args[0]));
            }
        },
        /**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @name execCommand
         * @grammar editor.execCommand(cmdName)   => {*}
         */
        execCommand: function (cmdName) {
            cmdName = cmdName.toLowerCase();
            var me = this,
                result,
                cmd = me.items[cmdName] ;//UE.commands[cmdName]
            if (!cmd || !cmd.execCommand) {
                return null;
            }
            if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {
                me.__hasEnterExecCommand = true;
                if (me.queryCommandState.apply(me,arguments) != -1) {
                    me.trigger('beforeexeccommand', cmdName);
                    result = this._callCmdFn('execCommand', arguments);
                    !me._ignoreContentChange && me.trigger('contentchange');
                    me.trigger('afterexeccommand', cmdName);
                }
                me.__hasEnterExecCommand = false;
            } else {
                result = this._callCmdFn('execCommand', arguments);
                !me._ignoreContentChange && me.trigger('contentchange');
            }
            !me._ignoreContentChange && me._selectionChange();
            return result;
        },
        
        /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @name  queryCommandState
         * @grammar editor.queryCommandState(cmdName)  => (-1|0|1)
         * @desc
         * * ''-1'' 当前命令不可用
         * * ''0'' 当前命令可用
         * * ''1'' 当前命令已经执行过了
         */
        queryCommandState: function (cmdName) {
            return this._callCmdFn('queryCommandState', arguments);
        },
        
        /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @name  queryCommandValue
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         */
        queryCommandValue: function (cmdName) {
            return this._callCmdFn('queryCommandValue', arguments);
        },
	});	
		
	var instance=new Editor();
	
	return instance;
});