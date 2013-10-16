/*! "iroha.tabView.js" | Iroha - Necomesi JSLib : Tab View | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Tab View
 *       (charset : "UTF-8")
 *
 *    @version 3.00.20131016
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.fontSizeObserver.js  (optional)
 *    @requires iroha.tabView.css
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- jQuery.fn : Iroha_TabView -------------------- */
/**
 * Iroha.TabView as jQuery plugin
 * @exports $.fn.Iroha_TabView as jQuery.fn.Iroha_TabView
 * @param {Iroha.TabView.Setting} [setting]    setting object for the instance
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_TabView = function(setting) {
	return this.each(function() { Iroha.TabView.create(this, setting) });
}



/* -------------------- Class : Iroha.TabView -------------------- */
/**
 * @class 典型的なよくあるタブ切替の UI
 * @extends Iroha.Observable
 * @expample new Iroha.TabView       (args) -> new instance
 *               Iroha.TabView       (args) -> new instance
 *               Iroha.TabView.create(args) -> new instance
 */
Iroha.TabView = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * 設定用オブジェクト
	 * @type Iroha.TabView.Setting
	 * @private
	 */
	this.setting = Iroha.TabView.Setting.create();

	/**
	 * 基底要素ノード
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * タブページ（Iroha.TabView.Page インスタンス）群を収めた配列。
	 * タブページは、切替ボタンと切替対象のペインの組を表す。
	 * @type Iroha.TabView.Page[]
	 * @private
	 */
	this.pages = [];

	/**
	 * 現在選択（表示）されているページのインスタンス
	 * @type Iroha.TabView.Page
	 * @private
	 */
	this.currentPage = null;

	/**
	 * true のとき「高さの自動揃え」を実行しない。 IE 向け対策の一環。
	 * @type Boolean
	 * @private
	 */
	this.preventFH = false;
};

Iroha.ViewClass(Iroha.TabView).extend(Iroha.Observable);

$.extend(Iroha.TabView,
/** @lends Iroha.TabView */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode'  : TabView の基底要素ノードであることを示す
	 *   - 'enabled'   : TabView が適用されたことを示す
	 *   - 'discarded' : TabView が適用されたが、適用する意味がなかったことを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode'  : 'iroha-tabview'
		, 'enabled'   : 'iroha-tabview-enabled'
		, 'discarded' : 'iroha-tabview-discarded'
	}
});

$.extend(Iroha.TabView.prototype,
/** @lends Iroha.TabView.prototype */
{
	/**
	 * initialize, add pages automatically.
	 * @param {Element|jQuery|String} node         a base element node for the instance
	 * @param {Iroha.TabView.Setting}  [setting]    setting object for the instance
	 * @reutn this instance
	 * @type Iroha.TabView
	 * @private
	 */
	init : function(node, setting) {
		this.setting = $.extend(this.setting, setting);
		this.$node   = $(node).first();

		// indicate enabled className
		var cname = this.constructor.CLASSNAME;
		this.$node.addClass([ cname.baseNode, cname.enabled ].join(' '));

		// temporary disable setting values
		var _tmp_changeHash  = this.setting.changeHash    ; this.setting.changeHash     = false;
		var _tmp_fixedHeight = this.setting.fixedHeight   ; this.setting.fixedHeight    = false;
		var _tmp_useEffect   = this.setting.effect.enabled; this.setting.effect.enabled = false;

		// create page instances
		this.$node.find(this.setting.tab).get().forEach(function(node) {
			this.add(Iroha.TabView.Page.create(node));
		}, this);

		// flat heights when browser's displaying font size is changed.
		Iroha.FontSizeObserver && Iroha.FontSizeObserver.addCallback('onChange', this.flatHeights, this);

		// flat heights when browser's window is resized.
		$(window).resize(Iroha.barrageShield(this.flatHeights, 250, this));

		// auto-select a page which is indicated by or className in HTML.
		// if no pages are selected, auto-select first page.
		this.select(this.pages.filter(function(page) { return page.selected }).pop() || 0);

		// restore original setting values
		this.setting.changeHash     = _tmp_changeHash;
		this.setting.fixedHeight    = _tmp_fixedHeight;
		this.setting.effect.enabled = _tmp_useEffect;

		// flatten heights if needed.
		this.flatHeights();

		// autoselect tab-page by fragment-id in given url.
		var page = location.hash.split('#')[1] || '';
		if (this.has(page)) {
			this.select(page, 'noEffect');
			Iroha.Timeout(function() { this.scrollIntoView() }, 500, this);
		}

		return this;
	},

	/**
	 * add page instance.
	 * @param {Iroha.TabView.Page} page    page instance to be added
	 * @return this instance
	 * @type Iroha.TabView
	 */
	add : function(page) {
		if (page instanceof Iroha.TabView.Page && !this.has(page)) {
			this.pages.push(page);
			this.flatHeights();
			page.addCallback('onSelectRequested', this.select, this);
		}

		this.$node.toggleClass(this.constructor.CLASSNAME.discarded, this.pages.length == 1);

		return this;
	},

	/**
	 * get specified page instance.
	 * @param {Iroha.TabView.Page|Number|String} page    page instance, index number, or ID-string to get a page.
	 * @return page instance, or undefined if the page does not exist.
	 * @type Iroha.TabView.Page
	 */
	get : function(page) {
		switch (typeof page) {
			case 'string' :
				return this.pages.filter(function(_) { return (_.getId() == page) }).shift();

			case 'number' :
				return this.pages[page];

			default :
				return (this.pages.indexOf(page) != -1) ? page : undefined;
		}
	},

	/**
	 * get currently selected page instance
	 * @return page instance, or undefined if the page does not exist.
	 * @type Iroha.TabView.Page
	 */
	getCurrentPage : function() {
		return this.currentPage;
	},

	/**
	 * get all page instance
	 * @return an array of page instance.
	 * @type Iroha.TabView.Page[]
	 */
	getAllPages : function() {
		return $.makeArray(this.pages);
	},

	/**
	 * does this tabview has specified page?
	 * @param {Iroha.TabView.Page|Number|String} page    page instance, index number, or ID-string to get a page.
	 * @return true if this tabview has specified page.
	 * @type Boolean
	 */
	has : function(page) {
		return Boolean(this.get(page));
	},

	/**
	 * switch to specified page.
	 * @param {Iroha.TabView.Page|Number|String} page        page instance, index number, or ID-string to select a page.
	 * @param {String}                           noEffect    if "noEffect" is given, disable resizing animation even if it requested (for during init() etc.)
	 * @return this instance
	 * @type Iroha.TabView
	 */
	select : function(page, noEffect) {
		var page = this.get(page);

		if (page && page != this.currentPage) {
			var oldHeight = this.currentPage ? this.currentPage.unselect().getHeight() : -1;
			(this.currentPage = page).select();

			if (this.setting.changeHash) {
				var id = page.getId();
				page.setId('');    // workaround for IE7 and earlier
				window.location.hash = '#' + id;
				page.setId(id);    // workaround for IE7 and earlier
			}

			// do resizing effect if requested.
			var fixedHeight = this.setting.fixedHeight;
			var effect      = this.setting.effect;
			if (noEffect != 'noEffect' && !fixedHeight && effect.enabled && oldHeight >= 0) {
				page
					.setHeight(oldHeight)
					.setHeight('auto', effect.duration, effect.easing, function() { page.setHeight('auto') });
			}

			this.doCallback('onSelect', this.currentPage);
		}

		return this;
	},

	/**
	 * flat all height of pages to max height of the pages.
	 * @param {Boolean} force    force to flatten heights; this.setting.fixedHeight is forced to change into "true".
	 * @return this instance
	 * @type Iroha.TabView
	 */
	flatHeights : function(force) {
		if (!this.preventFH && (this.setting.fixedHeight || $.type(force) == 'boolean' && force)) {
			this.setting.fixedHeight = true;
			this.preventFH = true;
			Iroha.Timeout(function() {
				this.preventFH = false;
			}, 500, this);  // delay needs 2 times of Iroha.barrageShield's delay in "this.init()".

			_setHeight.call(this, 'auto');
			_setHeight.call(this, _getMaxHeight.call(this));
		}

		return this;

		/**
		 * set height (border-box height) of all pages' "pane block"
		 * @param {Number|String} [_height]    "auto" or px number for new height (border-box height) of the "pane block"
		 * @see Iroha.TabView.Page#setHeight
		 * @inner
		 */
		function _setHeight(_height) {
			this.pages
				.forEach(function(_) { _.setHeight(_height) });
		}

		/**
		 * get max height (border-box height) in all pages' "pane block" (px)
		 * @see Iroha.TabView.Page#getHeight
		 * @inner
		 */
		function _getMaxHeight() {
			return this.pages
					.map(function(_) { return _.getHeight() })
					.sort(function(_a, _b) { return _a - _b })
					.pop() || 0;
		}
	},

	/**
	 * scrolls this tab into view.
	 * @return this instance
	 * @type Iroha.TabView
	 */
	scrollIntoView : function() {
		this.$node.get(0).scrollIntoView(true);
		return this;
	}
});


/* -------------------- Class : Iroha.TabView.Page -------------------- */
/**
 * @class タブページ。切替ボタンと切替対象のペインブロックの組。単独で使うことはなく、 {@link Iroha.TabView} に内包される形の利用。
 * @extends Iroha.Observable
 * @see Iroha.TabView
 */
Iroha.TabView.Page = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * このタブページを一意に示す識別子。「タブペイン」要素ヨードの id 属性値と同じになる。
	 * @type String
	 * @private
	 */
	this.id = '';

	/**
	 * 「タブ切替ボタン」。リンクアンカー自体か、それを内包する要素ノード。
	 * このボタンが保持しているリンクは、切替対象たる「タブペイン」へのページ内リンクになっている必要がある。
	 * @type jQuery
	 * @private
	 */
	this.$tab = $();

	/**
	 * 「タブペインブロック」。実際に表示が切り替わる側。実コンテンツを内包する要素ノード。
	 * 「タブ切替ボタン」との対応付けは、ボタン→ペインブロックのページ内リンクによって確立される。
	    @type jQuery
	    @private */
	this.$pane = $();

	/**
	 * このタブページが選択（表示）されている状態なら true 。
	 * @type Boolean
	 */
	this.selected = false;
};

Iroha.ViewClass(Iroha.TabView.Page).extend(Iroha.Observable);

$.extend(Iroha.TabView.Page,
/** @lends Iroha.TabView.Page */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'selectedTab'  : 選択状態にあるタブボタンの要素ノードに付与される
	 *   - 'selectedPane' : 選択状態にあるタブペインブロックの要素ノードに付与される
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'selectedTab'  : 'iroha-tabview-tab-selected'
		, 'selectedPane' : 'iroha-tabview-pane-selected'
	}
});


$.extend(Iroha.TabView.Page.prototype,
/** @lends Iroha.TabView.Page.prototype */
{
	/**
	 * initialize.
	 * @param {Element|jQuery|String} tab    「タブ切替ボタン」の要素ノード。リンクアンカー自体か、それを内包するもの。
	 *                                       そのリンクはページ内リンクの形で切替対象のタブペインブロックを指し示している必要がある。
	 * @private
	 */
	init : function(tab) {
		var $tab    = $(tab).first();
		var $anchor = $tab.is('a') ? $tab : $tab.find('a').first();  // jQuery1.8 以降の addBack() を使うか、1.8 以降 deprecated 扱いの andSelf() を使うか、悩ましいし。

		this.$tab   = $tab;
		this.$pane  = $anchor.Iroha_getLinkTarget();

		if (this.$pane.length) {
			this.id       = this.$pane.attr('id');
			this.selected = this.$tab.hasClass(this.constructor.CLASSNAME.selectedTab);

			$anchor.on('click', $.proxy(function(e) {
				e.preventDefault();

				this.selected || this.doCallback('onSelectRequested', this);

				// aware of a behavior of Iroha.PageScroller.
				if (Iroha.PageScroller) {
					Iroha.PageScroller.abort();
					$anchor.focus();
				}
			}, this));
		}

		// hide outline indicating focus.
		$anchor.css('outline', 'none').prop('hideFocus', true);

		return this;
	},

	/**
	 * get id string of this tab pane.
	 * @returns id
	 * @type String
	 */
	getId : function() {
		return this.id;
	},

	/**
	 * set id string of this tab pane.
	 * @returns this instance
	 * @type Iroha.TabView.Page
	 */
	setId : function(id) {
		if (typeof id != 'string') {
			throw new TypeError('Iroha.TabView.Page.setId: first argument must be a string.');
		} else {
			this.$pane.attr('id', this.id = id);
			return this;
		}
	},

	/**
	 * get height (border-box height) of "pane block" in this page.
	 * @return height (border-box height) of "pane block" (px)
	 * @type Number
	 */
	getHeight : function() {
		var cname  = this.constructor.CLASSNAME.selectedPane;
		var height = this.$pane.addClass(cname).outerHeight();
		this.selected || this.$pane.removeClass(cname);

		return height;
	},

	/**
	 * set height (border-box height) of "pane block" in this page.
	 * @param {Number|String} [height="auto"]     "auto" or px number for new height (border-box height) of the "pane block"
	 * @param {Number}        [duration]          required for resizing animation; animation duration.
	 * @param {String}        [easing="swing"]    optional for resizing animation; easing function name for resizing animation.
	 * @param {Function}      [callback]          optional for resizing animation; callback function for resizing animation is complete.
	 * @return this instance
	 * @type Iroha.TabView.Page
	 */
	setHeight : function(height, duration, easing, callback) {
		var oldHeight = this.getHeight();

		if (!$.isNumeric(height)) {
			height = this.$pane.height('auto').height();

		} else {
			this.$pane
				.stop()
				.height(height = Math.max(0, height) || 0)
				.height(height = Math.max(height * 2 - this.getHeight(), 0));
		}

		// do resize with animation
		if (this.selected && duration >= 0) {
			this.setHeight(oldHeight);
			this.$pane.animate(
				  { 'height' : height }
				, duration
				, (easing && $.easing[easing]) ? easing : 'swing'
				, function() {
					this.style.display = '';
					if ($.isFunction(callback)) callback();
				}
			);
		}

		return this;
	},

	/**
	 * select this pane.
	 * @return this instance
	 * @type Iroha.TabView.Page
	 */
	select : function() {
		this.selected = true;

		var cname = this.constructor.CLASSNAME;
		this.$tab .addClass(cname.selectedTab );
		this.$pane.addClass(cname.selectedPane);

		return this;
	},

	/**
	 * unselect this pane.
	 * @return this instance
	 * @type Iroha.TabView.Page
	 */
	unselect : function() {
		this.selected = false;

		var cname = this.constructor.CLASSNAME;
		this.$tab .removeClass(cname.selectedTab );
		this.$pane.removeClass(cname.selectedPane);

		return this;
	}
});



/* -------------------- Class : Iroha.TabView.Setting -------------------- */
/**
 * @class {@link Iroha.TabView} 用の設定オブジェクト
 */
Iroha.TabView.Setting = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * 「タブ切替ボタンコンテナ（ボタンすべてをひとまとめにしている要素ノード）」を探すためのセレクタ文字列。
	 * この要素ノードは {@link Iroha.TabView} の基底要素ノードの内部に存在しなければならない。ノード探索時にそれを前提とするため。
	 * @type String
	 */
	this.tabs = '.iroha-tabview-tabs';

	/**
	 * 「タブ切替ボタン」個々の要素ノードを探すためのセレクタ文字列。
	 * この要素ノードは「タブ切替ボタンコンテナ」の内部に存在しなければならない。ノード探索時にそれを前提とするため。
	 * @type String
	 */
	this.tab = '.iroha-tabview-tab';

	/**
	 * 「タブペインブロック」個々の要素ノードを探すためのセレクタ文字列。
	 * この要素ノードは {@link Iroha.TabView} の基底要素ノードの内部に存在しなければならない。ノード探索時にそれを前提とするため。
	 * @type String
	 */
	this.pane = '.iroha-tabView-pane';

	/**
	 * すべての「タブペインブロック」の高さを揃えるかどうか。タブ切替時に後続コンテンツがガタガタさせたくない時に。
	 * @type Boolean
	 */
	this.fixedHeight = false;

	/**
	 * タブ切替したときに選択したタブペインの id を location.hash に設定し、また location.hassh 値をもとに初期選択ペインを決定するかどうか。
	 * @type Boolean
	 */
	this.changeHash = false;

	/**
	 * アニメーション視覚効果の設定。
	 *   - {Boolean} enabled     アニメーションを有効にするかどうか
	 *   - {Number}  duration    アニメーションの所要時間
	 *   - {String}  easing      使用するイージング関数の名前
	 * @type Object
	 */
	this.effect = { 'enabled' : true, 'duration' : 250, 'easing' : 'swing' };
};

/**
 * create an instance and return.
 * @type Iroha.TabView.Setting
 */
Iroha.TabView.Setting.create = function() { return new this };



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.TabView}
 * @name Iroha.TabView.Callback
 * @namespace callback functions for {@link Iroha.TabView}
 */
/**
 * a callback for when a tab page is selected.
 * @name Iroha.TabView.Callback.onSelect
 * @function
 * @param {Iroha.TabView.Page} tabPage    tabView page instance which is selected
 */

/**
 * callback functions for {@link Iroha.TabView.Page}
 * @name Iroha.TabView.Page.Callback
 * @namespace callback functions for {@link Iroha.TabView.Page}
 */
/**
 * a callback for when "tab button" is clicked to select the page.
 * @name Iroha.TabView.Page.Callback.onSelectRequested
 * @function
 * @param {Iroha.TabView.Page} tabPage    tabView page instance which is requested to be selected
 */



})(Iroha.$, Iroha, window, document);