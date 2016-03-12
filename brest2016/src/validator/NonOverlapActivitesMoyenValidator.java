/**
 * 
 */
package validator;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import bean.Activite;
import bean.Moyen;

/**
 * @author oarcher voir
 *         https://docs.jboss.org/hibernate/validator/5.0/reference/en-US/html/
 *         validator-customconstraints.html
 *
 */

public class NonOverlapActivitesMoyenValidator implements ConstraintValidator<NonOverlapActivitesMoyen, Activite> {

	@Override
	public void initialize(NonOverlapActivitesMoyen paramA) {

	}

	@Override
	public boolean isValid(Activite activite, ConstraintValidatorContext ctx) throws ConstraintViolationException {
		System.out
				.println("NonOverlapActivitesMoyenValidator pour activité" + activite + " (" + activite.getId() + ")");
		Moyen moyen = activite.getMoyen();
		if (moyen != null) {
			for (Activite activite_soeur : moyen.getActivites()) {
				if (activite_soeur.getId() != activite.getId()) {
					System.out.println("NonOverlapActivitesMoyenValidator : verification horaire avec " + activite_soeur
							+ " (" + activite_soeur.getId() + ")");
					boolean valid = true;
					if (activite.getDatefin().after(activite_soeur.getDatedebut())
							&& activite.getDatedebut().before(activite_soeur.getDatefin())) {
						valid = false;
					}
					if (activite.getDatedebut().after(activite_soeur.getDatedebut())
							&& activite.getDatedebut().before(activite_soeur.getDatefin())) {
						valid = false;
					}
					if (!valid) {
						ctx.disableDefaultConstraintViolation();
						ctx.buildConstraintViolationWithTemplate("L'horaire doit être libre").addConstraintViolation();
						// .addConstraintViolation();
						return false;
					}
				}
			}
		} else {
			System.out.println("***************** Activite orpheline!");
		}

		return true;
	}

}