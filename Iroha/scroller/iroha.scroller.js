/* -------------------------------------------------------------------------- */
/** 
 *    @fileoverview
 *       Smooth Scroller
 *
 *    @version 3.02.20121224
 *    @requires jquery.js
 *    @requires jquery.easing.js     (optional)
 *    @requires jquery.mousewheel.js (optional)
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- Class : Iroha.Scroller -------------------- */
/**
 * provide smooth scroll behavior to the scrollable block elements.
 * @class smooth scroller
 * @extends Iroha.Observable
 */
Iroha.Scroller = function() {
	/** element node to apply behavior
	    @type jQuery
	    @private */
	this.$node = $();
	
	/** X-distance from original destination of scrolling (px)
	    @type Number
	    @private */
	this.offsetX = 0;
	
	/** Y-distance from original destination of scrolling (px)
	    @type Number
	    @private */
	this.offsetY = 0;
	
	/** animation duration time (ms).
	    @type Number
	    @private */
	this.duration = 1000;
	
	/** easing function name existing in jQuery.easing
	    @type String
	    @private */
	this.easing = 'swing';
	
	/** an associative array { left, top } of last designated destination of scrolling.
	    @type Object
	    @private */
	this.destination = { left : 0, top : 0 };
	
	/** avaliability of "smart abort" feature; it can abort scrolling on mouse click, mouse wheel events.
	    @type Boolean */
	this.useSmartAbort = true;
	
	/** interval timer which handles scrolling animation (for page scrolling on mobile devices).
	    @type Iroha.Interval
	    @private */
	this.animeTimer = new Iroha.Interval;
	
	/** true if the scroller is currently running.
	    @type Boolean */
	this.busy = false;
};

Iroha.ViewClass(Iroha.Scroller).extend(Iroha.Observable);

$.extend(Iroha.Scroller.prototype,
/** @lends Iroha.Scroller.prototype */
{
	/**
	 * initialize.
	 * @param {Element|jQuery|String} node                 element to apply behavior
	 * @param {Number}                [offsetX=0]          X-distance from original destination of scrolling (px)
	 * @param {Number}                [offsetY=0]          Y-distance from original destination of scrolling (px)
	 * @param {Number}                [duration=1000]      animation duration (ms)
	 * @param {String}                [easing="swing"]     easing function name existing in jQuery.easing
	 * @param {Boolean}               [smartAbort=true]    avaliability of "smart abort" feature; it can abort scrolling on mouse click, mouse wheel events.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	init : function(node, offsetX, offsetY, duration, easing, smartAbort) {
		this.$node         = $(node).eq(0);
		this.offsetX       = Number(offsetX) || 0;
		this.offsetY       = Number(offsetY) || 0;
		this.duration      = (Number(duration) >= 0) ? Number(duration) : 1000;
		this.easing        = ($.easing[easing]) ? easing : 'swing';
		this.useSmartAbort = $.type(smartAbort) == 'boolean' ? smartAbort : true;;
	
		var $node = (this.$node.is('html, body')) ? $(document) : this.$node;
		this.destination = { left : this.$node.scrollLeft(), top : this.$node.scrollTop() };
		
		// workaround for when jquery.mousewheel.js is not loaded.
		$node.mousewheel || ($node.mousewheel = $.noop);
	
		// implements "smart abort" feature.
		var abort = $.proxy(function() { this.useSmartAbort && this.abort() }, this);
		$node.click(abort).mousewheel(abort);
		
		return this;
	},
	
	/**
	 * scroll to the specified coordinate.
	 * @param {Number} x             X-coordinate of the scroll destination (px)
	 * @param {Number} y             Y-coordinate of the scroll destination (px)
	 * @param {Number} [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollTo : function(x, y, duration) {
		if (isNaN(x) || isNaN(y)) {
			throw new TypeError('Iroha.Scroller.scrollTo: all arguments must be numbers.');
		} else {
			var zoom = 1;  // temporary, correct zoom ratio is needed for IE7...
			var maxX = Math.max(0, this.$node.prop('scrollWidth' ) - this.$node.prop('clientWidth' ));
			var maxY = Math.max(0, this.$node.prop('scrollHeight') - this.$node.prop('clientHeight'));
			duration = (Number(duration) >= 0) ? Number(duration) : this.duration;
	
			var $node = (Iroha.ua.isWebkit && this.$node.is('html')) ? $(document.body) : this.$node;
			var start = {
				  scrollLeft : $node.scrollLeft()
				, scrollTop  : $node.scrollTop()
			};
			var end = {
				  scrollLeft : Math.min(maxX, Math.max(0, Math.round((x + this.offsetX) * zoom)))
				, scrollTop  : Math.min(maxY, Math.max(0, Math.round((y + this.offsetY) * zoom)))
			};
			var options = {
				  duration : duration
				, easing   : this.easing
				, step     : $.proxy(this.step    , this)
				, complete : $.proxy(this.complete, this)
			};
			
			if (start.scrollLeft == end.scrollLeft && start.scrollTop == end.scrollTop) {
				this.doCallbackByName('onComplete').doCallbackByName('onDone');
			} else {
				this.abort();
				
				this.busy        = true;
				this.destination = { left : end.scrollLeft, top : end.scrollTop };
				this.doCallbackByName('onStart');
				
				// for PC browsers on all situation, and for overflow areas on mobile devices
				if (!Iroha.ua.isMobile || !$node.is('body')) {
					$node.animate(end, options);
				
				// for page scrolling on mobile devices...
				} else {
					var timer       = new Iroha.Timer;
					this.animeTimer = new Iroha.Interval(function() {
						var _elapsed = timer.getTime();
						var _easing  = $.easing[options.easing];
						var _newLeft = _easing(null, _elapsed, start.scrollLeft, end.scrollLeft - start.scrollLeft, duration);
						var _newTop  = _easing(null, _elapsed, start.scrollTop , end.scrollTop  - start.scrollTop , duration);
						window.scrollTo(_newLeft, _newTop);
						
						if (duration <= _elapsed) {
							window.scrollTo(end.scrollLeft, end.scrollTop);
							options.complete();
							this.animeTimer.clear();
						}
					}, 16, this);
				}
			}
		}
		return this;
	},
	
	/**
	 * scroll by relative value.
	 * @param {Number} [x=0]         relative value to scroll on X-axis (px)
	 * @param {Number} [y=0]         relative value to scroll on Y-axis (px)
	 * @param {Number} [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollBy : function(x, y, duration) {
		x = Number(x) || 0;
		y = Number(y) || 0;
		if (x != 0 || y != 0) {
			var $node = (Iroha.ua.isWebkit && this.$node.is('html')) ? $(document.body) : this.$node;
			this.scrollTo($node.scrollLeft() + x, $node.scrollTop() + y, duration);
		}
		return this;
	},
	
	/**
	 * scroll to the position of the specified element node.
	 * @param {Element|jQuery|String} node          an element as scroll destination
	 * @param {Number}                [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollToNode : function(node, duration) {
		var $base = this.$node;
		var $node = $(node);
		if ($node.parents().filter(function() { return (this == $base.get(0)) }).get(0)) {
			var basePos = $base.is('html, body') ? { left : 0, top : 0 } : $base.offset();
			var baseSrl = $base.is('html, body') ? { left : 0, top : 0 } : { left : $base.scrollLeft(), top : $base.scrollTop() };
			var nodePos = $node.offset();
			this.scrollTo(
				  nodePos.left + baseSrl.left - basePos.left + (Iroha.ua.isWebkit ? 4 : 0)
				, nodePos.top  + baseSrl.top  - basePos.top
				, duration
			);
		}
		return this;
	},
	
	/**
	 * get/set scroll positions;
	 * this works as getter when 0 arguments are given,
	 *   or works as setter when 2 arguments are given.
	 * @param {Number} [x]    (as setter) X-coordinate of the scroll destination (px)
	 * @param {Number} [y]    (as setter) Y-coordinate of the scroll destination (px)
	 * @return as getter : current scroll positions { left, top }
	 *         as setter : this instance
	 * @type Object|Iroha.Scroller
	 */
	scrollPos : function() {
		switch (arguments.length) {
			case 0  : return { left : this.$node.scrollLeft(), top : this.$node.scrollTop() };
			case 1  : throw new ReferenceError('Iroha.Scroller#scrollPos: 2 arguments are required in setter mode.');
			case 2  : this.scrollTo(arguments[0], arguments[1], 0);
			default : return this;
		}
	},
	
	/**
	 * callback func for scrolling
	 * @private
	 */
	step : function() {
		this.doCallbackByName('onScroll');
	},
	
	/**
	 * callback func for completed scrolling
	 * @private
	 */
	complete : function() {
		if (this.busy) {
			this.busy = false;
			this.doCallbackByName('onComplete').doCallbackByName('onDone');
		}
	},
	
	/**
	 * abort scrolling.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	abort : function() {
		if (this.busy) {
			this.busy = false;
			(Iroha.ua.isWebkit && this.$node.is('html') ? $(document.body) : this.$node).stop();
			this.animeTimer.clear();
			this.doCallbackByName('onAbort').doCallbackByName('onDone');
		}
		return this;
	},
	
	/**
	 * get status or, set enabled/disabled status of "smart abort" feature.
	 * @param {Boolean} [bool]    set enable/disable of the feature. if nonspecified, this method works as a getter.
	 * @return this instance or current status of the feature as boolean
	 * @type Iroha.Scroller|Boolean
	 */
	smartAbort : function(bool) {
		if (arguments.length == 0) {
			return this.useSmartAbort;
		} else {
			this.useSmartAbort = Boolean(bool);
			return this;
		}
	},
	
	/**
	 * process callback.
	 * @param {String} name    callback name (preferred to start with 'on')
	 * @return this instance
	 * @type BAJL.Scroller
	 * @private
	 */
	doCallbackByName : function(name) {
		this.doCallback(name, this.$node.scrollLeft(), this.$node.scrollTop(), this.destination.left, this.destination.top);
		return this;
	}
});



/* ============================== Static class : Iroha.PageScroller ============================== */
/**
 * page scroller; an instance of {@link Iroha.Scroller}.
 * @namespace page scroller
 * @type Iroha.Scroller
 */
Iroha.PageScroller = {
	/**
	 * initialize
	 * @param {Iroha.PageScroller.Setting} [setting]    setting object
	 * @return this object
	 * @type Iroha.PageScroller
	 */
	init : function(setting) {
		if (Iroha.alreadyApplied(arguments.callee)) return this;
		
		var settings   = $.extend(Iroha.PageScroller.Setting.create(), setting);
		
		var pageNode   = Iroha.ua.isQuirksMode ? document.body : document.documentElement;
		var scroller   = Iroha.Scroller.create(pageNode, settings.offsetX, settings.offsetY, settings.duration, settings.easing);
		var lastAnchor = null;
		
		// add event
		$(document).on('click', 'a, area', function(e) {
			var $anchor = $(this).filter(function() {
				var ignore = $(this).is(settings.ignore);
				var target = $(this).attr('target');
				return (!ignore && (!target || target == '_self'));
			});
			var $target = $anchor.Iroha_getLinkTarget();
			if ($target.length) {
				e.preventDefault();
				e.stopPropagation();
				$anchor.blur();
				scroller.scrollToNode($target);
				lastAnchor = $anchor.get(0);
			}
		});
	
		// add callbacks
		var callback = function(func, delFlag) {
			return function(x, y) {
				if (typeof func == 'function') func(x, y, lastAnchor);
				if (delFlag) lastAnchor = null;
			}
		};
		scroller.addCallback('onStart'   , callback(settings.onStart   , false));
		scroller.addCallback('onScroll'  , callback(settings.onScroll  , false));
		scroller.addCallback('onAbort'   , callback(settings.onAbort   , true ));
		scroller.addCallback('onComplete', callback(settings.onComplete, true ));
		scroller.addCallback('onDone'    , callback(settings.onDone    , true ));
		
		// replace Iroha.PageScroller with Iroha.Scroller instance.
		scroller.init = function() { return scroller };
		scroller.stop = function() { new Iroha.Timeout(scroller.abort, 1, scroller); return scroller };
		return (Iroha.PageScroller = scroller);
	}
};



/* -------------------- Class : Iroha.PageScroller.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PageScroller}
 * @class setting data object for {@link Iroha.PageScroller}
 */
Iroha.PageScroller.Setting = function() {
	/** X-distance from original destination of scrolling (px)
	    @type Number */
	this.offsetX     = 0;
	/** Y-distance from original destination of scrolling (px)
	    @type Number */
	this.offsetY     = 0;
	/** animation duration (ms)
	    @type Number */
	this.duration    = 1000;
	/** easing function name existing in jQuery.easing
	    @name String */
	this.easing      = 'easeInOutCubic';
	/** a jQuery object, an element node, a node list of elements, an array of element nodes, or an expression,
	    to specify an clicked element which doesn't start scrolling.
	    @type jQuery|Element|Element[]|NodeList|String */
	this.ignore      = '.iroha-pagescroller-ignore';
	/** a callback for when scrolling starts
	    @type Function */
	this.onStart     = function(x, y, lastAnchor) { };
	/** a callback for during scrolling continues
	    @type Function */
	this.onScroll    = function(x, y, lastAnchor) { };
	/** a callback for when scrolling is aborted
	    @type Function */
	this.onAbort     = function(x, y, lastAnchor) { };
	/** a callback for when scrolling is completed
	    @type Function */
	this.onComplete  = function(x, y, lastAnchor) {
		var B = Iroha.ua;
		if (lastAnchor && (B.isGecko || B.isIE || (B.isWebkit && B.version > 522))) {
			location.href = lastAnchor.href;
		}
	};
	/** a callback for when scrolling is completed, or aborted
	    @type Function */
	this.onDone      = function(x, y, lastAnchor) { };
};

/**
 * create an instance and return.
 * @type Iroha.Crossfader.Setting
 */
Iroha.PageScroller.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Scroller}
 * @name Iroha.Scroller.callback
 * @namespace callback functions for {@link Iroha.Scroller}
 */
/**
 * a callback for when scrolling starts
 * @name Iroha.Scroller.callback.onStart
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for during scrolling continues
 * @name Iroha.Scroller.callback.onScroll
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for when scrolling is aborted
 * @name Iroha.Scroller.callback.onAbort
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for when scrolling is completed
 * @name Iroha.Scroller.callback.onComplete
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */

/**
 * callback functions for {@link Iroha.PageScroller}
 * @name Iroha.PageScroller.callback
 * @namespace callback functions for {@link Iroha.PageScroller}
 */
/**
 * a callback for when scrolling starts
 * @name Iroha.PageScroller.callback.onStart
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for during scrolling continues
 * @name Iroha.PageScroller.callback.onScroll
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is aborted
 * @name Iroha.PageScroller.callback.onAbort
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is completed
 * @name Iroha.PageScroller.callback.onComplete
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is completed or aborted
 * @name Iroha.PageScroller.callback.onDone
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */



})(Iroha.jQuery);