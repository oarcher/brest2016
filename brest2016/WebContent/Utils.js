/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	/**
	 * 
	 * 
	 */

	angular.module('brest2016App').factory('Utils', factory);

	function factory(growl, $http) {
		console.log('Factory init');
		var services = {
			// gestion générique des messages d'erreurs
			// showMessages : showMessages,
			showMessage : showMessage,
			login : login,
			logout : logout,
		// retourne le restobject d'un élément
		// getRestobject : getRestobject

		};

		return services;

		function showMessage(message, type) {
			console.log(message);
			if (!type) {
				type = "info"
			}
			growl[type](message, {
				ttl : 10000
			});
		}

		/**
		 * validation du login par spring security. Permet de debloquer l'acces
		 * aux fonctionnalitées du serveur REST curl -i --header
		 * "Accept:application/json" -d username=admin -d password=admin
		 * --cookie-jar cookies.txt -L http://localhost:8080/brest2016/login
		 * curl -i -X POST -H 'Content-Type:application/json' -b cookies.txt -d
		 * '{"nom":"AAAAkkffkoo"}' http://localhost:8080/brest2016/rest/moyens
		 */
		function login(user, password, callbackok) {
			var status = {
				logged : false,
				user : ""
			};
			var credentials = {
				username : user,
				password : password
			};
			$http({
				method : 'POST',
				url : "/brest2016/login",
				data : $.param(credentials),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			}).then(function(loginok) {
				console.log("login ok" + loginok);
				status.logged = true;
				status.user = user;
				showMessage(user + " connecté");
				typeof callbackok === 'function' && callbackok(status);
			}, function(loginnok) {
				console.log("login nok" + loginnok);
				showMessage("login incorrect", "error");
			});
			return status;

		}

		/**
		 * deconnexion
		 */
		function logout() {
			var status = {
				logged : false,
				user : "",
				type : ""
			};
			$http({
				url : "/brest2016/logout",
			});
			showMessage("déconnecté");
			return status;

		}


	}

})();

/**
 * recopié de
 * http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
 * FIXME a virer
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
