/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.PseudoMenu, Iroha.PseudoSelectMenu
 *       (charset : "UTF-8")
 *
 *    @version 1.00.20130517
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.pseudoMenu.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



$(function() {
	$('select').Iroha_PseudoSelectMenu();
});



})(Iroha.$, Iroha, window, document);