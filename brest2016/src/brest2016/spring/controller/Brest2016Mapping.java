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
import org.springframework.web.servlet.ModelAndView;

@Controller
public class Brest2016Mapping {

	@RequestMapping(value="/admin")
	public ModelAndView pageAdmin() {
		ModelAndView view = new ModelAndView();
		view.setViewName("admin"); // /WEB-INF/views/admin.jsp  selon le resolver defini dans WebAppConfig

		String str = "Test !!! ";
		view.addObject("message", str); //adding of str object as 'message' parameter

		return view;
	}

}
