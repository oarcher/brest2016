/**
 * http://usejsdoc.org/
 */

/*
 * Controleur Angular brest2016 Le code est formatté d'après les recommendations
 * sur https://github.com/johnpapa/angular-styleguide
 * 
 */

angular
	.module('brest2016App')
	.controller('Brest2016Controller',  Brest2016Control );



function Brest2016Control(StandService){
	vm=this;
	vm.salut = StandService.salut();
}


brest2016App.service('StandService', function() {
	this.salut= function(){
		alert('service');
		return "salut service";
	};  
});



//
//function Brest2016Control($scope, aniamtionService){
//	$scope.salut = aniamtionService.salut();
//}
//
//var Brest2016Control = function(aniamtionService) {
//	vm = this;
//	vm.test = 'test';
//	vm.hello = hello;
//	vm.salut = aniamtionService.salut();
//	// alert('juste apres =');
//	vm.listerStands = listerStands;
//
//	function hello() {
//		alert('hello truc');
//		return 'hello world';
//	}
//
//	function listerStands($http) {
//		alert('lister');
//		$http({
//			method : 'GET',
//			url : 'listerstands.json',
//		}).then(function(response) {
//			var data = response.data;
//			vm.stands = data;
//			alert("nb stands =" + vm.stands.length)
//		});
//	}
//
//}
//
//
//brest2016App.controller('Brest2016Controller',[ '$scope', Brest2016Control ]);
		

// Brest2016Control.$inject = [ '$scope' ];

// brest2016App.controller('GreetingController', ['$scope', Brest2016Control ]);

// Brest2016Control.$inject = [ '$scope' ];
//
// angular.module("brest2016").controller('Brest2016Control',Brest2016Control);

// var vm = this;
//
// vm.test = 'hello';
//	
// vm.listerStands = listerStands;
// vm.ajouterStands = ajouterStand;
//
// function listerStands($http) {
// $http({
// method : 'GET',
// url : 'listerstands.json',
// }).then(function(response) {
// var data = response.data;
// vm.stands = data;
// alert("nb stands =" + vm.stands.length)
// });
// }
//
// function ajouterStand($http) {
// $http({
// method : 'POST',
// url : 'ajouterstand.json',
// data : {
// nom : vm.nom,
// texte : vm.texte,
// }
// })
// .then(
// function(response) {
// // en cas d'ajout OK, on
// // remet a jour la liste des
// // stands
// vm.listerStands();
// },
// function(response) {
// var data = response.data, status = response.status, header = response.header,
// config = response.config;
// alert(data.errors);
// // error handler
// })
// };
//
// }

// var brest2016 = angular
// .module("brest2016", [])
// .controller(
// 'Brest2016Control',
// [
// '$scope',
// '$http',
// function($scope, $http) {
//
// // alert("Brest2016Control");
//
// $scope.listerStands = function() {
// // alert("creerClient");
// $http({
// method : 'GET',
// url : 'listerstands.json',
// }).then(
// function(response) {
// var data = response.data;
// $scope.stands = data;
// alert("nb stands ="
// + $scope.stands.length)
// })
// };
// $scope.ajouterStand = function() {
// // alert("creerClient");
// $http({
// method : 'POST',
// url : 'ajouterstand.json',
// data : {
// nom : $scope.nom,
// texte : $scope.texte,
// }
// })
// .then(
// function(response) {
// // en cas d'ajout OK, on
// // remet a jour la liste des
// // stands
// $scope.listerStands();
// },
// function(response) {
// var data = response.data, status = response.status, header = response.header,
// config = response.config;
// alert(data.errors);
// // error handler
// })
// };
//
// } ]);
