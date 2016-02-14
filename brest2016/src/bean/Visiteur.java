/**
 * 
 */
package bean;

import org.hibernate.validator.constraints.NotBlank;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_visiteur")
public class Visiteur implements Serializable{
 
    private static final long serialVersionUID = -7788619177798333712L;

	/**
	 * 
	 */
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column
    private Long id;
    
	@NotBlank(message = "ne peux pas être vide")
	private String nom="";
	@NotBlank(message="ne peux pas être vide")
	private String prenom="";
	
	public Visiteur() {
	}

	public Visiteur(Long id, String nom, String prenom) {
		this.id=id;
		this.nom=nom;
		this.prenom=prenom;
	}
	
	// copy constructor
	public Visiteur(Visiteur animation){
		this.id=animation.id;
		this.nom=animation.nom;
		this.prenom=animation.prenom;
	}
	
	

	public String toString(){
		return "id : " + this.id + " nom : " + this.nom + " prenom : " + this.prenom;
	}
	
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

	public String getprenom() {
		return prenom;
	}

	public void setprenom(String prenom) {
		this.prenom = prenom;
	}
	
	
}
