/**
 * http://usejsdoc.org/
 */

var brest2016 = angular.module("brest2016", []).controller('Brest2016Control',
		[ '$scope', '$http', function($scope, $http) {
			
			
			//alert("Brest2016Control");
			
			
			$scope.recupererListeAnimations = function() {
				// alert("creerClient");
				$http({
					method : 'GET',
					url : 'listeanimations.json',
				}).success(function(data) {
					$scope.animations = data;
					// alert("nb clients =" + $scope.clients.length)
				})
			};
			$scope.ajouterAnimation = function() {
				// alert("creerClient");
				$http({
					method : 'POST',
					url : 'ajouteranimation.json',
					data: {
                        nom: $scope.nom,
                        texte: $scope.texte,
                    }
				}).then(function(response) {
					// OK
					var data = response.data;
					$scope.animations = data;
					// alert("nb clients =" + $scope.clients.length)
				}, function(response) {
				    var data = response.data,
			        status = response.status,
			        header = response.header,
			        config = response.config;
				    alert(data.errors);
			    // error handler
			})
			};
			
			
		} ]);
