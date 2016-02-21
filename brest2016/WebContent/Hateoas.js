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
		function Hateoas(restobject) {
			console.log('constructeur Hateoas pour ' + restobject);
			this.restobject = restobject;
			// list est la liste des objets retournée par query()
			// toute mmodification de cette liste entraine la modification
			// dans le scope de la fonction appelante.
			
			this.list = this.query();
			// scope de l'objet servant aux communications avec la vue html
			this.scope = {};
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		Hateoas.prototype = {
			query : query,
			remove : remove,
			create : create,
			getterSetter : getterSetter,
			profile : profile,
			getRelations : getRelations,
			addRelation : addRelation,
			addOrRemoveRelation : addOrRemoveRelation,
			getterSetterRelation : getterSetterRelation,
			dumpScope : dumpScope,
		}
		
		
		
		/**
		 * query : retourne tous les elements, met a jour this.list
		 */
		function query() {
			var self=this;
			var query_url = apiurl + self.restobject;
			console.log('query url ' + query_url);
			// lst contiendra les resultat a la resolution de la promise
			var lst = [];

			// get au lieu de query, car hateoas retourne un objet, pas un
			// tableau
			$resource(query_url, {}).get(function(response) {
				//console.log('query response : ' + JSON.stringify(response));
				// la reponse hateoas est post processée par
				// SpringDataRestAdapter
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					angular.forEach(processedResponse._embeddedItems, function(element, key) {
						//console.log('query : ' + JSON.stringify(element));
						lst.push(element);
					});
				});
			}, function(errors) {
				// showErrors(errors);
				console.log(errors)
			});
			self.list = lst;
			return self.list;
		}

		/**
		 * read : retourne un element, par id
		 */

		/**
		 * create : creation de l'element qui se trouve dans this.scope.acreer
		 */

		function create(nom) {
			var self=this;
			console.log('create ' + nom + ' dans ' + self.restobject);
			var element=self.scope[nom];
			console.log('create getter: ' + JSON.stringify(element));
			var url = apiurl + self.restobject;
			//console.log('create ' + self.restobject + ":" + JSON.stringify(self.scope.acreer));
			$resource(url).save(element, function(created) {
				console.log('callback create ok : ' + JSON.stringify(created));
				self.list.push(created);
				getterSetter(nom,self)({});  // on passe self au getterSetter, car la promise redefini this
				return created;
			}, function(error) {
				Brest2016Factory.showErrors(error);
				console.log(error);
			});

		}

		/**
		 * getterSetter : retourne un getterSetter generique sur un nom de variable
		 * nom peut comporter des '.' comme nom.subnom  . dans ce cas, nom sera un objet ayant la propriété subnom
		 * le context (self) peut etre passé de facon optionnel en parametre, dans le cas ou
		 * getterSetter est appelé dans une promise qui a redefini le contexte.
		 */
		
		function getterSetter(nom, context ){
			var self= context || this;
			console.log('getterSetter dans ' + self.restobject + ' pour ' + nom);
			return function(setter){
				if (angular.isDefined(setter)) {
					console.log('setter ' + JSON.stringify(setter));
					if(Object.keys(setter).length){
						set_property(self.scope,nom,setter);
					} else {
						delete_property(self.scope,nom);
					}
				} else {
					return get_property(self.scope,nom);
				}
			}
		}
		
		/**
		 * remove : suppression d'un element. element est un element hateoas
		 * complet.
		 * 
		 */
		function remove(element) {
			var self=this;
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
				return removed;
			}, function(errors) {
				// showErrors(errors);
				console.log(errors);
			});
		}

		/**
		 * profile : retourne le profile d'un restobject, ou la liste des
		 * restobject si restobject est vide. C'est en fait un simple get, avec
		 * le nom du restobject precédé de 'profile' dans l'url
		 */
		function profile() {
			var self=this;
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
				if (self.restobject) {
					console.log('profile restobject : ' + self.restobject);
					lst.push(response.alps.descriptors);
				} else {
					angular.forEach(response._links, (function(linkName, restobject) {
						// console.log('xxx ' + JSON.stringify(linkName) + ' : '
						// + restobject);
						if (restobject != "self") {
							lst.push(restobject);
						}
					}));
				}
				;
				return lst; // FIXME a virer ??
			}, function(errors) {
				console.log('error profile ' + errors);
				// showErrors(errors);
			});

			return lst;

		}

		/**
		 * getRelations recupere la liste des objets en relation avec un element
		 * donné. C'est juste un get sur l'href de l'élément, auquel on a
		 * concaténé le nom de la relation
		 * 
		 */
		function getRelations(element, relation) {
			var self=this;
			console.log('getRelation ' + JSON.stringify(element) + " " + relation);
			var hrefRelation = getRelationHref(element, relation);
			console.log('getRelation ' + hrefRelation);
			var lst = [];
			$resource(hrefRelation, {}).get(function(response) {
				SpringDataRestAdapter.process(response).then(function(processedResponse) {
					console.log(JSON.stringify(processedResponse));
					angular.forEach(processedResponse._embeddedItems, function(element, key) {
						console.log('query : ' + JSON.stringify(element));
						lst.push(element);
					});
				});
			});
			return lst;

		}

		function addRelation(element, otherElement) {
			console.log("addRelation");
			console.log("element :" + JSON.stringify(element));
			console.log("otherElement :" + JSON.stringify(otherElement));
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestobject = getRestobjectFromHref(hrefOtherElement);
			var hrefRelation = getRelationHref(element, otherRestobject);
			console.log("hrefRelation : " + hrefRelation);
			$resource(hrefRelation, {}, {
				post : {
					method : "POST",
					isArray : false,
					headers : {
						'Content-Type' : 'text/uri-list'
					}
				}
			}).post(hrefOtherElement);
		}

		/**
		 * removeRelation element : l'element auquel il faut supprimer une
		 * relation otherElement : l'element a supprimer le but est de recupere
		 * l'url href de l'element, et d'y concatener le nom du restobject et
		 * l'id de otherElement, pour ensuite appeller la methode
		 * $resource.remove
		 */
		function removeRelation(element, otherElement) {
			console.log("removeRelation");
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestobject = getRestobjectFromHref(hrefOtherElement);
			var idOtherElement = getIdFromHref(hrefOtherElement);
			var hrefRemove = getRelationHref(element, otherRestobject) + "/" + idOtherElement;
			console.log('hrefRemove : ' + hrefRemove);
			$resource(hrefRemove, {}).remove(function(removed) {
				console.log('suppression OK');
			}, function(error) {
				console.log('suppression NOK');
			});

		}

		function addRelations(element, otherElements) {
			otherElements.forEach(function(otherElement) {
				addRelation(element, otherElement)
			});
		}

		function addOrRemoveRelation(element, otherElement, bool) {
			console.log("addOrRemoveRelation bool : " + JSON.stringify(bool));

			if (bool) {
				console.log("addOrRemoveRelation : add");
				addRelation(element, otherElement);
			} else {
				console.log("addOrRemoveRelation : remove");
				removeRelation(element, otherElement);
			}
		}

		/**
		 * getterSetterRelation retourne un getterSetter pour ajouter ou retirer une relation
		 * entre element et otherElement
		 * utilisabe par ng-model si ng-model-options={getterSetter: true}
		 */
		function getterSetterRelation(element, otherElement) {
			var self=this;
			//console.log('getterSetterRelation dans ' + self.restobject);
			var hrefElement = getSelfHref(element);
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestobject = getRestobjectFromHref(hrefOtherElement);
			var idOtherElement = getIdFromHref(hrefOtherElement);
			var hrefExist = getRelationHref(element, otherRestobject) + "/" + idOtherElement;

			var getterSetter = function() {
			};

			self.scope.element = self.scope.element || {};
			self.scope.element[hrefElement] = self.scope.element[hrefElement] || {};
			self.scope.element[hrefElement].relation = self.scope.element[hrefElement].relation || {};		
			
			
			if (angular.isUndefined(self.scope.element[hrefElement].relation[hrefOtherElement])) {		
				// premier appel
				console.log("getterSetterRelation premier appel pour " + hrefElement + " " +  hrefOtherElement);

				self.scope.element[hrefElement].relation[hrefOtherElement] = "";  // tant que ce ne sera par true or false, le getterSetter sera rappelé
				// est-ce que hrefExist est un lien valide ?
				// oui => la relation existe
				// 404 => la relation n'existe pas
				$resource(hrefExist, {}).get(function(ok) {
					console.log('la relation existe');
					self.scope.element[hrefElement].relation[hrefOtherElement] = true;
				}, function(nok) {
					console.log('pas de relation');
					self.scope.element[hrefElement].relation[hrefOtherElement] = false;
				});

			} else {
				// pas le premier appel

				getterSetter = function(setter) {
					if (angular.isDefined(setter)) {
						// on est un setter
						//console.log("setter");
						self.scope.element[hrefElement].relation[hrefOtherElement] = setter;
						addOrRemoveRelation(element, otherElement, setter);
					} else {
						// on est un getter
						//console.log("getter " + hrefElement + " " + hrefOtherElement + ":" + self.scope.element[hrefElement].relation[hrefOtherElement]);
						return self.scope.element[hrefElement].relation[hrefOtherElement];

					}
				};

			}

			return getterSetter;

		}

		function existRelationOld(element, otherElement) {
			// la valeur de retour est un tableau et non un simple booleen
			// en effet, l'affectation '=' en javascript change la reference
			// ce qui fait que tout changemment de 'exist' dans la promise n'est
			// pas visible en dehors
			// de la promise. En ajoutant un element 'true' ou 'false' dans le
			// tableau 'exist'
			// on ne dereference pas 'exist'
			var exist = [];
			var hrefOtherElement = getSelfHref(otherElement);
			var otherRestobject = getRestobjectFromHref(hrefOtherElement);
			var idOtherElement = getIdFromHref(hrefOtherElement);
			var hrefExist = getRelationHref(element, otherRestobject) + "/" + idOtherElement;
			// est-ce que hrefExist est valide ? oui => la relation existe et
			// 404 => la relation n'existe pas
			$resource(hrefExist, {}).get(function(ok) {
				console.log('la relation existe');
				exist.push(true);
			}, function(nok) {
				console.log('pas de relation');
				exist.push(false);
			});
			return exist;
		}

		function testArray() {
			return "test";
		}

		function dumpScope() {
			var self=this;
			console.log('dumpScope ' + self.restobject + ' : ' + JSON.stringify(self.scope));
		}

		/**
		 * fonction privées
		 */

		/**
		 * getRestobjectFromUrl retourne le rest object principal d'une url.
		 * C'est le mot au singulier juste apres /rest/
		 */
		function getRestobjectFromHref(href) {
			return href.match(/.*\/rest\/(.*)s\/.*/)[1]; // au singulier ??
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
		 * getRelationHref retourne l'url de relation d'un element. C'est la
		 * propriété 'relation'.href de la propriete _links
		 * 
		 */
		function getRelationHref(element, relation) {
			return element._links[relation].href;
		}
		

		/**
		 * createvar
		 * creation de variable d'apres son nom comportant des '.' dans le scope de l'objet
		 */
		
		
		function createvar(self, nom) {
			console.log('createvar dans ' + self.restobject);
			var current="";
			var names=nom.split('.');
			var first=names.shift();
			self.scope[first] = self.scope[first] || {};   
			names.forEach(function(subnom){
				current=current+"."+subnom;
				self.scope[current] = self.scope[current] || {};
			})
			console.log('createvar :' + JSON.stringify(self.scope[first]));
			return current;
		}
		
		/**
		 * http://stackoverflow.com/questions/17643965/automatically-create-object-if-undefined
		 * var o = {}
		 * add_property(o, 'foo.bar.baz', 12)
		 * o.foo.bar.baz
		 * = 12
		 */
		function set_property(object, key, value) {
		    //var orig_object = object;
		    var keys = key.split('.');
		    for (var i = 0; i < keys.length - 1; i++) {
		        var k = keys[i];
		        if (!object.hasOwnProperty(k)) {
		        	console.log('create property ' + k);
		            object[k] = {};
		            //object = object[k];
		        }
		        object = object[k];
		    }
		    console.log('keys.slice(-1)= ' + keys.slice(-1));
		    object[keys.slice(-1)] = value;
		    //return orig_object;
		}
		
		function get_property(object, key) {
			//var orig_object = object;
			//console.log('get_property ' + key + ' for ' + JSON.stringify(object));
		    var keys = key.split('.');
		    for (var i = 0; i < keys.length; i++) {
		    	var k = keys[i];
		    	if (object.hasOwnProperty(k)) {
		    		console.log('get key ' + k);
		    		object = object[k];
		    	} else {
		    		return undefined;
		    	}
		    }
		    return object;
		}
		
		function delete_property(object, key) {
			//var orig_object = object;
			console.log('delete_property ' + key + ' for ' + JSON.stringify(object));
		    var keys = key.split('.');
		    for (var i = 0; i < keys.length - 1 ; i++) {
		    	var k = keys[i];
		    	if (object.hasOwnProperty(k)) {
		    		console.log('get key ' + k);
		    		object = object[k];
		    	} 
		    }
		    
		    delete object[keys.slice(-1)];
		}
		
		
		
		return Hateoas;

	})
})();
