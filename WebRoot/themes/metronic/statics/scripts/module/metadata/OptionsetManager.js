define(["require"],function(require){
	var $=jQuery;
	return {
		createNew:function(_options){
			var optionsetManager={};
			var action = _options.action;
			var context = _options.context;
			var options=_options.options;
			
			var itemTable = $("#itemTable", context);
			var itemName = $("#itemName", context);
			var itemValue = $("#itemValue", context);
			var itemDesc = $("#itemDesc", context);
			var defaultValue = $("select[name='defaultValue']", context);
			//获取选中行
			optionsetManager.getSelectedRow=function (){
				return $("#optionSetsItem", context).children("tr.active");
			};
			//获取第一行
			optionsetManager.getRowTemplate=function (){
				return $("#optionSetsItem .optionItem:first", context);
			};
			//获取最后一行
			optionsetManager.getRowLast=function (){
				return $("#optionSetsItem .optionItem:last", context);
			};
			//获取选项集默认值
			optionsetManager.getDefaultItemValue=function (){
				return defaultValue.val();
			};
			//获取所有行
			optionsetManager.getRowList=function (){
				return $("#optionSetsItem .optionItem:gt(0)", context);
			};
			//获取所有其它行
			optionsetManager.getOtherRowList=function (){
				return $("#optionSetsItem .optionItem:gt(0):not(.active)", context);
			};
			//设表单值
			optionsetManager.setItemForm=function (name, value, description){
				itemName.val(name);
				itemValue.val(value);
				itemDesc.val(description);
			};
			//设置当前选中行的item
			optionsetManager.setSelectedRow=function (item){
				optionsetManager.getSelectedRow().data("item", item);
				optionsetManager.getSelectedRow().find(".itemName").text(item.name);
				optionsetManager.getSelectedRow().find(".itemValue").text(item.value);
			};
			optionsetManager.unselectAllItem=function(){
				$("#optionSetsItem tr", context).removeClass("active");
			};
			//增加列表行
			optionsetManager.addListRow=function (item){
				optionsetManager.unselectAllItem();
				var newRow = optionsetManager.getRowTemplate().clone().show("slow");
				itemTable.show();
				optionsetManager.getRowLast().after(newRow);
				optionsetManager.getRowLast().addClass("active");
				optionsetManager.setSelectedRow(item);
			};
			//构造item对象
			optionsetManager.newItem=function (name, value, description){
				var item = {};
				item.name = name;
				item.value = value;
				item.description = description;
				return item;
			};
			//判断该表单值是否已存在
			optionsetManager.isItemValueExist=function (value){
				for ( var i = 0; i < optionsetManager.getRowList().length; i++) {
					var row = optionsetManager.getRowList()[i];
					var rowValue = $(row).data("item").value;
					if(rowValue == value) return true;
				}
				return false;
			};
			//判断该其它表单值是否已存在
			optionsetManager.isOtherItemValueExist=function (value){
				for ( var i = 0; i < optionsetManager.getOtherRowList().length; i++) {
					var row = optionsetManager.getOtherRowList()[i];
					var rowValue = $(row).data("item").value;
					if(rowValue == value) return true;
				}
				return false;
			};
			
			//获取不重复的自动生成值
			optionsetManager.getIdentityValue=function (prefix, tryNumber){
				for ( var i = 0; i < optionsetManager.getRowList().length; i++) {
					var row = optionsetManager.getRowList()[i];
					var rowValue = $(row).data("item").value;
					if(rowValue == prefix + tryNumber){
						return optionsetManager.getIdentityValue(prefix, tryNumber + 1);
					}
				}
				return prefix + tryNumber;
			};
			optionsetManager.isDefaultItem=function(item){
				if(item.value == optionsetManager.getDefaultItemValue())
					return true;
				return false;
			};
			function actualDeleteItem(){
				if(optionsetManager.isDefaultItem(optionsetManager.getSelectedRow().data("item"))){
					$.messageBox.warning({
						message : i18n.t("optionset.option.defaultValueDeleteAlert")
					});
					defaultValue.val("");
				}
				optionsetManager.getSelectedRow().remove();
				optionsetManager.unselectAllItem();
				itemTable.hide();
			};
			optionsetManager.isItemEqual=function (itemA, itemB){
				if(itemA.name == itemB.name && 
						itemA.value == itemB.value)
					return true;
				return false;
			};
			function isOriginalItem(){
				var item = optionsetManager.getSelectedRow().data("item");
				for ( var i = 0; i < options.length; i++) {
					var original = options[i];
					if(optionsetManager.isItemEqual(item, original)) return true;
				}
				return false;
			};
			function warnValidate(item, itemDisplay, length){
				if(item.val() && item.val().length > length){
					$.messageBox.warning({
						message :i18n.t("optionset.lengthWarn",itemDisplay,length),
						callback : function(){
							item.focus();
						}
					});
					return false;
				}
				return true;
			};
			function validateOptionItem(){
				if(!warnValidate(itemName, i18n.t("optionset.name"), 38)) return false;
				if(!warnValidate(itemValue, i18n.t("optionset.value"), 38)) return false;
				if(!warnValidate(itemDesc, i18n.t("optionset.desc"), 300)) return false;
				return true;
			};
			function actualSaveItem(){
				var valInfo = validateOptionItem();
				if(valInfo) {
					var theValue = itemValue.val();
					if(optionsetManager.isOtherItemValueExist(theValue)){
						itemValue.val(optionsetManager.getIdentityValue("item", 1));
					}
					var optionItem = optionsetManager.newItem(
							itemName.val(), itemValue.val(), itemDesc.val());
					optionsetManager.setSelectedRow(optionItem);
				}
			};
			//失去焦点时无错便保存
			optionsetManager.saveWhenBlurAndValid=function (){
				var originalValue = optionsetManager.getSelectedRow().data("item").value;
				var theValue = itemValue.val();
				if(optionsetManager.isOtherItemValueExist(theValue)){
					itemValue.val(optionsetManager.getIdentityValue("item", 1));
				}
				var optionItem = optionsetManager.newItem(
						itemName.val(), itemValue.val(), itemDesc.val());

				optionsetManager.getSelectedRow().find(".itemName").text(optionItem.name);
				optionsetManager.getSelectedRow().find(".itemValue").text(optionItem.value);
				
				if(isOriginalItem() && originalValue != itemValue.val()){
					$.messageBox.confirm({
						message : i18n.t("optionset.refEditAlert"),
						callback : function(isOK){
							if(isOK){
								actualSaveItem();
							} else {
								itemValue.val(originalValue);
								itemValue.focus().keyup();
							}
						}
					});
				} else {
					actualSaveItem();
				}
			};
			
			function virtualSaveItem(){
				var optionItem = optionsetManager.newItem(
						itemName.val(), itemValue.val(), itemDesc.val());

				optionsetManager.getSelectedRow().find(".itemName").text(optionItem.name);
				optionsetManager.getSelectedRow().find(".itemValue").text(optionItem.value);
			};
			function selectItem(selector){
				$(selector, context).addClass("active");
				$(selector, context).siblings("tr").removeClass("active");
			};
			
			optionsetManager.setupEvent=function(){
				//点击添加选项
				$("#addOptionItem", context).click(function(){
					//设置列表
					var newValue = "item";
					if(optionsetManager.isItemValueExist(newValue)){
						newValue = optionsetManager.getIdentityValue(newValue, 1);
					}
					var item = optionsetManager.newItem(i18n.t("optionset.title"), newValue, "");
					optionsetManager.addListRow(item);
					
					//初始化表单
					optionsetManager.setItemForm(item.name, item.value, item.description);
					itemName.select();
					itemName.focus();
				});

				//点击删除选项
				$("#delOptionItem", context).click(function(){
					if(optionsetManager.getSelectedRow().length > 0){
						if(action == "edit" && isOriginalItem()){
							$.messageBox.confirm({
								message : i18n.t("optionset.refDeleteAlert"),
								callback : function(isOK){
									if(isOK){
										actualDeleteItem();
									}
								}
							});
						} else {
							actualDeleteItem();
						}
					}
					return false;
				});
				
				//点击清空所有选择项
				$("#emptyOptionItem", context).click(function(){
					if(optionsetManager.getRowList().length > 0){
						$.messageBox.confirm({
							message : i18n.t("optionset.clearAllAlert"),
							callback : function(isOK){
								if(isOK){
									optionsetManager.getRowList().remove();
									optionsetManager.unselectAllItem();
									itemTable.hide();
								}
							}
						});
					}
					return false;
				});
				//输入标签名称时
				itemName.blur(function(){
					//自动生成值
					if(itemValue.val() == null || itemValue.val() == ""){
						itemValue.val($(this).toPinyin().replace(/\s*/g,''));
						var newValue = itemValue.val();
						if(optionsetManager.isItemValueExist(newValue)){
							newValue = optionsetManager.getIdentityValue(newValue, 1);
						}
						itemValue.val(newValue);
					}
				});
				itemName.keyup(virtualSaveItem);
				itemName.blur(optionsetManager.saveWhenBlurAndValid);
				itemValue.keyup(virtualSaveItem);
				itemValue.blur(optionsetManager.saveWhenBlurAndValid);
				itemDesc.keyup(virtualSaveItem);
				itemDesc.blur(optionsetManager.saveWhenBlurAndValid);
				$("#optionSetsItem", context).on("click","tr",function(){
					var item = $(this).data("item");
					optionsetManager.unselectAllItem();
					$(this).addClass("active");
					itemTable.show();

					itemName.val(item.name).focus();
					itemValue.val(item.value);
					itemDesc.val(item.description);
				});
				$("#optionSetsItem", context).on("click","tr",function(){
					selectItem(this);
				});
				$("#upOptionItem", context).click(function(){
					var currentOptionItem=$("#optionSetsItem", context).children("tr.active");
					var index=currentOptionItem.index();
					var replaceIndex=0;
					if(index>1){
						replaceIndex=index-1;
						$("#optionSetsItem", context).children("tr:eq("+replaceIndex+")").before(currentOptionItem);
					}
				});
				$("#downOptionItem", context).click(function(){
					var currentOptionItem=$("#optionSetsItem", context).children("tr.active");
					var len=$("#optionSetsItem", context).children("tr").length;
					var index=currentOptionItem.index();
					var replaceIndex=0;
					if(index>0&&index<len-1){
						replaceIndex=index+1;
						$("#optionSetsItem", context).children("tr:eq("+replaceIndex+")").after(currentOptionItem);
					}
				});
			};
			
			
			return optionsetManager;
		}
};
});
//var OptionsetManager=;