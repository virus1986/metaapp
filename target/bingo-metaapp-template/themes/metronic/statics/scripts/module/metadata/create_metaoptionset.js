define(["require","./OptionsetManager"],function(require,OptionsetManager){
	var $=jQuery;
	return {
		createNew:function(_options){
			var optionsetManager=OptionsetManager.createNew(_options);
			//consolelog(optionsetManager);
			//私有变量初始化
			var action = _options.action;
			var context = _options.context;
			var options=_options.options;
			var optionsetDisplayName=_options.optionsetDisplayName;
			
			var itemTable = $("#itemTable", context);
			var itemName = $("#itemName", context);
			var itemValue = $("#itemValue", context);
			var itemDesc = $("#itemDesc", context);
			var defaultValue = $("select[name='defaultValue']", context);
			
			function getAndSetDefaultValue(options){
				for ( var i = 0; i < options.length; i++) {
					var option = options[i];
					if(option["isDefault"] == true){
						defaultValue.val(option.value);
						break;
					}
				}
			};
			function initPage(){
				Page.init(context);
				
				if(action != "edit"){
					setCurrentTitle(context, i18n.t("optionset.new"));
					$("#displayName", context).keyup(function(){
						$("#name", context).val($(this).toPinyin().replace(/\s*/g,''));
					});
				} else {
					setCurrentTitle(context, i18n.t("optionset.edit",optionsetDisplayName));
					for(var i = 0; i < options.length; ++i){
						var optionItem = options[i];
						optionsetManager.addListRow(optionItem);
						optionsetManager.unselectAllItem();
						itemTable.hide();
					}
				}
				
				defaultValue.focus();
				getAndSetDefaultValue(options);
				
				itemTable.hide();
				optionsetManager.getRowTemplate().hide();

				itemName.attr("placeholder", i18n.t("optionset.option.itemNameDesc")).focus();
				itemValue.attr("placeholder", i18n.t("optionset.option.itemValueDesc"));
				itemDesc.attr("placeholder", i18n.t("optionset.option.itemDesc"));

				$("#displayName", context).focus();
			};
			defaultValue.focus(function(){
				$(this).empty().append("<option value=''>"+i18n.t("metafield.notAssignValue")+"</option>");
				var list = optionsetManager.getRowList();
				for ( var i = 0; i < list.length; i++) {
					var one = $(list[i]).data("item");
					var option = "<option value='" + one.value + "'>" + one.name + "</option>";
					$(this).append(option);
				}
			});
			
			optionsetManager.setupEvent();
			
			function getDataOptions(addDefault){
				var dataOptions=[];
				if(addDefault){
					dataOptions.push({value:"",name:metafield.notAssignValue});
				}
				var options=$("#optionSetsItem", context).children("tr:gt(0)");
				for(var i=0;i<options.length;++i){
					dataOptions.push($(options[i], context).data("item"));
				}
				return dataOptions;
			};
			
			var ___context=$(context).closest(".ui-dialog-wrapper");
			if(___context.length<1){
				___context=context;
			}
			$(".saveMetaOptionSet", ___context).click(function(){
				var valInfo = $.validation.validate("#createOptionSetForm") ;
				if( valInfo.isError ) {
					return false;
				}
				$(this).attr("disabled","disabled");
				$(this).addClass("disabled");
				var url=$("#createOptionSetForm", context).attr("action");
				var data=$("#createOptionSetForm", context).toJson();
				data.options = getDataOptions();
				var defaultValue = optionsetManager.getDefaultItemValue();
				for ( var i = 0; i < data.options.length; i++) {
					var option = data.options[i];
					if(option.value == defaultValue){
						(data.options[i])["default"] = true;
						break;
					}
				}
				jQuery.restPost(url,data,function(response){
					
					jQuery.dialogReturnValue(response);
					$(context).dialogClose();
				});
			});
			
			initPage();
			return optionsetManager;
		}
};
});
//var MetaOptionsetManager=;