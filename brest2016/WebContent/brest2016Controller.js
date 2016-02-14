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
function brest2016Controller($scope, growl, Brest2016Factory, Hateoas) {
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
	 * Le faire ici permet d'avoir une vue syntetique du controller, un peu a la
	 * facon d'une interface.
	 */

	// vm.query = query;
	// vm.create = create;
	// vm.remove = remove;
	// vm.profile = profile;
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

	// on demande au serveur rest hateoas la liste des objets qu'il gere
	// var hateoas_root = new Hateoas('');
	// var restobjects_list = hateoas_root.profile() // FIXME promise ....


	// pour chaque objet, on créé une instance hateoas, visible dans vm
	var restobjects_list = [ "animations", "horaires", "visiteurs" ];
	vm.hateoas = {};
	restobjects_list.forEach(function(restobject) {
		vm.hateoas[restobject] = new Hateoas(restobject);
		console.log('visible dans le scope : vm.hateoas.' + restobject);

	});

	
	vm.animation=vm.hateoas.animations.element;
	
	
}