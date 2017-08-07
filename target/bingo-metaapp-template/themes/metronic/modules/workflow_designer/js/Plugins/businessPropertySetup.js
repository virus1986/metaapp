//plugin for set up workflow business property
if (!ORYX.Plugins) 
    ORYX.Plugins = new Object();


ORYX.Plugins.BusinessPropertySetup = Clazz.extend({

    facade: undefined,
    
    construct: function(facade){
    
        this.facade = facade;
      	
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_DBLCLICK, this.actOnDBLClick.bind(this));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_CLICK, this.actOnClick.bind(this));
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED, this.activityNameChanged.bind(this));
		this.activityNameMap={};
		var self=this;
		this.facade.registerOnEvent(ORYX.CONFIG.EVENT_NOTIFICATION_SHOW, function(){
			var canvas=self.facade.getCanvas();
			if(self.getPropertyDirectly(canvas,ORYX.PROPS_PREFIX+"processn")!=Global.procName){
				self.editDirectly(canvas,ORYX.PROPS_PREFIX+"processn",Global.procName);
			}
		});
		this.facade.offer({
            'name': ORYX.I18N.BPS.processConfig,
            'functionality': this.editProcBusinessProps.bind(this),
            'group': ORYX.I18N.BPS.group,
            'icon': ORYX.BASE_FILE_PATH + "images/apple/p.png",
            'description': ORYX.I18N.BPS.processConfigDesc,
            'index': 2,
            'minShape': 0,
            'maxShape': 0,
            'isEnabled': function(){
                return ORYX.REPOSITORY_ID != "guvnor";
            }.bind(this)
        });
		this.facade.offer({
			'name': ORYX.I18N.BPS.activityConfig ,
			'functionality': this.editActivityBusinessProps.bind(this),
			'group': ORYX.I18N.BPS.group,
			'icon': ORYX.BASE_FILE_PATH + "images/apple/a.png",
			'description': ORYX.I18N.BPS.activityConfigDesc,
			'index': 2,
			'minShape': 0,
			'maxShape': 0,
			'isEnabled': function(){
				var shapes=self.facade.getSelection();
				return ORYX.REPOSITORY_ID != "guvnor"&&shapes&&self.isUserAssociatedTask(shapes[0]);
			}.bind(this)
		});
    },
    
    actOnClick: function(evt, shape){
		if( !(shape instanceof ORYX.Core.Shape) ){ 
			
		}
	}, 
	editProcBusinessProps:function(){
		var self=this;
		if(!Global.flowId){
			Ext.Msg.alert(ORYX.I18N.ALERT.info, ORYX.I18N.BPS.saveProcDefDesc);
			return;
		}
		var shape=self.facade.getCanvas();
		var processConfigUrl=ORYX.CONFIG.PROCESS_PROPS_CONFIG_WEB_URL;
		jQuery.openLink(processConfigUrl,function(res){
			if(res){
				/*var props=[{key:ORYX.PROPS_PREFIX+"processn",value:res.procName}];
				self.editAllDirectly(shape,props);*/
				if(self.getPropertyDirectly(shape,ORYX.PROPS_PREFIX+"processn")!=res.procName){
					self.editDirectly(shape,ORYX.PROPS_PREFIX+"processn",res.procName);
				}
			}
		});
	},
	editActivityBusinessProps:function(){
		var self=this;
		var shape=self.selectShape;
		if(!shape){
			if(self.facade.getSelection()){
				shape=(self.facade.getSelection())[0];
			}else{
				return;
			}
		}
		
		var activityId=self.getPropertyDirectly(shape,ORYX.PROPS_PREFIX+"id");
		if(!activityId){
			Ext.Msg.alert(ORYX.I18N.ALERT.info, ORYX.I18N.BPS.activityPropEditNotNullIdDesc);
			return;
		}
		var prefix=ORYX.PROPS_PREFIX;
		var activityConfigUrl=ORYX.CONFIG.ACTIVITY_PROPS_CONFIG_WEB_URL+"&actName="+activityId;
		//open task property window
		var isUserAssociatedTask=self.isUserAssociatedTask(shape);
		if(isUserAssociatedTask){
			var cAttrsNames=["userchoiceactors"];
			var cAttrs={};
			jQuery.each(cAttrsNames,function(i,name){
				cAttrs[name]=self.getPropertyDirectly(shape,prefix+name);
			});
			jQuery.openLink(activityConfigUrl,{exAttrs:self.getExtensionProperties(shape),cAttrs:cAttrs},function(res){
				if(res){
					if(res.exAttrs){
						self.setExtensionProperties(shape,res.exAttrs);
					}
					if(res.cAttrs){
						jQuery.each(res.cAttrs,function(key,value){
							self.editDirectly(shape,prefix+key,value);
						});
					}
				}
			});
		}
	},
	actOnDBLClick: function (evt, shape){
		var self=this;
		if(shape instanceof ORYX.Core.Canvas){
			self.editProcBusinessProps();
			return;
		}
		self.selectShape=shape;
		self.editActivityBusinessProps();
	},
	getPropertyDirectly:function(shape,key){
		var value=null,has=false;
		if(shape.getStencil().property(key)){
			value=shape.getProperty(key);
			has=true;
		}
		if(has){
			return value;
		}else{
			return "noproprerty";
		}
	},
	// Changes made in the property window will be shown directly
	editDirectly : function(shape,key, value) {
		var shapeP=shape.getStencil().property(key);
		if (shapeP&&(!shapeP.readonly())) {
			var oldValue=shape.getProperty(key);
			shape.setProperty(key, value);
			/* Propagate changed properties */
			this.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED,
				elements : [shape],
				key : key,
				value : value,
				oldValue:oldValue
			});
			this.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_PROCESS_PROPS_CHANGED,
				elements : [shape],
				key : key,
				value : value
			});
			this.facade.getCanvas().update();
		}
	},
	editAllDirectly:function(shape,keyValues){
		if(!jQuery.isArray(keyValues)){
			return;
		}
		var self=this;
		keyValues.each(function(prop){
			var key=prop.key,value=prop.value;
			var shapeP=shape.getStencil().property(key);
			if (shapeP&&(!shapeP.readonly())) {
				var oldValue=shape.getProperty(key);
				shape.setProperty(key, value);
				/* Propagate changed properties */
				self.facade.raiseEvent({
					type : ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED,
					elements : [shape],
					key : key,
					value : value,
					oldValue:oldValue
				});
			}
		});
		this.facade.raiseEvent({
			type : ORYX.CONFIG.EVENT_PROCESS_PROPS_CHANGED,
			elements : [shape]
		});
		this.facade.getCanvas().update();
	},
	isUserAssociatedTask:function(shape){
		var userAssociatedTask=false;
		if(shape instanceof ORYX.Core.Node &&shape.getStencil()){
			var shapeViewUrl=shape.getStencil()._view.baseURI||shape.getStencil()._jsonStencil.view||'';
			if(shapeViewUrl.endsWith("activity/usertask.svg")||shapeViewUrl.endsWith("activity/drafttask.svg")||shapeViewUrl.endsWith("subprocess.embedded.svg")||shapeViewUrl.endsWith("callactivity.svg")){
				userAssociatedTask=true;
			}
		}
		return userAssociatedTask;
	},
	activityNameChanged:function(evt){
		var id=ORYX.PROPS_PREFIX+"id";
		var shape=evt.elements[0];
		var key=evt.key;
		var value=evt.value;
		if(key===id&&!value){
			Ext.Msg.alert(ORYX.I18N.ALERT.info, ORYX.I18N.BPS.activityIdNonNull);
			return;
		}
		var shapeId=shape.getId();
		var oldValue=evt.oldValue[shapeId]||evt.oldValue;
		if(evt.oldValue[shapeId]===""){
			return;
		}
		var self=this;
		if(key===id){
			shape.resourceId=value;
			if(!self.activityNameMap[shapeId]){
				self.activityNameMap[shapeId]={};
				self.activityNameMap[shapeId].oldValue=oldValue;
				self.activityNameMap[shapeId].newValue=value;
				self.activityNameMap[shapeId].procId=Global.procId;
			}else{
				self.activityNameMap[shapeId].newValue=value;
			}
			self.facade.raiseEvent({
				type : ORYX.CONFIG.EVENT_PROCESS_ACTIVITY_NAME_CHANGED,
				activityNameMap:self.activityNameMap
			});
		}
	},
	setExtensionProperties:function(shape,exProps){
		if(!exProps){
			return false;
		}
		var key=ORYX.PROPS_PREFIX +"extensionproperties";
		var extensionProperties=this.getPropertyDirectly(shape,key);
		if("noproprerty"===extensionProperties){
			return false;
		}
		var props=null;
		if(extensionProperties){
			props=JSON.parse(extensionProperties);
		}else{
			props={items:[],totalCount:0};
		}
		var propsMap={};
		jQuery.each(props.items,function(i,v){
			propsMap[v.key]={has:true,index:i};
		});
		jQuery.each(exProps,function(key,value){
			if(propsMap[key]&&propsMap[key].has){
				delete props.items[propsMap[key].index];
				if(!value||"false"===value){
					props.totalCount-=1;
				}else{
					props.items.push({key:key,value:value});
				}
			}else if(value||"true"===value){
				props.totalCount+=1;
				props.items.push({key:key,value:value});
			}
		});
		extensionProperties=props;
		this.editDirectly(shape,key, Object.toJSON(extensionProperties));
	},
	getExtensionProperties:function(shape){
		var key=ORYX.PROPS_PREFIX +"extensionproperties";
		var extensionProperties=this.getPropertyDirectly(shape,key);
		if("noproprerty"===extensionProperties){
			return {};
		}
		var props=null;
		if(extensionProperties){
			props=JSON.parse(extensionProperties);
			var propsMap={};
			jQuery.each(props.items,function(i,v){
				propsMap[v.key]=v.value;
			});
			return propsMap;
		}
		return {};
	}
});