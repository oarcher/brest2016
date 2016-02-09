/**
 * 
 */
package brest2016.spring.controller;

/**
 * @author oarcher
 *
 */

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bean.Animation;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;

// géré en tant que service spring  (c'est a dire que c'est spring qui fait le new)
@Service
public class Dao {

	// plutot que d'initialiser 
	// le Persistence.createEntityManagerFactory
	//EntityManagerFactory emf = null;
	//EntityManager em = null;
	
	
	//@Autowired
    //private SessionFactory sessionFactory;
	@Autowired
	private EntityManager entityManager = null;
	
    public Dao() {
         
    }
     
    public Dao(EntityManager entityManager) {
    	System.out.println("Dao : mise en place de entityManager");
        this.entityManager = entityManager;
    }

//	public Dao() {
//		System.out.println("Dao xxxxx");
//		emf = Persistence.createEntityManagerFactory("brest2016");
//		em = emf.createEntityManager();
//
//	}

	public void createAnimation(Animation animation) {
		EntityTransaction tx = entityManager.getTransaction();
		tx.begin();
		entityManager.persist(animation);
		tx.commit();
	}

	public List<Animation> readAnimation() {
		List<Animation> lst = entityManager.createQuery("select g from Animation g").getResultList();
		System.out.println("DAO readAnimation: len" + lst.size());
		return lst;
	}

	public void init() {
		System.out.println("init dao");
	}

}
