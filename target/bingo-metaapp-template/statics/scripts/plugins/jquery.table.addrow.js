var hasTouch = 'ontouchstart' in document.documentElement,
	startEvent = hasTouch ? 'touchstart' : 'mousedown',
	moveEvent = hasTouch ? 'touchmove' : 'mousemove',
	endEvent = hasTouch ? 'touchend' : 'mouseup';

jQuery.tableDnD = {
    /** Keep hold of the current table being dragged */
    currentTable : null,
    curConfig:null,
    /** Keep hold of the current drag object if any */
    dragObject: null,
    /** The current mouse offset */
    mouseOffset: null,
    /** Remember the old value of Y so that we don't do too much processing */
    oldY: 0,


    /** Actually build the structure */
    build: function(options) {
        // Set up the defaults if any
        this.each(function() {
            // This is bound to each matching table, set up the defaults and override with user options
            this.tableDnDConfig = jQuery.extend({
                onDragStyle: null,
                onDropStyle: null,
				// Add in the default class for whileDragging
				onDragClass: "drag_tr",
                onDrop: null,
                onDragStart: null,
                scrollAmount: 5,

                serializeRegexp: /[^\-]*$/, // The regular expression to use to trim row IDs
				serializeParamName: null, // If you want to specify another parameter name instead of the table ID
                dragHandle: null, // If you give the name of a class here, then only Cells with this class will be draggable
                                
                //addRow
                addRowCSS:null,
                delRowCSS:null,
                copyRowCSS:null,
                maxRow:null,
				ignoreClass:null,
				rowNumColumn:null,
				autoAddRow:false,
				oddRowCSS:null,
				evenRowCSS:null,
				inputBoxAutoNumber:false,
				inputBoxAutoId:false,
				displayRowCountTo:null,
				maxRowAttr:null,
				hideFirstOnly:null,
				showFirstOnly:null,
				cloneClass:null,
				evenRowAttr:null,
				oddRowAttr:null,
				rowCountAttr:null,
				autoNumAttr:null,
				autoIdAttr:null,
				addCallBack:null,
				deleteCallBack:null,
				beforeDelete:null,
				genRow:null,
				wrapper:null,
				seed:Math.round(Math.random()*10000)
            }, options || {});
            // Now make the rows draggable
            jQuery.tableDnD.makeDraggable(this);
            jQuery.tableDnD.attachAddRow(this);
        });

        // Don't break the chain
        return this;
    },

	attachAddRow:function(table){
		var config=table.tableDnDConfig;
		var context=null;
		if(config.wrapper){
			context=$(table).closest("."+config.wrapper);
		}

		if(context==null ||context.length==0){
			context=$(table).parent();
		}		
		if(config.delRowCSS){
			$("."+config.delRowCSS,context).addClass("delRow"+config.seed);
			$("."+config.delRowCSS,context).closest("tr").addClass("cloneRow"+config.seed);
		}
		if(config.copyRowCSS){
			$("."+config.copyRowCSS,context).addClass("copyRow"+config.seed);
		}		
		if(config.addRowCSS){
			$("."+config.addRowCSS,context).addClass("addRow"+config.seed);
			$("."+config.addRowCSS,context).parent().data("table",$(table));
			if(!config.cloneClass){				
				config.cloneClass="cloneRow"+config.seed;
			}
			if(config.genRow!=null && !$.isFunction(config.genRow)){
				var tDomId=config.genRow;
				config.genRow=function(){
					var row= $("tr:last",$("."+tDomId,context));
					if(row.length===0){
						return $($("."+tDomId,context).text());
					}
					return row;
				};
			}
		}
		
		this.initAddRow(table);
	},
	
	initAddRow:function(table){
		var config=table.tableDnDConfig;
		var context=null;
		if(config.wrapper){
			context=$(table).closest("."+config.wrapper);
		}

		if(context==null ||context.length==0){
			context=$(table).parent();
		}
		if (!table.goLive){			
			var t=this;
			jQuery.tableDnD.currentTable=table;
			jQuery.tableDnD.curConfig=config;
			this.update();
			$(context).on("click",".addRow"+config.seed,function(){
				jQuery.tableDnD.currentTable=table;
				jQuery.tableDnD.curConfig=config;
				var newRow=t.addRow();
				$(table).trigger("addRow",{table:table,newrow:newRow});
			});
			$(context).on("click",".copyRow"+config.seed,function(){
				jQuery.tableDnD.currentTable=table;
				jQuery.tableDnD.curConfig=config;
				var $tr=$(this).closest("tr");
				var newRow=t.copyRow($tr);
				$(table).trigger("copyRow",{table:table,newrow:newRow});
			});			
			$(context).on("click",".delRow"+config.seed,function(){
				jQuery.tableDnD.currentTable=table;
				jQuery.tableDnD.curConfig=config;
				var oj=$(this).closest("."+t.curConfig.cloneClass);				
				if($.isFunction(t.curConfig.beforeDelete) && !t.curConfig.beforeDelete(oj)){
					return;
				}
				o=oj.clone();
				oj.hide().find("*").each(function(i,v){
					if($(v).data("destroy"));
					for(var k in $(v).data("destroy")){
						$(v).data("destroy")[k](v);
					}
				});
				oj.remove();
				$(".addRow"+t.curConfig.seed).attr("disabled",false);
				t.update();
				$(table).trigger("deletedRow",{table:table});
				if(t.curConfig.deleteCallBack && $.isFunction(t.curConfig.deleteCallBack)) 
					t.curConfig.deleteCallBack(o,t.currentTable);
				
			});
			$(context).on("keyup",".autoAdd"+config.seed,function(){
				if((this.nodeName.toLowerCase()=="textarea" && $(this).html()!="") ||
				(this.nodeName.toLowerCase()=="textarea" && $(this).val()!="") ||
				(this.nodeName.toLowerCase()=="input" && $(this).val()!="")) t.addRow();
			});
			table.goLive=true;
		}
		 $(table).on("fillDatas",function(e,datas){
         	jQuery.tableDnD.addRowAndFillData($(table),datas);
         });
		return this;
	},
	
	updateRowNumber:function(){
		var t=this;
		if(t.curConfig.rowNumColumn){
			$("."+t.curConfig.cloneClass,t.currentTable).each(function(j,u){
				var n=j+1;
				$("."+t.rowNumColumn,$(u)).each(function(i,v){
					if($(v).is(":text, textarea")) 
						$(v).val(n);
					else
						$(v).text(n);
				});
			});
		}
		return t;
	},
	
	updateInputBoxName:function(){
		$("."+this.curConfig.cloneClass,this.currentTable).each(function(j,t){
			var n=j;
			$(":input",$(t)).each(function(i,v){
				if($(v).attr("name")){
					var newName=$(v).attr("name").replace(/\[\d+\]/,"["+n+"]");
					$(v).attr("name",newName);
				}
			});
		});
		return this;
	},
	
	updateInputBoxId:function(){
		var t=this;
		$("."+t.curConfig.cloneClass,this.currentTable).each(function(j,u){
			var n=j;
			$(":input",$(u)).each(function(i,v){
				if($(v).attr("id")){
					var newId=$(v).attr("id").replace(/\[\d+\]/,"["+n+"]");
					$(v).removeAttr("id").attr("id",newId);
				}
			});
		});
		return this;
	},
	
	updateOddRowCSS:function(){
		if(this.curConfig.oddRowCSS){
			$(this.currentTable).find("."+this.curConfig.oddRowCSS).removeClass(this.curConfig.oddRowCSS);
			$(this.currentTable).find("tr:odd").addClass(this.curConfig.oddRowCSS);
		}
		return this;
	},
	
	updateEvenRowCSS:function(){
		if(this.curConfig.evenRowCSS){
			$(this.currentTable).find("."+this.curConfig.evenRowCSS).removeClass(this.curConfig.evenRowCSS);
			$(this.currentTable).find("tr:even").addClass(this.curConfig.evenRowCSS);
		}
		return this;
	},

	updateRowCount:function(){
		if(this.curConfig.displayRowCountTo){
			var count=$("."+this.curConfig.cloneClass,this.currentTable).size();
			$("."+this.curConfig.displayRowCountTo,this.currentTable).each(function(i,v){
				var nn=v.nodeName.toLowerCase();
				if(nn=="input" || nn=="textarea") 
					$(v).val(count);
				else
					$(v).html(count);
			});
		}
		return this;
	},
	
	update:function(){
		var delRowButtons=$(".delRow"+this.curConfig.seed,this.currentTable);
		if(delRowButtons.size()==1 && this.curConfig.genRow==null)
			delRowButtons.hide();
		else {
			if(this.curConfig.autoAddRow)
				delRowButtons.not(":last").show();
			else
				delRowButtons.show();
		}
		if(this.curConfig.autoAddRow) {
			this.find(".autoAdd"+this.curConfig.seed).removeClass("autoAdd"+this.curConfig.seed);
			this.find("."+this.curConfig.cloneClass+":last")
			.find("input,textarea")
			.addClass("autoAdd"+this.curConfig.seed);
		}
		if(this.curConfig.inputBoxAutoNumber) {
			this.updateInputBoxName();
			this.updateInputBoxId();
		}
		if(this.curConfig.inputBoxAutoId) {
			this.updateInputBoxId();
		}
		if(this.curConfig.hideFirstOnly && this.curConfig.hideFirstOnly!=""){
			$("."+this.curConfig.cloneClass).eq(0).find("."+this.curConfig.hideFirstOnly).hide();
			$("."+this.curConfig.cloneClass).not(":first").find("."+this.curConfig.hideFirstOnly).show();
		}
		if(this.curConfig.showFirstOnly && this.curConfig.showFirstOnly!=""){
			$("."+this.curConfig.cloneClass).eq(0).find("."+this.curConfig.showFirstOnly).show();
			$("."+this.curConfig.cloneClass).not(":first").find("."+this.curConfig.showFirstOnly).hide();
		}
		this.updateRowNumber()
		.updateOddRowCSS()
		.updateEvenRowCSS()
		.updateRowCount();
		
		jQuery.tableDnD.makeDraggable(this.currentTable);
		return this;
	},
	addRowAndFillData:function(table,datas){
		var dndTable=this;
		var table=$(table);
		var ths=$(table).find("thead th");
		var thTextMap=[];
		ths.each(function(i,th){
			var text=$(th).text();
			thTextMap.push(text);
		});
		if(datas){
			if($.isArray(datas)){
				$.each(datas,function(i,item){
					var newRow=dndTable.addRow(table);
					newRow.find("td").each(function(i,td){
						if(i>0){
							var key=thTextMap[i];
							$(td).find("input:visible").val(item[key]);
						}
					});
				});
			}
		}
	},
	addRow:function(table){
		if(table){
			var _table=$(table)[0]||$(table).data("tableDnd")[0];
			this.curConfig=_table.tableDnDConfig;
			this.currentTable=_table;
		}
		var newRow;
		if(!this.curConfig.maxRow || (this.curConfig.maxRow && $("."+this.curConfig.cloneClass).size()<this.curConfig.maxRow)){
			var delRowButtons=$(".delRow"+this.curConfig.seed,this.currentTable);
			delRowButtons.show();
			var lastRow=$("."+this.curConfig.cloneClass+":last",this.currentTable);
			var newRow=null;
			if(this.curConfig.genRow){
				var genTr=this.curConfig.genRow($("."+this.curConfig.cloneClass).size()+1);
				if(genTr!=null && genTr.size()>0){
					genTr=(genTr[0].nodeName.toLowerCase()=="tr")?$(genTr):$("tr:first",genTr);				
					genTr.addClass(this.curConfig.cloneClass);
					genTr.find("."+this.curConfig.delRowCSS).addClass("delRow"+this.curConfig.seed);
					genTr.find("."+this.curConfig.copyRowCSS).addClass("copyRow"+this.curConfig.seed);
					newRow=genTr.clone();
				}
			}else{
				newRow=lastRow.clone();
				newRow.find("input:text").val("");
				newRow.find("textarea").text("");
			}	
			if(this.curConfig.autoAddRow){
				newRow.find("."+this.curConfig.cloneClass).hide();
			}
			if(lastRow.size()>0){
				newRow.insertAfter(lastRow);
			}else{
				$(this.currentTable).append(newRow);
			}
			
			if(this.curConfig.ignoreClass && this.curConfig.ignoreClass!=""){
				newRow.find("."+this.curConfig.ignoreClass).each(function(){
					if(this.nodeName.toLowerCase()=="input" &&
						($(this).attr("type").toLowerCase()=="text"
						|| $(this).attr("type").toLowerCase()=="hidden"
					)) $(this).val("");
					else if(this.nodeName.toLowerCase()=="td") $(this).html(" ");
					else if($(this).html()!="") $(this).text("");
				});
			}
			//newRow.find("input:hidden").not("."+this.curConfig.cloneClass).val("");
			if(this.curConfig.hideFirstOnly && this.curConfig.hideFirstOnly!=""){
				newRow.find("."+this.curConfig.hideFirstOnly).show();
			}
			if(this.curConfig.showFirstOnly && this.curConfig.showFirstOnly!=""){
				newRow.find("."+this.curConfig.hideFirstOnly).hide();
			}
			if(this.curConfig.maxRow && $("."+this.curConfig.cloneClass).size()>=this.maxRow) 
				$(".addRow"+this.curConfig.seed).attr("disabled",true);
			/*
			$(this.currentTable).find("."+this.cloneClass+":first").closest("tr").find("*")
			.each(function(i,v){
				if($(this).data("init")) {
					var jObj=newRow.find("*").eq(i),obj=jObj[0];
					jObj.data("init",{});
					for(var k in $(this).data("init")){
						jObj.data("init")[k]=$(this).data("init")[k];
						jObj.data("init")[k](obj);
					}
				}
			});*/
			this.update();
		}
		if(this.curConfig.addCallBack && $.isFunction(this.curConfig.addCallBack))
			this.curConfig.addCallBack(newRow,this.currentTable);
		return newRow;
	},
	
	copyRow:function($copyRow){
		var newRow;
		if(!this.curConfig.maxRow || (this.curConfig.maxRow && $("."+this.curConfig.cloneClass).size()<this.curConfig.maxRow)){
			var delRowButtons=$(".delRow"+this.curConfig.seed,this.currentTable);
			delRowButtons.show();
			
			newRow=$copyRow.clone(true);
			newRow.find('select').each(function() {
				var $t = $(this), name = $t.attr('name')
					, val = $copyRow.find('[name="' + name + '"]').val();
				newRow.find('[name="' + name + '"]').val(val);
			});
			if(this.curConfig.autoAddRow){
				newRow.find("."+this.curConfig.cloneClass).hide();
			}
			$copyRow.after(newRow);
			
			if(this.curConfig.ignoreClass && this.curConfig.ignoreClass!=""){
				newRow.find("."+this.curConfig.ignoreClass).each(function(){
					if(this.nodeName.toLowerCase()=="input" &&
						($(this).attr("type").toLowerCase()=="text"
						|| $(this).attr("type").toLowerCase()=="hidden"
					)) $(this).val("");
					else if(this.nodeName.toLowerCase()=="td") $(this).html(" ");
					else if($(this).html()!="") $(this).text("");
				});
			}
			//newRow.find("input:hidden").not("."+this.curConfig.cloneClass).val("");
			if(this.curConfig.hideFirstOnly && this.curConfig.hideFirstOnly!=""){
				newRow.find("."+this.curConfig.hideFirstOnly).show();
			}
			if(this.curConfig.showFirstOnly && this.curConfig.showFirstOnly!=""){
				newRow.find("."+this.curConfig.hideFirstOnly).hide();
			}
			if(this.curConfig.maxRow && $("."+this.curConfig.cloneClass).size()>=this.maxRow) 
				$(".addRow"+this.curConfig.seed).attr("disabled",true);
			/*
			$(this.currentTable).find("."+this.cloneClass+":first").closest("tr").find("*")
			.each(function(i,v){
				if($(this).data("init")) {
					var jObj=newRow.find("*").eq(i),obj=jObj[0];
					jObj.data("init",{});
					for(var k in $(this).data("init")){
						jObj.data("init")[k]=$(this).data("init")[k];
						jObj.data("init")[k](obj);
					}
				}
			});*/
			this.update();
		}
		if(this.curConfig.addCallBack && $.isFunction(this.curConfig.addCallBack))
			this.curConfig.addCallBack(newRow,this.currentTable);
		return newRow;
	},
	
    /** This function makes all the rows on the table draggable apart from those marked as "NoDrag" */
    makeDraggable: function(table) {
		
        var config = table.tableDnDConfig;
		if (config.dragHandle) {
			// We only need to add the event to the specified cells
			var cells = jQuery("td."+table.tableDnDConfig.dragHandle, table);
			cells.each(function() {
				// The cell is bound to "this"
                jQuery(this).bind(startEvent, function(ev) {
					jQuery.tableDnD.initialiseDrag(this.parentNode, table, this, ev, config);
                    return false;
                });
			});
		} else {
			// For backwards compatibility, we add the event to the whole row
	        var rows = jQuery("tr", table); // get all the rows as a wrapped set
	        rows.each(function() {
				// Iterate through each row, the row is bound to "this"
				var row = jQuery(this);
				if (! row.hasClass("nodrag")) {
	                row.bind(startEvent, function(ev) {
	                	row.attr("dragTag",Math.round(Math.random()*10000));
	                    if (ev.target.tagName == "TD") {
							jQuery.tableDnD.initialiseDrag(this, table, this, ev, config);
	                        return false;
	                    }
	                }).css("cursor", "move"); // Store the tableDnD object
				}
			});
		}
	},
	
	initialiseDrag: function(dragObject, table, target, evnt, config) {
        jQuery.tableDnD.dragObject = dragObject;
        jQuery.tableDnD.currentTable = table;
        jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(target, evnt);
        jQuery.tableDnD.originalOrder = jQuery.tableDnD.serialize();
        // Now we need to capture the mouse up and mouse move event
        // We can use bind so that we don't interfere with other event handlers
        jQuery(document)
            .bind(moveEvent, jQuery.tableDnD.mousemove)
            .bind(endEvent, jQuery.tableDnD.mouseup);
        if (config.onDragStart) {
            // Call the onDragStart method if there is one
            config.onDragStart(table, target);
        }
	},

	updateTables: function() {
		this.each(function() {
			// this is now bound to each matching table
			if (this.tableDnDConfig) {
				jQuery.tableDnD.makeDraggable(this);
			}
		});
	},

    /** Get the mouse coordinates from the event (allowing for browser differences) */
    mouseCoords: function(ev){
        if(ev.pageX || ev.pageY){
            return {x:ev.pageX, y:ev.pageY};
        }
        return {
            x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y:ev.clientY + document.body.scrollTop  - document.body.clientTop
        };
    },

    /** Given a target element and a mouse event, get the mouse offset from that element.
        To do this we need the element's position and the mouse position */
    getMouseOffset: function(target, ev) {
        ev = ev || window.event;

        var docPos    = this.getPosition(target);
        var mousePos  = this.mouseCoords(ev);
        return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
    },

    /** Get the position of an element by going up the DOM tree and adding up all the offsets */
    getPosition: function(e){
        var left = 0;
        var top  = 0;
        /** Safari fix -- thanks to Luis Chato for this! */
        if (e.offsetHeight == 0) {
            /** Safari 2 doesn't correctly grab the offsetTop of a table row
            this is detailed here:
            http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari/
            the solution is likewise noted there, grab the offset of a table cell in the row - the firstChild.
            note that firefox will return a text node as a first child, so designing a more thorough
            solution may need to take that into account, for now this seems to work in firefox, safari, ie */
            e = e.firstChild; // a table cell
        }
		if (e && e.offsetParent) {
	        while (e.offsetParent){
	            left += e.offsetLeft;
	            top  += e.offsetTop;
	            e     = e.offsetParent;
	        }
	
	        left += e.offsetLeft;
	        top  += e.offsetTop;
		}

        return {x:left, y:top};
    },

    mousemove: function(ev) {
        if (jQuery.tableDnD.dragObject == null) {
            return;
        }
		if (ev.type == 'touchmove') {
			// prevent touch device screen scrolling
			event.preventDefault(); 
		}

        var dragObj = jQuery(jQuery.tableDnD.dragObject);
        var config = jQuery.tableDnD.currentTable.tableDnDConfig;
        var mousePos = jQuery.tableDnD.mouseCoords(ev);
        var y = mousePos.y - jQuery.tableDnD.mouseOffset.y;
        //auto scroll the window
	    var yOffset = window.pageYOffset;
	 	if (document.all) {
	        // Windows version
	        //yOffset=document.body.scrollTop;
	        if (typeof document.compatMode != 'undefined' &&
	             document.compatMode != 'BackCompat') {
	           yOffset = document.documentElement.scrollTop;
	        }
	        else if (typeof document.body != 'undefined') {
	           yOffset=document.body.scrollTop;
	        }

	    }
		    
		if (mousePos.y-yOffset < config.scrollAmount) {
	    	window.scrollBy(0, -config.scrollAmount);
	    } else {
            var windowHeight = window.innerHeight ? window.innerHeight
                    : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
            if (windowHeight-(mousePos.y-yOffset) < config.scrollAmount) {
                window.scrollBy(0, config.scrollAmount);
            }
        }


        if (y != jQuery.tableDnD.oldY) {
            // work out if we're going up or down...
            var movingDown = y > jQuery.tableDnD.oldY;
            // update the old value
            jQuery.tableDnD.oldY = y;
            // update the style to show we're dragging
			if (config.onDragClass) {
				dragObj.addClass(config.onDragClass);
			} else {
	            dragObj.css(config.onDragStyle);
			}
            // If we're over a row then move the dragged row to there so that the user sees the
            // effect dynamically
            var currentRow = jQuery.tableDnD.findDropTargetRow(dragObj, y);
            if (currentRow) {
                // TODO worry about what happens when there are multiple TBODIES
                if (movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow.nextSibling);
                } else if (! movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow);
                }
            }
        }

        return false;
    },

    /** We're only worried about the y position really, because we can only move rows up and down */
    findDropTargetRow: function(draggedRow, y) {
        var rows = jQuery.tableDnD.currentTable.rows;
        for (var i=0; i<rows.length; i++) {
            var row = rows[i];
            var rowY    = this.getPosition(row).y;
            var rowHeight = parseInt(row.offsetHeight)/2;
            if (row.offsetHeight == 0) {
                rowY = this.getPosition(row.firstChild).y;
                rowHeight = parseInt(row.firstChild.offsetHeight)/2;
            }
            // Because we always have to insert before, we need to offset the height a bit
            if ((y > rowY - rowHeight) && (y < (rowY + rowHeight))) {
                // that's the row we're over
				// If it's the same as the current row, ignore it
				if (row == draggedRow) {return null;}
                var config = jQuery.tableDnD.currentTable.tableDnDConfig;
                if (config.onAllowDrop) {
                    if (config.onAllowDrop(draggedRow, row)) {
                        return row;
                    } else {
                        return null;
                    }
                } else {
					// If a row has nodrop class, then don't allow dropping (inspired by John Tarr and Famic)
                    var nodrop = jQuery(row).hasClass("nodrop");
                    if (! nodrop) {
                        return row;
                    } else {
                        return null;
                    }
                }
                return row;
            }
        }
        return null;
    },

    mouseup: function(e) {
        if (jQuery.tableDnD.currentTable && jQuery.tableDnD.dragObject) {
	        // Unbind the event handlers
	        jQuery(document)
	            .unbind(moveEvent, jQuery.tableDnD.mousemove)
	            .unbind(endEvent, jQuery.tableDnD.mouseup);
            var droppedRow = jQuery.tableDnD.dragObject;
            var config = jQuery.tableDnD.currentTable.tableDnDConfig;
            // If we have a dragObject, then we need to release it,
            // The row will already have been moved to the right place so we just reset stuff
			if (config.onDragClass) {
	            jQuery(droppedRow).removeClass(config.onDragClass);
			} else {
	            jQuery(droppedRow).css(config.onDropStyle);
			}
            jQuery.tableDnD.dragObject   = null;
            var newOrder = jQuery.tableDnD.serialize();
            if (config.onDrop && (jQuery.tableDnD.originalOrder != newOrder)) {
                // Call the onDrop method if there is one
                config.onDrop(jQuery.tableDnD.currentTable, droppedRow);
            }
            $(droppedRow).removeAttr("dragTag");
            jQuery.tableDnD.currentTable = null; // let go of the table too
        }
    },

    serialize: function() {
        if (jQuery.tableDnD.currentTable) {
            return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable);
        } else {
            return "Error: No Table id set, you need to set an id on your table and every row";
        }
    },

	serializeTable: function(table) {
        var result = "";
        var tableId = table.id;
        var rows = table.rows;
        for (var i=0; i<rows.length; i++) {
            if (result.length > 0) result += "&";
            var rowId = $(rows[i]).attr("dragTag");
            if (rowId && rowId && table.tableDnDConfig && table.tableDnDConfig.serializeRegexp) {
                rowId = rowId.match(table.tableDnDConfig.serializeRegexp)[0];
            }

            result += tableId + '[]=' + rowId;
        }
        return result;
	},

	serializeTables: function() {
        var result = "";
        this.each(function() {
			// this is now bound to each matching table
			result += jQuery.tableDnD.serializeTable(this);
		});
        return result;
    }

};


jQuery.fn.extend(
	{
		tableDnD : jQuery.tableDnD.build,
		tableDnDUpdate : jQuery.tableDnD.updateTables,
		tableDnDSerialize: jQuery.tableDnD.serializeTables
	}
);