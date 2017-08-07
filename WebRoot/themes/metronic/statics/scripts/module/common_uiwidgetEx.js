;(function($){
	var uploadUrls=Urls.uploadUrls();
	var fsUploadPath=uploadUrls.fsUploadPath;
	var fsDownloadPath=uploadUrls.fsDownloadPath;
	var fsDeletePath=uploadUrls.fsDeletePath;
	var diskUploadPath=uploadUrls.diskUploadPath;
	var diskDownloadPath=uploadUrls.diskDownloadPath;
	var diskDeletePath=uploadUrls.diskDeletePath;
	var fileNameSpecials=UploadUtils.fileNameSpecials;
	var fileNameSpecialsInfo=UploadUtils.fileNameSpecialsInfo;
	window.PlUploadUtil={
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
				
				var entityName 	= $$jqcontext.attr("entityName");
				var entityId      	= $$jqcontext.attr("entityId") ;
				var field 			= $$jqcontext.attr("field") ;
				
				var _uploadUrl=fsUploadPath+"";
				if( entityName && entityId && field ){
					_uploadUrl=Urls.urlParam(_uploadUrl,[{key:"entity",value:entityName},{key:"field",value:field},{key:"entityId",value:entityId}]);
				}
				if(option.isUsedisk){
					_uploadUrl=Urls.appendParam(_uploadUrl,"usedisk",1);
				}
				var uploaderRuntimes='html5,flash,silverlight,html4';
				/*if(CommonUtil.isIE()){
					uploaderRuntimes='flash,silverlight,html4'
				}*/
				var settings=$.fn.extend(true,{
						runtimes : uploaderRuntimes,
						max_file_size : '10mb',
						browse_button:null,
						container:$$jqcontext,
						dragdrop:false,
						urlstream_upload:true,
						url : _uploadUrl,
						//flash_swf_url : Global.contextPath+'/statics/scripts/plugins/plupload2/plupload.flash.swf'
						flash_swf_url : Global.contextPath+'/statics/scripts/plugins/plupload2/Moxie.swf',
						silverlight_xap_url :Global.contextPath+'/statics/scripts/plugins/plupload2/Moxie.xap'
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
						var stop=false;
						plupload.each(files, function(file) {
							while(fileNameSpecials.exec(file.name) != null) {
								stop=true;
								jQuery.messageBox.info({message:fileNameSpecialsInfo});
								return false;
							}
						});
						if(stop){
							return;
						}
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
						if(err.code=="-601"){
							alert("文件类型错误，请选择"+up.settings.filters.mime_types[0].extensions+"文件");
						} else if(err.code=="-600"){
							alert("文件大小超出，请上传小于"+option.max_file_size+"的。");
						} else{
							if(err.status=="500"||err.status==500){
								alert("请检查上传服务器是否正常："+err.code+":"+err.message);
							}else{
								alert(i18n.t("error.uploadErrorInfo")+err.code+":"+err.message);
							}
						}
					});
				
					uploader.bind('FileUploaded', function(up, file,resp) {
						if(settings.fileUploaded){
							var data=$.parseJSON(resp.response);
							settings.fileUploaded(up,file,data,_self);
						}
					});
					uploader.init();
					window.setTimeout(function(){
						  uploader.refresh();
						}, 100);
					$(this).data("uploader",uploader);
				});
			},		
			initMultiUpload:function(jqcontext,option,_uiOptions,contextPath){
				var uiOptions=null;
				var isDisk=false;
				if(_uiOptions){
					uiOptions=_uiOptions;
					isDisk=_uiOptions.isDisk||false;
				}else{
					return false;
				}
				
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
				
				var entityName 	= $$jqcontext.attr("entityName");
				var entityId      	= $$jqcontext.attr("entityId") ;
				var field 			= $$jqcontext.attr("field") ;
				
				var _uploadUrl=fsUploadPath+"";
				if( entityName && entityId && field ){
					_uploadUrl=Urls.urlParam(_uploadUrl,[{key:"entity",value:entityName},{key:"field",value:field},{key:"entityId",value:entityId}]);
				}
				var uploaderRuntimes='html5,flash,silverlight,html4';
				/*if(CommonUtil.isIE()){
					uploaderRuntimes='flash,silverlight,html4'
				}*/
				var settings=$.fn.extend(true,{
					runtimes : uploaderRuntimes,
					max_file_size : '100mb',
					browse_button:null,
					container:null,
					dragdrop:false,
					urlstream_upload:true,
					url : _uploadUrl,
					flash_swf_url : Global.contextPath+'/statics/scripts/plugins/plupload2/Moxie.swf',
					silverlight_xap_url :Global.contextPath+'/statics/scripts/plugins/plupload2/Moxie.xap'
				},option);
				if(!option.filters) {
					settings.filters = [
					                    {title : "upload files",extensions : "*"}
					                    ];
				}
				$$jqcontext.each(function(){
					var _self=$(this);
					var context=_self;
					var $addBrowseButton=_self.find(uiOptions.addBrowseButton);
					var attachmentCon=_self.find(uiOptions.addCon);
					var _inputHidden=$(_uiOptions.inputHidden,context);
					var _id=$addBrowseButton.attr("id");
					var files={};
					function getFiles(){
						var fs=[];
						jQuery.each(files,function(i,file){
							fs.push(file);
						});
						return JSON.stringify(fs);
					};
					_self.on("addFiles",function(e){
						var _files=e.files;
						jQuery.each(_files,function(i,file){
							var filePath=file.filePath;
							if(!files[filePath]){
								files[filePath]=file;
								var $item;
								if($.isFunction(_uiOptions.addTmplFunc)){
									$item=$(_uiOptions.addTmplFunc(file));
								}
								var dpath=Urls.urlParam(fsDownloadPath,[{key:"filepath",value:filePath},{key:"name",value:file.name},{key:"fileId",value:file.diskId||""}]);
								$("img.photoDisplay",$item).attr("src",dpath);
								$("a.file-desc",$item).attr("href",dpath);
								attachmentCon.append($item);
							}
						});
						_inputHidden.val(getFiles());
					});
					
					var fileHas=_inputHidden.val();
					var fileHasArray=[];
					if(fileHas){
						if(fileHas.startWith("[")){
							fileHasArray=JSON.parse(fileHas);
							jQuery.each(fileHasArray,function(i,f){
								var key=null;
								if(isDisk){
									key=f.diskId;
								}else{
									key=f.filePath;
								}
								files[key]=f;
							});
						}
					}
					var innerContext={
							files:files,
							inputHidden:_inputHidden,
							context:context,
							getFiles:getFiles
					};
					settings.browse_button=_id;
					settings.container=($addBrowseButton.parent())[0];
					settings.drop_element=attachmentCon.attr("id");
					settings.init={
						FilesAdded: function(up, files) {
							var stop=false;
							plupload.each(files, function(file) {
								while(fileNameSpecials.exec(file.name) != null) {
									stop=true;
									jQuery.messageBox.info({message:fileNameSpecialsInfo});
									return false;
								}
								var item;
								if($.isFunction(_uiOptions.addTmplFunc)){
									item=_uiOptions.addTmplFunc(file);
								}
								attachmentCon.append($(item));
							});
							if(stop){
								return;
							}
							setTimeout(function() {
								uploader.start();
							}, 10);
						},
						fileUploaded:function(up, file,resp,container){
							if(jQuery.isFunction(option.fileUploaded)){
								option.fileUploaded(up, file,resp,container,innerContext);
								return;
							}
							var respObj=$.parseJSON(resp.response);
							resp=respObj;
							var success=resp.success||resp.isOk;
							if(!success){
								jQuery.messageBox.error({message:resp.message||"Please check the upload server,upload failed."});
								return false;
							}
							var filePath=resp.filePath;
							var fileName=file.name;
							var fileExtension=fileName.substring(fileName.lastIndexOf("."));
							var url=filePath+"||"+fileName+"||"+fileExtension;
							var filesItem={filePath:filePath,name:fileName,extension:fileExtension};
							files[filePath]=filesItem;
							_inputHidden.val(getFiles());
							var downloadUrl=fsDownloadPath+"";
							var _url=Urls.appendParam(downloadUrl,"filepath",filePath);
							_url=Urls.appendParam(_url,"filename",fileName);
							var __context=$("#"+file.id,context);
							if($.isFunction(_uiOptions.fileUploadedFunc)){
								_uiOptions.fileUploadedFunc(__context,_url,filePath);
							}
							__context.data("url",filePath);
						},
						UploadProgress: function(up, file) {
							$("#"+file.id,context).find('b').html('<span>' + file.percent + "%</span>");
						},

						Error: function(up, err) {
							if(err.code=="-601"){
								alert("文件类型错误，请选择"+up.settings.filters.mime_types[0].extensions+"文件");
							} else if(err.code=="-600"){
								alert("文件大小超出，请上传小于"+option.max_file_size+"的。");
							} else{
								if(err.status=="500"||err.status==500){
									alert("请检查上传服务器是否正常："+err.code+":"+err.message);
								}else{
									alert(i18n.t("error.uploadErrorInfo")+err.code+":"+err.message);
								}
							}
						}
					};
					
					var uploader = new plupload.Uploader(settings);

					uploader.init();
					var deleteCallback=function(e,innerContext){
						var row=$(this).parent();
						var filePath=row.data("url");
						delete files[filePath];
						_inputHidden.val(getFiles());
						row.remove();
						var deleteUrl=fsDeletePath+'&filepath=';
						$.get(deleteUrl+filePath);
						return false;
					}
					if(jQuery.isFunction(option.deleteCallback)){
						deleteCallback=option.deleteCallback;
					}
					$(attachmentCon).on("click",_uiOptions.removeButton,function(e){
						deleteCallback.call(this,e,innerContext);
					});
					
					window.setTimeout(function(){
						uploader.refresh();
					}, 100);
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
		var _maxSize = '10mb';
		selector.each(function(){
			var _self=$(this);
			var usedisk=_self.attr('data-usedisk');
			var isUsedisk=false;
			if(usedisk==="true"||usedisk==="1"){
				isUsedisk=true;
			}
			var _imgBtn=$("img.photoDisplay",_self);
			var _imgHidden=$("input.photoPath",_self);
			var _closeBtn=$("button.close",_self);
			_maxSize = _self.attr('data-maxSize');
			var _fileSavePath=_imgHidden.val(),fileJson=null,_filePath=null,_diskId="",_fileName=null;
			if(_fileSavePath){
				if(_fileSavePath.startWith("[")){
					fileJson=JSON.parse(_fileSavePath)[0];
					_filePath=fileJson.filePath||"";
					_diskId=fileJson.diskId||"";
					_fileName=fileJson.name||"";
				}else{
					_filePath = _fileSavePath;
					if(_fileSavePath.indexOf("||")>0){
						_filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
						_fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
					}
				}
			}
			if(_filePath){
				var dpath=Urls.urlParam(fsDownloadPath,[{key:"filepath",value:_filePath},{key:"name",value:_fileName},{key:"fileId",value:_diskId}]);
				_imgBtn.attr('src',dpath);
			}
			_closeBtn.click(function(){
				if(_filePath){
					_imgBtn.attr('src',defaultImgPath);
					_imgHidden.val(null);
					$.get(fsDeletePath+'&filepath='+_filePath);
				}
			});
			PlUploadUtil.initUpload(_self,{
				isUsedisk:isUsedisk,
				autostart:true,
				max_file_size: _maxSize, 
				browse_button:function(container){
					$("img",container).attr("id",plupload.guid());
					return $("img",container).attr("id");
				},
				fileUploaded:function(up, file,resp,container){
					var success=resp.success||resp.isOk;
					if(!success){
						jQuery.messageBox.error({message:resp.message||"Please check the upload server,upload failed."});
						return false;
					}
					var filePath=resp.filePath||resp.realPath;
					var diskId=resp.diskId||'';
					var fileName=file.name;
					var extension=fileName.substring(fileName.lastIndexOf("."));
					var dpath=Urls.urlParam(fsDownloadPath,[{key:"filepath",value:filePath},{key:"name",value:fileName}]);

					var fileItemValue="";					
					if(diskId){
						dpath=Urls.appendParam(dpath,"fileId",diskId);
						var fileItem={filePath:filePath,extension:extension,name:fileName};
						fileItem.diskId=diskId;
						fileItemValue=JSON.stringify([fileItem]);
					}else{
						fileItemValue=filePath+"||"+fileName+"||"+extension;
					}
					
					$("img",container).attr("src",dpath);
					$("input.photoPath",container).val(fileItemValue);
					container.trigger("PhotoUploaded",[up, file,resp,container]);
				}
			});
		});
	}) ;
	$.uiwidget.register("multiPhoto",function(selector){
		var defaultImgPath=Global.statics+"images/100x100.gif";
		var _maxSize = '10';
		var filters={
			  mime_types : [
			                { title : "图片文件[jpg,gif,png]", extensions : "jpg,gif,png,JPG,GIF,PNG" },
			              ]
			            };
		selector.each(function(){
			var _self=$(this);
			PlUploadUtil.initMultiUpload(selector,{
				filters: filters,
				max_file_size: _maxSize + 'mb', 
				autostart:true
			},{
				addBrowseButton:".addBrowseButton",
				addCon:".photo-con",
				inputHidden:"input.photoPath",
				removeButton:".photo-item button.close",
				addTmplFunc:function(file){
					return '<div class="photo-item" id="' + file.id + '"><button type="button" class="close" style="z-index:20;top:5px;right:5px;position:absolute;padding:2px 2px;line-height:10px;" ></button><img style="width:100px;height:100px;" class="photoDisplay"/><b></b></div>';
				},
				fileUploadedFunc:function(__context,__url){
					__context.find("img.photoDisplay").attr("src",__url);
				}
			});
		});
	}) ;
	$.fn.chooseDiskFile=function(settings,callback){
		var _self=$(this);
		settings=settings||{};
		var extension=settings.extension||'0';
		var mode=settings.mode||'single';
		var upload=settings.upload||'0';
		_self.click(function(){
			var url=Global.contextPath+"/home/common/chooseDiskFile";
			url=Urls.urlParam(url,[{key:"extension",value:extension},{key:"mode",value:mode},{key:"upload",value:upload}]);
			jQuery.openLink(url,function(_files){
				if($.isFunction(callback)){
					callback(_files);
				}
			});
			return false;
		});
	};
	$.uiwidget.register("diskMultiPhoto",function(selector){
		var defaultImgPath=Global.statics+"images/100x100.gif";
		var _maxSize = '10';
		var filters={
				  mime_types : [
				                { title : "图片文件[jpg,gif,png]", extensions : "jpg,gif,png,JPG,GIF,PNG" },
				              ]
				            };
		selector.each(function(){
			var _self=$(this);
			var _diskBrowseBtn=_self.find(".addBrowseFromDiskButton");
			_diskBrowseBtn.chooseDiskFile({extension:"1",mode:"multiple"},function(_files){
				if(!_files){
					return false;
				}
				var files=[];
				jQuery.each(_files,function(i,f){
					var filesItem={diskId:f.diskId||'',name:f.name,filePath:f.path,size:f.size,id:plupload.guid()};
					files.push(filesItem);
				});
				_self.trigger({type:"addFiles",files:files});
			});
			PlUploadUtil.initMultiUpload(selector,{
				filters: filters,
				max_file_size: _maxSize + 'mb', 
				autostart:true,
				url:diskUploadPath+"",
				fileUploaded:function(up, file,resp,container,innerContext){
					var respObj=$.parseJSON(resp.response);
					resp=respObj;
					var success=resp.success||resp.isOk;
					if(!success){
						jQuery.messageBox.error({message:resp.message||"Please check the upload server,upload failed."});
						return false;
					}
					var realPath=resp.realPath;
					var fileName=file.name;
					var _inputHidden=innerContext.inputHidden;
					var files=innerContext.files;
					var context=innerContext.context;
					var fileId=resp.diskId||'';
					var filesItem={diskId:fileId,name:fileName,size:file.size,filePath:realPath};
					files[fileId]=filesItem;
					_inputHidden.val(innerContext.getFiles());
					var downloadUrl=diskDownloadPath+"";
					var _url=Urls.appendParam(downloadUrl,"fileId",fileId);
					_url=Urls.appendParam(_url,"name",fileName);
					var __context=$("#"+file.id,context);
					__context.attr("diskid",fileId);
					__context.attr("filepath",realPath);
					__context.find("img.photoDisplay").attr("src",_url);
				},
				deleteCallback:function(e,innerContext){
					var row=$(this).parent();
					var diskId=row.attr("diskid");
					var filePath=row.attr("filepath");
					delete innerContext.files[diskId];
					innerContext.inputHidden.val(innerContext.getFiles());
					row.remove();
					if(filePath){
						var deleteUrl=Urls.appendParam(diskDeletePath,"filepath",filePath);
						$.get(deleteUrl);
					}
					return false;
				}
			},{
				isDisk:true,
				addBrowseButton:".addBrowseButton",
				addCon:".photo-con",
				inputHidden:"input.photoPath",
				removeButton:".photo-item button.close",
				addTmplFunc:function(file){
					return '<div class="photo-item" id="' + file.id + '"><button type="button" class="close" style="z-index:20;top:5px;right:5px;position:absolute;padding:2px 2px;line-height:10px;" ></button><img style="width:100px;height:100px;" class="photoDisplay"/><b></b></div>';
				}
			});
		});
	}) ;
	$.uiwidget.register("upload",function(selector){
		var _maxSize = '10', _fileSuffix = '*';
		selector.each(function(){
			var _self=$(this);
			var _imgHidden=$("input.value-input",_self);
			var _progressBar=$(".progress div.bar",_self);
			_maxSize = _self.attr('data-maxSize');
			_fileSuffix = _self.attr('data-fileSuffix');
			var usedisk=_self.attr('data-usedisk');
			var isUsedisk=false;
			if(usedisk==="true"||usedisk==="1"){
				isUsedisk=true;
			}
			var _fileSavePath=_imgHidden.val(),fileJson=null,_filePath=null,_diskId=null,_fileName=null;
			if(_fileSavePath){
				if(_fileSavePath.startWith("[")){
					fileJson=JSON.parse(_fileSavePath)[0];
					_filePath=fileJson.filePath||"";
					_diskId=fileJson.diskId||"";
					_fileName=fileJson.name||"";
				}else{
					_filePath=_fileSavePath.substring(0,_fileSavePath.indexOf("||"));
					_fileName=_fileSavePath.substring(_fileSavePath.indexOf("||")+2,_fileSavePath.lastIndexOf("||"));
				}
			}
			if(_filePath){
				_progressBar.html(_fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
				_progressBar.css({"width":"100%"});
				$(".icon-remove",_self).click(function(){
					_progressBar.html("");
					_progressBar.css({"width":"0%"});
					_imgHidden.val(null);
					$.get(fsDeletePath+'&filepath='+_filePath);
				});
				
			}
			var fss = _fileSuffix.split(' ');
			var suffixs = [];
			for(var i in fss) {
				suffixs.push({title: fss[i], extensions: fss[i]});
			}
			PlUploadUtil.initUpload(_self,{
				isUsedisk:isUsedisk,
				filters: suffixs,
				max_file_size: _maxSize + 'mb', 
				autostart:true,
				browse_button:function(container){
					$(".uploadfile",container).attr("id",plupload.guid());
					return $(".uploadfile",container).attr("id");
				},
				fileUploaded:function(up, file,resp,container){
					var _progressBar=$(".progress div.bar",container);
					var success=resp.success||resp.isOk;
					if(!success){
						jQuery.messageBox.error({message:resp.message||"Please check the upload server,upload failed."});
						return false;
					}
					var filePath=resp.filePath||resp.realPath;
					var diskId=resp.diskId||'';
					var fileName=file.name;
					var extension=fileName.substring(fileName.lastIndexOf("."));
					var _imgHidden=$("input.value-input",container);
					var fileItem={filePath:filePath,extension:extension,name:fileName};
					if(diskId){
						fileItem.diskId=diskId;
						var fileItemJson=JSON.stringify([fileItem]);
						_imgHidden.val(fileItemJson);
					}else{
						var fileItemValue=filePath+"||"+fileName+"||"+extension;
						_imgHidden.val(fileItemValue);
					}
					_progressBar.html(fileName+"<i class='icon-remove' style='position:absolute;bottom:1px;right:1px;z-index:999999;'></i>");
					$(".icon-remove",container).click(function(){
						if(_imgHidden.val()){
							_progressBar.html("");
							_progressBar.css({"width":"0%"});
							_imgHidden.val(null);
							if(filePath){
								$.get(fsDeletePath+'&filepath='+filePath);
							}
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
		});
	}) ;
	$.uiwidget.register("multiUpload",function(selector){
		var _maxSize = '10', _fileSuffix = '*';
		selector.each(function(){
			var _self=$(this);
			var fss = _fileSuffix.split(' ');
			var suffixs = [];
			for(var i in fss) {
				suffixs.push({title: fss[i], extensions: fss[i]});
			}
			PlUploadUtil.initMultiUpload(_self,{
				filters: suffixs,
				max_file_size: _maxSize + 'mb', 
				autostart:true
			},{
				addBrowseButton:".addBrowseButton",
				addCon:".attachment-con",
				inputHidden:"input.value-input",
				removeButton:".icon-remove",
				addTmplFunc:function(file){
					return '<div class="attachement-item" id="' + file.id + '"><a target="_blank" class="file-desc">'+file.name+'</a> (' + plupload.formatSize(file.size) + ') <b></b><a href="javascript://" class="icon-remove">删除</a></div>';
				},
				fileUploadedFunc:function(__context,__url){
					__context.find("a.file-desc").attr("href",__url);
				}
			});
		});
	});
	$.uiwidget.register("diskMultiUpload",function(selector){
		var _maxSize = '10', _fileSuffix = '*';
		selector.each(function(){
			var _self=$(this);
			var _diskBrowseBtn=_self.find(".addBrowseFromDiskButton");
			_diskBrowseBtn.chooseDiskFile({extension:"0",mode:"multiple"},function(_files){
				if(!_files){
					return false;
				}
				var files=[];
				jQuery.each(_files,function(i,f){
					var filesItem={diskId:f.diskId||'',name:f.name,filePath:f.path,size:f.size,id:plupload.guid()};
					files.push(filesItem);
				});
				_self.trigger({type:"addFiles",files:files});
			});
			var fss = _fileSuffix.split(' ');
			var suffixs = [];
			for(var i in fss) {
				suffixs.push({title: fss[i], extensions: fss[i]});
			}
			PlUploadUtil.initMultiUpload(_self,{
				filters: suffixs,
				max_file_size: _maxSize + 'mb', 
				autostart:true,
				url:diskUploadPath+"",
				fileUploaded:function(up, file,resp,container,innerContext){
					var respObj=$.parseJSON(resp.response);
					resp=respObj;
					var success=resp.success||resp.isOk;
					if(!success){
						jQuery.messageBox.error({message:resp.message||"Please check the upload server,upload failed."});
						return false;
					}
					var realPath=resp.realPath;
					var fileName=file.name;
					var _inputHidden=innerContext.inputHidden;
					var context=innerContext.context;
					var files=innerContext.files;
					var fileId=resp.diskId||'';
					var filesItem={diskId:fileId,name:fileName,size:file.size,filePath:realPath};
					files[fileId]=filesItem;
					_inputHidden.val(innerContext.getFiles());
					var downloadUrl=diskDownloadPath+"";
					var _url=Urls.appendParam(downloadUrl,"fileId",fileId);
					_url=Urls.appendParam(_url,"name",fileName);
					var __context=$("#"+file.id,context);
					__context.attr("diskid",fileId);
					__context.attr("filepath",realPath);
					__context.find("a.file-desc").attr("href",_url);
				},
				deleteCallback:function(e,innerContext){
					var row=$(this).parent();
					var diskId=row.attr("diskid");
					var filePath=row.attr("filepath");
					delete innerContext.files[diskId];
					innerContext.inputHidden.val(innerContext.getFiles());
					row.remove();
					if(filePath){
						var deleteUrl=Urls.appendParam(diskDeletePath,"filepath",filePath);
						$.get(deleteUrl);
					}
					return false;
				}
			},{
				isDisk:true,
				addBrowseButton:".addBrowseButton",
				addCon:".attachment-con",
				inputHidden:"input.value-input",
				removeButton:".icon-remove",
				addTmplFunc:function(file){
					return '<div class="attachement-item" id="' + file.id + '"><a target="_blank" class="file-desc">'+file.name+'</a> (' + plupload.formatSize(file.size) + ') <b></b><a href="javascript://" class="icon-remove">删除</a></div>';
				}
			});
		});
	});
	$.uiwidget.register("icon", function(selectors){
		selectors.each(function(){
			var selector = $(this);
			var width = selector.data("width");
			var height = selector.data("height");
			var setNames=selector.data("setnames");
			var title = i18n.t("common.select");
			if(width!=null || height!=null){
				title = title + " " +i18n.t("icon.desc",width,height);
			}else{
				title = title + i18n.t("icon.title");
			}
			$(".btn-select",selector).off("click");
			$(".btn-select",selector).click(function(){			
				$.openLink(Global.contextPath + "/icon/icon_select", 
					{data : {width:width,height:height,names:setNames},width :600,	height: 400,title : title,	requestType : "GET"},
					function(url) {
						if(!url) return;
						selector.find("img,i").remove();
						if(url.indexOf(".")>1){
							if(selector.children("img").length == 0){
								$(selector).prepend($("<img>"));
								selector.children("img:first").show().attr("src", Global.iconPath + url);
							}
						}else{
							if(selector.children("i").length == 0){
								$(selector).prepend($("<i class='field-icon'>"));
								selector.children("i:first").show().addClass(url) ;
							}
						}
						var fieldInput=selector.children("input[type=hidden]");
						fieldInput.val(url).trigger("change");
				});
				return false;
			});
			$(".btn-remove",selector).click(function(){	
				var fieldInput=selector.children("input[type=hidden]");
				selector.find("img,i").remove();
				fieldInput.val("").trigger("change");
			});			
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
	$.uiwidget.register("popupCascade",function(selector){
		selector.each(function(){
			var self = $(this);
			var refInput=$(this).next(":hidden");
			var fieldName = refInput.attr('name');
			var handleUnusedChild = 'disable';//can be 'hide', 'disable', 'none'
			var parentName = self.data("parentfield");
			var context=self.data("context");
			var children= $('.popupCascade[data-parentfield=' + fieldName + ']', context);
			var options = $(this).attr( $.uiwidget.options )||'{}' ;//target
			if(self.hasClass("inputpro-img-input")){
				return;
			}
			eval(" var jsonOptions = "+options) ;
			$(this).input(jsonOptions) ;
			var first=true;
			if(refInput.length>0){
				$(refInput).on("change",function(){
					var clear=true,disable=false;
					if(first){
						if(!refInput.val()){
							disable=true;
						}
						clear=false;
						first=false;
					}
					if(disable){
						children.attr("disabled","disabled");
					}else{
						children.removeAttr("disabled");
					}
					if(clear){
						children.val("");
						children.parent().next(":hidden").val("");
					}
					//update child select url and query url
					children.each(function(i,ch){
						var oringinQueryUrl=$(ch).data("oselecturl");
						var parententityreffield=$(ch).data("parententityreffield");
						var newUrl=Urls.urlParam(oringinQueryUrl,[{key:"_parententityreffield_",value:parententityreffield},{key:"_parententityreffieldvalue_",value:refInput.val()}]);
						$(ch).attr("data-selecturl",newUrl);
					});
					if(self.data("fieldVal")==refInput.val()) return;
					var entityName=self.data("entity");
					var titleField=self.data("titleField");
					var refEntity=EntityUtil.getEntity(entityName,refInput.val());
					if(refEntity){
						self.val(refEntity[titleField]);
						self.data("fieldVal",refInput.val());
					}
				});
				$(refInput).trigger("change");
			}
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
			url=Urls.urlParam(url,[{key:"sourceField",value:$child.attr("data-current-entity")+"."+$child.attr("name")},
			                       {key:'sourceEntity',value:lookupValue},
			                       {key:'targetEntity',value:parentLookupValue},
			                       {key:'targetEntityPKValue',value:parentValue}]);
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
					var toppestFieldValue=$(this).attr('data-value');
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
		/*if(action=="view"){
			$.each($selectorsOrdered,function(){
				var value=$(this).find("option:checked").text();
				$(this).after(value).hide();
			});
		}*/
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
			var _optionsJson=self.data("options")||"{}";
			eval(" var _options = "+_optionsJson) ;
			var _genRow=self.data("gen-row");
			var options=$.extend({
				addRowCSS : "addRow",
				delRowCSS : "delRow",
				copyRowCSS:	"copyRow",
				oddRowCSS : "odd",
				evenRowCSS : "even",
				wrapper:"",
				genRow : _genRow,
				inputBoxAutoNumber : true,
				onDrop : function(table, row) {
					
				},
				addCallBack : function(row, table) {
					self.dialogResize();
					$(row).uiwidget();
					$(row).find("input:hidden[data-primaryKey=true]").val("");
					self.trigger("addItem");
				},
				deleteCallBack : function(row, table) {
					self.dialogResize();
					self.trigger("delItem");
				}
			},_options);
			var tableDnd=self.tableDnD(options);
			self.data("tableDnd",tableDnd);
		});
	});
	$.uiwidget.register("ui-slave-table-import",function(selectors){
		selectors.each(function(){
			var self=$(this);
			var _optionsJson=self.data("options")||"{}";
			eval(" var _options = "+_optionsJson) ;
			var table=self.closest(".actions").data("table");
			var entityName=table.find("input[name='_slave_entity_name_']").val();
			if(!entityName){
				$.messageBox.warning({message:"EntityName param is null!"});
				return false;
			}
			var url= Global.contextPath+'/entities/'+entityName+'/transformExcelToMap';
			self.click(function(){
				var currentTable=table;
				$.openLink(url,{},function(res){
					if(res){
						if(currentTable){
							currentTable.find('.delRow').trigger('click');
							currentTable.trigger("fillDatas",[res]);
							var cb = self.data('afterImported');
							if(cb) cb();
						}
					}
				});
			});
		});
	});
	$.uiwidget.register("ui-slave-table-export-header",function(selectors){
		selectors.each(function(){
			var self=$(this);
			var table=self.closest(".actions").data("table");
			var entityName=table.find("input[name='_slave_entity_name_']").val();
			if(!entityName){
				$.messageBox.warning({message:"EntityName param is null!"});
				return false;
			}
			var view = self.attr('id');
			var url= Global.contextPath+'/entities/' + entityName + '/export-for-header/' + view + '.xls';
			self.click(function(){
				window.location.assign(url);
			});
		});
	});
	$.uiwidget.register("ui-slave-table-export",function(selectors){
		selectors.each(function(){
			var self=$(this);
			self.click(function() {
				var parent=self.parents('.portlet.box.slave');
				var headers = [], rows = [];
				parent.find('th').each(function() {
					var $t = $(this), text = $t.text();
					if(text && text.trim() != '') headers.push(text);
				});
				parent.find('tbody tr').each(function() {
					var $tr = $(this), row = [];
					$tr.find('td:visible').each(function() {
						var $td = $(this);
						var eles = $td.find('input, select, textarea');
						if(eles.length > 0) {
							if(eles.length == 1) {
								if(eles.is('select')) {
									
									row.push(eles.find('option[value=' + eles.val().replace('.', '\\.') + ']').text());
								} else {
									row.push(eles.val());
								}
							} else {
								row.push(eles.filter(':checked').val());
							}
						} else {
							row.push($td.text());
						}
					});
					rows.push(row);
				});

				url = Global.contextPath + '/entities/tool/export-for-business/list.xls';
				$.restPost(url, {
					header: headers,
					rows: rows
				}, function(fileId) {
					if(!!fileId) {
						url += '?fileId=' + fileId;
						window.location.assign(url);
					}
				}, {dataType: 'text'});
			});
		});
	});
	$.uiwidget.register("caculate",function(selectors){
		selectors.each(function(){
			$(this).caculate();
		});
	});
	$.uiwidget.register("format",function(selectors){
		var formatter = {
				account:function(account){
					if(CommonUtil.isEmpty(account)){
						return;
					}
					if(account.length<=4){
						return "****";
					} else if(account.length<=8){
						var prefix = account.substring(0,2);
						var suff = account.substring(account.length-2);
						return prefix + "*****" + suff;
					}else{
						var prefix = account.substring(0,4);
						var suff = account.substring(account.length-4);
						return prefix + "*****" + suff;
					}
					
				}
		};
		selectors.each(function(){
			var self = $(this);
			var format = self.attr("data-format");
			if(typeof(format) == "undefined"){
				return;
			}
			var res=self.html();
			if(formatter[format]){
				res = formatter[format](self.html());
			}else{
				res = String.format(format, parseFloat(self.html()));
			}
			self.html(res);
		});
	});
	$.uiwidget.register("singleCaseCade",function(selectors){
		
		selectors.each(function(){
			var self = $(this);
			var expression = self.attr("data-expression");
			if(CFUtils.isUndefined(expression)){
				return;
			}
			CFUtils.bindChangeEvent(self,function(response,exp){
				var sourceEntity = response[0];
				CFUtils.changeSelfValue(exp.caseCadeInputText,sourceEntity[exp.field]);
			});
		});
	});
	$.uiwidget.register("tokeninput",function(selectors){
		
		selectors.each(function(){
			var self = $(this);
			var queryUrl=self.attr("data-queryUrl");
			var selectUrl=self.attr("data-selectUrl");
			var useDropdown=self.attr("data-dropdown")==="true"?true:false;
			var existsItems=[];
			if(self.val()){
				existsItems=JSON.parse(self.val());
			}else{
				return false;
			}
			self.tokenInput(queryUrl,{
				prePopulate:existsItems,
				selectUrl:selectUrl,
				hintText:false,
				queryParam:"keyword",
				theme: "facebook",
				useDropdown:useDropdown,
				preventDuplicates: true,
				keyDownEvent:self.attr("keydown-event"),
				onAdd:function(addItem){
					var hideInput=this;
					$(hideInput).trigger("change",{item:addItem});
				},
				onDelete:function(tokenData){
					var hideInput=this;
					$(hideInput).trigger("change",{tokenData:tokenData});
				}
			});
		});
	});

	$.uiwidget.register("typeahead",function(selectors){
		selectors.each(function(){
			var self = $(this);	
			var dataSouce=eval("("+self.data('source')+")");
			self.typeahead({
				source:dataSouce,
				matcher:function(item){
					return true;
				}
			});
			self.click(function(){
				var value=self.val();
				if(!value){
					self.val('a');
				}		
				self.typeahead('lookup');
				self.val(value);
			});				
		});
	});
	$.uiwidget.register("tablecheck",function(selectors){
		selectors.each(function(){
			var self = $(this);	
			var table=self.closest("table");
			var checkinputClass=self.data("checkinputclass");
			var checkCallback=self.data("checkcallback");
			var uncheckCallback=self.data("uncheckcallback");
			if(table.length!==1){
				return;
			}
			var tbody=table.find("tbody");
			var checkInputs=null;
			if(checkinputClass){
				checkInputs=tbody.find("tr ."+checkinputClass);
			}else{
				checkInputs=tbody.find("tr").find("td:eq(0) input:checkbox");
			}
			self.click(function(){
		    	var checked=$(this).attr("checked");
				if(checked){
					checkInputs.attr("checked","checked");
					if(checkCallback&&$.isFunction(checkCallback)){
						checkCallback(checkInputs,self);
					}
				}else{
					checkInputs.removeAttr("checked");
					if(uncheckCallback&&$.isFunction(uncheckCallback)){
						uncheckCallback(checkInputs,self);
					}
				}
		    });			
		});
	});
	$.uiwidget.register("navtip", function(selector) {
		selector.each(function() {
			_self = $(this);
			
			var isShow = _self.attr("data-show");
			if(isShow && 'true' != isShow)
				return;
			
			var tourCode = _self.attr("data-tourCode");
			var stepsNums = null;
			var data_steps = _self.attr("data-steps");
			if(!CommonUtil.isEmpty(data_steps))
				stepsNums = _self.attr("data-steps").split(',');
			else{
				hopscotch.endTour(false, false);
				return; //the data steps must be set
			}
			
			var tourId = navTip.getTourId(tourCode);
			if(!tourId)
				return; /*not defined tour*/
				
			var hopState = hopscotch.getState();
			if(stepsNums[0]!=1){
				if(!CommonUtil.isEmpty(hopState)){
					hopState = hopState.split(":");
					if(tourId != hopState[0]){
						hopscotch.endTour(false, false);
						return;
					}
				}else
					return;
			}
			
			var currentTour = hopscotch.getCurrTour();
			if(null != currentTour && typeof currentTour !== 'undefined' && currentTour.id == tourId){
				$.each(stepsNums, function(index, value){
					currentTour.steps[value-1] = navTip.getSpecifySteps(_self, tourCode, value);
				});
				hopscotch.configure(currentTour);
				hopscotch.showStep(stepsNums[0]-1);
				return;
			}else
				hopscotch.endTour(false, false);
			
			var tour = navTip.getTour(_self, tourCode, stepsNums);
			var getUrl = Config.serverPath + "/uamSetting/getCurrentUserSetting?dataType=nav&defaultValue=0&dataId="+tourId;
			jQuery.restGet(Urls.appendDate(getUrl), {}, function(result){
				if('0' === result){ /*the current user not done the tour*/
					tour.onEnd = function(){
						var updateUrl = Config.serverPath + "/uamSetting/updateSetting?dataType=nav&value=1&dataId="+tourId;
						jQuery.restGet(Urls.appendDate(updateUrl), {}, function(result){
							/*the tour is done over*/
						});
					}
					hopscotch.startTour(tour,stepsNums[0]-1);
				}
			});
		});
	});
	//used for autocode fieldtype parameter
	$.uiwidget.register("autocode", function(selector) {
		selector.each(function() {
			_self = $(this);
			if(_self.data("autocode")){
				return;
			}else{
				_self.data("autocode",true);
			}
			var context=_self.parent();
			var rules=[{name:"--选择--",value:""},
			           {name:"自增序列(可设长度)",value:"{seq:5}"},
			           {name:"当前日期(可设格式)",value:"{date:yyyyMMdd}"},
			           {name:"当前时间(可设格式)",value:"{date:yyyyMMdd HH:mm:ss}"},
			           {name:"当前用户姓名",value:"@{env.UserEntity.Name}"},
			           {name:"当前用户部门",value:"@{env.UserEntity.organization.name}"},
			           {name:"当前用户工号",value:"@{env.UserEntity.userNum}"}];
			var selectForRules='<div class="select-autocode-con"><span>通用变量：</span><select class="select-autocode-rule" name="select-autocode-rule">';
			$.each(rules,function(i,r){
				selectForRules+="<option value='"+r.value+"'>"+r.name+"</option>";
			});
			selectForRules+='</select></div>'; 
			_self.after(selectForRules);
			var startPos=undefined;
			_self.keydown(function(){
				startPos=_self.getCurPos()+1;
			});
			_self.click(function(){
				startPos=_self.getCurPos();
			});
			$("select.select-autocode-rule",context).change(function(){
				var rule=$(this).val();
				if(rule){
					_self.insertAtCursor(rule,startPos);
				}
			});
		});
	});
	
}(jQuery));






