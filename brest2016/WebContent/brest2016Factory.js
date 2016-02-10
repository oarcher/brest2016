/**
 * http://usejsdoc.org/
 */

// (function() {
// 'use strict';

/**
 * $resource logique CRUD:
 * 
 * get()  Read, (par id)
 * query() Read, (tout)
 * save() Create 
 * remove()
 * delete()
 * 
 * 
 * 
 */

angular.module('brest2016App').factory('Animation', function($resource) {
	// TODO ? voir http://www.codeproject.com/Tips/891279/CRUD-Operations-with-resource
	// pour les redifinitions de methode
	return $resource('/brest2016/rest/animation.json', {}, {
        query: { method: "GET", isArray: true },
        create: { method: "POST" }
	}); // Note the full endpoint address
});

// })();
