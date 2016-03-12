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
function calendarActions(restRepoMoyens, restRepoActivites, restRepoVisiteurs) {
	'use strict';

	return {
		addActivite : addActivite,
		setAdminMode : setAdminMode,
		setDefaultMode : setDefaultMode,
		setVisiteurMode : setVisiteurMode,
	}

	/**
	 * ajout d'une activité sur le calendrier. activite est un restObject
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
		activite.getRelations(restRepoMoyens, function(moyen) {
			// var moyen=lst_moyen[0];
			// console.log('addActivite recu :' + JSON.stringify(moyen.json));
			event.title = moyen.json.nom + " " + id;
			event.backgroundColor = moyen.color;
			event.textColor = 'black';
			console.log('addActivite event.id : ' + event.id + 'color : ' + event.backgroundColor);
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

	function setAdminMode() {

		console.log('calendrier mode admin');
		var self = this;
		this.config.droppable = true
		this.config.editable = true
		// callBack fullCalendar
		// events : null,
		this.config.eventClick = removeEventActivite
		this.config.eventDrop = updateEventActivite
		this.config.eventReceive = moyenToEventActivite
		this.config.eventResize = updateEventActivite
		// this.setConfig(calendar);
		// $.extend(true,self.config,config);
		// self.fullCalendar(calendar);
		// return calendar;

		// this.fullCalendar(calendar);
		return true;

		/**
		 * appelé par le drop d'un moyen sur le calendrier. moyen est un pur
		 * json, auquel fullCalendar a ajouté les moments start et end
		 * 
		 */
		function moyenToEventActivite(json_moyen) {
			console.log("moyenToEventActivite moyen : " + JSON.stringify(json_moyen));
			// on recupere l'objet moyen
			var moyen = restRepoMoyens.findByJson(json_moyen);
			restRepoActivites.create({
				lieu : 'lieu par defaut',
				datedebut : json_moyen.start,
				datefin : json_moyen.end,
				moyen : moyen.getHref()
			// json_moyen._links.self.href
			}, function(activite) {
				// activite créee
				console.log("moyenToEventActivite activite : id :" + activite.id + " JSON : " + JSON.stringify(activite.json));
				self.addActivite(activite);
				// on recherche l'objet moyen complet
				if (moyen.nb_activites) {
					moyen.nb_activites++;
				} else {
					moyen.nb_activites = 1;
				}
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
				// on decremente le nombre d'activite du moyen correspondant
				var moyen = activite.getRelations(restRepoMoyens, function(moyen) {
					moyen.nb_activites--;
					console.log("il reste " + moyen.nb_activites + " activites dans " + moyen.nom);
					activite.remove(function(removed) {
						self.removeEvent(event);
					});
				}, function(error) {
					console.log('Remove Error : ' + error)
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
			// console.log('event original' +
			// JSON.stringify(event.original.json));

			event.original.json.datedebut = event.start.format();
			event.original.json.datefin = event.end.format();

			// activitesObj.update(event.original, null, function(error) {
			event.original.update(function(sucess) {
				self.updateEvent(event);
			}, function(error) {
				revertFunc();
			});

		}

	}

	/**
	 * setDefaultMode remet le calendrier dans le mode par defaut, c'est a dire
	 * ni admin, ni visiteur
	 */
	function setDefaultMode() {
		console.log('calendrier mode defaut');
		var self = this;
		this.config.droppable = false;
		this.config.editable = false;
		this.config.eventClick = infoEventActivite;
		// var config = {
		// droppable : false,
		// editable : false,
		// // callBack fullCalendar
		// // events : null, // vraiment ??
		// // eventRender : null,
		// // events : null,
		// eventClick : infoEventActivite,
		// //eventDrop : null,
		// //eventReceive : null,
		// //eventResize : null
		// }
		// $.extend(true,self.config,config);
		// delete calendar.config.calendar.eventDrop;
		// delete calendar.config.calendar.eventReceive;
		// delete calendar.config.calendar.eventResize;
		// $.extend(true,this.calendar,calendar);
		// this.setConfig(calendar);
		// this.fullCalendar(calendar );
		// console.log("eventSources.length :" +
		// this.calendar.eventSources.length);
		// this.fullCalendar( 'addEventSource', this.events );
		// this.fullCalendar( 'removeEventSource', this.events );
		// this.fullCalendar( 'addEventSource', this.events );
		// self.fullCalendar(calendar);
		// $.extend(true,this.calendar,calendar);

		return true;

		/**
		 * suppression d'un event sur le calendrier c'est un callback eventClick
		 * de fullCalendar http://fullcalendar.io/docs/mouse/eventClick/
		 * 
		 */
		function infoEventActivite(event, jsEvent, view) {
			// var old_color = $(this).css('border-color');
			// $(this).css('border-color', 'red');

			var activite = event.original;
			var message = "infos sur actvite id " + activite.id + "\n" + "datedebut :" + activite.json.datedebut + "\n" + "start     :" + event.start.format() + "\n" + "datefin   :" + activite.json.datefin + "\n" + " event.id : " + event.id + "\n" + " event._id : " + event._id;

			var moyen = activite.getRelations(restRepoMoyens, function(moyen) {
				message = message + "moyen :" + moyen.id + " deployé " + moyen.nb_activites + " fois";
				alert(message);
			});
			// $(this).css('border-color', old_color);
			return true;
		}

	}

	/**
	 * setVisiteurMode met le calendrier dans le mode ou un visiteur peut
	 * selectionner des activitées
	 */
	function setVisiteurMode() {
		this.config.droppable = false;
		this.config.editable = false;
		this.config.eventClick = toggleInscription;

		return;
		
		function toggleInscription(event, jsEvent, view) {
			// var old_color = $(this).css('border-color');
			// $(this).css('border-color', 'red');

			var activite = event.original;

			//activite.getRelations(restRepoVisiteurs,function(insc))
			
			if(confirm("s'incrire ?")){
				
			}
			
			// $(this).css('border-color', old_color);
			return true;
		}
		
		
	}
}
