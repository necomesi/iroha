/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.DateSelect.
 *
 *    @version 1.00.20121111
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.dateSelect.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	$('select')
		.Iroha_DateSelect(
			  { range : { from : new Date('1972/05/04') }, descend : { year : true } }
			, function(date) { console.log(date) }
		)
})



})(Iroha.jQuery);