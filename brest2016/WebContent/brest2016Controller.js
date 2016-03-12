/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller', brest2016Controller);

// brest2016Controller.$inject = [$http, 'StandService'];

/**
 * 
 */
JSON.stringifyOnce = function(obj, replacer, indent) {
	var printedObjects = [];
	var printedObjectKeys = [];

	function printOnceReplacer(key, value) {
		if (printedObjects.length > 2000) { // browsers will not print more than
			// 20K, I don't see the point to
			// allow 2K.. algorithm will not be
			// fast anyway if we have too many
			// objects
			return 'object too long';
		}
		var printedObjIndex = false;
		printedObjects.forEach(function(obj, index) {
			if (obj === value) {
				printedObjIndex = index;
			}
		});

		if (key == '') { // root element
			printedObjects.push(obj);
			printedObjectKeys.push("root");
			return value;
		}

		else if (printedObjIndex + "" != "false" && typeof (value) == "object") {
			if (printedObjectKeys[printedObjIndex] == "root") {
				return "(pointer to root)";
			} else {
				return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase() : typeof (value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
			}
		} else {

			var qualifiedKey = key || "(empty key)";
			printedObjects.push(value);
			printedObjectKeys.push(qualifiedKey);
			if (replacer) {
				return replacer(key, value);
			} else {
				return value;
			}
		}
	}
	return JSON.stringify(obj, printOnceReplacer, indent);
};

function brest2016Controller(Brest2016Factory, RestRepo, $timeout, BaseCalendar) {
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
	vm.login = login; // Brest2016Factory.login;
	vm.logout = logout;

	vm.createMoyen = createMoyen;

	var colorNames = [ "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkCyan", "DarkGoldenRod", "DarkGrey", "DarkKhaki",
			"DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkSalmon", "DarkSeaGreen", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod" ];
	var colorIndex = 0;

	/**
	 * Action a faire a l'initialisation du controller
	 */
	vm.moyens = new RestRepo("moyens");
	vm.activites = new RestRepo("activites");

	vm.brest2016events = [];
	vm.calendarName = "brest2016calendar";

	// timeout a 0 pour forcer le rendu de la vue avant d'utiliser le calendrier
	// et ainsi avoir un uiCalendarConfig.calendars.brest2016calendar utilisable
	// (voir bug https://github.com/angular-ui/ui-calendar/issues/195 )
	$timeout(function() {
		// mise en place du calendrier, et des actions associées
		vm.calendar = new BaseCalendar(vm.calendarName, vm.brest2016events);
		vm.calendar.addActivite = calendarActions(vm.moyens, vm.activites ).addActivite;
		vm.calendar.setAdminMode = calendarActions(vm.moyens, vm.activites).setAdminMode;
		vm.calendar.setDefaultMode = calendarActions(vm.moyens, vm.activites).setDefaultMode;
		vm.calendar.setVisiteurMode = calendarActions(vm.moyens, vm.activites).setVisiteurMode;

		vm.debugCalendar = function() {
			vm.calendar.ObjCalendar.fullCalendar('refetchEvents');
			vm.calendar.ObjCalendar.fullCalendar('rerenderEvents');
		}

		vm.moyens.query(function(moyens) {
			moyens.forEach(function(moyen) {
				moyen.color = colorNames[colorIndex++ % colorNames.length];
			});
		});

		vm.activites.query(function(activites) {
			console.log('Ajout dans le calendier de ' + activites.length + "activitées")
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
			console.log('activites ajoutée');

		});

		// gestion de la suppression d'un moyen
		vm.removeMoyen = removeMoyen;

		// la recupération de la liste des visiteurs n'est valable
		// que pour admin
		vm.visiteurs = new RestRepo("visiteurs");
		vm.visiteurs.query();

		// les activites ne seront pas recupérées
		// par le constructeur, c'est le calendrier qui le fera

	}, 0); // $timeout
	/**
	 * implementation des fonctions
	 */

	function login(user, password) {
		return Brest2016Factory.login(user, password, function(status) {
			if (status.user == "admin") {
				vm.calendar.setAdminMode();
			} else {
				vm.calendar.setVisiteurMode();
			}
		});

	}

	function logout() {
		// desactivation des fonctionnalités du calendrier
		vm.calendar.setDefaultMode();
		return Brest2016Factory.logout();

	}

	/**
	 * creation d'un moyen C'est juste un wrapper pour ajouter un code couleur.
	 */

	function createMoyen(moyen) {
		var created = vm.moyens.createReturnEmpty(moyen, function(created) {
			created.color = colorNames[colorIndex++ % colorNames.length];
			console.log('moyen id ' + moyen.id + " color : " + moyen.color);
		});
		return created;
	}

	function removeMoyen(moyen) {
		moyen.getRelations(vm.activites, function(activites) {
			// vm.moyens.getRelations(moyen, "activite", function(activites)
			// {
			if (activites.length == 0) {
				moyen.remove();
				// vm.moyens.remove(moyen);
			} else {
				if (confirm("supprimer les " + activites.length + "acivités associées ?")) {
					// vm.moyens.remove(moyen);
					activites.forEach(function(activite) {
						console.log('retrait cascade activité id : ' + activite.id);
						var id = activite.id;
						activite.remove();
						console.log('retrait cascade ok');
						// // retrait du calendrier
						vm.calendar.removeEvent(vm.calendar.findEventById(id));
						console.log('retrait calendrier ok');

					});
					console.log('retrait moyen ?');
					moyen.remove();
					console.log('retrait moyen ok');
				}

			}
		});
	}
}
