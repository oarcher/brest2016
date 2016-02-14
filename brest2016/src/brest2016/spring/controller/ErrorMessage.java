/**
 * 
 */
package brest2016.spring.controller;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author oarcher
 * adapté de 
 *  https://gist.github.com/matsev/4519323#file-errormessage-java
 */
public class ErrorMessage {

    private List<String> errors;

    public ErrorMessage() {
    }

    public ErrorMessage(List<String> errors) {
        this.errors = errors;
    }

    public ErrorMessage(String error) {
        this(Collections.singletonList(error));
    }

    public ErrorMessage(String ... errors) {
        this(Arrays.asList(errors));
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
