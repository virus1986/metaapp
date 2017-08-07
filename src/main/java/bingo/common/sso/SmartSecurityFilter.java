/**
 * This file created at 2012-4-23.
 *
 * Copyright (c) 2002-2012 Bingosoft, Inc. All rights reserved.
 */
package bingo.common.sso;

import bingo.security.SecurityFilter;

/**
 * <code>{@link SmartSecurityFilter}</code>
 *
 * 实现基于OpenId认证协议的安全过滤
 *
 * @author zhongt
 */
public class SmartSecurityFilter extends SecurityFilter {
	public static final String LOCAL_LOGIN = "local";
	public static final String SSO_LOGIN = "sso";

	private String loginMode = LOCAL_LOGIN;
	private String localLoginUrl = "/common/login/login.jsp";
	private String ssoLoginUrl = "/common/login/login_sso.jsp";

	/**
	 * @return the mode
	 */
	public String getLoginMode() {
		return loginMode;
	}

	/**
	 * @param loginMode the mode to set
	 */
	public void setLoginMode(String loginMode) {
		if (!SSO_LOGIN.equalsIgnoreCase(loginMode) && !LOCAL_LOGIN.equalsIgnoreCase(loginMode)) {
			throw new IllegalArgumentException(String.format("you set login mode is not correct-->%s", loginMode));
		}
		this.loginMode = loginMode;
	}

	/* (non-Javadoc)
	 * @see bingo.security.SecurityFilter#getLoginUrl()
	 */
	@Override
	public String getLoginUrl() {
		if (null == this.loginUrl || "".equals(this.localLoginUrl.trim())) {
			return LOCAL_LOGIN.equalsIgnoreCase(loginMode) ? getLocalLoginUrl() : getSsoLoginUrl();
		}
		return super.getLoginUrl();
	}

	/**
	 * @return the ssoLoginUrl
	 */
	public String getSsoLoginUrl() {
		return ssoLoginUrl;
	}

	/**
	 * @param ssoLoginUrl the ssoLoginUrl to set
	 */
	public void setSsoLoginUrl(String ssoLoginUrl) {
		this.ssoLoginUrl = ssoLoginUrl;
	}

	/**
	 * @return the localLoginUrl
	 */
	public String getLocalLoginUrl() {
		return localLoginUrl;
	}

	/**
	 * @param localLoginUrl the localLoginUrl to set
	 */
	public void setLocalLoginUrl(String localLoginUrl) {
		this.localLoginUrl = localLoginUrl;
	}
}