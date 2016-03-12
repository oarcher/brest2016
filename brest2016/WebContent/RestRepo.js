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
		function RestRepo(restRepo) {
			console.log('constructeur RestRepo pour ' + restRepo);
			this.restRepo = restRepo;
			// list est la liste des objets retournée par query()
			// toute mmodification de cette liste entraine la modification
			// dans le scope de la fonction appelante.
			//if (bool_query === false) {
			//	console.log("bool_query false, appel a query() a faire explicitement ");
			this.list = [];
			//} else {
			//	this.list = this.query();
			//}
			//this.list = this.query(callback);
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
			createReturnEmpty : createReturnEmpty,
			remove : remove,
			update : update,
			findById : findById,
			getIdFromJson : getIdFromJson,
			findByJson : findByJson,
			findIndexById : findIndexById,
			getRelationName : getRelationName,
			getDescriptors : getDescriptors
		}

		/**
		 * query : retourne tous les elements, met a jour this.list
		 */
		function query(callback) {
			var self = this;
			var query_url = apiurl + self.restRepo;
			//console.log('query url ' + query_url);
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
						//console.log("appel constructeur RestObject " + self.restRepo);
						var restObject = new RestObject(element, self);
						//console.log('query : ' + JSON.stringify(restObject.json));
						//console.log('query : ' + restObject.getId());
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
				restObject.id = restObject.getId();
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
		 * getRelationName retourne le nom d'une relation qui pointe vers ce
		 * RestRepo a partir d'un autre RestRepo
		 */

		function getRelationName(otherRestRepo, callbackok, callbacknok) {
			var debug = "getRelationName pour " + this.restRepo + " vers " + otherRestRepo.restRepo;
			var url_otherRepo = apiurl + 'profile/' + otherRestRepo.restRepo;
			var found = false;
			var self = this;
			this.getDescriptors(function(descriptors) {
				descriptors.forEach(function(descriptor) {
					// console.log("Descriptor : " +
					// JSON.stringify(descriptor));
					// pour chaque descriptor, on teste la presence d'un
					// attribut 'rt'
					if (descriptor.rt) {
						// console.log("Descriptor RT : " + descriptor.rt);
						// c'est une url. c'est celle que l'on cherche
						// si elle correspont a l'url de otherRestRepo
						//var url_otherRepo = apiurl + 'profile/' + otherRestRepo.restRepo;
						//console.log("cherche " +url_otherRepo + " dans " +  descriptor.rt );
						if (descriptor.rt.search(url_otherRepo) !== -1) {
							//console.log("oui!");
							// console.log("rt_restRepo: "
							// +JSON.stringify(rt_restRepo));
							found = true;
							//console.log(debug + " : " + descriptor.name);
							typeof callbackok === 'function' && callbackok(descriptor.name);
							return;
						}
					}
				});
				if (!found) {
					// non trouvé. on retourne la liste des descripteurs
					console.log(debug + " : non trouvé");
					typeof callbacknok === 'function' && callbacknok(descriptors);
				}
			});
		}

		/**
		 * getDescriptors : retourne les descriptors d'un RestRepo, c'est dans
		 * le json retourné par un get sur une url de type
		 * http://localhost:8080/brest2016/rest/profile/activites qui permet
		 * d'auto-decrire un restRepo par exmple, pour mpyen, c'est
		 * [{"name":"nom","type":"SEMANTIC"},{"name":"activites","type":"SAFE","rt":"http://localhost:8080/brest2016/rest/profile/activites#activite-representation"}]
		 * 
		 */
		function getDescriptors(callback) {
			var self = this;
			var url = apiurl + 'profile/' + self.restRepo;
			// la representation de l'élément est au singulier
			var element = self.restRepo.match(/(.*)s/)[1];

			//console.log('url profile : ' + url + ' pour ' + element);
			var descriptors = [];

			$resource(url, {}).get(function(response) {
				// console.log("response : " +
				// JSON.stringify(response.alps.descriptors));
				response.alps.descriptors.forEach(function(descriptor) {
					// console.log("Descriptor : " +
					// JSON.stringify(descriptor.id));
					if (descriptor.id === element + "-representation") {
						// console.log("Representation : " +
						// JSON.stringify(descriptor.descriptors));
						descriptor.descriptors.forEach(function(finaldescriptor) {
							// console.log("Representation finale : " +
							// JSON.stringify(finaldescriptor));
							descriptors.push(finaldescriptor);
						});
					}
				});
				//console.log("Representation finale avant callback : " + JSON.stringify(descriptors));
				// on cherche l'id "element-representation"
				typeof callback === 'function' && callback(descriptors);
			}, function(error) {
			});
			return descriptors;
		}

		/**
		 * creation d'un element (pur json). en cas de succes, un json vidé est
		 * retourné (utile pour vider les champs d'un formulaire)
		 * 
		 */
		function createReturnEmpty(element,callbackok,callbacknok) {
			var copy_element = angular.copy(element);
			this.create(element, function(created) {
				// on vide les champs de l'élément reourné.
				for ( var field in copy_element) {
					if (copy_element.hasOwnProperty(field)) {
						copy_element[field] = "";
					}
				}
				typeof callbackok === 'function' && callbackok(created);
			},function(error){
				typeof callbacknok === 'function' && callbacknok(error);
			});
			return copy_element;
		}
		/**
		 * suppression d'un element par son id dans la liste des restObjects
		 */
		function remove(id) {
			var index = this.findIndexById(id);
			console.log("RestRepo remove id " + id + " " + this.restRepo + " a l' index " + index);
			this.list.splice(index, 1);
		}

		/**
		 * mise a jour de l'element dans la liste des restObjects
		 * 
		 */
		function update(element) {
			var original = this.findById(element.id);
			original.json = element.json;
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
		 * retourne l'id d'un json
		 */
		function getIdFromJson(json) {
			return json._links.self.href.match(/.*\/rest\/.*\/(\d+)/)[1];
		}

		/**
		 * retourne un element par son id
		 */
		function findById(id) {
			return this.list[this.findIndexById(id)];
		}

		/**
		 * retourne un element par son json
		 * 
		 */
		function findByJson(json) {
			return this.list[this.findIndexById(this.getIdFromJson(json))];
		}

		return RestRepo;

	})
})();
