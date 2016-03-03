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
import javax.persistence.Transient;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;

import validator.DateActiviteValide;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_activite")
public class Activite implements Serializable {

	private static final long serialVersionUID = -7798619187798323712L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id = null;

	private String lieu;

	// TODO date valide
	@NotNull
	@DateTimeFormat
	@DateActiviteValide
	private Date datedebut;

	@NotNull
	@DateTimeFormat
	@DateActiviteValide
	private Date datefin;

	@ManyToOne( cascade=CascadeType.ALL)
	@JoinColumn(name = "moyen_id")
	// @JoinTable(name="oarcher_activite_oarcher_moyen", joinColumns =
	// @JoinColumn(name = "activite_id") , inverseJoinColumns = @JoinColumn(name
	// = "moyen_id"))
	private Moyen moyen = null;
	
	@ManyToMany(mappedBy = "activites") // champ activites de bean.Visiteur
	// @JoinTable(name = "oarcher_visiteur_activite", joinColumns =
	// @JoinColumn(name = "idActivite") , inverseJoinColumns = @JoinColumn(name
	// = "idVisiteur") )
	private Set<Visiteur> visiteur = new HashSet<Visiteur>();

	@Transient
	Set<ConstraintViolation<?>> constraintViolations = new HashSet<ConstraintViolation<?>>();
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	// @ManyToOne
	// @JoinColumn(name="moyen_id")
	public Moyen getMoyen() {
		return moyen;
	}

	public void setMoyen(Moyen moyen) {
		System.out.println("On declare un moyen dans activite" + moyen);
		this.moyen = moyen;
	}

	public Set<Visiteur> getVisiteur() {
		return visiteur;
	}

	public void setVisiteur(Set<Visiteur> visiteur) {
		this.visiteur = visiteur;
	}

	@Override
	public String toString() {
		String string = "activite : ";
		string += " id : " + id;
		string += " datedebut : " + datedebut;
		string += " datefin : " + datefin;
		string += " moyen : " + moyen ;
		return string;

	}
	
	@PrePersist
	private void prePersist() throws ConstraintViolationException{
		
		//Set<Activite> moyen_activites = moyen.getActivite();
		System.out.println("PrePersist !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! activite : "  + this.toString() );
//		if(!constraintViolations.isEmpty()){
//			throw new ConstraintViolationException("test", constraintViolations );
//		}

	
	}
	
	@PostPersist
	private void postPersist(){
		System.out.println("PostPersist !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! activite : " + this.toString() );
	}
	
	@PostLoad
	private void postLoad(){
		System.out.println("PostLoad !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! activite  : " + this.toString() );
	}
	
	@PreUpdate
	private void preUpdate() throws ConstraintViolationException {
		// voir https://docs.jboss.org/hibernate/validator/4.1/reference/en-US/html/validator-customconstraints.html
		System.out.println("PreUpdate !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! activite : "  + this.toString() );
		Set<Activite> moyen_activites = moyen.getActivite();
		for (Activite moyen_activite : moyen_activites) {
			System.out.println("Soeurs : " + moyen_activite);
			constraintViolations.add(null);
		}
//		Set<ConstraintViolation<?>> constraintViolations = new HashSet<ConstraintViolation<?>>();
//		throw new ConstraintViolationException("test", constraintViolations );

	}
	
	@PostUpdate
	private void postUpdate(){
		System.out.println("PostUpdate !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! activite  : "  + this.toString() );
	}

}
