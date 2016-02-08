/**
 * http://usejsdoc.org/
 */

(function() {
	// 'use strict'; // attention, risque de $http undefined ..

	angular.module('brest2016App').service('AnimationService',
			[ '$http', function($http) {
				var animationService = {};

				animationService.salut = function() {
					return "salut de service";
				}

				animationService.listerAnimations = function() {

					// ca marche avec promise, mais c'est pas commode
					var promise = $http({
						method : 'GET',
						url : 'listeranimations.json',
					}).then(function(response) {
						var data = response.data;
						alert("nb animations =" + data.length);
						return data;

					})

					return promise;
				};

				return animationService;

			} ]);

	// .service('AnimationService', animationService);
	// function animationService() {
	//
	// this.salut = salut;
	//			
	// function salut() {
	// alert('service');
	// return "salut service";
	// }
	// }

})();