/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Pseudo Menu.
 *       (charset : "UTF-8")
 *
 *    @version 3.00.2013517
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
		  'baseNode'     : 'iroha-balloon iroha-pseudomenu'
		, 'selectedItem' : 'iroha-pseudomenu-selected-item'
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
		
		// add mouse events
		$(document).on('click', $.proxy(this.onDocumentMouseClick, this));
		
		// set key equivalents.
		if (Iroha.KeyEquiv) {
			var keyEquiv = Iroha.KeyEquiv.create();
			['!', '{', '}', '<', '>', '#'].forEach(function(key) {
				keyEquiv.addKey(key, this.onKeyDown, this);
			}, this);
		}
		
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
	 * @param {jQuery|Element|String} item    追加するメニュー項目の要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	addItem : function(item) {
		var $item = $(item).first()
			.mouseenter($.proxy(this.onItemMouseEnter, this))
			.click     ($.proxy(this.onItemMouseClick, this));
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
		
		} else {
			this.highlightItem(index);
			index >= 0 && this.doCallback('onSelect', index, $item);
			this.selectedIndex = index;
			return this;
		}
	},
	
	/**
	 * インデックス番号を指定してメニュー項目をハイライト（選択状態）表示にする
	 * @param {Number} index    ハイライトしたいメニュー項目のインデックス番号。整数値。 -1 を指定するとハイライト表示のものが無くなる。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 * @private
	 */
	highlightItem : function(index) {
		if (index >= -1) {
			var cname = this.constructor.CLASSNAME.selectedItem;
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
		var index = this.highlightedIndex;
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
		var index = this.highlightedIndex;
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
	 * このメニュー（フローティングバルーン）を非表示にする
	 * @return このインスタンス自身
	 * @type Iroha.PseudoMenu
	 */
	hide : function() {
		this.hideSuper();
		this.highlightItem(this.selectedIndex);
		return this;
	},
	
	/**
	 * event hander for 'click' on the document.
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onDocumentMouseClick : function(e) {
		this.isActive() && this.hide();
	},
	
	/**
	 * event hander for 'mouseenter' to the menu item.
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onItemMouseEnter : function(e) {
		this.highlightItem(this.$items.get().indexOf(e.currentTarget));
	},
	
	/**
	 * event hander for 'click' on the menu item.
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onItemMouseClick : function(e) {
		e.preventDefault();
		e.stopPropagation();
		var index = this.$items.get().indexOf(e.currentTarget);
		index > -1 && this.select(index);
		this.hide();
	},
	
	/**
	 * call back function for 'Iroha.KeyEquiv'.
	 * @param {Event}  e      event object
	 * @param {String} key    key combination defining string
	 * @private
	 */
	onKeyDown : function(e, key) {
		if (this.isActive()) {
			e.preventDefault();
			switch (key) {
				case '!' : this.select(this.selectedIndex   ); this.hide(); break;
				case '#' : this.select(this.highlightedIndex); this.hide(); break;
				case '{' : this.selectAbove(); break;
				case '<' : this.selectAbove(); break;
				case '}' : this.selectBelow(); break;
				case '>' : this.selectBelow(); break;
				default  : break;
			}
		}
	}
});



/* --------------- Class : Iroha.PseudoSelectMenu --------------- */
/**
 * @class 疑似セレクトメニュー。 <select> をマネる何か。
 */
Iroha.PseudoSelectMenu = function() {
	/**
	 * 基底要素ノード
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * このインスタンスが内部利用するホンモノの select 要素ノード
	 * @type jQuery
	 */
	this.$select = $();
	
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
	 * メニューの非表示化を許容するかどうか。
	 * @type Boolean
	 * @private
	 */
	this.hideAllowed = true;
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
	 * @param {jQuery|Element|Element}         select     このインスタンスが内包・管理 select 要素ノード
	 * @param {Iroha.PseudoSelectMenu.Setting} setting    設定オブジェクト
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	init : function(select, setting) {
		var $select = this.$select = $(select).first();
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
			
			// add callbacks to the pseudo menu
			this.pseudoMenu.addCallback('onSelect', this.onMenuSelect, this);
			
			// add mouse events, to prevent to hide the menu when focus is blured from the menu button
			this.$menuBody
				.mousedown($.proxy(function() { this.hideAllowed = false }, this))
				.mouseup  ($.proxy(function() { this.hideAllowed = true  }, this));
			
			// revising menu position when font size is changed.
			if (Iroha.FontSizeObserver) {
				Iroha.FontSizeObserver.addCallback('onChange', this.onFontSizeChanged, this);
			}
			
			// make linkage with label element
			var id     = $select.attr('id');
			var $label = id ? $('label[for="' + id + '"]') : $select.closest('label');
			$label.click($.proxy(function() {
				Iroha.delay(1, this).done(function() { this.focus() });
			}, this));
			
			// disable menu when original select element is disabled initially
			this.disabled() && this.disable();
			
			return this;
		}
	},
	
	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		this.$node      && this.$node.remove();
		this.$select    && this.$select.show();
		this.pseudoMenu && this.pseudoMenu.dispose();
		
		this.constructor.disposeInstance(this);
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
				.blur   ($.proxy(this.onMenuBtnBlur   , this))
				.keydown($.proxy(this.onMenuBtnKeyDown, this));
			
			// post process
			this.$select.after($structure).hide();
			this.$node = $structure;
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
		var $base = this.$node.css('width', '100%');  // workaround to IE7 and older
		var width = this.pseudoMenu.getGeometry().width;
		this.pseudoMenu.resizeTo(width, undefined);
		$base.css('width', 'auto');                   // workaround to IE7 and older
		this.$menuButton.width(width);
		width = 2 * width - this.$menuButton.outerWidth();
		this.$menuButton.width(width);
		
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
			this.$node.addClass(this.constructor.CLASSNAME.opened);
		}
		return this;
	},
	
	/**
	 * hide select menu body.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 * @private
	 */
	hideMenu : function() {
		if (this.hideAllowed) {
			this.pseudoMenu.hide();
			this.$node.removeClass(this.constructor.CLASSNAME.opened);
		}
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
		var text = this.$select.find('option:selected').eq(0).text();
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
	
		var tmpl = this.setting.template.menuItem;
		this.$select.find('option').get().forEach(function(option) {
			this.pseudoMenu.addItem(Iroha.String(tmpl).format(option.text).get());
		}, this);
		
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
	 * セレクトメニューの selectedIndex を取得する／変更する
	 * @param {Number} [index]    selectedIndex を変更する場合に指定。無指定時は getter として動作。
	 * @return [getter] selectedIndex, [setter] このインスタンス自身
	 * @type Number|Iroha.PseudoSelectMenu
	 */
	selectedIndex : function(index) {
		if ($.isNumeric(index) && index >= 0) {
			this.$select.prop('selectedIndex', index);
			return this;
		} else {
			return this.$select.prop('selectedIndex');
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
			this.$select.prop('disabled', disabled);
			return this;
		} else {
			return this.$select.prop('disabled');
		}
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
	 * set index number of selected item.
	 * @param {Number} index    index number to set.
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	select : function(index) {
		this.pseudoMenu.select(index);
		return this;
	},
	
	/**
	 * enable this select menu
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	enable : function() {
		this.disabled(false);
		this.$node.removeClass(this.constructor.CLASSNAME.disabled);
		return this;
	},
	
	/**
	 * disable this select menu
	 * @return このインスタンス自身
	 * @type Iroha.PseudoSelectMenu
	 */
	disable : function() {
		this.disabled(true);
		this.$node.addClass(this.constructor.CLASSNAME.disabled);
		this.isActive() && this.hideMenu();
		return this;
	},
	
	/**
	 * call back function for 'onSelect' of the menu item.
	 * @param {Number} index    index number of selected item
	 * @private
	 */
	onMenuSelect : function(index) {
		var oldIndex = this.selectedIndex();
		this.selectedIndex(index);
		this.updateMenuBtn();
		this.isActive() && this.$menuButton.focus();
		if (oldIndex != index) {
			this.$select.trigger('change');
			this.doCallback('onChange', index);
		}
	},
	
	/**
	 * event hander for menu button key down (ignore keydown of 'enter' key).
	 * @param {Event} e    event object
	 * @private
	 */
	onMenuBtnKeyDown : function(e) {
		if (!Iroha.KeyEquiv) return;
		
		var key = Iroha.KeyEquiv.create().getKeyAlias(e.keyCode);
		if (this.isActive() && [ '{', '<', '}', '>' ].indexOf(key) != -1) {
			// prevent to hide the menu when the arrow keys down.
			this.hideAllowed = false;
			Iroha.delay(1, this).done(function() { this.hideAllowed = true });
			
		} else {
			switch (key) {
				case '#' : e.preventDefault(); break;
				case '{' : e.preventDefault(); this.pseudoMenu.selectAbove(); break;
				case '<' : e.preventDefault(); this.pseudoMenu.selectAbove(); break;
				case '}' : e.preventDefault(); this.pseudoMenu.selectBelow(); break;
				case '>' : e.preventDefault(); this.pseudoMenu.selectBelow(); break;
				default  : break;
			}
		}
	},
	
	/**
	 * event hander for menu button click.
	 * @param {Event} e    event object
	 * @private
	 */
	onMenuBtnClick : function(e) {
		e.preventDefault();
		e.stopPropagation();
		this.isActive() ? this.hideMenu() : this.showMenu();
		this.focus(); // workaround for Safari
	},
	
	/**
	 * event hander for menu button blur.
	 * @param {Event} e    event object
	 * @private
	 */
	onMenuBtnBlur : function(e) {
		this.hideMenu();
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