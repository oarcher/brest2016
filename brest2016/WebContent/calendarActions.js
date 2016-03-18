/**
 * http://usejsdoc.org/
 * 
 * Methodes destinées a etre injectées dans le calendrier fullCalendar pour en
 * modifier le comportement (ajout d'activite, mode admin, visiteur, ou par
 * defaut)
 */

(function() {
	'use strict';
	angular.module('brest2016App').factory('calendarActions', function(dialog, Utils) {

		return calendarActions;

		function calendarActions(restRepoMoyens, restRepoActivites, restRepoVisiteurs) {

			return {
				addActivite : addActivite,
				setAdminMode : setAdminMode,
				setDefaultMode : setDefaultMode,
				setVisiteurMode : setVisiteurMode,
			}

			/**
			 * retourne le titre de l'evenement en fonction du nombre de
			 * visiteurs et des places dispos
			 */
			function getTitle(event) {
				return event.nomMoyen + "\n" + event.lieu + "\n(" + event.nbVisiteurs + "/" + event.nbPlaces + ")";
			}

			/**
			 * addActivite permet d'ajouter une activité sur le calendrier
			 * vm.calendar.addActivite=addActivite;
			 * vm.calendar.addActivite(activite);
			 * 
			 * @param activite :
			 *            un restObject de type activité
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
				// le nom, le lieu, le nombre de places dispo, sont dans moyen
				activite.getRelations(restRepoMoyens, function(moyen) {
					activite.getRelations(restRepoVisiteurs, function(visiteurs) {
						event.nomMoyen = moyen.json.nom;
						event.lieu = moyen.json.lieu;
						event.nbPlaces = moyen.json.nbPlaces;
						event.nbVisiteurs = visiteurs.length;
						event.backgroundColor = moyen.color;
						event.textColor = 'black';
						console.log('addActivite event.id : ' + event.id + 'color : ' + event.backgroundColor);
						event.title = getTitle(event);
						self.addEvent(event);
					});
				});
				return event;
			}

			/**
			 * fournit un object destiné a etre injecté dans un calendrier pour
			 * fournir les fonctionnalitées d'admin
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
				this.config.droppable = true;
				this.config.editable = true;
				// callBack fullCalendar
				// events : null,
				this.config.eventClick = removeEventActivite;
				this.config.eventDrop = updateEventActivite;
				this.config.eventReceive = moyenToEventActivite;
				this.config.eventResize = updateEventActivite;
				this.ObjCalendar.fullCalendar(this.config);
				this.ObjCalendar.fullCalendar('refetchEvents');
				this.ObjCalendar.fullCalendar('rerenderEvents');

				var calendar = this;
				return true;

				/**
				 * appelé par le drop d'un moyen sur le calendrier. moyen est un
				 * pur json, auquel fullCalendar a ajouté les moments start et
				 * end
				 * 
				 */
				function moyenToEventActivite(json_moyen) {
					console.log("moyenToEventActivite moyen : " + JSON.stringify(json_moyen));
					// var self = this;
					// on recupere l'objet moyen

					var moyen = restRepoMoyens.findByJson(json_moyen);
					restRepoActivites.create({
						lieu : 'lieu par defaut',
						datedebut : json_moyen.start,
						datefin : json_moyen.end,
						moyen : moyen.getHref()
					}, function(activite) {
						console.log("moyenToEventActivite activite : id :" + activite.id + " JSON : " + JSON.stringify(activite.json));
						calendar.addActivite(activite);
						// on recherche l'objet moyen complet
						if (moyen.nb_activites) {
							moyen.nb_activites++;
						} else {
							moyen.nb_activites = 1;
						}
						calendar.ObjCalendar.fullCalendar('refetchEvents');
						calendar.ObjCalendar.fullCalendar('rerenderEvents');
					}, function(error) {
						// le serveur a refusé de deployer
						// l'activite.
						calendar.ObjCalendar.fullCalendar('refetchEvents');
						calendar.ObjCalendar.fullCalendar('rerenderEvents');
					});
				}

				/**
				 * suppression d'un event sur le calendrier c'est un callback
				 * eventClick de fullCalendar
				 * http://fullcalendar.io/docs/mouse/eventClick/
				 * 
				 */
				function removeEventActivite(event, jsEvent, view) {
					if (event.nbVisiteurs == 0) {
						var old_color = $(this).css('border-color');
						var dom = this;
						$(dom).css('border-color', self.selectedColor);
						dialog.confirm("Delete " + JSON.stringify(event.id) + "?").then(function(ok) {
							var activite = event.original;
							// on decremente le nombre d'activite du moyen
							// correspondant
							var moyen = activite.getRelations(restRepoMoyens, function(moyen) {
								moyen.nb_activites--;
								console.log("il reste " + moyen.nb_activites + " activites dans " + moyen.nom);
								activite.remove(function(removed) {
									calendar.removeEvent(event);
								});
							}, function(error) {
								console.log('Remove Error : ' + error)
							});
						}, function(nok) {
							$(dom).css('border-color', old_color);
						});
					} else {
						Utils.showMessage("Impossible de supprimer une activité ou des visisteurs sont inscrits", "warning");
					}
				}

				/**
				 * deplacement ou resize d'un evenement sur le calendrier c'est
				 * un callback fullCalendar de type eventDrop ou enventResize
				 * http://fullcalendar.io/docs/event_ui/eventDrop/
				 */
				function updateEventActivite(event, delta, revertFunc) {
					if (event.nbVisiteurs == 0) {
						console.log('deplacement de ' + event.id + ' a ' + event.start.format());
						console.log('event.end : ' + event.end.format());
						event.original.json.datedebut = event.start.format();
						event.original.json.datefin = event.end.format();

						event.original.update(function(sucess) {
							calendar.updateEvent(event);
						}, function(error) {
							revertFunc();
						});
					} else {
						Utils.showMessage("Impossible de reprogrammer une activité ou des visisteurs sont inscrits", "warning");
						revertFunc();
					}

				}

			}

			/**
			 * setDefaultMode remet le calendrier dans le mode par defaut, c'est
			 * a dire ni admin, ni visiteur
			 */
			function setDefaultMode() {
				console.log('calendrier mode defaut');
				this.config.droppable = false;
				this.config.editable = false;
				this.config.eventClick = infoEventActivite;
				// this.config.eventRender = eventRender;
				var calendar = this;

				this.events.forEach(function(event) {
					event.borderColor = calendar.config.eventBorderColor;
				});
				this.ObjCalendar.fullCalendar(this.config);
				this.ObjCalendar.fullCalendar('refetchEvents');
				this.ObjCalendar.fullCalendar('rerenderEvents');
				return


				/**
				 * Info sur une activite du calendrier c'est un callback
				 * eventClick de fullCalendar
				 * http://fullcalendar.io/docs/mouse/eventClick/
				 * 
				 */
				function infoEventActivite(event, jsEvent, view) {
					// var old_color = $(this).css('border-color');
					// $(this).css('border-color', 'red');

					var activite = event.original;
					var message = "infos sur actvite id " + activite.id + "\n" + "datedebut :" + activite.json.datedebut + "\n" + "start     :" + event.start.format() + "\n" + "datefin   :" + activite.json.datefin + "\n" + " event.id : " + event.id + "\n" + " event._id : " + event._id;

					var moyen = activite.getRelations(restRepoMoyens, function(moyen) {
						message = message + "moyen :" + moyen.id + " deployé " + moyen.nb_activites + " fois";

						dialog.alert(message);
					});
					// $(this).css('border-color', old_color);
				}

			}

			/**
			 * setVisiteurMode met le calendrier dans le mode ou un visiteur
			 * peut selectionner des activitées
			 */
			function setVisiteurMode(visiteur) {
				console.log(JSON.stringifyOnce(visiteur, null, 2));
				console.log("activation calendrier en mode visiteur pour " + visiteur.json.login);

				this.config.droppable = true;
				this.config.editable = false;
				this.config.eventClick = toggleInscription;
				this.visiteur = visiteur;
				// tableau des activite, en relation avec la vue html
				this.visiteur.activites = [];
				this.ObjCalendar.fullCalendar('eventClick', toggleInscription);

				var calendar = this;
				// on recupere les activites auxquelles est deja inscrit le
				// visiteur
				this.visiteur.getRelations(restRepoActivites, function(activites) {
					activites.forEach(function(activite) {
						console.log("visiteur " + visiteur.json.login + " inscrit a activité " + activite.id);
						calendar.visiteur.activites.push(formatActivite(activite));
						var event = calendar.findEventById(activite.id);
						event.borderColor = calendar.selectedColor;
					});
					calendar.ObjCalendar.fullCalendar(calendar.config);
					calendar.ObjCalendar.fullCalendar('refetchEvents');
					calendar.ObjCalendar.fullCalendar('rerenderEvents');
				});

				return;

				/**
				 * inscription ou desinscription a une activite en fonction du
				 * click d'un evenement sur le calendrier
				 */
				function toggleInscription(event, jsEvent, view) {
					var activite = event.original;
					var dom = this;
					// on recherche dans les activitées auxquelle est inscrit le
					// visiteur

					var registered = calendar.visiteur.activites.map(function(activite) {
						return activite.id;
					}).indexOf(activite.id);

					if (registered >= 0) {
						// deja inscrit
						dialog.confirm('se desinscrire ?').then(function(ok) {
							calendar.visiteur.unSetRelation(activite, function(success) {
								// activite.unSetRelation(calendar.visiteur,
								// function(success) {
								event.borderColor = calendar.config.eventBorderColor;
								console.log('Desinscrit. eventBorderColor est ' + calendar.config.eventBorderColor);
								calendar.visiteur.activites.splice(registered, 1);
								event.nbVisiteurs--;
								event.title = getTitle(event);
								calendar.updateEvent(event);
							});

						});
					} else {
						// inscription, on verifie qu'il reste des places
						activite.getRelations(restRepoVisiteurs, function(visiteurs) {
							var nbVisiteurs = visiteurs.length;
							activite.getRelations(restRepoMoyens, function(moyen) {
								var nbPlaces = moyen.json.nbPlaces;
								if (nbVisiteurs < nbPlaces) {
									// il reste des places, il faut aussi que le
									// visiteur
									// ne soit pas deja inscrit sur le meme
									// creneau
									calendar.visiteur.getRelations(restRepoActivites, function(activitesInscrites) {
										var nonOverlap = true;
										var rangeAinscrire = moment().range(activite.json.datedebut, activite.json.datefin);
										// console.log("check overlap a inscrire
										// " + rangeAinscrire.toString());

										activitesInscrites.forEach(function(activiteInscrite) {
											var rangeInscrit = moment().range(activiteInscrite.json.datedebut, activiteInscrite.json.datefin);
											// console.log("check overlap deja
											// inscrit " +
											// rangeInscrit.toString());
											if (rangeAinscrire.overlaps(rangeInscrit)) {
												console.log("Visiteur deja inscrit ailleur");
												nonOverlap = false;
											}
										});
										if (nonOverlap) {
											dialog.confirm("s'inscrire?").then(function(ok) {
												calendar.visiteur.setRelation(activite, function(success) {
													// activite.setRelation(calendar.visiteur,
													// function(success) {
													event.borderColor = calendar.selectedColor;
													calendar.visiteur.activites.push(formatActivite(activite));
													event.nbVisiteurs++;
													event.title = getTitle(event);
													calendar.updateEvent(event);
												});
											});
										} else {
											Utils.showMessage("Vous etes deja inscrit ailleur", "warning");
										}
									});
								} else {
									Utils.showMessage("Plus de places", "warning");
								}
							});
						});
					}

					// calendar.ObjCalendar.fullCalendar('refetchEvents');
					// calendar.ObjCalendar.fullCalendar('rerenderEvents');
				}

				/**
				 * prepare un json destinée a la vue html (date bien formatée,
				 * nom du moyen ..)
				 */
				function formatActivite(activite) {
					var viewActivite = {};
					viewActivite.id = activite.id;
					viewActivite.lieu = activite.json.lieu;
					viewActivite.sort = moment(activite.json.datedebut).format('X');
					viewActivite.horaire = moment(activite.json.datedebut).format('ddd Do h:mm') + " - " + moment(activite.json.datefin).format('h:mm');
					console.log("horaire : " + viewActivite.horaire);
					activite.getRelations(restRepoMoyens, function(moyen) {
						viewActivite.moyen = moyen.json.nom;
						console.log("moyen : " + viewActivite.moyen);
					});
					return viewActivite;
				}

			}
		}
	})
})();
