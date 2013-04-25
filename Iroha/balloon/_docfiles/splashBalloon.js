/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Splash balloon (sample script for BAJL.Balloon).
 *
 *    @version 1.4.20120221
 *    @requires jquery.js
 *    @requires bajl.js
 *    @requires bajl.balloon.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var timer   = null;
	var balloon = new BAJL.Balloon({
		  id         : 'bajl-splash-balloon'
		, content    : '<h1>BAJL.Balloon v2.0</h1><p>click this balloon to start/stop moving</p>'
		, posX       : 10000000
		, posY       : 0
		, offsetX    : 0
		, offsetY    : 0
		, posReviseX : true
		, posReviseY : true
		, ignoreX    : true
		, ignoreY    : true
	});

	balloon.show();
	startMoving();
	$('#bajl-splash-balloon').click(toggleMoving);

	function toggleMoving() {
		if (timer) stopMoving ();
		else       startMoving();
	}

	function startMoving() {
		timer = new BAJL.Interval(function() { balloon.moveBy(0, 2) }, 50);
	}

	function stopMoving() {
		timer.clear();
		timer = null;
	}
});



})(BAJL.jQuery);