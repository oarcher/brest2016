/**
 * 
 */
package brest2016.spring.init;

import java.net.URI;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import org.springframework.beans.factory.annotation.Autowired;
//import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
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

// @ComponentScan("brest2016")
@EnableJpaRepositories("brest2016.spring.data")  // les data repository a scaner

@Import(RepositoryRestMvcConfiguration.class) // spring data rest
												// http://docs.spring.io/spring-data/rest/docs/2.4.2.RELEASE/reference/html/
public class WebAppConfig {
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
	// @Bean(name = "dataSource")
	// public DataSource getDataSource() {
	// BasicDataSource dataSource = new BasicDataSource();
	// dataSource.setDriverClassName("com.mysql.jdbc.Driver");
	// dataSource.setUrl("jdbc:mysql://localhost:3306/test");
	// dataSource.setUsername("test");
	// dataSource.setPassword("test");
	//
	// return dataSource;
	// }

	@Bean
	public RepositoryRestConfigurer repositoryRestConfigurer() {
		return new RepositoryRestConfigurerAdapter() {

			@Override
			public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
				System.out.println("spring data rest congig");
				config.setBasePath("/rest");
				// voir
				// http://docs.spring.io/spring-data/rest/docs/2.4.2.RELEASE/reference/html/#_changing_other_spring_data_rest_properties
				// pour les autres options de configurations
			}
		};
	}

	// /*
	// * Configuration hibernate
	// */
	// // TODO pourqoi ne pas tout mettre dans le bean entityManager ?
	@Autowired
	@Bean(name = "entityManagerFactory")
	public EntityManagerFactory getEntityManagerFactory() {
		// src/META-INF/persistence.xml
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("brest2016");
		return entityManagerFactory;
	}

	@Autowired
	@Bean(name = "entityManager")
	public EntityManager getEntityManager(EntityManagerFactory entityManagerFactory) {
		System.out.println("mise en place du bean entityManager dans WebAppConfig");
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		return entityManager;
	}

	@Bean
	public PlatformTransactionManager transactionManager() {

		JpaTransactionManager txManager = new JpaTransactionManager();
		txManager.setEntityManagerFactory(getEntityManagerFactory());
		return txManager;
	}
	//
	// // TODO le name="Dao" n'est valable que pour Animation. Si j'ai plusieurs
	// // Dao,
	// // Y a t il moyen de ne pas tous les lister ici ?
	// @Autowired
	// @Bean(name = "DaoAnimation")
	// public DaoAnimation getUserDao(EntityManager entityManager) { // TODO
	// // GenericDaoJpaImpl
	// // devrait
	// // etre une
	// // interface
	// System.out.println("WebAppConfig : new daoAnimation");
	// DaoAnimation daoAnimation = new DaoAnimation();
	//
	// return daoAnimation; // OK GenericDaoJpaImpl est bien une
	// // implementation
	// }
	//
	// /**
	// * RequestContextListener: Permet de recuperer le 'root path'
	// ('/brest2016')
	// * dans le controleur
	// *
	// * @return
	// */
	// @Autowired
	// @Bean
	// public RequestContextListener requestContextListener() {
	// System.out.println("requestContextListener");
	// return new RequestContextListener();
	//
	// }

}
