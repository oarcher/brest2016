/**
 * 
 */
package brest2016.spring.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import brest2016.spring.controller.FakeUserDetailsService;

/**
 * @author oarcher Gestion de l'authentification par spring-security inspiré de
 *         https://jaxenter.com/rest-api-spring-java-8-112289.html
 *
 */
@Configuration
// @ComponentScan("brest2016.spring.data")
// @ComponentScan
// @ComponentScan("brest2016.spring.controller") //.FakeUserDetailsService")
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
// @EnableGlobalAuthentication
public class LoginConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private FakeUserDetailsService userDetailsService;

	// @Bean
	// @Override
	// public AuthenticationManager authenticationManagerBean() throws Exception
	// {
	// return super.authenticationManagerBean();
	// }

	@Bean(name = "FakeUserDetailsService")
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	// @Autowired
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		System.out.println("AuthenticationManagerBuilder");
		auth.userDetailsService(userDetailsService);
	}

	@Override
	// @Autowired
	protected void configure(HttpSecurity http) throws Exception {
		System.out.println("configure spring security");
		// http.authorizeRequests().antMatchers("/**").hasRole("ADMIN").and().formLogin();
		http.authorizeRequests().anyRequest().fullyAuthenticated();
		http.httpBasic();
		http.csrf().disable();

	}

}
