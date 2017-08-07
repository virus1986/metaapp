var PlUploadUtil={
		initUpload:function(jqcontext,option, /* optional */ contextPath){
			contextPath = contextPath || Global.contextPath;
			var $$jqcontext;
			if(typeof jqcontext == "string"){
				context=document;
				$$jqcontext=$(jqcontext,context);
			}else if(jqcontext.domEle&&jqcontext.context){
				context=jqcontext.context;
				jqcontext=jqcontext.domEle;
				$$jqcontext=$(jqcontext,context);
			}else if(jqcontext.domEle){
				$$jqcontext=$(jqcontext.domEle);
			}else{
				$$jqcontext=$(jqcontext);
			}
			var settings=$.fn.extend(true,{
					runtimes : 'flash',
					max_file_size : '10mb',
					browse_button:null,
					container:null,
					chunk_size:'500kb',
					dragdrop:false,
					urlstream_upload:true,
					url : contextPath+'/ui/upload',
					resize : {width : 320, height : 240, quality : 90},
					flash_swf_url : contextPath+'/statics/scripts/plugins/plupload/plupload.flash.swf'
			},option);
			if(!option.filters) {
				settings.filters = [
					{title : "upload files",extensions : "*"}
				];
			}
			$$jqcontext.each(function(){
				var _self=$(this);
				var _id=$(this).attr("id");
				if (!_id) {
					_id = plupload.guid();
					$(this).attr('id', _id);
				}		
				//扩展browse_button,可以通过函数获取
				if(option && option.browse_button){					
					if($.isFunction(option.browse_button)){
						settings.browse_button=option.browse_button(_self);
					}
				}else{				
					settings.browse_button=_id;
				}
				
				//扩展container,可以通过函数获取
				if(option && option.container){					
					if($.isFunction(option.container)){
						settings.container=option.container(_self);
					}
				}else{				
					settings.container=_id;
				}
				
				var uploader = new plupload.Uploader(settings);
				
				uploader.bind('Init', function(up, params) {
					//alert(params.runtime);
				});
			
				uploader.bind('FilesAdded', function(up, files) {	
					if(settings.filesAdded){
						settings.filesAdded(up,files,_self);
					}					
					if(settings.autostart===true){
						setTimeout(function() {
							uploader.start();
						}, 10);
					}
				});
			
				uploader.bind('UploadProgress', function(up, file) {
					//alert(file.percent);
					if(settings.uploadProgress){
						settings.uploadProgress(up,file,_self);
					}	
				});
				uploader.bind('Error', function(up,err) {
					alert(i18n.t("error.uploadErrorInfo")+err.code+":"+err.message);
				});
			
				uploader.bind('FileUploaded', function(up, file,resp) {
					if(settings.fileUploaded){
						var data=$.parseJSON(resp.response);
						settings.fileUploaded(up,file,data,_self);
					}
				});
				uploader.init();
				$(this).data("uploader",uploader);
			});
		},		
		getUploader:function(domEle){
			var $obj=$(domEle);
			if($obj.length<0){
				return null;				
			}
			return $($obj.get(0)).data("uploader");
		}
};
$.uiwidget.register("photo",function(selector){
	var defaultImgPath=Global.statics+"images/100x100.gif";
	selector.each(function(){
		var _self=$(this);
		var _imgBtn=$("img.photoDisplay",_self);
		var _imgHidden=$("input.photoPath",_self);
		var _closeBtn=$("button.close",_self);
		if(_imgHidden&&_imgHidden.val()){
			var _fileSavePath=_imgHidden.val();
			var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
			_imgBtn.attr('src',Global.contextPath+'/ui/upload?action=download&filepath='+_filePath);
		}
		_closeBtn.click(function(){
			if(_imgHidden.val()){
				var _fileSavePath=_imgHidden.val();
				var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
				_imgBtn.attr('src',defaultImgPath);
				_imgHidden.val(null);
				$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+_filePath);
			}
		});
	});
	PlUploadUtil.initUpload(selector,{
		autostart:true,
		browse_button:function(container){
			return $("img",container).attr("id");
		},
		fileUploaded:function(up, file,resp,container){
			var filePath=resp.filePath;
			var fileName=file.name;
			var fileExtension=fileName.substring(fileName.lastIndexOf("."));
			$("img",container).attr("src",Global.contextPath+'/ui/upload?action=download&filepath='+filePath);
			$("input",container).val(filePath+"||"+fileName+"||"+fileExtension);
		}
	});
}) ;
$.uiwidget.register("upload",function(selector){
	var _maxSize = '10', _fileSuffix = '*';
	selector.each(function(){
		var _self=$(this);
		var _imgHidden=$("input",_self);
		var _progressBar=$(".progress div.bar",_self);
		_maxSize = _self.attr('data-maxSize');
		_fileSuffix = _self.attr('data-fileSuffix');
		if(_imgHidden&&_imgHidden.val()){
			var _fileSavePath=_imgHidden.val();
			var _filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
			var _fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
			_progressBar.html(_fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
			_progressBar.css({"width":"100%"});
			$(".icon-remove",_self).click(function(){
				_progressBar.html("");
				_progressBar.css({"width":"0%"});
				_imgHidden.val(null);
				$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+_filePath);
			});
			
		}
	});
	var fss = _fileSuffix.split(' ');
	var suffixs = [];
	for(var i in fss) {
		suffixs.push({title: fss[i], extensions: fss[i]});
	}
	PlUploadUtil.initUpload(selector,{
		filters: suffixs,
		max_file_size: _maxSize + 'mb', 
		autostart:true,
		browse_button:function(container){
			return $("div.uploadfile",container).attr("id");
		},
		fileUploaded:function(up, file,resp,container){
			var _progressBar=$(".progress div.bar",container);
			var filePath=resp.filePath;
			var fileName=file.name;
			var fileExtension=fileName.substring(fileName.lastIndexOf("."));
			var _imgHidden=$("input",container);
			_imgHidden.val(filePath+"||"+fileName+"||"+fileExtension);
			_progressBar.html(fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
			$(".icon-remove",container).click(function(){
				if(_imgHidden.val()){
					_progressBar.html("");
					_progressBar.css({"width":"0%"});
					_imgHidden.val(null);
					$.get(Global.contextPath+'/ui/upload?action=delete&filepath='+filePath);
				}
			});
			_imgHidden.trigger("FileUploaded",[up, file,resp,container]);
		},
		uploadProgress:function(up,file,container){
			var _progressBar=$(".progress div.bar",container);
			var percent=file.percent+"%";
			_progressBar.css({"width":percent});
		}
	});
}) ;
$.uiwidget.register("icon", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var $btn = selector.children("button:first");
		var size = {};
		size.width = $btn.data("width");
		size.height = $btn.data("height");
		$btn.selectIcon(function(url){
			if (url != null){
				if(selector.children("img").length == 0){
					$(selector).prepend($("<img>"));
				}
				selector.children("img:first").show().attr("src", Global.iconPath + url);
				selector.children("input[type=hidden]").val(url);
			}
		}, size);
	});
});

$.uiwidget.register("code", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var oldCode = selector.children("input[type=hidden]").val();
		if(oldCode !== ""){
			showCodePreviewBtn(selector, oldCode);
		}
		selector.children("button.code-edit").editCode(function(code){
			if (code != null){
				selector.children("input[type=hidden]").val(code);
				showCodePreviewBtn(selector, code);
			}
		}, i18n.t("code.edit"), oldCode);
	});
});

$.uiwidget.register("openLink", function(selectors){
	selectors.each(function(){
		var $ts = $(this);
		var opt = {
			url: $ts.attr('data-url') || $ts.attr('href') || '',
			showType: $ts.attr('data-showType') || 'pop-up',
			data: JSON.parse($ts.attr('data-data') || null),
			callback: eval($ts.attr('data-callback'))
		};
		if(!opt.url) {
			consolelog('No data-url attribute found! Stop binding open link...');
		}
		$ts.click(function() {
			$.openLink(opt.url, {
				data: opt.data,
				showType: opt.showType
			}, $.isFunction(opt.callback)?opt.callback : null);
		});
	});
});

$.uiwidget.register("cascade", function($selectors){
	var chain = [],
		context = null,
		dataParent = 'data-parentField',
		insertFirstEmptyValueOption = true,
		handleUnusedChild = 'disable';//can be 'hide', 'disable', 'none'
	var first = true;
	var action=null;
	// [{"name": "北京市","value": "beijing","description": null,"childs": [],"default": false}]
	function getOptionset($selector) {
		return JSON.parse($selector.attr('data-optionset'));
	};
	function getChildOptionSet(optionset,parentValue){
		parentValue=parentValue||[];
		var len=parentValue.length;
		var _optionset=[];
		var value=parentValue[len-1];
		$.each(optionset,function(i,v){
			if(value===v.value){
				_optionset= v.childs;
				if(len===1){
					return false;
				}
				parentValue=parentValue.slice(0,len-1);
				_optionset=getChildOptionSet(_optionset,parentValue);
				return false;
			}
		});
		return _optionset;
	};
	
	function getOptionsThrough($this) {
		var parentName = $this.attr(dataParent);
		if(parentName) {//parentName非空
			var $parent = $('[name=' + parentName + ']', context);
			chain.push($parent.val());//chain用来记录所有父的级联字段的optionsetvalue
			return getOptionsThrough($parent);//递归直到最高层的节点
		} else {//parentName为空，表示已到最高层的节点
			var toppestParent=$this;//
			var optionset = getOptionset(toppestParent), options = [], length = chain.length;
			if(length>0){//chain如果不为空，表示当前级联控件不是最高层父节点
				optionset=getChildOptionSet(optionset,chain);
			}
			$.each(optionset,function(i,v){
				options.push({name: v.name, value: v.value});
			});
			return options;
		}
	};
	function getOptions($this) {
		chain = [];
		return getOptionsThrough($this);
	};
	function renderOptions($select, options) {
		$select.empty();
		if(null == options) {
			$select.trigger("change");
			return;
		}
		if(insertFirstEmptyValueOption) {
			$('<option></option>').text(i18n.t("common.select")).val('').appendTo($select);
		}
		$.each(options, function(){
			var option = this, $option = $('<option></option>');
			$option.val(option.value).text(option.name).appendTo($select);
		});
		$select.trigger("change");
	};
	function handleChild(hasChild, $child) {
		if(!handleUnusedChild) handleUnusedChild = 'none';
		switch(handleUnusedChild) {
			case 'hide': 
				if(hasChild) $child.show();
				else $child.hide();
				break;
			case 'disable': 
				if(hasChild) $child.attr('disabled', false);
				else $child.attr('disabled', 'true').empty();
				break;
			case 'none': 
				if(!hasChild) $child.empty();
				break;
			default: consolelog('No such way to handle unused child:' + handleUnusedChild);
		}
	};
	//数据源为实体的子字段数据获取
	function getAndSetSourceIsEntityChildDataOptions($child){
		var lookupValue=$child.attr("data-lookup-value");
		var parentField=$child.attr("data-parentField");
		//var parentDom=$("[name='"+parentField+"']",context);
		var parentLookupValue=$("[name='"+parentField+"']",context).attr("data-lookup-value");
		var parentValue=$("[name='"+parentField+"']",context).val();
		var url=Global.contextPath+"/metadata/field/getSourceIsEntityChildDataOptions";
		url=Urls.urlParam(url,[{key:'sourceEntity',value:lookupValue},{key:'targetEntity',value:parentLookupValue},{key:'targetEntityPKValue',value:parentValue}]);
		$.restGet(url,function(resp){
			//consolelog(resp);
			if(resp){
				var options=[];
				for(var i=0;i<resp.length;++i){
					var ele=resp[i];
					options.push({name:ele.name,value:ele.value});
				}
				renderOptions($child,options);
				if(options.length<1){
					handleChild(false, $child);
				}
			}
		},{async:false});
	};
	//按从高到低层级排序
	var $selectorsOrdered=[];
	function orderTop($childField){
		var len=$childField.length;
		for(var i=0;i<len;++i){
			var childFieldEle=$childField[i];
			var childName=$(childFieldEle).attr("name");
			$selectorsOrdered.push($(childFieldEle));
			var _$childField=$('[' + dataParent + '=' + childName + ']', context);
			if(_$childField.length>0){
				orderTop(_$childField);
			}
		}
	};
	$selectors.each(function(){
		var $selector = $(this);
		var parentField = $selector.attr(dataParent);
		action=$selector.attr("data-action");
		var name=$selector.attr("name");
		if(!parentField) {//最高层
			$selectorsOrdered.push($selector);
			if(!context) context = $selector.attr('data-context') || 'body';
			var $childField = $('[' + dataParent + '=' + name + ']', context);
			if($childField.length>0){
				orderTop($childField);
			}
		}
	});
	var toppestFieldValue=null;
	$.each($selectorsOrdered,function(){
		var $selector = $(this), fieldName = $selector.attr('name');
		if(!context) context = $selector.attr('data-context') || 'body';
		var parentField = $selector.attr(dataParent);
		var $childField = $('[' + dataParent + '=' + fieldName + ']', context);
		if(!parentField) {//最高层父级联字段对应控件渲染
			handleUnusedChild = $selector.attr('data-handleUnusedChild') || handleUnusedChild;
			var options = getOptions($selector);
			renderOptions($selector, options);
			toppestFieldValue=$(this).attr('data-value');
			if(toppestFieldValue){
				$(this).val(toppestFieldValue);
			}
		}
		if($childField.length > 0) {
			$selector.change(function(){//如果有子级联字段，绑定父级联控件的值change事件，激发子级联控件重新设值
				$childField.each(function(){
					var $child = $(this), options = getOptions($child);
					var lookupValue=$child.attr("data-lookup-value");
					if(first) {
						if(toppestFieldValue){
							handleChild(true, $child);
							if(lookupValue){
								getAndSetSourceIsEntityChildDataOptions($child);
							}else{
								renderOptions($child, options);	
							}
							var _dataValue=$child.attr('data-value');
							$child.val(_dataValue);
						}else{
							handleChild(false, $child);
						}
						return;
					}
					handleChild(true, $child);
					if(lookupValue){
						getAndSetSourceIsEntityChildDataOptions($child);
					}else if(options && options.length > 0){
						renderOptions($child, options);	
					}else {
						handleChild(false, $child);
						$child.change();
					}
				});
			});
		}
	});
	$.each($selectorsOrdered,function(){
		$(this).change();
	});
	first = false;
	if(action=="view"){
		$.each($selectorsOrdered,function(){
			var value=$(this).find("option:checked").text();
			$(this).after(value).hide();
		});
	}
});

$.uiwidget.register("tip", function(selectors){
	selectors.each(function(){
		var selector = $(this);
		var options = {
				trigger: 'hover',
				title: selector.attr('data-title') || i18n.t("common.ui.tip.title"),
				content: selector.attr('data-content') || i18n.t("common.ui.tip.content"),
				html: selector.attr('data-usehtml') || false
		};
		selector.popover(options);
	});
});

$.uiwidget.register("addition", function(selectors){
	selectors.each(function(){
		var $ts = $(this), list = [];
		var value = $ts.attr('data-value');
		var showField = $ts.attr('data-showField');
		var showInput = $ts.attr('data-showInput');
		var order = $ts.attr('data-formOrder');
		if(value && showField) {
			var $itemTmpl = $('.js-item', $ts);
			var list = JSON.parse(value);
			if(list && list.length) {
				for(var i = 0; i < list.length; i++) {
					var itemObj = list[i];
					var $item = $itemTmpl.clone().removeClass('hide');
					if(showField.indexOf('id') != -1 && itemObj.id) $item.find('.js-title').attr('data-id', itemObj.id);
					if(showField.indexOf('url') != -1 && itemObj.url) {
						(function(){
							var u = itemObj.url.replace('~', Global.contextPath);
							$item.find('.js-title').click(function() {
								$.openLink(u, null, function() {});
								return false;
							});
						})();
					}
					if(showField.indexOf('time') != -1 && itemObj.time) {
						var date = new Date(itemObj.time), dateStr = "";
						if(date) {
							dateStr = date.getFullYear() + i18n.t("common.date.year") + (date.getMonth() + 1) + i18n.t("common.date.month") + date.getDate()
								+ i18n.t("common.date.day") +' ' + date.getHours() + ':' + date.getMinutes();
						} else dateStr = itemObj.time;
						$item.find('.js-title').text(dateStr);
					}
					if(showField.indexOf('createdBy') != -1 && itemObj.createdBy) {
						$item.find('.js-title').append('&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;'
								+ (itemObj.createdBy));
					}
					if(showField.indexOf('content') != -1 && itemObj.content) $item.find('.js-content').text(itemObj.content);
					(order == 'asc')? $ts.prepend($item) : $ts.append($item);
				}
				$('.js-collapse', $ts).collapser({
					changeText: 0,
					target: 'next',
					effect: 'fade'
				});
			}
		} else {
			$ts.hide();
		}

		var $hide = $ts.next(), $text = $hide.next();
		if(showInput && (showInput === true || showInput == 'true' || showInput == '1' || showInput == 1)) {
			$text.blur(function() {
				var $t = $(this), val = $t.val();
				if(!$.trim(val)) return;
				list.push({time: new Date(), content: val});
				$hide.val(JSON.stringify(list));
			});
		} else {
			$text.hide();
		}
	});
});
$.uiwidget.register("ui-slave-table",function(selectors){
	selectors.each(function(){
		var self=$(this);
		if(self.prop("tagName").toLowerCase()!=="table"){
			return;
		}
		var _optionsJson=self.data("options")||"{}";
		eval(" var _options = "+_optionsJson) ;
		var _genRow=self.data("gen-row");
		var options={
				addRowCSS : "addRow",
				delRowCSS : "delRow",
				oddRowCSS : "ui-list-content-odd",
				evenRowCSS : "ui-list-content-even",
				genRow : _genRow,
				inputBoxAutoNumber : true,
				onDrop : function(table, row) {
				},
				addCallBack : function(row, table) {
					self.dialogResize();
					$(row).uiwidget();
				},
				deleteCallBack : function(row, table) {
					self.dialogResize();
				}
		};
		self.tableDnD($.extend(options,_options));
	});
});