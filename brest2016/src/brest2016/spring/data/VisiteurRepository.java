/**
 * 
 */
package brest2016.spring.data;


import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import bean.Activite;
import bean.Visiteur;
/**
 * @author oarcher
 *
 */
//@PreAuthorize("hasRole('ROLE_ADMIN')")
//@PostAuthorize("returnObject.login == principal.username or hasRole('ROLE_ADMIN')")
public interface VisiteurRepository  extends CrudRepository<Visiteur, Long> {
	//List<Visiteur> findByNomLike(String nom);

	/**
	 * @param username
	 * @return
	 */
//	// seul admin peut lister tous les visiteurs
	@Override
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	List<Visiteur> findAll();
	
	// un visiteur a acces a son profile
	@Override
	@PostAuthorize("returnObject.login == principal.username or hasRole('ROLE_ADMIN')")
	Visiteur findOne(Long id);
	
	@PostAuthorize("returnObject.login == principal.username or hasRole('ROLE_ADMIN')")
	Visiteur findByLogin(@Param("login") String login);

	
	//List<Visiteur> findByLoginLike(@Param("login") String login);
	
	// n'est pas exporté, sert a la validation du login
	@RestResource(exported = false)
	Visiteur findByLoginEquals(String login);
	
	
}
