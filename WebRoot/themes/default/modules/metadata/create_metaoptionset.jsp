<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../common/taglibs.jsp"%>
<style>
<!--
#createOptionSetTable tbody tr textarea{
	height: 60px;
}
.dataTypeTableDetail th{
	width:140px;
}
#createOptionSetTable .form-table {
	border: none;
}
#createOptionSetTable .btn-toolbar {
	margin-bottom: 0px;
	margin-top: 0px;
	height: 24px;
}
#optionSetsItem tr td{
	height: 25px;
}
#createOptionSetTable label {
	display: inline-block;
	margin-bottom: 0px;
	margin-left: 2px;
	margin-right: 20px;
}
input[name=displayFor] {
	margin-top: 0px;;
}
#createOptionSetTable .item-thead tr th{
	text-align: left;
	background-color: #F1F8FB;
}
#createOptionSetTable .item-thead th{
	padding-left: 5px;
	color: black;
}
-->
</style>
<div id="${viewId}" class="panel apply-panel">
<form:form commandName="optionset" id="createOptionSetForm" data-widget="validator" action="${requestUri}">
<table id="createOptionSetTable" class="form-table">
<tbody>
	<tr >
	<td style="vertical-align: top;">
		<table class="form-table">
			<caption><spring:message code="common.baseInfo"/></caption>
			<tbody>
				<tr>
					<th><label><spring:message code="common.displayName"/>:</label></th>
					<td>
						<form:hidden path="id"/><spring:message code="validation.string36" var="v_create_optionset_1"/>
						<form:input path="displayName" class="input-large" 
							placeholder="${v_create_optionset_1}"
							data-validator="required,length[1,36]"/>
					</td>
				</tr>
				<tr>
					<th><label><spring:message code="common.name"/>:</label></th>
					<td>
					<c:if test="${action=='edit'}">
						<form:input path="name" disabled="true" class="input-large"/>
					</c:if>
					<c:if test="${action!='edit'}">
					<spring:message code='validation.autoByDisplayName' var="v_create_optionset_2"/>
					<form:input path="name" class="input-large" 
						placeholder="${v_create_optionset_2}"
						data-validator="required,length[1,36],name,func[optionsetNameUnique]"/>
					<span class="label label-info"><spring:message code="validation.nameSpec"/></span>
					</c:if>
					</td>
				</tr>
				<tr>
				<th><label><spring:message code="common.description"/>:</label></th>
					<td><spring:message code='validation.string1000Sec' var="v_create_optionset_3"/>
					<form:textarea path="summary" class="shortArea" 
					 	data-validator="length[0,1000]"
						placeholder="${v_create_optionset_3}"/>
					</td>
				</tr>
			</tbody>
		</table>
	
	</td>
	</tr>
	
	<tr>
	<td style="vertical-align: top;">
		<table class="form-table">
			<caption><spring:message code='optionset.itemInfo'/></caption>
				<tbody>	
					<tr>
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
											<td><textarea name="itemDesc" class="span3" id="itemDesc"></textarea></td>
										</tr>
						
									</tbody>
								</table>
							</div>
						</td>
					</tr>
					<tr>
						<th><label><spring:message code='common.defaultValue'/>:</label></th>
						<td colspan="2" class="span3">
							<select id="defaultValue" name="defaultValue">
								<option value="" label="<spring:message code='common.notAssignValue'/>"/>
							</select>
						</td>
					</tr>
				</tbody>
			</table>
	</td>
	</tr>
</tbody>
</table>
<div class="ui-dialog-buttonset">
<c:if test="${action!='view'}">
	<button type="button" class="btn btn-primary saveMetaOptionSet"><spring:message code='common.save'/></button>
</c:if>
	<button type="button" class="btn closeBtn"><spring:message code='common.cancel'/></button>
</div>
</form:form>
</div>
<script type="text/javascript">
$(function(){
	
	var action = "${action}";
	var context = "#${viewId}";
	var optionsetDisplayName="${optionset.displayName}";
	var options = [];
	if(action == "edit") {
		options = ${options!=null}?'${options}':[];
		if(typeof options == "string"){
			options=JSON.parse(options);
		}
	}
	
	var _options={action:action,context:context,options:options,optionsetDisplayName:optionsetDisplayName};
	
	reqModule(["module/metadata/create_metaoptionset"],function(MetaOptionsetManager){
		MetaOptionsetManager.createNew(_options);
	});
});

function optionsetNameUnique(caller) {
	var context = "#${viewId}";
	var myOptionSet = $(caller, context).val();
	var result = {isError:false,errorInfo:""};
	$.ajax({
		url		:	Global.contextPath + "/validation/optionset_name_unique",
		data	:	{
						optionset  : myOptionSet
					},
		async	:	false,
		success	:	function(data){
						if (data == false) {
							result = {isError:true,errorInfo:i18n.t("optionset.nameAlreadyExist")};
						} else {
							result = {isError:false,errorInfo:""};
						}
					}
	});
	return result;
};
</script>