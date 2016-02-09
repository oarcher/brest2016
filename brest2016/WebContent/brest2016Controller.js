/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller',
		[ '$resource', '$http', 'Animation', brest2016Controller ]);

// brest2016Controller.$inject = [$http, 'AnimationService'];

/**
 * @param $resource
 * @param $http
 * @param Animation
 */
/**
 * @param $resource
 * @param $http
 * @param Animation
 */
function brest2016Controller($resource, $http, Animation) {
	// on préfère l'utilisation de 'this' a $scope

	/**
	 * On préfère l'utilisation de 'this' a $scope, qui peut induire en erreur
	 * dans certains cas.
	 * 
	 * le fait d'avoir vm = this permet d'acceder a vm dans les fonctions qui
	 * rereferencent this. Pour augmenter la lisibilité du controller, on
	 * utilise 'vm' pour ce qui est destiné au vu html (view model) et this pour
	 * ce qui concernent les variables locales.
	 */
	var vm = this;

	/**
	 * déclaration des variables et methodes.
	 * 
	 * Le faire ici permet d'avoir une vue syntetique du co,ntroller, un peu a
	 * la facon d'une interface.
	 */

	vm.animations = []; // contiendra les animations
	vm.createAnimation = createAnimation; // création d'animation
	//vm.createAnimation = ajouterAnimation ;
	vm.readAnimation = readAnimation; // recuperation des animations

	/** l'objet animation (JSON) */
	vm.animation = {
		nom:  "",
		descr: ""
	};


	/**
	 * Action a faire a l'initialisation du controller FIXME : Que faire si
	 * plusieurs <form> utilise ce controller ?
	 */
	vm.animations = vm.readAnimation();

	/**
	 * implementation des fonctions
	 */

	function createAnimation() {
		console.log('createAnimation' + vm.animation);
		Animation.save(vm.animation, function () {
			console.log('createAnimation OK :' + vm.animation);
			vm.animations.push(vm.animation);
		},
		function(response) {
			console.log('createAnimation NOK :' + vm.animation);
			//var data = response.data, status = response.status, header = response.header, config = response.config;
			alert(response.data.errors);
			// error handler
		});
	}
	
	/**
	 * @return un tableau de 'promises' qui seront résolues dynamiquement
	 */
	function readAnimation() {
		return Animation.query(function() {
			// on arrive ici une fois que toutes les 'promises' ont étés resolues
			console.log('ajout OK');
		}); // query() returns all the entries
		// retourne un tableau de 'promise' qui seront résolues a la volée
		
	}

	function ajouterAnimation() {
		alert('ajout avant $http animations=' + vm.animations.length);
		//var animation = {
		//	nom : vm.nom,
		//	descr : vm.descr
		//};
		$http({
			method : 'POST',
			url : '/brest2016/rest/animation.json',
			data : vm.animation
		})
				.then(
						function(response) {
							// en cas d'ajout OK, on
							// remet a jour la liste des
							// animations
							alert('ajout ok avant push animations='
									+ vm.animations.length);
							vm.animations.push(vm.animation);
							// vm.listerAnimations();
							alert('ajout ok animations=' + vm.animations.length);
						},
						function(response) {
							var data = response.data, status = response.status, header = response.header, config = response.config;
							alert(data.errors);
							// error handler
						})
	}


	function listerAnimations() {
		// depuis angular 1.2, les 'promise' ne sont plus 'unwrapped'
		// (voir
		// http://stackoverflow.com/questions/19472017/angularjs-promise-not-binding-to-template-in-1-2
		// )
		// ce qui oblige l'appelant a appeler lui meme le callback 'then' sur la
		// promise
		// une alternative pour garder un appel de fonction du style
		// vm.animations=listerAnimations();
		// et de retourner un tableau vide qui sera rempli par le callback
		// 'then'

		var animations = []; // tableau local destiné a recevoir les
		// animations
		$http({
			method : 'GET',
			url : 'listeranimations.json'
		}).then(
		// callback asynchrone: serat executé /apres/ le reour de la fonction
		function(response) {
			// on rempli le tableau animations
			// on ne peut pas ecrire "animations = response.data"
			// car animation serait déréférencé et nom visible dans le retour de
			// la fonction
			response.data.forEach(function(item) {
				local_array.push(item);
			});
			alert("nb animations =" + animations.length);

		})
		// la fonction retourne un tableau vide
		// mais le callback 'then' le remplira plus tard
		return animations;

		// ca marche, mais c'est pas simple (promise ici ... )
		// AnimationService.listerAnimations().then(function(data) {
		// vm.animations = data;
		// alert(data);
		// });
		// alert('fait');
	}
}
