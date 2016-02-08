/**
 * 
 */
package brest2016.spring.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;

/**
 * @author oarcher
 * 
 * voir http://www.concretepage.com/spring-4/spring-4-mvc-jsonp-example-with-rest-responsebody-responseentity
 * 
 * JsonpAdvice permet de retourner les json sous forme de javascript 
 * si l'url se termine par ?callback=myfunction
 * c'est a dire:
 * myfunction({ "var" : "value"})
 * au lieu de { "var" : "value" }
 * 
 * c'est utilisé par l'interface $http.jsonp d'angular
 *
 */
@EnableWebMvc
@ControllerAdvice
public class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
    public JsonpAdvice() {
    	super("callback");
    	System.out.println("JsonpAdvice : Mise en place du callback JSONP (Vraiment utile ?)");
    }
} 
