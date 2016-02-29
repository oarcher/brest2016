/**
 * http://usejsdoc.org/
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
			self.events = []
			self.eventSources = [ this.events ]
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
					header : {
						left : 'title',
						center : '',
						right : 'today prev,next'
					},
					// drop : drop,
					eventReceive : self.eventReceive(),
					eventRender : eventRender
					
				}
			}
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
			getUiCalendarConfig : getUiCalendarConfig,
			addActivite : addActivite,
			eventReceive : eventReceive
		}

		/**
		 * addEvent
		 */
		function addEvent(event) {
			console.log('addEvent : ' + JSON.stringify(event))
			self.events.push(event)
		}

		function getUiCalendarConfig() {

			if (this.name in uiCalendarConfig.calendars) {
				console.log('uiCalendarConfig.calendars.' + this.name + " existe!");
				return uiCalendarConfig.calendars[this.name];
			} else {
				console.log('uiCalendarConfig.calendars.' + this.name + " n'existe pas");
				Object.keys(uiCalendarConfig.calendars).forEach(function(cal) {
					console.log('exist : ' + cal);

				});
				return undefined;
			}
		}
		function addActivite(activite) {
			var test = self.getUiCalendarConfig();
			test.fullCalendar('changeView', 'month');
			// test.fullCalendar({
			// views : {
			// agendaWeek : {
			// start : '2016-07-13',
			// duration: {weeks: 2},
			// rows: 2
			//							
			// }
			// }
			// });
			// test.fullCalendar('gotoDate', '2016-07-13');
			// test.fullCalendar('changeView','agendaWeek');
			self.addEvent({
				title : activite.nom,
				start : activite.datedebut,
				stop : activite.datefin,
				allDay : false
			});

		}

		// function getEventSources() {
		// return this.eventSources
		// }
		//		
		// function drop( date, jsEvent, ui, resourceId ){
		// console.log('drop!!');
		// console.log('date: ' + JSON.stringify(date));
		// console.log('this data: ' + this.getAttribute("data"));
		// var event=JSON.parse(this.getAttribute("data"));
		// console.log('event : ' + JSON.stringify(event));
		// console.log('this ng-model: ' + this.getAttribute("ng-model"));
		// //self.addEvent(event);
		//			
		// }

		function eventReceive(){
			return (function (event) {
				console.log('eventReceive' + JSON.stringify(event));
				// on se charge d'ajouter l'event nous meme
				// donc on supprime celui d'origine apres en avoir fait une copie
				var newevent = (JSON.parse(JSON.stringify(event)));
				this.getUiCalendarConfig().fullCalendar( 'removeEvents' , event._id );
				
				this.events.push(newevent);
				
			}).bind(this);
		
		}
		
		function eventRender( event, element, view ) { 
			console.log('eventRender : ' + JSON.stringify(event));
		}

//		function eventReceive(event,view) {
//			console.log('eventReceive' + JSON.stringify(event))
//			console.log('view' + JSON.stringify(view))
//			self.events.push(event)
//			
//		}

		return brest2016Calendar;

	})
})();
