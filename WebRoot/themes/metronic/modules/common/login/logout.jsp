<%@page import="bingo.metaapp.security.SmartSecurityFilter"%>
<%@page import="bingo.metabase.utils.AppContext"%><%@page import="bingo.security.SecurityContext"%>
<%
	// 获取应用目前的登录模式
	String loginMode = SmartSecurityFilter.LOCAL_LOGIN;
	SmartSecurityFilter smartSecurityFilter = AppContext.getOrCreateFirstBeanOfType(SmartSecurityFilter.class);
	if (null != smartSecurityFilter) {
		loginMode = smartSecurityFilter.getLoginMode();
	}
	
	// 根据不同的登录模式做不同注销处理
	if (SmartSecurityFilter.LOCAL_LOGIN.equalsIgnoreCase(loginMode)) {
		SecurityContext.getProvider().signOut(request);
		response.sendRedirect(request.getContextPath() + "/");
	} else {
		response.sendRedirect(request.getContextPath() + "/ssoclient/logout");
	} 
%>