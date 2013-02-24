/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Carousel.
 *
 *    @version 3.02.20121111
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.carousel.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var carousel = Iroha.Carousel.create('.iroha-carousel');
	
	// experimental
	carousel.useCssTranslate();
});



})(Iroha.jQuery);