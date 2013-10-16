/*! "iroha.balloon.js" | Iroha - Necomesi JSLib : Balloon (Floating Layer) | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Balloon (Floating Layer)
 *
 *    @version 3.03.20131016
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.balloon.css
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- Class : Iroha.Balloon -------------------- */
/**
 * balloon (typically known as floating layer).
 * @class balloon (typically known as floating layer).
 * @extends Iroha.Observable
 */
Iroha.Balloon = function() {
	/** base node of the balloon
	    @type jQuery */
	this.$node = $();

	/** content body node in the balloon.
	    @type jQuery
	    @private */
	this.$body = $();

	/** flag of activity of the balloon
	    @type Boolean
	    @private */
	this.active = false;

	/** flag of ballon's position is fixed or not.
	    @type Boolean
	    @private */
	this.isPosFixed = false;

	/** X-coordinate of the balloon (px)
	    @type Number
	    @private */
	this.posX = 0;

	/** Y-coordinate of the balloon (px)
	    @type Number
	    @private */
	this.posY = 0;

	/** X-distance from original balloon position (px)
	    @type Number
	    @private */
	this.offsetX = 0;

	/** Y-distance from original balloon position (px)
	    @type Number
	    @private */
	this.offsetY = 0;

	/** use position revising on X-axis?
	    @type Boolean
	    @private */
	this.posReviseX = false;

	/** use position revising on Y-axis?
	    @type Boolean
	    @private */
	this.posReviseY = false;

	/** ignore X-axis when {@link #moveToCenter} is called?
	    @type Boolean
	    @private */
	this.ignoreX = false;

	/** ignore Y-axis when {@link #moveToCenter} is called?
	    @type Boolean
	    @private */
	this.ignoreY = false;
};

Iroha.ViewClass(Iroha.Balloon).extend(Iroha.Observable);

$.extend(Iroha.Balloon,
/** @lends Iroha.Balloon */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-balloon',

	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {Iroha.Balloon.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : function(arg) {
		return this.getInstance(arg) || this.add(arg);
	}
});

$.extend(Iroha.Balloon.prototype,
/** @lends Iroha.Balloon.prototype */
{
	/**
	 * 初期化。
	 * @param {Iroha.Balloon.Setting} [setting]    設定オブジェクト
	 * @private
	 */
	init : function(setting) {
		var setting = $.extend(Iroha.Balloon.Setting.create(), setting);

		this.$node = $(document.createElement('ins'));
		this.$body = this.$node;
		this.hide();

		this.addClass     (this.constructor.BASE_CLASSNAME       );
		this.addClass     (setting.className                     );
		this.setId        (setting.id                            );
		this.applyTemplate(setting.template  , setting.bodyExpr  );
		this.addContent   (setting.content                       );
		this.appendTo     (setting.appendTo || document.body     );
		this.setOffset    (setting.offsetX   , setting.offsetY   );
		this.setPosRevise (setting.posReviseX, setting.posReviseY);
		this.moveTo       (setting.posX      , setting.posY      );
		this.moveToCenter (setting.ignoreX   , setting.ignoreY   );

		return this;
	},

	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		this.$node && this.$node.remove();

		this.constructor.disposeInstance(this);
	},

	/**
	 * get activity state of the balloon.
	 * @return true if the balloon is active (visible)
	 * @type Boolean
	 */
	isActive : function() {
		return this.active;
	},

	/**
	 * append the balloon base node to the specified element node.
	 * @param {jQuery|Element|String} target    expression of target element to append
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	appendTo : function(target) {
		if ($(target).length) {
			this.$node.appendTo(target);
			this.moveTo(0, 0);
			this.moveToCenter();
		}
		return this;
	},

	/**
	 * add specified class name to the base node of the balloon.
	 * @param {String} className     class name to add
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	addClass : function(className) {
		if (typeof className == 'string') {
			this.$node.addClass(className);
		}
		return this;
	},

	/**
	 * remove specified class name to the base node of the balloon.
	 * @param {String} className     class name to add
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	removeClass : function(className) {
		if (typeof className == 'string') {
			this.$node.removeClass(className);
		}
		return this;
	},

	/**
	 * set fragment-id to the base node of the balloon.
	 * @param {String} id    id-string to add
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	setId : function(id) {
		if (typeof id == 'string') {
			this.$node.attr('id', id);
		}
		return this;
	},

	/**
	 * set offset value (distance from original balloon position).
	 * @param {Number} [x]    offset on X-axis (px)
	 * @param {Number} [Y]    offset on Y-axis (px)
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	setOffset : function(x, y) {
		if (typeof x == 'number') this.offsetX = x;
		if (typeof y == 'number') this.offsetY = y;
		this.moveTo(); // revise position if if necessary.
		return this;
	},

	/**
	 * set position revisiong setting.
	 * @param {Boolean} [x]    if true, it uses X-axis when position revising
	 * @param {Boolean} [Y]    if true, it uses Y-axis when position revising
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	setPosRevise : function(x, y) {
		if (typeof x == 'boolean') this.posReviseX = x;
		if (typeof y == 'boolean') this.posReviseY = y;
		this.moveTo(); // revise position if if necessary.
		return this;
	},

	/**
	 * make the balloon's position to be fixed, and provides the way to ignore position-fix at X-scrolling and Y-scrolling.
	 * with feature of ignoring position-fix at X or Y axis, and hiding block during scrolling.
	 * @param {Boolean} [ignoreX]     if true, don't fix the position at X-scrolling
	 * @param {Boolean} [ignoreY]     if true, don't fix the position at Y-scrolling
	 * @param {Boolean} [autoHide]    if true, hide position-fixed block during scrolling
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	setPositionFixed : function(ignoreX, ignoreY, autoHide) {
		this.isPosFixed = true;

		//
		//
		// あとで何か書く
		//
		//

		return this;
	},

	/**
	 * apply template to the balloon.
	 * @param {String} [template]    a template represented by HTML-string; if nonspecified, the template structure is removed from the balloon.
	 * @param {String} [bodyExpr]    an expression to find content body element in the teplate; this is required when the first argument is given.
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	applyTemplate : function(template, bodyExpr) {
		var $content = this.getContent();

		if (!template) {
			this.$body = this.$node.empty().append($content);
		} else if (!bodyExpr) {
			throw new Error('Iroha.Balloon#applyTemplate: 引数 "template" を与えた場合は同時に 引数 "bodyExpr" も必要です。');
		} else if ($(document.createElement('ins')).append(template).find(bodyExpr).length == 0) {
			throw new Error('Iroha.Balloon#applyTemplate: 引数 "bodyExpr" で示される要素ノードが "template" 内に存在しないようです。');
		} else {
			this.$body = this.$node.empty().append(template).find(bodyExpr).append($content);
		}

		return this;
	},

	/**
	 * get content of the balloon.
	 * @return jQuery object which contains element nodes in this balloon.
	 * @type jQuery
	 */
	getContent : function() {
		return this.$body.contents();
	},

	/**
	 * set content of the balloon.
	 * @param {NodeList|Element|Element[]|jQuery|String} [content]    content to add to balloon
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	setContent : function(content) {
		return this.clearContent(true).addContent(content);
	},

	/**
	 * add content to the balloon.
	 * @param {NodeList|Element|Element[]|jQuery|String} [content]    content to add to balloon
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	addContent : function(content) {
		var before = this.getGeometry();
		this.$body.append(content);
		var after  = this.getGeometry();

		if (before.width != after.width || before.height != after.height) {
			this.doCallbackByName('onResize');
			this.moveTo(); // revise position if necessary.
		}

		this.doCallbackByName('onContentChange');
		return this;
	},

	/**
	 * remove all contents from the balloon.
	 * @param {Boolean} [noCallback]    if true, it doesn't callback.
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	clearContent : function(noCallback) {
		var hadContent = this.hasContent();
		this.$body.empty();

		if (!noCallback && hadContent) {
			this.doCallbackByName('onContentChange');
		}
		return this;
	},

	/**
	 * does the balloon the content (in the balloon body)?
	 * @return true if the balloon has the content (in the balloon body).
	 * @type Boolean
	 */
	hasContent : function() {
		return (this.getContent().length > 0);
	},

	/**
	 * get balloon geometry
	 * @return Iroha.Balloon.Geometry object.
	 * @type Iroha.Balloon.Geometry
	 */
	getGeometry : function() {
		return {
			  posX    : this.posX
			, posY    : this.posY
			, offsetX : this.offsetX
			, offsetY : this.offsetY
			, width   : this.$node.outerWidth()
			, height  : this.$node.outerHeight()
		};
	},

	/**
	 * show the balloon at specific coordinate.
	 * @param {Number} [x]    X-coordinate to popup (px) (posX prop value is used in the case of no appointment)
	 * @param {Number} [y]    Y-coordinate to popup (px) (posY prop value is used in the case of no appointment)
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	show : function(x, y) {
		this.moveTo(x, y);
		this.$node.css({ visibility : 'visible', display : 'block' });
		if (!this.active) {
			this.active = true;
			this.doCallbackByName('onShow');
		}
		return this;
	},

	/**
	 * resize the balloon.
	 * @param {Number} [width=-1]     new width  (border-box width ) of the balloon, 0 means 'auto', -1 means 'no change'
	 * @param {Number} [height=-1]    new height (border-box height) of the balloon, 0 means 'auto', -1 means 'no change'
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	resizeTo : function(width, height) {
		if (typeof width  != 'number') width  = -1;
		if (typeof height != 'number') height = -1;
		if (width  >= 0) this.$node.css('width' , width  == 0 ? 'auto' : width );
		if (height >= 0) this.$node.css('height', height == 0 ? 'auto' : height);

		var offsetWidth  = this.$node.outerWidth();
		var offsetHeight = this.$node.outerHeight();
		var reviseWidth  = (width  >= 0) ? 2 * width  - offsetWidth  : -1;
		var reviseHeight = (height >= 0) ? 2 * height - offsetHeight : -1;

		if (offsetWidth  != width  && reviseWidth  >= 0) this.$node.css('width' , reviseWidth );
		if (offsetHeight != height && reviseHeight >= 0) this.$node.css('height', reviseHeight);

		this.doCallbackByName('onResize');
		this.isActive() && this.moveTo(); // revise position if if necessary.

		return this;
	},

	/**
	 * move balloon a specified number of pixels relative to its current coordinates
	 * this method does not make the balloon shown.
	 * @param {Number} [x]    X-coordinate to move (px) (posX prop value is used in the case of no appointment)
	 * @param {Number} [y]    Y-coordinate to move (px) (posY prop value is used in the case of no appointment)
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	moveBy : function(x, y) {
		x = (typeof x == 'number') ? x : 0;
		y = (typeof y == 'number') ? y : 0;
		this.moveTo(this.posX + x, this.posY + y);
		return this;
	},

	/**
	 * move balloon to specified coordinates.
	 * this method does not make the balloon shown.
	 * @param {Number} [x]    X-coordinate to move (px) (posX prop value is used in the case of no appointment)
	 * @param {Number} [y]    Y-coordinate to move (px) (posY prop value is used in the case of no appointment)
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	moveTo : function(x, y) {
		var oldX = this.posX;
		var oldY = this.posY;
		if (typeof x == 'number') this.posX = x;
		if (typeof y == 'number') this.posY = y;

		this.revisePosition();

		this.$node.css('left', this.posX + this.offsetX);
		this.$node.css('top' , this.posY + this.offsetY);

		if (oldX != this.posX || oldY != this.posY) {
			this.doCallbackByName('onMove');
		}
		return this;
	},

	/**
	 * move balloon to center of the browser window.
	 * this method does not make the balloon shown.
	 * @param {Boolean} [ignoreX]    if true, ignore centering on X-axis
	 * @param {Boolean} [ignoreY]    if true, ignore centering on Y-axis
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	moveToCenter : function(ignoreX, ignoreY) {
		var geom = {};
		var base = this.$node.parent().get(0) || document.body;
		if (base === document.body) {
			geom = Iroha.getGeometry();
			geom = $.extend(null, geom, { parentW : geom.windowW, parentH : geom.windowH });
		} else {
			geom = { parentW : $(base).outerWidth(), parentH : $(base).outerHeight() };
		}

		if (typeof ignoreX == 'boolean') this.ignoreX = ignoreX;
		if (typeof ignoreY == 'boolean') this.ignoreY = ignoreY;

		var posX = (!this.ignoreX) ? (geom.parentW - this.$node.outerWidth ()) / 2 : this.posX; if (posX < 0) posX = 0;
		var posY = (!this.ignoreY) ? (geom.parentH - this.$node.outerHeight()) / 2 : this.posY; if (posY < 0) posY = 0;
		var scrX = (this.isPosFixed || !geom.scrollX) ? 0 : geom.scrollX;
		var scrY = (this.isPosFixed || !geom.scrollY) ? 0 : geom.scrollY;

		this.moveTo(posX + scrX, posY + scrY);
		return this;
	},

	/**
	 * reviseing the balloon position to be in the window frame.
	 * @private
	 */
	revisePosition : function() {
		if (this.posReviseX || this.posReviseY) {
			var geom       = Iroha.getGeometry();
			var MacIE      = (Iroha.ua.isIE     && Iroha.ua.isMac);
			var IE6        = (Iroha.ua.isIE     && Iroha.ua.documentMode <= 6 );
			var IE7        = (Iroha.ua.isIE     && Iroha.ua.documentMode == 7 );
			var IE8        = (Iroha.ua.isIE     && Iroha.ua.documentMode >= 8 );
			var Safari2    = (Iroha.ua.isSafari && Iroha.ua.version <  522);
			var edgeRight  = (IE7 || Safari2 || MacIE || geom.pageH <= geom.windowH) ? 0 : geom.scrollBar;
			var edgeBottom = (IE7 || Safari2 || MacIE || geom.pageW <= geom.windowW) ? 0 : geom.scrollBar;

			if (IE6 || IE8) {
				edgeRight   = geom.scrollBar + 4;
				edgeBottom += 4;
			}

			var offset  = this.$node.offsetParent().offset();
			var reviseX = (geom.windowW + geom.scrollX) - (offset.left + this.posX + this.offsetX + this.$node.outerWidth()  + edgeRight );
			var reviseY = (geom.windowH + geom.scrollY) - (offset.top  + this.posY + this.offsetY + this.$node.outerHeight() + edgeBottom);
			var posX    = (this.posX < geom.scrollX) ? geom.scrollX : this.posX + (reviseX < 0 ? reviseX : 0);
			var posY    = (this.posY < geom.scrollY) ? geom.scrollY : this.posY + (reviseY < 0 ? reviseY : 0);

			if (this.posReviseX) this.posX = posX;
			if (this.posReviseY) this.posY = posY;
		}
	},

	/**
	 * make the balloon hidden.
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	hide : function(){
//		this.$node.hide();
		this.$node.css({ visibility : 'hidden', display : 'block', left : '-10000px' });
		if (this.active) {
			this.active = false;
			this.doCallbackByName('onHide');
		}
		return this;
	},

	/**
	 * 表示・非表示を切り替え
	 * @param {Boolean} [showOrHide]    真偽値を与えることで、表示・非表示を明示的に選択する。
	 * @return Iroha.Balloon instance
	 * @type Iroha.Balloon
	 */
	toggle : function(showOrHide) {
		var bool = $.type(showOrHide) == 'undefined'
		           	? !this.active
		           	: Boolean(showOrHide);
		if (bool) this.show()
		     else this.hide();

		return this;
	},

	/**
	 * z-index 値を取得する、または設定する。
	 * @param {Number|String} [zIndex]    整数値、または "auto" を指定。無指定時は z-index 値を取得する getter として動作。
	 * @return 引数指定時：このインスタンス自身。引数無指定時：現在の z-index 値。
	 * @type Iroha.Balloon|Number
	 */
	zIndex : function(zIndex) {
		if (arguments.length == 0) {
			return Number(this.$node.css('zIndex')) || 1;
		} else {
			this.$node.css('zIndex', zIndex);
			return this;
		}
	},

	/**
	 * process callback.
	 * @param {String} name    callback name (preferred to start with 'on')
	 * @private
	 */
	doCallbackByName : function(name) {
		this.doCallback(name, this.getGeometry());
	}
});



/* -------------------- Class : Iroha.Balloon.Setting -------------------- */
/**
 * setting data object for {@link Iroha.Balloon}.
 */
Iroha.Balloon.Setting = function() {
	/**
	 * initial content of the balloon
	 * @type NodeList|Element|Element[]|jQuery|String
	 */
	this.content = '';

	/**
	 * an element where the balloon will be appended to.
	 * @type jQuery|Element|String
	 */
	this.appendTo = '';

	/**
	 * additional className of base node of the balloon
	 * @type String
	 */
	this.className = '';

	/**
	 * fragment-id of base node of the balloon
	 * @type String
	 */
	this.id = '';

	/**
	 * a template represented by HTML-string
	 * @type String
	 */
	this.template = '';

	/**
	 * an expression to find content body element in the teplate;
	 * this is required when the 'template' property is given.
	 * @type String
	 */
	this.bodyExpr = '';

	/**
	 * initial X-coordinate of the balloon (px)
	 * @type Number
	 */
	this.posX = 0;

	/**
	 * initial Y-coordinate of the balloon (px)
	 * @type Number
	 */
	this.posY = 0;

	/**
	 * X-distance from original balloon position (px)
	 * @type Number
	 */
	this.offsetX = 0;

	/**
	 * Y-distance from original balloon position (px)
	 * @type Number
	 */
	this.offsetY = 0;

	/**
	 * use position revising on X-axis?
	 * @type Boolean
	 */
	this.posReviseX = false;

	/**
	 * use position revising on Y-axis?
	 * @type Boolean
	 */
	this.posReviseY = false;

	/**
	 * ignore centering on X-axis?
	 * @type Boolean
	 */
	this.ignoreX = false;

	/**
	 * ignore centering on Y-axis?
	 * @type Boolean
	 */
	this.ignoreY = false;
};

/**
 * create an instance and return.
 * @type Iroha.Balloon.Setting
 */
Iroha.Balloon.Setting.create = function() {
	return new this;
};



/* -------------------- Class : Iroha.Balloon.Geometry -------------------- */
/**
 * @class an associative array of geometry of {@link Iroha.Balloon}
 */
Iroha.Balloon.Geometry = function() {
	/**
	 * X-coordinate of the balloon (px)
	 * @type Number
	 */
	this.posX = 0;

	/**
	 * Y-coordinate of the balloon (px)
	 * @type Number
	 */
	this.posY = 0;

	/**
	 * X-distance from original balloon position (px)
	 * @type Number
	 */
	this.offsetX = 0;

	/**
	 * Y-distance from original balloon position (px)
	 * @type Number
	 */
	this.offsetY = 0;

	/**
	 * width (border-box width) of the balloon (px)
	 * @type Number
	 */
	this.width = 0;

	/**
	 * height (border-box height) of the balloon (px)
	 * @type Number
	 */
	this.height = 0;
};

/**
 * create an instance and return.
 * @type Iroha.Balloon.Geometry
 */
Iroha.Balloon.Geometry.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */

/**
 * callback functions for {@link Iroha.Balloon}
 * @name Iroha.Balloon.callback
 * @namespace callback functions for {@link Iroha.Balloon}
 */
/**
 * a callback for when the balloon is shown
 * @name Iroha.Balloon.callback.onShow
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the balloon is moved position
 * @name Iroha.Balloon.callback.onMove
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the balloon's size is changed
 * @name Iroha.Balloon.callback.onResize
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the balloon is hidden
 * @name Iroha.Balloon.callback.onHide
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the balloon's content is changed.
 * @name Iroha.Balloon.callback.onContentChange
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */



})(Iroha.$, Iroha, window, document);