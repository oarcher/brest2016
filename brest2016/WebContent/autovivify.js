/**
 * http://usejsdoc.org/
 */

/**
 * autovivication.Le mieux aurait été d'utiliser
 * http://stackoverflow.com/questions/17197430/is-it-possible-to-create-a-new-type-that-is-more-dynamic/17197858#17197858
 * mais ca n'est pas entierement supporté par google chrome 
 * (il faut "Experimental JavaScript" )
 */


/**
 * set_property : permet une sorte d'autovification comme en perl: création des
 * propriétés undefined a la volée
 * http://stackoverflow.com/questions/17643965/automatically-create-object-if-undefined
 * var o = {} add_property(o, 'foo.bar.baz', 12) o.foo.bar.baz = 12
 */
function set_property(object, key, value) {
	// var orig_object = object;
	var keys = key.split('.');
	for (var i = 0; i < keys.length - 1; i++) {
		var k = keys[i];
		if (!object.hasOwnProperty(k)) {
			console.log('create property ' + k);
			object[k] = {};
			// object = object[k];
		}
		object = object[k];
	}
	console.log('keys.slice(-1)= ' + keys.slice(-1));
	object[keys.slice(-1)] = value;
	// return orig_object;
}

function get_property(object, key) {
	// var orig_object = object;
	// console.log('get_property ' + key + ' for ' + JSON.stringify(object));
	var keys = key.split('.');
	for (var i = 0; i < keys.length; i++) {
		var k = keys[i];
		if (object.hasOwnProperty(k)) {
			console.log('get key ' + k);
			object = object[k];
		} else {
			return undefined;
		}
	}
	return object;
}

function delete_property(object, key) {
	// var orig_object = object;
	console.log('delete_property ' + key + ' for ' + JSON.stringify(object));
	var keys = key.split('.');
	for (var i = 0; i < keys.length - 1; i++) {
		var k = keys[i];
		if (object.hasOwnProperty(k)) {
			console.log('get key ' + k);
			object = object[k];
		}
	}

	delete object[keys.slice(-1)];
}
