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
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

/**
 * @author oarcher
 * Le but de cette classe est de mettre en place les beans qui seront
 * utilisés par les repository
 * EntityManagerFactory EntityManager  PlatformTransactionManager
 * 
 *
 */

@Configuration // Class de configuartion spring
@EnableTransactionManagement
@EnableWebMvc
@ComponentScan("brest2016.spring.controller")
@EnableJpaRepositories("brest2016.spring.data")  // les data repository a scaner
@Import(RepositoryRestMvcConfiguration.class) // spring data rest
public class RepositoryConfig {
	 /*
	 * Configuration persistence
	 * spring-data-jpa a besoin des bean entityManagerFactory , entityManager
	 * et transactionManager
	 * 
	 */
	
	@Bean
	public EntityManagerFactory entityManagerFactory() {
		//voir persistence-unit name="brest2016" dans WebContent/WEB-INF/classes/META-INF
		EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("brest2016");
		return entityManagerFactory;
	}

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
