/**
 * Providing touch events as below:
 * - touch.flick
 * - touch.start
 * - touch.move
 * - touch.end
 *
 * Usage:
 * $('#elem').touchable().on('touch.flick', function (event, direction, session) {
 *     if (direction == 3) console.log('flicked left!');
 * });
 */

(function (window, document, $) {

	/**
	 * @param x
	 * @param y
	 * @constructor
	 */
	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * @constructor
	 */
	function TouchSession() {
		this.init();
	}

	var touchController;
	/** @define {Number} */
	TouchSession.DIR_UP = 0;
	/** @define {Number} */
	TouchSession.DIR_RIGHT = 1;
	/** @define {Number} */
	TouchSession.DIR_DOWN = 2;
	/** @define {Number} */
	TouchSession.DIR_LEFT = 3;

	/**
	 * @static
	 * @param e {Object} Event object
	 * @return {Point}
	 */
	TouchSession.getPointFromEvent_ = function (e) {
		var x, y;
		if ('touches' in e && typeof e.touches[0] !== 'undefined') {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = e.clientX;
			y = e.clientY;
		}
		return new Point(x, y);
	};

	/**
	 * initialize
	 */
	TouchSession.prototype.init = function () {
		this.touching = false;
		/** @type {Array<Point>} */
		this.points = [];
		/** @type {Array<Number>} */
		this.timestamps = [];
		this.$el = null;
		this.vx = 0;
		this.vy = 0;
		this.dx = 0;
		this.dy = 0;
	};

	/**
	 * @param e {Object} Event object
	 */
	TouchSession.prototype.add = function (e) {
		this.addPoint(TouchSession.getPointFromEvent_(e));
	};

	/**
	 * @param point {Point}
	 */
	TouchSession.prototype.addPoint = function (point) {
		this.points.push(point);
		this.timestamps.push(new Date().getTime());
		this.calc_();
	};

	/**
	 * @private
	 */
	TouchSession.prototype.calc_ = function () {
		var count = this.points.length;
		var lp = this.getLatestPoint();
		var before5, pointbefore5, bunbo, first;
		if (count > 1) {
			before5 = Math.max(0, count - 5);
			pointbefore5 = this.points[before5];
			bunbo = (this.getLatestTimestamp() - this.timestamps[before5]) / 1000;
			this.vx = (lp.x - pointbefore5.x) / bunbo;
			this.vy = (lp.y - pointbefore5.y) / bunbo;
		}
		if (count >= 1) {
			first = this.points[0];
			this.dx = lp.x - first.x;
			this.dy = lp.y - first.y;
		}
	};

	TouchSession.prototype.end = function () {
		this.touching = false;
	};

	/**
	 * @return {Point}
	 */
	TouchSession.prototype.getLatestPoint = function () {
		return this.points[this.points.length - 1];
	};

	/**
	 * @return {Number}
	 */
	TouchSession.prototype.getLatestTimestamp = function () {
		return this.timestamps[this.timestamps.length - 1];
	};

	touchController = (function () {

		var touchSession = new TouchSession();
		var supportTouch = 'ontouchstart' in window;
		var startEvent = supportTouch ? 'touchstart' : 'mousedown';
		var moveEvent = supportTouch ? 'touchmove' : 'mousemove';
		var endEvent = supportTouch ? 'touchend' : 'mouseup';

		var thresholdVelocity = 300;

		function TouchController() {
		}

		/**
		 * @param elem
		 */
		TouchController.prototype.register = function (elem) {
			if (touchSession === null) {
				touchSession = new TouchSession();
			}
			elem.addEventListener(startEvent, this, false);
			elem.addEventListener(moveEvent, this, false);
			elem.addEventListener(endEvent, this, false);
		};

		/**
		 * @param e
		 */
		TouchController.prototype.handleEvent = function (e) {
			switch (e.type) {
				case startEvent:
					this.touchStart_(e);
					break;
				case moveEvent:
					this.touchMove_(e);
					break;
				case endEvent:
					this.touchEnd_(e);
					break;
			}
		};

		/**
		 * @param e
		 * @private
		 */
		TouchController.prototype.touchStart_ = function (e) {
			if (!touchSession.touching) {
				touchSession.init();
				touchSession.touching = true;
				touchSession.$el = $(e.target);
				touchSession.$el.trigger('touch.start', [TouchSession.getPointFromEvent_(e), touchSession]);
			}
		};

		/**
		 * @param e
		 */
		TouchController.prototype.touchMove_ = function (e) {
			if (touchSession.touching) {
				touchSession.add(e);
				touchSession.$el.trigger('touch.move', [TouchSession.getPointFromEvent_(e), touchSession]);
				e.preventDefault();
			}
		};

		/**
		 * @param e
		 */
		TouchController.prototype.touchEnd_ = function (e) {
			var vx = touchSession.vx;
			var vy = touchSession.vy;
			var ratio = vy === 0 ? Infinity : (vx * vx) / (vy * vy);

			// flick up
			if (vy < -thresholdVelocity && ratio < .25) {
				touchSession.$el.trigger('touch.flick', [TouchSession.DIR_UP, touchSession]);
			}
			// flick right
			else if (vx > thresholdVelocity && ratio > 4) {
				touchSession.$el.trigger('touch.flick', [TouchSession.DIR_RIGHT, touchSession]);
			}
			// flick down
			else if (vy > thresholdVelocity && ratio < .25) {
				touchSession.$el.trigger('touch.flick', [TouchSession.DIR_DOWN, touchSession]);
			}
			// flick left
			else if (vx < -thresholdVelocity && ratio > 4) {
				touchSession.$el.trigger('touch.flick', [TouchSession.DIR_LEFT, touchSession]);
			}
			touchSession.end();
			touchSession.$el.trigger('touch.end', [TouchSession.getPointFromEvent_(e), touchSession]);
		};

		return new TouchController();
	})();

//	/**
//	 * Make throttled function (unused)
//	 * @param func
//	 * @param wait
//	 * @return {Function}
//	 */
//	function throttle(func, wait) {
//		var prev = new Date;
//		return function () {
//			var now = new Date;
//			if (now - prev > wait) {
//				prev = now;
//				func.apply(this, arguments);
//			}
//		};
//	}

	$.fn.touchable = function () {
		this.each(function () {
			touchController.register($(this).get(0));
		});
		return this;
	};

	/* EXPORT */
	window.TouchSession = TouchSession;

}(window, document, jQuery));