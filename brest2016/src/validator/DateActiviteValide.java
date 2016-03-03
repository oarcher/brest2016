/**
 * 
 */
package validator;

/**
 * @author oarcher
 * 
 * permet la mise en place d'un validateur personnalisé @DateActiviteValide
 * pour la validation des dates d'une activite
 * voir http://www.journaldev.com/2668/spring-mvc-form-validation-example-using-annotation-and-custom-validator-implementation
 *
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
@Constraint(validatedBy = ActiviteValidator.class)
@Target( { ElementType.METHOD, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface DateActiviteValide {
  
      
    String message() default "L'activite doit respecter les dates de Brest 2016";
      
    Class<?>[] groups() default {};
      
    Class<? extends Payload>[] payload() default {};
       
}