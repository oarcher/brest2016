/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller', brest2016Controller);

// brest2016Controller.$inject = [$http, 'StandService'];

function brest2016Controller($scope, Utils, RestRepo, RestObject, $timeout, dialog, BaseCalendar, calendarActions) {
	/**
	 * On préfère l'utilisation de 'this' a $scope, qui peut induire en erreur
	 * dans certains cas.
	 * 
	 * le fait d'avoir vm = this permet d'acceder a vm dans les fonctions qui
	 * rereferencent this. Pour augmenter la lisibilité du controller, on
	 * utilise 'vm' pour ce qui est destiné au vues html (view model) et this
	 * pour ce qui concernent les variables locales.
	 */
	var vm = this;

	/**
	 * déclaration des variables et methodes.
	 * 
	 * Le faire ici permet d'avoir une vue syntetique du controller, un peu a la
	 * facon d'une interface.
	 */
	// login, logout
	vm.login = login; // Utils.login;
	vm.logout = logout;

	vm.createMoyen = createMoyen;


	/**
	 * Action a faire a l'initialisation du controller, et porentiellemnet avant
	 * le rendu de la vue html
	 */

	vm.moyens = new RestRepo("moyens");
	vm.activites = new RestRepo("activites");
	vm.visiteurs = new RestRepo("visiteurs");
	vm.visiteur = undefined; // sera initialisé au login

	// les variables du calendrier ui-calendar
	// (le tableau de evenements, et le nom du calendrier)
	vm.brest2016events = [];
	vm.calendarName = "brest2016calendar";

	// initialisation des variables du controller a faire apres le rendu de la
	// vue html.
	// Ceci permet d'avoir uiCalendarConfig.calendars de defini
	// (voir bug https://github.com/angular-ui/ui-calendar/issues/195 )
	$timeout(function() {
		// mise en place du calendrier, et des actions associées
		vm.calendar = new BaseCalendar(vm.calendarName, vm.brest2016events);
		vm.calendar.addActivite = calendarActions(vm.moyens, vm.activites, vm.visiteurs).addActivite;
		vm.calendar.setAdminMode = calendarActions(vm.moyens, vm.activites, vm.visiteurs).setAdminMode;
		vm.calendar.setDefaultMode = calendarActions(vm.moyens, vm.activites, vm.visiteurs).setDefaultMode;
		vm.calendar.setVisiteurMode = calendarActions(vm.moyens, vm.activites, vm.visiteurs).setVisiteurMode;
		vm.calendar.setDefaultMode();

		vm.debug = function() {
			// dialog.confirm("/brest2016/ng-template/lieu.html");
			vm.calendar.ObjCalendar.fullCalendar('refetchEvents');
			vm.calendar.ObjCalendar.fullCalendar('rerenderEvents');
		}

		vm.moyens.query(function(moyens) {
			moyens.forEach(function(moyen) {
				moyen.color = colorNames[colorIndex++ % colorNames.length];
			});
		});

		vm.activites.query(function(activites) {
			console.log('Ajout dans le calendier de ' + activites.length + " activitées")
			activites.forEach(function(activite) {
				vm.calendar.addActivite(activite);
				// on incremente le nombre d'activite du moyen concerné
				activite.getRelations(vm.moyens, function(moyen) {
					if (moyen.nb_activites) {
						moyen.nb_activites++;
					} else {
						moyen.nb_activites = 1;
					}
				})

			});
			console.log('activites ajoutées');

		});

		// gestion de la suppression d'un moyen
		vm.removeMoyen = removeMoyen;

	}, 0); // $timeout
	/**
	 * implementation des fonctions
	 */

	function login(user, password) {
		return Utils.login(user, password, function(status) {
			if (status.user == "admin") {
				vm.calendar.setAdminMode();
			} else {
				// on recupere le json du visiteur
				vm.visiteurs.search("findByLogin", {
					"login" : user
				}, function(visiteur) {
					vm.visiteur = new RestObject(visiteur, vm.visiteurs);
					vm.calendar.setVisiteurMode(vm.visiteur);
				});
			}

		});

	}

	function logout() {
		// desactivation des fonctionnalités du calendrier
		Utils.logout();
		vm.calendar.setDefaultMode();
		vm.visiteur = undefined;
	}

	/**
	 * creation d'un moyen C'est juste un wrapper pour ajouter un code couleur.
	 */

	var colorNames = [ "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkCyan", "DarkGoldenRod", "DarkGrey", "DarkKhaki",
	                   "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkSalmon", "DarkSeaGreen", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod" ];
	var colorIndex = 0;
	function createMoyen(moyen) {
		var created = vm.moyens.createReturnEmpty(moyen, function(created) {
			created.color = colorNames[colorIndex++ % colorNames.length];
			console.log('moyen id ' + moyen.id + " color : " + moyen.color);
		});
		return created;
	}

	/**
	 * suppression d'un moyen. Une confirmation est demandée si le moyen a été
	 * deployé.
	 * 
	 */
	function removeMoyen(moyen) {
		moyen.getRelations(vm.activites, function(activites) {
			if (activites.length == 0) {
				moyen.remove();
			} else {
				dialog.confirm("supprimer les " + activites.length + " activités associées ?").then(function(ok) {
					// On doit etre sur a 100% que toutes les activitées on eté
					// supprimées
					// avant de supprimer le moyen. c'est donc le dernier
					// callbackok de suppression d'activite qui supprime le
					// moyen.
					var copy_activites = angular.copy(activites);
					activites.forEach(function(activite) {
						
						var id = activite.id;
						console.log('retrait cascade activité id : ' + activite.id);
						var event = vm.calendar.findEventById(id);
						if (event.nbVisiteurs != 0) {
							Utils.showMessage("pas de suppression : " + event.nbVisiteurs +  " visiteurs sont inscrits","warning");
						} else {

							activite.remove(function(removed) {
								console.log('retrait cascade ok');
								// retrait du calendrier
								vm.calendar.removeEvent(event);
								console.log('retrait calendrier ok');
								var index_activite = copy_activites.map(function(copy_activite) {
									return copy_activite.id;
								}).indexOf(activite.id);
								copy_activites.splice(index_activite, 1);
								if (copy_activites.length == 0) {
									// derniere activite supprimmée
									console.log('retrait moyen');
									moyen.remove();
								}
							});
						}

					});
				});

			}
		});
	}

}
