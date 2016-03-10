/**
 * 
 */
package brest2016.spring.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.EnableGlobalAuthentication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import brest2016.spring.controller.LoginUserDetailsService;
import brest2016.spring.controller.Unauthorized401;

/**
 * @author oarcher Gestion de l'authentification par spring-security inspiré de
 *         https://jaxenter.com/rest-api-spring-java-8-112289.html
 *         A voir aussi pour les @ExceptionHandler
 *         http://stackoverflow.com/questions/19767267/handle-spring-security-authentication-exceptions-with-exceptionhandler
 *
 */
@Configuration
// @ComponentScan("brest2016.spring.data")
// @ComponentScan
//@ComponentScan("brest2016.spring.controller") //.FakeUserDetailsService")
// @EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
// @EnableGlobalAuthentication
public class LoginConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	private LoginUserDetailsService userDetailsService;

	// @Bean
	// @Override
	// public AuthenticationManager authenticationManagerBean() throws Exception
	// {
	// return super.authenticationManagerBean();
	// }

	// contrairement a l'exemple, il faut ce bean ...
	@Bean(name = "LoginUserDetailsService")
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
		// seul admin peut editer des moyens
//		http.formLogin().and().authorizeRequests().antMatchers(HttpMethod.POST, "/rest/moyens").hasRole("ADMIN");
//		http.formLogin().and().authorizeRequests().antMatchers(HttpMethod.PUT, "/rest/moyens/**").hasRole("ADMIN");
//		http.formLogin().and().authorizeRequests().antMatchers(HttpMethod.PATCH, "/rest/moyens/**").hasRole("ADMIN");
//		http.formLogin().and().authorizeRequests().antMatchers(HttpMethod.DELETE, "/rest/moyens/**").hasRole("ADMIN");
//		
//		// seul admin peut recuperer les visiteurs d'un activivite
//		http.formLogin().and().authorizeRequests().antMatchers(HttpMethod.GET,"/activites/visiteurs").hasRole("ADMIN");
//		http.formLogin();
//		http.csrf().disable();
		//http.exceptionHandling().authenticationEntryPoint(new Unauthorized401());
		http.authorizeRequests()
			.antMatchers(HttpMethod.POST, "/rest/moyens").hasRole("ADMIN")
			.antMatchers(HttpMethod.PUT, "/rest/moyens/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.PATCH, "/rest/moyens/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.DELETE, "/rest/moyens/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.POST, "/rest/activites").hasRole("ADMIN")
			.antMatchers(HttpMethod.PUT, "/rest/activites/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.PATCH, "/rest/activites/**").hasRole("ADMIN")
			.antMatchers(HttpMethod.DELETE, "/rest/activites/**").hasRole("ADMIN")
		.and().formLogin().failureHandler(new Unauthorized401()); //.loginPage( "/login" );
		http.csrf().disable();
	}
	
//	@Override
//    public void configure(WebSecurity webSecurity) throws Exception
//    {
//		// seul admin peut creer des moyens
//		webSecurity.  httpBasic().and().authorizeRequests().antMatchers(HttpMethod.POST, "/rest/moyens").hasRole("ADMIN");
//		webSecurity.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.PUT, "/rest/moyens/**").hasRole("ADMIN");
//		webSecurity.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.PATCH, "/rest/moyens/**").hasRole("ADMIN");
//		webSecurity.httpBasic().and().authorizeRequests().antMatchers(HttpMethod.DELETE, "/rest/moyens/**").hasRole("ADMIN");
//				
//        
//    }

}
