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
	 * Action a faire a l'initialisation du controller
	 */

	// on demande au serveur rest hateoas la liste des objets qu'il gere
	// var hateoas_root = new Hateoas('');
	// var restobjects_list = hateoas_root.profile() // FIXME promise ....
	// pour chaque objet, on créé une instance hateoas, visible dans vm
	vm.hateoas = {};
	vm.hateoas.moyens = new Hateoas("moyens");
	vm.hateoas.visiteurs = new Hateoas("visiteurs");
	vm.hateoas.activites = new Hateoas("activites");
	
	vm.calendar = new brest2016Calendar("brest2016calendar");

	//FIXME affichage initialisation
//	vm.hateoas.activites.query(function(activites) {
//		activites.forEach(function(activite) {
//			var event = activite2event(activite);
//			vm.calendar.addEvent(event);
//		});
//		console.log('activites recupérées');
//		vm.calendar.fullCalendar('rerenderEvents');
//		vm.calendar.fullCalendar("refetchEvents");
//	});


	function activite2event(activite) {
		var event = {};
		var id = vm.hateoas.activites.getIdFromElement(activite);
		event.id = id;
		event.title = "pas encore resolu par la promise";
		event.start = activite.datedebut;
		event.end = activite.datefin;
		event.original = activite;
		vm.hateoas.activites.getRelation(activite, "moyen", function(moyen) {
			// console.log('recu :' + JSON.stringify(moyen));
			event.title = moyen.nom + " " + id;
		});
		return event;
	}

	function events(start, end, timezone, callback) {
		// voir http://fullcalendar.io/docs/event_data/events_function/
		console.log('map activite vers event')
		var events = [];
		vm.hateoas.activites.list.forEach(function(activite) {

			var id = vm.hateoas.activites.getIdFromElement(activite);
			var event = vm.calendar.findEventById(id);
			console.log("event d'id " + id + " : " + JSON.stringify(event));
			if (!event) {
				// l'activité, n'est pas encore dans le calendrier

				event = activite2event(activite);
				vm.calendar.addEvent(event);
				events.push(event);
				console.log('activite id ' + id + ' mise dans le calendrier');

			} else {
				console.log('activite id ' + id + ' deja dans le calendrier');
				// l'activité existe deja, mais fullcalendar la veux pour
				// son callback
				events.push(event);
			}
		});
		callback(events); // appel du callback fullcalendar

	}

	vm.calendar.fullCalendar({
		events : events,
		eventClick : function(event, jsEvent, view) {

			// alert('Event: ' + JSON.stringify(event));
			// alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			// alert('View: ' + view.name);

			// change the border color just for fun
			$(this).css('border-color', 'red');
			if (confirm("Delete " + JSON.stringify(event.id) + "?")) {
				var activite = event.original;
				vm.hateoas.activites.remove(activite, function(removed) {
					vm.calendar.removeEvent(event);
				});
			}

		},

		eventDrop : function(event, delta, revertFunc) {
			// ca bug au niveau de l'affichage ...

			alert(event.title + " was dropped on " + event.start.format());

			if (!confirm("Are you sure about this change?")) {
				revertFunc();
			}
			// else {
			// this.remove; // on retire le DOM créé temporairement par le
			// // drop
			// }
		},

		eventReceive : function(moyen) {
			console.log('eventReceive moyen:' + JSON.stringify(moyen));
			// var copy_moyen = JSON.parse(JSON.stringify(moyen));
			// var copy_moyen = moyen;
			moyen.title = "pas d'id , ne doit pas s'afficher";
			vm.hateoas.activites.create({
				lieu : 'lieu par defaut',
				datedebut : moyen.start,
				datefin : moyen.end,
			}, function(activite) {
				console.log('eventReceive activite cree:' + JSON.stringify(activite));
				var activite_event = {};
				var id = vm.hateoas.activites.getIdFromElement(activite);
				activite_event.title = moyen.nom + " " + id + " (new)";
				activite_event.start = moyen.start;
				activite_event.stop = moyen.stop;
				activite_event.id = id;
				activite_event.original = activite;
				vm.hateoas.activites.addRelation(activite, moyen);
				vm.calendar.addEvent(activite_event);
			});

		},
		// eventDestroy : function(event, element, view) {
		// console.log('eventDestroy' + JSON.stringify(event));
		// },
		eventRender : function(event, element) {

			if (!event.id) { // Render seulement si valide
				return false;
			}
		}
	});

}
