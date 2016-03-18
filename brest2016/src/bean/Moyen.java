/**
 * 
 */
package bean;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import validator.NonOverlapActivitesMoyen;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_moyen")
public class Moyen implements Serializable {
	
	private static final long serialVersionUID = -7798619177798328812L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id;
	
	@NotEmpty(message="Le nom ne peut pas être vide")
	private String nom;
	@NotEmpty(message="Le lieu ne peut pas être vide")
	private String lieu;
	@DecimalMin(message="Il faut déclarer plus de places libres", value = "1")
	private int nbPlaces;
	
	@OneToMany(mappedBy="moyen")
	private Set<Activite> activites = new HashSet<Activite>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getNom() {
		return nom;
	}

	public Set<Activite> getActivites() {
		return activites;
	}
	
	public void setActivite(Set<Activite> activites) {
		this.activites = activites;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	
	
	public String getLieu() {
		return lieu;
	}

	public void setLieu(String lieu) {
		this.lieu = lieu;
	}

	public int getNbPlaces() {
		return nbPlaces;
	}

	public void setNbPlaces(int nbPlaces) {
		this.nbPlaces = nbPlaces;
	}

	@Override
	public String toString(){
		return nom;
		
	}


}
