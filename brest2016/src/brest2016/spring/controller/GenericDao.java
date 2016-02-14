/**
 * 
 */
package brest2016.spring.controller;

import java.io.Serializable;
import java.util.List;

/**
 * @author oarcher
 *
 */


/**
 * @author oarcher
 *
 *	Interface pour un DAO generique, adpaté de http://www.ibm.com/developerworks/java/library/j-genericdao/index.html
 *  Une autre approche pour un projet plus conséquent aurait été d'utiliser spring data, 
 *  qui permet de se passer de DAO (il est en fait généré automatiquement), mais sa mise en oeuvre est recommandée a partir de spring boot, et non spring mvc.
 *  
 *  Les methodes déclarée sont les opération CRUD
 *
 * @param <T>
 * @param <PK>
 */
public interface GenericDao <T extends Serializable, PK extends Serializable> {

    /** Persist the newInstance object into database */
    T create(T newInstance);

    /** Retrieve an object that was previously persisted to the database using
     *   the indicated id as primary key
     */
    T read(PK id);
    
    /**
     * Lecture de tous les elements
     * @return
     */
    List<T> read();

    /** Save changes made to a persistent object.  */
    void update(T transientObject);

    /** Remove an object from persistent storage in the database */
    void delete(T persistentObject);
}

