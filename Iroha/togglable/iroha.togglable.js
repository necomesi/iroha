/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       togglable opened/closed of the blocks.
 *       (charset : "UTF-8")
 *
 *    @version 3.02.20121217
 *    @requires jquery.js
 *    @requires jquery.easing.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- AutoSetup : Iroha.Togglable -------------------- */
//
// この由緒正しいレガシーコード、あとでなんとかしたい
//
//	$('a, area').live('click', function(e) {
//		if (Iroha.Togglable.getInstance(this)) return;
//		
//		// find a togglable block by using anchor link
//		var $button = $(this);
//		var $target = $button.Iroha_getLinkTarget().filter('.' + setting.className.target);
//		
//		// find togglable blocks by using relationship className
//		if (!$target.length) {
//			$button = $button.filter('.' + setting.className.button);
//			$target = Iroha.Togglable.getTargetByRelation($button);
//		}
//		
//		if ($target.length) {
//			// create controller instance
//			Iroha.Togglable.create($target, $button).toggle();
//			
//			// aware of default action of clicked anchor
//			e.preventDefault();
//			
//			// aware of a behavior of Iroha.PageScroller.
//			if (Iroha.PageScroller) {
//				Iroha.PageScroller.abort();
//				$button.focus().addClass(Iroha.getValue('Iroha.setting.PageScroller.ignore'));
//			}
//		}
//	});



/* -------------------- jQuery.fn : Iroha_Togglable -------------------- */
/**
 * Iroha.Togglable as jQuery plugin
 * @exports $.fn.Iroha_Togglable as jQuery.fn.Iroha_Togglable
 * @param {Element|jQuery|String} buttons           element node(s) as toggle buttons
 * @param {Number}                [duration=250]    animation duration time (ms)
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_Togglable = function(buttons, duration) {
	Iroha.Togglable.create(this, buttons, duration);
	return this;
};



/* -------------------- Class : Iroha.Togglable -------------------- */
/**
 * @class togglable blocks (and toggle buttons)
 * @extends Iroha.Observable
 */
Iroha.Togglable = function() {
	/**
	 * element node(s) as togglable blocks which is toggled open/close
	 *  @type jQuery
	 */
	this.$node = $();
	
	/**
	 * element node(s) as toggle buttons
	 *  @type jQuery
	 */
	this.$buttons = $();
	
	/**
	 * animation duration time (ms)
	 * @type Number
	 * @private
	 */
	this.duration = 250;
	
	/**
	 * true when the togglable blocks are opened.
	 * type Boolean
	 */
	this.opened = false;
	
	/**
	 * true during the opening/closing animation is ongoing.
	 * type Boolean
	 */
	this.busy = false;
};

Iroha.ViewClass(Iroha.Togglable).extend(Iroha.Observable);

$.extend(Iroha.Togglable,
/** @lends Iroha.Togglable */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'target'   : 'iroha-togglable'
		, 'button'   : 'iroha-togglable-button'
		, 'opened'   : 'iroha-togglable-opened'
		, 'closed'   : 'iroha-togglable-closed'
		, 'relation' : /^(iroha-togglable-.*)-related$/
	},

	/**
	 * get element nodes which is "togglable", by using an relationship className of a button element.
	 * @param {Element|jQuery|String} button    an element node as toggle-button
	 * @return element node(s) found
	 * @type jQuery
	 */
	getTogglableByRelation : function(button) {
		var $button = $(button).eq(0);
		if ($button.length == 0) {
			return $();
		} else {
			var cnames = $button.attr('class').split(' ');
			var regex  = this.CLASSNAME.relation;
			return (cnames.some(function(_) { return regex.test(_) }))
				? $('.' + RegExp.$1)
				: $();
		}
	}
});

$.extend(Iroha.Togglable.prototype,
/** @lends Iroha.Togglable.prototype */
{
	/**
	 * initialize
	 * @param {jQuery|Element|Element[]|NodeList|String} targets           element node(s) as togglable blocks which is toggled open/close
	 * @param {jQuery|Element|Element[]|NodeList|String} buttons           element node(s) as toggle buttons
	 * @param {Number}                                   [duration=250]    animation duration time (ms)
	 * @returns this instance
	 * @type Iroha.Togglable
	 * @private
	 */
	init : function(targets, buttons, duration) {
		var cname     = this.constructor.CLASSNAME;
		
		this.$node    = $(targets);
		this.$buttons = $(buttons);
		this.duration = duration >= 0 ? duration : 250;
		this.opened   = !this.$node.hasClass(cname.closed) && !this.$node.is(':hidden');
		
		this.addTarget(this.$node   );
		this.addButton(this.$buttons);
		
		return this;
	},
	
	/**
	 * add togglable blocks which is toggled open/close
	 * @param {jQuery|Element|Element[]|NodeList|String} targets    element node(s) as togglable blocks which is toggled open/close
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	addTarget : function(targets) {
		var cname       = this.constructor.CLASSNAME;
		var constructor = this.constructor;
		var dataKey     = constructor.key;
		this.$node      = this.$node.add(
		                  	$(targets)
		                  		.filter     (function() { return !constructor.getInstance(this) })
		                  		.data       (dataKey, this.$node.data(dataKey))
		                  		.addClass   (cname.target)
		                  		.toggleClass(cname.opened,  this.opened)
		                  		.toggleClass(cname.closed, !this.opened)
		                  );
		
		// show/hide targets
		this.$node.toggle(this.opened);
		
		return this;
	},
	
	/**
	 * add toggle button(s)
	 * @param {Element|jQuery|String} node    element node(s) as toggle buttons
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	addButton : function(buttons) {
		var cname       = this.constructor.CLASSNAME;
		var constructor = this.constructor;
		var dataKey     = constructor.key;
		this.$buttons   = this.$buttons.add(
		                  	$(buttons)
		                  		.filter     (function() { return !constructor.getInstance(this) })
		                  		.data       (dataKey, this.$node.data(dataKey))
		                  		.addClass   (cname.button)
		                  		.toggleClass(cname.opened,  this.opened)
		                  		.toggleClass(cname.closed, !this.opened)
		                  		.click      ($.proxy(function(e) { e.preventDefault(); this.toggle() }, this))
		                  	);
		return this;
	},
	
	/**
	 * open the togglable block(s) with animation.
	 * @param {Number}   [duration]       animation duration; if nonspecified, the default duration of this instance is used.
	 * @param {Function} [func]           callback function/method which is called when opening/closing animation is completed.
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in 'func'.
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	open : function(duration, aCallback, aThisObject) {
		if (!this.opened) {
			this.toggle.apply(this, arguments);
		}
		return this;
	},
	
	/**
	 * close the togglable block(s) with animation.
	 * @param {Number}   [duration]       animation duration; if nonspecified, the default duration of this instance is used.
	 * @param {Function} [func]           callback function/method which is called when opening/closing animation is completed.
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in 'func'.
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	close : function(duration, aCallback, aThisObject) {
		if (this.opened) {
			this.toggle.apply(this, arguments);
		}
		return this;
	},
	
	/**
	 * toggle opened/closed with animation.
	 * @param {Number}   [duration]       animation duration; if nonspecified, the default duration of this instance is used.
	 * @param {Function} [func]           callback function/method which is called when opening/closing animation is completed.
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in 'func'.
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	toggle : function(duration, aCallback, aThisObject) {
		this.busy    = true;
		this.opened  = !this.opened;
		var duration = duration >= 0 ? duration : this.duration;
		
		if ($.isFunction(aCallback)) {
			this.addCallback('onComplete', aCallback, aThisObject, 'disposable');
		}
		
		this.doCallback('beforeStart', this.opened, this);
		
		this.$node
			.each(function() {
				var $node = $(this);
				$node
					.data('Iroha.Togglable.Panel.cssWidth', $node.Iroha_getComputedStyle('width'))
					.filter(':hidden')
						.show()
						.width($node.width())
						.hide();
			})
			.slideToggle(duration, $.proxy(_postProcess, this));
		
		this.doCallback('onStart', this.opened, this);
		return this;
		
		function _postProcess(){
			new Iroha.Timeout(function() {
				var cname = this.constructor.CLASSNAME;
				
				this.addClass   (this.opened ? cname.opened : cname.closed);
				this.removeClass(this.opened ? cname.closed : cname.opened);
				this.busy = false;
				
				this.$node
					.each(function() {
						var $node = $(this);
						$node.css('width', $node.data('Iroha.Togglable.Panel.cssWidth'))
					})
				
				this.doCallback('onComplete', this.opened, this);
			}, 1, this);
		}
	},
	
	/**
	 * add className to constructional element nodes of thie instance.
	 * @param {String} [cname]    className to add.
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	addClass : function(cname) {
		this.$node   .addClass(cname);
		this.$buttons.addClass(cname);
		return this;
	},
	
	/**
	 * remove className from constructional element nodes of thie instance.
	 * @param {String} [cname]    className to remove.
	 * @returns this instance
	 * @type Iroha.Togglable
	 */
	removeClass : function(cname) {
		this.$node   .removeClass(cname);
		this.$buttons.removeClass(cname);
		return this;
	}
});



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Togglable}
 * @name Iroha.Togglable.callback
 * @namespace callback functions for {@link Iroha.Togglable}
 */
/**
 * a callback for when before opening/closeing.
 * @name Iroha.Togglable.callback.beforeStart
 * @function
 * @param {Boolean}         opening      true when the togglable block is going to be opened.
 * @param {Iroha.Togglable} togglable    Iroha.Togglable instance
 */
/**
 * a callback for when opening/closeing is started.
 * @name Iroha.Togglable.callback.onStart
 * @function
 * @param {Boolean}         opening      true when the togglable block is going to be opened.
 * @param {Iroha.Togglable} togglable    Iroha.Togglable instance
 */
/**
 * a callback for when opening/closeing is completed.
 * @name Iroha.Togglable.callback.onComplete
 * @function
 * @param {Boolean}         opened       true when the togglable block is currently opened.
 * @param {Iroha.Togglable} togglable    Iroha.Togglable instance
 */



})(Iroha.jQuery);