/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;
import bean.Animation;

@Controller
public class Brest2016Mapping {

	private List<Animation> listeanimation = new ArrayList<Animation>();

	@RequestMapping(value = "/acceuil.htm")
	public String pageAcceuil() {
		System.out.println("Mapping acceuil.htm");
		return "brest2016";
	}

	@RequestMapping(value = "/brest2016.htm")
	public ModelAndView pageAdmin() {
		System.out.println("Mapping brest2016.htm");
		ModelAndView view = new ModelAndView();
		view.setViewName("brest2016"); // /WEB-INF/views/admin.jsp selon le
										// resolver
										// defini dans WebAppConfig
		return view;
	}

	@RequestMapping(value = "/listeanimations.json", method = RequestMethod.GET)
	@ResponseBody
	public List<Animation> listeAnimation() {
		System.out.println("Mapping listeanimations.json");
		return listeanimation;

	}

	// Les erreurs de validations sont gérées par la classe ControllerExceptionHandler 
	// et sans utiliser BindingResult
	@RequestMapping(value = "/ajouteranimation.json", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<List<Animation>> ajouterAnimation(@RequestBody @Valid Animation animation) throws MethodArgumentNotValidException {
		System.out.println("Mapping ajouteranimations.json");
		listeanimation.add(animation);
		return new ResponseEntity<>(listeanimation, HttpStatus.OK);
	}
	
	

}
