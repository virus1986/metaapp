var pwdStatue = [
	{
		Class:'',
		text:''
	},
	{
		Class:'pswState-poor',
		text:'弱'
	},
	{
		Class:'pswState-normal',
		text:'中'
	},
	{
		Class:'pswState-strong',
		text:'强'
	}
];
var installModule = {
	ajaxConn : function(requestParams, func){
		var ajaxParams={
			url:contextPath+"/install/"+func+"?_masterpage=common/tenant_master&t=" + Math.random(),
			type:"GET"
		};
		$.extend(ajaxParams,requestParams);
		$.ajax(ajaxParams);
	},
	judgeIsInitialized : function(enterpriseCode){
		var codeIsInited = true;
		var requestParams={
			data:{enterpriseCode:enterpriseCode},
			async:false,
			success:function(response) {
				if(!response)
					codeIsInited = false;
			}
		};
		this.ajaxConn(requestParams, 'judgeIsInitializedByEcode');
		return codeIsInited;
	},
	judgeEpEmailIsExist : function(email){
		var codeIsInited = true;
		var requestParams={
			data:{email:email},
			async:false,
			success:function(response) {
				if(!response)
					codeIsInited = false;
			}
		};
		this.ajaxConn(requestParams, 'judgeEpEmailIsExist');
		return codeIsInited;
	},
	/*  密码强度检测方法   */
	checkPwdStrength : function(sValue) {  
		var modes = 0;
		if (sValue.length == 0) return pwdStatue[0]; 
		
		if (/\d/.test(sValue)) modes++; //数字            
		if (/[a-z]/.test(sValue)||/[A-Z]/.test(sValue)) modes++; //小写            
		if (/[\W_]/.test(sValue)) modes++; //特殊字符 
		
		return pwdStatue[modes];
	}    
};
var utils = {
	isBlank : function (input) {
		if(typeof(input)=="undefined" || input==null) return true;
        return /^\s*$/.test(input);
    },
    validateEmail : function (email){
    	var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;  
    	return pattern.test(email);
    }
}
var Loader={
	showLoader:function(msg){
		var zIndex=1000;
		var container=$('.main-body');
		var height = Math.max($(document).height()-20,$(window).height()) ;
		var modelEl = $('<div class="ui-dialog-mask ui-widget-overlay"></div>')
			.appendTo($(document.body))
			.css({"z-index":zIndex,"height":height+"px","position":"absolute","left":"0px","top":"0px","width":"100%","display":"block"}) ;
		modelEl.fadeIn("fast",function(){
			var left=container.width()/2;
			var top=container.height()/2;
			
			var loader=$('<div class="alert alert-info ui-dialog-loader" style="display:none;padding: 8px 5px 8px 5px;position:absolute;background:white; top:'+top+'px;left:0px;z-index:19999;">'+
			'<img src="'+contextPath+'/themes/metronic/modules/install/images/ajaxLoader.gif"'+
			 'alt="加载中" style="width:43px;height:43px"/>'+
			 '<div style="display: inline-block;background:white;padding: 2px 10px 2px 14px;margin-bottom:0px;border:none;color: #3a87ad;">'+
				msg+
			'</div>'+
			'</div>');
			loader.appendTo(container);
			
			loader.css('left',left - loader.width()/2+'px');
			loader.css('top',top - loader.height()/2+'px');
			loader.show();
		});
	},
	hideLoader:function(){
		var modelEl=$(".ui-dialog-mask");
		if(modelEl.length>0){
			modelEl.fadeOut("fast",function(){
				modelEl.remove();
			});
		}
		var loader=$(".ui-dialog-loader");
		if(loader.length>0){
			loader.fadeOut("fast",function(){
				loader.remove();
			});
		}
	}
	
};


