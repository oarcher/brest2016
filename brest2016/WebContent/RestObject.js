/**
 * http://usejsdoc.org/
 * 
 * Classe de gestion d'un objet REST un restObject est un JSON retourné par le
 * serveur REST (par exemple le JSON retourné par curl
 * http://localhost:8080/brest2016/est/activites/354) auquel on ajoute les
 * methodes de gestion de l'objet.
 * 
 * 
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('RestObject', function($resource, SpringDataRestAdapter, Utils) {

		console.log('Factory RestObject init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructeur
		 */
		function RestObject(restJson, parent) {
			this.json = restJson;
			this.parent = parent;
			this.id = this.getId();
			// console.log('constructeur RestObject ' + parent.restRepo + " id:"
			// + this.id);
			// this=restJson;
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		RestObject.prototype = {
			getId : getId,
			getHref : getHref,
			getRelationHref : getRelationHref,
			update : update,
			remove : remove,
			getRelations : getRelations,
			setRelation : setRelation,
			unSetRelation : unSetRelation,
			setOrUnSetRelation : setOrUnSetRelation,
			_getRelation : _getRelation,

		// getterSetterRelation : getterSetterRelation,
		// dumpScope : dumpScope,
		// getIdFromElement : getIdFromElement
		}

		/**
		 * update(element) mise a jour de l'element , sans modifier sont id
		 */
		function update(callbackok, callbacknok) {
			var self = this;
			console.log('update id ' + this.id + " " + JSON.stringify(this.json) + ' dans ' + self.parent.restRepo);
			var url = this.getHref();
			// var copy_element = angular.copy(element);
			$resource(url, {}, {
				'update' : {
					method : 'PUT'
				}
			}).update(self.json, function(updated) {
				Utils.showMessage(self.parent.restRepo + ' mis a jour!');
				self.json = updated;
				self.parent.update(self);
				typeof callbackok === 'function' && callbackok(self);
			}, function(error) {
				typeof callbacknok === 'function' && callbacknok(error);
			});
		}

		/**
		 * remove : suppression d'un element. element est un element hateoas
		 * complet.
		 * 
		 */
		function remove(callbackok, callbacknok) {
			var self = this;
			var self_url = this.getHref();
			console.log('remove ' + JSON.stringify(this.json));
			console.log('remove self_url' + JSON.stringify(self_url));
			console.log('on supprimera dans parent ' + self.parent.restRepo);
			var id = this.id;
			console.log('id: ' + id);
			$resource(self_url, {}).remove(function(removed) {
				console.log('suppression dans parent ' + self.parent.restRepo);
				self.parent.remove(id);
				Utils.showMessage(self.parent.restRepo + ' supprimé!');
				typeof callbackok === 'function' && callbackok(removed);
			}, function(error) {
				typeof callbacknok === 'function' && callbacknok(error);
			});
		}

		/**
		 * recupere le contenu du lien (json) d'une relation passée en string.
		 * si il y a des _embeddedItems, il seront retournés tel quel (pas de
		 * tableaux) utiliser getRelations pour gerer les _embeddedItems, et le
		 * retour du tableau. getRelation ne retourne rien, il faut passer par
		 * le callback pour la reponse
		 */
		function _getRelation(relation, callback) {
			var self = this;
			// console.log('getRelation ' + JSON.stringify(element) + " " +
			// relation);
			var hrefRelation = this.getRelationHref(relation);
			// console.log('getRelation ' + hrefRelation);
			var lst = [];
			// console.log('curl ' + hrefRelation);
			$resource(hrefRelation, {}).get(function(response) {
				typeof callback === 'function' && callback(response);
			});
		}

		/**
		 * getRelations retourne la liste des objets en relation avec un element
		 * donné (OneToMany). C'est un tableau, pour pouvoir etre mis a jour de
		 * façon différé par la promise. marche aussi avec ManyToOne, c'est un
		 * moyen pour avoir la relation en mode différé par la promise sans
		 * utiliser le callback. relationRepo est l'objet RestRepo dans lequel
		 * se trouve la relation
		 * 
		 */
		function getRelations(relationRepo, callback) {
			var debug = 'getRelations pour ' + this.parent.restRepo + " vers  " + relationRepo.restRepo;
			var lst = [];
			var self = this;
			this.parent.getRelationName(relationRepo, function(relation) {
				console.log(debug + " : " + relation);
				self._getRelation(relation, function(response) {
					// console.log('getRelations raw : ' +
					// JSON.stringify(response));
					SpringDataRestAdapter.process(response).then(function(processedResponse) {
						// console.log('getRelations : ' +
						// JSON.stringify(processedResponse));
						if (processedResponse._embeddedItems) {
							// la reponse est un tableau
							angular.forEach(processedResponse._embeddedItems, function(element, key) {
								// console.log('query : ' +
								// JSON.stringify(element));
								var id = getIdFromJson(element);
								lst.push(relationRepo.findById(id));
							});
							typeof callback === 'function' && callback(lst);
						} else {
							// console.log('pas _embeddedItems');
							var id = getIdFromJson(processedResponse);
							lst.push(relationRepo.findById(id));
							typeof callback === 'function' && callback(lst[0]);
						}

					});
				});
			});
			return lst; // sera resolu plus tard par la promise

		}

		/**
		 * setRelation
		 * 
		 * @param otherElement :
		 *            l'element a ajouter en relation le but est de poster l'url
		 *            de l'element detination sur l'url de l'element source
		 *            suffixé par le nom du restObject par exemple, avec curl :
		 *            curl -i -X POST -H 'Content-type: text/uri-list' -d
		 *            'http://localhost:8080/brest2016/rest/activite/2'
		 *            http://localhost:8080/brest2016/rest/visiteurs/1/activite
		 *            permet de lier activite/2 aux activitées du visiteur/1
		 */
		function setRelation(otherElement, callback) {
			var self = this;
			this.parent.getRelationName(otherElement.parent, function(relation) {
				var hrefRelation = self.getRelationHref(relation);
				// console.log("hrefRelation : " + hrefRelation);
				var message = "entre " + self.parent.restRepo + " et " + otherElement.parent.restRepo;
				console.log('curl -v -X PATCH -H "Content-Type: text/uri-list" -d "' + otherElement.getHref() + '" ' + hrefRelation);
				$resource(hrefRelation, {}, {
					post : {
						method : "PATCH",
						isArray : false,
						headers : {
							'Content-Type' : 'text/uri-list'
						}
					}
				}).post(otherElement.getHref(), function(success) {
					Utils.showMessage("Relation créée " + message);
					typeof callback === 'function' && callback();
				});
			});
		}

		// /**
		// * setRelations ajoute plusieurs relation d'un coup
		// */
		// function setRelations(otherElements) {
		// otherElements.forEach(function(otherElement) {
		// setRelation(element, otherElement)
		// });
		// }
		/**
		 * unSetRelation element : l'element auquel il faut supprimer une
		 * relation otherElement : l'element a supprimer le but est de recupere
		 * l'url href de l'element, et d'y concatener le nom du restObject et
		 * l'id de otherElement, pour ensuite appeller la methode
		 * $resource.remove
		 */
		function unSetRelation(otherElement, callback) {
			var self=this;
			this.parent.getRelationName(otherElement.parent, function(relation) {
				// console.log("unSetRelation");
				// var hrefOtherElement = otherElement.getHref;
				// var otherRestObject =
				// getRestObjectFromHref(hrefOtherElement);
				// var idOtherElement = getIdFromHref(hrefOtherElement);

				var hrefRemove = self.getRelationHref(relation) + "/" + otherElement.getId();
				// console.log('hrefRemove : ' + hrefRemove);
				// var restObject = getRestObject(element);
				var debug = "unSetRelation : " + self.getHref + " " + otherElement.getHref + " par " + hrefRemove;
				var message = "entre " + self.parent.restRepo + " et " + otherElement.parent.restRepo;
				$resource(hrefRemove, {}).remove(function(removed) {
					console.log('OK :' + debug);
					Utils.showMessage("Relation defaite " + message);
					typeof callback === 'function' && callback();
				}, function(error) {
					Utils.showMessage("Erreur a la suppression de la relation " + message + " : " + error);
					console.log('NOK :' + debug);
				});
			});
		}

		function setOrUnSetRelation(relation, otherElement, bool) {
			if (bool) {
				console.log("setOrUnSetRelation : add");
				this.setRelation(relation, otherElement);
			} else {
				console.log("setOrUnSetRelation : remove");
				this.unSetRelation(relation, otherElement);
			}
		}

		// /**
		// * getterSetterRelation retourne un getterSetter pour ajouter ou
		// retirer
		// * une relation entre element et otherElement. Utilisabe par ng-model
		// si
		// * ng-model-options={getterSetter: true}
		// */
		// function getterSetterRelation(element, otherElement) {
		// var self = this;
		// // console.log('getterSetterRelation dans ' +
		// // self.restObject + ' entre ' + JSON.stringify(element)
		// // + ' et ' + JSON.stringify(otherElement));
		// var hrefElement = getSelfHref(element);
		// var hrefOtherElement = getSelfHref(otherElement);
		// var otherRestObject = getRestObjectFromHref(hrefOtherElement);
		// var idOtherElement = getIdFromHref(hrefOtherElement);
		//
		// var hrefExist = getRelationHref(element, otherRestObject) + "/" +
		// idOtherElement;
		//
		// var getterSetter = function() {
		// };
		//
		// self.scope.element = self.scope.element || {};
		// self.scope.element[hrefElement] = self.scope.element[hrefElement] ||
		// {};
		// self.scope.element[hrefElement].relation =
		// self.scope.element[hrefElement].relation || {};
		//
		// if
		// (angular.isUndefined(self.scope.element[hrefElement].relation[hrefOtherElement]))
		// {
		// // premier appel
		// console.log("getterSetterRelation premier appel pour " + hrefElement
		// + " " + hrefOtherElement);
		//
		// // tant que ce ne sera pas true or false
		// // le getterSetter sera rappelé (jusqu'a la resolution de la
		// // promise)
		// // self.scope.element[hrefElement].relation[hrefOtherElement]
		// // = "";
		// if (typeof self.scope.element[hrefElement].relation[hrefOtherElement]
		// === "undefined") {
		// console.log('toute premiere fois')
		// self.scope.element[hrefElement].relation[hrefOtherElement] = 0
		// } else {
		// self.scope.element[hrefElement].relation[hrefOtherElement]++
		// console.log('deja ' +
		// self.scope.element[hrefElement].relation[hrefOtherElement] + ' fois')
		// }
		//
		// var debug = " entre " + hrefElement + ' et ' + hrefOtherElement + '
		// par ' + hrefExist
		// // est-ce que hrefExist est un lien valide ?
		// // oui => la relation existe
		// // 404 => la relation n'existe pas
		// $resource(hrefExist, {}).get(function(ok) {
		// console.log('Relation existe ' + debug);
		// self.scope.element[hrefElement].relation[hrefOtherElement] = true;
		// }, function(nok) {
		// console.log("Relation n'existe pas " + debug);
		// self.scope.element[hrefElement].relation[hrefOtherElement] = false;
		// });
		//
		// } else {
		// // pas le premier appel, la relation existe deja dans le cache
		// getterSetter = function(setter) {
		// if (angular.isDefined(setter)) {
		// // on est un setter
		// // console.log("setter");
		// self.scope.element[hrefElement].relation[hrefOtherElement] = setter;
		// setOrUnSetRelation(element, otherElement, setter);
		// } else {
		// // on est un getter
		// // console.log("getter " + hrefElement + " " +
		// // hrefOtherElement + ":" +
		// // self.scope.element[hrefElement].relation[hrefOtherElement]);
		// return self.scope.element[hrefElement].relation[hrefOtherElement];
		//
		// }
		// };
		//
		// }
		//
		// return getterSetter;
		//
		// }

		/**
		 * getHref retourne l'url self d'un element
		 */
		function getHref() {
			return this.getRelationHref('self');
		}

		/**
		 * getId retourne l'id d'un element
		 */
		function getId() {
			if (jQuery.isEmptyObject(this.json)) {
				return null;
			} else {
				return getIdFromHref(this.getHref());
			}
		}

		/**
		 * retourne l'id d'un json (sans this)
		 */
		function getIdFromJson(json) {
			return getIdFromHref(json._links.self.href);
		}

		/**
		 * getRestObject retourne le restObject d'un élément
		 */
		function getRestObject() {
			return getRestObjectFromHref(this.getHref());
		}

		/**
		 * getRelationHref retourne l'url de relation d'un element. C'est la
		 * propriété 'relation'.href de la propriete _links
		 * 
		 */
		function getRelationHref(relation) {
			// console.log('getRelationHref ' + relation + " " +
			// JSON.stringify(this.json));
			// if(!element._links.hasOwnProperty(relation)){
			// relation=relation+"s";
			// }
			return this.json._links[relation].href;
		}

		/**
		 * getRepo retourne l'url du repository C'est href sans l'id
		 * 
		 */
		function getRepo() {
			return this.getHref().match(/(.*\/rest\/.*)\/\d+/)[1];
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

		return RestObject;

	})
})();
