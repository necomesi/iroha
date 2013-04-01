/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       ページ退去確認機能
 *       (charset : "UTF-8")
 *
 *    @version 3.00.20130312
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* ============================== Static class : Iroha.ExitCensor ============================== */
/**
 * @namespace ページ退去確認機能を提供。beforeUnload のタイミングで退去確認を実施する。
 * ただし Mobile Safari では beforeUnload イベントが機能しないため、ブラウザの「戻る」ボタンのみ擬似的に退去確認を再現。
 */
Iroha.ExitCensor = {
	/**
	 * 退去確認有効フラグ。
	 * @type Boolean
	 */
	enabled : false,
	
	/**
	 * デフォルトの退去確認メッセージ。
	 * @type String
	 */
	message : 'Do you want to leave from this page?',
	
	/**
	 * "BeforeUnload" イベントが利用できるかどうか。 true なら利用可能。利用不可ブラウザをブラックリスト的に指名して除外。
	 * @type Boolean
	 * @private
	 * @const
	 */
	CAPABLE_BEFOREUNLOAD : !Iroha.ua.isiOS || !Iroha.ua.isSafari,
	
	/**
	 * pusuState を利用できるかどうか（ "BeforeUnload" の代替措置で利用している）。
	 * @type Boolean
	 * @private
	 * @const
	 */
	CAPABLE_PUSHSTATE : Boolean(history.pushState),
	
	/**
	 * pushState で擬似的に beforeUnload を実現する際 URL に付与する hash 文字列。
	 * @type String
	 * @private
	 * @const
	 */
	HASH_PUSHSTATE : '#exitSensorEnabled',
	
	/**
	 * 初期化処理。
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	init : function() {
		if (Iroha.alreadyApplied(this.init)) return;
		
		$(window)
			.bind('unload'      , $.proxy(this.disable, this))
			.bind('beforeunload', $.proxy(function(e) {
				if (this.enabled) {
					return (e.returnValue = this.message);
				}
			}, this));
		
		// BeforeUnload 利用不可
		if (!this.CAPABLE_BEFOREUNLOAD && this.CAPABLE_PUSHSTATE) {
			$(window)
				.bind('unload'  , $.noop)  // Back Forward Cache を無効化
				.bind('popstate', $.proxy(function(e) {
					(!e.originalEvent.state)
						? null
						: (!this.enabled || confirm(this.message))
							? history.back()
							: history.forward();
				}, this));
		}
		
		return this;
	},
	
	/**
	 * 退去確認機能を有効にする
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	enable : function() {
		this.enabled = true;
		
		// BeforeUnload 利用不可
		if (!this.CAPABLE_BEFOREUNLOAD && this.CAPABLE_PUSHSTATE) {
			var hash  = this.HASH_PUSHSTATE;
			var href  = location.href.replace(hash, '');
			var title = document.title;
			history.replaceState(true, title, href);
			history.pushState   (null, title, hash);
		}
		
		return this.init();
	},
	
	/**
	 * 退去確認機能を無効にする
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	disable : function() {
		this.enabled = false;
		
		// BeforeUnload 利用不可
		if (!this.CAPABLE_BEFOREUNLOAD && this.CAPABLE_PUSHSTATE) {
			var hash  = this.HASH_PUSHSTATE;
			var href  = location.href.replace(hash, '');
			var title = document.title;
			history.replaceState(true, title, href);
		}
		
		return this.init();
	},
	
	/**
	 * 退去確認機能の有効無効を切り替え（トグル）。
	 * @param {Boolean} [bool]    真偽値が与えられた場合、それに従って有効無効を決定。
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	toggle : function(bool) {
		return (arguments.length == 0) ?
			arguments.callee.call(this, !this.enabled) :
			Boolean(bool) ?
				this.enable() :
				this.disable();
	},
	
	/**
	 * 退去確認の「抜け道」を追加。指定要素ノードにおける指定タイプのイベント発生時、退去確認なしでページ退去ができる。
	 * @param {jQuery|Element|String}  expr         「抜け道」を設置する要素
	 * @param {String}                 eventType    「抜け道」が開かれるイベントタイプ
	 * @param {Function}              [func]        要素とイベントをテストする関数。true 返却で抜け道が開く。
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	addLoophole : function(expr, eventType, func) {
		$(document).on(eventType, expr, $.proxy(function(e) {
			var recent   = this.enabled;
			this.enabled = $.isFunction(func) ? !func.apply(null, arguments) : false;
			Iroha.delay(100, this).done(function() { this.toggle(recent) });
		}, this));
		
		return this;
	},
	
	/**
	 * 退去確認メッセージを設定。
	 * @param {String} message    退去確認メッセージとするテキスト。
	 * @return このオブジェクト自身
	 * @type Iroha.ExitCensor
	 */
	setMessage : function(message) {
		this.message = String(message) || this.message;
		return this;
	}
};



})(Iroha.$, Iroha, window, document);