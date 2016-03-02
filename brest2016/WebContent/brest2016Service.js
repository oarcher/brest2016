/**
 * http://usejsdoc.org/
 */


(function() {
	'use strict'; 

	angular.module('brest2016App').service('StandService',
			[ '$http', function($http) {
				var standService = {};

				standService.salut = function() {
					return "salut de service";
				}

				standService.listerStands = function() {

					// ca marche avec promise, mais c'est pas commode
					var promise = $http({
						method : 'GET',
						url : 'listerstands.json',
					}).then(function(response) {
						var data = response.data;
						alert("nb stands =" + data.length);
						return data;

					})

					return promise;
				};

				return standService;

			} ]);


})();