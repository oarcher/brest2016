/**
 * http://usejsdoc.org/
 */

/**
 * Déclaration du module principal
 * Ce script ne fait que ca 
 * voir   https://github.com/johnpapa/angular-styleguide
 */


//'use strict';


angular.module('brest2016App', [
                                'ngResource', // pour $resource, un $http specailisé REST qui gere l'unwrap des templates promises
                                'ui.bootstrap',  // elements de menus + css facon twitter
                                ,'angular-growl', 'ngSanitize'  // growl messages popup
                                ]).config(function (growlProvider) {
    growlProvider.globalTimeToLive(9000);
    growlProvider.globalEnableHtml(true);
});
//angular.module('brest2016App', ['ngResource']);