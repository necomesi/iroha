/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       keyboard equivalents system.
 *       (charset : "UTF-8")
 *
 *    @version 3.01.20130313
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* --------------- Class : Iroha.KeyEquiv --------------- */
/**
 * @class keyboard equivalents system
 * @extends Iroha.Observable
 */
Iroha.KeyEquiv = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);
	
	/**
	 * 基底要素ノード（キーイベントを拾う要素）
	 * @type jQuery
	 */
	this.$node = $();
};

Iroha.ViewClass(Iroha.KeyEquiv).extend(Iroha.Observable);

$.extend(Iroha.KeyEquiv,
/** @lends Iroha.KeyEquiv */
{
	/**
	 * 特殊キーを表す別名記号の定義
	 * { keychar : { name, keyCode, DOMName }, ... }
	 * @type Object
	 * @constant
	 */
	KEY_ALIAS : {
		'$' : { name : 'Shift'  , keyCode : 16, DOMName : 'shiftKey' },
		'%' : { name : 'Ctrl'   , keyCode : 17, DOMName : 'ctrlKey'  },
		'~' : { name : 'Alt'    , keyCode : 18, DOMName : 'altKey'   },  /* alt (Win), option  (Mac) */
		'&' : { name : 'Meta'   , keyCode : 91, DOMName : 'metaKey'  },  /* win (Win), command (Mac) */
		'|' : { name : 'Tab'    , keyCode :  9, DOMName : ''         },
		'#' : { name : 'Enter'  , keyCode : 13, DOMName : ''         },
		'!' : { name : 'Esc'    , keyCode : 27, DOMName : ''         },
		'<' : { name : '\u2190' , keyCode : 37, DOMName : ''         },  /* left  */
		'{' : { name : '\u2191' , keyCode : 38, DOMName : ''         },  /* up    */
		'>' : { name : '\u2192' , keyCode : 39, DOMName : ''         },  /* right */
		'}' : { name : '\u2193' , keyCode : 40, DOMName : ''         }   /* down  */
	},
	
	/**
	 * 特殊キーの別名記号をキーコード指定により得る。
	 * @param {Number} keyCode    特殊キーのキーコード
	 * @return 特殊キーの別名記号。該当するものがなければ空文字列 ""。
	 * @type String
	 */
	getKeyAlias : function(keyCode) {
		keyCode = Number(keyCode);
		if (isNaN(keyCode) || keyCode < 0) {
			throw new TypeError('Iroha.KeyEquiv.getKeyAlias: 引数 "keyCode" は非負整数でなければなりません。');
		} else {
			var ret = '';
			$.each(this.KEY_ALIAS, function(key, alias) {
				return alias.keyCode == keyCode ? !Boolean(ret = key) : true;
			});
			return ret;
		}
	},
	
	/**
	 * 新しくインスタンスを生成するか、既存のインスタンスを得る。
	 * @param {jQuery|Element|String} [node=document.documentElement]    基底要素ノード（＝キーイベントを拾う要素）。
	 */
	create : function(node) {
		node || (node = document.documentElement);
		return this.getInstance(node) || this.add(node);
	}
});

$.extend(Iroha.KeyEquiv.prototype,
/** @lends Iroha.KeyEquiv.prototype */
{
	/**
	 * 初期化
	 * @return このインスタンス自身
	 * @type Iroha.KeyEquiv
	 */
	init : function(node) {
		this.$node = $(node).keydown($.proxy(this.onKeyDown, this));
		return this;
	},
	
	/**
	 * キーコンビネーション押下時に呼び出すコールバックを登録する
	 * @param {String}                  keys             キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @param {Iroha.KeyEquiv.callback} func             キーコンビネーションが押下されたら呼び出されるコールバック関数
	 * @param {Object}                  [aThisObject]    コールバック関数のなかで "this" が指し示すことになるもの
	 * @return このインスタンス自身
	 * @type Iroha.KeyEquiv
	 */
	addKey : function(keys, func, aThisObject) {
		if ($.type(keys) != 'string' || !keys) {
			throw new TypeError('Iroha.KeyEquiv#addKey: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		} else if (!$.isFunction(func)) {
			throw new TypeError('Iroha.KeyEquiv#addKey: 引数 "func" は関数オブジェクトでなければなりません。');
		} else {
			this.addCallback(this.normalizeKey(keys), func, aThisObject);
			return this;
		}
	},
	
	/**
	 * 人間にとって読みやすい形式のキー表記文字列からなる配列を得る。
	 * @param {String} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return キー表記文字列からなる配列
	 * @type String[]
	 */
	getKeyName : function(keys) {
		if ($.type(keys) != 'string' || !keys) {
			throw new TypeError('Iroha.KeyEquiv#getKeyName: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		} else {
			return this.normalizeKey(keys).split('').map(function(key) {
				var alias = this.constructor.KEY_ALIAS[key];
				return !alias ? key : alias.name;
			}, this);
		}
	},
	
	/**
	 * 特殊キーの別名記号をキーコード指定により得る。
	 * @param {Number} keyCode    特殊キーのキーコード
	 * @return 特殊キーの別名記号。該当するものがなければ空文字列 ""。
	 * @type String
	 */
	getKeyAlias : function(keyCode) {
		return this.constructor.getKeyAlias(keyCode);
	},
	
	/**
	 * キーコンビネーション指示子を正規化する。
	 * @param {String} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return 正規化済みキーコンビネーション指示子
	 * @type String
	 * @private
	 */
	normalizeKey : function(keys) {
		if ($.type(keys) != 'string' || !keys) {
			throw new TypeError('Iroha.KeyEquiv#normalizeKey: 引数 "keys" は文字列（キーコンビネーション指示子）でなければなりません。 ');
		} else {
			var arr = keys.toUpperCase().split('').sort();
			return arr.filter(function(c, i) { return (c != arr[i + 1]) }).join('');
		}
	},
	
	/**
	 * "keydown" イベントハンドラ
	 * @param {Event} e    event object
	 * @private
	 * @event
	 */
	onKeyDown : function(e) {
		var aliases = this.constructor.KEY_ALIAS;
		var modKeys = [];
		for (var alias in aliases) {
			var domName = aliases[alias].DOMName;
			if (domName && e[domName]) {
				modKeys.push(alias);
			}
		}
		for (var keys in this.callbackChains) {
			var keyMatched = keys.split('').every(function(key) {
				var alias = aliases[key];
				return (!alias) ?
					Boolean(key == String.fromCharCode(e.keyCode).toUpperCase()) :
					Boolean(e[alias.DOMName] || e.keyCode == alias.keyCode);
			}, this);
			var modMatched = modKeys.every(function(mod) { return (keys.indexOf(mod) > -1) });
			if (keyMatched && modMatched) {
				this.doCallback(keys, e, keys, this.getKeyName(keys));
				break;
			}
		}
	},
	
	/**
	 * キーコンビネーション指示子を指定して、登録されているコールバックを恣意的に呼び出す。
	 * @param {String} keys    キーコンビネーション指示子。 "$A" (="Shift+A") など。
	 * @return このインスタンス自身
	 * @type Iroha.KeyEquiv
	 */
	fireKey : function(keys) {
		if ($.type(keys) != 'string' || !keys) {
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
			var keys = this.normalizeKey(keys);
			var e    = {};
			this.doCallback(keys, e, keys, this.getKeyName(keys));
			
			return this;
		}
	}
});



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * キーコンビネーションが押下された時のコールバック関数、それが受け取る引数の定義。
 * @name Iroha.KeyEquiv.callback
 * @param {Event}    e           イベントオブジェクト。ただし Iroha.KeyEquiv.fireKey() によってコールバックされた時は空オブジェクト {}。
 * @param {String}   key         正規化済みキーコンビネーション指示子
 * @param {String[]} keyNames    人間にとって読みやすい形式のキー表記文字列からなる配列
 * @function
 * @see Iroha.KeyEquiv#addKey
 */



})(Iroha.jQuery);