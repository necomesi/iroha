/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       create text-input with prompt text.
 *
 *    @version 3.00.20130430
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- jQuery.fn : Iroha_InputPrompt -------------------- */
/**
 * Iroha.InputPrompt as jQuery plugin
 * @exports $.fn.Iroha_InputPrompt as jQuery.fn.Iroha_InputPrompt
 * @param {Object} [setting]    設定オブジェクト
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_InputPrompt = function(setting) { 
	return this
		.filter(function() { return Iroha.InputPrompt.isValidNode(this)     })
		.each  (function() {        Iroha.InputPrompt.create(this, setting) });
};



/* -------------------- Class : Iroha.InputPrompt -------------------- */
/**
 * provides "input prompt" for text-input elements
 * @class input prompt
 */
Iroha.InputPrompt = function() {
	/**
	 * 基底要素ノード。テキスト入力欄。 (input:text, textarea)
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * ガイダンステキスト。薄色のテキストとして表現される、いわゆるプレースホルダ文字列。
	 * @type String
	 *  @private
	 */
	this.prompt = '';
	
	/**
	 * 案内テキストを表示している状態かどうか
	 * @type Boolean
	 */
	this.prompted = false;
	
	/**
	 * 基底要素ノード（テキスト入力欄）にフォーカスがあたっているかどうか
	 * @type Boolean
	 */
	this.focused = false;
	
	/**
	 * 従来とおなじ挙動の互換動作をしているかどうか
	 * @type Boolean
	 */
	this.compatMode = true;
};

Iroha.ViewClass(Iroha.InputPrompt);

$.extend(Iroha.InputPrompt,
/** @lends Iroha.InputPrompt */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode' : 基底要素ノードであることを示す
	 *   - 'changed'  : 入力内容が初期状態から変化していることを示す
	 *   - 'focused'  : 入力欄にフォーカスしていることを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode' : 'iroha-inputprompt'
		, 'changed'  : 'iroha-inputprompt-changed'
		, 'focused'  : 'iroha-inputprompt-focus'
	},

	/**
	 * 適合検証。与えた要素ノードがこのクラスの適用対象としてふさわしいか確認。
	 * @param {jQuery|Element|String} node    検証対象の要素ノード
	 * @return 適合していれば true そうでなければ false
	 * @type Boolean
	 */
	isValidNode : function(node) {
		return $(node).eq(0).is('input:text, input:password, textarea');
	},
	
	/**
	 * 指定のセレクタで見つかる要素ノードに自動適用する。
	 * 今はまだ見つからない（存在しない）対象も、見つかった（存在することがわかった）時に自動適用する。
	 * @param {String}                    selector  適用対象の要素ノードを見つけるためのセレクタ文字列。
	 * @param {Iroha.InputPrompt.Setting} [setting] 設定オブジェクト
	 * @return このコンストラクタ（クラスオブジェクト）自身
	 * @type Function
	 */
	autoSetup : function(selector, setting) {
		if ($.type(selector) == 'string' && selector) {
			// 現在見つかる対象に適用
			$(selector).Iroha_InputPrompt(setting);
			
			// 今はまだ存在しない対象はオンデマンドで適用
			$(document).on('focus', selector, function() { $(this).Iroha_InputPrompt(setting) });
		}
	}
});

$.extend(Iroha.InputPrompt.prototype,
/** @lends Iroha.InputPrompt.prototype */
{
	/**
	 * 初期化
	 * @param {jQuery|Element|String}     node      テキスト入力できるフォーム系要素ノード
	 * @param {Iroha.InputPrompt.Setting} [setting] 設定オブジェクト
	 * @return このインスタンス自身
	 * @type BAJL.InputPrompt
	 */
	init : function(node, setting) {
		if (!this.constructor.isValidNode(node)) {
			throw new TypeError('Iroha.InputPrompt.init: processing target element is not acceptable.');
		}
		
		setting = $.extend(Iroha.InputPrompt.Setting.create(), setting);
		
		this.$node   = $(node).eq(0).addClass(this.constructor.CLASSNAME.baseNode);
		this.prompt  = this.$node.attr(setting.fromAttr) || setting.prompt;

		// 従来とおなじ互換動作にするかを判定
		var ua   = Iroha.ua;
		var vers = ua.isIE ? Iroha.ua.documentMode : Iroha.ua.version;
		this.compatMode = setting.fromAttr != 'placeholder' ||
		                  setting.forceCompat               ||
//		                  !ua.isMobile                      ||
		                  (ua.isSafari && vers < 533)       ||  /* Safari 5.0, Chrome 5.0 より以前 */
		                  (ua.isChrome && vers < 5)         ||  /* Safari 5.0, Chrome 5.0 より以前 */
		                  (ua.isGecko  && vers < 4  )       ||  /* Mozilla Firefox 4.0    より以前 */
		                  (ua.isIE     && vers < 10  )      ||  /* Internet Explorer 10.0 より以前 */
		                  (ua.isOpera  && vers < 9  )       ||  /* Opera 9.0              より以前 */
		                  false;
		
		if (!this.compatMode) {
			this.setText(this.$node.val());
		
		} else {
			this.$node.attr(setting.fromAttr, '');
			this.setText(this.$node.val());
			
			// ブラウザの自動入力機能によって入力値が入れこまれるのを監視して反映。
			// ただし、現在の案内テキストと完全同一の値が入れこまてきた事の判別は原理的に不可能のため、案内テキスト表示状態のままとなる。
			var observer = $.proxy(function() {
				var value = this.$node.val();
				if (!value || value != this.getPrompt()) {
					this.setText(value);
				}
 			}, this);
			 
			// 監視開始
			observer();
			var timer = new Iroha.Interval(observer, 500, this);
			
			// 監視終了
			if (!Iroha.ua.isIE || !this.$node.is(':password')) {
				this.$node.focus (function() { timer.clear() });
				new Iroha.Timeout(function() { timer.clear() }, 5000);
			}
		}
		
		// add event listeners
		this.$node
			.focus($.proxy(this.onFocus, this))
			.blur ($.proxy(this.onBlur , this))
			.closest('form').submit($.proxy(this.clearPrompt, this));  // POST データに案内テキストが含まれないように。
		$(window)
			.Iroha_addBeforeUnload(function() {
				// history を行き来したあと、フォーカス状態を復元されると都合が悪い(IEなど)。よってこの段階で blur しておく。
				this.focused && this.$node.blur();
				
				// histroy を行き来したあと、案内テキストがふつうのテキストとして復元されてしまわないために消去しておく。
				this.clearPrompt();
				
				// 他のスクリプトが beforeUnload でページ退去確認ダイアログを出した場合、
				// ユーザが「退去しない」を選択したときに案内テキストを戻さないとならない。
				new Iroha.Timeout(function() {
					// 他JSの処理により案内テキストがふたがび表示された状態になっていた場合と、
					// フォーカスが当たっていた場合はスルーしないと変になる
					this.prompted || this.focused || this.setText(this.$node.val());
				}, 100, this);
				
			}, this); 
		
		return this;
	},
	
	/**
	 * get prompt text
	 * @return prompt text
	 * @type String
	 */
	getPrompt : function() {
		return this.prompt;
	},
	
	/**
	 * set prompt text
	 * @param {String} value    value to set
	 * @return this instance
	 * @type Iroha.InputPrompt
	 */
	setPrompt : function(prompt) {
		if (typeof prompt != 'string') {
			throw new TypeError('Iroha.InputPrompt.setPrompt: first argument must be a string.');
		} else if (!this.compatMode) {
			this.prompt = prompt;
			this.$node.attr('placeholder', prompt);
		} else {
			this.getText() || this.$node.val('');  // preparation for switching prompt text
			this.prompt = prompt;
			this.fillPrompt();
		}
		return this;
	},
	
	/**
	 * get current text in the text-input (ignoring prompt text)
	 * @return current value of text-input (ignoring prompt text)
	 * @type String
	 */
	getText : function() {
		return this.prompted ? '' : this.$node.val();
	},
	
	/**
	 * set text to the text-input (considering prompt text)
	 * @param {String} value    value to set
	 * @return this instance
	 * @type Iroha.InputPrompt
	 */
	setText : function(value) {
		if (typeof value != 'string') {
			throw new TypeError('Iroha.InputPrompt.setText: first argument must be a string.');
		} else {
			this.prompted = !Boolean(value);  // fillPrompt() での処理を見据え、案内テキストの表示が必要かをここで反映。
			this.$node.val(value);
			this.fillPrompt();
			this.$node.toggleClass(this.constructor.CLASSNAME.changed, !this.prompted);
			return this;
		}
	},
	
	/**
	 * show prompt text when the text-input is 'empty'.
	 * @return this instance
	 * @type Iroha.InputPrompt
	 */
	fillPrompt : function() {
		if (this.compatMode && this.prompted && !this.$node.val()) {
			this.$node.val(this.prompt);
		}
		return this;
	},
	
	/**
	 * clear prompt text from text-input.
	 * @return このインスタンス自身
	 * @type Iroha.InputPrompt
	 * @private
	 */
	clearPrompt : function() {
		if (this.compatMode && this.prompted && this.$node.val() == this.prompt) {
			this.$node.val('');
		}
		this.prompted = false;
		return this;
	},
	
	/**
	 * event handler for when text-input if focused.
	 * @private
	 * @evnet
	 */
	onFocus : function() {
		var node = this.$node.get(0);
		if (!node.readOnly && !node.disabled) {
			this.$node.addClass(this.constructor.CLASSNAME.focused);
			this.clearPrompt();
			this.focused = true;
		}
	},
	
	/**
	 * event handler for when text-input if blured.
	 * @private
	 * @evnet
	 */
	onBlur : function() {
		var node = this.$node.get(0);
		if (!node.readOnly && !node.disabled) {
			this.$node.removeClass(this.constructor.CLASSNAME.focused);
			this.setText(node.value);
			this.focused = false;
		}
	}
});



/* -------------------- Class : Iroha.InputPrompt.Setting -------------------- */
/**
 * setting data object for {@link Iroha.InputPrompt}.
 */
Iroha.InputPrompt.Setting = function() {
	/**
	 * 属性名。典型的には "placeholder" や "title"。この属性の値をプレースホルダ文字列 ("prompt") として扱う。
	 * @type String
	 */
	this.fromAttr = 'placeholder';
	
	/**
	 * "fromAttr" の指定内容や、その属性値の有無の如何に関係なくプレースホルダ文字列 ("prompt") をこれに決定する。
	 * @type String
	 */
	this.prompt = '';
	
	/**
	 * "fromAttr" を "placeholder" しているとき、
	 * ネイティブに placeholder 属性が利用できるブラウザでも従来どおりの互換動作を利用するかどうか。
	 * （"fromAttr" を "placeholder" でない場合は全ブラウザで強制的に互換動作となる）
	 */
	this.forceCompat = false;
};

/**
 * create an instance and return.
 * @type Iroha.InputPrompt.Setting
 */
Iroha.InputPrompt.Setting.create = function() {
	return new this;
};



})(Iroha.jQuery);