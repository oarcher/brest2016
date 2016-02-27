/**
 * http://usejsdoc.org/
 */

(function() {
 'use strict';
/**
 * $resource logique CRUD:
 * 
 * get() Read, (par id) query() Read, (tout) save() Create remove() delete()
 * 
 * 
 * 
 */

angular.module('brest2016App').factory('Brest2016Factory', factory);

function factory($mdToast,growl) {
	console.log('Factory init');
	var services = {
			
		// gestion générique des messages d'erreurs
		showMessages : showMessages,
		showMessage  : showMessage		
		// retourne le restobject d'un élément  
		//getRestobject : getRestobject
		
	};

	return services;

	function showMessages(response) {
		console.log('showMessages full : ' + response);
		// callback error sur promise http
		angular.forEach(response.data.errors, function(error) {
			//growl.addWarnMessage(error);
			showMessage(error)
			console.log(error);
		});
	}

	function showMessage(message){
		console.log(message);
//		$mdToast.show(
//			      $mdToast.simple()
//			        .textContent(message)
//			        .position("bottom right")
//			        .hideDelay(3000)
//			    );
		growl.info(message, {ttl: 10000}) ;
	}

}

})();
