/**
 * 
 */
package brest2016.spring.controller;



/**
 * @author oarcher
 *
 */

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import bean.Animation;

@Controller
public class Brest2016Mapping {

	//@Autowired
	private Animation animation;
	
	@RequestMapping(value = "/brest2016.htm")
	public ModelAndView pageAdmin() {
		ModelAndView view = new ModelAndView();
		view.setViewName("brest2016"); // /WEB-INF/views/admin.jsp selon le resolver
									// defini dans WebAppConfig

		String str = "mapping Spring";
		view.addObject("message", str); // adding of str object as 'message'
										// parameter

		return view;
	}
	
	@RequestMapping(value = "/listeanimations.json",method=RequestMethod.GET)
	@ResponseBody
	public  Animation listeAnimation() {
		System.out.println("listeanimation");
		Animation animation = new Animation();
		animation.setNom("testanimation");
		animation.setTexte("texte testanimation");
//		List <Animation> listeanim=new ArrayList<Animation>();
//		listeanim.add(new Animation("anim1"));
//		listeanim.add(new Animation("anim2"));
//		
        return animation;

	}

}
