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

	/**
	 * On préfère l'utilisation de 'this' a $scope, qui peut induire en erreur
	 * dans certains cas.
	 * 
	 * le fait d'avoir vm = this permet d'acceder a vm dans les fonctions qui
	 * rereferencent this. Pour augmenter la lisibilité du controller, on
	 * utilise 'vm' pour ce qui est destiné au vues html (view model) et this
	 * pour ce qui concernent les variables locales.
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

	// gestion de la suppression d'un moyen
	vm.suppression_moyen = suppression_moyen;
	vm.getActivitesCount = getActivitesCount;

	vm.visiteurs = new Hateoas("visiteurs");
	// les activites ne seront pas recupérées
	// par le constructeur, c'est le calendrier qui le fera
	vm.activites = new Hateoas("activites", false);

	// mise en place du calendrier, et des evenements
	// associés, en particulier addActiviteToCalendar pour ajouter
	// des activites
	vm.calendar = new Brest2016Calendar("brest2016calendar");
	vm.calendar.setConfig(calendarActivitesActions(vm.calendar, vm.activites));

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

	function getActivitesCount(moyen) {
		var count = vm.moyens.getRelations(moyen, 'activite').length;
		alert(count);
		return count;
	}

	function suppression_moyen(moyen) {
		vm.moyens.getRelations(moyen, "activite", function(activites) {
			if (activites.length == 0) {
				vm.moyens.remove(moyen);
			} else {
				// Brest2016Factory.showMessage("il faut d'abord supprimer les
				// activités associées", "error");
				// FIXME trop de taf a faire: on est en cascade de l'autre coté,
				if (confirm("supprimer les " + activites.length + "acivités associées ?")) {
					// vm.moyens.remove(moyen);
					activites.forEach(function(activite) {
						console.log('retrait cascade : ' + JSON.stringify(activite));
						var id=vm.activites.getIdFromElement(activite);
						vm.activites.remove(activite);
						// // retrait du calendrier
						vm.calendar.removeEvent(vm.calendar.findEventById(id));
						vm.calendar.fullCalendar('removeEvents',id);

					});
					
					vm.moyens.remove(moyen);
				}
				
				// }
			}
		});
	}
	
	function login(user,password){
		
	}

}
