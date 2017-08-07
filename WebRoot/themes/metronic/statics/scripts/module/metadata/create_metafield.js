define(["require","./OptionsetManager"],function(require,OptionsetManager){
	var $=jQuery;
	return {
		options:{},
		createNew:function(_options){
			var metaFieldManager={};
			//私有变量初始化
			var action = _options.action;
			var context = _options.context;
			var options=_options.options;
			var entityName=_options.entityName;
			var classifiedCascadeFields=_options.classifiedCascadeFields;
			var manyToOneEntityUrl=_options.manyToOneEntityUrl;
			var optionSets=_options.optionSets;
			var dataTypes=_options.dataTypes;
			var fieldTypes=_options.fieldTypes;
			var displayFor=_options.displayFor;
			var field=_options.field||{};
			//consolelog(_options);
			
			
			var itemTable = $("#itemTable", context);
			var itemName = $("#itemName", context);
			var itemValue = $("#itemValue", context);
			var itemDesc = $("#itemDesc", context);
			var defaultValueSelect = $("select[name='defaultValue']", context);
			var defaultValueInput = $("input[name='defaultValue']", context);
			var i18nNotAssignValue=i18n.t("metafield.notAssignValue");
			
			
			/**Begin 界面显示信息初始化**/
			$("#displayName", context).focus();
			$("#semanticsTip", context).popover({trigger : "hover"});
			if(action != "edit"){
				$(".ui-dialog-title")
					.html(i18n.t("metafield.createTitle",entityName));
				$("#isNullable1", context).attr("checked", "checked");
			} else {
				$(".ui-dialog-title")
					.html(i18n.t("metafield.editTitle",entityName,field.displayName));
			}
			Page.init(context);
			/**End 界面显示信息初始化**/
			/**Begin 公共方法定义**/
		 	function setOptions(jqObj,options,empty){
		 		if(!!empty){
		 			$(jqObj, context).empty();
		 		}
		 		for(var i=0;i<options.length;++i){
		 			$(jqObj, context).append("<option value='"+options[i].value+"'>"+options[i].name+"</option>");
		 			if(options[i]["isDefault"] == true){
		 				defaultValueSelect.val(options[i].value);
		 			}
		 		}
		 		if(field.defaultValue){
		 			defaultValueSelect.val(field.defaultValue);
		 		}
		 	};
		 	function show(jqObj){
		 		$(jqObj, context).show();
				$(".dataTypeDetail", context).children("tr").not(jqObj).hide();
		 	};
		 	/**End 公共方法定义**/
			/**Begin 名称和显示名称联动**/
			$("[name='isDisplay']", context).click(function(){
				var value=$(this).val();
				if(value=="true"){
					$(".isDisplay", context).show();
				}else{
					$(".isDisplay", context).hide();
				}
			});
			if(action != "edit"){
				$("[name='displayName']", context).keyup(function(){
					$("#isIdentity+#name", context).val($(this).toPinyin().replace(/\s*/g,''));
				});
			}
			/**End 名称和显示名称联动**/
			/**Begin 选项集相关操作定义**/
			//选项集修改按钮激活设置
		 	function reloadBtnStatus(){
				var val = $("[name='optionSetName']", context).val();
				if(val == ""){
					$("button.itemOperationEdit", context).attr("disabled", "disabled");
				} else {
					$("button.itemOperationEdit", context).removeAttr("disabled");
				}
			};
			$("[name='useExistedSet']", context).click(function(){
				var useExistedSet=$(this).val();
				setOptions(defaultValueSelect,[{value:"",name:i18nNotAssignValue}],true);
				if(useExistedSet=="true"){
					$(".useExistedSetTrue", context).show();
					$(".useExistedSetFalse", context).hide();
					reloadBtnStatus();
				}else{
					$(".useExistedSetTrue", context).hide();
					$(".useExistedSetFalse", context).show();
				}
			});
			function optionSetsConfig(){
				var optionSetName=$("[name='optionSetName']", context).val();
				if(!optionSetName){
					$("[name='useExistedSet'][value='false']", context).trigger("click");
				}else{
					$("[name='useExistedSet'][value='true']", context).trigger("click");
				}
			};
			//选项集编辑界面调用公共的optionsetManager处理
			var __options={action:action,options:options,context:context};
			var optionsetManager=OptionsetManager.createNew(__options);
			optionsetManager.setupEvent();
			//获取是否使用现有选项集
			function getUseExistedSet(){
				return $("[name='useExistedSet']:checked", context).val();
			};
			function chkChangingDefaultValue(){
				
				var theValue = itemValue.val();
				if(isOtherItemValueExist(theValue)){
					itemValue.val(getIdentityValue("item", 1));
				}
				var optionItem = newItem(
						itemName.val(), itemValue.val(), itemDesc.val());

				optionsetManager.getSelectedRow().find(".itemName").text(optionItem.name);
				optionsetManager.getSelectedRow().find(".itemValue").text(optionItem.value);
				
				var item = optionsetManager.getSelectedRow().data("item");
				if(optionsetManager.isDefaultItem(item) && item.value != itemValue.val()){
					$.messageBox.warning({
						message : i18n.t("optionset.option.defaultValueChangeAlert"),
						callback : function(isOK){
							optionsetManager.saveWhenBlurAndValid();
						}
					});
					defaultValueSelect.val("");
				} else {
					optionsetManager.saveWhenBlurAndValid();
				}
			};
			
			defaultValueSelect.focus(function(){
				var value=$(this).val();
				var fieldType=getRealFieldType();
				if((fieldType=="SingleOption"||fieldType=="MultiOptions"||fieldType=="Boolean") 
						&& getUseExistedSet() == "false"){
					$(this).empty().append("<option value=''>"+i18nNotAssignValue+"</option>");
					var list = optionsetManager.getRowList();
					for ( var i = 0; i < list.length; i++) {
						var one = $(list[i]).data("item");
						var option = "<option value='" + one.value + "'>" + one.name + "</option>";
						$(this).append(option);
					}
				}
				if(value){
					$(this).val(value);
				}
			});

			function getOptions(optionSetName,items){
				var optionSet=null;
				var options=null;
				var optionsResult=[{value:"",name:i18nNotAssignValue}];
				for(var i=0;i<optionSets.length;++i){
					if(optionSets[i].name==optionSetName){
						optionSet=optionSets[i];
						options=optionSets[i].options;
						break;
					}
				}
				if(optionSet&&options){
					for(var j=0;j<options.length;++j){
						optionsResult.push({
							value:options[j].value,
							name:options[j].name,
							isDefault: options[j].isDefault
						});
					}
				}
				if(items){
					$.each(items,function(i,item){
						optionsResult.push(item);
					});
				}
				return optionsResult;
			};
			
			$("[name='optionSetName']", context).change(function(){
				var optionSetName=$(this).val();
				if(!optionSetName){
					setOptions(defaultValueSelect,[{value:"",name:i18nNotAssignValue}],true);
				}else{
					var items=[];
					if(optionSetName==="XingBieShuZi"){
						items.push({value:"@{env.UserEntity.sex}",name:"当前用户性别"});
					}
					setOptions(defaultValueSelect,getOptions(optionSetName,items),true);
				}
			});
			
			$("[name='optionSetName']", context).change(function(){
				reloadBtnStatus();
			});
			
			
			//非树型选项修改
			$("a#listOptionsetEdit", context).click(function(){
				var url = Global.contextPath + $(this).data("url");
				var optionset = $("#optionSetName", context).val();
				url=Urls.urlParam(url,[{key:"id",value:optionset},{key:"action",value:"edit"},{key:"type",value:"list"}]);
				$.openLink(url, {width : 800}, function(response){
					if($.dialogReturnValue() == 1){
						reloadOptionSetName();
					}
				});
			});
			//树型选项修改
			$("a#treeOptionsetEdit", context).click(function(){
				var url = Global.contextPath + $(this).data("url");
				var optionset = $("#optionSetName", context).val();
				url=Urls.urlParam(url,[{key:"id",value:optionset},{key:"action",value:"edit"},{key:"type",value:"tree"}]);
				$.openLink(url, {width : 800}, function(response){
					if($.dialogReturnValue() == 1){
						reloadOptionSetName();
					}
				});
			});
			//非树型选项新建
			$("#listOptionsetCreate", context).click(function(){
				var url = Global.contextPath + $(this).data("url");
				$.openLink(url, {width : 800}, function(response){
					if($.dialogReturnValue() == 1){
						reloadOptionSetName();
					}
				});
			});
			//树型选项新建
			$("#treeOptionsetCreate", context).click(function(){
				var url = Global.contextPath + $(this).data("url");
				$.openLink(url, {width : 800}, function(response){
					if($.dialogReturnValue() == 1){
						reloadOptionSetName();
					}
				});
			});
			
			function reloadOptionSetName(){
				$.restGet(Global.contextPath + "/metadata/optionset/all", null, function(resp){
					if(resp != null){
						var optionset = resp;
						optionset = [{name:"--- "+i18n.t("common.select")+" ---", value:""}].concat(optionset);
						setOptions("#optionSetName", optionset, true);
						reloadBtnStatus();
					}
				});
			};
			/**End 选项集相关操作定义**/
			
			$("#expressionButton", context).click(function(){
				$(this).hide();
				$(".expression", context).show();
				$("#changingColspan").removeAttr("colspan");
			});
			
			$(".expression select", context).change(function(){
				var regValue = $(this).val();
				defaultValueInput.val(regValue);
				if(regValue == ""){
					$("#expressionButton", context).show();
					$(".expression", context).hide();
					$("#changingColspan").attr("colspan", "3");
				}
			});
			
			function getDataOptions(addDefault){
				var dataOptions=[];
				if(addDefault){
					dataOptions.push({value:"",name:i18nNotAssignValue});
				}
				var options=$("#optionSetsItem", context).children("tr:gt(0)");
				for(var i=0;i<options.length;++i){
					dataOptions.push($(options[i], context).data("item"));
				}
				return dataOptions;
			};
			function formatDisplayFor(_displayFor){
				var obj = {};
				if(null != _displayFor){
					var list = _displayFor.split(",");
					for ( var i = 0; i < list.length; i++) {
						var temp = list[i];
						obj[temp + ""] = true;
					}
					if(!obj.form) obj.form = false;
					if(!obj.list) obj.list = false;
				} else {
					obj = {form : false, list : false};
				}
				return obj;
			};
			var ___context=$(context).closest(".ui-dialog-wrapper");
			if(___context.length<1){
				___context=context;
			}
			$(".saveMetaField", ___context).click(function(){
				
				var valInfo = $.validation.validate("#createFieldForm") ;
				if( valInfo.isError ) {
					return false;
				}
				var btnSelf=$(this);
				var url=$("#createFieldForm", context).attr("action");
				var data=$("#createFieldForm", context).toJson();
				var displayFor = data.displayFor;
				data.displayFor = formatDisplayFor(displayFor);
				data.fieldType=getRealFieldType();
				data.defaultValue = getDefaultValueFrom(data.fieldType);
				var extAttributes={};
				extAttributes['options']=JSON.stringify(getDataOptions());
				var $useExistedSetDom=$("[name='useExistedSet']:checked", context);
				var $optionSetNameDom=$("[name='optionSetName']", context);
				if($optionSetNameDom.length>0){
					if($optionSetNameDom.val()!='' && $optionSetNameDom.val()){
						extAttributes['optionSet']=$optionSetNameDom.val();
					}
				}
				var fieldType=$("[name='fieldType']",context).val();
				if($useExistedSetDom.length>0){
					if($useExistedSetDom.val()=="true"){
						extAttributes['options']=null;
					}else{
						extAttributes['optionSet']=null;
					}
				}
				if(fieldType=="CascadeOption"){
					extAttributes['options']=null;
					var cascadeOptionSource=$("[name='optionSource']:checked",context).val();
					if(cascadeOptionSource=='entity'){
						extAttributes['optionSet']=null;
					}else{
						data.lookupValue=null;
					}
				}
				data["extAttributes"]=extAttributes;
//		 		var $widthDom=$("[name='width']", context);
//		 		var $heightDom=$("[name='height']", context);
//		 		var fieldTypeParams={};
//		 		if($widthDom.length>0 && $heightDom.length>0){
//		 			fieldTypeParams['width']=$widthDom.val();
//		 			fieldTypeParams['height']=$heightDom.val();
//		 		}
//		 		data["fieldTypeParams"]=fieldTypeParams;
				var fieldTypeParams = {};
				$('.fieldTypeAttrs input, .fieldTypeAttrs select,.fieldTypeAttrs textarea', context).each(function(index){
					var $t = $(this);
					var name = $t.attr('name'), val = $t.val();
					if(!$t.hasClass("select-autocode-rule")){
						fieldTypeParams[name] = val;
					}
				});
				data["fieldTypeParams"]=fieldTypeParams;
				
				if(!data.fieldType){
					data.fieldType=null;
				}
				jQuery.restPost(url,data,function(response){
					jQuery.dialogReturnValue(response);
					$(context).dialogClose();
				},{beforeSend:function(xhr){
					CommonUtil.showLoading(context,i18n.t("common.processing"));
					btnSelf.attr("disabled","disabled");
					btnSelf.addClass("disabled");
				  },complete:function(xhr,textStatus){
						CommonUtil.hiddenLoading();
						btnSelf.removeAttr("disabled");
						btnSelf.removeClass("disabled");
				  }
				});
			});
			/**获取数据类型默认值**/
			function getDefaultValueFrom(fieldType){
				if(fieldType=="SingleOption"||fieldType=="MultiOptions"||fieldType=="Boolean"){
					return defaultValueSelect.val();
				}else{
					return defaultValueInput.val();
				}
			};
			
			
			function findDataType(dataTypeName){
				if(!dataTypes){
					return null;
				}
				var i=0,len=dataTypes.length;
				for(i=0;i<len;++i){
					if(dataTypes[i].name==dataTypeName){
						return dataTypes[i];
					}
				}
				return null;
			};
			
			$("#semantics", context).change(function(event){
				var tips = "#semantics+a+.tips";
				var entity = entityName;
				var _field = field.name;
				var checkUrl = Global.contextPath+"/metadata/field/isSemanticsExist";
				var semantics = $(event.target, context).val();
				if(null != semantics && semantics != ""){
					$.get(checkUrl, 
						{"entity" : entity, "semantics" : semantics, "field" : _field},
						function(response){
							var result = response;
							if(result == true){
								$(tips, context).html("<span class='label label-warning'>" + 
										"注意：该含义已被定义在其它字段，重复定义将擦除其它字段的该含义。</span>");
							} else {
								$(tips, context).text("");
							}
						}
					);
				} else {
					$(tips, context).text("");
				}
			});
			/**Begin field type ***/
			//consolelog("字段类型初始值：field.fieldType");
			
			//consolelog("字段类型来了-所有字段类型如下：");
			//consolelog(fieldTypes);
			//consolelog("所有数据类型如下：");
			//consolelog(dataTypes);
			function getRealFieldType(){
				var result=null;
				var fieldType=$("[name=fieldType]",context).val();
				var formatType=$("[name=fieldFormat]",context).val();
				if($(".formatType",context).css("display")=='none'){
					result=  fieldType;
				}else{
					result= formatType;
				}
				return result;
			};
			function resetFormat(formats){
				//consolelog("开始重设字段类型格式：");
				//consolelog(formats);
				var _compatibleFieldTypes=null;
				if(action=='edit'){
					_compatibleFieldTypes=getCompatibleFieldTypesByDataType(field.dataType);
					//consolelog('与数据类型field.dataType兼容的字段类型有');
					//consolelog(_compatibleFieldTypes);
				}
				var options=[];
				for(var i=0;i<formats.length;++i){
					var ___format=formats[i];
					var value=___format.name,text=___format.displayName||value;
					var __fieldType;
					if(action=="edit"){
						__fieldType=findFieldTypeByName(formats[i].name,_compatibleFieldTypes);
						if(__fieldType){
							options.push("<option value='"+value+"'>"+text+"</option>");
						}
					}else{
						__fieldType=findFieldTypeByName(formats[i].name);
						//隐藏非管理格式
						//var isManage=(__fieldType&&__fieldType.displayFor&&__fieldType.displayFor.manage===false);
						//var isManage=!!__fieldType;
						if(__fieldType){
							options.push("<option value='"+value+"'>"+text+"</option>");
						}
					}
				}
				$("[name=fieldFormat]",context).html(options.join(""));
				if(action=='edit'){
					var _fieldType=$("[name=fieldType]",context).val();
					//consolelog("resetFormat:"+_fieldType);
					if(!_fieldType){
						$("[name=fieldFormat]",context).val(field.fieldType);
						var _childFieldType=findFieldTypeByName(_fieldType);
						$("[name=fieldFormat]",context).val(_childFieldType.groupType);
					}
				}
			};
			function resetInputType(inputTypes){
				var inputTypeMap={"Tile":i18n.t("metafield.inputtype.tile"),"Dropdown":i18n.t("metafield.inputtype.dropdown"),"popup":i18n.t("metafield.inputtype.popup")};
				var options=[];
				for(var i=0;i<inputTypes.length;++i){
					var value=inputTypes[i],text=inputTypeMap[value]||value;
					options.push("<option value='"+value+"'>"+text+"</option>");
				}
				$("[name=inputType]",context).html(options.join(""));
				if(action=='edit'){
					$("[name=inputType]",context).val(field.inputType);
				}
			};
			function findFieldTypeByName(fieldTypeName,fieldTypesArray){
				var _fieldTypes=fieldTypesArray||fieldTypes;
				for(var i=0;i<_fieldTypes.length;++i){
					if(_fieldTypes[i].name==fieldTypeName){
						return fieldTypes[i];
					}
				}
				return null;
			};
			function resetFormatsAndInputTypes(fieldTypeName){
				//consolelog("重设字段类型的格式和输入类型:"+fieldTypeName);
				if(!fieldTypeName){
					return false;
				}
				var fieldType=findFieldTypeByName(fieldTypeName);
				//consolelog("重设字段类型为：");
				//consolelog(fieldType);
				if(action != "edit"){
					if(fieldType.dataType){
						$("[name=dataType]",context).val(fieldType.dataType);
					}
				}
				if(fieldType){
					var candidateFormats=fieldType.childs;
					if(candidateFormats&&candidateFormats.length>0){
						resetFormat(candidateFormats);
						$(".formatType",context).show();
					}else{
						resetFormat([{name:"",displayName:" "}]);
						$(".formatType",context).hide();
					}
					var candidateInputs=fieldType.candidateInputTypes;
					if(candidateInputs&&candidateInputs.length>0){
						resetInputType(candidateInputs);
						$(".inputType",context).show();
					}else{
						resetInputType([""]);
						$(".inputType",context).hide();
					}
				}
			};
			function dataTypesEquals(dataType1,dataType2){
				if(!dataType1||!dataType2){
					return false;
				}
				if(dataType1==dataType2){
					return true;
				}
				var _dataType1=findDataType(dataType1);
				var _dataType2=findDataType(dataType2);
				if(!_dataType1||!_dataType2){
					return false;
				}
				if(!_dataType1.originalType||!_dataType2.originalType){
					return false;
				}
				if(_dataType1.originalType==_dataType2.originalType){
					return true;
				}
			};
			function getCompatibleFieldTypesByDataType(dataTypeName){
				//consolelog("Begin 获取兼容字段类型，通过dataType:"+dataTypeName);
				if(!dataTypeName){
					return [];
				}
				var _fieldType=null;
				var _mappingDataTypes=null;
				var _dataTypeName=null;
				var _fieldTypes=[];
				for(var i=0;i<fieldTypes.length;++i){
					_fieldType=fieldTypes[i];
					_mappingDataTypes=_fieldType.mappingDataTypes;
					if(dataTypeName==_fieldType.dataType){
						_fieldTypes.push(_fieldType); 
					}else if(_mappingDataTypes&&_mappingDataTypes.length>0){
						for(var j=0;j<_mappingDataTypes.length;++j){
							_dataTypeName=_mappingDataTypes[j];
							if(dataTypesEquals(_dataTypeName,dataTypeName)){
								_fieldTypes.push(_fieldType); 
							}
						}
					}
				}
				//consolelog(_fieldTypes);
				//consolelog("End 获取兼容字段类型，通过dataType");
				return _fieldTypes;
			};
			function resetFieldTypesByDataType(dataTypeName,__fieldtype){
				if(!dataTypeName){
					return false;
				}
				var fieldTypes=getCompatibleFieldTypesByDataType(dataTypeName);
				var options=[];
				var _fieldType=null;
				for(var i=0;i<fieldTypes.length;++i){
					_fieldType=fieldTypes[i];
					if(_fieldType.isRoot){
						var value=_fieldType.name,text=_fieldType.displayName||value;
						options.push("<option value='"+value+"'>"+text+"</option>");
					}
				}
				$("[name=fieldType]",context).html(options.join(""));
				$("[name=fieldType]",context).val(__fieldtype);
				$("[name=fieldType]",context).trigger("change");
			};
			function findOptionSourceByParentField(parentField){
				classifiedCascadeFields=classifiedCascadeFields||{optionSet:{},entity:{}};
				if(classifiedCascadeFields.optionSet[parentField]){
					return "optionSet";
				}else if(classifiedCascadeFields.entity[parentField]){
					return "entity";
				}else{
					return null;
				}
			}
			function resetFieldTypeAttrs(fieldTypeName){
				//consolelog("重置特殊字段类型属性："+fieldTypeName);
				if(fieldTypeName=="Boolean"){
					setOptions($(defaultValueSelect, context),
							[{value:"", name:i18nNotAssignValue},{value:"1",name:i18n.t("common.yes")},{value:"0",name:i18n.t("common.no")}],true);
					show(".yesOrNo");
				}else if(fieldTypeName=="SingleOption"||fieldTypeName=="MultiOptions"){
					show(".picklist");
					$("[name='useExistedSet']",context).removeAttr("disabled");
					optionSetsConfig();
				}else if(fieldTypeName=="CascadeOption"){
					$("[name='parentField']",context).change(function(){
						var parentField=$(this).val();
						//根据parentField的字段数据来源确定当前字段的数据来源，不可改变
						var initialOptionSource=field.optionSource;
						//consolelog("initialOptionSource:");
						//consolelog(initialOptionSource);
						var parentOptionSource=findOptionSourceByParentField(parentField)||initialOptionSource||"entity";
						//consolelog(parentOptionSource);
						if(parentField){
							$("[name='optionSource']",context).attr("disabled","disabled");
							$(".inputType",context).hide();
							$("[name='inputType']",context).val("");
						}else{
							$("[name='optionSource']",context).removeAttr("disabled");
							$(".inputType",context).show();
						}
						$("[name='optionSource'][value='"+parentOptionSource+"']",context).attr("checked","checked");
						$("[name='optionSource']",context).change();
					}).change();
				}else{
					show(".defaultValueInput");
				}
			};
			$("[name='optionSource']",context).change(function(){
				setOptions(defaultValueSelect,[{value:"",name:i18nNotAssignValue}],true);
				var parentField=$("[name='parentField']",context).val();
				var optionSource=$("[name='optionSource']:checked",context).val();
				if(optionSource=="entity"){
					show(".cascadeOption,.cascadeOption-entity");
					if(parentField){//子字段
						$("[name='handleUnusedChild']",context).closest("tr").hide();
						var url=Urls.urlParam(manyToOneEntityUrl,[{key:"entity",value:entityName},{key:"field",value:parentField}]);
						$.restGet(url,function(resp){
							if(resp){
								//consolelog("manyToOne");
								//consolelog(resp);
								var options=[];
								for(var i in resp){
									options.push({value:i,name:resp[i]});
								}
								setOptions($("select[name='lookupValue']",context),options,true);
							}
						});
					}else{//最高层父字段
						$("[name='handleUnusedChild']",context).closest("tr").show();
					}
				}else{
					if(parentField){//子字段
						show(".cascadeOption");
						$("[name='handleUnusedChild']",context).closest("tr").hide();
					}else{//最高层父字段
						show(".cascadeOption,.cascadeOptionParent-optionSet");
						$("[name='useExistedSet'][value=true]",context).attr("checked","checked");
						$("[name='useExistedSet'][value=true]",context).trigger("click");
						$("[name='useExistedSet']",context).attr("disabled","disabled");
					}
				}
			});
			//fieldtypes support unique
			var uniqueFieldTypesMap={"Text":true,"Int":true,"FloatNumber":true,"Decimal":true};
			function resetBaseAttrs(fieldType){
				var $uniqueDom=$("[name=isUnique]",context);
				var $uniqueCheckedDom=$("[name=isUnique]:checked",context);
				var isUnique=$uniqueCheckedDom.val()==="true";
				if(action == "create"){
					if(uniqueFieldTypesMap[fieldType]){
						$uniqueDom.prop("disabled",false);
					}else{
						$uniqueDom.prop("disabled",true);
						$("[name=isUnique][value=false]",context).prop("checked",true);
					}
					if($.uniform){
						$.uniform.update($("[name=isUnique]",context));
					}
				}else if(action=="edit"){
					if(isUnique){
						if(uniqueFieldTypesMap[fieldType]){
							return true;
						}else{
							$.messageBox.info({
								message : "有唯一约束的字段不可切换到当前字段类型"
							});
							return false;
						}
					}
				}
				return true;
			};
			var currentFieldType=$("[name=fieldType]",context).val();
			$("[name=fieldType]",context).change(function(){
				var fieldType=$(this).val();
				var canContinue=resetBaseAttrs(fieldType);
				if(!canContinue){
					$("[name=fieldType]",context).val(currentFieldType);
					return false;
				}
				currentFieldType=fieldType;
				//consolelog("字段类型改变："+fieldType);
				//字段类型变动时，重新设置字段类型的格式和输入类型
				resetFormatsAndInputTypes(fieldType);
				//consolelog("End resetFormatsAndInputTypes");
				//根据字段类型动态加载字段扩展属性参数
				reloadFieldTypeAttrs();
				//consolelog("End reloadFieldTypeAttrs");
				//设置字段类型对应的属性
				resetFieldTypeAttrs(fieldType);
				//consolelog("End resetFieldTypeAttrs");
			});
			$("[name=fieldFormat]",context).change(function(){
				//根据字段类型动态加载字段扩展属性参数
				reloadFieldTypeAttrs();
				//重新设置dataType
				if(action!='edit'){
					var fieldFormat=$(this).val();
					var _fieldType=findFieldTypeByName(fieldFormat);
					$("[name=dataType]",context).val(_fieldType.dataType);
				}
			});
			/**End field type ***/
			/***Begin fieldType 属性动态加载***/
			function reloadFieldTypeAttrs(){
				var fieldType=getRealFieldType();
				var metaFieldName=$("[name=name]",context).val();
				var entityName=$("[name=entity]",context).val();
				if(fieldType){
					CommonLoader.loadData(null,Global.contextPath+"/metadata/fieldtype/attrs?fieldtypename="+fieldType+"&fieldname="+metaFieldName+"&entityname="+entityName,function(htmlResult){
						$(context+" .fieldTypeAttrs").html(htmlResult);
						$(context+" .fieldTypeAttrs").uiwidget();
					},{isShowLoading:false,async:false});
				}
			};
			/***End fieldType 属性动态加载***/
			/****Begin 页面初始化****/
			function initFieldType(){
				//consolelog("initFieldType");
				if(action == "edit") {
					var __fieldType=field.fieldType;
					//字段类型为空，不提供字段类型编辑功能
					if(!__fieldType){
						$("table.dataTypeTableDetail",context).hide();
						return false;
					}
					//编辑时根据数据类型填充兼容的字段类型
					var dataType=$("[name=dataType]",context).val();
					//var fieldType=$("[name=fieldType]",context).val();
					var _fieldType=findFieldTypeByName(field.fieldType);
					//字段类型不是可管理的，不提供字段类型编辑功能
					if(!_fieldType){
						$("table.dataTypeTableDetail",context).hide();
						return false;
					}
					var __fieldtype=$("[name=fieldType]",context).val();
					var __fieldFormat=field.fieldType;
					if(_fieldType&&_fieldType.groupType){
						__fieldtype=_fieldType.groupType;
						//consolelog("字段类型是子类型，重新设置字段类型和格式："+__fieldtype);
					}
					if(!!dataType){
						resetFieldTypesByDataType(dataType,__fieldtype);
						$("[name=fieldFormat]",context).val(__fieldFormat);
					}
				}else{
					//$("[name=fieldType]",context).val("Text");
					$("[name=fieldType]",context).trigger("change");
				}
				//初始化选项集和默认值字段属性
				initDefaultAndOptionSet();
			};
			//初始化选项集和默认值字段属性
			function initDefaultAndOptionSet(){
				var defaultValue=$("#defaultValue-hidden",context).val();
				var useExistedSet=$("[name='useExistedSet']:checked", context).val();
				var optionSetName=$("[name='optionSetName']", context).val();
				var isSelectOptions=(!!options&&options.length>0)||(!!optionSetName)||false;
				if(isSelectOptions&&useExistedSet=="true"){
					$("[name='optionSetName']", context).trigger("change");
					//setOptions(defaultValueSelect,getOptions(optionSetName),true);
					defaultValueSelect.val(defaultValue);
				}else if(isSelectOptions&&useExistedSet=="false"){
					for(var i=0;i<options.length;++i){
						var optionItem=options[i];
						optionsetManager.addListRow(optionItem);
						optionsetManager.unselectAllItem();
						itemTable.hide();
					}
					setOptions(defaultValueSelect,getDataOptions(true),true);
					defaultValueSelect.val(defaultValue);
				}
			};
			function initPage(){
				if($("[name='isDisplay']:checked", context).val()=="true"){
					$(".isDisplay", context).show();
				}
				
				$("input[name=displayFor]", context).attr("checked", "checked");
				if(action == "edit") {
					
					for(position in displayFor){
						if(displayFor[position] == false) {
							$("input[name=displayFor][value=" + position + "]", context).removeAttr("checked");
						}
					}
				} else {
					$("input[name=isNullable][value=true]", context).attr("checked", "checked");
				}
				
				itemTable.hide();
				optionsetManager.getRowTemplate().hide();

				itemName.attr("placeholder", i18n.t("optionset.option.itemNameDesc")).focus();
				itemValue.attr("placeholder", i18n.t("optionset.option.itemValueDesc"));
				itemDesc.attr("placeholder", i18n.t("optionset.option.itemDesc"));
				$(".expression", context).hide();
			};
			initFieldType();
			initPage();
			return metaFieldManager;
		}
	 };
});
//var MetaFieldManager=;
