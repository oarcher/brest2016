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
	var services = {
		// hateoas , le format rest spring
		hateoas : hateoas,

		// gestion générique des messages d'erreurs
		showErrors : showErrors,
		
		// retourne le restobject d'un élément  
		getRestobject : getRestobject
		
	};

	return services;

	function showErrors(response) {
		// callback error sur promise http
		angular.forEach(response.data.errors, function(error) {
			growl.addWarnMessage(error);
			console.log(error);
		});

	}

	function hateoas(restobject) {
		// TODO : les restobject valides sont dans
		// http://localhost:8080/brest2016/rest/profile
		console.log("crud " + restobject)

		// TODO ? voir
		// http://www.codeproject.com/Tips/891279/CRUD-Operations-with-resource
		// pour les redifinitions de methode
		var url = '/brest2016/rest/' + restobject;

		var service = {
			query : query,
			create : create,
			remove : remove

		}

		return service;

		/* Implémentation des fonctions */

		/**
		 * query : retourne tous les elements
		 */
		function query() {
			// lst contiendra les resultat a la resolution de la promise
			var lst = [];

			// get au lieu de query, car hateoas retourne un objet, pas un
			// tableau
			$resource(url, {}).get(function(response) {
				// la reponse hateoas est post processée par
				// SpringDataRestAdapter
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					angular.forEach(processedResponse._embeddedItems, function(element, key) {
						lst.push(element);
					});
				});
			}, function(errors) {
				showErrors(errors);
			});

			return lst;
		}

		/**
		 * read : retourne un element, par id
		 */

		/**
		 * create : creation d'un element 
		 * element est l'element a creer (json), sans id et sans tags hateoas
		 * callbackok est le callback a appeler quand la promise est resolue. la reponse est l'objet créé
		 */

		function create(element, callbackok) {
			console.log('create ' + restobject + ":" + JSON.stringify(element))
			return $resource(url, {}).save(element, callbackok, function(errors) {
				showErrors(errors);
			});
		}
		
		/**
		 * remove :  suppression d'un element
		 * element est un element hateoas, avec id et href
		 * callbackok est le callback a appeller quand la promise est resolue. la reponse est vide,
		 * mais ce callback permet de retirer l'élément d'une liste en cas de succes.
		 * 
		 */
		function remove(element, callbackok){
			var self_url=element._links.self.href;
			console.log('remove ' + JSON.stringify(element));
			console.log('remove self_url' + JSON.stringify(self_url));
			return $resource(self_url, {}).remove(callbackok, function(errors) {
				showErrors(errors);
			});
		}

	}
	
	/**
	 * getRestobject
	 * retourne le restobject d'un element
	 * 
	 * le restobject est le nom qui se trouve dans une url rest
	 * par exemple, dans http://localhost:8080/brest2016/rest/animations/170
	 * le restobject est 'animations'  
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
