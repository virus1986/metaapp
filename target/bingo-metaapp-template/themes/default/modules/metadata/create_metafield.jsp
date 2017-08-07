<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../common/taglibs.jsp"%>
<style>
<!--
.useExistedSetFalse .btn-toolbar {
	margin-bottom: 0px;
	margin-top: 0px;
	height: 24px;
}
-->
</style>
<div id="${viewId}" class="panel apply-panel">
<form:form commandName="field" id="createFieldForm" data-widget="validator" action="${requestUri}">
<input id="defaultValue-hidden" type="hidden"  value="${field.defaultValue}" />
<table id="createFieldTable" class="form-table">
<tbody>
	<tr >
	<td style="vertical-align: top;">
		<table class="form-table">
		<caption><spring:message code="common.baseInfo"/></caption>
		<tbody>
			<tr>
				<th><label><spring:message code="common.displayName"/>:</label></th>
				<td><spring:message code="validation.string36" var="v_create_field_1"/>
					<form:input path="displayName" class="input-large" 
						placeholder="${v_create_field_1}"
						data-validator="required,length[1,36]"/>
					<form:hidden path="entity"/>
				</td>
			</tr>
			<tr>
				<th><label><spring:message code="common.name"/>:</label></th>
				<td>
				<form:hidden path="isIdentity"/>
				<c:if test="${action=='edit'}">
					<form:input path="name" disabled="true" class="input-large"/>
				</c:if>
				<c:if test="${action!='edit'}">
				<spring:message code='validation.autoByDisplayName' var="v_create_field_2"/>
				<form:input path="name" class="input-large" 
					placeholder="${v_create_field_2}"
					data-validator="required,length[1,36],name,func[fieldNameUnique]"/>
				<span class="label label-info"><spring:message code="validation.nameSpec"/></span>
				</c:if>
				</td>
			</tr>
			<tr>
				<th><label><spring:message code="metadata.field.requiredOrNot"/>:</label></th>
				<td>
				<c:if test="${field.isColumnNullable!=false}">
					<form:radiobutton path="isNullable" value="false"/><spring:message code="common.yes"/>
					<form:radiobutton path="isNullable" value="true"/><spring:message code="common.no"/>
				</c:if>
				<c:if test="${field.isColumnNullable==false}">
					<form:radiobutton path="isNullable" disabled="true" value="false"/><spring:message code="common.yes"/>
					<form:radiobutton path="isNullable" disabled="true" value="true"/><spring:message code="common.no"/>
				</c:if>
				</td>
			</tr>
			<tr>
				<th><label><spring:message code="metadata.field.uniqueOrNot"/>:</label></th>
				<td>
				<c:if test="${field.isUnique!=false||action=='create'}">
					<form:radiobutton path="isUnique" value="true"/><spring:message code="common.yes"/>
					<form:radiobutton path="isUnique" value="false"/><spring:message code="common.no"/>
				</c:if>
				<c:if test="${field.isUnique==false&&action!='create'}">
					<form:radiobutton path="isUnique" disabled="true" value="true"/><spring:message code="common.yes"/>
					<form:radiobutton path="isUnique" disabled="true" value="false"/><spring:message code="common.no"/>
				</c:if>
				</td>
			</tr>
			<tr>
			<th><label><spring:message code="common.description"/>:</label></th>
				<td><spring:message code='validation.string1000Sec' var="v_create_field_3"/>
				<form:textarea path="summary" class="shortArea" 
				 	data-validator="length[0,1000]"
					placeholder="${v_create_field_3}"/>
				</td>
			</tr>
		</tbody>
	</table>
	
	</td>
	</tr>
	
	<tr >
	<td style="vertical-align: top;">
		<table class="form-table">
			<caption><spring:message code="metadata.field.displayInfo"/></caption>
				<tbody>
					<tr>
						<th><label><spring:message code="metadata.field.semantics"/>:</label></th>
						<td><spring:message code="metadata.field.semantics.descPrefix"/>
							<form:select path="semantics"  
									class="input input-large" data-validator="func[isSemanticsExist]">
								<form:option value=""><spring:message code="metadata.field.semantics.normal"/></form:option>
								<hr/>
								<form:options items="${semantics}"/>
							</form:select>
							<a href="javascript://" rel="popover" data-content='<spring:message code="metadata.field.semantics.desc"/>' id="semanticsTip"
								data-original-title='<spring:message code="metadata.field.semantics.descTitle"/>'><i class="icon-question-sign"></i></a>
							<span class="tips"></span>
						</td>
					</tr>
					<tr>
						<th><label><spring:message code="metadata.field.defaultDisplay"/>:</label></th>
						<td>
<%-- 							<form:checkboxes items="${displayForMap}" path="displayFor" /> --%>
							
							<span>
								<input id="displayFor1" name="displayFor" type="checkbox" value="form">
								<label for="displayFor1"><spring:message code="metadata.field.defaultDisplay.form"/></label>
							</span>
							<span>
								<input id="displayFor2" name="displayFor" type="checkbox" value="list">
								<label for="displayFor2"><spring:message code="metadata.field.defaultDisplay.view"/></label>
							</span>
							
						</td>
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
	
	<tr>
	<td style="vertical-align: top;">
		<table class="form-table dataTypeTableDetail">
		<caption><spring:message code="metadata.field.selectFieldType"/></caption>
			<tbody class="fieldTypeDetail">
				<tr class="hide">
					<th><label><spring:message code="metadata.field.selectFieldType.dataType"/>:</label></th>
					<td colspan="3">
					<form:input disabled="true" path="dataType"/>
					</td>
				</tr>
				<tr class="fieldType">
					<th><label><spring:message code="metadata.field.selectFieldType.fieldType"/>:</label></th>
					<td colspan="3"><spring:message code="common.optionNullText" var="v_create_field_4"/>
						<form:select path="fieldType">
						<form:option value="" label="${v_create_field_4}"/>
						<form:options items="${fieldTypesMap}" />
						</form:select>
					</td>
				</tr>
				<tr class="formatType hide">
					<th><label><spring:message code="metadata.field.selectFieldType.format"/>:</label></th>
					<td colspan="3">
						<select name="fieldFormat">
						<option value=""></option>
						</select>
					</td>
				</tr>
				<tr class="inputType hide">
					<th><label><spring:message code="metadata.field.selectFieldType.inputType"/>:</label></th>
					<td colspan="3">
						<select name="inputType">
						<option value="">  </option>
						</select>
					</td>
				</tr>
			</tbody>
			<tbody class="dataTypeDetail">
				<tr class='defaultValueInput'>
					<th><label><spring:message code="common.defaultValue"/>:</label></th>
					<td colspan="2" id="changingColspan"><spring:message code="metadata.field.defaultValue.placeholder" var="v_create_field_5"/>
					<form:input id="defaultValue1" path="defaultValue" class="input-large"
						placeholder="${v_create_field_5}"/>
					<button id="expressionButton" class="btn btn-mini" type="button"><spring:message code="metadata.field.defaultValue.desc"/></button>
					</td>
					
					<th class="expression">
						<label><i class="icon-arrow-left"></i> <spring:message code="metadata.field.expression"/>:</label>
					</th>
					<td class="expression">
					<select>
						<option value=""><spring:message code="metadata.field.expression.null"/></option>
						<option value="@{env.Now}"><spring:message code="metadata.field.expression.currentTime"/></option>
						<option value="@{env.User.Id}"><spring:message code="metadata.field.expression.currentUserId"/></option>
						<option value="@{env.User.Name}"><spring:message code="metadata.field.expression.currentUserName"/></option>
						<option value="@{env.Guid}"><spring:message code="metadata.field.expression.guid"/></option>
					</select>
					</td>
				</tr>
			</tbody>
			<tbody class="fieldTypeAttrs">
			</tbody>
			<tbody class="dataTypeDetail">
				<tr class="cascadeOption">
					<th><label><spring:message code="metadata.field.cascade.datasource"/>:</label></th>
					<td colspan="3">
						<input type="radio" name="optionSource" value="optionSet"/><spring:message code="metadata.optionset"/>
						<input type="radio" name="optionSource" value="entity"/><spring:message code="metadata.entity"/>
					</td>
				</tr>
				<tr class="cascadeOption-entity">
					<th><label><spring:message code="metadata.refentity"/>:</label></th>
					<td colspan="3">
						<form:select path="lookupValue">
						<form:option value="" label="${v_create_field_4}"/>
						<form:options items="${entityMap}" />
						</form:select>
					</td>
				</tr>
				<tr class="picklist">
					<th><label><spring:message code="metadata.field.cascade.useExistedOptionset"/>:</label></th>
					<td colspan="3">
						<input type="radio" name="useExistedSet" <c:if test='${field.useExistedSet==true}'>checked="checked"</c:if> value="true"/><spring:message code="common.yes"/>
						<input type="radio" name="useExistedSet" <c:if test='${field.useExistedSet==false}'>checked="checked"</c:if> value="false"/><spring:message code="common.no"/>
					</td>
				</tr>
				<tr class="picklist useExistedSetTrue cascadeOptionParent-optionSet">
					<th><label><spring:message code="metadata.optionset"/>:</label></th>
					<td colspan="3">
						<form:select path="optionSetName" class="input-large">
							<form:option value="" label="${v_create_field_4}"/>
							<form:options items="${optionSetsMap}" />
						</form:select>
						<div class="btn-group" style="display:inline-block;vertical-align: middle;">
							<button class="btn btn-mini itemOperationEdit dropdown-toggle" data-toggle="dropdown">
                			<i class="icon-edit"></i> <spring:message code="common.edit"/><span class="caret"></span></button>
              				<ul class="dropdown-menu">
                 				<li><a id="listOptionsetEdit" data-url="/metadata/optionset/create" href="javascript://"><spring:message code="common.as"/><spring:message code="metadata.optionset.listType"/></a></li>
                  				<li><a id="treeOptionsetEdit" data-url="/metadata/optionset/create" href="javascript://"><spring:message code="common.as"/><spring:message code="metadata.optionset.treeType"/></a></li>
                			</ul>
						</div>
						<div class="btn-group" style="display:inline-block;vertical-align: middle;">
                			<button class="btn btn-mini itemOperationCreate dropdown-toggle" data-toggle="dropdown">
                			<i class="icon-plus-sign"></i> <spring:message code="common.create"/><span class="caret"></span></button>
              				<ul class="dropdown-menu">
                 				<li><a id="listOptionsetCreate" data-url="/metadata/optionset/create?type=list" href="javascript://"><spring:message code="metadata.optionset.listType"/></a></li>
                  				<li><a id="treeOptionsetCreate" data-url="/metadata/optionset/create?type=tree" href="javascript://"><spring:message code="common.as"/><spring:message code="metadata.optionset.treeType"/></a></li>
                			</ul>
              			</div>
					</td>
				</tr>
			</tbody>
			<tbody class="dataTypeDetail">	
				<tr class="picklist useExistedSetFalse hide" >
					<th><label><spring:message code="metadata.optionset.manageOptionItems"/>:</label></th>
					<td colspan="1" class="span3">
						<div class="btn-toolbar">
						  <div class="btn-group">
						    <a class="btn" href="javascript://" id="addOptionItem" title="<spring:message code='common.add'/>">
						    	<i class="icon-plus"></i></a>
						    <a class="btn" href="javascript://" id="delOptionItem" title="<spring:message code='common.remove'/>">
						    	<i class="icon-minus"></i></a>
						    <a class="btn" href="javascript://" id="upOptionItem" title="<spring:message code='common.up'/>">
						    	<i class="icon-arrow-up"></i></a>
						    <a class="btn" href="javascript://" id="downOptionItem" title="<spring:message code='common.down'/>">
						    	<i class="icon-arrow-down"></i></a>
						    <a class="btn" href="javascript://" id="emptyOptionItem" title="<spring:message code='common.clear'/>">
						    	<i class="icon-ban-circle"></i></a>
						  </div>
						</div>
						<div class="optionItemsTableCon span3" 
							style="overflow-y: scroll;overflow-x: hidden;">
							<table class="optionItemsTable form-table span3 ">
								<thead class="item-thead span3">
									<tr>
										<th><spring:message code='common.tag'/></th>
										<th><spring:message code='common.value'/></th>
									</tr>
								</thead>
								<tbody id="optionSetsItem">
									<tr class="optionItem span3">
										<td class="itemName"></td>
										<td class="itemValue"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</td>
					<td>
						<div id="createOptionItemForm">
							<table class="form-table" id="itemTable">
								<tbody>
									<tr>
										<th><label><spring:message code='common.tag'/>:</label></th>
										<td><input type="text" name="itemName" value="" id="itemName"
											 class="span3"/></td>
									</tr>
									<tr>
										<th><label><spring:message code='common.value'/>:</label></th>
										<td><input type="text" name="itemValue" value="" id="itemValue"
											 class="span3" /></td>
									</tr>
									<tr>
										<th><label><spring:message code='common.description'/>:</label></th>
										<td><textarea name="itemDescn" class="span3" id="itemDesc"></textarea></td>
									</tr>
					
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			</tbody>
			<tbody class="dataTypeDetail">
				<tr class="picklist yesOrNo">
					<th><label><spring:message code='common.defaultValue'/>:</label></th>
					<td id="defaultValueTd" colspan="3">
						<form:select path="defaultValue"><spring:message code="common.notAssignValue" var="v_create_field_notAssignValue"/>
							<form:option value="" label="${v_create_field_notAssignValue}"/>
							<%-- <form:options items="${generators}"/> --%>
						</form:select>
					</td>
				</tr>
			</tbody>
		</table>
		<div style="height: 26px;"></div>
	</td>
	</tr>
</tbody>
</table>
<div class="ui-dialog-buttonset">
<c:if test="${action!='view'}">
	<button type="button" class="btn btn-primary saveMetaField"><spring:message code='common.save'/></button>
</c:if>
	<button type="button" class="btn closeBtn"><spring:message code='common.cancel'/></button>
</div>
</form:form>
</div>
<script type="text/javascript">
$(function(){
	var action = "${action}";
	var context = "#${viewId}";
	var options=${field.options};
	var entityName="${entity}";
	var optionSets=${optionSets};
	var dataTypes=${dataTypes};
	var fieldTypes=${fieldTypesJson};//字段类型详细信息
	var displayFor = ${_displayFor};
	var fieldDisplayName = "${field.displayName}";
	var fieldName = "${field.name}";
	var fieldDataType = '${field.dataType}';
	var fieldFieldType = '${field.fieldType}';
	var fieldInputType = '${field.inputType}';
	var fieldOptionSource = '${field.optionSource}';
	var fieldDefaultValue='${field.defaultValue}';
	
	var classifiedCascadeFields=${classifiedCascadeFields};
	var manyToOneEntityUrl=Global.contextPath+"/metadata/field/manyToOneEntityNamesMap";
	
	var _options={action:action,context:context,options:options,entityName:entityName,
			classifiedCascadeFields:classifiedCascadeFields,
			manyToOneEntityUrl:manyToOneEntityUrl,
			optionSets:optionSets,dataTypes:dataTypes,
			fieldTypes:fieldTypes,displayFor:displayFor,
			field:{displayName:fieldDisplayName,name:fieldName,dataType:fieldDataType,fieldType:fieldFieldType,
				inputType:fieldInputType,optionSource:fieldOptionSource,defaultValue:fieldDefaultValue}};
	//consolelog(_options);
	
	reqModule(["module/metadata/create_metafield"],function(MetaFieldManager){
		MetaFieldManager.createNew(_options);
	});
});


function fieldNameUnique(caller) {
	var context = "#${viewId}";
	var myEntity = "${field.entity}";
	var myField = $(caller, context).val();
	var result = {isError:false,errorInfo:""};
	$.ajax({
		url		:	Global.contextPath + "/validation/field_name_unique",
		data	:	{
						entity : myEntity,
						field  : myField
					},
		async	:	false,
		success	:	function(data){
						if (data == false) {
							result = {isError:true,errorInfo:i18n.t("metafield.nameAlreadyExist")};
						} else {
							result = {isError:false,errorInfo:""};
						}
					}
	});
	return result;
};
</script>