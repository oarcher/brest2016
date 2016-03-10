/**
 * 
 */
package brest2016.spring.controller;

import java.util.Arrays;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import bean.Visiteur;
import brest2016.spring.data.VisiteurRepository;

/**
 * @author oarcher
 * 
 * Gestion des logins
 * Les identifiants sont récupérés de  visiteurRepository
 * admin est 'en dur'
 *
 */

@EnableWebMvc
@Service
public class LoginUserDetailsService implements UserDetailsService {

	@Autowired
	private VisiteurRepository visiteurRepository;
	
	@Override
	//@Autowired
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Visiteur visiteur = visiteurRepository.findByLoginEquals(username);
		System.out.println("Securité : check  " + username);
		if (visiteur == null) {
			throw new UsernameNotFoundException("Utilisateur " + username + " non trouvé!");
		}
		return new User(visiteur.getLogin(), visiteur.getPassword(), getGrantedAuthorities(username));
	}

	private Collection<? extends GrantedAuthority> getGrantedAuthorities(String username) {
		Collection<? extends GrantedAuthority> authorities;
		if (username.equals("admin")) {
			System.out.println("Securité : admin");
			authorities = Arrays.asList(() -> "ROLE_ADMIN", () -> "ROLE_BASIC");
		} else {
			System.out.println("Securité : utilisateur normal");
			authorities = Arrays.asList(() -> "ROLE_BASIC");
		}
		return authorities;
	}
}