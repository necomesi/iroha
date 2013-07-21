/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       create text-input with prompt text.
 *       (charset : "UTF-8")
 *
 *    @version 3.04.20130622
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- jQuery.fn : Iroha_InputPrompt -------------------- */
/**
 * Iroha.InputPrompt as jQuery plugin
 * @exports $.fn.Iroha_InputPrompt as jQuery.fn.Iroha_InputPrompt
 * @param {Iroha.InputPrompt.Setting} [setting]    設定オブジェクト
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
	 * 設定オブジェクト
	 * @type Iroha.InputPrompt.Setting
	 * @private
	 */
	this.setting = Iroha.InputPrompt.Setting.create();
	
	/**
	 * 基底要素ノード。テキスト入力欄。 (input[type="text"], input[type="password"], textarea)
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * このテキスト入力欄を内包しているフォーム要素ノード
	 * @type jQuery
	 * @private
	 */
	this.$form = $();
	
	/**
	 * テキスト入力欄の type。 "text", "password", "textarea"。
	 * @type String
	 * @private
	 */
	this.type = '';
	
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
	
	/**
	 * 監視タイマー。入力内容の変化を監視。
	 * @type Iroha.Interval
	 * @private
	 */
	this.watcher = undefined;
	
	/**
	 * DOM イベント名前空間。このインスタンスだけの物であることを示す。
	 * @type String
	 * @private
	 * @constant
	 */
	this.EVENT_NS = '.Iroha.InputPrompt.' + Iroha.String.guid().replace(/-/g, '');
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
		return $(node).eq(0).is('input[type="text"], input[type="password"], textarea');
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
//			$(document).on('focus', selector, function() { $(this).Iroha_InputPrompt(setting) });
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
		
		this.setting = setting = $.extend(this.setting, setting);
		this.$node   = $(node).eq(0).addClass(this.constructor.CLASSNAME.baseNode);
		this.$form   = this.$node.closest('form');
		this.type    = this.$node.prop('type');
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
			this.watch();
		}
		
		// add event listeners
		this.$node
			.bind('focus' + this.EVENT_NS, $.proxy(this.onFocus, this))
			.bind('blur'  + this.EVENT_NS, $.proxy(this.onBlur , this))
			
		this.$form
			// form が submit される時、送信パラメータに案内テキストが含まれないようにする。
			.bind('submit' + this.EVENT_NS, $.proxy(this.clearPrompt, this))
			
			// form の submit が DOM0 的に呼び出された時，上記ハンドラがトリガーされないことに対処。
			// each はコンテキスト限定のためのシンタックスシュガー。
			.each(function() {
				var orig = '__Iroha_InputPrompt_original_submit__';
				if (!this[orig]) {
					this[orig]  = this.submit;
					this.submit = function() {
						$(this).triggerHandler('submit');
						this[orig]();
					}
				}
			});
		
		$(window)
			.bind('beforeunload' + this.EVENT_NS, $.proxy(this.onBeforeUnload, this));
		
		return this;
	},
	
	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		var $node = this.$node;
		if ($node) {
			$node
				.attr(this.setting.fromAttr, this.getPrompt())
				.add(this.$form).add(window).unbind(this.EVENT_NS);
			$.each(
				this.constructor.CLASSNAME,
				function(key, cname) { $node.removeClass(cname) }
			);
		}
		this.clearPrompt && this.clearPrompt();
		this.watcher     && this.watcher.clear();
		
		this.constructor.disposeInstance(this);
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
			
			// パスワード入力欄むけ暫定対応。
			(this.type == 'password') && !this.prompted && this.clearPrompt();
			
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
			
			// パスワード入力欄むけ暫定対応。input の上空に案内テキストの入った要素ノードを重ねる方式。
			if (this.type == 'password') {
				this.$node.val('');
				var cname = 'iroha-inputprompt-prompt';
				$(this.$node.next('.' + cname).get(0) || $('<ins/>').addClass(cname).insertAfter(this.$node))
					.text(this.prompt)
					.click($.proxy(function(e) {
						e.preventDefault();
						this.$node.focus();
					}, this));
			}
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
		
		// パスワード入力欄むけ暫定対応
		// input の上空に載っている案内テキストの入った要素ノードを消去する。
		this.$node.next('.iroha-inputprompt-prompt').remove();
		
		return this;
	},
	
	/**
	 * テキスト入力欄のテキスト内容変化の監視を開始する。
	 * @param {Number} [interval=100]    監視間隔。ミリ秒指定。
	 * @return このインスタンス自身
	 * @type Iroha.InputPrompt
	 */
	watch : function(interval) {
		var interval = Math.max(interval, 100) || 100;
		
		if (!this.watcher && this.compatMode) {
			this.watcher = Iroha.Interval.create(function() {
				var value = this.$node.val();
				this.focused || !value || value == this.getPrompt() || this.setText(value);
			}, interval, this);
		}
		
		return this;
	},
	
	/**
	 * テキスト入力欄のテキスト内容変化の監視を停止する。
	 * @return このインスタンス自身
	 * @type Iroha.InputPrompt
	 */
	unwatch : function() {
		this.watcher && this.watcher.clear();
		this.watcher = undefined;
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
	},
	
	/**
	 * event hander for "window.onBeforeUnload"
	 * @private
	 * @event
	 */
	onBeforeUnload : function() {
		// history を行き来したあと、フォーカス状態を復元されると都合が悪い(IEなど)。よってこの段階で blur しておく。
		this.focused && this.$node.blur();
		
		// histroy を行き来したあと、案内テキストがふつうのテキストとして復元されてしまわないために消去しておく。
		this.clearPrompt();
		
		// 他のスクリプトが beforeUnload でページ退去確認ダイアログを出した場合、
		// ユーザーが「退去しない」を選択したときに案内テキストを戻さないとならない。
		Iroha.Timeout(function() {
			// 他JSの処理により案内テキストがふたがび表示された状態になっていた場合と、
			// フォーカスが当たっていた場合はスルーしないと変になる
			this.prompted || this.focused || this.setText(this.$node.val());
		}, 100, this);
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



})(Iroha.$, Iroha, window, document);