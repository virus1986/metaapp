$(function(){
	$('#invitationCode').blur(function(){
		if(!$(".code_info").is(":hidden"))
			return;
		
		$('#invitationCode').keyup();
	})
	
	
	
	$('#invitationCode').keyup(function(event){
		var invitationCode = $(this).val();
		if(invitationCode.length >= 6){
			var requestParams={
				data:{invitationCode:invitationCode},
				success:function(response) {
					$(".code_loading").hide();
					if('0' == response){
						$('#invitationCode').data("statue",true);
						$('.code_info').html('<i class="icon-ok"></i><span class="tip_warn">可用</span>');
					}else{
						$('#invitationCode').data("statue",false);
						
						var msg = '无效的邀请码';
						if('1' == response)
							msg = '已被使用';
						
						$('.code_info').html('<i class="icon-remove"></i><span class="tip_warn">'+msg+'</span>');
					}
					$('.code_info').show();
				},
				error:function(xhr, textStatus, errorThrown){
					$('#invitationCode').data("statue",false);
					$(".code_loading").hide();
				}
			};
			$('.code_info').hide();
			$(".code_loading").show();
			installModule.ajaxConn(requestParams, 'judgeInvitationCode');
		}else{
			if($(".code_info").is(":hidden"))
				$('.code_info').show();
			
			var msg = '无效的邀请码';
			if('' == invitationCode)
				msg = '请输入邀请码';
			
			$('#invitationCode').data("statue",false);
			$('.code_info').html('<i class="icon-remove"></i><span class="tip_warn">'+msg+'</span>');
			$(".code_loading").hide();
		}
	});
	//密码输入验证
    $("#password").bind('blur keyup focus', function (e) {
    	var eventType = e.type;
    	var val = this.value;
    	
    	switch(eventType){
    	case 'keyup':
    		if(val.length<1 || val.length>16){
				$('.pswState').hide();
				
				$('.txt-tips span').attr('class','tip-err');
				$('.txt-tips span').html("<i class='tip-error'></i>&nbsp;密码长度应为1~16个字符")
				return;
			}
			
			$('.pswState').show();
    		$('.txt-tips span').removeClass();
    		$('.txt-tips span').html('1~16个字符，区分大小写');
    	
    		var index = installModule.checkPwdStrength(val);
	        
	        var pswState = $('.pswState');
	        pswState.removeClass();
	        pswState.attr('class','pswState '+index['Class']);
	        
	        $(this).data('pswState',index);
	        break;
    	case 'blur':
    		$('.pswState').hide();
    		if(val.length<1 || val.length>16){
				$('.pswState').hide();
				
				$('.txt-tips span').attr('class','tip-err');
				$('.txt-tips span').html("<i class='tip-error'></i>&nbsp;密码长度应为1~16个字符")
				return;
			}
    		
    		$('.txt-tips span').attr('class','tip-suc');
    		$('.txt-tips span').html("<i class='tip-ok'></i>&nbsp;密码强度:"+$(this).data('pswState').text);
    		break;
    	case 'focus':
    		$('.pswState').show();
    		$('.txt-tips span').removeClass();
    		$('.txt-tips span').html('1~16个字符，区分大小写');
    		break;
    	};
        
    });
	
	$("#submits").click(function(event){
		event.preventDefault();
		
		var valInfo = $.validation.validate($('.main-content form'), {showTip:true}) ;
		if( valInfo.isError ) {
			return false;
		}
		var self=$(this);
		var data={
			enterpriseName:$("#enterpriseName").val(),
			enterpriseCode:$("#enterpriseCode").val(),
			password:$("#password").val(),
			shortName:$("#enterpriseName").val(),
			contact:$("#contact").val(),
			phone:$("#phone").val(),
			email:$("#email").val(),
			invitationCode:$("#invitationCode").val()
		};
		var type = $("#type").val();
		if(type != null){
			data['type'] = type;
		}else{
			data['type'] = "";
		}
		
		$.messageBox.confirm({message:"即将使用后缀@"+data.enterpriseCode+"创建您的Link帐号，是否继续？",
			title:"提示",
			okButton: "确定",  
			cancelButton: "取消", 
			callback:function(ret){
				
			if(ret){
				var requestParams={
					type:"POST",
					data:data,
					success:function(response) {
						window.setTimeout(function(){
							if(type != null &&　type == 1){
								window.location.href = contextPath+"/install/active_info";
							}else{
								window.location.href = contextPath+"/install/account_info?token=" + response;	
							}
							Loader.hideLoader();
						},500);
					},
					error:function(xhr, textStatus, errorThrown){
						$.messageBox.info({message:xhr.responseText,title:"Erorr!"});
						window.setTimeout(function(){
							Loader.hideLoader();
						},200);
					}
				};
				self.attr("disabled","disabled");
				Loader.showLoader('正在提交您的注册申请, 请稍候...');	
				installModule.ajaxConn(requestParams, 'register');
			}
		}}) ;
	});
	
});