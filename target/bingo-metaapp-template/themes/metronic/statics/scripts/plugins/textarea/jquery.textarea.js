(function($){
	jQuery.fn.extend({
	    getCurPos: function(){
	        var e=$(this).get(0),pos=e.value.length;
	        if(e.selectionStart){    //FF
	        	//consolelog("ff");
	            pos= e.selectionStart;
	        }else if(document.selection){    //IE
	        	//consolelog("ie");
	            var r = document.selection.createRange();
	            if (r == null) {
	            	pos= e.value.length;
	            }else{
	            	var re = e.createTextRange();
	            	var rc = re.duplicate();
	            	re.moveToBookmark(r.getBookmark());
	            	rc.setEndPoint('EndToStart', re);
	            	pos= rc.text.length;
	            }
	        }
	        return pos;
	    },
	    setCurPos: function(pos) {
	        var e=$(this).get(0);
	        e.focus();
	        if (e.setSelectionRange) {
	            e.setSelectionRange(pos, pos);
	        } else if (e.createTextRange) {
	            var range = e.createTextRange();
	            range.collapse(true);
	            range.moveEnd('character', pos);
	            range.moveStart('character', pos);
	            range.select();
	        }
	    } ,
	    insertAtCursor:function(val,startPos){
	    	var $t=$(this)[0]; 
	    	if(startPos===undefined){
	    		$t.value= $t.value+val;
	    	}else{
	    		$t.value = $t.value.substring(0, startPos) + val + $t.value.substring(startPos, $t.value.length); 
	    	}
	    	this.focus(); 
	    }
	});
})(jQuery);