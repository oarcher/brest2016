/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('Hateoas', function($resource, SpringDataRestAdapter) {

		console.log('Factory hateoas init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructor
		 */
		function Hateoas(restobject) {
			this.restobject = restobject;
			// query_ojects est la liste des objets retournée par query()
			// toute mmodification de cette liste entraine la modification
			// dans le scope de la fonction appelante.
			this.query_objects= null;
		}


		/** 
		 * methodes publiques (prototype)
		 * 
		 */
		
		Hateoas.prototype = {
                query: query,
                remove : remove,
                create : create,
                profile: profile
                }
		
		/**
		 * query : retourne tous les elements
		 */
		function query() {
			var query_url = apiurl + this.restobject;
			console.log('query url ' + query_url);
			// lst contiendra les resultat a la resolution de la promise
			var lst = [];

			// get au lieu de query, car hateoas retourne un objet, pas un
			// tableau
			$resource(query_url, {}).get(function(response) {
				console.log('query response : ' + JSON.stringify(response));
				// la reponse hateoas est post processée par
				// SpringDataRestAdapter
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					angular.forEach(processedResponse._embeddedItems, function(element, key) {
						console.log('query : ' + JSON.stringify(element));
						lst.push(element);
					});
				});
			}, function(errors) {
				//showErrors(errors);
				console.log(errors)
			});
			this.query_objects = lst;
			return this.query_objects;
		}

		/**
		 * read : retourne un element, par id
		 */

		/**
		 * create : creation d'un element element est l'element a creer (json),
		 * sans id et sans tags hateoas callbackok est le callback a appeler
		 * quand la promise est resolue. la reponse est l'objet créé
		 */

		function create(element) {
			var url = apiurl + this.restobject;
			console.log('create ' + this.restobject + ":" + JSON.stringify(element));
			var self = this;
			return $resource(url).save(element, function(created){
				console.log('callback create ok : ' + JSON.stringify(created));
				self.query_objects.push(created);
				return created;
			}); //  , callbackok, function(errors) {
				//console.log(errors);
				//showErrors(errors);
			//});
		}

		/**
		 * remove : suppression d'un element element est un element hateoas,
		 * avec id et href callbackok est le callback a appeller quand la
		 * promise est resolue. la reponse est vide, mais ce callback permet de
		 * retirer l'élément d'une liste en cas de succes.
		 * 
		 */
		function remove(element) {
			var self_url = element._links.self.href;
			console.log('remove ' + JSON.stringify(element));
			console.log('remove self_url' + JSON.stringify(self_url));
			self=this;
			return $resource(self_url, {}).remove(function(removed){
				// attention removed a des tags en plus, style $$hashkey. On utilise 'element'
				var index = self.query_objects.indexOf(element);
				
				console.log(' retrait index ' + index) ;
				self.query_objects.splice(index, 1);
				return removed;
			}, function(errors) {
				//showErrors(errors);
				console.log(errors);
			});
		}

		/**
		 * profile : retourne le profile d'un restobject, ou la liste des
		 * restobject si restobject est non defini. C'est en fait un simple
		 * query, avec le nom du restobject precédé de 'profile' dans l'url
		 */
		function profile() {
			var urlprofile = apiurl.replace("/rest", "/rest/profile");

			if (typeof this.restobject != 'undefined') {
				urlprofile = urlprofile + this.restobject;
			}

			console.log('url profile : ' + urlprofile);
			var lst = [];

			// get au lieu de query, car hateoas retourne un objet, pas un
			// tableau
			self=this;  // this n'est plus valable dans la promise $ressource, on le sauve
			$resource(urlprofile, {}).get(function(response) {
				// console.log('profile response : ' +
				// JSON.stringify(response));
				// response._links , sans self
				// la reponse hateoas est post processée par
				// SpringDataRestAdapter
				// lst.push(response._links);

				if (typeof self.restobject != 'undefined') {
					console.log('profile restobject : ' + self.restobject);
					lst.push(response.alps.descriptors);
				} else {
					lst.push(response._links);
				}
			}, function(errors) {
				console.log('error profile ' + errors);
				//showErrors(errors);
			});

			return lst;

		}
		
		return Hateoas;

	})
})();
