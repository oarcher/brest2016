/**
 * http://usejsdoc.org/
 */

/**
 * Déclaration du module principal
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
	'spring-data-rest', 'ui.calendar', 'ui.bootstrap', 'angular-growl', 'ngDragDrop', 'ngMessages', 'ui.chart' ])

	// config des messages de type 'growl'.
	// en particulier in intercepteur $http qui affiche
	// automatiquement les erreurs en provenance du serveur
	.config([ 'growlProvider', '$httpProvider', function(growlProvider, $httpProvider) {
		growlProvider.onlyUniqueMessages(false);
		growlProvider.globalReversedOrder(true);
		growlProvider.globalDisableCloseButton(true);
		growlProvider.globalTimeToLive(5000);
		growlProvider.globalDisableCountDown(true);
		$httpProvider.interceptors.push(growlProvider.serverMessagesInterceptor);
	} ])

})();

// angular.module('brest2016App', ['ngResource']);
