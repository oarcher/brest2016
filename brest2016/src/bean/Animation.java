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
@Table(name = "oarcher_animation")
public class Animation implements Serializable{
 
    private static final long serialVersionUID = -7788619177798333712L;

	/**
	 * 
	 */
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column
    private int id;
    
	@NotBlank(message = "ne peux pas être vide")
	private String nom="";
	@Size(min=3, message="au moins 3 caractères")
	private String texte="";
	
	public Animation() {
	}

	public Animation(String nom, String texte) {
		this.nom=nom;
		this.texte=texte;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getTexte() {
		return texte;
	}

	public void setTexte(String texte) {
		this.texte = texte;
	}
}
