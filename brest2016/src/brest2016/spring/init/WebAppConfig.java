/**
 * 
 */
package brest2016.spring.init;

/**
 * @author oarcher
 *
 */


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;

@Configuration //Class de configuartion spring
@ComponentScan("brest2016")  // package a scanner pour le controller
@EnableWebMvc //Autoriser les annotations dans le code
public class WebAppConfig {

	@Bean
	public UrlBasedViewResolver initUrlBasedViewResolver() {
		
		System.out.println("Mise en place du reslover sur les vues" );
		UrlBasedViewResolver resolver = new UrlBasedViewResolver();
		resolver.setPrefix("/WEB-INF/views/");
		resolver.setSuffix(".jsp");
		resolver.setViewClass(JstlView.class);
		return resolver;
	}

}
