/**
 * http://usejsdoc.org/
 */

/**
 * voir http://fullcalendar.io/docs/
 * 
 */
(function() {
	'use strict';
	angular.module('brest2016App').factory('Brest2016Calendar', function(uiCalendarConfig) {

		console.log('brest2016Calendar init');

		/**
		 * Constructeur
		 */
		function Brest2016Calendar(name, config) {
			console.log('constructeur brest2016Calendar :' + JSON.stringify(uiCalendarConfig));
			this.name = name;
			this.events = [];
			this.eventSources = [ this.events ];
			this.config = {
				calendar : {

					defaultView : 'agendaWeek',
					firstDay : 3,
					defaultDate : '2016-07-13',
					height : 450,
					editable : true,
					droppable : true,
					forceEventDuration : true,
					header : {
						left : 'title',
						center : '',
						right : 'today prev,next'
					},
					eventRender : eventRender

				}

			}
			// injections de la config
			$.extend(true, this, config);
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		Brest2016Calendar.prototype = {
			setConfig : setConfig,
			addEvent : addEvent,
			removeEvent : removeEvent,
			findEventById : findEventById,
			getUiCalendarConfig : getUiCalendarConfig,
			// eventReceive : eventReceive,
			fullCalendar : fullCalendar
		}
		
		/**
		 * setConfig permet d'enrichir l'objet Brest2016Calendar avec des actions et des parmetres specifiques.
		 */
		function setConfig(config){
			$.extend(true, this, config);
		}

		/**
		 * addEvent
		 */
		function addEvent(event) {
			console.log('addEvent : ' + JSON.stringify(event.id));
			this.events.push(event);
			// a cause de la strategie 'events' de fullCalendar
			// on prend garde a ne pas ajouter l'élément plusieurs fois
			// if($.grep(this.events, function(ev){ return ev.id ===
			// event.id;
			// }).length == 0){
			// this.events.push(event);
			// }
		}

		function removeEvent(event) {
			console.log("removeEvent id " + event.id);
			// console.log("removeEvent length avant : " +
			// this.events.length);
			var index = this.events.map(function(el) {
				return el.id;
			}).indexOf(event.id);
			// console.log('index ' + index);
			this.events.splice(index, 1);
			// console.log("removeEvent remove id " + removed.id);
			// for (var i = 0; i < index.length; i++) {
			// this.events.splice(index[i], 1);
			// }
			//			
			console.log("removeEvent length apres : " + this.events.length);
		}

		function findEventById(id) {
			// FIXME a nettoyer du if
			// console.log("findEventById " + id);
			var event = false;
			var select = $.grep(this.events, function(ev) {
				return ev.id == id;
			});
			// event = select[0]; return event
			if (select.length == 1) {
				event = select[0];
				// console.log("trouvé findEventById a l'index " + select[0]
				// + "
				// " + JSON.stringify(event));
			}
			if (select.length > 1) {
				alert("erreur, il y a plusieurs events avec l'id " + id);
				event = select[0];
			}
			return event;
		}

		/**
		 * getUiCalendarConfig recuperation de l'objet fullcalendar
		 */
		function getUiCalendarConfig() {
			// il est a undefined tant que le calendrier n'est pas affiché sur
			// la vue, et ui-calendar ne propose pas de callback
			// voir https://github.com/angular-ui/ui-calendar/issues/195

			if (this.name in uiCalendarConfig.calendars) {
				// console.log('uiCalendarConfig.calendars.' + this.name + "
				// existe!");
				return uiCalendarConfig.calendars[this.name];
			} else {
				console.log('uiCalendarConfig.calendars.' + this.name + " n'existe pas encore");
				Object.keys(uiCalendarConfig.calendars).forEach(function(cal) {
					console.log('exist : ' + cal);

				});
				return undefined;
			}
		}

		/**
		 * fullCalendar wrapper vers la fonction fullCalendar qui permet
		 * d'executer les actions fullCalendar voir
		 * http://fullcalendar.io/docs/usage/
		 */
		function fullCalendar(key, value) {
			// FIXME utiliser arguments plutot que key,value
			// si getUiCalendarConfig est undefined, on range
			// les objets dans this.config.calendar, il seront executés ensuite.
			if (this.getUiCalendarConfig()) {
				console.log("fullcalendar activé!");
				this.getUiCalendarConfig().fullCalendar(arguments);
			} else {
				console.log("fullcalendar pas encore fini d'initialiser " + key + " est mis dans l'objet config");
				if (value) {
					this.config.calendar[key] = value;
				} else {
					$.extend(this.config.calendar, key); // key est en fait
															// un objet
				}
			}

		}

		/**
		 * affichage des events sur le calendrier on n'affiche que les events
		 * qui ont un id (les events internes de fullCalendar on simplement un
		 * _id)
		 */
		function eventRender(event, element) {

			if (!event.id) { // Render seulement si valide
				return false;
			}
		}

		return Brest2016Calendar;

	})
})();
