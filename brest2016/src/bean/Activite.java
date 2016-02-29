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
	
	private String nom;
	
	private String lieu;
	
	private Date datedebut;
	private Date datefin;
	
	@ManyToMany(mappedBy="activite")
	//@JoinTable(name = "oarcher_visiteur_activite", joinColumns = @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name = "idVisiteur") )
	private Set<Visiteur> visiteur = new HashSet<Visiteur>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getNom() {
		return nom;
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

	
	public Date getDatedebut() {
		return datedebut;
	}

	public void setDatedebut(Date datedebut) {
		this.datedebut = datedebut;
	}

	public Date getDatefin() {
		return datefin;
	}

	public void setDatefin(Date datefin) {
		this.datefin = datefin;
	}

	public Set<Visiteur> getVisiteur() {
		return visiteur;
	}

	public void setVisiteur(Set<Visiteur> visiteur) {
		this.visiteur = visiteur;
	}
	
	
	
	
}
