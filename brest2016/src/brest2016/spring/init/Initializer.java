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
		ctx.register(WebAppConfig.class); // contient les resolvers

		ctx.setServletContext(servletContext);

		// mise en place de 2 dispatcher. En effet, certains seveurs web
		// refusent de produire du
		// json avec un mapping .htm, en provoquant une erreur 406 bad content
		Dynamic servlet = servletContext.addServlet("json_dispatcher", new DispatcherServlet(ctx));
		servlet.addMapping("*.json");  // FIXME ca serait mieux avec "/rest/*" voir Context root dans web project settings ?
		servlet.setLoadOnStartup(1);

		// RestFull , pas de dispatcher htm pour l'instant
		// Dynamic servlet1 = servletContext.addServlet("htm_dispatcher", new
		// DispatcherServlet(ctx));
		// servlet1.addMapping("*.htm");
		// servlet1.setLoadOnStartup(1);
		//

	}

}
