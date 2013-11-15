/*! "iroha.carousel.js" | Iroha - Necomesi JSLib : Carousel | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Carousel
 *       (charset : "UTF-8")
 *
 *    @version 3.14.20131016
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.scroller.js
 *    @requires iroha.carousel.css
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- jQuery.fn : Iroha_Carousel -------------------- */
/**
 * Iroha.Carousel as jQuery plugin
 * @exports $.fn.Iroha_Carousel as jQuery.fn.Iroha_Carousel
 * @param {Iroha.Carousel.Setting} [setting]    setting object for the instance
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_Carousel = function(setting) {
	return this.each(function() { Iroha.Carousel.create(this, setting) });
}



/* -------------------- Class : Iroha.Carousel -------------------- */
/**
 * いわゆるカルーセル
 * @class carrousel
 * @extends Iroha.Observable
 */
Iroha.Carousel = function() {
	/**
	 * settings for this instance
	 * @type Iroha.Carousel.Setting
	 */
	this.setting = undefined;

	/**
	 * jQuery object indicating base element of this instance.
	 * @type jQuery
	 * @private
	 */
	this.$node = $();

	/**
	 * jQuery object indicating viewport element which contains a grouping block.
	 * @type jQuery
	 * @private
	 */
	this.$viewport = $();

	/**
	 * jQuery object indicating grouping block element which contains content-units elements.
	 * @type jQuery
	 * @private
	 */
	this.$group = $();

	/**
	 * jQuery object indicating the content-unit elements in the carousel.
	 * @type jQuery
	 * @private
	 */
	this.$units = $();

	/**
	 * an array of instances of select buttons.
	 * @type Iroha.Carousel.SelectBtn[]
	 * @private
	 */
	this.selectBtn = [];

	/**
	 * an array of instances of prev buttons.
	 * @type Iroha.Carousel.StepBtn[]
	 * @private
	 */
	this.prevBtn = [];

	/**
	 * an array of instances of next buttons.
	 * @type Iroha.Carousel.StepBtn[]
	 * @private
	 */
	this.nextBtn = [];

	/**
	 * number of currently shown carousel unit.
	 * @type Number
	 * @private
	 */
	this.currentNum = 0;

	/**
	 * interval timer to control rotation
	 * @type Iroha.Interval
	 * @private
	 */
	this.timer = undefined;

	/**
	 * smooth scroller instance
	 * @type Iroha.Scroller
	 * @private
	 */
	this.scroller = undefined;
};

$.extend(Iroha.Carousel,
/** @lends Iroha.Carousel */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode'  : Carousel の基底要素ノードであることを示す
	 *   - 'enabled'   : Carousel が適用されたことを示す
	 *   - 'discarded' : Carousel が適用されたが適用する意味がなかったことを示す
	 *   - 'scrolling' : Carousel がスクロール動作している瞬間であることを示す
	 *   - 'selected'  : Carousel を構成するブロックのうち現在選択されている（見えている）ものを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode'  : 'iroha-carousel'
		, 'enabled'   : 'iroha-carousel-enabled'
		, 'discarded' : 'iroha-carousel-discarded'
		, 'scrolling' : 'iroha-carousel-scrolling'
		, 'selected'  : 'iroha-carousel-selected'
	}
});

Iroha.ViewClass(Iroha.Carousel).extend(Iroha.Observable);

$.extend(Iroha.Carousel.prototype,
/** @lends Iroha.Carousel.prototype */
{
	/**
	 * initialize
	 * @param {Element|jQuery|String}  node         base element node for the instance
	 * @param {Iroha.Carousel.Setting} [setting]    setting object for the instance
	 * @reutn this instance
	 * @type Iroha.Carousel
	 * @private
	 */
	init : function(node, setting) {
		var cname     = this.constructor.CLASSNAME;
		var setting   = this.setting   = $.extend(Iroha.Carousel.Setting.create(), setting);
		var $node     = this.$node     = $(node).first().addClass(cname.baseNode);
		var $viewport = this.$viewport = $node    .find(setting.viewport).first();
		var $group    = this.$group    = $viewport.find(setting.group   ).first();
		var $units    = this.$units    = $group   .find(setting.units   );
		var step      = setting.groupedUnit;

		// init scroll field.
		this.scroller = Iroha.Scroller.create(
			  /* node       */ $viewport
			, /* offsetX    */ 0
			, /* offsetY    */ 0
			, /* duration   */ setting.duration
			, /* easing     */ setting.easing
			, /* smartAbort */ false
		);

		// initiate prev buttons
		this.prevBtn = $node.find(setting.prevBtn).get().map(function(node) {
			return Iroha.Carousel.StepBtn.create(node, -1 * step).addCallback('onClick', this.selectBy, this);
		}, this);

		// initiate next buttons
		this.nextBtn = $node.find(setting.nextBtn).get().map(function(node) {
			return Iroha.Carousel.StepBtn.create(node, +1 * step).addCallback('onClick', this.selectBy, this);
		}, this);

		// initiate select buttons
		this.selectBtn = $node.find(setting.selectBtn).get().map(function(node, i) {
			return Iroha.Carousel.SelectBtn.create(node, i).addCallback('onClick', this.select, this);
		}, this);

		// revising for quirk behavior of some browsers.
		this.initScrollReviser($viewport);
		this.createWastingInsForOpera();

		// select first carousel unit.
		this.select(0);
		// this shows units which is needed to be shown
		$units.slice(0, setting.visibleUnit).addClass(cname.selected);

		// auto start rotation (if necessary)
		this.startRotate(setting.interval);

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
	 * revise scrollLeft on vertical scrolling by user operation (for Gecko only, temporary).
	 * @param {Element|jQuery|String} viewport    viewport element node
	 * @private
	 */
	initScrollReviser : function(viewport) {
		if (!Iroha.ua.isGecko) return;

		var lock = false;
		var posX = 0;
		this.scroller.addCallback('onStart'   , function(x, y) { lock = true            });
		this.scroller.addCallback('onComplete', function(x, y) { lock = false; posX = x });
		$(viewport).scroll(function(e) { if (!lock) e.currentTarget.scrollLeft = posX });
	},

	/**
	 * workaround for Opera (temporary).
	 * @private
	 */
	createWastingInsForOpera : function() {
		if (!Iroha.ua.isOpera) return;

		this.$units.eq(0).append(
			$(document.createElement('ins'))
				.text('.')
				.css({
					  position   : 'relative'
					, left       : '-10px'
					, top        : '-10px'
					, display    : 'block'
					, width      : '1px'
					, height     : '1px'
					, fontSize   : '1px'
					, color      : 'transparent'
					, lineHeight : '0'
				})
		);
	},

	/**
	 * [experimental] カルーセル内のスクロール処理を CSS Transform の translate() で実現するモードへ変更する。
	 * @return このインスタンス自身
	 * @type Iroha.Carousel
	 */
	useCssTranslate : function() {
		this.scroller.useCssTranslate(this.$group, 'norevise');
		return this;
	},

	/**
	 * add carousel unit block.
	 * @param {Element|jQuery|String} node    an element node which indicates carousel unit block
	 * @reutn this instance
	 * @type Iroha.Carousel
	 */
	addUnit : function(node) {
		this.$units = this.$units.add($(node).appendTo(this.$group));
		this.updateStatus();
		return this;
	},

	/**
	 * remove carousel unit block.
	 * @param {Element|jQuery|String} node    an element node which indicates carousel unit block
	 * @reutn this instance
	 * @type Iroha.Carousel
	 */
	removeUnit : function(node) {
		var $node = $(node).remove();
		this.$units = this.$units.filter(function() { return $(this).parent().size() > 0 });
		this.updateStatus();
		return this;
	},

	/**
	 * select a carousel unit by unit number
	 * @param {Number} num     carousel unit number
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	select : function(num) {
		var cname  = this.constructor.CLASSNAME;
		var vunits = this.setting.visibleUnit;
		var size   = this.$units.size();

		num = Math.min(num, size - (this.setting.endless ? 0 : vunits));
		num = Math.max(num, 0);

		this.$units.eq(num).each($.proxy(function(_i, _node) {   // syntax sugar, to check existing, to change scope.
			this.currentNum = num;

			this
				.startRotate()     // reset timer and continue rotation.
				.endressPrepare()  // preparation for endless loop.
				.updateStatus()
				.doCallback('onStart', num);

			this.scroller
				.removeDisposableCallback('onStart'   )  // cleanup unused disposable callbacks
				.removeDisposableCallback('onComplete')  // which is set recent "select()" process.

				.addCallback('onStart', function() {
					this.$node .addClass(cname.scrolling);
					this.$units.addClass(cname.selected );
				}, this, 'disposable')

				.addCallback('onComplete', function() {
					this.$node .removeClass(cname.scrolling);
					this.$units.removeClass(cname.selected)
					this.$units.slice(num, num + vunits).addClass(cname.selected);
					if (this.setting.endless) {
						if (size < num + vunits) {
							this.$units.slice(0, vunits - 1).addClass(cname.selected);
						} else {
							this.$units.get().forEach(function(node) { $(node).parent().append(node) })

							// このブロック内部にある scrollToNode() を呼び出すと、完了時コールバックが発生する。
							// 結果、再度ここへ実行コンテキストが戻ってくることになり、無限ループに陥るため、それを防がなければならない。
							this.scroller
								.ignoreCallback('onComplete', 'all')
								.scrollToNode(_node, 0)
								.ignoreCallback('onComplete', 'none')
						}
					}
					this.doCallback('onSelect', num);
				}, this, 'disposable')

				.abort()
				.scrollToNode(_node);
		}, this));

		return this;
	},

	/**
	 * reveal current carousel unit immediately (scroll-x position is set to 0 when the base node is hidden)
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	reveal : function() {
		this.scroller.scrollToNode(this.$units.eq(this.currentNum), 0);
		return this;
	},

	/**
	 * update base block's className and button's statuses.
	 * @return this instance
	 * @type Iroha.Carousel
	 * @private
	 */
	updateStatus : function() {
		var num       = this.currentNum;
		var cname     = this.constructor.CLASSNAME;
		var vunits    = this.setting.visibleUnit;
		var size      = this.$units.size();
		var discarded = (size <= vunits);

		// update status className of the base element block
		this.$node.toggleClass(cname.discarded,  discarded);
		this.$node.toggleClass(cname.enabled  , !discarded);

		// select/unselect select buttons
		this.selectBtn.forEach(function(btn, i) {
			if (num == i) btn.select  ();
			else          btn.unselect();
		}, this);

		// enable/disable prev/next buttons
		if (!this.setting.endless) {
			var min = 0;
			var max = size - vunits;
			this.prevBtn.forEach(function(btn) {
				if (num == min) btn.disable();
				else            btn.enable ();
			}, this);
			this.nextBtn.forEach(function(btn) {
				if (num >= max) btn.disable();
				else            btn.enable ();
			}, this);
		}

		return this;
	},

	/**
	 * select carousel unit by difference from current selected carousel unit's number
	 * @param {Number} step    deference from current selected carousel unit's number; typically '+1' or '-1'
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	selectBy : function(step) {
		if (typeof step == 'number' && step != 0) {
			var max = this.$units.size() - 1;
			var num = this.currentNum + step;
				num = num < 0   ? max + num + 1 :
					  num > max ? num - max - 1 :
					              num           ;
			this.endressPrepare(step);
			this.select(num);
		}
		return this;
	},

	/**
	 * preparation for "endress mode"
	 * @param {Number} [step]    deference from current selected carousel unit's number; typically '+1' or '-1'
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	endressPrepare : function(step) {
		if (this.setting.endless) {
			var step   = Number(step) || 0;
			var units  = this.setting.units;
			var vunits = this.setting.visibleUnit;
			var $unit  = this.$units.eq(this.currentNum);
			var size   = this.$units.size();
			var left   = getPos('left');
			var top    = getPos('top' );

			if (step < 0) {
				while ($unit.prevAll(units).size() < Math.min(size - 1, Math.abs(step))) {
					$unit.siblings(units).last().prependTo($unit.parent());
				}
			}
			if (step >= 0) {
				while ($unit.nextAll(units).size() < Math.min(size - 1, Math.abs(step) + vunits - 1)) {
					$unit.siblings(units).first().appendTo($unit.parent());
				}
			}
			this.scroller.scrollBy(getPos('left') - left, getPos('top') - top, 0);
		}
		return this;

		/**
		 * @param {String} prop    'left' or 'top'
		 * @return offset position of current unit (px)
		 * @type Number
		 * @inner
		 */
		function getPos(prop) {
			return $unit.position()[prop] - $unit.parent().position()[prop] || 0;
		}
	},

	/**
	 * start rotating
	 * @param {Number} [interval]    new interval (in milliseconds); if 0 given, or current interval time is 0, it doesn't start rotation!
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	startRotate : function(interval) {
		this.stopRotate();
		if (typeof interval == 'number') {
			this.setting.interval = interval;
		}
		if (this.setting.interval > 0) {
			this.timer = new Iroha.Interval(function() { this.selectBy(1) }, this.setting.interval, this);
		}
		return this;
	},

	/**
	 * stop rotating
	 * @return this instance
	 * @type Iroha.Carousel
	 */
	stopRotate : function() {
		if (this.timer) {
			this.timer.clear();
			this.timer = null;
		}
		return this;
	}
});



/* -------------------- Class : Iroha.Carousel.StepBtn -------------------- */
/**
 * creates step button for {@link Iroha.Carousel}
 * @class step button for {@link Iroha.Carousel}
 * @extends Iroha.Observable
 */
Iroha.Carousel.StepBtn = function() {
	/**
	 * base element node for this button
	 * @type jQuery
	 *  @private
	 * @constant
	 */
	this.$node = $();

	/**
	 * number to forward/backward selection of the carousel units when this button is clicked
	 * @type Number
	 * @private
	 * @constant
	 */
	this.step = 1;

	/**
	 * is this button currently disabled?
	 * @type Boolean
	 * @private
	 */
	this.disabled = false;
};

Iroha.ViewClass(Iroha.Carousel.StepBtn).extend(Iroha.Observable);

$.extend(Iroha.Carousel.StepBtn,
/** @lends Iroha.Carousel.StepBtn */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'selected'  : 選択状態を示す
	 *   - 'disabled'  : 選択不可状態を示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'selected' : 'iroha-carousel-selected'
		, 'disabled' : 'iroha-carousel-disabled'
	}
});

$.extend(Iroha.Carousel.StepBtn.prototype,
/** @lends Iroha.Carousel.StepBtn.prototype */
{
	/**
	 * initialize
	 * @param {Element|jQuery|String}  node        base element node for step button
	 * @param {Number}                [step=1]     number to forward/backward selection of the carousel unit when this button is clicked
	 * @return this instance
	 * @type Iroha.Carousel.StepBtn
	 * @private
	 */
	init : function(node, step) {
		this.$node = $(node).click($.proxy(this.onclick, this));
		this.step  = Number(step) || 1;

		return this;
	},

	/**
	 * event handler for when the button is clicked.
	 * @param {Event} e    event object
	 * @event
	 * @private
	 */
	onclick : function(e) {
		e.preventDefault();
		if (!this.disabled) this.doCallback('onClick', this.step);
	},

	/**
	 * enable this button
	 * @returns this instance
	 * @type Iroha.Carousel.StepBtn
	 */
	enable : function() {
		this.disabled = false;
		this.$node.removeClass(this.constructor.CLASSNAME.disabled);
		return this;
	},

	/**
	 * disable this button
	 * @returns this instance
	 * @type Iroha.Carousel.StepBtn
	 */
	disable : function() {
		this.disabled = true;
		this.$node.addClass(this.constructor.CLASSNAME.disabled);
		return this;
	}
});


/* -------------------- Class : Iroha.Carousel.SelectBtn -------------------- */
/**
 * creates select button for {@link Iroha.Carousel}
 * @class select button for {@link Iroha.Carousel}
 * @extends Iroha.Observable
 */
Iroha.Carousel.SelectBtn = function() {
	/**
	 * base element node for this button
	 * @type jQuery
	 * @private
	 * @constant
	 */
	this.$node = $();

	/**
	 * number to select a carousel unit when this button is clicked.
	 * @type Number
	 * @private
	 * @constant
	 */
	this.index = 0;

	/**
	 * is this button currently selected?
	 * @type Boolean
	 * @private
	 */
	this.selected = false;
};

Iroha.ViewClass(Iroha.Carousel.SelectBtn).extend(Iroha.Observable);

$.extend(Iroha.Carousel.SelectBtn,
/** @lends Iroha.Carousel.SelectBtn */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'selected'  : 選択状態を示す
	 *   - 'disabled'  : 選択不可状態を示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'selected' : 'iroha-carousel-selected'
		, 'disabled' : 'iroha-carousel-disabled'
	}
});

$.extend(Iroha.Carousel.SelectBtn.prototype,
/** @lends Iroha.Carousel.SelectBtn.prototype */
{
	/**
	 * initialize
	 * @param {Element|jQuery|String} node         base element node for select button
	 * @param {Number}                index        number to select a carousel unit when this button is clicked.
	 * @return this instance
	 * @type Iroha.Carousel.SelectBtn
	 */
	init : function(node, index) {
		this.$node    = $(node).click($.proxy(this.onclick, this));
		this.index    = index;
		this.selected = false;

		return this;
	},

	/**
	 * event handler for when the button is clicked.
	 * @param {Event} e    event object
	 * @event
	 * @private
	 */
	onclick : function(e) {
		e.preventDefault();
		this.doCallback('onClick', this.index);
	},

	/**
	 * select this button
	 * @returns this instance
	 * @type Iroha.Carousel.SelectBtn
	 */
	select : function() {
		this.selected = true;
		this.$node.addClass(this.constructor.CLASSNAME.selected);
		return this;
	},

	/**
	 * unselect this button
	 * @returns this instance
	 * @type Iroha.Carousel.SelectBtn
	 */
	unselect : function() {
		this.selected = false;
		this.$node.removeClass(this.constructor.CLASSNAME.selected);
		return this;
	}
});



/* -------------------- Class : Iroha.Carousel.Setting -------------------- */
/**
 * setting data object for {@link Iroha.Carousel}
 * @class setting data object for {@link Iroha.Carousel}
 */
Iroha.Carousel.Setting = function() {
	/**
	 * number of visible units at a time.
	 * @type Number
	 */
	this.visibleUnit = 1;

	/**
	 * number of grouped units; this value is used as step count value of prev/next button.
	 * @type Number
	 */
	this.groupedUnit = 1;

	/**
	 * milliseconds of rotate interval; if 0 then it doesn't rotate.
	 * @type Number
	 */
	this.interval = 0;

	/**
	 * milliseconds of duration of scroll animation.
	 * @type Number
	 */
	this.duration = 375;

	/**
	 * easing function name existing in jQuery.easing.
	 * @type String
	 */
	this.easing = 'easeInOutCubic';

	/**
	 * flag to enable "endress mode".
	 * @type Boolean
	 */
	this.endless = false;

	/**
	 * an expression to find viewport element which contains a grouping block.
	 * @type String
	 */
	this.viewport = '.iroha-carousel-viewport';

	/**
	 * an expression to find grouping block element which contains content-units elements.
	 * @type String
	 */
	this.group = '.iroha-carousel-group';

	/**
	 * an expression to find content-unit elements.
	 * @type String
	 */
	this.units = '.iroha-carousel-unit';

	/**
	 * an expression to find buttons to select previous unit.
	 * @type String
	 */
	this.prevBtn = '.iroha-carousel-prev-btn';

	/**
	 * an expression to find buttons to select next unit.
	 * @type String
	 */
	this.nextBtn = '.iroha-carousel-next-btn';

	/**
	 * an expression to find buttons to select one unit directry.
	 * @type String
	 */
	this.selectBtn = '.iroha-carousel-select-btn';
};

/**
 * create an instance and return.
 * @type Iroha.Carousel.Setting
 */
Iroha.Carousel.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Carousel}
 * @name Iroha.Carousel.Callback
 * @namespace callback functions for {@link Iroha.Carousel}
 */
/**
 * a callback for when one of the carousel units start scrolling.
 * @name Iroha.Carousel.Callback.onStart
 * @function
 * @param {Number} index    index number of a carousel unit which is currently selected
 */
/**
 * a callback for when one of the carousel unit is selected.
 * @name Iroha.Carousel.Callback.onSelect
 * @function
 * @param {Number} index    index number of a carousel unit which is currently selected
 */



})(Iroha.$, Iroha, window, document);