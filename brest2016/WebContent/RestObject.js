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
	angular.module('brest2016App').factory('RestObject', function($resource, SpringDataRestAdapter, Brest2016Factory) {

		console.log('Factory RestObject init');

		var apiurl = '/brest2016/rest/';

		/**
		 * Constructeur
		 */
		function RestObject(restJson, parent) {
			this.json = restJson;
			this.parent = parent;
			this.id = this.getId();
			//console.log('constructeur RestObject ' + parent.restRepo + " id:" + this.id);
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
			addRelation : addRelation,
			addOrRemoveRelation : addOrRemoveRelation,
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
				Brest2016Factory.showMessage(self.parent.restRepo + ' mis a jour!');
				self.json = updated;
				self.parent.update(self);
				typeof callbackok === 'function' && callbackok(self);
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
		function remove(callbackok,callbacknok) {
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
				Brest2016Factory.showMessage(self.parent.restRepo + ' supprimé!');
				typeof callbackok === 'function' && callbackok(removed);
			},function(error){
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
			//console.log('curl ' + hrefRelation);
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
			var self=this;
			this.parent.getRelationName(relationRepo, function(relation) {
				console.log(debug + " : " + relation);
				self._getRelation(relation, function(response) {
					//console.log('getRelations raw : ' + JSON.stringify(response));
					SpringDataRestAdapter.process(response).then(function(processedResponse) {
						//console.log('getRelations : ' + JSON.stringify(processedResponse));
						if (processedResponse._embeddedItems) {
							angular.forEach(processedResponse._embeddedItems, function(element, key) {
								//console.log('query : ' + JSON.stringify(element));
								var id = getIdFromJson(element);
								lst.push(relationRepo.findById(id));
							});
							typeof callback === 'function' && callback(lst);
						} else {
							//console.log('pas _embeddedItems');
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
		 * addRelation
		 * 
		 * @param relation :
		 *            le nom de la relation sur laquelle il faut ajouter
		 *            otherElement
		 * @param otherElement :
		 *            l'element a ajouter en relation le but est de poster l'url
		 *            de l'element detination sur l'url de l'element source
		 *            suffixé par le nom du restObject par exemple, avec curl :
		 *            curl -i -X POST -H 'Content-type: text/uri-list' -d
		 *            'http://localhost:8080/brest2016/rest/activite/2'
		 *            http://localhost:8080/brest2016/rest/visiteurs/1/activite
		 *            permet de lier activite/2 aux activitées du visiteur/1
		 */
		function addRelation(relation, otherElement, callback) {
			// console.log("addRelation");
			// console.log("element :" + JSON.stringify(element));
			// console.log("otherElement :" + JSON.stringify(otherElement));
			// var hrefOtherElement = getSelfHref(otherElement);
			// console.log('hrefOtherElement ' + hrefOtherElement);
			// var otherRestObject = getRestObjectFromHref(hrefOtherElement);
			// console.log('otherRestObject ' + otherRestObject);
			var hrefRelation = this.getRelationHref(relation);
			var restRepo = this.getRestRepo();
			// console.log("hrefRelation : " + hrefRelation);
			var message = "entre " + this.getRestRepo() + " et " + otherElement.getRestRepo();
			console.log('curl -v -X PUT -H "Content-Type: text/uri-list" -d "' + otherElement.getHref + '" ' + hrefRelation);
			$resource(hrefRelation, {}, {
				post : {
					method : "PUT",
					isArray : false,
					headers : {
						'Content-Type' : 'text/uri-list'
					}
				}
			}).post(otherElement.getHref, function(success) {
				Brest2016Factory.showMessage("Relation créée " + message);
				typeof callback === 'function' && callback();
			});
		}

		// /**
		// * addRelations ajoute plusieurs relation d'un coup
		// */
		// function addRelations(otherElements) {
		// otherElements.forEach(function(otherElement) {
		// addRelation(element, otherElement)
		// });
		// }
		/**
		 * removeRelation element : l'element auquel il faut supprimer une
		 * relation otherElement : l'element a supprimer le but est de recupere
		 * l'url href de l'element, et d'y concatener le nom du restObject et
		 * l'id de otherElement, pour ensuite appeller la methode
		 * $resource.remove
		 */
		function removeRelation(relation, otherElement) {
			var element = this.json;
			// console.log("removeRelation");
			// var hrefOtherElement = otherElement.getHref;
			// var otherRestObject = getRestObjectFromHref(hrefOtherElement);
			// var idOtherElement = getIdFromHref(hrefOtherElement);

			var hrefRemove = this.getRelationHref(relation) + "/" + otherElement.getId();
			// console.log('hrefRemove : ' + hrefRemove);
			// var restObject = getRestObject(element);
			var debug = "removeRelation : " + element.getHref + " " + otherElement.getHref + " par " + hrefRemove;
			var message = "entre " + this.getRepo() + " et " + otheElement.getRepo();
			$resource(hrefRemove, {}).remove(function(removed) {
				console.log('OK :' + debug);
				Brest2016Factory.showMessage("Relation defaite " + message);
			}, function(error) {
				Brest2016Factory.showMessage("Erreur a la suppression de la relation " + message + " : " + error);
				console.log('NOK :' + debug);
			});

		}

		function addOrRemoveRelation(relation, otherElement, bool) {
			if (bool) {
				console.log("addOrRemoveRelation : add");
				this.addRelation(relation, otherElement);
			} else {
				console.log("addOrRemoveRelation : remove");
				this.removeRelation(relation, otherElement);
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
		// addOrRemoveRelation(element, otherElement, setter);
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
