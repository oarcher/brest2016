/**
 * 
 */
package brest2016.spring.controller;

import java.io.Serializable;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.GenericApplicationListener;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Service;
import org.springframework.util.SerializationUtils;

/**
 * @author oarcher
 * 
 *         implémentation de GenericDao pour jpa inspiré de
 *         http://www.ibm.com/developerworks/java/library/j-genericdao/index.
 *         html mais revu pour une gestion par jpa plutot qu'hibernate
 *
 */

public class GenericDaoJpaImpl<T extends Serializable, PK extends Serializable> implements GenericDao<T, PK> {

	private Class<T> type;  // animation.class, visiteur.class, etc ...

	// voir
	// http://stackoverflow.com/questions/5640778/hibernate-sessionfactory-vs-entitymanagerfactory
	// pour la difference entre EntityManager (JPA) et SessionFactory
	// (specifique hibernate)
	// @Autowired
	// private SessionFactory sessionFactory;
	@Autowired
	private EntityManager entityManager;

	public GenericDaoJpaImpl(Class<T> type) {
		this.setType(type);
	}
	
	
	public GenericDaoJpaImpl(Class<T> type, EntityManager entityManager) {
		this.setType(type);
		this.setEntityManager(entityManager);
	}

	/**
	 * @param entityManager
	 */
	public GenericDaoJpaImpl(EntityManager entityManager) {
		this.setEntityManager(entityManager);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see brest2016.spring.controller.GenericDao#create(java.lang.Object)
	 */
	@Override
	public T create(T newInstance) {
		System.out.println("create generique");
		// FIXME : il faudrait cloner newInstance 
		// car le persit le change ...
		//T persistentObject = newInstance.
		//		(newInstance);
		// System.out.println("animation avant persit: "+ animation.toString());
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        entityManager.persist(newInstance);
        tx.commit();
        //System.out.println("animation apres persit: "+ animation.toString());
        return newInstance;
        
		
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see brest2016.spring.controller.GenericDao#read(java.io.Serializable)
	 */
	@Override
	public T read(PK id) {
		// TODO Auto-generated method stub
		System.out.println("read one generique");
		Query query = entityManager.createQuery("select g from Animation g where g.id=:id");
        query.setParameter("id",  id);
        List<T> lst = query.getResultList();
        T persistentObject = lst.get(0);
        System.out.println("GenericDaoJpaImpl read (One): " + persistentObject.toString());
        return persistentObject;
	}

	@Override
	public List<T> read() {
		// TODO Auto-generated method stub
		System.out.println("read  generique");
		@SuppressWarnings("unchecked")
		List<T> lst = entityManager.createQuery("select g from " + type.getSimpleName() + " g").getResultList();
        System.out.println("DAO readAnimation: len" + lst.size());
        return lst;
	}
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see brest2016.spring.controller.GenericDao#update(java.lang.Object)
	 */
	@Override
	public void update(T transientObject) {
		// TODO Auto-generated method stub

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see brest2016.spring.controller.GenericDao#delete(java.lang.Object)
	 */
	@Override
	public void delete(T persistentObject) {
		System.out.println("delete  generique");
		entityManager.remove(persistentObject);
	}

	/**
	 * @return the entityManager
	 */
	public EntityManager getEntityManager() {
		return entityManager;
	}

	/**
	 * @param entityManager the entityManager to set
	 */
	public void setEntityManager(EntityManager entityManager) {
		this.entityManager = entityManager;
	}

	/**
	 * @return the type
	 */
	public Class<T> getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(Class<T> type) {
		this.type = type;
	}

}
