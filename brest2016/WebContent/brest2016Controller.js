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
function brest2016Controller($resource, $http, $parse, growl, Brest2016Factory, Hateoas) {
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

//	vm.query = query;
//	vm.create = create;
//	vm.remove = remove;
//	vm.profile = profile;
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
	vm.hateoas_animations = new Hateoas('animations');
	
	
	vm.animations = vm.hateoas_animations.query();


}