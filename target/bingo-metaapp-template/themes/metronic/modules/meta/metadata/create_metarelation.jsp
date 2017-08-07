<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../../common/taglibs.jsp"%>
<style>
<!--
#createRelationTable tbody tr textarea{
	height: 120px;
	width: 500px;
}
-->
</style>
<div id="${viewId}" class="panel apply-panel" style="min-width: 950px;">
<form:form commandName="relation" id="createRelationForm" class="form-horizontal"  data-widget="validator" action="${requestUri}">
		<div class="ui-dialog-content container-fluid ">
			<table class="form-table form-bordered  col2-fluid" id="createRelationTable">
		<tbody>
			<tr>
				<th><label><spring:message code="common.displayName"/>:</label></th>
				<td><spring:message code="validation.string36" var="v_create_relation_1"/>
				<form:input path="displayName" class="input-large" 
					data-validator="required,length[1,36]" 
					placeholder="${v_create_relation_1}"/>
					<form:hidden path="sourceEntity"/>	
					<input type="hidden" name="action" value="${action}">
				</td>
			</tr>
			<tr>
				<th><label><spring:message code="metadata.relation.relationType"/>:</label></th>
				<td>
					<form:select path="type" data-validator="required">
						<form:option value=""><spring:message code="common.optionNullText"/></form:option>
						<form:option value="OneToMany"><spring:message code="metadata.relation.relationType.oneToMany"/></form:option>
						<form:option value="ManyToOne"><spring:message code="metadata.relation.relationType.manyToOne"/></form:option>
						<form:option value="ManyToMany"><spring:message code="metadata.relation.relationType.manyToMany"/></form:option>
					</form:select>
				</td>
			</tr>
			<tr>
				<th><label><spring:message code="metadata.targetEntity"/>:</label></th>
				<td>
					<form:select path="targetEntity"
						 data-validator="required">
						<form:option value=""><spring:message code="common.optionNullText"/></form:option>
						<form:options items="${nameList}"/>
					</form:select>
				</td>
			</tr>
			<tr class="ManyToMany">
				<th><label>关联实体:</label></th>
				<td>
					<form:select path="joinEntity">
						<form:option value=""><spring:message code="common.optionNullText"/></form:option>
						<form:options items="${nameList}"/>
					</form:select>
				</td>
			</tr>
			<tr class="ManyToMany">
				<th><label>关联字段1:</label></th>
				<td>
					<select name="joinEntityRefField1">
					</select>
					<span class="label label-info">关联实体的字段,对当前实体的引用字段</span>
				</td>
			</tr>
			<tr class="ManyToMany">
				<th><label>关联字段2:</label></th>
				<td>
					<select name="joinEntityRefField2">
					</select>
					<span class="label label-info">关联实体的字段,对目标实体的引用字段</span>
				</td>
			</tr>
			<tr class="ManyToOne">
				<th><label><spring:message code="metadata.relation.relationField"/>:</label></th>
				<td>
					<select name="sourceEntityRelationField">
						<option value="">--<spring:message code="metadata.relation.relationField.autoCreate"/>--</option>
						<c:forEach var="sField" items="${sourceEntityFields}">
							<option value="${sField.key}">${sField.value}</option>
						</c:forEach>
					</select>
					<span class="label label-info"><spring:message code="metadata.relation.relationFieldDesc"/></span>
				</td>
			</tr>
			<tr class="OneToMany ManyToOne">
				<th><label><spring:message code="metadata.relation.refField"/>:</label></th>
				<td>
					<select name="refToTargetEntityField">
						<option value="">--<spring:message code="metadata.relation.targetEntityIdentity"/>--</option>
					</select>
					<!-- <select data-widget="checkboxlist" name="test" data-url="" data-default-value="">
						
					</select> -->
					<span class="label label-info many"><spring:message code="metadata.relation.refField.manyDesc"/></span>
					<span class="label label-info one hide"><spring:message code="metadata.relation.refField.oneDesc"/></span>
				</td>
			</tr>
			<tr class="ManyToOne">
				<th><label><spring:message code="metadata.relation.createForeignkeyOrNot"/>:</label></th>
				<td>
					<label class="radio inline">
					<form:radiobutton  path="isAbstract" value="false"/><spring:message code="common.yes"/>
					</label>
					<label class="radio inline">
					<form:radiobutton  path="isAbstract" value="true"/><spring:message code="common.no"/>
					</label>
				</td>
			</tr>
			<tr class="ManyToOne" id="delStrategy">
				<th><label><spring:message code="metadata.relation.deleteStrategy"/>:</label></th>
				<td>
					<form:select path="onDelete"
						 data-validator="required">
						<form:options items="${onDelActions}"/>
					</form:select>
					<a href="javascript://" rel="popover" data-content=
						"<spring:message code='metadata.relation.deleteStrategyDesc'/>" id="onDelTip"
						data-original-title="<spring:message code='metadata.relation.deleteStrategyDescTitle'/>"><i class="icon-question-sign"></i></a>
				</td>
			</tr>
			<tr>
			<th><label><spring:message code="common.description"/>:</label></th>
				<td><spring:message code='validation.string1000Sec' var="v_create_relation_desc"/>
				<form:textarea path="summary" class="shortArea"
					data-validator="length[0,1000]" 
					placeholder="${v_create_relation_desc}"/>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	
	<div class="ui-dialog-buttonset">
	<c:if test="${action!='view'}">
		<button type="button" class="btn purple saveMetaRelation">
			<span><spring:message code="common.save" /></span>
			<i class="m-icon-swapright m-icon-white"></i>
		</button>
	</c:if>
		<button type="button" class="btn closeBtn"><spring:message code='common.cancel'/></button>
	</div>
</form:form>
</div>
<script type="text/javascript">
$(function(){
	var action = "${action}";
	var context = "#${viewId}";
	$("#displayName", context).focus();
	var sourceEntity = "${nameList[relation.sourceEntity]}";
	
	Page.init(context);

	$(".saveMetaRelation", context).click(function(){
		var valInfo = $.validation.validate("#createRelationForm") ;
		if( valInfo.isError ) {
			return false;
		}
		$(this).attr("disabled","disabled");
		$(this).addClass("disabled");
		var url=$("#createRelationForm", context).attr("action");
		var data=$("#createRelationForm", context).toJson();
		
		if(data.type=="ManyToOne"){
			url=Urls.appendParam(url,"sourceEntityRelationField",$("[name='sourceEntityRelationField']").val());
			url=Urls.appendParam(url,"refToTargetEntityField",$("[name='refToTargetEntityField']").val());
		}else if(data.type=="OneToMany"){
			url=Urls.appendParam(url,"refToTargetEntityField",$("[name='refToTargetEntityField']").val());
		}else{
			url=Urls.appendParam(url,"joinEntityRefField1",$("[name='joinEntityRefField1']").val());
			url=Urls.appendParam(url,"joinEntityRefField2",$("[name='joinEntityRefField2']").val());
		}
		jQuery.restPost(url,data,function(response){
			jQuery.dialogReturnValue(response);
			$("#${viewId}").dialogClose();
		});
	});

	
	var allClass=".ManyToOne,.OneToMany,.ManyToMany";
	$("#type", context).change(function(){
		var type = $(this).val();
		var showClass="."+type;
		$(showClass,context).show();
		$(allClass,context).not(showClass).hide();
		$("[name=targetEntity]", context).trigger("change");
		$(context).dialogResize();
	});
	$("[name=isAbstract]", context).change(function(){
		var del = $("#delStrategy", context);
		var isCreateForeignkey = $("[name=isAbstract]:checked", context).val();
		if(isCreateForeignkey == "false"){
			del.show("slow");
		} else {
			del.hide("slow");
		}
	});
	
	$("[name=targetEntity]", context).change(function(){
		var entity=$(this).val();
		var type=$("#type", context).val();
		if(!entity||type=="ManyToMany"){
			return;
		}
		var url=Global.contextPath+"/metadata/entity/fieldJson?entity="+entity;
		url=Urls.urlParam(url,[{key:"sourceEntity",value:sourceEntity},{key:"type",value:type}]);
		$.restGet(url,function(fields){
			if(fields&&fields.length>0){
				var field;
				var options=[];
				if(type=="ManyToOne"){
					options.push("<option value=''>————"+i18n.t('relation.targetEntityIdentity')+"————</option>");
				}else if(type=="OneToMany"){
					options.push("<option value=''>————"+i18n.t('relation.autocreateField')+"————</option>");
				}
				for(var i=0;i<fields.length;++i){
					field=fields[i];
					options.push("<option value='"+field.key+"'>"+field.value+"</option>");
				}
				$("[name=refToTargetEntityField]",context).html(options.join(""));
				$("[name=targetEntity]", context).trigger("afterChanged");
			}
		});
	});
	$("[name=joinEntity]", context).change(function(){
		var entity=$(this).val();
		var type=$("#type", context).val();
		if(!entity||type!="ManyToMany"){
			return;
		}
		var url=Global.contextPath+"/metadata/entity/fieldJson?entity="+entity;
		url=Urls.urlParam(url,[{key:"sourceEntity",value:sourceEntity},{key:"type",value:type}]);
		$.restGet(url,function(fields){
			if(fields&&fields.length>0){
				var field;
				var options=[];
				options.push("<option value=''>————"+'请选择关联字段'+"————</option>");
				for(var i=0;i<fields.length;++i){
					field=fields[i];
					options.push("<option value='"+field.key+"'>"+field.value+"</option>");
				}
				$("[name=joinEntityRefField1],[name=joinEntityRefField2]",context).html(options.join(""));
				$("[name=joinEntity]", context).trigger("afterChanged");
			}
		});
	});
	
	function initPage(){
		$("#onDelTip", context).popover({trigger : "hover",html:true});
		if(action == 'edit'){
			$("input,select",context).not("[name=displayName],[name=summary]").attr("disabled","disabled");
			$(".ui-dialog-title").html(i18n.t("relation.edit.title", sourceEntity));
			var $type=$("#type", context).trigger("change");
			$type.trigger("change");
			$("[name=targetEntity]", context).on("afterChanged",function(){
				$("[name='refToTargetEntityField']",context).val("${refToTargetEntityField}");
			});
			$("[name=targetEntity]", context).trigger("change");	
			
			$("[name='sourceEntityRelationField']",context).val("${sourceEntityRelationField}");
			var type=$type.val();
			if(type=="ManyToOne"){
				$("[name=isAbstract]", context).trigger("change");
			}else if(type=="ManyToMany"){
				$("[name=joinEntity]", context).on("afterChanged",function(){
					$("[name='joinEntityRefField1']").val("${joinEntityRefField1}");
					$("[name='joinEntityRefField2']").val("${joinEntityRefField2}");
				});
				$("[name=joinEntity]", context).trigger("change");	
			}
		} else {
			$(".ui-dialog-title")
				.html(i18n.t("relation.create.title",sourceEntity));
			$(allClass,context).hide();
		}
	};
	
	initPage();
});
</script>