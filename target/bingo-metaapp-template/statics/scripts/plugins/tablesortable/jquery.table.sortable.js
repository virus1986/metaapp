/**
 * 对表格进行排序
 * @argument 待排序的table的id
 * 用法：
 *    1、在页面的onload中调用jQuery.sortTable({tableId:"tableId",imgPath:""});
 *    2、对于不需要排序的列，用class="noSort"标记
 *    3、对于希望无论对什么排序，都放在最后一行的行，用class="palcelast",可用表格中最后统计的行
 * 注意：要求待排序的表格具有thead和tbody   
 */
(function($){
	$.extend({
	  sortTable:
	  function(args){
	       var table=$("#"+args.tableId),
	       allTr=$("tbody > tr",table).not(".palcelast").get(),
	       img=$("<image src='' style='margin-left:5'/>"),
	       tHead=$("thead > tr >th",table).not($(".noSort"));
	       if(tHead.length==0){
	    	   tHead=$("thead > tr >td",table).not($(".noSort"));
	       }//dir:sort order,index:compute absolute column of a column
	       tHead.each(function(){
	    	   $(this).data("dir",1)
	    	   .data("index",$(this).prevAll().length)
	    	   .css("cursor","pointer")
	    	   .attr("title","单击排序")
	    	   .click(function(){
	    		   _$this=$(this);
	    		   allTr.sort(function(a,b){
	    			   var td1=$(a).children("td").eq(_$this.data("index")).text();
	    			   td1=isNaN(Number(td1))?td1:Number(td1);    
	    			   var td2=$(b).children("td").eq(_$this.data("index")).text();
	    			   td2=isNaN(Number(td2))?td2:Number(td2);   
	    			   var dir=_$this.data("dir");
	    			   if(td1>td2){
	    				   return dir;
	    			   }else if(td1<td2){
	    				   return -dir;
	    			   }else{
	    				   return 0;
	    			   }
	    		   });
	    		   $(this).data("dir",-$(this).data("dir"));
	    		   nosortTr = $("tbody > tr.palcelast",table).get();
	    		   allTr.push(nosortTr);
	    		   $(allTr).each(function(){
	    			   $("tbody",table).append($(this));
	    		   });
	    		   var imgPath = Global.contextPath + '/theme/default/static/scripts/plugins/tablesortable/img/';
	    		   
	    		   $(this).append(img.attr("src",imgPath+($(this).data("dir")==1?"down":"up")+".gif"));
	    	   });
	       });
	  	}
	 });
	})(jQuery);