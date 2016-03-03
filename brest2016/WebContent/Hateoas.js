/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('Hateoas', function($resource, SpringDataRestAdapter, Brest2016Factory) {

		console.log('Factory hateoas init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructeur
		 */
		function Hateoas(restObject, bool_query) {
			console.log('constructeur Hateoas pour ' + restObject);
			this.restObject = restObject;
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
			this.scope = {};
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		Hateoas.prototype = {
			query : query,
			create : create,
			// pas implementé : read : read,
			update : update,
			remove : remove,
			getRelation : getRelation,
			getRelations : getRelations,
			addRelation : addRelation,
			addOrRemoveRelation : addOrRemoveRelation,
			getterSetterRelation : getterSetterRelation,
			dumpScope : dumpScope,
			getIdFromElement : getIdFromElement
		}

		/**
		 * query : retourne tous les elements, met a jour this.list
		 */
		function query(callback) {
			var self = this;
			var query_url = apiurl + self.restObject;
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
						lst.push(element);
					});
					Brest2016Factory.showMessage(lst.length + ' ' + self.restObject + ' récupéré(s) du serveur');

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
		 * une copie de l'element est retournée, et cette copie est vidée en cas
		 * de succes (pour permettre un reset des champs du formulaire)
		 * 
		 */
		function create(element, callbackok, callbacknok) {
			var self = this;
			console.log('create ' + JSON.stringify(element) + ' dans ' + self.restObject);
			var url = apiurl + self.restObject;
			console.log("curl -i -X POST -H 'Content-Type:application/json' -d '" + JSON.stringify(element) +  "'  " + url);

			// for ( var field in element) {
			// if (element.hasOwnProperty(field)) {
			// console.log("valid : " + element.$valid);
			// }
			// }

			var copy_element = angular.copy(element);
			$resource(url).save(element, function(created) {
				console.log('callback create ok : ' + JSON.stringify(created));
				self.list.push(created);
				// on vide les champs de l'élément reourné.
				for ( var field in copy_element) {
					if (copy_element.hasOwnProperty(field)) {
						copy_element[field] = "";
					}
				}
				Brest2016Factory.showMessage(self.restObject + ' créé!');
				typeof callbackok === 'function' && callbackok(created);
			}, function(error) {
				console.log('type ' + typeof callbacknok);
				typeof callbacknok === 'function' && callbacknok(error);

			});
			return copy_element;

		}

		/**
		 * update(element) mise a jour de l'element , sans modifier sont id
		 */
		function update(element, callbackok, callbacknok) {
			var self = this;
			console.log('update ' + JSON.stringify(element) + ' dans ' + self.restObject);
			var url = getSelfHref(element);
			// var copy_element = angular.copy(element);
			$resource(url, {}, {
				'update' : {
					method : 'PUT'
				}
			}).update(element, function(updated) {
				Brest2016Factory.showMessage(self.restObject + ' mis a jour!');
				typeof callbackok === 'function' && callbackok(updated);
			}, function(error) {
				alert(error);
				typeof callbacknok === 'function' && callbacknok(error);
			});
		}

		/**
		 * remove : suppression d'un element. element est un element hateoas
		 * complet.
		 * 
		 */
		function remove(element, callback) {
			var self = this;
			var self_url = element._links.self.href;
			console.log('remove ' + JSON.stringify(element));
			console.log('remove self_url' + JSON.stringify(self_url));
			return $resource(self_url, {}).remove(function(removed) { // pourquoi
				// return
				// ??
				// attention removed a des tags en plus, style $$hashkey. On
				// utilise 'element'
				var index = self.list.indexOf(element);

				console.log(' retrait index ' + index);
				self.list.splice(index, 1);
				Brest2016Factory.showMessage(self.restObject + ' supprimé!');
				typeof callback === 'function' && callback(removed);
			});
		}

		/**
		 * getterSetter : retourne un getterSetter generique sur un nom de
		 * variable nom peut comporter des '.' comme nom.subnom . dans ce cas,
		 * nom sera un objet ayant la propriété subnom. le context (self) peut
		 * etre passé de facon optionnel en parametre, dans le cas ou
		 * getterSetter est appelé dans une promise qui a redefini le contexte.
		 */

		function getterSetter_old(nom, context) {
			var self = context || this;
			// console.log('getterSetter dans ' + self.restObject + ' pour ' +
			// nom);
			return function(setter) {
				if (angular.isDefined(setter)) {
					console.log('setter ' + JSON.stringify(setter));
					// [set|get|delete]_property sont dans autovivify.js
					if (Object.keys(setter).length) {
						set_property(self.scope, nom, setter);
					} else {
						delete_property(self.scope, nom);
					}
				} else {
					return get_property(self.scope, nom);
				}
			}
		}

		/**
		 * profile : retourne le profile d'un restObject, ou la liste des
		 * restObject si restObject est vide. C'est en fait un simple get, avec
		 * le nom du restObject precédé de 'profile' dans l'url
		 */
		function profile() {
			var self = this;
			var urlprofile = apiurl.replace("/rest", "/rest/profile");

			console.log('url profile : ' + urlprofile);
			var lst = [];

			return $resource(urlprofile, {}).get(function(response) { // FIXME
				// return
				// a
				// virer
				// ?
				// console.log('profile unprocessed response : ' +
				// JSON.stringify(response));
				if (self.restObject) {
					console.log('profile restObject : ' + self.restObject);
					lst.push(response.alps.descriptors);
				} else {
					angular.forEach(response._links, (function(linkName, restObject) {
						// console.log('xxx ' + JSON.stringify(linkName) + ' : '
						// + restObject);
						if (restObject != "self") {
							lst.push(restObject);
						}
					}));
				}
				;
				return lst; // FIXME a virer ??
			}, function(errors) {
				console.log('error profile ' + errors);
				// showMessages(errors);
			});

			return lst;

		}

		/**
		 * recupere le contenu du lien d'une relation si il y a des
		 * _embeddedItems, il seront retournés tel quel (pas de tableaux)
		 * utiliser getRelations pour gerer les _embeddedItems, et le retour du
		 * tableau. getRelation ne retourne rien, il faut passer par le callback
		 * pour la reponse
		 */
		function getRelation(element, relation, callback) {
			var self = this;
			// console.log('getRelation ' + JSON.stringify(element) + " " +
			// relation);
			var hrefRelation = getRelationHref(element, relation);
			// console.log('getRelation ' + hrefRelation);
			var lst = [];
			console.log('curl ' + hrefRelation);
			$resource(hrefRelation, {}).get(function(response) {
				typeof callback === 'function' && callback(response);
			});
		}

		/**
		 * getRelations retounre la liste des objets en relation avec un element
		 * donné.
		 * 
		 */
		function getRelations(element, relation, callback) {
			var lst = [];
			getRelation(element, relation, function(response) {
				console.log('getRelations raw : ' + JSON.stringify(response));
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					console.log('getRelations : ' + JSON.stringify(processedResponse));
					if (processedResponse._embeddedItems) {
						angular.forEach(processedResponse._embeddedItems, function(element, key) {
							console.log('query : ' + JSON.stringify(element));
							lst.push(element);
						});
					} else {
						console.log('pas _embeddedItems');
						lst.push(processedResponse);
					}

					typeof callback === 'function' && callback(lst);

				});
			});
			return lst; // sera resolu plus tard par la promise

		}

		/**
		 * getDeepRelations recupere recursivement la liste des objets en
		 * relation avec un element donné. FIXME : ne sert plus ??
		 */
		function getDeepRelations(element, relation, callback) {
			var self = this;
			console.log('getRelation ' + JSON.stringify(element) + " " + relation);
			var hrefRelation = getRelationHref(element, relation);
			console.log('getRelation ' + hrefRelation);
			var lst = [];
			$resource(hrefRelation, {}).get(function(response) {
				// FIXME un peu le boxon, ca serait curieux que ca marche a
				// chaque fois
				var links = response._embedded[relation + 's'];
				console.log('links ' + JSON.stringify(links));
				links.forEach(function(rel) {
					console.log('rel : ' + JSON.stringify(rel));

					for ( var key in rel._links) {
						if (rel._links.hasOwnProperty(key)) {
							if ([ 'self', relation ].indexOf(key) == -1) {
								lst.push(rel._links[key].href);
								console.log('key : ' + key + ' ' + JSON.stringify(rel._links[key].href));
							}
						}
					}
				});
				typeof callback === 'function' && callback(lst);
			});
			return lst; // sera rempli plus tard par la promise

		}

		/**
		 * addRelation
		 * 
		 * @param element :
		 *            l'element source
		 * @param otherElement :
		 *            l'element a ajouter en relation le but est de poster l'url
		 *            de l'element detination sur l'url de l'element source
		 *            suffixé par le nom du restObject par exemple, avec curl :
		 *            curl -i -X POST -H 'Content-type: text/uri-list' -d
		 *            'http://localhost:8080/brest2016/rest/activite/2'
		 *            http://localhost:8080/brest2016/rest/visiteurs/1/activite
		 *            permet de lier activite/2 aux activitées du visiteur/1
		 */
		function addRelation(element, otherElement, callback) {
			// console.log("addRelation");
			// console.log("element :" + JSON.stringify(element));
			// console.log("otherElement :" + JSON.stringify(otherElement));
			var hrefOtherElement = getSelfHref(otherElement);
			// console.log('hrefOtherElement ' + hrefOtherElement);
			var otherRestObject = getRestObjectFromHref(hrefOtherElement);
			// console.log('otherRestObject ' + otherRestObject);
			var hrefRelation = getRelationHref(element, otherRestObject);
			var restObject = getRestObject(element);
			// console.log("hrefRelation : " + hrefRelation);
			var message = "entre " + restObject + " et " + otherRestObject;
			console.log('curl -v -X PUT -H "Content-Type: text/uri-list" -d "' + hrefOtherElement + '" ' + hrefRelation);
			$resource(hrefRelation, {}, {
				post : {
					method : "PUT",
					isArray : false,
					headers : {
						'Content-Type' : 'text/uri-list'
					}
				}
			}).post(hrefOtherElement, function(success) {
				Brest2016Factory.showMessage("Relation créée " + message);
				typeof callback === 'function' && callback();
			}, function(error) {
				Brest2016Factory.showMessage("Erreur à la création de la relation " + message + " : " + JSON.stringify(error), "error");
			});
		}

		function addRelations(element, otherElements) {
			otherElements.forEach(function(otherElement) {
				addRelation(element, otherElement)
			});
		}
		/**
		 * removeRelation element : l'element auquel il faut supprimer une
		 * relation otherElement : l'element a supprimer le but est de recupere
		 * l'url href de l'element, et d'y concatener le nom du restObject et
		 * l'id de otherElement, pour ensuite appeller la methode
		 * $resource.remove
		 */
		function removeRelation(element, otherElement) {
			// console.log("removeRelation");
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestObject = getRestObjectFromHref(hrefOtherElement);
			var idOtherElement = getIdFromHref(hrefOtherElement);
			var hrefRemove = getRelationHref(element, otherRestObject) + "/" + idOtherElement;
			// console.log('hrefRemove : ' + hrefRemove);
			var restObject = getRestObject(element);
			var debug = "removeRelation : " + getSelfHref(element) + " " + hrefOtherElement + " par " + hrefRemove;
			var message = "entre " + restObject + " et " + otherRestObject;
			$resource(hrefRemove, {}).remove(function(removed) {
				console.log('OK :' + debug);
				Brest2016Factory.showMessage("Relation defaite " + message);
			}, function(error) {
				Brest2016Factory.showMessage("Erreur a la suppression de la relation " + message + " : " + error);
				console.log('NOK :' + debug);
			});

		}

		function addOrRemoveRelation(element, otherElement, bool) {
			if (bool) {
				console.log("addOrRemoveRelation : add");
				addRelation(element, otherElement);
			} else {
				console.log("addOrRemoveRelation : remove");
				removeRelation(element, otherElement);
			}
		}

		/**
		 * getterSetterRelation retourne un getterSetter pour ajouter ou retirer
		 * une relation entre element et otherElement. Utilisabe par ng-model si
		 * ng-model-options={getterSetter: true}
		 */
		function getterSetterRelation(element, otherElement) {
			var self = this;
			// console.log('getterSetterRelation dans ' +
			// self.restObject + ' entre ' + JSON.stringify(element)
			// + ' et ' + JSON.stringify(otherElement));
			var hrefElement = getSelfHref(element);
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestObject = getRestObjectFromHref(hrefOtherElement);
			var idOtherElement = getIdFromHref(hrefOtherElement);

			var hrefExist = getRelationHref(element, otherRestObject) + "/" + idOtherElement;

			var getterSetter = function() {
			};

			self.scope.element = self.scope.element || {};
			self.scope.element[hrefElement] = self.scope.element[hrefElement] || {};
			self.scope.element[hrefElement].relation = self.scope.element[hrefElement].relation || {};

			if (angular.isUndefined(self.scope.element[hrefElement].relation[hrefOtherElement])) {
				// premier appel
				console.log("getterSetterRelation premier appel pour " + hrefElement + " " + hrefOtherElement);

				// tant que ce ne sera pas true or false
				// le getterSetter sera rappelé (jusqu'a la resolution de la
				// promise)
				// self.scope.element[hrefElement].relation[hrefOtherElement]
				// = "";
				if (typeof self.scope.element[hrefElement].relation[hrefOtherElement] === "undefined") {
					console.log('toute premiere fois')
					self.scope.element[hrefElement].relation[hrefOtherElement] = 0
				} else {
					self.scope.element[hrefElement].relation[hrefOtherElement]++
					console.log('deja ' + self.scope.element[hrefElement].relation[hrefOtherElement] + ' fois')
				}

				var debug = " entre " + hrefElement + ' et ' + hrefOtherElement + ' par ' + hrefExist
				// est-ce que hrefExist est un lien valide ?
				// oui => la relation existe
				// 404 => la relation n'existe pas
				$resource(hrefExist, {}).get(function(ok) {
					console.log('Relation existe ' + debug);
					self.scope.element[hrefElement].relation[hrefOtherElement] = true;
				}, function(nok) {
					console.log("Relation n'existe pas " + debug);
					self.scope.element[hrefElement].relation[hrefOtherElement] = false;
				});

			} else {
				// pas le premier appel, la relation existe deja dans le cache
				getterSetter = function(setter) {
					if (angular.isDefined(setter)) {
						// on est un setter
						// console.log("setter");
						self.scope.element[hrefElement].relation[hrefOtherElement] = setter;
						addOrRemoveRelation(element, otherElement, setter);
					} else {
						// on est un getter
						// console.log("getter " + hrefElement + " " +
						// hrefOtherElement + ":" +
						// self.scope.element[hrefElement].relation[hrefOtherElement]);
						return self.scope.element[hrefElement].relation[hrefOtherElement];

					}
				};

			}

			return getterSetter;

		}

		function dumpScope() {
			var self = this;
			console.log('dumpScope ' + self.restObject + ' : ' + JSON.stringify(self.scope));
		}

		/**
		 * fonction privées
		 */

		/**
		 * getRestObjectFromUrl retourne le rest object principal d'une url.
		 * C'est le mot au singulier juste apres /rest/
		 */
		function getRestObjectFromHref(href) {
			return href.match(/.*\/rest\/(.*)s\/.*/)[1];
		}

		/**
		 * getIdFromUrl retourne l'id de l'objet designé par l'url. C'est le
		 * nombre entier a la fin de l'url
		 */

		function getIdFromHref(href) {
			return href.match(/.*\/rest\/.*\/(\d+)/)[1];
		}

		/**
		 * getSelfHref retourne l'url self d'un element
		 */
		function getSelfHref(element) {
			return getRelationHref(element, 'self');
		}

		/**
		 * getIdFromElement retourne l'id d'un element
		 */
		function getIdFromElement(element) {
			return getIdFromHref(getSelfHref(element));
		}

		/**
		 * getRestObject retourne le restObject d'un élément
		 */
		function getRestObject(element) {
			return getRestObjectFromHref(getSelfHref(element));
		}

		/**
		 * getRelationHref retourne l'url de relation d'un element. C'est la
		 * propriété 'relation'.href de la propriete _links
		 * 
		 */
		function getRelationHref(element, relation) {
			// fixme relation est au pluriel si il y en a plusieurs ..
			console.log('getRelationHref ' + relation + " " + JSON.stringify(element));
			// if(!element._links.hasOwnProperty(relation)){
			// relation=relation+"s";
			// }
			return element._links[relation].href;
		}

		return Hateoas;

	})
})();
