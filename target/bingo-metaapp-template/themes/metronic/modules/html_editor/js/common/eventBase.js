/**
 * 事件基类
 * window.pd事件列表:
 * ready
 * focusChanged
 * focusRefreshed
 * domAdded
 * domDeleted
 * 
 */
define(["usStrings"],function(){
	var EventBase=Class.extend({
		allListeners:null,
		init:function(){
			
		},
		
		getListener:function(type) {
			type = type.toLowerCase();
			if(this.allListeners==null){
				this.allListeners={};
			}
		    if(this.allListeners[type]==null){
		    	this.allListeners[type]=[];
		    }
		    return this.allListeners[type];
		},
		
		removeItem:function (array, item) {
	        for (var i = 0, l = array.length; i < l; i++) {
	            if (array[i] === item) {
	                array.splice(i, 1);
	                i--;
	            }
	        }
	    },
		
		/**
	     * 注册事件监听器
	     * @name addListener
	     * @grammar editor.addListener(types,fn)  //types为事件名称，多个可用空格分隔
	     * @example
	     * editor.addListener('selectionchange',function(){
	     *      console.log("选区已经变化！");
	     * })
	     * editor.addListener('beforegetcontent aftergetcontent',function(type){
	     *         if(type == 'beforegetcontent'){
	     *             //do something
	     *         }else{
	     *             //do something
	     *         }
	     *         console.log(this.getContent) // this是注册的事件的编辑器实例
	     * })
	     */
	    on:function (types, listener) {
	        types = _.str.trim(types).split(' ');
	        for (var i = 0, ti; ti = types[i++];) {
	            this.getListener(ti).push(listener);
	        }
	    },
	    /**
	     * 移除事件监听器
	     * @name removeListener
	     * @grammar editor.removeListener(types,fn)  //types为事件名称，多个可用空格分隔
	     * @example
	     * //changeCallback为方法体
	     * editor.removeListener("selectionchange",changeCallback);
	     */
	    off:function (types, listener) {
	        types = _.str.trim(types).split(' ');
	        for (var i = 0, ti; ti = types[i++];) {
	            this.removeItem(this.getListener(ti), listener);
	        }
	    },
	    /**
	     * 触发事件
	     * @name fireEvent
	     * @grammar editor.fireEvent(types)  //types为事件名称，多个可用空格分隔
	     * @example
	     * editor.fireEvent("selectionchange");
	     */
	    trigger:function () {
	        var types = arguments[0];
	        var args=[];
	        $.each(arguments,function(i,item){
	        	if(i==0) return;
	        	args.push(item);
	        });
	        	        
	        types = _.str.trim(types).split(' ');
	        for (var i = 0, ti; ti = types[i++];) {
	            var listeners = this.getListener(ti),
	                r, t, k;
	            if (listeners) {
	                k = listeners.length;
	                while (k--) {
	                    if(!listeners[k])continue;
	                    t = listeners[k].apply(this, args);
	                    if(t === true){
	                        return t;
	                    }
	                    if (t !== undefined) {
	                        r = t;
	                    }
	                }
	            }
	            if (t = this['on' + ti.toLowerCase()]) {
	                r = t.apply(this, args);
	            }
	        }
	        return r;
	    }
	});

	return EventBase;
});
