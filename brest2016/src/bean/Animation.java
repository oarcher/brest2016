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
	private String descr="";
	
	public Animation() {
	}

	public Animation(int id, String nom, String descr) {
		this.id=id;
		this.nom=nom;
		this.descr=descr;
	}
	
	// copy constructor
	public Animation(Animation animation){
		this.id=animation.id;
		this.nom=animation.nom;
		this.descr=animation.descr;
	}
	
	

	public String toString(){
		return "id : " + this.id + " nom : " + this.nom + " descr : " + this.descr;
	}
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}
	
	
}
