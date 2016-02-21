/**
 * 
 */
package bean;

import java.io.Serializable;
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
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_activite")
public class Activite implements Serializable {
	
	private static final long serialVersionUID = -7798619177798323712L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id;
	
	
	// il y a un stand par activité, mais une stand est dans plusieurs activités
	@ManyToOne
	@JoinColumn(name = "idStand")
	//@JoinTable(name = "oarcher_activite_stand", joinColumns = @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name = "idStand") )
	private Stand stand;
	
	@ManyToOne
	//@JoinTable(name = "oarcher_activite_horaire", joinColumns = @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name = "idHoraire") )
	@JoinColumn(name = "idHoraire")
	private Horaire horaire;
	
	@ManyToMany(mappedBy="activite")
	//@JoinTable(name = "oarcher_visiteur_activite", joinColumns = @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name = "idVisiteur") )
	private Set<Visiteur> visiteur = new HashSet<Visiteur>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Stand getStand() {
		return stand;
	}
	

	public void setStand(Stand stand) {
		this.stand = stand;
	}

	public Horaire getHoraire() {
		return horaire;
	}

	public void setHoraire(Horaire horaire) {
		this.horaire = horaire;
	}

	public Set<Visiteur> getVisiteur() {
		return visiteur;
	}

	public void setVisiteur(Set<Visiteur> visiteur) {
		this.visiteur = visiteur;
	}
	
	
	
	
}
