/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.InputPrompt
 *
 *    @version 2.0.20120327
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */



//Iroha.setValue('Iroha.settings.InputPrompt.autoSetup.enabled', true);

$(function() {
	Iroha.InputPrompt.autoSetup('div.example input:text, div.example textarea');
});


