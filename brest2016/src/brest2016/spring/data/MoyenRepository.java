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

import bean.Moyen;

/**
 * @author oarcher
 *
 */
//@PreAuthorize("hasRole('ROLE_ADMIN')")
public interface MoyenRepository  extends CrudRepository<Moyen, Long> {

}
