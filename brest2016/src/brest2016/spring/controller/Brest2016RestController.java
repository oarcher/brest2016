/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author oarcher
 *
 */

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerMapping;
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

@RestController("/rest")
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
	 *   	L'animation fournie est sans id. celui-ci est positionné par le dao
	 * @return ResponseEntity avec HttpStatus.FOUND (redirect) en cas de succes
	 * 		le header 'Location' est positionné sur l'url de l'animation,
	 * 		pour que le client ait connaissance de l'id créé (par un GET)
	 * 		voir https://fr.wikipedia.org/wiki/Post-Redirect-Get
	 * @throws MethodArgumentNotValidException si animation n'est pas valide 
	 * 	
	 */
	// TODO Ailleurs : utiliser @InitBinder pour ecrire un validateur complexe
	@RequestMapping(value = "/rest/animation.json", method = RequestMethod.POST)
	public ResponseEntity createAnimation(@RequestBody @Valid Animation animation) throws MethodArgumentNotValidException {
		// test par curl -v -H "Content-Type: application/json" -X POST -d '{"nom":"testCurl","descr":"test descr"}' http://localhost:5913/brest2016/rest/animation.json
		System.out.println("Mapping POST (Create ) animation.json");
		
		animation=dao.createAnimation(animation);  // animation n'avait pas d'id, il en a maintenant un généré par le dao

		// mise en place de l'url de redirection
		// recuperation du context root (/brest2016) pour contruire l'url de redirection
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
		String createdUrl = request.getContextPath() +  "/rest/" + animation.getId() + "/animation.json";
		System.out.println("redirection vers : " + createdUrl);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Location", createdUrl);

		return new ResponseEntity<>(null, headers ,HttpStatus.FOUND);
	}
	
	/**
	 * Read (GET)
	 *
	 * @return JSON ResponseEntity contenant les animations
	 */
	@RequestMapping(value = "/rest/animation.json", method = RequestMethod.GET)
	public ResponseEntity<?> queryAnimation() {
		System.out.println("Mapping Query all (Read ) /animation.json");
		return new ResponseEntity<>(dao.readAnimation(),HttpStatus.OK);

	}
	
	/**
	 * Read (GET)
	 *
	 * @return JSON ResponseEntity contenant UNE animation
	 */
	@RequestMapping(value = "/rest/{strid}/animation.json", method = RequestMethod.GET)
	public ResponseEntity<?> getAnimation(@PathVariable String strid) throws NumberFormatException {
		System.out.println("Mapping GET (One Read " + strid + ") /animation.json");
		int id=Integer.parseInt(strid);  // throws NumberFormatException
		Animation animation = dao.readAnimation(id);  // out of bounds non géré ..
		return new ResponseEntity<>(animation ,HttpStatus.OK);
		
	}


	/**
	 * Destroy (DELETE)
	 *
	 * @return HttpStatus.OK si OK. sinon

	 */
	@RequestMapping(value = "/rest/{strid}/animation.json", method = RequestMethod.DELETE)
	public ResponseEntity<?> DestroyAnimation(@PathVariable String strid) throws MethodArgumentNotValidException {
		System.out.println("Mapping Destroye (One Read " + strid + ") /animation.json");
		int id=Integer.parseInt(strid);  // throws NumberFormatException
		int result=dao.destroyAnimation(id);  // out of bounds non géré ..
		
		
		if (result == 0){
			// pas d'animation trouvée ...
			//throw new MethodArgumentNotValidException(null, null);
			return new ResponseEntity<>("id animation non trouvé" , null ,HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(null,HttpStatus.OK);
		}
	}
	

}
