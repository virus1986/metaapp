//兼容product管理模块方法
var AjaxRequest={
		send:function(url,option){
			if(!url || url.length<1){
				return;
			}
			var options={};
			options.url=url;
			options.type="get";
			//options.dataType="json";
			options=jQuery.extend(options,option);
			jQuery.simpleRequest(options);
		}
};
var NMDialog={
		initDialogLink:function(context){
			if(!context){
				context=document;
			}
			$("a.dialoglink",context).off("click");
			$("a.dialoglink",context).click(function(){
				var _self=$(this);
				var url=_self.attr("href");
				jQuery.openLink(url,{showType:"pop-up"},function(){
					var returnVal=$.dialogReturnValue();
					var callBack=CommonUtil.parseFunc(_self,"data-callback");
					if(callBack!=null){
						callBack(returnVal);						
					}
				});
				return false;
			});
		}
};
$.extend(CommonLoader,{
	reloadList:function(listContainer,selectedItem){//列表重新加载方法，listContainer:容器id，selectedItem可选的触发列表行
		url = $(listContainer).attr("url");
		if(!url){
			return;
		}
		CommonLoader.loadData(listContainer, url, null, function() {
					if (selectedItem != "" || selectedItem != null) {
						$(selectedItem+" .detail").trigger('click');
					}
		});
	},
	loadForm:function (container, formObj) {// /提交指定id表单
		CommonLoader.loadData(container, $(formObj).attr("action"), $(formObj).serialize(),function(){});
		return false;
	},	
	loadModelList:function(container) {
		var url = $(container).attr("url")||$(container).attr("data-url");
	
		CommonLoader.loadData(container, url, null, function() {});
	},
	modelListRowAction:function(url) {
		$("tr.model-list-row").find("a").each(function() {
			$(this).unbind('click');
			$(this).bind("click", function(e) {
				e.stopImmediatePropagation();
				e.stopPropagation();
				e.preventDefault();
				var url = $(this).attr("href");
	
				$("tr.model-list-row").removeClass("current_1");
				$(this).parent().parent().addClass("current_1");
				CommonLoader.loadData("#main-content", url, null, function() {
				});
	
				return false;
			});
			$(this).css("cursor", "pointer");
			$(this).hover(function() {
				$(this).css("background", "#fff");
			}, function() {
				$(this).css("background", "");
			});
		});
	}
});
var Table={
		/*表格删除行后，下面的行name索引全部减去1；
		 * jqObject:jquery对象，当前待删除的对象
		 * indexName：name对应索引的名字，如果name为aa[].bb[].id，bb和aa就是indexName，aa的n=1，bb的n=2
		 * containerType：需要更新的容器类型
		 * n：indexName所在的索引位置
		 */
		changeNameIndex:function(jqObject,indexName,containerType,n){
			if(!n){
				n=1;
			}
			var tables=jqObject.nextAll(containerType);
			$.each(tables,function(index,value){
				$.each($(value).find(":input[name*="+indexName+"]"),function(i,v){
					var name=$(v).attr("name");
					var index=Table.getIndex(name,indexName);
					index=index-1;
					var begin=name.indexOf(indexName)+indexName.length+1;
					var end=Table.getTheNIndex(name,n);
					$(v).attr("name",name.substr(0,begin)+index+name.substr(end));
				});
			});
		},
		changeOneNameIndex:function(jqObject,indexName,n){
			if(!n){
				n=1;
			}
			$.each($(jqObject).find(":input[name*="+indexName+"]"),function(i,v){
				var name=$(v).attr("name");
				var index=Table.getIndex(name,indexName);
				index=index-1;
				var begin=name.indexOf(indexName)+indexName.length+1;
				var end=Table.getTheNIndex(name,n);
				$(v).attr("name",name.substr(0,begin)+index+name.substr(end));
			});
			
		},
		getIndex:function(value,indexName){
			var name=value;
			var pattern=new RegExp(indexName+"\\[(\\d*)\\]");
			var matcher=name.match(pattern);
			if(matcher && matcher.length==2){
				var index=matcher[1];
				return index;
			}else{
				return -1;
			}
		},
		getTheNIndex:function(value,n){
			if(n<1){
				return -1;
			}
			var index=value.indexOf("]");
			for(var i=1;i<=n-1;++i){
				var v=value.substr(index+1);
				var idx=v.indexOf("]");
				index=index+idx+1;
			}
			return index;
		}
};
var ValidationEx={
		/*
		 * 检查当前输入框与当前容器中同一类型的其它数据项是否重复
		 * caller: 一般为输入框
		 * parent: 当前容器
		 * siblingSelector: 同一类型的其它数据项的选择表达式
		 */
		chkSiblingDuplicate:function(caller, parent, siblingSelector){
			var count = 0;
			var curValue = $(caller).val();
			$(caller).closest(parent)
				.find(siblingSelector).each(function(){
					if($(this).val() == curValue){
						count++;
					}	
				}
			);
			if(count > 1){
				return {isError: true, errorInfo: i18n.t("error.valueDuplicate")};
			} else {
				return {isError: false};
			}
		}
};