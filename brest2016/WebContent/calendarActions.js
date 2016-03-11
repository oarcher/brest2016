/**
 * http://usejsdoc.org/
 * 
 * Methodes destinées a etre injectées dans le calendrier fullCalendar
 * pour en modifier le comportement (ajout d'activite, mode admin, visiteur, ou par defaut)
 */

/**
 * addActivite permet d'ajouter une activité sur le calendrier
 * vm.calendar.addActivite=addActivite; vm.calendar.addActivite(activite);
 * 
 * @param activite :
 *            un restObject de type activité
 */
function calendarActions() {
	'use strict';

	
	return {
		addActivite : addActivite,
		setAdminMode : setAdminMode,
		setDefaultMode : setDefaultMode,
		setVisiteurMode : setVisiteurMode
	}
	
	
	/**
	 * ajout d'une activité sur le calendrier.
	 * activite est un restObject
	 */
	function addActivite(activite) {
		var event = {};
		var id = activite.id;
		// var id = activitesObj.getIdFromElement(activite);
		event.id = id;
		event.title = "pas encore resolu par la promise";
		event.start = activite.json.datedebut;
		event.end = activite.json.datefin;
		event.original = activite;
		var self = this;
		// activitesObj.getRelation(activite, "moyen", function(moyen) {
		activite.getRelation("moyen", function(moyen) {
			// var moyen=lst_moyen[0];
			console.log('addActivite recu :' + JSON.stringify(moyen));
			event.title = moyen.nom + " " + id;
			console.log('addActivite event.id : ' +  event.id);
			self.addEvent(event);
		});
		return event;
	}

	/**
	 * fournit un object destiné a etre injecté dans un calendrier pour fournir
	 * les fonctionnalitées d'admin
	 * 
	 * @param calendar :
	 *            un objet de type brest2016Calendar
	 * @param activitesObj :
	 *            est une instance 'activite' de Hateoas
	 * @returns un objet destiné a etre injecté dans un calendrier par
	 *          brest2016.setConfig
	 */

	function setAdminMode(activitesObj) {

		var calendar = this;
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
		calendar.setConfig(actions);

		/**
		 * appelé par le drop d'un moyen sur le calendrier. moyen est un json
		 * (pas un restObject) en provenance de l'attribut data-event
		 * jqyoui-draggable. fullCalendar y a ajouté les moments start et end
		 * 
		 */
		function moyenToEventActivite(moyen) {
			console.log("moyenToEventActivite moyen : " + JSON.stringify(moyen));
			activitesObj.create({
				lieu : 'lieu par defaut',
				datedebut : moyen.start,
				datefin : moyen.end,
				moyen : moyen._links.self.href
			}, function(activite) {
				console.log("moyenToEventActivite activite : id :" + activite.id + " JSON : " + JSON.stringify(activite.json));
				calendar.addActivite(activite);
			});
		}

		/**
		 * suppression d'un event sur le calendrier c'est un callback eventClick
		 * de fullCalendar http://fullcalendar.io/docs/mouse/eventClick/
		 * 
		 */
		function removeEventActivite(event, jsEvent, view) {
			var old_color = $(this).css('border-color');
			$(this).css('border-color', 'red');
			if (confirm("Delete " + JSON.stringify(event.id) + "?")) {
				var activite = event.original;
				activite.remove(function(removed) {
					calendar.removeEvent(event);
				});
			} else {
				$(this).css('border-color', old_color);
			}
		}

		/**
		 * deplacement ou resize d'un evenement sur le calendrier c'est un
		 * callback fullCalendar de type eventDrop ou enventResize
		 * http://fullcalendar.io/docs/event_ui/eventDrop/
		 */
		function updateEventActivite(event, delta, revertFunc) {
			console.log('deplacement de ' + event.id + ' a ' + event.start.format());
			console.log('event.end : ' + event.end.format());
			console.log('event original' + JSON.stringify(event.original.json));

			event.original.json.datedebut = event.start.format();
			event.original.json.datefin = event.end.format();

			// activitesObj.update(event.original, null, function(error) {
			event.original.update(null, function(error) {
				revertFunc();
			});

		}

	}

	/**
	 * setDefaultMode remet le calendrier dans le mode par defaut, c'est a dire
	 * ni admin, ni visiteur
	 */
	function setDefaultMode() {

		var actions = {
			// mise en place des callbacks fullCalendar
			config : {
				calendar : {
					droppable : false,
					editable : false,
					// callBack fullCalendar
					events : null, // vraiment ??
					eventClick : null,
					eventDrop : null,
					eventReceive : null,
					eventResize : null,
				}
			}
		}
		return actions;
	}

	/**
	 * setVisiteurMode met le calendrier dans le mode ou un visiteur peut
	 * selectionner des activitées
	 */
	function setVisiteurMode() {

		var actions = {
			// mise en place des callbacks fullCalendar
			config : {
				calendar : {
					droppable : false,
					editable : false,
					// callBack fullCalendar
					events : null, // vraiment ??
					eventClick : null,
					eventDrop : null,
					eventReceive : null,
					eventResize : null,
				}
			}
		}
		return actions;
	}
}
