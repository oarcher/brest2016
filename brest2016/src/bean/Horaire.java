/**
 * 
 */
package bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.NotBlank;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_horaire")
public class Horaire implements Serializable {

	private static final long serialVersionUID = -7788619177798333712L;

	/**
	 * 
	 */

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id;

	@NotBlank(message = "ne peux pas être vide")
	private String plage = "";

	// plusieurs horaires pour chaque stands
//	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
//	@JoinTable(name = "oarcher_stand_horaire", joinColumns = @JoinColumn(name = "idStand") , inverseJoinColumns = @JoinColumn(name = "idHoraire") )
//	Stand animation = null;
	
	// un horaire est partagé par plusieurs activites
	@OneToMany
	@JoinTable(name = "oarcher_activite_horaire", joinColumns = @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name = "idHoraire") )
	private Set<Activite> activite = new HashSet<Activite>();
	
	
	
	public Set<Activite> getActivite() {
		return activite;
	}

	public void setActivite(Set<Activite> activite) {
		this.activite = activite;
	}

	public Horaire() {
	}

	public Horaire(Long id, String plage) {
		this.id = id;
		this.plage = plage;
	}

	// copy constructor
	public Horaire(Horaire horaire) {
		this.id = horaire.id;
		this.plage = horaire.plage;
	}

	public String toString() {
		return "id : " + this.id + " plage : " + this.plage;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPlage() {
		return plage;
	}

	public void setPlage(String plage) {
		this.plage = plage;
	}



}
