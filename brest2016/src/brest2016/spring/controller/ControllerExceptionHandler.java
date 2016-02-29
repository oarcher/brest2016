/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import javax.validation.*;

import brest2016.spring.controller.ServerMessages;

/**
 * @author oarcher
 * 
 *         adapté de
 *         https://gist.github.com/matsev/4519323#file-errormessage-java
 * 
 *         Permet d'avoir des messages d'erreurs personnalisés, Tout en
 *         utilisant un objet de retour ResponseEntity standard et facilement
 *         gérable du coté d'angular
 *
 */

@EnableWebMvc
@ControllerAdvice
public class ControllerExceptionHandler extends ResponseEntityExceptionHandler {
	
	final Logger log = Logger.getLogger(this.getClass());
	
	public ControllerExceptionHandler() {
		log.info("ControllerExceptionHandler: Initialisation des gestionnaires d'erreurs");
	}

	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ServerMessages> handleConstraintViolationException(ConstraintViolationException ex) {
		ServerMessages serverMessages = new ServerMessages();
		//List<String> errors = new ArrayList<String>();
		for(ConstraintViolation<?> violation : ex.getConstraintViolations()) {
			String error= "Valeur '" +violation.getInvalidValue() +"' de "  + violation.getRootBeanClass().getSimpleName() + "."  +  violation.getPropertyPath() + " ne respecte pas la contrainte '" + violation.getMessage() + "'";
			serverMessages.add(new ServerMessage(error,"warning"));
            log.info(error);
        }
		return new ResponseEntity<ServerMessages>(serverMessages, HttpStatus.BAD_REQUEST);
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ServerMessages serverMessages = new ServerMessages();
		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
		List<ObjectError> globalErrors = ex.getBindingResult().getGlobalErrors();
		List<String> errors = new ArrayList<>(fieldErrors.size() + globalErrors.size());
		String error;
		for (FieldError fieldError : fieldErrors) {
			error = fieldError.getField() + ": " + fieldError.getDefaultMessage();
			serverMessages.add(new ServerMessage(error,"warning"));
		}
		for (ObjectError objectError : globalErrors) {
			error = objectError.getObjectName() + ": " + objectError.getDefaultMessage();
			serverMessages.add(new ServerMessage(error,"warning"));
		}
		log.info("handleMethodArgumentNotValid" + errors.toString());
		return new ResponseEntity<Object>(serverMessages, headers, status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		ServerMessages serverMessages = new ServerMessages();
		String unsupported = "Unsupported content type: " + ex.getContentType();
		String supported = "Supported content types: " + MediaType.toString(ex.getSupportedMediaTypes());
		serverMessages.add(new ServerMessage(unsupported + "\n" +  supported , "error"));
		return new ResponseEntity<Object>(serverMessages, headers, status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		Throwable mostSpecificCause = ex.getMostSpecificCause();
		ServerMessages serverMessages = new ServerMessages();
		if (mostSpecificCause != null) {
			String exceptionName = mostSpecificCause.getClass().getName();
			String message = mostSpecificCause.getMessage();
			serverMessages.add(new ServerMessage(exceptionName + " : " + message,"error"));
		} else {
			serverMessages.add(new ServerMessage(ex.getMessage(),"error"));
		}
		return new ResponseEntity<Object>(serverMessages, headers, status);
	}

	@ExceptionHandler(NumberFormatException.class)
	protected ResponseEntity<ServerMessages> handleNumberFormatException(NumberFormatException ex) {
		ServerMessages serverMessages = new ServerMessages();
		//return ResponseEntity.badRequest().body(ex.toString());
		serverMessages.add(new ServerMessage(ex.toString(), "warning"));
		
		return new ResponseEntity<ServerMessages>(serverMessages, HttpStatus.BAD_REQUEST);
	}
	
//	@ExceptionHandler(Exception.class)
//	protected void genericExceptionHandler(Exception exception){
//		log.info("Exception generique" + exception.getClass().getName());
//	}

}