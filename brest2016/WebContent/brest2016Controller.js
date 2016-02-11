/**
 * http://usejsdoc.org/
 */

'use strict';

angular.module('brest2016App').controller('Brest2016Controller',
		brest2016Controller);

// brest2016Controller.$inject = [$http, 'AnimationService'];

function brest2016Controller($resource, $http, growl, Animation) {
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
	vm.createAnimation = createAnimation; // création d'animation (rest)
	// vm.createAnimation = ajouterAnimation ;
	vm.readAnimation = readAnimation; // recuperation des animations (rest)
	// vm.readAnimation=listerAnimations;

	/** l'objet animation (JSON) */
	vm.animation = {
		nom : "",
		descr : ""
	};

	/**
	 * Action a faire a l'initialisation du controller FIXME : Que faire si
	 * plusieurs <form> utilise ce controller ?
	 */
	vm.animations = vm.readAnimation();
	console.log('juste apres read : ' + JSON.stringify(vm.animations));

	/**
	 * implementation des fonctions
	 */

	function createAnimation() {
		console.log('createAnimation' + JSON.stringify(vm.animation));
		Animation.create(vm.animation, function(animation) {
			// l'animation a créer n'a pas d'id. C'est le role du serveur REST
			// de le fournir.
			// Le serveur Rest a fait du Post-Redirect-Get (
			// https://fr.wikipedia.org/wiki/Post-Redirect-Get )
			// pour rediriger vers l'url de l'animation créee
			// Un code 302 (FOUND/Redirect) a été retourné avec le header
			// 'Location' positionné sur l'url de l'animation crée
			// Cette redirection a été automatiquement suivie, et animation
			// contient maitenant un id
			// animation est du type {id: 76, nom: "NOM", descr: "DESCR",
			// $promise: Promise, $resolved: true}
			growl.addSuccessMessage('createAnimation OK :' + JSON.stringify(animation));

			//console.log('createAnimation OK :' + JSON.stringify(animation));
			vm.animations.push(animation);
			vm.animation = {};
		}, function(response) {
			growl.addWarnMessage('createAnimation NOK' + response.data.errors);
			//growl.addErrorMessage('createAnimation NOK' + response.data.errors);
			console.log('createAnimation NOK');
			console.log(response);
		});
	}

	/**
	 * @return un tableau de 'promises' qui seront résolues dynamiquement
	 */
	function readAnimation() {
		// var animations = Animation.query().$promise.then(function(response){
		// console.log('callback read : ' + JSON.stringify(response));
		// });
		var animations = Animation.query();
		return animations;
	}

	function ajouterAnimation() {
		console.log('ajout avant $http animations=' + vm.animations.length);
		// var animation = {
		// nom : vm.nom,
		// descr : vm.descr
		// };
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
							console.log('ajout ok avant push animations='
									+ vm.animations.length);
							vm.animations.push(vm.animation);
							// vm.listerAnimations();
							console.log('ajout ok animations='
									+ vm.animations.length);
						},
						function(response) {
							var data = response.data, status = response.status, header = response.header, config = response.config;
							console.log(data.errors);
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
			url : '/brest2016/rest/animation.json'
		}).then(
		// callback asynchrone: serat executé /apres/ le reour de la fonction
		function(response) {
			// on rempli le tableau animations
			// on ne peut pas ecrire "animations = response.data"
			// car animation serait déréférencé et nom visible dans le retour de
			// la fonction
			response.data.forEach(function(item) {
				animations.push(item);
			});
			console.log("nb animations =" + animations.length);

		})
		// la fonction retourne un tableau vide
		// mais le callback 'then' le remplira plus tard
		return animations;

		// ca marche, mais c'est pas simple (promise ici ... )
		// AnimationService.listerAnimations().then(function(data) {
		// vm.animations = data;
		// console.log(data);
		// });
		// console.log('fait');
	}
}
