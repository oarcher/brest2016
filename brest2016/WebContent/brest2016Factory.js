/**
 * http://usejsdoc.org/
 */

//(function() {
//	'use strict';

	angular.module('brest2016App')
			.factory('AnimationFactory', animationFactory);

	function animationFactory() {
		alert('factory');
		return {
			salut : function salut() {
				alert('salut factory');
				return "salut factory";
			}
		}

	}

//})();