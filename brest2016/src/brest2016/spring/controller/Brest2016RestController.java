/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.sql.DataSource;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author oarcher
 *
 */

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;
import bean.Animation;


/**
 * The Class Brest2016RestController.
 * 
 * Implementation du controller 100% REST
 * Son role est de permettre de faire de requetes a la base de données 
 * de type CRUD (Create Read Update Delete )
 * 
 * Les opérations CRUD sont fonction de la RequestMethod.* :
 * 
 * Create 	: POST   
 * Read		: GET
 * Update	: PUT
 * Delete	: DELETE
 *  
 *  
 *  == return ResponseEntity
 *  
 *  Toutes les methodes retournent un JSON encapsulé dans un ResponseEntity, qui permet d'y associer
 *  un code HttpStatus.*
 *  
 *  
 *  == Gestion des erreurs de validation avec ControllerExceptionHandler:
 *  
 *  Plutot que de gérer en interne de la methode les erreurs de validation a l'aide de BindingResult,
 *  certaines methode peuvent lever une exeption, par exemple en cas d'argument non valide.
 *  Ces exeptions sont gérées par la classe ControllerExceptionHandler, qui retourne un ResponseEntity
 *  avec un message d'erreur construit a partir des erreurs ( par exemple de validation )
 *  Cela implique de ne pas gérer les erreurs a l'intérieur de la methode a l'aide de BindingResult.
 *  
 */

@RestController
public class Brest2016RestController {

	
	/** 
	 * DAO: Acces aux données. 
	 * Il est '@Autowired', c'est a dire qu'il est géré par spring (voir WebappConfig)
	 * 
	 */
	@Autowired
	Dao dao;

	// Non REST ...
	//
	// @RequestMapping(value = "/acceuil.htm")
	// public String pageAcceuil() {
	// System.out.println("Mapping acceuil.htm");
	// return "brest2016";
	// }
	//
	// @RequestMapping(value = "/brest2016.htm")
	// public ModelAndView pageAdmin() {
	// System.out.println("Mapping brest2016.htm");
	// ModelAndView view = new ModelAndView();
	// view.setViewName("brest2016"); // /WEB-INF/views/admin.jsp selon le
	// // resolver
	// // defini dans WebAppConfig
	// return view;
	// }


	/**
	 * Methodes CRUD d'acces a la table des animations
	 */
	
	/**
	 * Create (POST)
	 *
	 * @param animation the animation
	 * @return ResponseEntity avec HttpStatus.OK en cas de succes
	 * @throws MethodArgumentNotValidException si animation n'est pas valide 
	 * 	
	 */
	// TODO Ailleurs : utiliser @InitBinder pour ecrire un validateur complexe
	@RequestMapping(value = "/rest/animation.json", method = RequestMethod.POST)
	public ResponseEntity createAnimation(@RequestBody @Valid Animation animation) throws MethodArgumentNotValidException {
		System.out.println("Mapping POST (Create ) animation.json");
		dao.createAnimation(animation);
		return new ResponseEntity(HttpStatus.OK);
	}
	
	/**
	 * Read (GET)
	 *
	 * @return JSON ResponseEntity contenant les animations
	 */
	@RequestMapping(value = "/rest/animation.json", method = RequestMethod.GET)
	public ResponseEntity<?> animation() {
		System.out.println("Mapping GET (Read ) /animation.json");
		return new ResponseEntity<>(dao.readAnimation(),HttpStatus.OK);

	}

	
	

}
