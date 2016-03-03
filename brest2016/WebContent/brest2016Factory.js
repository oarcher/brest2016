/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	/**
	 * 
	 * 
	 */

	angular.module('brest2016App').factory('Brest2016Factory', factory);

	function factory(growl) {
		console.log('Factory init');
		var services = {
			// gestion générique des messages d'erreurs
			// showMessages : showMessages,
			showMessage : showMessage
		// retourne le restobject d'un élément
		// getRestobject : getRestobject

		};

		return services;

		function showMessage(message, type) {
			console.log(message);
			if (!type) {
				type = "info"
			}
			growl[type](message, {
				ttl : 10000
			});
		}

	}

})();
