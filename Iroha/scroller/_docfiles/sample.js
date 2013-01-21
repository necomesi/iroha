/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Scroller.
 *
 *    @version 1.1.20120221
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.scroller.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var $field   = $('#field');
	var scroller = new Iroha.Scroller($field);

	$field.find('button')
		.click(function(e) {
			e.stopPropagation();
			scroller.scrollToNode(this.id.replace('scrollTo-', '#'));
		});
});



})(Iroha.jQuery);