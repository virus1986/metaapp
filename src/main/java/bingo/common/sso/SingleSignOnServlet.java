/**
 * This file created at 2012-4-23.
 *
 * Copyright (c) 2002-2012 Bingosoft, Inc. All rights reserved.
 */
package bingo.common.sso;

import bingo.security.SecurityContext;
import bingo.sso.client.web.AbstractSingleSignOnServlet;
import bingo.sso.client.web.Authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * <code>{@link SingleSignOnServlet}</code>
 *
 * 实现基于OpenId的单点登录与安全控制结合
 *
 * @author zhongt
 */
@SuppressWarnings("serial")
public class SingleSignOnServlet extends AbstractSingleSignOnServlet {

	/* (non-Javadoc)
	 * @see bingo.sso.client.openid.servlets.AbstractSingleSignOnServlet#onSuccessSignIn(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, bingo.sso.client.openid.Authentication)
	 */
	@Override
	protected void onSuccessSignIn(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		SecurityContext.getProvider().signIn(request, authentication.getIdentity());
	}

	/* (non-Javadoc)
	 * @see bingo.sso.client.web.AbstractSingleSignOnServlet#onSetupNeeded(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.lang.String)
	 */
	@Override
	protected void onSetupNeeded(HttpServletRequest arg0,
			HttpServletResponse arg1, String arg2) throws Exception {
		// TODO implement AbstractSingleSignOnServlet.onSetupNeeded
		
	}
}