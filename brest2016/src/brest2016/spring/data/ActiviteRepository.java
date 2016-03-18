/**
 * 
 */
package brest2016.spring.data;


import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import bean.Activite;

/**
 * @author oarcher
 * Le repository activites
 * C'est juste un interface, spring data se charge d'en faire un repository
 * Voir le repository 'VisiteurRepository' pour un exemple plus poussé.
 *
 */
public interface ActiviteRepository  extends CrudRepository<Activite, Long> {

}
