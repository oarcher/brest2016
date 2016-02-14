/**
 * 
 */
package brest2016.spring.data;


import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import bean.Horaire;
/**
 * @author oarcher
 *
 */
//@RepositoryRestResource(collectionResourceRel = "horaire", path = "horaire")
public interface HoraireRepository  extends CrudRepository<Horaire, Long> {

}
