/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Pseudo Menu.
 *       (charset : "UTF-8")
 *
 *    @version 3.08.20130727
 *    @requires jquery.js
 *    @requires jquery.mousewheel.js
 *    @requires iroha.js
 *    @requires iroha.balloon.js
 *    @requires iroha.keyEquiv.js         (optional)
 *    @requires iroha.fontSizeObserver.js (optional)
 *    @requires iroha.pseudoMenu.css
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- jQuery.fn : Iroha_PseudoSelectMenu -------------------- */
/**
 * Iroha.PseudoMenu as jQuery plugin
 * @param {Iroha.PseudoSelectMenu.Setting} setting    設定オブジェクト
 * @exports $.fn.Iroha_PseudoSelectMenu as jQuery.fn.Iroha_PseudoSelectMenu
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_PseudoSelectMenu = function(setting) {
	return this.each(function(){ Iroha.PseudoSelectMenu.create(this, setting) });
};



/* --------------- Class : Iroha.PseudoMenu --------------- */
/**
 * 選択メニュー。フローティングバルーンでもある。
 * @extends Iroha.Balloon
 */
Iroha.PseudoMenu = function() {
	/**
	 * メニューの項目を表す要素ノード群（を内包した jQuery オブジェクト）
	 * @type jQuery
	 * @private
	 */
	this.$items = $();

	/**
	 * index number of currently selected item; '-1' means 'no items are selected'.
	 * @type Number
	 */
	this.selectedIndex = -1;

	/**
	 * index number of temporary selected item; '-1' means 'no items are selected'.
	 * @type Number
	 */
	this.highlightedIndex = -1;
};

Iroha.ViewClass(Iroha.PseudoMenu).extend(Iroha.Balloon);

$.extend(Iroha.PseudoMenu,
/** @lends Iroha.PseudoMenu */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 * @deprecated
	 */
	BASE_CLASSNAME : 'iroha-balloon iroha-pseudomenu',

	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode'     : メニュー　UI の基底要素ノードであることを示す
	 *   - 'selectedItem' : メニュー項目のうち現在選択されている（見えている）ものを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode'        : 'iroha-balloon iroha-pseudomenu'
		, 'highlightedItem' : 'iroha-pseudomenu-highlighted-item'
		, 'selectedItem'    : 'iroha-pseudomenu-selected-item'
	},

	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {Iroha.PseudoMenu.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : Iroha.Balloon.create
});

$.extend(Iroha.PseudoMenu.prototype,
/** @lends Iroha.PseudoMenu.prototype */
{
	/** @private */
	initSuper : Iroha.Balloon.prototype.init,

	/** @private */
	showSuper : Iroha.Balloon.prototype.show,

	/** @private */
	hideSuper : Iroha.Balloon.prototype.hide,

	/**
	 * 初期化
	 * @param {Iroha.PseudoMenu.Setting} setting    設定オブジェクト
	 * @return this instance
	 * @type Iroha.PseudoMenu
	 */
	init : function(setting) {
		var setting = $.extend(Iroha.PseudoMenu.Setting.create(), setting);
		this.initSuper(setting);

		this.$node
			.on('click'     , $.proxy(this.onMouseClick, this))
			.on('mouseover' , $.proxy(this.onMouseOver , this))
			.on('mousewheel', $.proxy(this.onMouseWheel, this))
			.on('keydown'   , $.proxy(this.onKeyDown   , this));

		return this;
	},

	/**
	 * メニュー項目の要素ノード群を得る
	 * @return メニュー項目の要素ノード群を内容した jQuery オブジェクト
	 * @type jQuery
	 */
	getItems : function() {
		return this.$items;
	},

	/**
	 * メニュー項目を追加する。
	 * @param {jQuery|Element|Element[]|NodeList|String} item    追加するメニュー項目の要素ノード(群)
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	addItem : function(item) {
		var $item = $(item);
		this.addContent($item);
		this.$items = this.$items.add($item);
		this.doCallbackByName('onContentChange');
		return this;
	},

	/**
	 * インデックス番号を指定してメニュー項目を削除する
	 * @param {Number} index    削除するメニュー項目の番号
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	removeItem : function(index) {
		var $item = this.$items.eq(index);

		if (!$item.length) {
			throw new RangeError('Iroha.PseudoMenu#removeItem: 不正なインデックス番号を指定しています。');

		} else {
			this.$items.splice(index, 1).remove();
			this.selectedIndex == index && this.unselect();
			this.doCallbackByName('onContentChange');
			return this;
		}
	},

	/**
	 * すべてのメニュー項目を削除する
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	removeItems : function() {
		this.$items = $();
		this.unselect();
		this.clearContent();
		this.doCallbackByName('onContentChange');
		return this;
	},

	/**
	 * インデックス番号を指定してメニュー項目を選択する
	 * @param {Number} index    選択したいメニュー項目のインデックス番号。整数値。 -1 を指定すると全項目が非選択状態になる。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	select : function(index) {
		var $item = this.$items.eq(index);

		if (!$item.length && index < -1) {
			throw new RangeError('Iroha.PseudoMenu#select: 不正なインデックス番号を指定しています。');
		}

		this.highlight(index);

		var cname = this.constructor.CLASSNAME.selectedItem;
		this.$items.removeClass(cname);

		if (index >= 0) {
			this.$items.eq(index).addClass(cname).attr('tabindex', 0).focus();

			if (this.selectedIndex != index) {
				this.selectedIndex = index;
				this.doCallback('onSelect', index, $item);
			}
		}
		return this;
	},

	/**
	 * インデックス番号を指定してメニュー項目をハイライト（選択状態）表示にする
	 * @param {Number} index    ハイライトしたいメニュー項目のインデックス番号。整数値。 -1 を指定するとハイライト表示のものが無くなる。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 * @private
	 */
	highlight : function(index) {
		if (index >= -1) {
			var cname = this.constructor.CLASSNAME.highlightedItem;
			this.$items.removeClass(cname);
			index >= 0 && this.$items.eq(index).addClass(cname);
			this.highlightedIndex = index;
		}

		return this;
	},

	/**
	 * いま選択されている項目の1つ上のものを選択する
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	selectAbove : function() {
		var index = this.selectedIndex;
		index == -1 && (index = this.$items.length);
		index >   0 && this.select(index - 1);
		return this;
	},

	/**
	 * いま選択されている項目の1つ下のものを選択する
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	selectBelow : function() {
		var index = this.selectedIndex;
		index < this.$items.length - 1 && this.select(index + 1);
		return this;
	},

	/**
	 * すべての項目を非選択にする
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	unselect : function() {
		this.select(-1);
		return this;
	},

	/**
	 * このメニュー（フローティングバルーン）を表示する
	 * @param {Arguments} args    {@link Iroha.Balloon#show} を参照のこと。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	show : function(args) {
		this.showSuper.apply(this, arguments);
		this.$node.slideUp(0).slideDown(100);
		Iroha.delay(16, this).done(function() { this.select(this.selectedIndex) });  // フォーカスがうまく当たらない IE 対策で僅かにディレイ
		return this;
	},

	/**
	 * このメニュー（フローティングバルーン）を閉じる
	 * @param {Arguments} args    {@link Iroha.Balloon#hide} を参照のこと。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	hide : function(args) {
		var args = arguments;
		this.$node.slideUp(100, $.proxy(function() { this.hideSuper.apply(this, args) }, this));
		return this;
	},

	/**
	 * event hander for 'click' on this menu
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onMouseClick : function(e) {
		e.preventDefault();
		var target = e.target;
		var $items = this.$items;
		var item   = $items.filter(target).get(0) || $items.has(target).get(0);
		var index  = $items.get().indexOf(item);
		index > -1 && this.select(index);
		this.hide();
	},

	/**
	 * event hander for 'mouseover' on this menu
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onMouseOver : function(e) {
		var target = e.target;
		var $items = this.$items;
		var item   = $items.filter(target).get(0) || $items.has(target).get(0);
		var index  = $items.get().indexOf(item);
		this.highlight(index);
	},

	/**
	 * event hander for 'mousewheel' on this menu.
	 * メニュー内のホイールスクロールをなるべく祖先要素へ伝達させないようにがんばる。
	 * @param {Event}  e    event object
	 * @param {Number} d    wheelDelta
	 * @private
	 * @event
	 */
	onMouseWheel : function(e, d) {
		var $node  = this.$body;
		var height = $node.prop('scrollHeight') - $node.height();
		var scrTop = $node.scrollTop();
		(d < 0 && scrTop == height || d > 0 && scrTop == 0) && e.preventDefault();
	},

	/**
	 * call back function for 'Iroha.KeyEquiv'.
	 * @param {Event}  e      event object
	 * @param {String} key    key combination defining string
	 * @private
	 */
	onKeyDown : function(e) {
		if (!Iroha.KeyEquiv ) return;
		if (!this.isActive()) return;

		var key = Iroha.KeyEquiv.getKeyAlias(e.keyCode);
		switch (key) {
			case '!' /* ESC   */ : e.preventDefault(); this.hide(); break;
			case '#' /* Enter */ : e.preventDefault(); this.hide(); break;
			case '{' /* Up    */ : e.preventDefault(); this.selectAbove(); break;
			case '<' /* Left  */ : e.preventDefault(); this.selectAbove(); break;
			case '}' /* Down  */ : e.preventDefault(); this.selectBelow(); break;
			case '>' /* Right */ : e.preventDefault(); this.selectBelow(); break;
			default : break;
		}
	}
});



/* --------------- Class : Iroha.PseudoSelectMenu --------------- */
/**
 * @class 疑似セレクトメニュー。 <select> をマネる何か。
 */
Iroha.PseudoSelectMenu = function() {
	/**
	 * このインスタンスが内部利用するホンモノの select 要素ノード
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * 疑似セレクトメニュー構造の外殻たる要素ノード
	 * @type jQuery
	 * @private
	 */
	this.$structure = $();

	/**
	 * メニューを出すボタンの要素ノード。
	 * @type jQuery
	 */
	this.$menuButton = $();

	/**
	 * 選択メニュー本体を格納するコンテナ要素ノード
	 * @type Element
	 * @private */
	this.$menuBody = $();

	/**
	 * 選択メニュー本体。Iroha.PseudoMenu インスタンス。
	 * @type Iroha.PseudoMenu
	 * @private
	 */
	this.pseudoMenu = undefined;

	/**
	 * 監視タイマー。ホンモノの select 要素ノードの checked, disabled 状態を監視。
	 * @type Iroha.Interval
	 * @private
	 */
	this.watcher = undefined;
};

Iroha.ViewClass(Iroha.PseudoSelectMenu).extend(Iroha.Observable);

$.extend(Iroha.PseudoSelectMenu,
/** @lends Iroha.PseudoSelectMenu */
{	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode' : 疑似セレクトメニューの基底要素ノードであることを示す
	 *   - 'disabled' : 疑似セレクトメニューが disabled 状態のときに基底要素ノードに付与される
	 *   - 'opened'   : 疑似セレクトメニューのメニューが開かれている（表示されている）ときに基底要素ノードに付与される
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode' : 'iroha-pseudoselectmenu'
		, 'disabled' : 'iroha-pseudoselectmenu-disabled'
		, 'opened'   : 'iroha-pseudoselectmenu-opened'
	}
});

$.extend(Iroha.PseudoSelectMenu.prototype,
/* @lends Iroha.PseudoSelectMenu.prototype */
{
	/**
	 * 初期化
	 * @param {jQuery|Element|Element}         select     このインスタンスが内包・管理する select 要素ノード
	 * @param {Iroha.PseudoSelectMenu.Setting} setting    設定オブジェクト
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	init : function(select, setting) {
		var $select = this.$node   = $(select).first();
		var setting = this.setting = $.extend(Iroha.PseudoSelectMenu.Setting.create(), setting);

		if (!$select.is('select')) {
			throw new TypeError('Iroha.PseudoSelectMenu#init: 第1引数には <select> 要素ノードを指定してください。');

		} else {
			$select.hide();

			var template = setting.template.menuItems;
			var bodyExpr = $(template).get(0).nodeName;

			// create menu
			this.pseudoMenu = Iroha.PseudoMenu.create().applyTemplate(template, bodyExpr);
			this.createStructure();
			this.update();

			// move the menu balloon into this strucure.
			this.pseudoMenu.appendTo(this.$menuBody).hide(); // "hide()" is a workaround for WinIE7 and older.
			this.adjustMenuWidth();

			// ホンモノの select を外部から直接 change がトリガーされたら、それを拾う。
			$select.on('change', $.proxy(function(e){
				this.lock || this.select(this.selectedIndex());
			},this))

			// add callbacks to the pseudo menu
			this.pseudoMenu.addCallback('onSelect', this.selectedIndex, this);
			this.pseudoMenu.addCallback('onHide'  , this.hideMenu     , this);

			// add mouse events, to hide menu when document clicked
			$(document).on('click', $.proxy(this.onDocumentClick, this));

			// revising menu position when font size is changed.
			if (Iroha.FontSizeObserver) {
				Iroha.FontSizeObserver.addCallback('onChange', this.onFontSizeChanged, this);
			}

			// label 要素のクリックで疑似セレクトメニューの開閉ボタンにフォーカスをあてる
			var id     = $select.attr('id');
			var $label = id ? $('label[for="' + id + '"]') : $select.closest('label');
			$label.click($.proxy(function(e) {
				// 疑似セレクトメニュー内部の click は無視する
				this.$structure.has(e.target).length || this.focus();
			}, this));

			// disable menu when original select element is disabled initially
			this.disabled(this.disabled());

			// ウオッチ開始
			this.watch();

			return this;
		}
	},

	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		this.watcher    && this.watcher.clear();
		this.$structure && this.$structure.remove();
		this.$node      && this.$node.show();
		this.pseudoMenu && this.pseudoMenu.dispose();

		this.constructor.disposeInstance(this);
	},

	/**
	 * ホンモノの select 要素ノードの selected, disabled 状態変化の監視を開始する
	 * @param {Number} [interval=100]    監視間隔。ミリ秒指定。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	watch : function(interval) {
		if (!this.watcher) {
			var interval = Math.max(interval, 100) || 100;
			var node     = this.$node.get(0);
			var selIndex = node.selectedIndex;
			var disabled = node.disabled;

			this.watcher = Iroha.Interval.create(function() {
				selIndex != node.selectedIndex  && this.select  (selIndex = node.selectedIndex);
				disabled != node.disabled       && this.disabled(disabled = node.disabled     );
			}, interval, this);
		}

		return this;
	},

	/**
	 * ホンモノの select 要素ノードの selected, disabled 状態変化の監視を停止する
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	unwatch : function() {
		this.watcher && this.watcher.clear();
		this.watcher = undefined;
		return this;
	},

	/**
	 * create HTML-structure of pseudo select menu.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	createStructure : function() {
		// preparation
		var setting    = this.setting;
		var tmpl       = setting.template;
		var resolver   = setting.resolver;
		var $structure = $(tmpl.structure);

		// lookup key nodes
		this.$menuButton = $structure.find(resolver.menuButton).first();
		this.$menuBody   = $structure.find(resolver.menuBody  ).first();

		if (!this.$menuButton.length || !this.$menuBody.length) {
			throw new ReferenceError('Iroha.PseudoSelectMenu#createStructure: required nodes are not found.');

		} else {
			// cleanup content of the key nodes
			this.$menuButton.empty();
			this.$menuBody  .empty();

			// add event listener
			this.$menuButton
				.click  ($.proxy(this.onMenuBtnClick  , this))
				.keydown($.proxy(this.onMenuBtnKeyDown, this));

			// post process
			this.$node.after($structure).hide();
			this.$structure = $structure;
		}

		return this;
	},

	/**
	 * adjust width of the menu button.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	adjustMenuWidth : function() {
		var $base     = this.$structure .css('width', '100%');  // workaround to IE7 and older
		var $btn      = this.$menuButton.css('width', 'auto');
		var menu      = this.pseudoMenu.resizeTo(0, -1);        // width:auto, height:ママ
		var baseWidth = $base.outerWidth();
		var menuWidth = menu.getGeometry().width;
		var btnWidth  = Math.min(menuWidth, baseWidth);

		$btn.width(btnWidth).width(2 * btnWidth - $btn.outerWidth());  // padding 考慮で幅調整
		menu.resizeTo(menuWidth, -1);
		$base.css('width', 'auto');   // workaround to IE7 and older

		return this;
	},

	/**
	 * show select menu body at neighborhood of the menu button.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	showMenu : function() {
		if (!this.disabled()) {
			var $btn = this.$menuButton;
			var pos  = $btn.position();
			this.pseudoMenu.show(pos.left, pos.top + $btn.outerHeight());
			this.$structure.addClass(this.constructor.CLASSNAME.opened);
		}
		return this;
	},

	/**
	 * hide select menu body.
	 * @param {Boolean} withFocus    無指定または true のとき、メニューを閉じた後開閉ボタンにフォーカスを当てる。 false 指定の場合はフォーカス当てない。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	hideMenu : function(withFocus) {
		withFocus === false || this._denyFocus_ || this.focus();

		// 選択メニューをクリックやキー操作で選択操作したときは、メニュー開閉ボタンにフォーカスをあてたい。
		// 対して、ドキュメント余白クリックしたときは、フォーカスを当てたくない。
		// ドキュメントクリック時はこのメソッドが連続2度呼ばれる。
		//（1度目は document.onclick イベント、2度目はこのメソッド内で pseudoMenu.hide() によるコールバック）
		// withFocus 引数は、1度目の呼び出し時は明確に true/false を指定できるが、2度目はそのシチュエーション的に引数を決定できない。
		// そのため、呼び出し1度目の withFocus 引数の値を採用してフォーカスを当てるか判定、2度目の呼び出し時は無視する。
		this._denyFocus_ = true;
		Iroha.delay(16, this).done(function() { delete this._denyFocus_ });

		this.pseudoMenu.isActive() && this.pseudoMenu.hide();
		this.$structure.removeClass(this.constructor.CLASSNAME.opened);

		return this;
	},

	/**
	 * update this select menu using values of select element node
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	update : function() {
		this.updateMenuBtn();
		this.updateMenuItems();
		return this;
	},

	/**
	 * update text of menu button.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	updateMenuBtn : function() {
		var text = this.$node.find('option:selected').eq(0).text();
		this.$menuButton.empty().append(text);
		return this;
	},

	/**
	 * update menu items in the menu body.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	updateMenuItems : function() {
		this.pseudoMenu.removeItems();

		var tmpl  = this.setting.template.menuItem;
		var items = this.$node.find('option').get().map(function(option) {
			return Iroha.String(tmpl).format(option.text).get()
		}, this);
		this.pseudoMenu.addItem(items.join(''));
		this.adjustMenuWidth();

		this.select(this.selectedIndex());
		return this;
	},

	/**
	 * is this menu activated?
	 * @return true if this menu is activated.
	 * @type Boolean
	 */
	isActive : function() {
		return this.pseudoMenu.isActive();
	},

	/**
	 * focus to menu button; without change of menu body' visibility.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	focus : function() {
		this.$menuButton.focus();
		return this;
	},

	/**
	 * インデックス番号指定でメニューの選択項目を変更する。{@link #selectedIndex} へのショートカット。
	 * @param {Number} index    インデックス番号 (selectedIndex)
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	select : function(index) {
		return this.selectedIndex(index);
	},

	/**
	 * セレクトメニューの selectedIndex を取得する／変更する
	 * @param {Number} [index]    selectedIndex を変更する場合に指定。無指定時は getter として動作。
	 * @return [getter] selectedIndex, [setter] このインスタンス自身
	 * @type Number|Iroha.PseudoSelectMenu
	 */
	selectedIndex : function(index) {
		if ($.isNumeric(index) && index >= 0) {
			var oldIndex = this.selectedIndex();
			this.$node.prop('selectedIndex', index);
			this.pseudoMenu.select(index);
			this.updateMenuBtn();

			if (oldIndex != index) {
				this.lock = true;   // [TEMPORARY] 無限ループ抑止のフラグ
				this.$node.trigger('change');
				this.lock = false;  // [TEMPORARY] 無限ループ抑止のフラグ
				this.doCallback('onChange', index);
			}

			return this;

		} else {
			return this.$node.prop('selectedIndex');
		}
	},

	/**
	 * セレクトメニューの disabled 状態を取得する／変更する
	 * @param {Boolean} [disabled]    disabled 状態を変更する場合に指定。無指定時は getter として動作。
	 * @return [getter] 真偽値, [setter] このインスタンス自身
	 * @type Boolean|Iroha.PseudoSelectMenu
	 */
	disabled : function(disabled) {
		if ($.type(disabled) == 'boolean') {
			this.$node.prop('disabled', disabled);
			this.$structure.toggleClass(this.constructor.CLASSNAME.disabled, disabled);
			disabled && this.hideMenu(false);
			return this;

		} else {
			return this.$node.prop('disabled');
		}
	},

	/**
	 * event hander for menu button key down (ignore keydown of 'enter' key).
	 * @param {Event} e    event object
	 * @private
	 */
	onMenuBtnKeyDown : function(e) {
		if (!Iroha.KeyEquiv ) return;
		if ( this.disabled()) return;

		var key = Iroha.KeyEquiv.getKeyAlias(e.keyCode);
		switch (key) {
			case '#' /* Enter */ : e.preventDefault(); this.showMenu(); break;
			case '{' /* Up    */ : e.preventDefault(); this.pseudoMenu.selectAbove(); break;
			case '<' /* Left  */ : e.preventDefault(); this.pseudoMenu.selectAbove(); break;
			case '}' /* Down  */ : e.preventDefault(); this.pseudoMenu.selectBelow(); break;
			case '>' /* Right */ : e.preventDefault(); this.pseudoMenu.selectBelow(); break;
			default : break;
		}
	},

	/**
	 * event hander for 'click' on the document.
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onDocumentClick : function(e) {
		!this.$structure.has(e.target).length && this.isActive() && this.hideMenu(false);
	},

	/**
	 * event hander for menu button click.
	 * @param {Event} e    event object
	 * @private
	 */
	onMenuBtnClick : function(e) {
		e.preventDefault();
		this.isActive() ? this.hideMenu() : this.showMenu();
	},

	/**
	 * call back function for 'onChange' of BAFontSizeObserver.
	 * @private
	 */
	onFontSizeChanged : function() {
		this.adjustMenuWidth();
		this.isActive() && this.showMenu();
	}
});



/* -------------------- Class : Iroha.PseudoMenu.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PseudoMenu}.
 * @extend Iroha.Balloon.Setting
 */
Iroha.PseudoMenu.Setting = function() {
};

Iroha.PseudoMenu.Setting.prototype = new Iroha.Balloon.Setting;

/**
 * create an instance and return.
 * @type Iroha.PseudoMenu.Setting
 */
Iroha.PseudoMenu.Setting.create = function() {
	return new this;
};



/* -------------------- Class : Iroha.PseudoSelectMenu.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PseudoSelectMenu}.
 */
Iroha.PseudoSelectMenu.Setting = function() {
	/**
	 * 疑似セレクトメニューの構造を作り出す HTML テンプレート
	 *   - 'structure' : 疑似セレクトメニュー全体の構造。最低限、メニューを開くボタンとメニューの本体を内包する構造が必要。
	 *   - 'menuItems' : メニュー項目群を内包することになるコンテナ要素
	 *   - 'menuItem'  : メニュー項目のひとつひとつ。${0} としたところに項目のテキストが入る。
	 * @type Object
	 */
	this.template = {
		  'structure' : '<dl class="iroha-pseudoselectmenu">'
		              + '<dt><a href="#"></a></dt>'
		              + '<dd></dd>'
		              + '</dl>'
		, 'menuItems' : '<ul></ul>'
		, 'menuItem'  : '<li>${0}</li>'
	};

	/**
	 * 疑似セレクトメニューの HTML 構造の特定部位を見つけるためのセレクタ文字列。t
	 * セレクタのコンテキストは this.template.structure の最外縁の要素ノード。
	 *   - 'menuButton' : メニューを開くボタンとなる部位
	 *   - 'menuBody'   : メニュー本体を格納する場所
	 * @type Object
	 */
	this.resolver = {
		  'menuButton' : 'dt a'
		, 'menuBody'   : 'dd'
	};
};

/**
 * create an instance and return.
 * @type Iroha.PseudoSelectMenu.Setting
 */
Iroha.PseudoSelectMenu.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.PseudoMenu}
 * @name Iroha.PseudoMenu.callback
 * @namespace callback functions for {@link Iroha.PseudoMenu}
 */
/**
 * a callback for when the dialog is shown - inherited from Iroha.Balloon
 * @name Iroha.PseudoMenu.callback.onShow
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is moved position - inherited from Iroha.Balloon
 * @name Iroha.PseudoMenu.callback.onMove
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog balloon's size is changed - inherited from Iroha.Balloon
 * @name Iroha.PseudoMenu.callback.onResize
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is hidden - inherited from Iroha.Balloon
 * @name Iroha.PseudoMenu.callback.onHide
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when menu item(s) are added or removed.
 * @name Iroha.PseudoMenu.callback.onContentChange
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when a menu item is selected, or unselected all items.
 * @name Iroha.PseudoMenu.callback.onSelect
 * @function
 * @param {Number} index    index number of an item selected (integer); '-1' means all items are  unselected.
 * @param {jQuery} item     an element node of selected menu item.
 */



/**
 * callback functions for {@link Iroha.PseudoSelectMenu}
 * @name Iroha.PseudoSelectMenu.callback
 * @namespace callback functions for {@link Iroha.PseudoSelectMenu}
 */
/**
 * a callback for when a menu item is selected, or unselected all items.
 * @name Iroha.PseudoMenu.callback.onChange
 * @function
 * @param {Number} index    index number of the currently selected item.
 */



})(Iroha.$, Iroha, window, document);