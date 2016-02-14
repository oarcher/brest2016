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
	'ui.bootstrap',

	// elements de menus + css facon twitter
	'spring-data-rest',

	// growl messages popup
	, 'angular-growl', 'ngSanitize' ])

	.config(function(growlProvider) {
		growlProvider.globalTimeToLive(9000);
		growlProvider.globalEnableHtml(true);
	})


})();

// angular.module('brest2016App', ['ngResource']);
