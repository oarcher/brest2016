/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller', brest2016Controller);

// brest2016Controller.$inject = [$http, 'StandService'];

/**
 * @param $resource
 * @param $http
 * @param growl
 * @param Stand
 */
function brest2016Controller(Brest2016Factory, Hateoas, brest2016Calendar) {
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

	
	
	/**
	 * Action a faire a l'initialisation du controller FIXME : Que faire si
	 * plusieurs <form> utilise ce controller ?
	 */

	vm.calendar = new brest2016Calendar("brest2016calendar");
	
	vm.testdrag= {title : "test"};
	
	
	//var tmp= uiCalendarConfig
	// on demande au serveur rest hateoas la liste des objets qu'il gere
	// var hateoas_root = new Hateoas('');
	// var restobjects_list = hateoas_root.profile() // FIXME promise ....
	// pour chaque objet, on créé une instance hateoas, visible dans vm
	var restobjects_list = [ "activites", "visiteurs" ];
	vm.hateoas = {};
	restobjects_list.forEach(function(restobject) {
		vm.hateoas[restobject] = new Hateoas(restobject);
		console.log('visible dans le scope : vm.hateoas.' + restobject);

	});
	
//	vm.hateoas.activites.list.forEach(function(activite){vm.calendar.addActivite(activite)});


}