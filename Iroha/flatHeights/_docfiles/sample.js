/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.FlatHeights.
 *
 *    @version 3.0.20120405
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.flatHeights.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	$('button')
		.live('click', function() {
			var $btn = $(this).attr('disabled', true);
			var code = $btn.parent().prev('pre').text();
			$.globalEval(code);
		});
});



})(Iroha.jQuery);