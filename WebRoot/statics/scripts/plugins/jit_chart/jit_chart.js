function _isArray(obj) {  
  return Object.prototype.toString.call(obj) === '[object Array]';   
}

var JitChart =  {
	loadMap:{},
	create : function(containerId,entityId,chartData,params){
		params = params||{} ;
		//if(JitChart.loadMap[containerId]) return ;
		if( !_isArray(entityId) ){
			entityId = [entityId] ;
		}
		
		JitChart.loadMap[containerId] = true ;
		//entityId = (entityId||"").replace(/-/g,'') ;
		var entityMap = {} ;
		$(entityId||[]).each(function(index,item){
			item = (item||"").replace(/-/g,'') ;
			entityMap[item] = true ;
		}) ;
		
		var orientation = params.orientation || 'top' ;
		var offsetY = params.offsetY || 150 ;
		var offsetX = params.offsetX  ;
		var width = params.width||false ;
		var height = params.height||false ;
		var nodeWidth = params.nodeWidth||100 ;
		var nodeHeight = params.nodeHeight||42 ;
		
		var st = new $jit.ST({
	        'injectInto': containerId ,
	        //set duration for the animation
	        duration: 200,
	        //set animation transition type
	        transition: $jit.Trans.Quart.easeInOut,
	        levelDistance: 50,
	        levelsToShow:10,
	        width:width ,
	        height:height ,
	        orientation:orientation,
	        //offsetX:0 ,
	        //offsetY: 220 ,
	        Navigation: {
	          enable:true,
	          panning:true
	        }/*,
	        onComplete:function(){
	         	
	        },
	        request: function(nodeId, level, onComplete) {  
	        	
		    }*/,
	        Node: {
	        	//autoWidth:true,
	        	//autoHeight:true,
	        	width:nodeWidth,
	        	height:nodeHeight,
	        	dim:10,
	            type: 'nodeline',
	            color:'#23A4FF',
	            lineWidth: 2,
	            align:"center",
	            overridable: true,
	            CanvasStyles:{
	            	fillStyle: 'transparent'
	            }
        		/*
	            //height: 25,
	            //width: ',
	        	*/
	        },
	        
	        Edge: {
	            type: 'bezier',
	            lineWidth: 2,
	            color:'#23A4FF',
	            overridable: true
	        },
	       
	        onCreateLabel: function(label, node){
	       
	            label.id = node.id;      
	            
	            label.innerHTML = "<table><tr><td>"+node.name+"</td></tr></table>";

	            if( entityMap[node.id] ){
	            	label.className = "jit-chart-node current" ;
	            }else{
	            	label.className = "jit-chart-node" ;
	            }
	            
	            label.style.width = nodeWidth+"px" ;
	            label.style.height = nodeHeight+"px" ;
	            
	            label.onclick = function(){
	            	return false ;
	            	 // alert(node.id+" "+node.name) ;
		              st.onClick(node.id); 
	                  st.select(node.id); 
	                  st.removeSubtree(label.id, false, "replot", { 
	                        hideLabels: false 
	                  });
	                    
	                  var _requestNodes = null ;
	                    
				      $(chartData).each(function(index,item){
				      	  _requestNodes = _requestNodes||getRequestNodes(node.id , item) ;
				      }) ; 
				     // _requestNodes = _requestNodes[0].children ;
				     // alert($.json.encode(_requestNodes) ) ;
				      
				      subtree = {id:label.id,children:_requestNodes}  ;
				      
				      
				      /*st.removeSubtree(label.id, true, 'animate', {  
	                        hideLabels: false,  
	                        onComplete: function() {  
	                             
	                        }  
	                  });*/
	                  
	                  st.addSubtree(subtree, "animate" ,{  
				        hideLabels: false,  
				        onComplete: function() {  
				          // alert("subtree added");  
				        }  
				      }); 
				      
                      //childData = jQuery.parseJSON(subtree); 
                      //console.log(childData); 
		                      
								      
				      function getRequestNodes(nodeId , item ){
				      	var result = null ;
				      	if(item.id == nodeId){
				      		return item.children ;
				      	}
				      	
				      	$(item.children||[]).each(function(index,_item){
				      		result = getRequestNodes(nodeId , _item ) ;
				      	}) ;
				      	return result ;
				      }

                    
	            }
	        },
	        //override the Edge global style properties.
	        onBeforePlotLine: function(adj){
	        	if( entityMap[adj.nodeFrom.id] || entityMap[adj.nodeTo.id] ){
	        		adj.data.$color = "#00AD0C";
	                adj.data.$lineWidth = 2;
	        	}
	        }
	    });
	    
	    formatChartTree(chartData) ;
	    
	    function formatChartTree(data){
	    	$(data).each(function(){
	    		for(var o in this){
	    			if( o == 'id' || o=='text' || o == 'childNodes' ){
	    			
	    			}else{
	    				delete this[o] ;
	    			}
	    		}
	    		
	    		this.id = this.id.replace(/-/g,'') ;
	    		
	    		this.name = "<div class='orgchartnode'>"+this.text+"</div>" ;
	    		
		    	this.children = this.childNodes||[] ;
		    	this.data = {} ;
		    	if( this.childNodes && this.childNodes.length > 0 ){
		    		formatChartTree(this.childNodes) ;
		    	}
		    	delete this.childNodes   ; 
		    	delete this.text ;
		    }) ;
	    }
	    
	    //alert( $.json.encode(chartData[0]) );
	
		st.loadJSON(chartData[0]);
	    
	    //compute node positions and layout
	    st.compute();
	    
	      var m = {
		    offsetX: offsetX || st.canvas.translateOffsetX,
		    offsetY: offsetY
		  };

	    st.onClick(st.root, {  
		    Move:m
		} ); 
		/*
		setTimeout(function(){
			$(chartData[0].children).each(function(index,item){
				if(item.children && item.children.length >0 ){
					setTimeout(function(){
						st.onClick(item.id) ;
					},200*index) ;
				}
			}) ;
		},200) ;*/
		
	},
	init : function(){
		$jit.ST.Plot.NodeTypes.implement({
	        'nodeline': {
	          'render': function(node, canvas, animating) {
	               /* if(animating === 'expand' || animating === 'contract') {
	                  var pos = node.pos.getc(true), nconfig = this.node, data = node.data;
	                  var width  = nconfig.width, height = nconfig.height;
	                  var algnPos = this.getAlignedPos(pos, width, height);
	                  var ctx = canvas.getCtx(), ort = this.config.orientation;
	                  ctx.beginPath();
	                  if(ort == 'left' || ort == 'right') {
	                      ctx.moveTo(algnPos.x+100, algnPos.y + height / 2);
	                      ctx.lineTo(algnPos.x + width, algnPos.y + height / 2);
	                  } else {
	                      ctx.moveTo(algnPos.x + width / 2, algnPos.y);
	                      ctx.lineTo(algnPos.x + width / 2, algnPos.y + height);
	                  }
	                  ctx.stroke();
	              } */
	          }
	        } 
	    });	
	}
}


JitChart.init() ;
