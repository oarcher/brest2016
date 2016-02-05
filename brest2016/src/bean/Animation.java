/**
 * 
 */
package bean;

import org.hibernate.validator.constraints.NotBlank;

/**
 * @author oarcher
 *
 */
public class Animation {

	/**
	 * 
	 */
	@NotBlank(message = "ne peux pas être vide")
	private String nom="";
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
