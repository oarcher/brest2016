/**
 * http://usejsdoc.org/
 */

var brest2016 = angular
		.module("brest2016", [])
		.controller(
				'Brest2016Control',
				[
						'$scope',
						'$http',
						function($scope, $http) {

							// alert("Brest2016Control");

							$scope.listerAnimations = function() {
								// alert("creerClient");
								$http({
									method : 'GET',
									url : 'listeranimations.json',
								}).then(
										function(response) {
											var data = response.data;
											$scope.animations = data;
											alert("nb animations ="
													+ $scope.animations.length)
										})
							};
							$scope.ajouterAnimation = function() {
								// alert("creerClient");
								$http({
									method : 'POST',
									url : 'ajouteranimation.json',
									data : {
										nom : $scope.nom,
										texte : $scope.texte,
									}
								})
										.then(
												function(response) {
													// en cas d'ajout OK, on remet a jour la liste des animations
													$scope.listerAnimations();
												},
												function(response) {
													var data = response.data, status = response.status, header = response.header, config = response.config;
													alert(data.errors);
													// error handler
												})
							};

						} ]);
