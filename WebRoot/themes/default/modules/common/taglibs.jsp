<%@ page language="java" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="ui" uri="/WEB-INF/tld/ui.tld"%>
<%@ taglib prefix="security" uri="/WEB-INF/tld/security.tld"%>
<%@ taglib prefix="dg" uri="/WEB-INF/tld/dhtmlxgrid.tld"%>
<%@ taglib prefix="pager" uri="/WEB-INF/tld/pager.tld"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix = "spring" uri = "http://www.springframework.org/tags" %>

<!--设定上下文路径和全路径-->
<%
	//String contextPath = request.getContextPath();
	request.setAttribute("contextPath", request.getContextPath());
	request.setAttribute("path", request.getContextPath());
	request.setAttribute("staticsPath", request.getContextPath() + "/statics");
	request.setAttribute("themeStaticsPath", request.getContextPath() + "/themes/default/statics");
	request.setAttribute("serverPath", request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath());
	response.setHeader("P3P", "CP=CAO PSA OUR");
	request.setAttribute("partialViewId","view_"+java.util.UUID.randomUUID().toString().substring(0,8));
%>
<!--viewId在一个Request过程中保持唯一，partialViewId每个视图中都不 一样(存在问题，使用include后，会将父页面的Id覆盖)-->
<c:if test="${empty viewId}">
	<c:set var="viewId" value="${partialViewId}" />
</c:if>
<!-- 文件服务器根路径   -->
<c:set value="${path}/download?filepath=" var="fileServer"></c:set>


