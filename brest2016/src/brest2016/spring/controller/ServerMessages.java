/**
 * 
 */
package brest2016.spring.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * @author oarcher
 * 
 * Messages retournés par ResponseEntity
 * Le format est celui attendu par angular-growl, qui les affiche automatiquent 
 * par growlProvider.serverMessagesInterceptor
 */
public class ServerMessages {

    private List<ServerMessage> messages;

    public ServerMessages() {
    	this.messages=  new ArrayList<ServerMessage>();
    }

    public ServerMessages(List<ServerMessage> messages) {
        this.messages = messages;
    }

    public void add(ServerMessage message) {
    	this.messages.add(message);
    }

	public List<ServerMessage> getMessages() {
		return messages;
	}

	public void setMessages(List<ServerMessage> messages) {
		this.messages = messages;
	}

   
}
