/**
 * 
 */
package bean;

/**
 * @author oarcher
 *
 */
public class Animation {

	/**
	 * 
	 */
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
