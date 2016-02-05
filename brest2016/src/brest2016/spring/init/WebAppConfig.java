/**
 * 
 */
package brest2016.spring.init;

import java.util.List;

/**
 * @author oarcher
 *
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;


@Configuration // Class de configuartion spring
@EnableWebMvc 
@ComponentScan("brest2016") // package a scanner pour le controller
public class WebAppConfig    {
 

	@Bean
	public UrlBasedViewResolver initUrlBasedViewResolver() {

		System.out.println("Mise en place du reslover sur les vues");
		UrlBasedViewResolver resolver = new UrlBasedViewResolver();
		resolver.setPrefix("/WEB-INF/views/");
		resolver.setSuffix(".jsp");
		resolver.setViewClass(JstlView.class);
		return resolver;
	}
	
	

//	@Override
//	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
//		converters.add(converter());
//	}
//
//	@Bean
//	public MappingJackson2HttpMessageConverter converter() {
//		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//		// converter.setObjectMapper(mapper());
//		return converter;
//	}

}
