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



function Brest2016Control(AnimationService){
	vm=this;
	vm.salut = AnimationService.salut();
}


brest2016App.service('AnimationService', function() {
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
//	vm.listerAnimations = listerAnimations;
//
//	function hello() {
//		alert('hello truc');
//		return 'hello world';
//	}
//
//	function listerAnimations($http) {
//		alert('lister');
//		$http({
//			method : 'GET',
//			url : 'listeranimations.json',
//		}).then(function(response) {
//			var data = response.data;
//			vm.animations = data;
//			alert("nb animations =" + vm.animations.length)
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
// vm.listerAnimations = listerAnimations;
// vm.ajouterAnimations = ajouterAnimation;
//
// function listerAnimations($http) {
// $http({
// method : 'GET',
// url : 'listeranimations.json',
// }).then(function(response) {
// var data = response.data;
// vm.animations = data;
// alert("nb animations =" + vm.animations.length)
// });
// }
//
// function ajouterAnimation($http) {
// $http({
// method : 'POST',
// url : 'ajouteranimation.json',
// data : {
// nom : vm.nom,
// texte : vm.texte,
// }
// })
// .then(
// function(response) {
// // en cas d'ajout OK, on
// // remet a jour la liste des
// // animations
// vm.listerAnimations();
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
// $scope.listerAnimations = function() {
// // alert("creerClient");
// $http({
// method : 'GET',
// url : 'listeranimations.json',
// }).then(
// function(response) {
// var data = response.data;
// $scope.animations = data;
// alert("nb animations ="
// + $scope.animations.length)
// })
// };
// $scope.ajouterAnimation = function() {
// // alert("creerClient");
// $http({
// method : 'POST',
// url : 'ajouteranimation.json',
// data : {
// nom : $scope.nom,
// texte : $scope.texte,
// }
// })
// .then(
// function(response) {
// // en cas d'ajout OK, on
// // remet a jour la liste des
// // animations
// $scope.listerAnimations();
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
