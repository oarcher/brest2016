/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	/**
	 * 
	 * 
	 */

	angular.module('brest2016App').factory('Brest2016Factory', factory);

	function factory(growl,$http) {
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
		
		function login(user,password, callbackok){
			/*
			 * validation du login par spring security.
			 * Permet de debloquer l'acces aux fonctionnalitées du serveur REST
			 * curl -i --header "Accept:application/json" -d username=admin -d password=admin --cookie-jar cookies.txt -L http://localhost:8080/brest2016/login
			 * curl -i -X POST -H 'Content-Type:application/json' -b cookies.txt -d '{"nom":"AAAAkkffkoo"}'  http://localhost:8080/brest2016/rest/moyens
			 */
			var status={logged: false , user: ""};
			var credentials={username : user, password : password};
			$http({
			    method: 'POST',
			    url: "/brest2016/login",
			    data: $.param(credentials),
			    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function(loginok){
				console.log("login ok" + loginok);
				status.logged=true;
				status.user=user;
				showMessage(user + " connecté");
				typeof callbackok === 'function' && callbackok(status);
			},function(loginnok){
				console.log("login nok" + loginnok);
				showMessage("login incorrect", "error");
			});
			return status;
			
		}
		
		function logout(){
			var status={logged: false , user: "" , type : ""};
			$http({
			    url: "/brest2016/logout",
			});
			showMessage("déconnecté");
			return status;
			
		}

	}

})();
