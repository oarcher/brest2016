/**
 * http://usejsdoc.org/
 * 
 * RestRepo est un objet contenant la liste des objets d'un repository REST, par
 * exemples les objets 'activites' du repository 'activites'
 * 
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('RestRepo', function($resource, SpringDataRestAdapter, RestObject, Brest2016Factory) {

		console.log('Factory RestRepo init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructeur
		 */
		function RestRepo(restRepo, bool_query) {
			console.log('constructeur RestRepo pour ' + restRepo);
			this.restRepo = restRepo;
			// list est la liste des objets retournée par query()
			// toute mmodification de cette liste entraine la modification
			// dans le scope de la fonction appelante.
			if (bool_query === false) {
				console.log("bool_query false, appel a query() a faire explicitement ");
				this.list = [];
			} else {
				this.list = this.query();
			}
			// scope de l'objet servant aux communications avec la vue html
			// this.scope = {};
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		RestRepo.prototype = {
			query : query,
			create : create,
			remove : remove,
			update : update,
			findById : findById,
			findIndexById : findIndexById
		}

		/**
		 * query : retourne tous les elements, met a jour this.list
		 */
		function query(callback) {
			var self = this;
			var query_url = apiurl + self.restRepo;
			console.log('query url ' + query_url);
			// lst contiendra les resultat a la resolution de la promise
			var lst = [];

			// get au lieu de query, car hateoas retourne un objet, pas un
			// tableau
			$resource(query_url, {}).get(function(response) {
				// console.log('query response : ' + JSON.stringify(response));
				// la reponse hateoas est post processée par
				// SpringDataRestAdapter
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					angular.forEach(processedResponse._embeddedItems, function(element, key) {
						// console.log('query : ' + JSON.stringify(element));
						var restObject = new RestObject(element, self);
						console.log('query : ' + JSON.stringify(restObject.json));
						console.log('query : ' + restObject.getId());
						lst.push(restObject);
					});
					Brest2016Factory.showMessage(lst.length + ' ' + self.restRepo + ' récupéré(s) du serveur');

					typeof callback === 'function' && callback(lst);

				});
			});
			self.list = lst;
			return self.list;
		}

		/**
		 * read : retourne un element, par id
		 */

		/**
		 * element = create(element) creation d'un element dans le restObject.
		 * element est un json simple. retourne un restObject.
		 * 
		 * 
		 * 
		 * 
		 * //une copie de l'element est retournée, et cette copie est vidée en
		 * cas //de succes (pour permettre un reset des champs du formulaire)
		 * //le restObject créé est ajouté a la liste des restObjects du
		 * repository
		 */
		function create(element, callbackok, callbacknok) {
			var restObject = new RestObject({}, this);
			var self = this;
			console.log('create ' + JSON.stringify(element) + ' dans ' + self.restRepo);
			var url = apiurl + self.restRepo;
			console.log("curl -i -X POST -H 'Content-Type:application/json' -d '" + JSON.stringify(element) + "'  " + url);

			// var copy_element = angular.copy(element);
			$resource(url).save(element, function(created) {
				// var restObject=new RestObject(created,this);
				$.extend(true, restObject.json, created);
				restObject.id=restObject.getId();
				console.log('callback create ok. id :' + restObject.getId() + " json : " + JSON.stringify(created));
				self.list.push(restObject);
				// on vide les champs de l'élément reourné.
				// for ( var field in copy_element) {
				// if (copy_element.hasOwnProperty(field)) {
				// copy_element[field] = "";
				// }
				Brest2016Factory.showMessage(self.restRepo + ' créé!');
				typeof callbackok === 'function' && callbackok(restObject);
			}, function(error) {
				console.log('type ' + typeof callbacknok);
				typeof callbacknok === 'function' && callbacknok(error);

			});
			return restObject;
			// return copy_element;

		}

		/**
		 * suppression d'un element par son id dans la liste des restObjects
		 */
		function remove(id) {
			var index = this.findIndexById(id);
			console.log("RestRepo remove id " + id + " a l' index " + index);
			this.list.splice(index, 1);
		}

		/**
		 * mise a jour de l'element dans la liste des restObjects
		 * 
		 */
		function update(element) {
			var original = this.findById(element.id);
			original.json=element.json;
		}

		/**
		 * retourne l'index d'un element par son id
		 */
		function findIndexById(id) {
			return this.list.map(function(el) {
				return el.id;
			}).indexOf(id);

		}
		
		/**
		 * retourne un element par son id
		 */
		function findById(id) {
			return this.list[this.findIndexById(id)];

		}

		return RestRepo;

	})
})();
