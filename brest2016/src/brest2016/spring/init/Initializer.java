/**
 * 
 */
package brest2016.spring.init;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
public class Initializer extends
AbstractAnnotationConfigDispatcherServletInitializer  {

	final Logger log = Logger.getLogger(this.getClass());
	
//	@Override
//	public void onStartup(ServletContext servletContext) throws ServletException {
//		log.info("Initialisation Spring");
//		System.out.println("Initialisation Spring");
//		
//
//		AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
//		ctx.register(WebAppConfig.class); // contient les resolvers
//
//		ctx.setServletContext(servletContext);
//
//		// mise en place de 2 dispatcher. En effet, certains seveurs web
//		// refusent de produire du
//		// json avec un mapping .htm, en provoquant une erreur 406 bad content
//		ServletRegistration.Dynamic servlet = servletContext.addServlet("rest_dispatcher", new DispatcherServlet(ctx));
//		servlet.addMapping("/rest/*");  // ca marche y compris pour /WebContent/*.html, sauf pour le browser hal
//		servlet.setLoadOnStartup(1);
//
//	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#getRootConfigClasses()
	 */
	@Override
	protected Class<?>[] getRootConfigClasses() {
		// TODO Auto-generated method stub
		//return new Class[] { WebAppConfig.class,
		//		RepositoryConfig.class};
		return new Class[] { LoginConfig.class , RepositoryConfig.class };
		//return null;
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#getServletConfigClasses()
	 */
	@Override
	protected Class<?>[] getServletConfigClasses() {
		// TODO Auto-generated method stub
		
		return null;
		//return new Class[] { RepositoryConfig.class };
		//return new Class[] { WebAppConfig.class };
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractDispatcherServletInitializer#getServletMappings()
	 */
	@Override
	protected String[] getServletMappings() {
		// TODO Auto-generated method stub
		return new String[] { "/rest/*" };
		//return null;
	}

}
