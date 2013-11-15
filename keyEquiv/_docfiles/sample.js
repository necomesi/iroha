/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.KeyEquiv.
 *
 *    @version 3.0.20121126
 *    @requires iroha.js
 *    @requires iroha.keyEquiv.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	Iroha.KeyEquiv.create()
		.addKey('$A', function(e, keys, names) {
			alert(Iroha.String('${0}\n${1}  ("${2}")').format('Key input accepted!', names.join(' + '), keys));
		});
});



})(Iroha.jQuery);