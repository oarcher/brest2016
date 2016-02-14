/**
 * 
 */
package brest2016.spring.controller;

import javax.persistence.EntityManager;

import bean.Animation;

/**
 * @author oarcher
 *
 */
public class DaoAnimation extends GenericDaoJpaImpl<Animation, Integer> {

	/**
	 * @param type
	 * @param entityManager
	 */
	public DaoAnimation() {
		super(Animation.class);
		System.out.println("Constructor DaoAnimation");
		// TODO Auto-generated constructor stub
	}

}

