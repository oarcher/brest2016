/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller', brest2016Controller);

// brest2016Controller.$inject = [$http, 'StandService'];

/**
 * 
 */
function brest2016Controller(Brest2016Factory, Hateoas, Brest2016Calendar) {
	// on préfère l'utilisation de 'this' a $scope

	/**
	 * On préfère l'utilisation de 'this' a $scope, qui peut induire en erreur
	 * dans certains cas.
	 * 
	 * le fait d'avoir vm = this permet d'acceder a vm dans les fonctions qui
	 * rereferencent this. Pour augmenter la lisibilité du controller, on
	 * utilise 'vm' pour ce qui est destiné au vues html (view model) et this pour
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
	 * Action a faire a l'initialisation du controller
	 */

	vm.moyens = new Hateoas("moyens");
	vm.visiteurs = new Hateoas("visiteurs");
	// les activites ne seront pas recupérées
	// par le constructeur, c'est le calendrier qui le fera
	vm.activites = new Hateoas("activites", false); 

	// mise en place du calendrier, et des evenements
	// associés, en particulier addActiviteToCalendar pour ajouter
	// des activites
	vm.calendar = new Brest2016Calendar("brest2016calendar");
	vm.calendar.setConfig(calendarActivitesActions(vm.calendar,vm.activites));


	// on recupere les activites pour les
	// mettre dans le calendrier
	vm.activites.query(function(activites) {
		console.log('Ajout dans le calendier de ' + activites.length + "activitées")
		activites.forEach(function(activite) {
			// calendar_actions.addActiviteToCalendar(activite);
			vm.calendar.addActiviteToCalendar(activite);
			
		});
		console.log('activites ajoutée');
	});

	/**
	 * implementation des fonctions
	 */

	

}
