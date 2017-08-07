<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../common/taglibs.jsp"%>
<style>
<!--
#createEntityTable {
	margin-top: 20px;
	width: 100%;
	border: none;
}
#createEntityTable tbody tr{
	height: 50px;
}
#createEntityTable tbody tr textarea{
	height: 120px;
	width: 500px;
}
-->
</style>
<div id="${viewId}" class="panel apply-panel">
<div class="ui-dialog-title hide">
	<c:if test="${action=='edit'}">
	<img src='${themeStaticsPath}/images/icons/mini/ico_edit.gif'/>
	</c:if>
</div>
<form:form commandName="entity" id="createEntityForm_${viewId}" data-widget="validator" action="${requestUri}">
<table class="form-table col2-fluid" id="createEntityTable">
	<tbody>
		<tr>
			<th><label><spring:message code="common.displayName"/>:</label></th>
			<td><spring:message code="validation.string36" var="v_create_entity_1"/>
				<form:input path="displayName" class="input-large" 
					placeholder="${v_create_entity_1}"
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
			<spring:message code='validation.autoByDisplayName' var="v_create_entity_2"/>
			<form:input path="name" class="input-large" 
				placeholder="${v_create_entity_2}" 
				data-validator="required,length[1,36],name,func[entityNameUnique]"/>
			<span class="label label-info"><spring:message code="validation.nameSpec"/></span>
			</c:if>
			</td>
		</tr>
		<tr>
			<th><label><spring:message code="common.description"/>:</label></th>
			<td ><spring:message code='validation.string1000Sec' var="v_create_entity_3"/>
			<form:textarea path="summary" class="shortArea" 
			 	data-validator="length[0,1000]"
				placeholder="${v_create_entity_3}"/>
			</td>
		</tr>
	</tbody>
</table>
<div class="ui-dialog-buttonset">
<c:if test="${action!='view'}">
	<button type="button" class="btn btn-primary ajaxPostBtn"><spring:message code="common.save"/></button>
</c:if>
	<button type="button" class="btn closeBtn"><spring:message code="common.cancel"/></button>
</div>
</form:form>
</div>
<script type="text/javascript">
function entityNameUnique(caller){
	var context = "div#${viewId}";
	var entityName = $(caller, context).val();
	var contextPath='${contextPath}';
	var errorInfo={};
	jQuery.restGet(contextPath+"/validation/entity_name_unique?entity="+entityName,null,function(response){
		if (!response) {
			errorInfo= {isError:true,errorInfo:i18n.t("metaentity.entityAlreadyExist")};
		} else {
			errorInfo= {isError:false,errorInfo:""};
		}
	},{async:false,isShowLoading:false});
	return errorInfo;
};
$(function(){
	var context = "div#${viewId}";
	var action = "${action}";
	$("#displayName", context).focus();
	if(action != "edit"){
		$(".ui-dialog-title").text(i18n.t("metaentity.create.title"));	
	} else {
		$(".ui-dialog-title")
			.html(i18n.t("metaentity.edit.title")+"<span class='title-keyword'>${entity.displayName}</span>");
	}
	Form.init("#${viewId}","#createEntityForm_${viewId}");
	if(action != "edit"){
		$("[name='displayName']", context).keyup(function(){
			$("[name='name']", context).val($(this).toPinyin().replace(/\s*/g,''));
		});
	}
});
</script>