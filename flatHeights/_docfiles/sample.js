/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.FlatHeights.
 *
 *    @version 3.01.20130313
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.flatHeights.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	$('button')
		.on('click', function() {
			var $btn = $(this).attr('disabled', true);
			var code = $btn.parent().prev('pre').text();
			$.globalEval(code);
		});
});



})(Iroha.jQuery);