if (!ORYX.Plugins)
    ORYX.Plugins = {};

if (!ORYX.Config)
    ORYX.Config = {};

ORYX.Plugins.SavePlugin = Clazz.extend({
    construct: function(facade){
        this.facade = facade;
        this.vt;

        this.facade.offer({
        	'name': ORYX.I18N.Save.save,
        	'functionality': this.saveNotClose.bind(this),
        	'group': ORYX.I18N.Save.group,
        	'icon': ORYX.BASE_FILE_PATH + "images/save-heart.png",
        	'description': ORYX.I18N.Save.saveDesc,
        	'index': 1,
        	'minShape': 0,
        	'maxShape': 0,
        	'isEnabled': function(){
        		return ORYX.REPOSITORY_ID != "guvnor";
        	}.bind(this)
        });
        this.facade.offer({
            'name': ORYX.I18N.Save.saveAndClose,
            'functionality': this.save.bind(this),
            'group': ORYX.I18N.Save.group,
            'icon': ORYX.BASE_FILE_PATH + "images/save-close2.png",
            'description': ORYX.I18N.Save.saveAndCloseDesc,
            'index': 2,
            'minShape': 0,
            'maxShape': 0,
            'isEnabled': function(){
                return ORYX.REPOSITORY_ID != "guvnor";
            }.bind(this)
        });
        this.facade.offer({
            'name': ORYX.I18N.Save.saveAndNewVersion,
            'functionality': this.saveAndNewVersion.bind(this),
            'group': ORYX.I18N.Save.group,
            'icon': ORYX.BASE_FILE_PATH + "images/save-star.png",
            'description': ORYX.I18N.Save.saveAndNewVersionDesc,
            'index': 3,
            'minShape': 0,
            'maxShape': 0,
            'isEnabled': function(){
                return ORYX.REPOSITORY_ID != "guvnor";
            }.bind(this)
        });
        this.facade.registerOnEvent(ORYX.CONFIG.EVENT_MOUSEUP, this.setUnsaved.bind(this));
        this.facade.registerOnEvent(ORYX.CONFIG.EVENT_PROCESS_ACTIVITY_NAME_CHANGED, this.processActivityNameChanged.bind(this));
        this.changedActivity=[];

        window.onunload = this.unloadWindow.bind(this);

    },

    setUnsaved: function() {
        ORYX.PROCESS_SAVED = false;
    },
    saveAndNewVersion:function(self,eve){
    	this.save(self,eve,true,false);
    },
    saveNotClose:function(self,eve){
    	this.save(self,eve,false,true);
    },
    save : function(self,eve,newVersion,notClose) {
    	var newVersion=newVersion||false;
    	var notClose=notClose||false;
        if(!ORYX.PROCESS_SAVED) {
            // save process bpmn2 and svg
        	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"保存中..."});	
        	myMask.show();
        	var saveUrl=ORYX.PATH + 'assetservice';
        	if(newVersion===true){
        		saveUrl+="?newversion=1";
        	}
            Ext.Ajax.request({
                url: saveUrl,
                method: 'POST',
                success: function(response) {
                	/**执行完毕*/
                	myMask.hide();					
                	myMask.disable();
                    try {
                        if(response.responseText && response.responseText.length > 0) {
                            var saveResponse = response.responseText.evalJSON();
                            if(saveResponse.errors && saveResponse.errors.length > 0) {
                                var errors = saveResponse.errors;
                                for(var j=0; j < errors.length; j++) {
                                    var errormessageobj = errors[j];
                                    this.facade.raiseEvent({
                                        type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                        ntype		: 'error',
                                        msg         : '保存时错误: '+errormessageobj.message,
                                        title       : '',
                                        timeOut: 3000,
                                        extendedTimeOut: 3000
                                    });
                                }
                            } else {
                                if (ORYX.FlowId != saveResponse.procdefid) {
                                    ORYX.FlowId = saveResponse.procdefid;
                                }
                                
                                this.facade.raiseEvent({
                                    type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                    ntype		: 'success',
                                    msg         : '流程定义：'+ORYX.FlowId+' 已保存成功！',
                                    title       : '',
                                    timeOut: 3000,
                                    extendedTimeOut: 3000
                                });
                                //save and close outside slide dialog and return procdefinition
                                var iframeId=ORYX.Utils.getParamFromUrl("_iframe_id");
                                if(iframeId && window.parent.Page){
                                	if(notClose){
                                		window.parent.Page.resultToIframe(iframeId,saveResponse);
                                		if(!Global.flowId){
                                			var href=window.location.href;
                                			href=href.replace("flowid=","flowid="+saveResponse.procdefid);
                                			window.location.href=href;
                                		}
                                	}else{
                                		window.parent.Page.closeIframe(iframeId,saveResponse);
                                		return false;
                                	}
                    			}
                                
                                // set the designer flag
                                ORYX.PROCESS_SAVED = true;

                                //parent.designersignalassetupdate(ORYX.UUID);

                                if(ORYX.CONFIG.STORESVGONSAVE && ORYX.CONFIG.STORESVGONSAVE == "true") {
                                    // svg save
                                    var formattedSvgDOM = DataManager.serialize(ORYX.EDITOR.getCanvas().getSVGRepresentation(false));
                                    var rawSvgDOM = DataManager.serialize(ORYX.EDITOR.getCanvas().getRootNode().cloneNode(true));
                                    var processJSON = ORYX.EDITOR.getSerializedJSON();
                                    var processId = jsonPath(processJSON.evalJSON(), "$.properties.id");
                                    Ext.Ajax.request({
                                        url: ORYX.PATH + "transformer",
                                        method: 'POST',
                                        success: function(request) {
                                            this.facade.raiseEvent({
                                                type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                                ntype		: 'success',
                                                msg         : 'Successfully saved business process image',
                                                title       : ''
                                            });
                                        }.bind(this),
                                        failure:function(response, opts){
                                            this.facade.raiseEvent({
                                                type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                                ntype		: 'error',
                                                msg         : 'Unable to save business process image.',
                                                title       : ''
                                            });
                                        }.bind(this),
                                        params: {
                                            fsvg: Base64.encode(formattedSvgDOM),
                                            rsvg: Base64.encode(rawSvgDOM),
                                            uuid: ORYX.UUID,
                                            profile: ORYX.PROFILE,
                                            transformto: 'svg',
                                            processid: processId
                                        }
                                    });
                                }
                            }
                        } else {
                            this.facade.raiseEvent({
                                type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                ntype		: 'error',
                                msg         : '保存失败: ' + e,
                                title       : '',
                                timeOut: 3000,
                                extendedTimeOut: 3000
                            });
                        }
                    } catch(e) {
                        this.facade.raiseEvent({
                            type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                            ntype		: 'error',
                            msg         : '保存失败: ' + e,
                            title       : '',
                            timeOut: 3000,
                            extendedTimeOut: 3000
                        });
                    }
                }.bind(this),
                failure: function(){

                	/**执行完毕*/
                	myMask.hide();					
                	myMask.disable();
                	
                    this.facade.raiseEvent({
                        type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                        ntype		: 'error',
                        msg         : '保存失败.',
                        title       : '',
                        timeOut: 3000,
                        extendedTimeOut: 3000
                    });
                }.bind(this),
                params: {
					action : (ORYX.FlowId == "-1"||!ORYX.FlowId) ? 'createasset' : 'updateasset',
                    profile: ORYX.PROFILE,
                    assetcontent: ORYX.EDITOR.getSerializedJSON(),
                    pp: ORYX.PREPROCESSING,
                    assetid: ORYX.UUID,
                    flowid: ORYX.FlowId,
                    assetcontenttransform: 'jsontobpmn2',
                    changedActivity:JSON.stringify(this.changedActivity)
                }
            });
        } else {
            this.facade.raiseEvent({
                type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                ntype		: 'info',
                msg         : '流程定义在上次保存之后没有做任何修改！',
                title       : ''
            });
        }
    },
    processActivityNameChanged:function(evt){
    	var activityNameMap=evt.activityNameMap;
    	var self=this;
    	self.changedActivity=[];
    	jQuery.each(activityNameMap,function(key,item){
    		self.changedActivity.push({oldActName:item.oldValue,newActName:item.newValue,procId:item.procId});
    	});
    	console.log(self.changedActivity);
    },
    saveSync : function() {
        if(!ORYX.PROCESS_SAVED) {
            // save process bpmn2 and svg
            var processJSON = ORYX.EDITOR.getSerializedJSON();
            var saveAjaxObj = ORYX.Utils.getAjaxObj();
            var saveURL = ORYX.PATH + "assetservice";
            var saveParams  = "action=updateasset&profile=" + ORYX.PROFILE + "&pp=" + ORYX.PREPROCESSING + "&assetid=" + ORYX.UUID + "&assetcontenttransform=jsontobpmn2&assetcontent=" + encodeURIComponent(processJSON);
            saveAjaxObj.open("POST",saveURL,false);
            saveAjaxObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            saveAjaxObj.send(saveParams);
            if(saveAjaxObj.status == 200) {
                try {
                    if(saveAjaxObj.responseText && saveAjaxObj.responseText.length > 0) {
                        var saveResponse = saveAjaxObj.responseText.evalJSON();
                        if(saveResponse.errors && saveResponse.errors.lengt > 0) {
                            var errors = saveResponse.errors;
                            for(var j=0; j < errors.length; j++) {
                                var errormessageobj = errors[j];
                                this.facade.raiseEvent({
                                    type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                    ntype		: 'error',
                                    msg         : '保存时错误: '+errormessageobj.message,
                                    title       : '',
                                    timeOut: 3000,
                                    extendedTimeOut: 3000
                                });
                            }
                        } else {
                            this.facade.raiseEvent({
                                type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                                ntype		: 'success',
                                msg         : 'Successfully saved business process',
                                title       : '',
                                timeOut: 2000,
                                extendedTimeOut: 2000
                            });

                            parent.designersignalassetupdate(ORYX.UUID);
                            // set the designer flag
                            ORYX.PROCESS_SAVED = true;
                        }
                    } else {
                        this.facade.raiseEvent({
                            type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
                            ntype		: 'error',
                            msg         : 'Unable to save',
                            title       : ''
                        });
                    }
                } catch(e) {
                   // swallow errors for now
                    alert("error : " + e);
                }
            }
        }
    },

    enableautosave: function() {
        ORYX.AUTOSAVE_ENABLED = true;
        this.facade.raiseEvent({type: ORYX.CONFIG.EVENT_STENCIL_SET_LOADED});
        this.vt = window.setInterval((function(){
            this.save();
        }).bind(this), 30000);
        this.facade.raiseEvent({
            type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
            ntype		: 'info',
            msg         : 'Autosave has been enabled.',
            title       : ''
        });
    },

    disableautosave: function() {
        ORYX.AUTOSAVE_ENABLED = false;
        this.facade.raiseEvent({type: ORYX.CONFIG.EVENT_STENCIL_SET_LOADED});
        window.clearInterval(this.vt);
        this.facade.raiseEvent({
            type 		: ORYX.CONFIG.EVENT_NOTIFICATION_SHOW,
            ntype		: 'info',
            msg         : 'Autosave has been disabled.',
            title       : ''
        });
    },

    deleteassetnotify: function() {
        Ext.MessageBox.confirm(
            'Delete process confirmation',
            'Are you sure you want to delete this process?',
            function(btn){
                if (btn == 'yes') {
                    // send UF asset delete event
                    // to close tab and show UF notication
                    parent.designersignalassetdelete(ORYX.UUID);
                }
            }.bind(this)
        );
    },

    copyassetnotify: function() {
        Ext.MessageBox.confirm(
            'Copy process confirmation',
            'Would you like to save your changes before copying?',
            function(btn){
                if (btn == 'yes') {
                    this.save();
                    parent.designersignalassetcopy(ORYX.UUID);
                } else {
                    parent.designersignalassetcopy(ORYX.UUID);
                }
            }.bind(this)
        );
    },

    renameassetnotify: function() {
        Ext.MessageBox.confirm(
            'Rename process confirmation',
            'Would you like to save your changes before renaming?',
            function(btn){
                if (btn == 'yes') {
                    this.save();
                    parent.designersignalassetrename(ORYX.UUID);
                } else {
                    parent.designersignalassetrename(ORYX.UUID);
                }
            }.bind(this)
        );
    },

    unloadWindow: function() {
        //this.saveSync();
    }
});
