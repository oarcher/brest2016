/**
 * 
 */
package brest2016.spring.controller;

/**
 * @author oarcher
 * ServerMessage
 * compatible avec angular-growl. Chaque message est un json, par exemple
 * { text : "le message" , severity : "info }
 *
 */
public class ServerMessage {
	
	private String text;
	private String severity;
	
	public ServerMessage(String text){
		this.text = text;
		this.severity = "info";
	}
	
	public ServerMessage(String text, String severity){
		this.text = text;
		this.severity = severity;
	}
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}


	
}
