/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller', brest2016Controller);

// brest2016Controller.$inject = [$http, 'AnimationService'];

/**
 * @param $resource
 * @param $http
 * @param growl
 * @param Animation
 */
function brest2016Controller($resource, $http, $parse, growl, Brest2016Factory) {
	// on préfère l'utilisation de 'this' a $scope

	/**
	 * On préfère l'utilisation de 'this' a $scope, qui peut induire en erreur
	 * dans certains cas.
	 * 
	 * le fait d'avoir vm = this permet d'acceder a vm dans les fonctions qui
	 * rereferencent this. Pour augmenter la lisibilité du controller, on
	 * utilise 'vm' pour ce qui est destiné au vu html (view model) et this pour
	 * ce qui concernent les variables locales.
	 */
	var vm = this;

	/**
	 * déclaration des variables et methodes.
	 * 
	 * Le faire ici permet d'avoir une vue syntetique du controller, un peu a
	 * la facon d'une interface.
	 */

	vm.query = query;
	vm.create = create;
	vm.remove = remove;
	// vm.read = read;

	// vm.animations = []; // contiendra les animations

	/** l'objet animation (JSON) */
	vm.animation = {
		nom : "",
		descr : ""
	};

	/**
	 * Action a faire a l'initialisation du controller FIXME : Que faire si
	 * plusieurs <form> utilise ce controller ?
	 */
	// vm.animations = vm.query('animations');
	vm.animations = Brest2016Factory.hateoas('animations').query();

	/**
	 * implementation des fonctions
	 */

	/**
	 * query : recupere la liste des elements restobjet est une string contenant
	 * le nom de l'objet rest ('animations', 'utilisateurs', etc ...) la liste
	 * est disponible a l'url /brest2016/rest/profile
	 */
	function query(restobject) {
		return Brest2016Factory.hateoas(restobject).query();
	}

	/**
	 * create : creation d'element restobject et la cible ou doit etre créé
	 * l'élément element est un json, simple, sans id
	 */
	function create(restobject, element) {
		Brest2016Factory.hateoas(restobject).create(element, function(created) {
			// ajout a la liste
			console.log('retour de create' + JSON.stringify(created));
			// restobject a le meme nom que la liste des élément dans vm (par ex vm.animation)
			// $parse(restobject)(vm) permet de récupérer la variable, par son nom
			$parse(restobject)(vm).push(created);  // ajout de l'element créé a la liste
			// par convention, l'element courant de la liste restobject
			// est restobject, sans le 's' a la fin (par ex vm.animation)
			$parse(restobject.replace(/s$/, "")).assign(vm,{}); // vide l'élément courant
		});
	}

	/**
	 * remove : suppression d'un élément element est un object hateoas, il a
	 * donc un id et une url, ce qui dispense de passer restobject en parametre
	 */
	function remove(element) {
		Brest2016Factory.hateoas('').remove(element, function(removed) {
			// on retire l'element de la liste
			// la liste est un variable du scope 'vm' qui a le meme nom que le restobject (par exemple 'animations')
			var restobject = Brest2016Factory.getRestobject(element);
			var elements= $parse(restobject)(vm);
			var index = elements.indexOf(element);			
			elements.splice(index, 1);
		});
	}
}
