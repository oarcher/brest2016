/**
 * http://usejsdoc.org/
 */

'use strict';

/**
 * @param calendar :
 *            un objet de type brest2016Calendar
 * @param activitesObj :
 *            un objet de type Hateoas
 * @returns un objet destiné a etre injecté dans un calendrier par
 *          brest2016.setConfig
 */
function calendarActivitesActions(calendar, activitesObj) {

	var actions = {
		// fonctions supplémentaires
		addActiviteToCalendar : addActiviteToCalendar,

		// mise en place des callbacks fullCalendar
		config : {
			calendar : {
				// callBack fullCalendar
				eventClick : removeEventActivite,
				eventDrop : updateEventActivite,
				eventReceive : moyenToEventActivite,
				eventResize : updateEventActivite,
			}
		}
	}

	/**
	 * Ajout d'une activite sur le calendrier
	 */

	function addActiviteToCalendar(activite) {
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
	}
	;

	/**
	 * appelé par le drop d'un moyen sur le calendrier moyen est un restObject
	 * auquel fullCalendar a ajouté les fields start et end (date de debut et
	 * fin) voir http://fullcalendar.io/docs/dropping/eventReceive/
	 */
	function moyenToEventActivite(moyen) {
		activitesObj.create({
			lieu : 'lieu par defaut',
			datedebut : moyen.start,
			datefin : moyen.end,
		}, function(activite) {
			activitesObj.addRelation(activite, moyen, function(ok) {
				addActiviteToCalendar(activite);
			});
		},function(error){
			alert(error);
		});
	}
	;

	/**
	 * suppression d'un event sur le calendrier c'est un callback eventClick de
	 * fullCalendar http://fullcalendar.io/docs/mouse/eventClick/
	 * 
	 */
	function removeEventActivite(event, jsEvent, view) {
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
	}
	;

	/**
	 * deplacement ou resize d'un evenement sur le calendrier c'est un callback
	 * fullCalendar de type eventDrop ou enventResize
	 * http://fullcalendar.io/docs/event_ui/eventDrop/
	 */
	function updateEventActivite(event, delta, revertFunc) {
		console.log('deplacement de ' + event.id + ' a ' + event.start.format());
		console.log('event.end : ' + event.end.format());
		console.log('event original' + JSON.stringify(event.original));
		// alert(event.title + " was dropped on " + event.start.format());

		event.original.datedebut = event.start.format();
		event.original.datefin = event.end.format();
		activitesObj.update(event.original, null, function(error) {
			alert("Erreur au resize/move de l'evenement : " + error);
			revertFunc();
		});

	}
	

	return actions;
}
