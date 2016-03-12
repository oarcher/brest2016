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
	
	private String nom;
	
	// http://stackoverflow.com/questions/30464782/how-to-maintain-bi-directional-relationships-with-spring-data-rest-and-jpa
	// CascadeType.REMOVE pour supprimer les activites associées en cas de suppression d'un moyen
	//@OneToMany( cascade = CascadeType.REMOVE ,mappedBy="moyen")
	@OneToMany(mappedBy="moyen")
	//@JoinTable(name="oarcher_activite_oarcher_moyen", joinColumns = @JoinColumn(name = "moyen_id") , inverseJoinColumns = @JoinColumn(name = "activite_id"))
	//@OneToMany( cascade = CascadeType.ALL)
	//@JoinTable(name="oarcher_activite_oarcher_moyen", joinColumns = @JoinColumn(name = "moyen_id") , inverseJoinColumns = @JoinColumn(name = "activite_id"))
	// voir @Getter @Setter http://stackoverflow.com/questions/34754992/how-to-update-a-manytoone-relationship-with-spring-data-rest
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

	//@OneToMany( fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy="moyen")
	public Set<Activite> getActivites() {
		return activites;
	}
	
	public void setActivite(Set<Activite> activites) {
		this.activites = activites;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}
	
	@Override
	public String toString(){
		return nom;
		
	}
	
	@PreUpdate
	private void preUpdate() {
		for (Activite act : activites) {
			System.out.println("************ Moyen activite : " + act);
		}
		
	}

}
