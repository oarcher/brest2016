/**
 * http://usejsdoc.org/
 */

/**
 * Déclaration du module principal Ce script ne fait que ca voir
 * https://github.com/johnpapa/angular-styleguide
 */

(function() {
	'use strict';

	angular.module('brest2016App', [
	                                
	// pour $resource, un $http
	// specailisé REST qui gere
	// l'unwrap des templates
	// promises
	'ngResource',

	// une specialisation de $ressource pour
	// interroger un
	// serveur spring-data-rest
	'spring-data-rest',

	// angular material
	'ngMaterial',
	
	'angular-growl'])
	
	.config(['growlProvider','$httpProvider', function(growlProvider,$httpProvider) {
		  growlProvider.onlyUniqueMessages(false);
		  growlProvider.globalReversedOrder(true);
		  growlProvider.globalDisableCloseButton(true);
		  growlProvider.globalTimeToLive(5000);
		  growlProvider.globalDisableCountDown(true);
		  $httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor);
	}])

	


})();

// angular.module('brest2016App', ['ngResource']);
