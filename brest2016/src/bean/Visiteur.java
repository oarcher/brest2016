/**
 * 
 */
package bean;

import org.hibernate.validator.constraints.NotBlank;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_visiteur")
public class Visiteur implements Serializable {

	private static final long serialVersionUID = -7788619178798333712L;

	/**
	 * 
	 */

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "ne peux pas être vide")
	private String login = "";

	private String password = "";

	// un visiteur peut etre inscrit a plusieurs activité
	// et une activite a plusieurs visiteurs
	@ManyToMany
	// parametre de JoinTable inutiles si les tables et colonnes respectent le
	// nommage par defaut
	// @JoinTable(name = "oarcher_visiteur_oarcher_activite", joinColumns =
	// @JoinColumn(name = "visiteur_id") , inverseJoinColumns = @JoinColumn(name
	// = "activite_id") )
	@JoinTable
	private Set<Activite> activites = new HashSet<Activite>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	
	
	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<Activite> getActivites() {
		return activites;
	}

	public void setActivites(Set<Activite> activite) {
		this.activites = activite;
	}

}
