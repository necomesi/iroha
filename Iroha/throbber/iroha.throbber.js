/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       throbber balloon.
 *
 *    @version 3.00.20120419
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.balloon.js
 *    @requires iroha.throbber.css
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- Class : Iroha.Throbber -------------------- */
/**
 * provides throbber balloon.
 * @class throbber balloon
 * @extends Iroha.Balloon
 * @param {Iroha.Balloon.setting} setting    throbber balloon setting object
 */
Iroha.Throbber = function() {
	/**
	 * animation effect setting
	 * @type Object
	 */
	this.effect = {
		/**
		 * duration duration time for show/hide animation (in millisecond)
		 * @type {Number}
		 * @memberOf Iroha.Throbber#effect
		 */
		  'duration' : 750
	};
};

Iroha.ViewClass(Iroha.Throbber).extend(Iroha.Balloon);

$.extend(Iroha.Throbber,
/** @lends Iroha.Balloon */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-balloon iroha-throbber',
	
	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {Iroha.Balloon.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : Iroha.Balloon.create
});

$.extend(Iroha.Throbber.prototype,
/** @lends Iroha.Throbber.prototype */
{
	/** @private */
	initSuper : Iroha.Balloon.prototype.init,
	
	/** @private */
	showSuper : Iroha.Balloon.prototype.show,
	
	/** @private */
	hideSuper : Iroha.Balloon.prototype.hide,
	
	/**
	 * initialize this throbber balloon
	 * @param {Iroha.Throbber.setting} setting    throbber balloon setting object
	 * @return this instance
	 * @type Iroha.Throbber
	 * @private
	 */
	init : function(setting) {
		var setting = $.extend(Iroha.Throbber.Setting.create(), setting);
		this.effect = setting.effect;
		this.initSuper(setting);
		this.hideSuper();
//		this.setPositionFixed();
		$(window).resize($.proxy(function(e) { this.isActive() && this.moveToCenter() }, this));
		
		return this;
	},
	
	/**
	 * show this balloon.
	 * @param {Number} [x]    X-coordinate to popup (px) (if nonspecified, the balloon is centered on X-axis)
	 * @param {Number} [y]    Y-coordinate to popup (px) (if nonspecified, the balloon is centered on Y-axis)
	 * @return this instance
	 * @type Iroha.Throbber
	 */
	show : function(x, y) {
		if (!this.isActive()) {
			this.showSuper(x, y);
			this.moveToCenter();
			
			var duration = this.effect.duration;
			this.$node.stop().hide().fadeTo(duration, 1);
		}
		return this;
	},
	
	/**
	 * hide this balloon.
	 * @return this instance
	 * @type Iroha.Throbber
	 */
	hide : function() {
		var duration = this.effect.duration;
		var callback = $.proxy(function() {
			this.moveTo(-10000, -10000);
			this.hideSuper();
		}, this);
	
		this.$node.stop().fadeTo(duration, 0, callback);
		return this;
	}
});


/* -------------------- Class : Iroha.Throbber.Setting -------------------- */
/**
 * setting data object for {@link Iroha.Throbber}.
 * @extend Iroha.Balloon.Setting
 */
Iroha.Throbber.Setting = function() {
	/**
	 * default content of the throbber balloon
	 * @type String
	 */
	this.content = '<img src="/path/to/throbber.gif" alt="" />Please wait...';
	
	/**
	 * animation effect setting
	 * @type Object
	 */
	this.effect = {
		/**
		 * duration duration time for show/hide animation (in millisecond)
		 * @type {Number}
		 * @memberOf Iroha.Throbber.Setting#effect
		 */
		  'duration' : 750
	};
};

Iroha.Throbber.Setting.prototype = new Iroha.Balloon.Setting;

/**
 * create an instance and return.
 * @type Iroha.Throbber.Setting
 */
Iroha.Throbber.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Throbber};
 * callback types are borrowed from {@link Iroha.Balloon}.
 * @name Iroha.Throbber.callback
 * @namespace callback functions for {@link Iroha.Throbber}
 */
/**
 * a callback for when the throbber is shown
 * @name Iroha.Throbber.callback.onShow
 * @function
 * @param {Iroha.Throbber.geometry} geom    an associative array of throbber geometry
 */
/**
 * a callback for when the throbber is moved position
 * @name Iroha.Throbber.callback.onMove
 * @function
 * @param {Iroha.Throbber.geometry} geom    an associative array of throbber geometry
 */
/**
 * a callback for when the throbber's size is changed
 * @name Iroha.Throbber.callback.onResize
 * @function
 * @param {Iroha.Throbber.geometry} geom    an associative array of throbber geometry
 */
/**
 * a callback for when the throbber is hidden
 * @name Iroha.Throbber.callback.onHide
 * @function
 * @param {Iroha.Throbber.geometry} geom    an associative array of throbber geometry
 */
/**
 * a callback for when the throbber's content is changed.
 * @name Iroha.Throbber.callback.onContentChange
 * @function
 * @param {Iroha.Throbber.geometry} geom    an associative array of throbber geometry
 */



})(Iroha.jQuery);