<%@page import="bingo.security.SecurityContext"%>
<% 
    IUser user = SecurityContext.getCurrentUser(); 
    String isLogin = user != null ? "true" : "false"; 
    String identity = user != null ? user.getId() : ""; 
%> 
<script type="text/javascript"> 
    window.parent.ssoLoginBack(<%=isLogin %>,"<%=identity %>"); 
</script>