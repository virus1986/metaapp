<%@ page language="java" pageEncoding="UTF-8"%>
<!-- 这个meta文件会被include到这个meta文件head标签内 -->
<%@include file="taglibs.jsp"%>
<!-- HTTP 1.1 -->
<meta http-equiv="Cache-Control" content="no-store" />
<!-- HTTP 1.0 -->
<meta http-equiv="Pragma" content="no-cache" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- Prevents caching at the Proxy Server -->
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />


<!--便于在JS中获取上下文路径和全路径-->
<script type="text/javascript">
	var Global = {};
	Global.contextPath = '${contextPath}';
	Global.serverPath = '${serverPath}';
	var Config = Global ;
</script>


