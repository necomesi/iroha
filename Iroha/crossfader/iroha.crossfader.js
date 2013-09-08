/*! "iroha.crossfader.js" | Iroha.Crossfader - Necomesi JS Library | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       クロスフェードなトランジション
 *       (charset : "UTF-8")
 *
 *    @version 3.03.20130908
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.fontSizeObserver.js  (optional)
 */
/* -------------------------------------------------------------------------- */
(function($, window, document) {



/* -------------------- jQuery.fn : Iroha_Crossfader -------------------- */
/**
 * Iroha.Crossfader as jQuery plugin
 * @exports $.fn.Iroha_Crossfader as jQuery.fn.Iroha_Crossfader
 * @param {Iroha.Crossfader.Setting} [setting]    setting object for the instance
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_Crossfader = function(setting) {
	return this.each(function() { Iroha.Crossfader.create(this, setting) });
}



/* -------------------- Class : Iroha.Crossfader -------------------- */
/**
 * crossfader behavior controller.
 * @class crossfader behavior controller
 * @extends Iroha.Observable
 */
Iroha.Crossfader = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);
	
	/**
	 * settings for this instance
	 * @type Iroha.Crossfader.Setting */
	this.setting = undefined;
	
	/**
	 * jQuery object indicating base element of this instance.
	 * @type jQuery
	 * @private
	 */
	this.$node = $();
	
	/**
	 * jQuery object indicating container element ot the content-units.
	 * @type jQuery
	 * @private
	 */
	this.$group = $();
	
	/**
	 * jQuery object indicating the content-unit elements which are switched.
	 * @type jQuery
	 * @private
	 */
	this.$units = $();
	
	/**
	 * jQuery object indicating the element nodes which are switched with crossfade.
	 * @type jQuery
	 * @private
	 */
	this.$selectBtn = $();
	
	/**
	 * an array of instances of prev buttons.
	 * @type jQuery
	 * @private
	 */
	this.$prevBtn = $();
	
	/**
	 * an array of instances of next buttons.
	 * @type jQuery
	 * @private
	 */
	this.$nextBtn = $();
	
	/**
	 * index number of currently selected content-unit.
	 * @type Number
	 * @private
	 */
	this.index = -1;
	
	/**
	 * an array of the content-units elements reverse-sorted by z-order.
	 * @type Element[]
	 * @private
	 */
	this.order = [];
	
	/**
	 * duration (ms) for crossfade transision.
	 * @type Number
	 * @private
	 */
	this.duration = 1000;
	
	/**
	 * interval (ms) for switching.
	 * @type Number
	 * @private
	 */
	this.interval = 1000 + 3000;
	
	/**
	 * interval timer to control rotation
	 * @type Iroha.Interval
	 * @private
	 */
	this.timer = undefined;
};

Iroha.ViewClass(Iroha.Crossfader).extend(Iroha.Observable);

$.extend(Iroha.Crossfader,
/** @lends Iroha.Crossfader */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode'  : CrossFader の基底要素ノードであることを示す。
	 *   - 'enabled'   : CrossFader が適用されたことを示す（基底要素ノード）
	 *   - 'discarded' : CrossFader が適用されたが適用する意味がなかったことを示す（基底要素ノード）
	 *   - 'selected'  : 選択状態を示す（選択ボタンの要素ノード）
	 *   - 'disabled'  : 選択不可状態を示す（選択ボタンの要素ノード）
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode'  : 'iroha-crossfader'
		, 'enabled'   : 'iroha-crossfader-enabled'
		, 'discarded' : 'iroha-crossfader-discarded'
		, 'selected'  : 'iroha-crossfader-selected'
		, 'disabled'  : 'iroha-crossfader-disabled'
	}
});

$.extend(Iroha.Crossfader.prototype,
/** @lends Iroha.Crossfader.prototype */
{
	/**
	 * initialize
	 * @param {Element|jQuery|String}   node         a base element node for the instance
	 * @param {Iroha.Crossfader.Setting} [setting]    setting object for the instance
	 * @return this instance
	 * @type Iroha.Crossfader
	 * @private
	 */
	init : function(node, setting) {
		this.setting    = $.extend(Iroha.Crossfader.Setting.create(), setting);
		this.$node      = $(node).eq(0);
		this.$group     = this.$node.find(this.setting.group    );
		this.$units     = this.$node.find(this.setting.units    );
		this.$selectBtn = this.$node.find(this.setting.selectBtn);
		this.$prevBtn   = this.$node.find(this.setting.prevBtn  );
		this.$nextBtn   = this.$node.find(this.setting.nextBtn  );
		this.index      = -1;
		this.order      = this.$units.get();
		this.duration   = this.setting.duration;
		this.interval   = this.setting.duration + this.setting.interval;
		this.timer      = undefined;
		
		var cname = this.constructor.CLASSNAME;
		
		switch (this.$units.length) {
			case 0 :
				break;
			case 1 :
				this.index = 0;
				this.$node.addClass([ cname.baseNode, cname.enabled, cname.discarded ].join(' '));
				break;
			default :
				this.$node.addClass([ cname.baseNode, cname.enabled ].join(' '));
				
				// hide blocks to prepare fade-in effect.
				this.$units.hide();
				
				// adjust height on changing displaying fontsize of the browser
				if (Iroha.FontSizeObserver) {
					Iroha.FontSizeObserver.init().addCallback('onChange', this.flatHeights, this);
				}
				
				// setup prev buttons
				this.$prevBtn.click($.proxy(function(e) {
					e.preventDefault();
					e.currentTarget.blur();
					if (!this.$prevBtn.hasClass(cname.disabled)) {
						this.prev();
					}
				}, this));
				
				// setup next buttons
				this.$nextBtn.click($.proxy(function(e) {
					e.preventDefault();
					e.currentTarget.blur();
					if (!this.$nextBtn.hasClass(cname.disabled)) {
						this.next();
					}
				}, this));
				
				// setup control buttons
				this.$selectBtn
					.each (function(i) { $(this).data('Iroha.Crossfader.Button', i) })
					.click($.proxy(function(e) {
						e.preventDefault();
						this.select($(e.currentTarget).blur().data('Iroha.Crossfader.Button'));
					}, this));
				
				// flatten heights to start rotation. 
				this.flatHeights(0);
	
				// auto start rotation
				this.setting.autoStart && this.start('immediate');
	
				break;
		}
		return this;
	},
	
	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		this.timer && this.timer.clear();
		
		this.constructor.disposeInstance(this);
	},
	
	/**
	 * start rotation
	 * @param {Boolean|String} [immediate]    if true or "immediate", crossfader switches to next content-unit immediately
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	start : function(immediate) {
		if (!this.timer) {
			this.stop().startTimer();
			if (immediate === true || immediate === 'immediate') {
				this.next();
			}
		}
		return this;
	},
	
	/**
	 * set interval timer which controls image switching periodically.
	 * @return this instance
	 * @type Iroha.Crossfader
	 * @private
	 */
	startTimer : function() {
		this.timer = new Iroha.Interval(this.next, this.interval, this);
		return this;
	},
	
	/**
	 * stop rotation
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	stop : function() {
		if (this.timer) {
			this.timer.clear();
			this.timer = null;
		}
		return this;
	},
	
	/**
	 * switch to specified content-unit
	 * @param {Number} [index=0]    index number to select; "-1" means "unselect all".
	 * @param {Number} [duration]   animation duration
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	select : function(index, duration) {
		var cname     = this.constructor.CLASSNAME;
		var isRunning = Boolean(this.timer);
		var index     = Math.max(index, -1) || 0;
		var unit      = this.$units.get(index);
		var duration  = duration >= 0 ? duration : this.duration;
		var endless   = this.setting.endless;
		
		if (index == -1 || index != this.index) {
			this.stop();
			
			// enable/disable buttons
			this.$selectBtn.removeClass(cname.selected).eq(index).toggleClass(cname.selected, index != -1);
			this.$prevBtn  .toggleClass(cname.disabled, !endless && index == 0);
			this.$nextBtn  .toggleClass(cname.disabled, !endless && index == this.$units.size() - 1);
			
			if (index == -1) {
				// fadeout units
				$(this.order[0]).stop().show().fadeTo(duration, 0, function() { $(this).hide() });
			} else {
				// reorder units and fade in.
				this.order.unshift(this.order.splice(this.order.indexOf(unit), 1)[0]);
				this.order.reverse().forEach(function(node, i) { $(node).css('z-index', i + 1) });
				this.order.reverse();
				$(this.order[0]).stop(false, true).hide().fadeTo(duration, 1);
				if (this.index != -1) {
					$(this.order[1]).stop(false, true).show().fadeTo(duration, 0, function() { $(this).hide() });
				}
			}
			
			this.index = index;
			
			// postprocess
			if (isRunning) {
				this.startTimer();
			}
			this.doCallback('onSelect', index);
		}
		return this;
	},
	
	/**
	 * unselect all content-unit
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	unselect : function(index) {
		return this.select(-1);
	},
	
	/**
	 * switch to previous content-unit
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	prev : function() {
		var index = this.index - 1;
		if (index < 0) {
			index = this.$units.size() - 1;
		}
		this.select(index);
		return this;
	},
	
	/**
	 * switch to next content-unit
	 * @return this instance
	 * @type Iroha.Crossfader
	 */
	next : function() {
		var index = this.index + 1;
		if (!this.$units.get(index)) {
			index = 0;
		}
		this.select(index);
		return this;
	},
	
	/**
	 * flat all height of pages to max height of the pages.
	 * @param {Number} [duration=500]    duration of animation
	 * @return this instance
	 * @type Iroha.Crossfader
	 * @private
	 */
	flatHeights : function(duration) {
			duration = (duration >= 0) ? duration : 500;
		var $node    = this.$group;
		var current  = $node.height();
		var target   = this.$units
		               	.map (function() { return $(this).height() })
		               	.sort(function(a, b) { return a < b })[0];
		var callback = $.proxy(function() {
			this.$node.hide().show();
		}, this);
		$node.height(current).stop().animate({ 'height' : target }, duration, 'swing', callback);
	
		return this;
	}
});


/* -------------------- Class : Iroha.Crossfader.Setting -------------------- */
/**
 * setting data object for {@link Iroha.Crossfader}
 * @class setting data object for {@link Iroha.Crossfader}
 */
Iroha.Crossfader.Setting = function() {
	/**
	 * if true, autostart switching with crossfade effect.
	 * @type Boolean
	 */
	this.autoStart = true;
	
	/**
	 * interval (ms) for switching.
	 * @type Number
	 */
	this.interval = 5000;
	
	/**
	 * duration (ms) for crossfade transision.
	 * @type Number
	 */
	this.duration = 1000;
	
	/**
	 * flag to enable "endress mode".
	 * @type Boolean
	 */
	this.endless = false;
	
	/**
	 * an expression to find grouping block element which contains content-units elements.
	 * @type String
	 */
	this.group = '.iroha-crossfader-group';
	
	/**
	 * an expression to find content-unit elements.
	 * @type String
	 */
	this.units = '.iroha-crossfader-unit';
	
	/**
	 * an expression to find buttons to select previous unit.
	 * @type String
	 */
	this.prevBtn = '.iroha-crossfader-prev-btn';
	
	/**
	 * an expression to find buttons to select next unit.
	 * @type String
	 */
	this.nextBtn = '.iroha-crossfader-next-btn';
	
	/**
	 * an expression to find buttons to select one unit directry.
	 * @type String
	 */
	this.selectBtn = '.iroha-crossfader-select-btn';
};

/**
 * create an instance and return.
 * @type Iroha.Crossfader.Setting
 */
Iroha.Crossfader.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Crossfader}
 * @name Iroha.Crossfader.Callback
 * @namespace callback functions for {@link Iroha.Crossfader}
 */
/**
 * a callback for when changed current displaying content-unit
 * @name Iroha.Crossfader.Callback.onSelect
 * @function
 * @param {Number} index    index number of current displaying content-unit
 */



})(Iroha.jQuery, window, document);