/**
 * http://usejsdoc.org/
 */

/**
 * voir http://fullcalendar.io/docs/
 * 
 * 
 */
(function() {
	'use strict';
	angular.module('brest2016App').factory('Brest2016Calendar', function() {

		console.log('brest2016Calendar init');

		/**
		 * Constructeur
		 */
		function Brest2016Calendar(name,uiCalendarConfig) {
			console.log('constructeur brest2016Calendar');
			var self=uiCalendarConfig.calendars[name];
			self.name = name;
			self.events = [];
			//this.eventSources = [ this.events ],
			self.actions={};
			self.calendar = {
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
				events : refreshEvents(self),
				//events : _refreshEvents,
				eventRender : eventRender,
			}
			// this.fullCalendar( 'removeEventSource', this.events );

			// this.config._calendar=$.extend(true,{},this.config.calendar); //
			// copie

			// injections dans uiCalendarConfig
			//$.extend(true, uiCalendarConfig.calendars[name] , this);
			//$.extend(true, this, uiCalendarConfig.calendars[name])
			//var self = uiCalendarConfig.calendars[name];
			self.fullCalendar('addEventSource', self.events );
			//delete uiCalendarConfig.calendars[name];
		}

		/**
		 * methodes publiques (prototype)
		 * 
		 */

		Brest2016Calendar.prototype = {
			addEvent : addEvent,
			removeEvent : removeEvent,
			findEventById : findEventById,
			findIndexById : findIndexById,
			//getUiCalendarConfig : getUiCalendarConfig,
			//fullCalendar : fullCalendar,
			setConfig : setConfig
		}

		/**
		 * setConfig permet d'enrichir l'objet Brest2016Calendar avec des
		 * actions et des parmetres specifiques. config est un objet ou une
		 * fonction qui retourne un objet. la variable 'calendar' est accessible
		 * dans la fonction
		 */
		function setConfig(config) {
			// var calendar = this;
			// var objconfig={};
			// if(typeof config === 'function'){objconfig=config()} else {
			// objconfig = config};
			$.extend(true, self.calendar, config);
			// attention $extend ne copie pas les null ou undefined. On efface
			// les clées manuellement.
			for ( var key in config) {
				console.log("setConfig calendar key: " + key);
				if (config.hasOwnProperty(key)) {
					if (config[key] === undefined || config[key] === null) {
						if (slef.calendar[key] !== undefined || self.calendar[key] !== null) {
							console.log("delete. etait: " + typeof self.calendar[key]);
							delete self.calendar[key];
							console.log("delete. maintenant: " + typeof self.calendar[key]);
						} else {
							console.log("deja null");
						}
					}
				}
			}
			// console.log("setConfig editable:" +
			// this.config.calendar.editable);
		}

		/**
		 * addEvent
		 */
		function addEvent(event) {
			console.log('addEvent : ' + JSON.stringify(event.id));
			// in verifie que l'event n'existe pas deja
			var index = this.findIndexById(event);
			if (index >= 0) {
				console.log('remplacé');
				this.events[index] = event;
			} else {
				console.log('ajouté');
				this.events.push(event);
			}
			// FIXME Temporaire
			if (event.original.json.datedebut !== event.start) {
				alert(event.original.json.datedebut + " !==" + event.start);
				console.log(JSON.stringify(event.original.json), null, 2);
			}
		}

		function removeEvent(event) {
			console.log("removeEvent id " + event.id);
			// console.log("removeEvent length avant : " +
			// this.events.length);
			var index = this.findIndexById(event.id);
			console.log('remove index ' + index);
			console.log('remove json ' + JSON.stringify(self.events[index].original.json));
			self.events.splice(index, 1);
			// console.log("removeEvent length apres : " + this.events.length);
			// this.fullCalendar('removeEvents', event.id);
		}

		/**
		 * retourne l'element de this.events correspondant a l'id
		 */
		function findEventById(id) {
			var event = undefined;
			var index = this.findIndexById(id);
			if (index >= 0) {
				event = self.events[index];
			}
			return event;
		}

		/**
		 * retourne l'index de l'event dans this.events, par id
		 */
		function findIndexById(id) {
			return self.events.map(function(el) {
				return el.id;
			}).indexOf(id);
		}

		/**
		 * getUiCalendarConfig recuperation de l'objet fullcalendar
		 */
		function _getUiCalendarConfig() {
			// il est a undefined tant que le calendrier n'est pas affiché sur
			// la vue, et ui-calendar ne propose pas de callback
			// voir https://github.com/angular-ui/ui-calendar/issues/195
			console.log('check getUiCalendarConfig');
			if (self.name in uiCalendarConfig.calendars) {
				console.log('uiCalendarConfig.calendars.' + self.name + "existe!");
				return uiCalendarConfig.calendars[self.name];
			} else {
				console.log('uiCalendarConfig.calendars.' + self.name + " n'existe pas encore");
				Object.keys(uiCalendarConfig.calendars).forEach(function(cal) {
					console.log('exist : ' + cal);

				});
				return undefined;
			}
		}

		/**
		 * fullCalendar wrapper vers la fonction fullCalendar qui permet
		 * d'executer les actions fullCalendar voir
		 * http://fullcalendar.io/docs/usage/ On contourne le bug
		 * degetUiCalendarConfig par un appel récursif
		 */
		function fullCalendar(args) {
			console(error.error);
			if (self.getUiCalendarConfig()) {
				console.log("fullcalendar activé!");
				self.getUiCalendarConfig().fullCalendar(arguments);
			} else {
				//var self = this;
				// console.log("fullcalendar pas encore fini d'initialiser ");
				$timeout(fullCalendar.bind(self), 2000, true, arguments);
			}

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

		/**
		 * refreshEvents cette fonction est appelée a chaque rafraichissement du
		 * calendrier, et est chargée de renvoyer la liste des events a afficher
		 * voir http://fullcalendar.io/docs/event_data/events_function/
		 */
		function refreshEvents(self) {
			// on a besoin de self=this a l'interireur de events
			// sans faire de bind, car event a son popre this,
			// d'ou ce wrapper
			function _refreshEvents(start, end, timezone, callback) {
				console.log('refresh event start');
				var events_ok = [];
				self.events.forEach(function(event) {
					if (event.id) {
						console.log('refresh event : ' + event.id);
						events_ok.push(event);
					}
				});
				callback(events_ok); // appel du callback fullcalendar
			}
			return _refreshEvents;
		}

		return Brest2016Calendar;

	})
})();
