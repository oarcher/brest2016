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
@Table(name = "oarcher_horaire")
public class Horaire implements Serializable{
 
    private static final long serialVersionUID = -7788619177798333712L;

	/**
	 * 
	 */
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column
    private Long id;
    
	@NotBlank(message = "ne peux pas être vide")
	private String plage="";
	
	public Horaire() {
	}

	public Horaire(Long id, String plage) {
		this.id=id;
		this.plage=plage;
	}
	
	// copy constructor
	public Horaire(Horaire horaire){
		this.id=horaire.id;
		this.plage=horaire.plage;
	}
	
	

	public String toString(){
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

	public void setPlage(String nom) {
		this.plage = plage;
	}

}
