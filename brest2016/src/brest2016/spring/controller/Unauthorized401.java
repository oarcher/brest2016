/**
 * 
 */
package brest2016.spring.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.web.authentication.AuthenticationFailureHandler;

/**
 * @author oarcher Cette classe sert a forcer spring security a renvoyer un 401
 *         plutot que de faire un redirect en cas de login incorrect
 *         http://stackoverflow.com/questions/4269686/spring-security-need-403-
 *         error-not-redirec
 *
 */
public class Unauthorized401 implements AuthenticationFailureHandler {

	/* (non-Javadoc)
	 * @see org.springframework.security.web.authentication.AuthenticationFailureHandler#onAuthenticationFailure(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, org.springframework.security.core.AuthenticationException)
	 */
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			org.springframework.security.core.AuthenticationException exception) throws IOException, ServletException {
		// TODO Auto-generated method stub
		System.out.println("Pre-authenticated entry point called. Rejecting access");
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
	}
}
