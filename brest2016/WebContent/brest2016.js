/**
 * http://usejsdoc.org/
 */

var brest2016 = angular.module("brest2016", []).controller('Brest2016Control',
		[ '$scope', '$http', function($scope, $http) {
			
			
			//alert("Brest2016Control");
			
			$scope.animation="animation1";
			
			$scope.recupererListeAnimations = function() {
				// alert("creerClient");
				$http({
					method : 'GET',
					url : 'listeanimations.json',
					data:  $scope.animation
				}).success(function(data) {
					$scope.animations = data;
					// alert("nb clients =" + $scope.clients.length)
				})
			};

		} ]);
