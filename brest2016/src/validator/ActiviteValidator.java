/**
 * 
 */
package validator;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * @author oarcher
 * Validateur de date pour Brest 2016
 * a utiliser avec l'annotation @DateActiviteValide déclarée
 * dans la classe DateActiviteValide
 */

public class ActiviteValidator implements ConstraintValidator<DateActiviteValide, Date> {
	 
    @Override
    public void initialize(DateActiviteValide paramA) {
    }
 
    @Override
    public boolean isValid(Date date, ConstraintValidatorContext ctx) {
    	DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    	Date brest2016Debut = null;
    	Date brest2016Fin = null;
		try {
			brest2016Debut = formatter.parse("13/07/2016");
			brest2016Fin = formatter.parse("20/07/2016");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	if (date.compareTo(brest2016Debut)>0 & date.compareTo(brest2016Fin)<0){
    		return true;
    	}
		return false;
  
    }
 
}