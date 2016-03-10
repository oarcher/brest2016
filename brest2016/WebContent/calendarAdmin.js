/**
 * http://usejsdoc.org/
 */

'use strict';

/**
 * fournit un object destiné a etre injecté dans un calendrier
 * pour fournir  les fonctionnalitées d'admin
 *  
 * @param calendar :
 *            un objet de type brest2016Calendar
 * @param activitesObj :
 *            est une instance 'activite' de  Hateoas
 * @returns un objet destiné a etre injecté dans un calendrier par
 *          brest2016.setConfig
 */
function calendarAdmin(calendar, activitesObj) {

	var actions = {
		// mise en place des callbacks fullCalendar
		config : {
			calendar : {
				droppable : true,
				editable : true,
				// callBack fullCalendar
				events : null, 
				eventClick : removeEventActivite,
				eventDrop : updateEventActivite,
				eventReceive : moyenToEventActivite,
				eventResize : updateEventActivite,
			}
		}
	}

	
	/**
	 * appelé par le drop d'un moyen sur le calendrier moyen est un restObject
	 * 'moyen' auquel fullCalendar a ajouté les fields start et end (date de
	 * debut et fin) voir http://fullcalendar.io/docs/dropping/eventReceive/
	 */
	function moyenToEventActivite(moyen) {
		activitesObj.create({
			lieu : 'lieu par defaut',
			datedebut : moyen.start,
			datefin : moyen.end,
			moyen : moyen._links.self.href
		}, function(activite) {
			calendar.addActiviteToCalendar(activite);
		});
	}
	

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
	

	/**
	 * deplacement ou resize d'un evenement sur le calendrier c'est un callback
	 * fullCalendar de type eventDrop ou enventResize
	 * http://fullcalendar.io/docs/event_ui/eventDrop/
	 */
	function updateEventActivite(event, delta, revertFunc) {
		console.log('deplacement de ' + event.id + ' a ' + event.start.format());
		console.log('event.end : ' + event.end.format());
		console.log('event original' + JSON.stringify(event.original));

		event.original.datedebut = event.start.format();
		event.original.datefin = event.end.format();
		activitesObj.update(event.original, null, function(error) {
			revertFunc();
		});

	}

	return actions;
}
