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
function brest2016Controller(Brest2016Factory, Hateoas, Brest2016Calendar) {
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
	 * Action a faire a l'initialisation du controller
	 */

	// on demande au serveur rest hateoas la liste des objets qu'il gere
	// var hateoas_root = new Hateoas('');
	// var restobjects_list = hateoas_root.profile() // FIXME promise ....
	// pour chaque objet, on créé une instance hateoas, visible dans vm
	vm.hateoas = {};
	vm.hateoas.moyens = new Hateoas("moyens");
	vm.hateoas.visiteurs = new Hateoas("visiteurs");
	// les activites ne seront pas recupérées
	// par le constructeur, c'est le calendrier qui le fera
	vm.hateoas.activites = new Hateoas("activites", false);

	// mise en place du calendrier, et des evenements
	// associés, en particulier addActiviteToCalendar pour ajouter
	// des activites

	vm.calendar = new Brest2016Calendar("brest2016calendar");
	vm.calendar.setConfig(calendarActiviteActions(vm.calendar,vm.hateoas.activites));


	// on recupere les activites pour les
	// mettre dans le calendrier
	vm.hateoas.activites.query(function(activites) {
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

	function calendarActiviteActions(calendar,activitesObj) {

		/**
		 * Ajout d'une activite sur le calendrier
		 */

		var addActiviteToCalendar = function(activite) {
			var event = {};
			var id = activitesObj.getIdFromElement(activite);
			event.id = id;
			event.title = "pas encore resolu par la promise";
			event.start = activite.datedebut;
			event.end = activite.datefin;
			event.original = activite;
			activitesObj.getRelation(activite, "moyen", function(moyen) {
				// console.log('recu :' + JSON.stringify(moyen));
				event.title = moyen.nom + " " + id;
				calendar.addEvent(event);
			});
			return event;
		};

		/**
		 * appelé par le drop d'un moyen sur le calendrier moyen est un
		 * restObject auquel fullCalendar a ajouté les fields start et end (date
		 * de debut et fin) voir
		 * http://fullcalendar.io/docs/dropping/eventReceive/
		 */
		var moyenToEventActivite = function(moyen) {
			// var event={};
			// moyen.title = "pas d'id , ne doit pas s'afficher";
			activitesObj.create({
				lieu : 'lieu par defaut',
				datedebut : moyen.start,
				datefin : moyen.end,
			}, function(activite) {
				activitesObj.addRelation(activite, moyen, function() {
					addActiviteToCalendar(activite);
				});
			});
		};

		/**
		 * suppression d'un event sur le calendrier c'est un callback eventClick
		 * de fullCalendar http://fullcalendar.io/docs/mouse/eventClick/
		 * 
		 */
		var removeEventActivite = function(event, jsEvent, view) {
			var old_color = $(this).css('border-color');
			$(this).css('border-color', 'red');
			if (confirm("Delete " + JSON.stringify(event.id) + "?")) {
				var activite = event.original;
				activitesObj.remove(activite, function(removed) {
					calendar.removeEvent(event);
				});
			} else {
				$(this).css('border-color', old_color);
			}
		};

		/**
		 * deplacement d'un evenement sur le calendrier c'est un callback
		 * fullCalendar de type eventDrop
		 * http://fullcalendar.io/docs/event_ui/eventDrop/
		 */
		var moveEventActivite = function(event, delta, revertFunc) {
			console.log('deplacement de ' + event.id + ' a ' + event.start.format());
			console.log('event.end : ' + event.end.format());
			console.log('event original' + JSON.stringify(event.original));
			// alert(event.title + " was dropped on " + event.start.format());

			if (!confirm("Are you sure about this change?")) {
				revertFunc();
			} else {
				event.original.datedebut = event.start.format();
				event.original.datefin = event.end.format();
				activitesObj.update(event.original);
			}

		};

		return {
			// fonctions supplémentaires
			addActiviteToCalendar : addActiviteToCalendar,
			config : {
				calendar : {
					// callBack fullCalendar
					eventClick : removeEventActivite,
					eventDrop : moveEventActivite,
					eventReceive : moyenToEventActivite,
				}
			}

		};
	}

}
