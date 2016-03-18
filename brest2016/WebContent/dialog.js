/**
 * http://usejsdoc.org/
 */

(function() {
	'use strict';
	/**
	 * Gestion des boites de dialogues modales voir doc
	 * https://angular-ui.github.io/bootstrap/
	 * 
	 */

	angular.module('brest2016App').service('dialog', dialogService);

	function dialogService($uibModal) {
		console.log('dialog service');
		this.confirm = confirm;
		this.alert = alert;
		
		/**
		 * boite de dialogue modal https://angular-ui.github.io/bootstrap/
		 */
		
		function confirm(message,config){
			var defaultConfig = {
					templateUrl : "/brest2016/ng-template/confirm.html",
					resolve : {
						message : function() {
							return message;
						}
					}
			};
			return open($.extend(true,{},defaultConfig,config));
			
		}
		
		function alert(message,config){
			var defaultConfig = {
					templateUrl : "/brest2016/ng-template/alert.html",
					resolve : {
						message : function() {
							return message;
						}
					}
			};
			return open($.extend(true,{},defaultConfig,config));
		}
		
		
		
		
		function open(config) {
			var defaultConfig = {
					animation : true,
					controller : dialogControler,
					controllerAs : 'ctrl',
					size : 'sm',
			};
			
			return $uibModal.open($.extend(true,{},defaultConfig,config)).result;
			
			

//						var modalInstance = $uibModal.open($.extend(true, {}, defaultConfig, config));
//
//			modalInstance.result.then(function(ok) {
//				console.log("modal return ok");
//				return ok;
//			}, function() {
//				return;
//			});

			/**
			 * les boites de dialogue modales on leur propre controler
			 * On peut le mettre dans un fichier séparé, 
			 * mais on peut aussi l'implémenter dans une fonction
			 */
			function dialogControler($uibModalInstance, message) {
				console.log("controleur modal: " + message);

				this.message = message;
				this.ok = ok;
				this.cancel = cancel;

				function ok() {
					$uibModalInstance.close(true);
				}

				function cancel() {
					$uibModalInstance.dismiss('cancel');
				}

			}
		}

	}

})();
