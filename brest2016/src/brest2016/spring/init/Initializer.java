/**
 * 
 */
package brest2016.spring.init;

/**
 * @author oarcher
 *
 * Remplace le fichier web.xml
 * inspriré par http://www.javacodegeeks.com/2013/03/spring-mvc-creation-of-a-simple-controller-with-java-based-config.html
 * 
 */
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class Initializer implements WebApplicationInitializer {

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {

		System.out.println("Initialisation Spring");
		
		AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
		ctx.register(WebAppConfig.class);  // contient les resolvers

		ctx.setServletContext(servletContext);	
		Dynamic servlet = servletContext.addServlet("json_dispatcher", new DispatcherServlet(ctx));
		servlet.addMapping("*.json");
		servlet.setLoadOnStartup(1);
		
		Dynamic servlet1 = servletContext.addServlet("htm_dispatcher", new DispatcherServlet(ctx));
		servlet1.addMapping("*.htm");
		servlet1.setLoadOnStartup(1);
		
		

	}

}
