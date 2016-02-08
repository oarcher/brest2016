/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller',
		[ '$http', 'AnimationService', brest2016Controller ]);

// brest2016Controller.$inject = [$http, 'AnimationService'];

function brest2016Controller($http, AnimationService) {
	// on préfère l'utilisation de 'this' a $scope
	// 
	var vm = this;   // vm sera accessible dans les fonctions sans avoir a faire de bind

	// on recupere la liste des animations des l'initialisation du contoller
	//this.animations = listerAnimations();
	// this.salut = AnimationService.salut();

	// alert( AnimationService.salut() );

	/*
	 * déclaration des variables et methodes
	 */
	vm.animations = [];
	vm.listerAnimations = listerAnimations;
	vm.ajouterAnimation = ajouterAnimation;
	
	/*
	 * Appel des fonction d'initialisations
	 * depuis angular 1.2, on ne peut plus recuperer les promise par
	 * vm.animations = listerAnimations()
	 * (voir http://stackoverflow.com/questions/19472017/angularjs-promise-not-binding-to-template-in-1-2 )
	 */
	listerAnimations();


	/*
	 * implementation des fonctions
	 */
	function listerAnimations(){
		
		$http({
			method : 'GET',
			url : 'listeranimations.json'
		}).then(
		// la methode 'then' de $http est une 'promise' asynchrone
		// c'est a dire que la requette est executée apres le retour de la
		// fonction.
		// donc des que la requete est faite, la variable 'vm.animations' est
		// positionnée dans le controller
		function(response) {
			
			vm.animations = response.data;
			alert("nb animations =" + vm.animations.length);

		})

		// ca marche, mais c'est pas simple (promise ici ... )
		// AnimationService.listerAnimations().then(function(data) {
		// vm.animations = data;
		// alert(data);
		// });
		// alert('fait');
	}

	function ajouterAnimation(){
		alert('ajout ok avant $http animations=' + vm.animations.length);
		var animation = {
				nom : vm.nom,
				texte : vm.texte
			};
		$http({
			method : 'POST',
			url : 'ajouteranimation.json',
			data : animation
		})
				.then(
						function(response) {
							// en cas d'ajout OK, on
							// remet a jour la liste des
							// animations
							alert('ajout ok avant push animations=' + vm.animations.length);
							vm.animations.push(animation);
							//vm.listerAnimations();
							alert('ajout ok animations=' + vm.animations.length);
						},
						function(response) {
							var data = response.data, status = response.status, header = response.header, config = response.config;
							alert(data.errors);
							// error handler
						})
	};
	
	
}
