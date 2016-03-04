/**
 * 
 */
package validator;

/**
 * @author oarcher
 * 
 * permet la mise en place d'un validateur personnalisé @NonOverLapActivitesMoyen
 * pour la validation du deploiement d'un moyen en activite:
 * un moyen ne peut pas deployer 2 activitées au meme moment !
 
 */


import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;
import java.lang.annotation.RetentionPolicy;
 
import javax.validation.Constraint;
import javax.validation.Payload;
import validator.ActiviteValidator;
 
@Documented
@Constraint(validatedBy = NonOverlapActivitesMoyenValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface NonOverlapActivitesMoyen {
  
      
    String message() default "2 activitées d'un meme moyen se chevauchent!";
      
    Class<?>[] groups() default {};
      
    Class<? extends Payload>[] payload() default {};
       
}