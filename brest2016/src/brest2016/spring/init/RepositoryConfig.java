/**
 * 
 */
package brest2016.spring.init;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * @author oarcher
 *
 */

@Configuration // Class de configuartion spring
@EnableTransactionManagement
@EnableWebMvc
// @ComponentScan("brest2016") // package a scanner pour le controller (essayer
// avec brest2016.spring.controller

@ComponentScan("brest2016.spring.controller")
@EnableJpaRepositories("brest2016.spring.data")  // les data repository a scaner

@Import(RepositoryRestMvcConfiguration.class) // spring data rest
//@Import({SecurityConfig.class})											// http://docs.spring.io/spring-data/rest/docs/2.4.2.RELEASE/reference/html/
public class RepositoryConfig {
	// Le serveur est RESTFULL, les vue ne sont pas gérées pour l'instant
	// @Bean
	// public UrlBasedViewResolver initUrlBasedViewResolver() {
	//
	// System.out.println("Mise en place du reslover sur les vues");
	// UrlBasedViewResolver resolver = new UrlBasedViewResolver();
	// resolver.setPrefix("/WEB-INF/views/");
	// resolver.setSuffix(".jsp");
	// resolver.setViewClass(JstlView.class);
	// return resolver;
	// }

	// remplace persitence.xml
	// TODO application.property brest2016/src/main/resources
	// @Bean
	// public DataSource dataSource() {
	// DataSource dataSource = new DataSource();
	// dataSource.setDriverClassName("com.mysql.jdbc.Driver");
	// dataSource.setUrl("jdbc:mysql://localhost:3306/test");
	// dataSource.setUsername("test");
	// dataSource.setPassword("test");
	//
	// return dataSource;
	// }


//	@Bean   // spring 2.4
//	public RepositoryRestConfigurer repositoryRestConfigurer() {
//		return new RepositoryRestConfigurerAdapter() {
//
//			@Override
//			public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
//				System.out.println("spring data rest config");
//				//config.setBasePath("/rest");
//				// voir
//				// http://docs.spring.io/spring-data/rest/docs/2.4.2.RELEASE/reference/html/#_changing_other_spring_data_rest_properties
//				// pour les autres options de configurations
//			}
//		};
//	}

	 /*
	 * Configuration persistence
	 * spring-data-jpa a besoin des bean entityManagerFactory , entityManager
	 * et transactionManager
	 * 
	 */
	
	//@Autowired
	@Bean
	public EntityManagerFactory entityManagerFactory() {
		//voir persistence-unit name="brest2016" dans src/META-INF/persistence.xml
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("brest2016");
		return entityManagerFactory;
	}

	//@Autowired
	@Bean
	public EntityManager entityManager(EntityManagerFactory entityManagerFactory) {
		System.out.println("mise en place du bean entityManager dans WebAppConfig");
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		return entityManager;
	}

	@Bean
	public PlatformTransactionManager transactionManager() {

		JpaTransactionManager txManager = new JpaTransactionManager();
		txManager.setEntityManagerFactory(entityManagerFactory());
		return txManager;
	}

}
