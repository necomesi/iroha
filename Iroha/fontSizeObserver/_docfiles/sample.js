/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample for font size observer.
 *
 *    @version 3.0.20120405
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.fontSizeObserver.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var observer = Iroha.FontSizeObserver.init();

	observer.addCallback('onChange', update);
	update(observer.getSize(), 0);

	function update(size, diff) {
		$('#example-display span')
			.empty()
			.eq(0).text(size).end()
			.eq(1).text((diff > 0 ? '+' : '') + diff);
	}
});



})(Iroha.jQuery);