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
import bean.Horaire;
import bean.Stand;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_visiteur")
public class Visiteur implements Serializable{
 
    private static final long serialVersionUID = -7788619178798333712L;

	/**
	 * 
	 */
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
	@NotBlank(message = "ne peux pas être vide")
	private String nom="";
	@NotBlank(message="ne peux pas être vide")
	private String prenom="";
	
//	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
//	@JoinTable(name = "oarcher_visiteur_horaire_stand", joinColumns = @JoinColumn(name = "idHoraire") , inverseJoinColumns = @JoinColumn(name = "idStand") )
//	private Collection<Horaire> horaire = new ArrayList<Horaire>();
	
	
	// tout le monde partage les memes horaires
	@ManyToMany
	@JoinTable(name = "oarcher_activite_visiteur", joinColumns = @JoinColumn(name = "idVisiteur") , inverseJoinColumns = @JoinColumn(name = "idActivite") )
	private Set<Activite> activite = new HashSet<Activite>();

	
//	public Visiteur() {
//	}

//	public Visiteur(Long id, String nom, String prenom) {
//		this.id=id;
//		this.nom=nom;
//		this.prenom=prenom;
//	}
	
//	// copy constructor
//	public Visiteur(Visiteur animation){
//		this.id=animation.id;
//		this.nom=animation.nom;
//		this.prenom=animation.prenom;
//	}
	
	

//	public String toString(){
//		return "id : " + this.id + " nom : " + this.nom + " prenom : " + this.prenom;
//	}
//	
//	public Long getId() {
//		return id;
//	}

//	public void setId(Long id) {
//		this.id = id;
//	}



	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public Set<Activite> getActivite() {
		return activite;
	}

	public void setActivite(Set<Activite> activite) {
		this.activite = activite;
	}

	
	
	
	
}
