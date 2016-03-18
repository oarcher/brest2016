/**
 * 
 */
package bean;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
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
import validator.NonOverlapActivitesMoyen;

/**
 * @author oarcher
 *
 */

@Entity
@Table(name = "oarcher_activite")
//validateur de classe. deux activitées d'un meme
//moyen ne peuvent pas etre deployées sur une meme plage horaire
@NonOverlapActivitesMoyen 
public class Activite implements Serializable {

	private static final long serialVersionUID = -7798619187798323712L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long id = null;

	@NotNull
	@DateTimeFormat
	// validateur personnalisé pour respecter les dates de brest 2016
	// TODO :  passer les dates en parametre value=
	@DateActiviteValide
	private Date datedebut;

	@NotNull
	@DateTimeFormat
	@DateActiviteValide
	private Date datefin;
	// voir http://stackoverflow.com/questions/28553555/how-to-post-new-nested-entities-using-spring-data-rest
	// pour le optional=false
	// pour creer une activite liée a un moyen en un coup : curl-i -X POST -H 'Content-Type:application/json' -d '{"lieu":"lieu par defaut", "moyen" : "http://localhost:8080/brest2016/rest/moyens/7" , "datedebut":"2016-07-14T09:00:00","datefin":"2016-07-14T11:00:00"}'  http://localhost:8080/brest2016/rest/activites

	@ManyToOne(optional=false)  
	@JoinColumn(name = "moyen_id")
	@NotNull
	private Moyen moyen = null;
	
	@ManyToMany(mappedBy = "activites") // champ activites de bean.Visiteur
	private Set<Visiteur> visiteurs = new HashSet<Visiteur>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Moyen getMoyen() {
		return moyen;
	}

	public void setMoyen(Moyen moyen) {
		System.out.println("On declare un moyen dans activite" + moyen);
		this.moyen = moyen;
	}

	public Set<Visiteur> getVisiteurs() {
		return visiteurs;
	}

	public void setVisiteurs(Set<Visiteur> visiteurs) {
		this.visiteurs = visiteurs;
	}

	@Override
	public String toString() {
		DateFormat formatter = new SimpleDateFormat("hh:mm");
		
		String string = "" + moyen + " de " + formatter.format(datedebut) + " a " + formatter.format(datefin);
		return string;

	}
	
}
