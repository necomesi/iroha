/*! "iroha.textExpander.js" | Iroha - Necomesi JSLib : Text Expander | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Text Expander
 *
 *    @version 3.01.20131016
 *    @requires jquery.js
 *    @requires jquery.easing.js
 *    @requires iroha.js
 *    @requires ierange.js    (optional, for IE8 and earlier, use one of them)
 *    @requires rangy-core.js (optional, for IE8 and earlier, use one of them)
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- jQuery.fn : Iroha_TextExpander -------------------- */
/**
 * Iroha.TextExpander as jQuery plugin
 * @exports $.fn.Iroha_TextExpander as jQuery.fn.Iroha_TextExpander
 * @param {Iroha.TextExpander.Setting} [setting]    setting object for the instance
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_TextExpander = function(setting) {
	return this.each(function() { Iroha.TextExpander.create(this, setting) });
};



/* --------------- Class : Iroha.TextExpander --------------- */
/**
 * @class 長い内容を途中で省略し「続きを読む」で伸張できるブロック
 */
Iroha.TextExpander = function() {
	/**
	 * 伸張対象を内容に持つコンテナ要素。（基底要素ノード）
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * 基底要素ノードに初期状態で入っていたオリジナルの内容
	 * @type jQuery
	 * @private
	 */
	this.$content = $();

	/**
	 * 「続きを読む」ボタンの要素ノード
	 * @type jQuery
	 * @private
	 */
	this.$button = $();

	/**
	 * 設定オブジェクト
	 * @type Iroha.TextExpander.Setting
	 */
	this.setting = undefined;
};

Iroha.ViewClass(Iroha.TextExpander);

$.extend(Iroha.TextExpander.prototype,
/** @lends Iroha.TextExpander.prototype */
{
	/**
	 * 初期化
	 * @param {jQuery|Element|String}      node         伸張対象のテキストノードを保持している単体の要素ノード
	 * @param {Iroha.TextExpander.Setting} [setting]    設定オブジェクト
	 * @return このインスタンス自身
	 * @type Iroha.TextExpander
	 */
	init : function(node, setting) {
		this.setting  = $.extend(Iroha.TextExpander.Setting.create(), setting);
		this.$node    = $(node).eq(0);
		this.$content = this.$node.contents();

		var fulltext  = this.$node.Iroha_getInnerText();  // jQuery の .text() だと IE8 以下で改行文字が消失するのでダメ。
		var threshold = Math.max(0, this.setting.threshold) || fulltext.length;
		var template  = this.setting.template;

		if (threshold >= fulltext.length) {
			this.$node
				.addClass(this.setting.className.discarded);

		} else {
			var $fragment = this.getFragment(threshold);
			var $ellipsis = $(template.ellipsis);

			this.$node
				.empty()
				.append($fragment)
				.append($ellipsis)
				.addClass(this.setting.className.enabled);

			this.$button = $(template.button)
				.insertAfter(this.$node)
				.click($.proxy(function(e) {
					e.preventDefault();
					this.expand();
				}, this));
		}
		return this;
	},

	/**
	 * 基底要素の内容を、指定文字数になるように分割した断片の要素ノードを得る。
	 * @param {Number} threshold
	 * @return jQuery オブジェクト
	 * @type jQuery
	 * @private
	 */
	getFragment : function(threshold) {
		var range = document.createRange();
		var node  = this.$node.get(0);
		var count = 0;

		range.selectNodeContents(node);
		(function(_node) {
			var _callee = arguments.callee;
			$(_node).contents().each(function() {
				switch(this.nodeType) {
					case 1 :
						_callee(this);
						break;
					case 3 :
						range.setEnd(this, Math.min(threshold - count, this.nodeValue.length));
						count += this.nodeValue.length
						break;
				}
				return (threshold > count);
			});
		})(node);
		return $(range.cloneContents());
	},

	/**
	 * テキスト部分を伸張して全文を見せる。
	 * @return このインスタンス自身
	 * @type Iroha.TextExpander
	 */
	expand : function() {
		var setting    = this.setting;
		var overflow   = this.$node.css('overflow');
		var fromHeight = this.$node.height();
		var toHeight   = this.$node.empty().append(this.$content).addClass(setting.className.expanded).height();

		this.$button.css('visibility', 'hidden');
		this.$node
			.height(fromHeight)
			.css('overflow', 'hidden')
			.animate({ height : toHeight}, setting.duration, setting.easing, $.proxy(function() {
				this.$node.height('auto').css('overflow', overflow);
//				this.$button.remove();
			}, this));
		return this;
	}
});



/* -------------------- Class : Iroha.TextExpander.Setting -------------------- */
/**
 * @class setting data object for {@link Iroha.TextExpander}
 */
Iroha.TextExpander.Setting = function() {
	/**
	 * 各部分のテンプレート。HTML文字列
	 * @type Object
	 */
	this.template = {
		  'ellipsis' : '<span class="iroha-textexpander-ellipsis">...</span>'
		, 'button'   : '<p class="iroha-textexpander-button">[<a href="#">続きをみる</a>]</p>'
	};

	/**
	 * 各状態における cLassName 。
	 */
	this.className = {
		  'enabled'   : 'iroha-textexpander-enabled'
		, 'expanded'  : 'iroha-textexpander-expanded'
		, 'discarded' : 'iroha-textexpander-discarded'
	};

	/**
	 * 初期状態で見せるテキストの文字数（分割点）。非負整数。
	 * @type Number
	 */
	this.threshold = 150;

	/**
	 * 伸張アニメーションの所要時間（ミリ秒）。非負整数
	 * @type Number
	 */
	this.duration = 500;

	/**
	 * 伸張アニメで用いるイージング関数の名前
	 * @type String
	 */
	this.easing = 'easeInOutCubic';
};

/**
 * create an instance and return.
 * @type Iroha.Carousel.Setting
 */
Iroha.TextExpander.Setting.create = function() {
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



})(Iroha.$, Iroha, window, document);