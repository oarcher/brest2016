/**
 * 
 */
package brest2016.spring.init;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
//import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.view.JstlView;
import org.springframework.web.servlet.view.UrlBasedViewResolver;

import brest2016.spring.controller.Dao;

/**
 * @author oarcher
 *
 */

@Configuration // Class de configuartion spring
@EnableTransactionManagement
@EnableWebMvc
@ComponentScan("brest2016") // package a scanner pour le controller
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
	@Bean(name = "dataSource")
	public DataSource getDataSource() {
		BasicDataSource dataSource = new BasicDataSource();
		dataSource.setDriverClassName("com.mysql.jdbc.Driver");
		dataSource.setUrl("jdbc:mysql://localhost:3306/test");
		dataSource.setUsername("test");
		dataSource.setPassword("test");

		return dataSource;
	}

	/*
	 * Configuration hibernate
	 */
	// TODO pourqoi ne pas tout mettre dans le bean entityManager ?
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
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		return entityManager;
	}
	
	// TODO le name="Dao" n'est valable que pour Animation. Si j'ai plusieurs
	// Dao,
	// Y a t il moyen de ne pas tous les lister ici ?
	@Autowired
	@Bean(name = "Dao")
	public Dao getUserDao(EntityManager entityManager) { // TODO Dao devrait
															// etre une
															// interface
		return new Dao(entityManager); // TODO Dao devrait etre une
										// implementation
	}

}
