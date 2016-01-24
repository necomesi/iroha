/*! "keyequiv.js" | Iroha : Keyboard Eqivalents | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *        Iroha : Keyboard Eqivalents
 *        Charset : UTF-8
 *
 *    @version 3.03.20160117
 */
/* -------------------------------------------------------------------------- */

var $      = require('jquery'      );
var _      = require('underscore'  );
var Module = require('iroha/module');

var IS_WIN = /Win\d{2}|Windows/    .test(navigator.platform );
var IS_MAC = /\(Macintosh\; Intel /.test(navigator.userAgent);



/* ============================== KeyEquiv ============================== */
/**
 * @class KeyEquiv
 * @extend Module
 */
var KeyEquiv = Module.extend(

/** @lends KeyEquiv */
{
	NAME      : 'KeyEquiv',
	BLOCKNAME : '',
	ELEMENTS  : { },
	MODIFIERS : { },

	/**
	 * 動作させている環境が Windows (PC) かどうか
	 * @type {boolean}
	 * @constant
	 */
	PLATFORM_IS_WIN : IS_WIN,

	/**
	 * 動作させている環境が Mac OS X かどうか
	 * @type {boolean}
	 * @constant
	 */
	PLATFORM_IS_MAC : IS_MAC,

	/**
	 * 特殊キーを表す別名記号の定義
	 * {Array.<{ alias:string, name:string, keyCode:number, DOMName:string }>}
	 * @type {Object[]}
	 * @constant
	 */
	SPECIAL_KEYS : [
		{ 'alias' : '$', keyCode :  16, DOMName : 'shiftKey', name : 'Shift'    },
		{ 'alias' : '%', keyCode :  17, DOMName : 'ctrlKey' , name : 'Ctrl'     },
		{ 'alias' : '~', keyCode :  18, DOMName : 'altKey'  , name : IS_MAC ? 'Opt'    : IS_WIN ? 'Alt'   : 'Alt'   },
		{ 'alias' : '&', keyCode :  91, DOMName : 'metaKey' , name : IS_MAC ? 'Cmd'    : IS_WIN ? 'Win'   : 'Meta'  },
		{ 'alias' : '|', keyCode :   9, DOMName : ''        , name : 'Tab'      },
		{ 'alias' : '#', keyCode :  13, DOMName : ''        , name : IS_MAC ? 'Return' : IS_WIN ? 'Enter' : 'Enter' },
		{ 'alias' : '!', keyCode :  27, DOMName : ''        , name : 'Esc'      },
		{ 'alias' : ' ', keyCode :  32, DOMName : ''        , name : 'Space'    },
		{ 'alias' : '⇞', keyCode :  33, DOMName : ''        , name : 'PageUp'   },
		{ 'alias' : '⇟', keyCode :  34, DOMName : ''        , name : 'PageDown' },
		{ 'alias' : '↘', keyCode :  35, DOMName : ''        , name : 'End'      },
		{ 'alias' : '↖', keyCode :  36, DOMName : ''        , name : 'Home'     },
		{ 'alias' : '<', keyCode :  37, DOMName : ''        , name : '\u2190'   },  /* left  */
		{ 'alias' : '{', keyCode :  38, DOMName : ''        , name : '\u2191'   },  /* up    */
		{ 'alias' : '>', keyCode :  39, DOMName : ''        , name : '\u2192'   },  /* right */
		{ 'alias' : '}', keyCode :  40, DOMName : ''        , name : '\u2193'   },  /* down  */
		{ 'alias' : '/', keyCode : 191, DOMName : ''        , name : '/'        }
	],

	/**
	 * getKeyName() の返値配列内における修飾キーの並びの優先順
	 * @type {string[]}
	 * @constant
	 */
	MODIFIER_ORDER : IS_MAC ? '&~%$' : IS_WIN ? '%~&$' : '%~&$',

	/**
	 * 人間にとって読みやすい形式のキー表記文字列からなる配列を得る。
	 * @param {string} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return {string[]} キー表記文字列からなる配列。 [ "Shift" + "A" ] など。
	 */
	getKeyName : function(keys) {
		if (!_.isString(keys) || !keys) {
			throw new TypeError('Iroha.KeyEquiv.getKeyName: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		}
		else {
			keys = this.normalizeKey(keys).split('');

			// 修飾キー並び替え（プラットフォーム別の優先順を反映）
			var tmp  = [];
			this.MODIFIER_ORDER.split('').forEach(function(alias) {
				var index = keys.indexOf(alias);
				if (index > -1) {
					tmp.push(keys.splice(index, 1)[0]);
				}
			});
			keys = tmp.concat(keys);

			// 「人間にとって読みやすい形式」へ置き換えた配列を返す
			return keys.map(function(key) {
				var specialKey = _.findWhere(KeyEquiv.SPECIAL_KEYS, { alias : key });
				return specialKey ? specialKey.name : key;
			});
		}
	},

	/**
	 * キーコンビネーション指示子を正規化する。
	 * @param {String} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return {string} 正規化済みキーコンビネーション指示子
	 * @private
	 */
	normalizeKey : function(keys) {
		if (!_.isString(keys)) keys = '';

		var arr = keys.toUpperCase().split('').sort();
		return _.uniq(arr, true).join('');
	}
},

/** @lends KeyEquiv.prototype */
{
	/**
	 * 基底要素ノード（キーイベントを拾う要素）
	 * @type {jQuery}
	 */
	$node : $(),

	/**
	 * 初期化
	 * @param {jQuery|Element|string} node    基底要素ノード(群)
	 * @return {KeyEquiv}
	 * @private
	 */
	init : function(node) {
		this.$node = $(node).on('keydown', this.onKeyDown.bind(this));
		return this;
	},

	/**
	 * キーコンビネーション押下時に呼び出すコールバックを登録する
	 * @param {string}            keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @param {KeyEquiv.Callback} func    キーコンビネーションが押下されたら呼び出されるコールバック関数
	 * @return {KeyEquiv}
	 */
	addKey : function(keys, func) {
		if (!_.isString(keys) || !keys) {
			throw new TypeError('Iroha.KeyEquiv#addKey: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		}
		else if (!_.isFunction(func)) {
			throw new TypeError('Iroha.KeyEquiv#addKey: 引数 "func" は関数オブジェクトでなければなりません。');
		}
		else {
			return this.on(this.normalizeKey(keys), func);
		}
	},

	/**
	 * @see {KeyEquiv.getKeyName}
	 * @private
	 */
	getKeyName : function() { return KeyEquiv.getKeyName.apply(KeyEquiv, arguments) },

	/**
	 * @see {KeyEquiv.normalizeKey}
	 * @private
	 */
	normalizeKey : function() { return KeyEquiv.normalizeKey.apply(KeyEquiv, arguments) },

	/**
	 * "keydown" イベントハンドラ
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onKeyDown : function(e) {
		var evtKeyCode = e.keyCode;
		var spcecials  = KeyEquiv.SPECIAL_KEYS;
		var getKeyName = this.getKeyName.bind(this);
		var trigger    = this.trigger.bind(this);
		var callbacks  = this.callbacks;
		var modifiers  = [];

		// 押された修飾キー（1つ以上）それぞれの別名記号からなる配列
		_.each(spcecials, function(specialKey) {
			e[specialKey.DOMName] && modifiers.push(specialKey.alias);
		});

		// キーコンビネーション指示子を登録名とするコールバック群のなかに
		// いま押されたキーコンビネーションに一致するものがあれば、コールバックする。
		_.find(callbacks, function(callback, keys) {
			// 修飾キーの種類と数が一致するかどうか
			var modMatched = modifiers.every(function(alias) { return keys.indexOf(alias) > -1 });

			// 修飾キー以外のキーが一致するかどうか
			var keyMatched = keys.split('').every(function(key) {
				var specialKey = _.findWhere(spcecials, { alias : key });
				return specialKey
					// key が SPECIAL_KEYS に定義のある特殊キーの場合：「押された修飾キーに一致するか」 or 「押されたキーのキーコードに一致するか」
					? e[specialKey.DOMName] || evtKeyCode === specialKey.keyCode
					// key がそうでない（＝ふつうの文字キーの）場合：「キーコードから逆引きしたキー名（文字）と一致するか」
					: key === String.fromCharCode(evtKeyCode).toUpperCase()
			});

			// 一致していたら、コールバックしてすぐ _.find() ループを抜ける
			if (modMatched && keyMatched) {
				trigger(keys, e, keys, getKeyName(keys));
				return true;
			}
		});
	},

	/**
	 * キーコンビネーション指示子を指定して、登録されているコールバックを恣意的に呼び出す。
	 * @param {String} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return {KeyEquiv}
	 */
	fireKey : function(keys) {
		if (_.isString(keys) || !keys) {
			throw new TypeError('Iroha.KeyEquiv#fireKey: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		} else {
//			// using DOM3 events...
//			var e = document.createEvent('keyboardEvent');
//			e.initKeyboardEvent(
//				/* type          */ 'keydown',
//				/* canBubble     */ true,
//				/* cancelable    */ true,
//				/* view          */ window,
//				/* keyIdentifier */ 'Undefined',
//				/* keyLocation   */ DOM_KEY_LOCATION_STANDARD,
//				/* modifiersList */ ''
//			);
//			document.dispatchEvent(e);

			// temporary...
			keys = this.normalizeKey(keys);
			return this.trigger(keys, {}, keys, this.getKeyName(keys));
		}
	}
});



/* -------------------- for JSDoc output -------------------- */
/**
 * キーコンビネーションが押下された時のコールバック関数、それが受け取る引数の定義。
 * @function
 * @name KeyEquiv.Callback
 * @param {Event}    e           イベントオブジェクト。ただし KeyEquiv.fireKey() によってコールバックされた時は空オブジェクト {}。
 * @param {string}   key         正規化済みキーコンビネーション指示子
 * @param {string[]} keyNames    人間にとって読みやすい形式のキー表記文字列からなる配列
 * @see KeyEquiv#addKey
 */



/* ============================== Exports ============================== */

module.exports = KeyEquiv;


