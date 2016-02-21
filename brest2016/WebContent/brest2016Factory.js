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

function factory($resource, $http, growl, SpringDataRestAdapter) {
	console.log('Factory init');
	var services = {
			
		// gestion générique des messages d'erreurs
		showErrors : showErrors,
		
		// retourne le restobject d'un élément  
		getRestobject : getRestobject
		
	};

	return services;

	function showErrors(response) {
		console.log('showErrors full : ' + response);
		// callback error sur promise http
		angular.forEach(response.data.errors, function(error) {
			growl.addWarnMessage(error);
			console.log(error);
		});

	}

	/**
	 * getRestobject
	 * retourne le restobject d'un element
	 * 
	 * le restobject est le nom qui se trouve dans une url rest
	 * par exemple, dans http://localhost:8080/brest2016/rest/stands/170
	 * le restobject est 'stands'  
	 * (par convention, les restobject sont toujours au pluriel, avec un 's'
	 * 
	 */
	function getRestobject(element){
		var split_url = element._links.self.href.split('/');
		var restobject = split_url[split_url.length -2];
		console.log('restobject ' + restobject);
		return restobject;
	}
	

}

})();
