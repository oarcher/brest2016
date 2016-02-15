/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('Hateoas', function( $resource, SpringDataRestAdapter, Brest2016Factory) {

		console.log('Factory hateoas init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructor
		 */
		function Hateoas(restobject) {
			console.log('constructeur Hateoas pour ' + restobject);
			this.restobject = restobject;
			// list est la liste des objets retournée par query()
			// toute mmodification de cette liste entraine la modification
			// dans le scope de la fonction appelante.
			if(restobject){
				this.list = this.query();
			} else {
				this.list = null;
			}
			
			// element a creer par create(). Il est sans id, et pas dans le format hateoas
			this.element={};
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		Hateoas.prototype = {
			query : query,
			remove : remove,
			create : create,
			profile : profile
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
				// showErrors(errors);
				console.log(errors)
			});
			this.list = lst;
			return this.list;
		}

		/**
		 * read : retourne un element, par id
		 */

		/**
		 * create : creation de l'element qui se trouve dans this.element
		 */

		function create() {
			var url = apiurl + this.restobject;
			console.log('create ' + this.restobject + ":" + JSON.stringify(this.element));
			var self = this;
			$resource(url).save(this.element, function(created) {
				console.log('callback create ok : ' + JSON.stringify(created));
				self.list.push(created);
				self.element={};
				return created;
			}, function(error) {
				Brest2016Factory.showErrors(error);
				console.log(error);
			}); 
			
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
			self = this;
			return $resource(self_url, {}).remove(function(removed) {
				// attention removed a des tags en plus, style $$hashkey. On
				// utilise 'element'
				var index = self.list.indexOf(element);

				console.log(' retrait index ' + index);
				self.list.splice(index, 1);
				return removed;
			}, function(errors) {
				// showErrors(errors);
				console.log(errors);
			});
		}

		/**
		 * profile : retourne le profile d'un restobject, ou la liste des
		 * restobject si restobject est vide. C'est en fait un simple
		 * get, avec le nom du restobject precédé de 'profile' dans l'url
		 */
		function profile() {
			var urlprofile = apiurl.replace("/rest", "/rest/profile");

			console.log('url profile : ' + urlprofile);
			var lst = [];

			// on sauve this, car il n'est plus valable dans la promise
			self = this; 
			return $resource(urlprofile, {}).get(function(response) {
				// console.log('profile unprocessed response : ' + JSON.stringify(response));
				if (self.restobject) {
					console.log('profile restobject : ' + self.restobject);
					lst.push(response.alps.descriptors);
				} else {
					angular.forEach(response._links, (function(linkName, restobject) {
						// console.log('xxx ' + JSON.stringify(linkName) + ' : ' + restobject);
						if (restobject != "self") {
							lst.push(restobject);
						}
					}));
				};
				return lst;
			}, function(errors) {
				console.log('error profile ' + errors);
				// showErrors(errors);
			});

			return lst;

		}

		return Hateoas;

	})
})();
