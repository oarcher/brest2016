/**
 * 
 */
package brest2016.spring.data;


import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import bean.Stand;
/**
 * @author oarcher
 *
 */
//@RepositoryRestResource(collectionResourceRel = "animation", path = "animation")
public interface AnimationRepository  extends CrudRepository<Stand, Long> {

	List<Stand> findByDescr(@Param("descr") String descr);

}
