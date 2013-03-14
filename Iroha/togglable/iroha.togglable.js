/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       任意のブロックを閉じたり開いたりする UI
 *       (charset : "UTF-8")
 *
 *    @version 3.03.20130314
 *    @requires jquery.js
 *    @requires jquery.easing.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



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
 * @class 任意のブロックを閉じたり開いたりする UI
 * @extends Iroha.Observable
 * @expample new Iroha.Togglable       (args) -> new instance
 *               Iroha.Togglable       (args) -> new instance
 *               Iroha.Togglable.create(args) -> new instance
 */
Iroha.Togglable = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);
	
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
	 *   - 'target'   : 開閉される対象ブロックの要素ノードであることを示す
	 *   - 'button'   : 開閉を操作するボタンの要素ノードである事を示す
	 *   - 'opened'   : 開閉されるブロック、操作ボタンともに、ブロックが開かれている事を示す。
	 *   - 'closed'   : 開閉されるブロック、操作ボタンともに、ブロックが閉じられている事を示す。
	 *   - 'relation' : class 属性値の命名規則により操作ボタンを開閉対象を結びつけるための正規表現。"iroha-togglable-xxx-related" のついたボタンは class 属性値 "iroha-togglable-xxx" を持つブロックと結びつけられる。
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
	 * @private
	 * @see {@link Iroha.ViewClass#storeInstance}
	 */
	storeInstanceOrig : Iroha.Togglable.storeInstance,
	
	/**
	 * クラスから生成されたインスタンスを格納する。
	 * {@link Iroha.ViewClass#storeInstance} は instance.$node にインスタンスのインデックス番号を与えるものだが
	 * それをここで上書き、同じキーの同じインデックス番号を instance.$buttons にも持たせるようにする。
	 * これによって、開閉ボタンの要素ノードをからでも Iroha.Togglable インスタンスの逆引きが可能になる。
	 * @param {Object} instance    生成したインスタンス
	 * @return 格納したインスタンスそれ自身
	 * @type Object
	 * @private
	 */
	storeInstance : function(instance) {
		var instance = this.storeInstanceOrig(instance);
		var key      = this.key + '.index';
		var value    = instance.$node.data(key);
		instance.$buttons.data(key, value);
		return instance;
	},

	/**
	 * ボタンに付与されている「関連づけ用クラス名」を元に、そのボタンが開閉対象とするべきブロック（1つ以上）を取得する
	 * @param {Element|jQuery|String} button    開閉ボタンの要素ノード
	 * @return 見つかった要素ノード（群）からなる jQuery オブジェクト
	 * @type jQuery
	 */
	getTargetsByRelation : function(button) {
		var $button = $(button).first();
		var cnames  = ($button.attr('class') || '').split(' ');
		var regex   = this.CLASSNAME.relation;
		return (cnames.some(function(cname) { return regex.test(cname) }))
			? $('.' + RegExp.$1)
			: $();
	},

	/**
	 * 自分を含め、同じブロックを開閉対象とする同族なボタン（1つ以上）を取得する
	 * @param {Element|jQuery|String} button    開閉ボタンの要素ノード
	 * @return 見つかった要素ノード（群）からなる jQuery オブジェクト
	 * @type jQuery
	 */
	getButtonsByRelation : function(button) {
		var $button = $(button).first();
		var cnames  = ($button.attr('class') || '').split(' ');
		var regex   = this.CLASSNAME.relation;
		return (cnames.some(function(cname) { return regex.test(cname) }))
			? $('.' + RegExp.lastMatch)
			: $();
	},
	
	/**
	 * 開閉ボタンの押下をトリガーにしてインスタンスを自動生成させるようにする。
	 * @param {String} [selector="a, area"] 開閉ボタンの要素ノードを見つけるためのセレクタ文字列。
	 * @return このコンストラクタ（クラスオブジェクト）自身
	 * @type Function
	 */
	autoSetup : function(selector) {
		var selector = selector || 'a, area';
		
		$(document).on('click', selector, $.proxy(function(e) {
			var togglable = this.getInstance(e.currentTarget);
			if (!togglable) {
				var $button = $(e.currentTarget);
				var $target = $button.Iroha_getLinkTarget();
				
				// ページ内リンクによる関連づけが無いなら、関連づけ用のクラス名を手ががかりに
				// 開閉対象のブロックと、同じブロックに関連づけられている開閉ボタンを探す。
				if (!$target.length) {
					$target = this.getTargetsByRelation($button);
					$button = this.getButtonsByRelation($button);
				}
				
				// 開閉対象のブロックが見つかり、インスタンス生成し、最初の開閉を行う。
				// 以後の開閉はインスタンス内部のイベントハンドラが行うのでこの1回のみで良い。
				if ($target.length && !this.getInstance($target)) {
					togglable = this.create($target, $button).toggle();
				}
			}
			
			// インスタンスが用意できたなら、DOM 的デフォルトアクション、Iroha.PageScroller のスクロールアニメ発動を抑止
			// （ボタンはページ内リンクだからこれらの対策は必要）
			if (togglable) {
				e.preventDefault();
				Iroha.PageScroller && Iroha.PageScroller.abort();
			}
		}, this));
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
		var klass = this.constructor;
		var cname = klass.CLASSNAME;
		var $node = $(targets)
			.filter(function() { return !klass.getInstance(this) })
				.addClass   (cname.target)
				.toggleClass(cname.opened,  this.opened)
				.toggleClass(cname.closed, !this.opened)

		this.$node = this.$node.add($node);
		
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
		var klass    = this.constructor;
		var cname    = klass.CLASSNAME;
		var $buttons = $(buttons)
			.filter(function() { return !klass.getInstance(this) })
				.addClass   (cname.button)
				.toggleClass(cname.opened,  this.opened)
				.toggleClass(cname.closed, !this.opened)
				.click      ($.proxy(function(e) {
					$buttons.is('a, area') && e.preventDefault();
					this.toggle();
				}, this));
		
		this.$buttons = this.$buttons.add($buttons);
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



})(Iroha.$, Iroha, window, document);