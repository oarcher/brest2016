/**
 * Initialisation Spring
 * Tout est fait a base d'annotation, et on se passe du fichier web.xml
 * Voir le fichier pom.xml pour le dependances.
 * 
 */
package brest2016.spring.init;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
public class Initializer extends
AbstractAnnotationConfigDispatcherServletInitializer  {

	final Logger log = Logger.getLogger(this.getClass());
	
	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#getRootConfigClasses()
	 */
	@Override
	protected Class<?>[] getRootConfigClasses() {
		// les configurations specifiques au login et au repository Rest sont
		// dans des classes séparées
		return new Class[] { LoginConfig.class , RepositoryConfig.class };
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer#getServletConfigClasses()
	 */
	@Override
	protected Class<?>[] getServletConfigClasses() {
		return null;
	}

	/* (non-Javadoc)
	 * @see org.springframework.web.servlet.support.AbstractDispatcherServletInitializer#getServletMappings()
	 */
	@Override
	protected String[] getServletMappings() {
		return new String[] { "/rest/*" };
	}

}
