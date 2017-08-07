<%@page pageEncoding="UTF-8"%>
<%@page import="java.net.URLEncoder"%>
<%
	request.getRequestDispatcher("/ssoclient/login?return_url=" +URLEncoder.encode(request.getParameter("returnUrl"))).forward(request,response);
%>