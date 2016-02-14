/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.List;

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

import brest2016.spring.controller.ErrorMessage;

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
	public ControllerExceptionHandler() {
		System.out.println("ControllerExceptionHandler: Initialisation des gestionnaires d'erreur");
	}

	@ExceptionHandler(ConstraintViolationException.class)
	protected ResponseEntity<ErrorMessage> handleConstraintViolationException(ConstraintViolationException ex) {
		List<String> errors = new ArrayList<String>();
		for(ConstraintViolation<?> violation : ex.getConstraintViolations()) {
			String error= "Valeur '" +violation.getInvalidValue() +"' de "  + violation.getRootBeanClass().getSimpleName() + "."  +  violation.getPropertyPath() + " ne respecte pas la contrainte '" + violation.getMessage() + "'";
			errors.add(error);
            System.out.println(error);
        }
		ErrorMessage errorMessage = new ErrorMessage(errors);
		return new ResponseEntity<ErrorMessage>(errorMessage, HttpStatus.BAD_REQUEST);
	}

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
		List<ObjectError> globalErrors = ex.getBindingResult().getGlobalErrors();
		List<String> errors = new ArrayList<>(fieldErrors.size() + globalErrors.size());
		String error;
		for (FieldError fieldError : fieldErrors) {
			error = fieldError.getField() + ": " + fieldError.getDefaultMessage();
			errors.add(error);
		}
		for (ObjectError objectError : globalErrors) {
			error = objectError.getObjectName() + ": " + objectError.getDefaultMessage();
			errors.add(error);
		}
		System.out.println("handleMethodArgumentNotValid" + errors.toString());
		ErrorMessage errorMessage = new ErrorMessage(errors);
		return new ResponseEntity(errorMessage, headers, status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		String unsupported = "Unsupported content type: " + ex.getContentType();
		String supported = "Supported content types: " + MediaType.toString(ex.getSupportedMediaTypes());
		ErrorMessage errorMessage = new ErrorMessage(unsupported, supported);
		return new ResponseEntity(errorMessage, headers, status);
	}

	@Override
	protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		Throwable mostSpecificCause = ex.getMostSpecificCause();
		ErrorMessage errorMessage;
		if (mostSpecificCause != null) {
			String exceptionName = mostSpecificCause.getClass().getName();
			String message = mostSpecificCause.getMessage();
			errorMessage = new ErrorMessage(exceptionName, message);
		} else {
			errorMessage = new ErrorMessage(ex.getMessage());
		}
		return new ResponseEntity(errorMessage, headers, status);
	}

	@ExceptionHandler(NumberFormatException.class)
	protected ResponseEntity<String> handleNumberFormatException(NumberFormatException ex) {

		return ResponseEntity.badRequest().body(ex.toString());
	}

}