/**
 * 
 */
package bean;

import java.io.Serializable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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

	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	@JoinTable(name = "oarcher_animation_horaire", joinColumns = @JoinColumn(name = "idAnimation") , inverseJoinColumns = @JoinColumn(name = "idHoraire") )
	Animation animation = null;

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

	public Animation getAnimation() {
		return animation;
	}

	public void setSalle(Animation salle) {
		this.animation = salle;
	}

}
