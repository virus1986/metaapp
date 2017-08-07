define([ "require" ],function(require) {
			return {
				createNew : function(params) {
					var docManager = {};
					// DocType : 0 -- Word; 1 --- Excel; 2 -- PDF
					// Security : 0 -- Readonly; 1 -- Modify; 2 -- ModifyCopy; 3
					// -- VersionControl
					var options = docManager.options = $.extend(true, {
						viewId 			: null,
						context 		: null,
						pwin			:null,
						dsoContainer 	: null,
						status			:0,
						localFile 		: "",
						serverFilePath 	: "",						
						security 		: 1,
						docType 		: 0,						
						docVersion 		: 1,
						fileExt			:".doc",
						m_bIsOpen 		: false,
						m_bNeedUpload 	: false,
						m_strPassword 	: "111111",	
						userName		: "oa_user",
					}, params);

					if (!options.context) {
						if (options.viewId) {
							options.context = $("#" + options.viewId);
						} else {
							options.context = $(document);
						}
					}

					var dsoFrame = docManager.dsoFrame = null;
					var webFile = docManager.webFile = null;
					
					function setFileType(filename){
						var ext = filename.substr(filename.lastIndexOf(".")).toLowerCase();
						options.fileExt=ext;
						if(ext==".doc" || ext==".docx"){
							options.docType=0;
						}else if(ext==".xls" || ext==".xlsx"){
							options.docType=1;
						}
						return;
					}
					
					function afterDocOpened() {
					    /*if (DC_taskID == 1) {
					        if (obj.Revisions.Count > 0) {
					            AcceptAllRevisions();
					        }
					        // 关闭修订痕迹
					        obj.TrackRevisions = false;
					        ChangeRevision(0);
					    }
					    else if (Security == 3) {
					        // 打开修订痕迹
					        dsoFrame.TrackRevisions = true;
					        ChangeRevision(0);
					    }*/
						var docObj=dsoFrame.ActiveDocument;
						
						if(options.status==2){
					    	protect();
					    }else{
					    	docObj.Application.UserName=options.userName;
					    }
					    docObj.TrackRevisions = true;
					    changeRevision(0);
					    docObj.UndoClear();					    
					}
					
					function isIE(){
						if($.browser.msie || ($.browser.mozilla && $.browser.version=="11.0")){
							return true;
						}
						return false;
					}
					
					function changeRevision(state) {
					    if (null == dsoFrame || null == dsoFrame.ActiveDocument)
					        return;
					    switch (state) {
					        case 1:
					            showOrigin();
					            break;
					        case 2:
					            showModify();
					            break;
					        default:
					            showFinal();
					            break;
					    }
					}
					
					function showMessage(msg){
						$.messageBox.error({message:msg});
					}
					
					// 创建dsoFrame
					var createDSOFrame = function() {
						var dsoId = "dsoFrame" + options.viewId;
						var webFileId = "webFile" + options.viewId;	
						var win=window.parent || window;						
						var width=win.innerWidth-10;
						var height=win.innerHeight-60;
						var dsoPath=Global.contextPath+"/statics/setup/dsoframer.cab#version=1,0,0,0";
						var webFilePath=Global.contextPath+"/statics/setup/WebFileHelper2.CAB#version=1,0,0,1";
						var html = "<object id='"+ dsoId+ "' name='"+ dsoId+ "' codebase='"+dsoPath+"'";
						html += "  height='"+height+"px' width='"+width+"px' border='0' ";
						if($.browser.msie || ($.browser.mozilla && $.browser.version=="11.0")){
							html+="CLASSID='CLSID:00460182-9E5E-11d5-B7C8-B8269041DD57'";
						}else{
							html+="type='application/x-itst-activex'  clsid='{00460182-9E5E-11d5-B7C8-B8269041DD57}'";
						}						
						//html += "  event_onfilecommand='OnFileCommand' event_ondocumentopened='OnDocumentOpened' event_ondocumentclosed='OnDocumentClosed'";
						//html += "  activationpolicy='1'>";
						//html += "  <param name='BorderColor' value='-2147483632' />";
						//html += "  <param name='BackColor' value='-2147483643' />";
						//html += "  <param name='ForeColor' value='-2147483640' />";
						//html += "  <param name='TitlebarColor' value='52479' />";
						//html += "  <param name='TitlebarTextColor' value='0' />";
						html += "  <param name='BorderStyle' value='1' />";
						html += "  <param name='Titlebar' value='0' />";
						html += "  <param name='Toolbars' value='1' />";
						html += "  <param name='ActivationPolicy' value='1' />";
						html += "  <param name='Menubar' value='0' />";						
						//html += "  <param value='transparent' name='wmode' />";
						//html += "  <param name='wmode' value='opaque' />";
						html += "</object>";
						html += "<object id='"+ webFileId+ "' name='"+ webFileId+ "' width='0px' height='0px' codebase='"+webFilePath+"'";
						if($.browser.msie || ($.browser.mozilla && $.browser.version=="11.0")){
							html+="CLASSID='CLSID:2D18530F-D21E-472F-99C9-96D881BD43BE'";
						}else{
							html += " type='application/x-itst-activex' clsid='{2D18530F-D21E-472F-99C9-96D881BD43BE}'";
						}
						html += " >";
						html += "</object>";

						options.dsoContainer.innerHTML = html;						
						
						dsoFrame=document.getElementById(dsoId);
						webFile=document.getElementById(webFileId);	
						
						if($.browser.msie || ($.browser.mozilla && $.browser.version=="11.0")){
							//IE
						}else{
							dsoFrame.Titlebar=0;
							dsoFrame.MenuBar=0;
						}
					};

					// 打开文档(本地文件)
					var openDoc = function(docPath, docType, security) {
						if (docType != 0 && docType != 1) {
							return;
						}
						options.docType = docType;
						options.security = security;

						var docTypeName = "";
						if (docType == 0) {
							docTypeName = "Word.Document";
						} else if (docType == 1) {
							docTypeName = "Excel.Sheet";
						}

						try {
							dsoFrame.open(docPath, security == 0, docTypeName);
						} catch (ex) {
							$.messageBox.error({message:"打开文档失败！\r\n" + ex.message});
						}
					};

					// 打开服务器上的文件
					var openServerDoc = function() {
						if (options.serverFilePath.length <= 0) {
							return;
						}
						var downloadPath=Urls.parseDownloadPath(options.serverFilePath,Global.server+ Global.contextPath);
						downFileToLocal(downloadPath, function() {
							setFileType(options.serverFilePath);
							openDoc(options.localFile, options.docType,options.security);
							afterDocOpened();
						});
					};
					
					
					// 将DSOFrame中文件保存到服务器
					var saveToServer = function() {
						if (!isNeedUpload())
							return true;

						if (options.docType == 0 || options.docType == 1) {
							if (options.localFile.length == 0) {
								$.messageBox.error({message:"正文未正确打开，不能上传！"});
								return false;
							}

							// First, save local file.
							try {
								saveToLocal(options.localFile);								
							} catch (ex) {
								$.messageBox.error({message:"保存正文失败！" + ex.message});
								return false;
							}

							// Then, copy file
							strOtherFile = webFile.GetLocalTempFile("OATemp");
							try {
								webFile.CopyFile(options.localFile, strOtherFile,false);
							} catch (ex) {
								$.messageBox.error({message:"创建正文副本失败！" + ex.message});
								return false;
							}
						}

						// Upload
						var uploadUrls=Urls.uploadUrls(Global.server+ Global.contextPath);
						var fsUploadPath=uploadUrls.fsUploadPath;
						var fileServer =Urls.urlParam(fsUploadPath,[{key:"usefileserver",value:1},{key:"filename",value:"filename"+options.fileExt}]);
						fileServer = encodeURI(fileServer);
						var ret = uploadToServer(strOtherFile,fileServer);
						if (strOtherFile != options.localFile) {
							webFile.DeleteLocalFile(strOtherFile);
						}
						return ret;
					};

					// 将DSOFrame文档保存到本地临时文件中
					var saveToLocal = function(savePath) {
						dsoFrame.Save(savePath, true);
					};

					// 导入本地文件到DSOFrame控件
					var importLocalFile = function(fileInput) {
						try {
							var filepath=webFile.GetOpenFileName("Files (*.doc)|*.doc?|All Files (*.*)|*.*||", 0, "", "", 0, 0, 100);
							if(!filepath || filepath.length<1) return;
							
							var fileext = filepath.substr(filepath.lastIndexOf(".")).toLowerCase();							
							
							var strTempFile = webFile.GetLocalTempFile("OATemp");
							// copy file
							webFile.CopyFile(filepath,strTempFile,0);
							options.localFile=strTempFile;
							options.m_bNeedUpload=true;
							openDoc(strTempFile, options.docType,options.security);
							setFileType(filepath);
						} catch (ex) {
							$.messageBox.error({message:"选择正文文件失败！" + ex.message});
							return;
						}
					};

					// 是否需要上传
					var isNeedUpload = function() {
						if(options.m_bNeedUpload || (dsoFrame && dsoFrame.ActiveDocument && !dsoFrame.ActiveDocument.Saved)){
							return true;
						}
						return false;
					};

					// 下载文件
					var downFileToLocal = function(serverPath, callback) {
						if (options.localFile.length > 0) {
							if ($.isFunction(callback)) {
								callback();
							}
							return;
						}
						var strLocal = webFile.GetLocalTempFile("OATemp");
						
						/*
						downFileToLocalByHttp(serverPath,strLocal,function(){
							options.localFile=strLocal;
							if ($.isFunction(callback)) {
								callback();
							}
						});*/
						
						webFile.DownloadFile(serverPath,strLocal);
						options.localFile=strLocal;
						if ($.isFunction(callback)) {
							callback();
						}
					};
					
					
					// 把文件传回服务器
					var uploadToServer = function(localFile,updateUrl) {
						try {
							var re=webFile.UploadFile2(localFile,updateUrl,"single","true");
							//var re=uploadToServerByHttp(localFile,updateUrl);							
							var reVal=eval("("+re+")");
							options.serverFilePath=reVal.filePath;
							options.m_bNeedUpload = false;
							return true;
						} catch (ex) {
							showMessage("上传正文失败！\r\n"+ex.message);
							return false;
						}
					};
					
					// 通过浏览器XmlHttp方式下载文件
					var downFileToLocalByHttp=function(serverPath,strLocal,callback){
						//todo:webFile.WriteContentToFile出错
						if (options.localFile.length > 0) {
							if ($.isFunction(callback)) {
								callback();
							}
							return;
						}
						$.ajax({
							url:serverPath,
							processData:false,
							async:false,
							success:function(data,textStatus,jqXHR){
								webFile.WriteContentToFile(strLocal,jqXHR.responseBody);
								if ($.isFunction(callback)) {
									callback();
								}
							}
						});						
					};
					
					//通过浏览器XmlHttp提交文件
					var uploadToServerByHttp=function(localFile,updateUrl){
						//todo:webFile.ReadContentFromFile 出错
						var re=null;
						var varContent = webFile.ReadContentFromFile(localFile);
						 $.ajax({
						     url: updateUrl,
						     data: varContent,
						     processData: false,
						     type: "post",
						     async: false,
						     contentType: "multipart/form-data",
						     success:function(data,textStatus,jqXHR){
						    	 re=data;
						     }
						 });
						 return data;
					};
					
					// 打印文件
					var print=docManager.print=function(){
						if (options.localFile.length <= 0) {
							showMessage("文件未打开，不能进行打印！");
						}
						dsoFrame.PrintOut(true);
					};
					
					//另存文件
					var saveAs=docManager.saveAs=function(){
						if (options.localFile.length <= 0) {
							showMessage("文件未打开，不能下载！");
						}
						var filepath=webFile.GetSaveFileName("Files (*.doc)|*.doc?|All Files (*.*)|*.*||", 0, "", "", 0, 0, 100,"",options.fileExt.substr(1));
						if(!filepath || filepath.length<1) return;
						webFile.CopyFile(options.localFile, filepath,false);
					};

					// 显示最终版本
					var showFinal =docManager.showFinal = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument) {
							var protectionType = obj.ActiveDocument.ProtectionType;
							if (protectionType >= 0) {
								obj.ActiveDocument.UnProtect(options.m_strPassword);
								obj.ActiveDocument.ShowRevisions = false;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 0;
								obj.ActiveDocument.Protect(protectionType,true, options.m_strPassword);
							} else {
								obj.ActiveDocument.ShowRevisions = false;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 0;
							}
						}
					};
					
					// 显示修改痕迹
					var showModify =docManager.showModify = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument) {
							var protectionType = obj.ActiveDocument.ProtectionType;
							if (protectionType >= 0) {
								obj.ActiveDocument.UnProtect(options.m_strPassword);
								obj.ActiveDocument.ShowRevisions = true;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 0;
								obj.ActiveDocument.Protect(protectionType,true, options.m_strPassword);
							} else {
								obj.ActiveDocument.ShowRevisions = true;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 0;
							}
						}
					};

					// 显示原始版本
					var showOrigin =docManager.showOrigin = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument) {
							var protectionType = obj.ActiveDocument.ProtectionType;
							if (protectionType >= 0) {
								obj.ActiveDocument.UnProtect(options.m_strPassword);
								obj.ActiveDocument.ShowRevisions = false;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 1;
								obj.ActiveDocument.Protect(protectionType,true, options.m_strPassword);
							} else {
								obj.ActiveDocument.ShowRevisions = false;
								obj.ActiveDocument.ActiveWindow.View.RevisionsView = 1;
							}
						}
					};

					// 接受所有修订
					var acceptAllRevisions =docManager.acceptAllRevisions = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument) {
							var protectionType = obj.ActiveDocument.ProtectionType;
							if (protectionType >= 0) {
								obj.ActiveDocument.UnProtect(options.m_strPassword);
								obj.ActiveDocument.AcceptAllRevisions();
								obj.ActiveDocument.Protect(protectionType,true, options.m_strPassword);
							} else {
								obj.ActiveDocument.AcceptAllRevisions();
							}
						}
					};

					// 保护文档
					var protect =docManager.protect = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument
								&& obj.ActiveDocument.ProtectionType < 0) {
							// wdNoProtection = 0xffffffff,
							// wdAllowOnlyRevisions = 0,
							// wdAllowOnlyComments = 1,
							// wdAllowOnlyFormFields = 2,
							// wdAllowOnlyReading = 3
							obj.ActiveDocument.Protect(3, true,options.m_strPassword);
						}
					};

					// 取消保护
					var unProtect =docManager.unProtect = function() {
						var obj = dsoFrame;
						if (!!obj && !!obj.ActiveDocument
								&& obj.ActiveDocument.ProtectionType >= 0) {
							obj.ActiveDocument.UnProtect(options.m_strPassword);
						}
					};

					function init() {
						createDSOFrame();
						setTimeout(function(){
							openServerDoc();
						},500);
					}
					
					init();
					
					docManager.saveToServer=saveToServer;
					docManager.importLocalFile=importLocalFile;
					docManager.openServerDoc=openServerDoc;
					return docManager;
				}
			};
		});
