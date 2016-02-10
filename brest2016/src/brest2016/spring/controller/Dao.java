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
import javax.persistence.Query;

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

	/**
	 * rentre une animation en base.
	 * Celle-ci est sans id, c'est le role du persist/commit de le positionner
	 * @param animation sans id
	 * @return  animation avec id
	 */
	public Animation createAnimation(Animation animation) {
		Animation copy_animation = new Animation(animation);  // copy constructor
		// System.out.println("animation avant persit: "+ animation.toString());
		EntityTransaction tx = entityManager.getTransaction();
		tx.begin();
		entityManager.persist(copy_animation);
		tx.commit();
		//System.out.println("animation apres persit: "+ animation.toString());
		return copy_animation;
	}

	public List<Animation> readAnimation() {
		List<Animation> lst = entityManager.createQuery("select g from Animation g").getResultList();
		System.out.println("DAO readAnimation: len" + lst.size());
		return lst;
	}
	
	public Animation readAnimation(int id) {
		Query query = entityManager.createQuery("select g from Animation g where g.id=:id");
		query.setParameter("id",  id);
		List<Animation> lstanimation = query.getResultList();
		Animation animation = lstanimation.get(0);
		System.out.println("DAO readAnimation (One): " + animation.toString());
		return animation;
	}

	public void init() {
		System.out.println("init dao");
	}

}
