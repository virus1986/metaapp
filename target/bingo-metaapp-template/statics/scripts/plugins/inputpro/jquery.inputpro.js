
/**
 *  加强文本框控件
 *  lixh@bingosoft.net
 */
(function($){
	var KEY = {
	    BACKSPACE: 8,
	    TAB: 9,
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32,
	    PAGE_UP: 33,
	    PAGE_DOWN: 34,
	    END: 35,
	    HOME: 36,
	    LEFT: 37,
	    UP: 38,
	    RIGHT: 39,
	    DOWN: 40,
	    NUMPAD_ENTER: 108,
	    COMMA: 188
	};
	
	
	jQuery.extend(jQuery.fn, {
		bingo_inputImg: function(o) {
			if( typeof o == 'string' ){
				switch(o){
					case 'disable':
					 	disable(this) ;
					 	return ;
					case 'enable':
						enable(this) ;
						return ;
					case 'show':
						show(this) ;
						return ;
					case 'hide':
						hide(this) ;
						return ;
					default:
					  alert(o+"Function not supported") ;
					  return ;
				}
				return ;
			}
			
			defaultOptions = {
				type:'class',
				src:'icon-search',
				event:{
				}
			};
			var dropdown =$("inputpro-img-input_dropdown");
			if(dropdown.length<1){
				dropdown = $("<div>")
		        .addClass("inputpro-img-input_dropdown")
		        .appendTo("body")
		        .hide();
			}
			var timeout;
			var selected_dropdown_item=null;
			
			var options = o ;//$.extend(defaultOptions,o) ;
			
			// Basic cache to save on db hits
		    var cache = new Cache();
		    var isValidate=true;
			
			jQuery(this).each( function() {
				var input = jQuery(this);
				input.addClass('inputpro-img-input') ;
				var width = input.width();
				if(width<90)width = 90; 
				var height = input.outerHeight(true) ;
				
				var count = 0 ;
				$(options).each( function(){
					var _o = this ;
					//build pro img
					count++ ;
					var html = buildHtml(_o,count) ;
					var eventObj = null ;
					
					/*<span class="inputpro-img input-append">
						<input class="include-span input-span-uneditable"  style="width: 184px; ">
						<span class="add-on btn button-reset">
							<i class="ui-icon ui-icon-triangle-1-s icon-chevron-down"></i>
						</span>
					</span>*/
					
					if( input.parent('.inputpro-img').get(0) ){
						eventObj = input.parent('.inputpro-img').append(html).find('.iis-'+count) ;
					}else{
						eventObj = input.wrap("<span class='inputpro-img input-append'></span>")
					     .addClass('include-span input-span-uneditable')
					     .width(width - 26)
					     .parent('.inputpro-img')
					     .addClass("input-append")
					     .append(html)
					     .find('.iis-'+count) ;

					   input.width(width - eventObj.parent('.inputpro-img').find(".add-on").outerWidth(true) ) ;
					}
					
					if(_o.url && $.open ){
						_o.event = _o.event||{} ;
						_o.event["click"] = function(val,input){
							var params = $.extend({},_o) ;
							params.callback = null ;
							params.value = val ;
							params.target = input ;
							var callback = function(){
								var _callback = _o.callback||function(){} ;
								_callback.call(this,val,input) ;
							};
							$.open( _o.url , _o.width,_o.height,params,callback) ;
						};
					}
					
					if(_o.event){
						for(var o in _o.event){
							eventObj.unbind(o).bind(o, function(){
								var curInputBox=$(this).parent().find("input");
								if(curInputBox.attr('disabled') || curInputBox.attr('readonly')) return ;//firefox chrome cannot disable span
								_o.event[o](curInputBox.val(),curInputBox);
								return false;
							} ) ;
						}
					}
					
					if(_o.css){
						eventObj.css( _o.css ) ;
					}
				} ) ;
				
				if( input.attr('disabled')) {
					disable(input) ;
				}
				
				//增加自动完成功能
				input.blur(function () {
					var me=$(this);
					if(o.resetWhenChange===false){
						isValidate=true;
					}
		            hideDropdown();	
		            if(!isValidate){
		            	removeItem(me);
		            	isValidate=true;
		            }
		        })
		        .keydown(function (event) {
		        	var me=$(this);
			        switch(event.keyCode) {
			        	case KEY.LEFT:
		                case KEY.RIGHT:
		                case KEY.UP:
		                case KEY.DOWN:                   
	                        	var dropdown_item = null;                        
		                        if(event.keyCode === KEY.DOWN || event.keyCode === KEY.RIGHT) {
		                            dropdown_item = $(selected_dropdown_item).next();
		                        } else {
		                            dropdown_item = $(selected_dropdown_item).prev();
		                        }
		
		                        if(dropdown_item.length) {
		                            selectDropdownItem(dropdown_item);
		                        }
		                        return false;
	                    
	                   			break;
			                case KEY.BACKSPACE:
			                		if(me.val().length<1){
			                			isValidate=true;
			                			setTimeout(function(){
				                			removeItem(me);
				                			hideDropdown();
			                			},100);
			                		}else{
			                			isValidate=false;
			                			setTimeout(function(){
			                				doSearch(me);
			                			},100);
			                		}
			                    break;
			                    
			                case KEY.TAB:
			                case KEY.ENTER:
			                case KEY.NUMPAD_ENTER:
			                case KEY.COMMA:
			                  if(selected_dropdown_item) {
			                   	addItem(me);
			                    return false;
			                  }
			                  isValidate=false;
			                  break;
			
			                case KEY.ESCAPE:
			                  hideDropdown();
			                  return true;
							
			                default:
			                    if(String.fromCharCode(event.which)) {
			                    	isValidate=false;
			                        setTimeout(function(){doSearch(me);}, 5);
			                    }
			                    break;
			            }
            	});
			
            	function doSearch(curInput) {
			        var query = curInput.val().toLowerCase();
			
			        if(query && query.length) {
			            if(query.length >= 0) {
			                showDropdownSearching(curInput);
			                clearTimeout(timeout);
			
			                timeout = setTimeout(function(){
			                    runSearch(curInput,query);
			                }, 300);
			            } else {
			                hideDropdown();
			            }
			        }
			    }
			
			    // Do the actual search
			    function runSearch(curInput,query) {
			    	var url = curInput.attr("data-queryurl");
			        var cache_key = query + url;
			        var cached_results = cache.get(cache_key);
			        if(cached_results) {
			            populateDropdown(curInput,query, cached_results);
			        } else {
			            if(!url) return;
 			            // Extract exisiting get params
			            var ajax_params = {};
			            ajax_params.data = {};
			            ajax_params.url = url;
			            // Prepare the request
			            ajax_params.data["keyword"] = query;
			            ajax_params.type = "Get";
			            ajax_params.dataType = "json";
			
			            // Attach the success callback
			            ajax_params.success = function(results) {
			            	cache.add(cache_key,results);
		                	// only populate the dropdown if the results are associated with the active search query
		                  	if(curInput.val().toLowerCase() === query) {
		                    	populateDropdown(curInput,query,results);
		                  	}
			            };
			            // Make the request
			            $.ajax(ajax_params);
			        }
			    }
			});
			
			function showDropdownSearching (inputBox) {
		        if(options.searchingText) {
		            dropdown.html("<p>"+options.searchingText+"</p>");
		            showDropdown(inputBox);
		        }
		    }
		    
		    function hideDropdown () {
		        dropdown.hide().empty();
		        selected_dropdown_item = null;
		    }
		
		    function showDropdown(inputBox) {
		        dropdown
		            .css({
		                position: "absolute",
		                top: $(inputBox).offset().top + $(inputBox).outerHeight(),
		                left: $(inputBox).offset().left,
		                zIndex: 2000
		            }).show();
		    }
		    
		    function populateDropdown(inputBox,query, results) {
		    	//禁用输入查询功能
		    	return;
		        if(results && results.length) {
		            dropdown.empty();
		            var dropdown_ul = $("<ul>")
		            	.addClass("dropdown-menu")
		            	.css("width",inputBox.width()+30)
		                .appendTo(dropdown)
		                .mouseover(function (event) {
		                    selectDropdownItem($(event.target).closest("li"));
		                })
		                .mousedown(function (event) {
		                    addItem(inputBox);
		                    return false;
		                }).hide();
		            $.each(results, function(index, item) {
		                var this_li = $("<li id='"+item.id+"'><a href='javascript://'>"+item.name+"</a></li>");
		                this_li.appendTo(dropdown_ul);
		                this_li.data("itemData",item);
		                if(index === 0) {
		                    selectDropdownItem(this_li);
		                }
		            });
		
		            showDropdown(inputBox);
					dropdown_ul.slideDown("fast");
		        } else {
	                dropdown.html("<p>no results</p>");
	                selected_dropdown_item=null;
	                showDropdown(inputBox);
		        }
		    }
		    
		    function addItem(inputBox){
		    	if(selected_dropdown_item){
		    		isValidate=true;
		    		var refInputId=inputBox.attr("id").substr(0,inputBox.attr("id").length-5);
		    		var itemData=selected_dropdown_item.data("itemData");
		    		if(refInputId.indexOf(".")>0){
		    			var refInput=document.getElementById(refInputId);
		    			refInput.value=itemData.id;
		    		}else{
		    			inputBox.parent().parent().find("#"+refInputId).val(itemData.id);
		    		}
		    		inputBox.val(itemData.name);
		    	}
		    	hideDropdown();
		    }
		    function removeItem(inputBox){
		    	inputBox.val("");
		    	if(!inputBox.attr("id")){
		    		return;
		    	}
		    	var refInputId=inputBox.attr("id").substr(0,inputBox.attr("id").length-5);
		    	if(refInputId.indexOf(".")>0){
	    			var refInput=document.getElementById(refInputId);
	    			refInput.value="";
	    		}else{
	    			//inputBox.parent().parent().find("#"+refInputId).val(itemData.id);
	    			inputBox.parent().parent().find("#"+refInputId).val("");
	    		}	
		    }
		    
		     // Highlight an item in the results dropdown
		    function selectDropdownItem (item) {
		        if(item) {
		        	if(selected_dropdown_item) {
		                deselectDropdownItem($(selected_dropdown_item));
		            }
            		item.addClass("input-img-selected-item");
		            selected_dropdown_item = item;
		        }
		    }
		
		    // Remove highlighting from an item in the results dropdown
		    function deselectDropdownItem (item) {
		    	item.removeClass("input-img-selected-item");
		        selected_dropdown_item = null;
		    }
			
			function buildHtml(options,count){
				//build pro img
				var html = '' ;
				var type = options.type ;
				var title= ' title="'+(options.title||'')+'"' ;
				if(type == 'class'){
					html = '<i class=" '+options.src+'"></i>' ;
				}else if(type == 'img'){
					html = '<span '+title+' class="iis-'+count+' inputpro-img-span inputpro-img-span-img"><span><img align="absmiddle" src="'+options.src+'"/></span></span>' ;
				}else if(type == 'text'){
					html = '<i class=""> '+options.src+'</i>' ;
				}
				
				return '<span class="iis-'+count+' add-on btn button-reset">'+html+'</span>' ;
			}
			
			
			function enable(tgt){
				$(tgt).parent()
					.removeClass('ui-state-disabled')
					.find("input,span,img")
					.attr('disabled',false)
					.removeClass('inputpro-img-disabled') ;
			}
			
			function disable(tgt){
				$(tgt).parent()
					.addClass('ui-state-disabled')
					.find("input,span,img")
					.attr('disabled',true)
					.addClass('inputpro-img-disabled') ;
			}
			
			function show(tgt){
				$(tgt).parent().show() ;
			}
			
			function hide(tgt){
				$(tgt).parent().hide() ;
			}
		},
		
		/**
		 * 只能输入数字
		 */
		numberbox:function(options){
			var defaults = {
				min: null,
				max: null,
				precision: 0
			};
			
			options = options || {};
			return this.each(function(){
				var state = $.data(this, 'numberbox');
				if (state){
					$.extend(state.options, options);
				} else {
					$.data(this, 'numberbox', {
						options: $.extend({}, defaults, {
							min: (parseFloat($(this).attr('min')) || undefined),
							max: (parseFloat($(this).attr('max')) || undefined),
							precision: (parseInt($(this).attr('precision')) || undefined)
						}, options)
					});
					
					$(this).css({imeMode:"disabled"});//only ie firefox
				}
				
				bindEvents(this);
			});
			
			function fixValue(target){
				var opts = $.data(target, 'numberbox').options;
				var val = parseFloat($(target).val()).toFixed(opts.precision);
				if (isNaN(val)){
					$(target).val('');
					return;
				}
				
				if (opts.min && val < opts.min){
					$(target).val(opts.min.toFixed(opts.precision));
				} else if (opts.max && val > opts.max){
					$(target).val(opts.max.toFixed(opts.precision));
				} else {
					$(target).val(val);
				}
			}
			
			function bindEvents(target){
				$(target).unbind('.numberbox');
				$(target).bind('keypress.numberbox', function(e){
					if (e.which == 45){	//-
						return true;
					} if (e.which == 46) {	//.
						return true;
					}
					else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
						return true;
					} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
						return true;
					} else {
						return false;
					}
				}).bind('paste.numberbox', function(){
					if (window.clipboardData) {
						var s = clipboardData.getData('text');
						if (! /\D/.test(s)) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}).bind('dragenter.numberbox', function(){
					return false;
				}).bind('blur.numberbox', function(){
					fixValue(target);
				});
			}
		},excludeChar: function(options) {
			var defaults = {} ;
			options = $.extend(defaults,options) ;//exclude:''
			var exclude = options.exclude||'<>/' ;
			
			return $(this).each(function(){
				var state = $.data(this, 'inputformat');
				if (state){
					$.extend(state.options, options);
				} else {
					$.data(this, 'inputformat', {
						options: $.extend( {}, defaults, {}, options )
					});
				}
				var tgt = $(this) ;
				
				$(this).bind('keypress' , function(e){
					var realCode = String.fromCharCode( e.which ) ;
					if( exclude.indexOf(realCode)!=-1 )
						return false ;
					else
						return true ;
				} ).bind('paste',function(){
					var reg = new RegExp("[" + exclude + "]", "g");
					if(window.clipboardData){
						var tempValue = window.clipboardData.getData("Text");
						tgt.val( tempValue.replace(reg, "") ) ;
					}else{
						return false ;
					}
					
				}).bind('keyup',function(){
					var reg = new RegExp("[" + exclude + "]", "g");
					var tempValue = tgt.val() ;
					if (tempValue == tempValue.replace(reg, "")) {
						return false ;
					} else {
						tgt.val( tempValue.replace(reg, "") ) ;
					}
				});
			});
		}
	}); 
	
	$.inputInit = function(jqueryObj,json4Options){
		for(var i = 0;i < json4Options.length; i ++){
			if(json4Options[i].functionType == 'numberRange'){
				jqueryObj.numberbox(json4Options[i]);
			}
			else if(json4Options[i].functionType == 'excludeChar'){
					jqueryObj.excludeChar(json4Options[i]);
			}
			else{
				var _type = json4Options[i].imgSource;
				if(_type == undefined || _type == '' || _type == null){
					_type = 'class';
				}
				
				var _src = json4Options[i].src;
				if(_src == undefined || _src == '' || _src == null){
					_src = 'icon-search';
				}
				
				var _title = json4Options[i].title;
				if(_title == undefined || _title == '' || _title == null){
					_title = 'Please Select';
				}
				
				var json4Img = { 
					type:_type,
					src:_src,
					title:_title,
					event:{
						click:window[json4Options[i].click]
					}
				};
				
				jqueryObj.bingo_inputImg(json4Img);
			}
		}
	};
	
	$.fn.input = function(json_obj){
		var oinput = new inputWidget();
		oinput.init($(this),json_obj);
		return oinput;
	};
	
	inputWidget  = function(){
		this.$ = null;
		
		this.init = function(jquery_obj,json_obj){
			this.$ = jquery_obj;
			this.$.bingo_inputImg(json_obj);
		};
		
		this.enable = function(){
			this.$.bingo_inputImg("enable");
		};
		
		this.disable = function(){
			this.$.bingo_inputImg("disable");
		};
		
	    this.show = function(){
			this.$.bingo_inputImg('show');
		};
		
		this.hide = function(){
			this.$.bingo_inputImg('hide');
		};
		
		this.excludeChar = function(json){
			this.$.excludeChar(json);
		};
		
		this.numberBox = function(json){
			this.$.numberbox(json);
		};
	};
	
	// Really basic cache for the results
	Cache = function (options) {
	    var settings = $.extend({
	        max_size: 500
	    }, options);
	
	    var data = {};
	    var size = 0;
	
	    var flush = function () {
	        data = {};
	        size = 0;
	    };
	
	    this.add = function (query, results) {
	        if(size > settings.max_size) {
	            flush();
	        }
	
	        if(!data[query]) {
	            size += 1;
	        }
	
	        data[query] = results;
	    };
	
	    this.get = function (query) {
	        return data[query];
	    };
	};
	
	$.uiwidget.register("inputimg",function(selector){
		selector.each(function(){
			var self = $(this);
			var options = $(this).attr( $.uiwidget.options )||'{}' ;//target
			if(self.hasClass("inputpro-img-input")){
				return;
			}
			eval(" var jsonOptions = "+options) ;
			$(this).input(jsonOptions) ;
			var refInput=$(this).parent().next(":hidden");
			if(refInput.length>0){
				$(refInput).on("change",function(){
					if(self.data("fieldVal")==refInput.val()) return;
					var entityName=self.data("entity");
					var titleField=self.data("titleField");
					var refEntity=EntityUtil.getEntity(entityName,refInput.val());
					if(refEntity){
						self.val(refEntity[titleField]);
						self.data("fieldVal",refInput.val());
					}
				});
			}
		});
	});
	
	$.uiwidget.register("numberbox",function(selector){
		selector.each(function(){
			var options = $(this).attr( $.uiwidget.options )||'{}' ;//target
			eval(" var jsonOptions = "+options) ;
			$(this).numberbox(jsonOptions) ;
		});
	}) ;
	
	$.uiwidget.register("excludeChar",function(selector){
		selector.each(function(){
			var options = $(this).attr( $.uiwidget.options )||'{}' ;//target
			eval(" var jsonOptions = "+options) ;
			$(this).excludeChar(jsonOptions) ;
		});
	}) ;
})(jQuery);