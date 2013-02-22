/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Scroller.
 *
 *    @version 1.10.20130222
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.scroller.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	Iroha.PageScroller.init();
	
	var $field   = $('#field');
	var scroller = Iroha.Scroller.create($field);

	$field.find('button')
		.click(function(e) {
			e.stopPropagation();
			scroller.scrollToNode(this.id.replace('scrollTo-', '#'));
		});
});



})(Iroha.jQuery);