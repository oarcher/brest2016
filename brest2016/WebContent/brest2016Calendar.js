/**
 * http://usejsdoc.org/
 */

/**
 * voir http://fullcalendar.io/docs/
 * 
 */
(function() {
	'use strict';
	angular.module('brest2016App').factory('brest2016Calendar', function(uiCalendarConfig) {

		console.log('brest2016Calendar init');

		/**
		 * Constructeur
		 */
		function brest2016Calendar(name) {
			console.log('constructeur brest2016Calendar :' + JSON.stringify(uiCalendarConfig));
			var self = this;
			self.calendar = "unset";
			self.name = name;
			self.events = [];
			self.eventSources = [ self.events ];
			self.config = {
				calendar : {

					defaultView : 'agendaWeek',
					firstDay : 3,
					defaultDate : '2016-07-13',
					// views : {
					// agendaWeek : {
					// start : 2,
					// duration: {weeks: 2},
					// rows: 2
					// }
					// },
					height : 450,
					editable : true,
					droppable : true,
					forceEventDuration : true,
					header : {
						left : 'title',
						center : '',
						right : 'today prev,next'
					},
				// drop : drop,
				// eventReceive : this.eventReceive(),
				// eventReceive : eventReceive1,
				// eventRender : eventRender

				}
			}
			// self.config = $.extend(default_config, config);

			// this.uiConfig = {
			// calendar : {
			// defaultView : 'agendaWeek',
			// height : 450,
			// editable : true,
			// header : {
			// left : 'title',
			// center : '',
			// right : 'today prev,next'
			// }
			//
			// }
			// }
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		brest2016Calendar.prototype = {
			addEvent : addEvent,
			removeEvent : removeEvent,
			findEventById : findEventById,
			getUiCalendarConfig : getUiCalendarConfig,
			// eventReceive : eventReceive,
			fullCalendar : fullCalendar
		}

		/**
		 * addEvent
		 */
		function addEvent(event) {
			console.log('addEvent : ' + JSON.stringify(event.id));
			this.events.push(event);
			// a cause de la strategie 'events' de fullCalendar
			// on prend garde a ne pas ajouter l'élément plusieurs fois
			// if($.grep(this.events, function(ev){ return ev.id === event.id;
			// }).length == 0){
			// this.events.push(event);
			// }
		}

		function removeEvent(event) {
			console.log("removeEvent id " + event.id);
			//console.log("removeEvent length avant : " + this.events.length);
			var index = this.events.map(function(el) {
				return el.id;
			}).indexOf(event.id);
			//console.log('index ' + index);
			this.events.splice(index,1);
			//console.log("removeEvent remove id " + removed.id);
//			for (var i = 0; i < index.length; i++) {
//				this.events.splice(index[i], 1);
//			}
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
				// console.log("trouvé findEventById a l'index " + select[0] + "
				// " + JSON.stringify(event));
			}
			if (select.length > 1) {
				alert("erreur, il y a plusieurs events avec l'id " + id);
				event = select[0];
			}
			return event;
		}

		// recuperation de l'objet fullcalendar
		// il est a undefined tant que le calendrier n'est pas affiché sur la
		// vue, et ui-calendar ne propose pas de callback
		// voir https://github.com/angular-ui/ui-calendar/issues/195
		function getUiCalendarConfig() {

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

		// racourci vers getUiCalendarConfig().fullcalendar
		// (.fullcalendar permet d'executer les fonctions de fullcalendar)
		// si getUiCalendarConfig est undefined, on range
		// les objets dans this.config.calendar, il seront executés ensuite.
		function fullCalendar(key, value) {
			if (this.getUiCalendarConfig()) {
				console.log("fullcalendar activé!");
				this.getUiCalendarConfig().fullCalendar(arguments);
			} else {
				console.log("fullcalendar pas encore fini d'initialiser " + key + " est mis dans l'objet config");
				if (value) {
					this.config.calendar[key] = value;
				} else {
					$.extend(this.config.calendar, key);
				}
			}

		}

		// activé au drop d'un element sur le calendier
		// FIXME desactivé. a priori, ne sert a rien, ca ajoute en double
		function eventReceive() {
			return (function(event) {
				console.log('eventReceive' + JSON.stringify(event));
				// on se charge d'ajouter l'event nous meme
				// donc on supprime celui d'origine apres en avoir fait une
				// copie
				// var newevent = (JSON.parse(JSON.stringify(event)));
				this.fullCalendar('removeEvents', event._id);
				// this.fullCalendar('updateEvent',event);
				// this.addEvent(newevent);

			}).bind(this);

		}

		// function eventReceive1(event){
		// console.log('eventReceive');
		// }

		// function stickEvent(event){
		// console.log('stickEvent' + JSON.stringify(event));
		// event.stick=true ;
		// return event
		// }

		function eventRender(event, element, view) {
			// console.log('eventRender : ' + JSON.stringify(event));
		}

		return brest2016Calendar;

	})
})();
