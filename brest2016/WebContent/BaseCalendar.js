/**
 * http://usejsdoc.org/
 */

/**
 * voir http://fullcalendar.io/docs/
 * 
 * mise en place de la configuation de base du calendrier, commune a tout les
 * modes
 * 
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('BaseCalendar', BaseCalendarFactory);

	function BaseCalendarFactory(uiCalendarConfig) {

		console.log('BaseCalendar init');

		BaseCalendar.prototype = {
			addEvent : addOrUpdateEvent,
			updateEvent : addOrUpdateEvent,
			removeEvent : removeEvent,
			findEventById : findEventById,
			findIndexById : findIndexById,
			getEvents : getEvents
		}

		return BaseCalendar;

		/**
		 * Constructeur
		 */
		function BaseCalendar(name, events) {
			this.ObjCalendar = uiCalendarConfig.calendars[name];
			this.events = events;
			this.config = {
				lang : 'fr',
				allDaySlot : false,
				defaultView : 'agendaWeek',
				firstDay : 3,
				defaultDate : '2016-07-13',
				height : 450,
				forceEventDuration : true,
				header : {
					left : 'title',
					center : '',
					right : ''
				},
				events : refreshEvents,
			}
			
			var self = this;
			
			/**
			 * refreshEvents cette fonction est appelée a chaque rafraichissement du
			 * calendrier, et est chargée de renvoyer la liste des events a afficher
			 * voir http://fullcalendar.io/docs/event_data/events_function/
			 */
			function refreshEvents(start, end, timezone, callback) {
				console.log("this.foo " + this.foo);
				var events = self.events;
				console.log("callback refreshEvents");
				events.forEach(function(event) {
					console.log(event.id);
				})
				callback(events);
			}
			

			
			
			
			
		}

		/**
		 * retourne le tableau des events
		 */
		
		function getEvents() {
			return this.events;
		}

		/**
		 * ajout ou mise a jour d'un event
		 * event est un JSON au format fullCalendar
		 */
		function addOrUpdateEvent(event) {
			console.log('addEvent : ' + event.id);
			// in verifie que l'event n'existe pas deja
			var index = this.findIndexById(event.id);
			if (index >= 0) {
				console.log('remplacé');
				this.events[index] = event;
			} else {
				console.log('ajouté');
				this.events.push(event);
			}
			// this.fullCalendar( 'updateEvent', event );
			this.ObjCalendar.fullCalendar('refetchEvents');
			// this.fullCalendar( 'rerenderEvents');
			// FIXME Temporaire
			// var datedebut =
			// moment.parseZone(event.original.json.datedebut);
			// var datefin = moment.parseZone(event.original.json.datefin);
			// //console.log("start: " + typeof event.start + " " +
			// event.start);
			// if (typeof event.start == "string"){
			// var start = moment(event.start);
			// } else {
			// var start = event.start
			// }
			// if (typeof event.end == "string"){
			// var end= moment(event.end);
			// } else {
			// var end=event.end
			// }
			// if (datedebut.format() !== start.format()) {
			// alert("start: " + datedebut.format() + " !==" +
			// start.format());
			// console.log(JSON.stringifyOnce(event, null, 2));
			// }
			// if (datefin.format() !== end.format()) {
			// alert("end: " + datefin.format() + " !==" + end.format());
			// //console.log(JSON.stringifyOnce(event, null, 2));
			// }
		}

		function addEvent1(event) {
			this.events.push(event);
		}

		function removeEvent(event) {
			console.log("removeEvent id " + event.id);
			// console.log("removeEvent length avant : " +
			// this.events.length);
			var index = this.findIndexById(event.id);
			console.log('remove index ' + index);
			console.log('remove json ' + JSON.stringify(this.events[index].original.json));
			this.events.splice(index, 1);
			// console.log("removeEvent length apres : " +
			// this.events.length);
			// this.fullCalendar('removeEvents', event.id);
		}

		/**
		 * retourne l'element de this.events correspondant a l'id
		 */
		function findEventById(id) {
			var event = undefined;
			var index = this.findIndexById(id);
			if (index >= 0) {
				event = this.events[index];
			}
			return event;
		}

		/**
		 * retourne l'index de l'event dans this.events, par id
		 */
		function findIndexById(id) {
			return this.events.map(function(el) {
				return el.id;
			}).indexOf(id);
		}

		/**
		 * affichage des events sur le calendrier on n'affiche que les events
		 * qui ont un id (les events internes de fullCalendar on simplement un
		 * _id)
		 */
		function eventRender(event, element) {
			console.log('eventRender start');
			if (!event.id) { // Render seulement si valide
				console.log('pas de render pour ' + JSON.stringify(event, null, 2));
				return false;
			} else {
				// console.log('render ' + event.id);
			}
		}

		// function refreshEvents_FIXME_old(start, end, timezone, callback)
		// {
		// console.log('refresh event start');
		// var events_ok = [];
		// this.events.forEach(function(event) {
		// if (event.id) {
		// console.log('refresh event : ' + event.id);
		// events_ok.push(event);
		// }
		// });
		// callback(events_ok); // appel du callback fullcalendar
		// }

	}

})();