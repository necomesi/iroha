/*! "iroha.js" | Iroha - Necomesi JSLib : Base Script | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Base Script
 *       (charset : "UTF-8")
 *
 *    @version 3.50.20130904
 *    @requires jquery.js
 */
/* -------------------------------------------------------------------------- */
(function($, window, document) {



// supplements 'undefined'
window.undefined = window.undefined;



/* =============== create Iroha global object and prepartions =============== */
/**
 * Iroha global object.
 * @name Iroha
 * @namespace Iroha global object
 */
var Iroha = window.Iroha = $.extend(window.Iroha, new (function() {
	var d  = document;
	var de = d.documentElement;
	var di = d.implementation;
	var ua = navigator.userAgent;

	// browser detection snippet from jQuery
	// http://jquery.org/license
	$.browser = $.browser || (function () {
		var matched, browser;
		function uaMatch(ua) {
			ua = ua.toLowerCase();
			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
			return {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		}
		matched = uaMatch(navigator.userAgent);
		browser = {};
		if (matched.browser) {
			browser[matched.browser] = true;
			browser.version = matched.version;
		}
		// Chrome is Webkit, but Webkit is also Safari.
		if (browser.chrome) {
			browser.webkit = true;
		} else if (browser.webkit) {
			browser.safari = true;
		}
		return browser;
	})();

	/**
	 * @namespace stored jQuery (or Zepto) object, considering conflict.
	 * @name Iroha.$
	 * @constant
	 */
	this.$ = $;

	/**
	 * @deprecated use {@link Iroha.$}
	 * @name Iroha.jQuery
	 * @constant
	 */
	this.jQuery = $;

	/**
	 * default setting values of Iroha function/classes
	 * @name Iroha.settings
	 * @namespace default setting values of Iroha function/classes
	 * @property {Object}  common                  common settings
	 * @property {Boolean} common.showGeometry     show geometry values in browser's status bar
	 */
	this.settings        = {};
	this.settings.common = { showGeometry : false };

	/**
	 * identifier urls of frequently used XML-Namespaces.
	 * @name Iroha.ns
	 * @namespace identifier urls of frequently used XML-Namespaces
	 * @property {String} defaultNS    current default namespace of the docuemnt elmeent
	 * @property {String} xhtml1       XHTML1 namespace
	 * @property {String} xhtml2       XHTML2 namespace
	 * @property {String} iroha         Iroha namespace
	 */
	this.ns           = {};
	this.ns.defaultNS = (!de) ? '' : de.namespaceURI || de.tagUrn || '';
	this.ns.xhtml1    = 'http://www.w3.org/1999/xhtml';
	this.ns.xhtml2    = 'http://www.w3.org/2002/06/xhtml2';
	this.ns.iroha     = 'http://necomesi.jp/iroha';

	/**
	 * browser distinction results.
	 * @name Iroha.ua
	 * @namespace browser distinction results.
	 * @property {String}  versionText         string form of the browser version number (ex: "1.9.0.2", "528.18.1", "7.0")
	 * @property {Number}  version             float number of the browser version (ex: 1.9, 528.18, 7.0)
	 * @property {String}  mbVersText          string form of Mobile OS version number (ex: "5.0.1", "2.3.3", "6.5.3.5")
	 * @property {Number}  mbVersion           float number of Mobile OS version (ex: 5, 2.3, 6.5)
	 *
	 * @property {Boolean} isSafari            true if the browser is AppleWebKit-based (but in iOS/MacOS/Windows only, except Chrome Browser)
	 * @property {Boolean} isWebKit            true if the browser is AppleWebKit-based any browsers
	 * @property {Boolean} isChrome            true if the browser is Chrome Browser
	 * @property {Boolean} isAndroidBrowser    true if the browser is Android "Standard Browser"
	 * @property {Boolean} isGecko             true if the browser is Gecko-based.
	 * @property {Boolean} isOpera             true if the browser is Opera
	 * @property {Boolean} isIE                true if the browser is IE-based
	 * @property {Boolean} isWin               true if the browser runs on Windows
	 * @property {Boolean} isMac               true if the browser runs on MacOS(X)
	 *
	 * @property {Boolean} isMobile            true if the browser runs on some mobile device
	 * @property {Boolean} isiPhone            true if the browser runs on iPhone
	 * @property {Boolean} isiPad              true if the browser runs on iPad
	 * @property {Boolean} isiPod              true if the browser runs on iPod
	 * @property {Boolean} isiOS               true if the browser runs on some Apple iOS device
	 * @property {Boolean} isAndroid           true if the browser runs on Android
	 * @property {Boolean} isWinPhone          true if the browser runs on Windows Phone
	 *
	 * @property {Boolean} isQuirksMode        true if the browser runs under 'quirks mode'
	 * @property {Number}  documentMode        number of documentMode; this avaiable on IE, the value is 0 on other browsers.
	 *
	 * @property {Boolean} isTouchable         true if the browser supports touch evnets
	 *
	 * @property {Boolean} isDOMReady          true if the browser had DOM feature.
	 */
	this.ua              = {};
	this.ua.versionText  = $.browser.version;
	this.ua.version      = parseFloat($.browser.version);
	this.ua.isChrome     = /Chrome/.test(ua);
	this.ua.isSafari     = !!$.browser.safari;
	this.ua.isWebkit     = !!$.browser.webkit;  // deprecated
	this.ua.isWebKit     = !!$.browser.webkit;
	this.ua.isGecko      = !!$.browser.mozilla;
	this.ua.isOpera      = !!$.browser.opera;
	this.ua.isIE         = !!$.browser.msie;
	this.ua.isiPhone     = /iPhone/          .test(ua);
	this.ua.isiPad       = /iPad/            .test(ua);
	this.ua.isiPod       = /iPod/            .test(ua);
	this.ua.isiOS        = /iPhone|iPad|iPod/.test(ua);
	this.ua.isAndroid    = /Android/         .test(ua);
	this.ua.isWinPhone   = /Windows Phone/   .test(ua);
	this.ua.isMobile     = this.ua.isiOS || this.ua.isAndroid || this.ua.isWinPhone || /Mobile/.test(ua);
	this.ua.mbVersText   = this.ua.isiOS      ? ua.replace(/^.+ CPU (iPhone |)OS ([\d_]+).+$/    , '$2').replace(/_/g, '.')
	                     : this.ua.isAndroid  ? ua.replace(/^.+ Android ([\d\.]+).+$/            , '$1')
	                     : this.ua.isWinPhone ? ua.replace(/^.+ Windows Phone (OS |)([\d\.]+).+$/, '$2')
	                     : '0';
	this.ua.mbVersion    = parseFloat(this.ua.mbVersText);
	this.ua.isWin        = /Win/.test(ua) && !this.ua.isMobile;
	this.ua.isMac        = /Mac/.test(ua) && !this.ua.isMobile;
	this.ua.isQuirksMode = d.compatMode == 'BackCompat' || this.ua.isIE && this.ua.version < 6;
	this.ua.documentMode = !this.ua.isIE         ? 0
	                     : d.documentMode        ? d.documentMode
	                     : !this.ua.isQuirksMode ? this.ua.version
	                     : 5;
	this.ua.isTouchable  = ('ontouchstart' in document)
	this.ua.isDOMReady   = (di) ? di.hasFeature('HTML', '1.0') : (this.ua.isIE && de);

	// isSafari と判別されていたとしても、iOS, Mac, Windows でないものや、Chrome の場合は false に戻す。
	this.ua.isSafari = this.ua.isSafari && !this.ua.isChrome && (this.ua.isiOS || this.ua.isMac || this.ua.isWin);
	// Android 標準ブラウザを判別
	this.ua.isAndroidBrowser = this.ua.isAndroid && this.ua.isWebKit && !this.ua.isChrome;

	/**
	 * geometry properties object; the property values are updated when {@link Iroha.getGeometry} is called.
	 * @name Iroha.geom
	 * @namespace geometry properties object; return value of {@link Iroha.getGeometry}
	 * @property {Number} screenW      width  of the screen (devicePixelRatio considered, never change by orientation)
	 * @property {Number} screenH      height of the screen (devicePixelRatio considered, never change by orientation)
	 * @property {Number} windowW      width  of the window viewport.
	 * @property {Number} windowH      height of the window viewport.
	 * @property {Number} pageW        width  of the document.
	 * @property {Number} pageH        height of the document.
	 * @property {Number} scrollX      scrollLeft position of the document.
	 * @property {Number} scrollY      scrollTop position of the document.
	 * @property {Number} windowX      mouse position on X-axis (the origin is top left of the window viewport)
	 * @property {Number} windowY      mouse position on Y-axis (the origin is topleft of the window viewport)
	 * @property {Number} pageX        mouse position on X-axis (the origin is topleft of the document)
	 * @property {Number} pageY        mouse position on Y-axis (the origin is topleft of the document)
	 * @property {Number} zoom         window zoom ratio (in WinIE7).
	 * @property {Number} scrollBar    browser's scrollbar width.
	 * @proprety {Number} density      pixel density of the screen (devicePixelRatio).
	 * @proprety {Number} orientation  screen orientation. (0, 90, -90, 180)
	 */
	this.geom = {};

	/**
	 * misc environment values.
	 * @name Iroha.env
	 * @namespace misc environment values.
	 * @property {Boolean} isOnline      true if the browser is online.
	 * @property {Boolean} isDOMReady    true if the document is ready for DOM manipulation
	 */
	this.env            = {};
	this.env.isOnline   = /^https?\:$/.test(location.protocol);
	this.env.isDOMReady = false;
}));

// 'Node.XXXX_NODE' constants (for old IE)
if (typeof window.Node == 'undefined') {
	window.Node = {
		  ELEMENT_NODE                : 1
		, ATTRIBUTE_NODE              : 2
		, TEXT_NODE                   : 3
		, CDATA_SECTION_NODE          : 4
		, ENTITY_REFERENCE_NODE       : 5
		, ENTITY_NODE                 : 6
		, PROCESSING_INSTRUCTION_NODE : 7
		, COMMENT_NODE                : 8
		, DOCUMENT_NODE               : 9
		, DOCUMENT_TYPE_NODE          : 10
		, DOCUMENT_FRAGMENT_NODE      : 11
		, NOTATION_NODE               : 12
	};
}

// dummy object of window.console (Firbug etc)
if (typeof window.console != 'object') {
	window.console = {
		  element           : null
		, firebug           : "0"
		, userObjects       : {}
		, assert            : function(){}
		, clear             : function(){}
		, count             : function(){}
		, debug             : function(){}
		, dir               : function(){}
		, dirxml            : function(){}
		, error             : function(){}
		, getFirebugElement : function(){}
		, group             : function(){}
		, groupCollapsed    : function(){}
		, groupEnd          : function(){}
		, log               : function(){}
		, notifyFirebug     : function(){}
		, profile           : function(){}
		, profileEnd        : function(){}
		, time              : function(){}
		, timeEnd           : function(){}
		, trace             : function(){}
		, warn              : function(){}
	};
}







/* =============== regester onload func =============== */

(function() {
	// prevent background image flicker on IE6.
	if (Iroha.ua.isIE && Iroha.ua.version == 6) try { document.execCommand('BackgroundImageCache', false, true) } catch(err) { }

	$(function() {
		// indicates that the browser has ability to manipulate DOM tree.
		Iroha.env.isDOMReady = true;

		// add classname which indicates "Iroha is enabled".
//		// onload で即座に実行すると古い IE でスピードダウンする現象を軽減するために delay しつつ適用
//		// …するのはヤメた！
//		Iroha.delay(1).done(function() { $(document.body).addClass(cnames.join(' ')) });
		$(document.body).addClass('iroha-enabled');
	});
})();







/* =============== custom / shortage methods for built-in objects =============== */

/* ----- Array.indexOf() ----- */

if (!Array.prototype.indexOf) {
	/**
	 * returns the first index of an element within the array equal to the specified value, or -1 if none is found.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Object} aSearchElement    the item to search
	 * @param {Number} [aFromIndex]      index number to start searching
	 * @return index number
	 * @type Number
	 */
	Array.prototype.indexOf = function(aSearchElement, aFromIndex) {
		if (typeof aFromIndex != 'number') {
			aFromIndex = 0;
		} else if (aFromIndex < 0) {
			aFromIndex = this.length + aFromIndex;
		}
		for (var i = aFromIndex, n = this.length; i < n; i++) {
			if (this[i] === aSearchElement) {
				return i;
			}
		}
		return -1;
	}
}

/* ----- Array.lastIndexOf() ----- */

if (!Array.prototype.lastIndexOf) {
	/**
	 * returns the last index of an element within the array equal to the specified value, or -1 if none is found.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Object} aSearchElement    the item to search
	 * @param {Number} [aFromIndex]      index number to start searching
	 * @return index number
	 * @type Number
	 */
	Array.prototype.lastIndexOf = function(aSearchElement, aFromIndex) {
		if (typeof aFromIndex != 'number') {
			aFromIndex = this.length - 1;
		} else if (aFromIndex < 0) {
			aFromIndex = this.length + aFromIndex;
		}
		for (var i = aFromIndex; i >= 0; i--) {
			if (this[i] === aSearchElement) {
				return i;
			}
		}
		return -1;
	}
}

/* ----- Array.forEach() ----- */

if (!Array.prototype.forEach) {
	/**
	 * calls a function for each element in the array.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Array.callback.iterate} aCallback        the function to exec for every element
	 * @param {Object}                 [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 */
	Array.prototype.forEach = function(aCallback, aThisObject) {
		for (var i = 0, n = this.length; i < n; i++) {
			aCallback.call(aThisObject, this[i], i, this);
		}
	}
}

/* ----- Array.map() ----- */

if (!Array.prototype.map) {
	/**
	 * creates a new array with the results of calling a provided function on every element in this array.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Array.callback.iterate} aCallback        the function to exec for every element
	 * @param {Object}                 [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return array that consisted of returned values.
	 * @type Array
	 */
	Array.prototype.map = function(aCallback, aThisObject) {
		var ret = [];
		for (var i = 0, n = this.length; i < n; i++) {
			ret.push(aCallback.call(aThisObject, this[i], i, this));
		}
		return ret;
	}
}

/* ----- Array.filter() ----- */

if (!Array.prototype.filter) {
	/**
	 * creates a new array with all of the elements of this array for which the provided filtering function returns true.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Array.callback.test} aCallback        the function to test all elements
	 * @param {Object}              [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return array that consisted of only adapted elements.
	 * @type Array
	 */
	Array.prototype.filter = function(aCallback, aThisObject) {
		var ret = [];
		for (var i = 0, n = this.length; i < n; i++) {
			if (aCallback.call(aThisObject, this[i], i, this)) {
				ret.push(this[i]);
			}
		}
		return ret;
	}
}

/* ----- Array.some() ----- */

if (!Array.prototype.some) {
	/**
	 * returns true if at least one element in this array satisfies the provided testing function.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Array.callback.test} aCallback        the function to test condition of the elements
	 * @param {Object}              [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return did some elements satisfy the condition?
	 * @type Boolean
	 */
	Array.prototype.some = function(aCallback, aThisObject){
		for (var i = 0, n = this.length; i < n; i++) {
			if (aCallback.call(aThisObject, this[i], i, this)) return true;
		}
		return false;
	}
}

/* ----- Array.every() ----- */

if (!Array.prototype.every) {
	/**
	 * returns true if every element in this array satisfies the provided testing function.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @param {Array.callback.test} aCallback        the function to test condition of the elements
	 * @param {Object}              [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return did all elements satisfy the condition?
	 * @type Boolean
	 */
	Array.prototype.every = function(aCallback, aThisObject){
		for (var i = 0, n = this.length; i < n; i++) {
			if(!aCallback.call(aThisObject, this[i], i, this)) return false;
		}
		return true;
	}
}

/* ----- for JSDoc toolkit output ----- */
/**
 * higher-order functions for member methods of {@link Array}
 * @name Array.callback
 * @namespace higher-order functions for member methods of {@link Array}
 */
/**
 * higher-order function for {@link Array#forEach}, {@link Array#map}
 * @function
 * @name Array.callback.iterate
 * @param {Object} anElement    current processing element of the Array.
 * @param {Number} anIndex      current processing index-num of the Array.
 * @param {Array}  anArray      the Array itself.
 * @returns processing result value (any type) of this function
 * @type Object
 */
/**
 * higher-order function for {@link Array#filter}, {@link Array#some}, {@link Array#every}
 * @function
 * @name Array.callback.test
 * @param {Object} anElement    current processing element of the Array.
 * @param {Number} anIndex      current processing index-num of the Array.
 * @param {Array}  anArray      the Array itself.
 * @returns processing result value (boolean) of this function
 * @type Boolean
 */






/* ============================== Iroha classes ============================== */

/**
 * @class Iroha.Class 型コンストラクタを作り出す。
 * @param {Function} [constructor]    対象のコンストラクタ関数
 * @return 汎用クラスプロパティ・メソッド群を与えられた Iroha.Class 型コンストラクタ
 * @function
 */
Iroha.Class = function() {};

/**
 * Iroha.Class を継承した新たなファクトリを得る
 * @type Function
 */
$.extend(Iroha.Class,
/** @lends Iroha.Class */
{
	extend : function() {
		return (new this).extend();
	}
});

$.extend(Iroha.Class.prototype,
/** @lends Iroha.Class.prototype */
{
	/**
	 * コンストラクタ（クラス）を一意に表すキー
	 * @type String
	 * @constant
	 */
	IROHA_CLASS_ID : '',

	/**
	 * コンストラクタの prototype が備えているべき「既定のメソッド」。無ければここから補われる。
	 * @type Object
	 * @private
	 * @constant
	 */
	IROHA_DEF_METHODS : {
		  init    : function(node) { return this }
		, dispose : function()     { this.constructor.disposeInstance(this) }
	},

	/**
	 * 生成したインスタンス群からなる配列
	 * @type Object[]
	 */
	instances : [],

	/**
	 * クラスから生成されたインスタンスを格納する
	 * @param {Object} instance    生成したインスタンス
	 * @return 格納したインスタンスそれ自身
	 * @type Object
	 * @private
	 */
	storeInstance : function(instance) {
		this.instances.push(instance);
		return instance;
	},

	/**
	 * クラスから作られた既存インスタンスを得る。
	 * @param {Number} [arg]    インデックス番号。引数無指定時は全ての既存インスタンスからなる配列が返る。
	 * @return 該当のインスタンス。存在しなければ undefined が返る。引数無指定時は全ての既存インスタンスからなる配列が返る。
	 * @type Object
	 */
	getInstance : function(arg) {
		if (arguments.length == 0) {
			// オブジェクト参照切断済の配列として返す。 dispose() されて undefined になっているものは除外。
			return this.instances.slice().filter(function(instance) { return Boolean(instance) });
		} if ($.type(arg) == 'number') {
			return this.instances[arg];
		} else {
			return undefined;
		}
	},

	/**
	 * クラスから作られた既存インスタンスを破棄する。
	 * @param {Object} instance    破棄対象のインスタンス
	 */
	disposeInstance : function(instance) {
		var instances = this.instances;
		var index     = instances.indexOf(instance);
		if (index > -1) {
			instances.splice(index, 1, undefined);
			instance.dispose();
			$.each(instance, function(prop) { delete instance[prop] });
		}
		// インスタンス群の配列を後ろから走査し、生きているインスタンスに突き当たるまで undefined になっているものを消す。
		while (instances.length > 0 && !instances[instances.length - 1]) {
			instances.pop();
		}
	},

	/**
	 * 新しいインスタンスを生成して返す。
	 * 生成されたインスタンスに init(), dispose() 等の既定のメソッドが無ければ、最低限度の機能のそれらが付与される。
	 * 最後に instance.init() が自動的に呼び出される。
	 * @param {Arguments} [args]    instance.init() に渡される引数（群）。
	 * @return 生成したインスタンス
	 * @type Object
	 */
	create : function() {
		return this.add.apply(this, arguments);
	},

	/**
	 * 新しいインスタンスを生成し、このクラス（コンストラクタ）のインスタンスリストに追加する。
	 * 生成されたインスタンスに init(), dispose() 等の既定のメソッドが無ければ、最低限度の機能のそれらが付与される。
	 * 最後に instance.init() が自動的に呼び出される。
	 * @param {Arguments} [args]    instance.init() に渡される引数（群）。
	 * @return 生成したインスタンス
	 * @type Object
	 */
	add : function(args) {
		// 既定のメソッド群がコンストラクタの prototype になければ、補う。
		$.each(this.IROHA_DEF_METHODS, $.proxy(function(name, func) { this.prototype[name] || (this.prototype[name] = func) }, this));

		var instance = new this;
		instance.init.apply(instance, arguments)
		return this.storeInstance(instance);
	},

	/**
	 * 指定したコンストラクタ（クラス）のプロトタイプを現在のコンテキストのコンストラクタ（クラス）へ継承させる。
	 * @param {Function} constructor    継承元のコンストラクタ（クラス）
	 * @return コンテキストのコンストラクタ自身
	 * @type Function
	 */
	// extend : function(constructor) {
	// 	$.isFunction(constructor) || (constructor = new Function);
	// 	$.extend(this.prototype, new constructor);

	// 	// コンストラクタ関数に直接取り付けられたプロパティ・メソッドを継承させる。ただし一部を除外しつつ。
	// 	var except = 'IROHA_CLASS_ID,IROHA_DEF_METHODS,instances,extend'.split(',');
	// 	$.each(constructor, $.proxy(function(key, value) {
	// 		value.IROHA_CLASS_ID      ||  // Iroha.Class なコンストラクタなら除外（サブクラス的なもの）
	// 		this[key] === value       ||  // 完全同値なら除外
	// 		except.indexOf(key) != -1 ||  // 除外プロパティを除外
	// 			(this[key] = value);
	// 	}, this));

	// 	return this;
	// },

	extend : function() {
		var parent = this.constructor;
		var child  = function() { parent.apply(this, arguments) };
		return $.extend(child, parent, {
			  instances : []
			, IROHA_CLASS_ID : Iroha.String.guid().replace(/-/g, '').get()
		});
	}
});



// /* -------------------- Class : Iroha.ViewClass -------------------- */
// /**
//  * @class DOM要素ノードを取扱う Iroha.ViewClass 型コンストラクタを作り出す。
//  * @extend Iroha.Class
//  * @param {Function} [constructor]    対象のコンストラクタ関数
//  * @return 汎用クラスプロパティ・メソッド群を与えられた Iroha.ViewClass 型コンストラクタ
//  * @function
//  */
// // Iroha.ViewClass = function(constructor) {
// // 	return $.isFunction(constructor) ? arguments.callee.applyTo(constructor) : constructor;
// // };

// // $.extend(Iroha.ViewClass, Iroha.Class);
// // $.extend(Iroha.ViewClass.prototype, new Iroha.Class,

// Iroha.ViewClass = Iroha.Class.extend();

// $.extend(Iroha.ViewClass.prototype,
// /** @lends Iroha.ViewClass.prototype */
// {
// 	/**
// 	 * コンストラクタの prototype が備えているべき「既定のメソッド」。無ければここから補われる。
// 	 * @type Object
// 	 * @private
// 	 */
// 	IROHA_DEF_METHODS : {
// 		  init         : function(node)   { this.$node = $(node); return this }
// 		, dispose      : function()       { this.constructor.disposeInstance(this) }
// 		, appendTo     : function(target) { this.$node.appendTo    (target.$node || $(target)); return this }
// 		, prependTo    : function(target) { this.$node.prependTo   (target.$node || $(target)); return this }
// 		, insertBefore : function(target) { this.$node.insertBefore(target.$node || $(target)); return this }
// 		, insertAfter  : function(target) { this.$node.insertAfter (target.$node || $(target)); return this }
// 	},

// 	/**
// 	 * クラスから生成されたインスタンスを格納する
// 	 * @param {Object} instance    生成したインスタンス
// 	 * @return 格納したインスタンスそれ自身
// 	 * @type Object
// 	 * @private
// 	 */
// 	storeInstance : function(instance) {
// 		$(instance.$node).data(this.IROHA_CLASS_ID + '.index', this.instances.push(instance) - 1);
// 		return instance;
// 	},

// 	/** @private */
// 	getInstanceSuper : Iroha.Class.prototype.getInstance,

// 	*
// 	 * クラスから作られた既存インスタンスを得る。
// 	 * @param {Number|jQuery|Element|String} [arg]    インデックス番号、またはインスタンス生成時に指定した「基底要素ノード」。
// 	 *                                                引数無指定時は全ての既存インスタンスからなる配列が返る。
// 	 * @return 該当のインスタンス。存在しなければ undefined が返る。引数無指定時は全ての既存インスタンスからなる配列が返る。
// 	 * @type Object

// 	getInstance : function(arg) {
// 		return (arg && (arg.nodeType == Node.ELEMENT_NODE || $.type(arg.jquery) == 'string' || $.type(arg) == 'string'))
// 			? this.instances[$(arg).data(this.IROHA_CLASS_ID + '.index')]
// 			: this.getInstanceSuper.apply(this, arguments);
// 	},

// 	/** @private */
// 	disposeInstanceSuper : Iroha.Class.prototype.disposeInstance,

// 	/**
// 	 * クラスから作られた既存インスタンスを破棄する。
// 	 * @param {Object} instance    破棄対象のインスタンス
// 	 */
// 	disposeInstance : function(instance) {
// 		instanse && instance.$node && instance.$node.removeData(this.IROHA_CLASS_ID + '.index');
// 		return this.disposeInstanceSuper.apply(this, arguments);
// 	},

// 	/**
// 	 * 任意の要素ノードを与えて新しくインスタンスを生成するか、同じ要素ノードから生成された既存のインスタンスを得る。
// 	 *
// 	 * 第1引数には要素ノードを与えなければならない。この要素ノードを、インスタンスが主として取扱う「基底要素ノード」と定義する。
// 	 * 生成されたインスタンスに init(), dispose() 等の既定のメソッドが無ければ、最低限度の機能のそれらが付与される。
// 	 * 最後に instance.init() が自動的に呼び出される。
// 	 * instance.init() で最低限必要な処理は、第1引数として与えられる「基底要素ノード」を instance.$node に格納することである。
// 	 *
// 	 * @param {jQuery|Element|String} node      インスタンスが主として取扱う「基底要素ノード」。instance.init() の第1引数として渡される。
// 	 * @param {Arguments}             [args]    instance.init() に渡される2番目以降の引数。
// 	 * @return 生成したインスタンス
// 	 * @type Object
// 	 */
// 	create : function(node, args) {
// 		if (!$(node).is('*')) {
// 			throw new TypeError('Iroha.ViewClass#create: 第1引数は要素ノード、要素ノードを内包した jQuery オブジェクト、要素ノードを見つけられる selector 文字列でなければなりません。');
// 			console.trace && console.trace();
// 		} else {
// 			return this.getInstance(node) || this.add.apply(this, arguments);
// 		}
// 	}
// });



/* --------------- Class : Iroha.Number --------------- */
/**
 * @class 数値をいろいろ操作
 */
Iroha.Number = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * 処理対象となっている数値
	 * @type Number
	 * @private
	 */
	this.value = 0;
};

/**
 * Iroha.Number のインスタンスを作って返す。
 * @return Iroha.Number の新規インスタンス
 * @type Iroha.Number
 */
Iroha.Number.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

$.extend(Iroha.Number.prototype,
/** @lends Iroha.Number.prototype */
{
	/**
	 * 初期化
	 * @param {Number} [value=0]    処理対象とする数値。
	 * @return このインスタンス自身
	 * @type Iroha.Number
	 */
	init : function(value) {
		this.value = Number(value) || 0;
		return this;
	},

	/**
	 * 現在の数値を文字列として取得する。
	 * @returns 現在の数値を文字列化したもの
	 * @type String
	 */
	toString : function() {
		return String(this.value);
	},

	/**
	 * 現在の数値を取得する
	 * @returns 現在の数値
	 * @type Number
	 */
	get : function() {
		return this.value;
	},

	/**
	 * 簡易フォーマッタ。現在の数値を指定形式の文字列へ整形する。
	 * @param {String} format     整形フォーマット
	 * @return 整形された文字列を保持している {@link Iroha.String} インスタンス
	 * @type Iroha.String
	 * @example
	 *  Iroha.Number(     '56'   ).format(      '000'    ).get() ->        '056'
	 *  Iroha.Number( '123456'   ).format(      '###'    ).get() ->        '456'
	 *  Iroha.Number( '123456.78').format('#,###,###'    ).get() ->    '123,457'
	 *  Iroha.Number( '123456.78').format('#,###,###.#'  ).get() ->    '123,456.8'
	 *  Iroha.Number('-123456.78').format('0,###,###.000').get() -> '-0,123,456.780'
	 */
	format : function(format) {
		if (!format || typeof format != 'string') {
			throw new TypeError('Iroha.Number#format: first argument must be a formatting string.');

		} else {
			var ret       = [];
			var num       = parseFloat(this.value) || 0;
			var intFormat = format.split('.')[0].split('');
			var decFormat = format.split('.')[1] || '';
			var value     = (decFormat) ? Math.abs(num) : Math.round(Math.abs(num));
			var sign      = (num < 0) ? '-' : '';
			var intValue  = value.toString().split('.')[0].split('');

			do {
				var _value  = intValue .pop() || '';
				var _format = intFormat.pop() || '';
				switch (_format) {
					case '0' : ret.push(_value  ? _value : '0');                        break;
					case '#' : ret.push(_value  ? _value : '' );                        break;
					case ''  : /* exit do-while loop */          intValue = [];         break;
					default  : ret.push(_format               ); intValue.push(_value); break;
				}
			} while (intValue.length > 0 || intFormat.length > 0);

			ret = ret.reverse().join('').replace(/^\D+/, '');

			if (decFormat) {
				var scale     = Math.pow(10, decFormat.length);
				var rounded   = Math.round(value * scale) / scale;
				if (rounded - ret == 1) {
					ret++;
				}
				var decValue  = rounded.toString().split('.')[1] || '0';
					decValue  = decValue .split('').reverse().join('');
					decFormat = decFormat.split('').reverse().join('');
					ret       = ret + '.' + Iroha.Number(decValue).format(decFormat).split('').reverse().join('');
			}

			if (Iroha.String(decFormat).startsWith('#') && Iroha.String(ret).endsWith('.0')) {
				ret = Iroha.String(ret).getBefore('.0');
			}

			return Iroha.String(sign + ret);
		}
	}
});



/* --------------- Class : Iroha.String --------------- */
/**
 * @class 文字列をいろいろ操作
 */
Iroha.String = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * 処理対象となっている文字列
	 * @type String
	 * @private
	 */
	this.value = '';

	/**
	 * 処理対象となっている文字列の現在の長さ
	 * @type Number
	 */
	this.length = 0;
};

$.extend(Iroha.String,
/** @lends Iroha.String */
{
	/**
	 * ランダムな文字列を得る。
	 * @param {Number} [num=24]    ランダム文字列の長さ
	 * @param {String} [chars]     ランダム文字列を構成する文字群
	 * @returns 作成したランダム文字列を保持している Iroha.String インスタンス
	 * @type Iroha.String
	 */
	random : function(num, chars) {
		var num   = (num > 0) ? num : 24;
		var chars = ($.type(chars) == 'string') ? chars : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var ret   = '';
		while (num--) {
			ret += chars.split('')[Math.floor(Math.random() * chars.length)]
		}
		return new this(ret);
	},

	/**
	 * グローバル一意識別子を得る。
	 * @returns 作成したグローバル一意識別子を保持している Iroha.String インスタンス
	 * @type Iroha.String
	 */
	guid : function() {
		var chars = '0123456789ABCDEF';
		var arr   = [ 8, 4, 4, 4, 12 ].map(function(n) { return this.random(n, chars).get() }, this);
		return (new this('${0}-${1}-${2}-${3}-${4}')).format(arr);
	},

	/**
	 * Iroha.String のインスタンスを作って返す。
	 * @return Iroha.String の新規インスタンス
	 * @type Iroha.String
	 */
	create : function() {
		var instance = new this;
		return instance.init.apply(instance, arguments);
	}
});

$.extend(Iroha.String.prototype,
/** @lends Iroha.String.prototype */
{
	/**
	 * 初期化
	 * @param {Number} [value=""]    処理対象とする文字列。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	init : function(value) {
		this.value  = String(value === undefined ? '' : value);
		this.length = this.value.length;
		return this;
	},

	/**
	 * 現在の文字列を取得する。
	 *
	 * IE8 で、 toString メソッドをオーバーライドできない様子。
	 * 正確には、jQuery.extend が悪さをしている可能性がある。
	 * ともかく Iroha.String#toString を呼び出すと IE8 でエラーになるようになってしまった。
	 * @returns 現在の文字列を取得
	 * @type String
	 */
	toString : function() {
		return this.value;
	},

	/**
	 * 現在の文字列を取得する。
	 * @returns 現在の文字列を取得
	 * @type String
	 */
	get : function() {
		// IE8 で、 toString メソッドをオーバーライドできないようなので。
		// 正確には、jQuery.extend が悪さをしている可能性がある。
		// ともかく Iroha.String#toString を呼び出すと IE8 でエラーになるようになってしまった。

		// return this.toString.apply(this, arguments);
		return this.value;
	},

	/**
	 * 簡易フォーマッタ。現在の文字列を指定の形式へ整形する。
	 * @param {String|String[]|Object}  arg1     文字列、または文字列の入っている配列、または文字列をプロパティ値とする連想配列。
	 * @param {String}                 [argN]    文字列（2個目以降）
	 * @return このインスタンス自身
	 * @type Iroha.String
	 * @example
	 *  Iroha.String('${0}HOGE${1}FUGA${2}').format(    'xxx', '  yyy',   'zzz'  ).get()
	 *  Iroha.String('${0}HOGE${1}FUGA${2}').format([   'xxx',   'yyy',   'zzz' ]).get()
	 *  Iroha.String('${A}HOGE${B}FUGA${C}').format({ A:'xxx', B:'yyy', C:'zzz' }).get()
	 *  Iroha.String('${A}HOGE${B.C}FUGA${B.D.E}').format({ A: 'xxx', B: { C:'yyy', D: { E:'zzz' } } }).get()
	 *      -> 'xxxHOGEyyyFUGAzzz'
	 */
	format : function(arg1, /* arg2, arg3 ..., */ argN) {
		var data;
		if (arguments.length == 0) {
			return this;
		} else if (typeof arg1 == 'object' && !(arg1 instanceof Iroha.String)) {
			data = arg1;
		} else {
			data = $.makeArray(arguments).map(function(a) { return $.type(a) == 'undefined' ? a : String(a) });
		}
		this.replace(/\$\{(.+?)\}/g, function(_, key) {
			var replace = $.type(data) == 'array' ? data[key] : Iroha.getValue(key, data);
			return ($.type(replace) == 'undefined') ? '${' + key + '}' : replace;
		})
		return this;
	},

	/**
	 * 指定の文字列より前の部分の文字列を得る。
	 * @param {String}  str            検索文字列
	 * @param {Boolean} [include]      true の場合、戻値は検索文字列自身を含む。
	 * @param {Boolean} [longMatch]    true の場合、最長一致で探す。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	getBefore : function(str, include, longMatch) {
		if (typeof str != 'string') {
			throw new TypeError('Iroha.String#getBefore: first argument must be a string.');
		} else if (str) {
			var idx     = (!longMatch) ? this.value.indexOf(str) : this.value.lastIndexOf(str);
			this.value  = (idx == -1) ? '' : this.value.substring(0, idx) + (include ? str : '');
			this.length = this.value.length;
		}
		return this;
	},

	/**
	 * 指定の文字列より後ろの部分の文字列を得る。
	 * @param {String}  str            検索文字列
	 * @param {Boolean} [include]      true の場合、戻値は検索文字列自身を含む。
	 * @param {Boolean} [longMatch]    true の場合、最長一致で探す。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	getAfter : function(str, include, longMatch) {
		if (typeof str != 'string') {
			throw new TypeError('String.Wrapper.getAfter: first argument must be a string.');
		} else if (str) {
			var idx     = (!longMatch) ? this.value.indexOf(str) : this.value.lastIndexOf(str);
			this.value  = (idx == -1) ? '' : (include ? str : '') + this.value.substring(idx + str.length, this.value.length);
			this.length = this.value.length;
		}
		return this;
	},

	/**
	 * 指定文字数で裁ち落とし処理する。
	 * @param {Number} [chars=this.length]    トリミング後の目標文字数。
	 * @param {String} [from="start"]         トリミング方式。目標文字数を先頭末尾どちらから数えるかの指定。 "start":末尾側裁ち落とし, "end": 先頭側裁ち落とし, "both": 中間裁ち落とし。
	 * @param {String} [ellipsis="\u2026"]    トリミングで文字が断ち切られる際につける省略記号。デフォルトは "…"。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	trim : function(chars, from, ellipsis) {
		var str = this.value;
		var len = this.length;

		if ($.type(chars   ) != 'number') { chars    = len      }  // 引数無指定時のデフォルト値
		if ($.type(from    ) != 'string') { from     = 'start'  }  // 引数無指定時のデフォルト値
		if ($.type(ellipsis) != 'string') { ellipsis = '\u2026' }  // 引数無指定時のデフォルト値

		if (chars <= 0  ) { ellipsis =''; chars = 0 }  // 目標文字数が 0 以下なら空文字にしてオシマイにする。
		if (chars >= len) { ellipsis =''            }  // 目標文字数よりも現在の文字数が短いか同じなら、なにもしなくてよい。

		chars -= ellipsis.length;
		if (chars < 0) {
			throw new RangeError('Iroha.String#trim: トリム後の目標文字数 (chars) には、省略記号 (ellipsis) の文字数を下回る値を指定はできません。');
		}

		switch(from) {
			case 'start' :
				str = str.slice(0, chars) + ellipsis;
				break;

			case 'end' :
				str = ellipsis + str.slice(Math.max(0, len - chars), len);
				break;

			case 'both' :
				str = Iroha.String(str).trim(Math.ceil (chars / 2), 'start', '').get()
				    + ellipsis
				    + Iroha.String(str).trim(Math.floor(chars / 2), 'end'  , '').get();
				break;
		}

		this.value  = str;
		this.length = str.length;
		return this;
	},

	/**
	 * 現在の文字列が指定文字列から始まっていれば true を返す。
	 * @param {String}  str    検索文字列
	 * @return 現在の文字列が指定文字列から始まっていれば true。
	 * @type Boolean
	 */
	startsWith : function(str) {
		return (this.value.indexOf(str) == 0);
	},

	/**
	 * 現在の文字列が指定文字列で終わっていれば true を返す。
	 * @param {String}  str    検索文字列
	 * @return 現在の文字列が指定文字列で終わっていれば true。
	 * @type Boolean
	 */
	endsWith : function(str) {
		var idx = this.value.lastIndexOf(str);
		return (idx > -1 && idx + str.length == this.value.length);
	},

	/**
	 * 現在の文字列が指定文字列を含んでいれば true を返す。
	 * @param {String}  str    検索文字列
	 * @return 現在の文字列が指定文字列を含んでいれば true。
	 * @type Boolean
	 */
	contains : function(str) {
		return (this.value.indexOf(str) != -1);
	},

	/**
	 * 現在の文字列が指定文字列と完全に一致するなら true を返す。
	 * @param {String}  str    検索文字列
	 * @return 現在の文字列が指定文字列と完全に一致するなら true。
	 * @type Boolean
	 */
	isMatch : function(str) {
		return (this.value === str);
	},

	/**
	 * 相対パス(URL)を絶対パス(URL)へ変換する。
	 * @param {String} base    相対パス(URL)の起点となる場所を絶対パス(URL)で示したもの
	 * @return このインスタンス自身
	 * @type Iroha.String
	 * @example
	 *  Iroha.String('../target/').rel2abs('/path/to/base/'      ).get() -> '/path/to/target/'
	 *  Iroha.String('../target/').rel2abs('http://path/to/base/').get() -> 'http://path/to/target/'
	 */
	rel2abs : function(base) {
		var target = this.value;
		var b      = base  .split('/');
		var t      = target.split('/');
		var ptn = /^(\/|\w+:)/;
		if (!base.match(ptn)) {
			throw new TypeError('Iroha.String#rel2abs: first argument must be an absolute path/URL.');
		} else if (target.match(ptn)) {
			// do nothing
		} else if (target.charAt(0) == '#' || target.charAt(0) == '?') {
			this.value = base + target;
		} else if (t[0] == '.' || t[0] == '..') {
			this.value = Iroha.String(t.slice(1, t.length).join('/')).rel2abs(b.slice(0, b.length - t[0].length).join('/') + '/').get();
		} else {
			this.value = b.slice(0, b.length - 1).join('/') + '/' + target;
		}
		this.length = this.value.length;
		return this;
	},

	/**
	 * 絶対パス(URL)を相対パス(URL)へ変換する。
	 * @param {String} base    相対パス(URL)の起点となる場所を絶対パス(URL)で示したもの
	 * @return このインスタンス自身
	 * @type Iroha.String
	 * @example
	 *  Iroha.String(      '/path/to/target/').abs2rel('/path/to/base/'      ).get() -> '../target/'
	 *  Iroha.String('http://path/to/target/').abs2rel('http://path/to/base/').get() -> '../target/'
	 */
	abs2rel : function(base) {
		var ptn = /^(\/|\w+:)/;
		if (!base.match(ptn)) {
			throw new TypeError('Iroha.String#abs2rel: first argument must be an absolute path/URL.');
		} else if (!this.value.match(ptn)) {
			throw new TypeError('Iroha.String#abs2rel: current string is not an absolute path/URL.');
		} else {
			this.value  =  _compare(base, this.value).replace(/^\//, '') || base;
			this.length = this.value.length;
		}
		return this;

		function _compare(base, target) {
			var b = base  .split('/');
			var t = target.split('/');
			if (!base) {
				return target;
			} else if (!target) {
				return _goup(base);
			} else if (b[0] != t[0]) {
				return _goup(base) + target;
			} else {
				return arguments.callee(b.slice(1).join('/'), t.slice(1).join('/'));
			}
		}

		function _goup(path) {
			return path.split('/').slice(1).map(function() { return '..' }).join('/') + '/';
		}
	},

	/**
	 * 文字列置換。 String#replace をインスタンス内で実施。
	 * @param {String|RegExp} find       検索文字列、または正規表現
	 * @param {String}        replace    置換文字列
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	replace : function(find, replace) {
		this.value  = this.value.replace(find, replace);
		this.length = this.value.length;
		return this;
	},

	/**
	 * 文字列を「サニタイズ」する。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	sanitize : function() {
		var pairs = {
			  '&'      : '&amp;'
			, '<'      : '&lt;'
			, '>'      : '&gt;'
			, '\u0022' : '&quot;'
			, '\u0027' : '&apos;'
		};
		for (var key in pairs) {
			this.replace(new RegExp(key, 'g'), pairs[key]);
		}
		return this;
	},

	/**
	 * 文字列を％エスケープに変換する。"encodeURI" か "encodeURIComponent" を使用している。
	 * @param {Boolean} [bool=false]    true の場合, "encodeURIComponent" で変換。それ以外は "encodeURI" で変換。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	encodeURI : function(bool) {
		this.value  = bool ? encodeURIComponent(this.value) : encodeURI(this.value);
		this.length = this.value.length;
		return this;
	},

	/**
	 * ％エスケープされた文字列を元に戻す。"decodeURI" か "decodeURIComponent" を使用している。
	 * @param {Boolean} [bool=false]    true の場合, "decodeURIComponent" で変換。それ以外は "decodeURI" で変換。
	 * @return このインスタンス自身
	 * @type Iroha.String
	 */
	decodeURI : function(bool) {
		this.value  = bool ? decodeURIComponent(this.value) : decodeURI(this.value);
		this.length = this.value.length;
		return this;
	}
});



/* --------------- Class : Iroha.StyleSheets --------------- */

/**
 * @class スタイルシートコレクションをいろいろ操作
 * @example
 *  Iroha.StyleSheets().insertRule('body { color: red }');          // set font color to red
 *  Iroha.StyleSheets().each(function() { this.disabled = true });  // diable all style
 */
Iroha.StyleSheets = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * このインスタンスが保持しているスタイルシートオブジェクトの数。
	 * @type Number
	 */
	this.length = 0;
};

/**
 * Iroha.StyleSheets のインスタンスを作って返す。
 * @return Iroha.StyleSheets の新規インスタンス
 * @type Iroha.StyleSheets
 */
Iroha.StyleSheets.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

$.extend(Iroha.StyleSheets.prototype,
/** @lends Iroha.StyleSheets.prototype */
{
	/**
	 * 初期化（指定番号、あるいは直接与えられたスタイルシート(群)を保持）
	 * @param {Number|StyleSheet|StyleSheet[]} [arg]    保持するスタイルシート。インデックス番号で指定、またはスタイルシートオブジェクト(群)を指定。
	 * @return このインスタンス自身
	 * @type Iroha.StyleSheets
	 */
	init : function(arg) {
		var sheets = arg;

		if (arguments.length == 0 || $.type(arg) == 'number') {
			sheets = document.styleSheets;

			if (Iroha.ua.isSafari) {
				var $cssNode = $('link').filter(function() { return Boolean(this.sheet) });
				var dataName = 'Iroha.StyleSheets.Sheet.disabled';

				if ($cssNode.length > sheets.length) {
					$cssNode.each(function() {
						$(this).data(dataName, ($.inArray(this.sheet, sheets) == -1));
						this.disabled = true;
						this.disabled = false;
					});
					$.each(sheets, function() {
						this.disabled = $(this.ownerNode).data(dataName);
					});
				}
			}

			// 指定インデックス番号の物のみに絞る
			($.type(arg) == 'number') && (sheets = sheets[arg]);
		}

		return this.add(sheets);
	},

	/**
	 * このインスタンスが保持しているスタイルシートのコレクションに新たにスタイルシートを追加する。
	 * @param {StyleSheet|StyleSheet[]} [arg]    追加するスタイルシートオブジェクト(群)
	 * @return このインスタンス自身
	 * @type Iroha.StyleSheets
	 */
	add : function(sheets) {
		$.makeArray(sheets).forEach(function(sheet, i) {
			if (sheet.type == 'text/css') {
				this[this.length++] = sheet;
			}
		}, this);

		return this;
	},

	/**
	 * 現在保持しているスタイルシート群のうち指定番号に該当する物を取り出し、それを保持した新規インスタンスを得る
	 * @param {Number} [index]    インデックス番号
	 * @return 該当スタイルシートオブジェクトを保持した新規インスタンス
	 * @type Iroha.StyleSheets
	 */
	eq : function(index) {
		var sheet = (typeof index == 'number') ? this[index] : null;
		return new this.constructor(sheet);
	},

	/**
	 * 現在保持しているスタイルシート群のうち1番目のものを取り出し、それを保持した新規インスタンスを得る
	 * @return new instance that has a styleSheet
	 * @type Iroha.StyleSheets.Wrapper
	 */
	first : function() {
		return new this.constructor(this[0]);
	},

	/**
	 * 現在保持しているスタイルシート群のうち最後のものを取り出し、それを保持した新規インスタンスを得る
	 * @return new instance that has a styleSheet
	 * @type Iroha.StyleSheets.Wrapper
	 */
	last : function() {
		return new this.constructor(this[this.length - 1]);
	},

	/**
	 * 現在保持しているスタイルシート群のうち指定番号のもの、あるいはすべてを取り出す。
	 * @param {Number} [index]    番号指定。
	 * @return 単体のスタイルシートオブジェクト (DOM StyleSheet) 、または保持しているスタイルシートオブジェクトすべてからなる配列。
	 * @type StyleSheet|StyleSheet[]
	 */
	get : function(index) {
		return (typeof index == 'number') ? this[index] : Array.prototype.slice.call(this);
	},

	/**
	 * 現在保持しているスタイルシート群の "ownerNode" を得る。
	 * @param {Number} [index]    番号指定。
	 * @return 番号指定時はコレクション中の特定スタイルシートのもの、無指定時はコレクションすべての分を収めた配列。
	 * @type Element|Element[]
	 */
	getOwnerNode : function(index) {
		if (typeof index == 'number') {
			return this[index].ownerNode || this[index].owingElement;
		} else {
			return Array.prototype.map.call(this, function(e, i) { return this.getOwnerNode(i) }, this);
		}
	},

	/**
	 * 現在保持しているスタイルシートの個数を得る。
	 * @return number of styleSheets owned by this instance.
	 * @type Number
	 */
	size : function() {
		return this.length;
	},

	/**
	 * 現在保持しているスタイルシート群それぞれに対して処理を実施（イテレーション）。jQuery(selector).each(aCallback) に相似。
	 * @param {Iroha.StyleSheets.Callback.each} aCallback    実施する処理（コールバック関数）。この関数が false を返したらそこでイテレーションを止める。
	 * @return このインスタンス自身
	 * @type Iroha.StyleSheets
	 */
	each : function(aCallback) {
		$.each(this.get(), aCallback);
		return this;
	},

	/**
	 * 現在保持しているスタイルシート群の絞り込み処理を実施。jQuery(selector).filterh(aCallback) に相似。
	 * @param {Iroha.StyleSheets.Callback.filter} aCallback    絞り込み処理（コールバック関数）。この関数が true を返したスタイルシートが残る。
	 * @return 絞り込まれたスタイルシート群のみを保持する新規インスタンス
	 * @type Iroha.StyleSheets
	 */
	filter : function(aCallback) {
		return new this.constructor(this.get().filter(function(s, i) { return aCallback.call(s, i, s) }));
	},

	/**
	 * スタイルルールを追加する。現在保持しているスタイルシート群のうち1番目のものに追加される。
	 * @param {String} cssText    追加するスタイルルールのテキスト。
	 * @return このインスタンス自身
	 * @type Iroha.StyleSheets
	 */
	insertRule : function(cssText) {
		var expr  = /([^\{]+)(\{.+\})/;
		var sheet = this.get(0);

		if (!sheet) {
			return this;

		} else if (!expr.test(cssText)) {
			throw new TypeError('Iroha.StyleSheets.Wrapper.insertRule : first argument must be a style rule text.');

		} else {
			if (!sheet.insertRule && !sheet.addRule) {
				var style = document.createElement('style');
				style.type= 'text/css';
				style.appendChild(document.createTextNode(cssText));
				document.getElementsByTagName('head')[0].appendChild(style);

			} else if (sheet.insertRule) {  // Std DOM.
				var pos = sheet.cssRules ? sheet.cssRules.length : 0;  // workaround for Chrome in "file:" protocol.
				sheet.insertRule(cssText, pos);

			} else if (sheet.addRule) {     // old IE
				var regex     = expr.exec(cssText);
				var selector  = $.trim(regex[1]);
				var predicate = $.trim(regex[2]);
				if (Iroha.ua.documentMode >= 8) {
					predicate = predicate.slice(1, predicate.length - 1);
				}
				selector.split(',').forEach(function(_selector) {
					sheet.addRule(_selector, predicate);
				});
			}

			return this;
		}
	},

	/**
	 * 現在保持しているスタイルシート群のうち最初の物が持つ、スタイルルール群を得る
	 * @return スタイルルールオブジェクト群
	 * @type CSSRuleList
	 */
	getRules : function() {
		var sheet = this.get(0);
		return !sheet ? undefined : sheet.cssRules || sheet.rules;
	},

	/**
	 * 現在保持しているスタイルシート群のうち最初の物の中の、指定インデックス番号にあるスタイルルールを削除する。
	 * @param {Number} index    削除対象のスタイルルールインデックス番号。非負整数。
	 * @return このインスタンス自身
	 * @type Iroha.StyleSheets
	 */
	removeRule : function(index) {
		var sheet = this.get(0);
		sheet && sheet.removeRule(index);
		return this;
	}
});

/* ----- for JSDoc toolkit output ----- */
/**
 * @namespace {@link Iroha.StyleSheets} のメンバーメソッドに与えることができるコールバック関数群。
 * @name Iroha.StyleSheets.Callback
 */
/**
 * {@link Iroha.StyleSheets#each} に与えるコールバック関数。
 * @function
 * @name Iroha.StyleSheets.Callback.each
 * @param {Number}      anIndex      ループカウンタ。0 始まり正整数。
 * @param {StyleSheet}  anSheet      スタイルシートオブジェクト
 * @returns false を返した場合、イテレーション（ループ）がそこで停止される。
 * @type Boolean
 */
/**
 * {@link Iroha.StyleSheets#filter} に与えるコールバック関数。
 * @function
 * @name Iroha.StyleSheets.Callback.filter
 * @param {Number}      anIndex      ループカウンタ。0 始まり正整数。
 * @param {StyleSheet}  anSheet      スタイルシートオブジェクト
 * @returns true を返したスタイルシートオブジェクトだけが残される。
 * @type Boolean
 */



/* -------------------- Class : Iroha.Observable -------------------- */
/**
 * @class observable object
 */
Iroha.Observable = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * callback function chain, pair of key name and function.
	 * @type Object
	 * @private
	 */
	this.callbackChains = null;

	/**
	 * callback ignoring level - pairs of callback name and level string; 'all', 'preserved', 'disposable', 'none'.
	 * @type Object
	 * @private
	 */
	this.callbackIgnoreLevel = null;
};

/**
 * Iroha.Observable のインスタンスを作って返す。
 * @return Iroha.Observable の新規インスタンス
 * @type Iroha.Observable
 */
// Iroha.Observable.create = function() {
// 	var instance = new this;
// 	return instance.init.apply(instance, arguments);
// };

$.extend(Iroha.Observable.prototype,
/** @lends Iroha.Observable.prototype */
{
	/**
	 * 初期化（なにもしない）
	 * @return このインスタンス自身
	 * @type Iroha.Observable
	 */
	init : function() {
		return this;
	},

	/**
	 * process callback functions.
	 * @param {String} name      callback name
	 * @param {Object} [args]    arguments for callback function
	 * @return result value of last one of the callback functions chain.
	 * @type Object
	 */
	doCallback : function(name, /* arg1, arg2, ... */ args) {
		var chains = this.callbackChains      || {};  // 内容を参照するだけだし、インスタンスに紐づかない空オブジェクトでもOK
		var ignore = this.callbackIgnoreLevel || {};  // 同上

		if (!chains[name]) {
			return undefined;

		} else {
			var ret;
			var args = Array.prototype.slice.call(arguments, 1);

			chains[name]
				.filter(function(delegate) {
					var level = ignore[name] || 'none';
					switch (level) {
						case 'preserved'  : return  delegate.isDisposable;
						case 'disposable' : return !delegate.isDisposable;
						case 'all'        : return  false;
						case 'none'       : return  true;
						default           : return  true;
					}
				}, this)
				.forEach(function(delegate) {
					ret = delegate.apply(null, args);
				});

			this.removeDisposableCallback(name);
			return ret;
		}
	},

	/**
	 * add callback function.
	 * @param {String}   name             callback name
	 * @param {Function} func             callback function/method
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
	 * @param {String}   [disposable]     if 'disposable' specified, the callback function is treated as 'disposable'.
	 * @return this instance
	 * @type Iroha.Observable
	 */
	addCallback : function(name, func, aThisObject, disposable) {
		if (typeof name != 'string' || name == '') {
			throw new TypeError('Iroha.Observable#addCallback: argument \'name\' must be a string as callback name.');

		} else if (typeof func != 'function') {
			throw new TypeError('Iroha.Observable#addCallback: argument \'func\' must be a Function object.');

		} else {
			// 以下、ここではじめて定義する必要がある。
			// コンストラクタ関数内で定義してしまうと、Iroha.Observable を継承した子クラスの prototype に
			// これらへの参照が含まれてしまって、関係ないインスタンス同士でこれらの内容が共有されてしまうため。
			// このインスタンスの init() でこれを行ったとしても、Iroha.Observable を継承した子クラスは
			// init() を上書きすることがほとんどのため、そのやりかたもうまくない。
			this.callbackChains            || (this.callbackChains            = {}    );
			this.callbackChains[name]      || (this.callbackChains[name]      = []    );
			this.callbackIgnoreLevel       || (this.callbackIgnoreLevel       = {}    );
			this.callbackIgnoreLevel[name] || (this.callbackIgnoreLevel[name] = 'none');

			var delegate = $.extend($.proxy(func, aThisObject), {
				  originalFunc :func
				, aThisObject  : aThisObject || window
				, isDisposable : (disposable == 'disposable')
			});
			this.callbackChains[name].push(delegate);
		}
		return this;
	},

	/**
	 * remove callback function.
	 * @param {String}   name             callback name
	 * @param {Function} [func]           callback function/method to remove, if no funcs given, all callback funcs will be removed.
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
	 * @return this instance
	 * @type Iroha.Observable
	 */
	removeCallback : function(name, func, aThisObject) {
		var chains = this.callbackChains      || {};  // 内容を削除するだけだし、インスタンスに紐づかない空オブジェクトでもOK
		var ignore = this.callbackIgnoreLevel || {};  // 同上

		if (typeof name != 'string' || name == '') {
			throw new TypeError('Iroha.Observable#removeCallback: argument \'name\' must be a string as callback name.');

		} else if (chains[name]) {
			chains[name] = !$.isFunction(func)
				? []
				: chains[name].filter(function(delegate) {
				  	return delegate.originalFunc !== func || delegate.aThisObject !== (aThisObject || window);
				  });
			if (chains[name].length == 0) {
				delete chains[name];
				delete ignore[name];
			}
		}
		return this;
	},

	/**
	 * remove 'disposable' callback function.
	 * @param {String} name    callback name
	 * @return this instance
	 * @type Iroha.Observable
	 */
	removeDisposableCallback : function(name) {
		var chains = this.callbackChains;
		if (chains && chains[name]) {
			chains[name] = chains[name].filter(function(delegate) { return !delegate.isDisposable });
		}
		return this;
	},

	/**
	 * set callback ignoring level.
	 * @param {String} name             callback name
	 * @param {String} [level="all"]    ignoring level - 'all', 'preserved', 'disposable', 'none'
	 * @return this instance
	 * @type Iroha.Observable
	 */
	ignoreCallback : function(name, level) {
		var chains = this.callbackChains      || {};  // 参照するだけだから、インスタンスに紐づかない空オブジェクトでもOK
		var ignore = this.callbackIgnoreLevel || {};  // 空オブジェクトが取得されるのは、chains[name] が無いときだからOK

		if (typeof name != 'string' || name == '') {
			throw new TypeError('Iroha.Observable#ignoreCallback: argument \'name\' must be a string as callback name.');

		} else if (!chains[name]) {
			throw new RangeError('Iroha.Observable#ignoreCallback: callback name "' + name + '" does not exist. try addCallback() first.');

		} else {
			var levels = ['all', 'preserved', 'disposable', 'none'];
			ignore[name] = (levels.indexOf(level) != -1) ? level : 'all';
		}
		return this;
	}
});



/* --------------- Class : Iroha.Iterator --------------- */
/**
 * @class iterator
 */
Iroha.Iterator = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * iterated elements; an associative array, an array, or an object like those.
	 * @type Object
	 * @private
	 */
	this.targets = undefined;

	/**
	 * an array of keys in iterated elements.
	 * @type String[]
	 * @private
	 */
	this.keys = [];

	/**
	 * a number of current position of the iterator.
	 * @type Number
	 * @private
	 */
	this.counter = 0;

	/**
	 * element getting mode; "key", "value", or "both".
	 * @type String
	 * @private
	 */
	this.mode = 'value';

	/**
	 * flag to abort automatic iterating
	 * @type Boolean
	 * @private
	 */
	this.aborted = false;
};

/**
 * Iroha.Iterator のインスタンスを作って返す。
 * @return Iroha.Iterator の新規インスタンス
 * @type Iroha.Iterator
 */
Iroha.Iterator.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

$.extend(Iroha.Iterator.prototype,
/** @lends Iroha.Iterator.prototype */
{
	/**
	 * initialize
	 * @param {Object} targets           iterated elements; an associative array, an array, or an object like those.
	 * @param {Object} [mode="value"]    element getting mode; 'key', 'value', or 'both'
	 * @return this instance
	 * @type Iroha.Iterator
	 */
	init : function(targets, mode) {
		var modes = [ 'key', 'value', 'both' ];

		if (!targets || typeof targets != 'object') {
			throw new TypeError('Iroha.Iterator#init: invalid object type.');

		} else if (mode && modes.indexOf(mode) == -1) {
			throw new ReferenceError('Iroha.Iterator#init: invalid mode.');

		} else {
			this.targets = targets;
			this.keys    = [];
			this.mode    = mode || 'value';
			$.each(this.targets, $.proxy(function(key) { this.keys.push(key) }, this));
		}

		return this;
	},

	/**
	 * does the iterator has next element?
	 * @return true if the iterator has next element.
	 * @type Boolean
	 */
	hasNext : function() {
		return (this.counter < this.keys.length);
	},

	/**
	 * get next element in the iteration; the form of an acquired element depends on "element getting mode"
	 * @return next element in the iteration
	 * @type Object
	 */
	next : function() {
		if (!this.hasNext()) {
			throw new ReferenceError('Iroha.Iterator#next: stopped iteration.');

		} else {
			var key   = this.keys[this.counter++];
			var value = this.targets[key];
			switch(this.mode) {
				case 'key'   : return key;
				case 'value' : return value;
				case 'both'  : return [key, value];
				default      : return undefined;
			}
		}
	},

	/*
	 * start automatic iterating.
	 * @param {Function} func             callback function
	 * @param {Number}   [ms=0]           milliseconds to interval
	 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
	 * @return this instance
	 * @type Iroha.Iterator
	 */
	iterate : function(func, ms, aThisObject) {
		if (typeof func != 'function') {
			throw new TypeError('Iroha.Iterator#iterate: first argument must be a function object.');

		} else {
			var flag = !this.aborted && this.hasNext()
				? func.apply(aThisObject, $.makeArray(this.next()))
				: false;
			if (flag !== false) {
				ms > 0
					? Iroha.delay(ms, this).done(function() { this.iterate(func, ms, aThisObject) })
					: this.iterate(func, ms, aThisObject);
			}
		}
		return this;
	},

	/**
	 * abort automatic iterating
	 * @return this instance
	 * @type Iroha.Iterator
	 */
	abort : function() {
		this.aborted = true;
		return this;
	}
});



/* --------------- Class : Iroha.Timeout --------------- */
/**
 * @class a wrapper of 'setTimeout()'.
 */
Iroha.Timeout = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * timer ID.
	 * @type Number
	 * @private
	 */
	this.id = 0;

	/**
	 * native timer function name.
	 * @type String
	 * @private
	 * @constant
	 */
	this.timerFunc = 'setTimeout';
};

/**
 * Iroha.Timeout のインスタンスを作って返す。
 * @return Iroha.Timeout の新規インスタンス
 * @type Iroha.Timeout
 */
Iroha.Timeout.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

$.extend(Iroha.Timeout.prototype,
/** @lends Iroha.Timeout.prototype */
{
	/**
	 * initialize.
	 * @param {Function} func             callback function
	 * @param {Number}   [ms=0]           milliseconds to timeout
	 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
	 * @param {Boolean}  [immediate]      if true, do immediate callback at start
	 * @return this instance
	 * @type Iroha.Timeout
	 */
	init : function(func, ms, aThisObject, immediate) {
		var func  = $.proxy($.isFunction(func) ? func : new Function, aThisObject);
		var timer = window[this.timerFunc];
		if (ms > 0) {
			this.id = (Iroha.ua.isIE)
				? timer(func, ms, 'JScript')  // workaround to the page weaved with vbscript.
				: timer(func, ms);
		} else {
			immediate = true;
		}
		if (immediate) {
			func();
		}
		return this;
	},

	/**
	 * clear timer.
	 * @return this instance
	 * @type Iroha.Timeout
	 */
	clear : function() {
		clearTimeout (this.id);
		clearInterval(this.id);
		return this;
	},

	/**
	 * @deprecated use {@link #clear} method instead of this method.
	 * @return this instance
	 * @type Iroha.Timeout
	 */
	clearTimer : function() {
		return this.clear.apply(this, arguments);
	}
});



/* --------------- Class : Iroha.Interval --------------- */
/**
 * @class a wrapper of 'setInterval()'.
 * @extends Iroha.Timeout
 */
Iroha.Interval = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * timer ID.
	 * @type Number
	 * @private
	 */
	this.id = 0;

	/**
	 * native timer function name.
	 * @type String
	 * @private
	 * @constant
	 */
	this.timerFunc = 'setInterval';
};

/**
 * Iroha.Interval のインスタンスを作って返す。
 * @return Iroha.Interval の新規インスタンス
 * @type Iroha.Interval
 */
Iroha.Interval.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

Iroha.Interval.prototype = new Iroha.Timeout;



/* --------------- Class : Iroha.Timer --------------- */
/**
 * @class simple elapsed timer.
 */
Iroha.Timer = function() {
	var self = arguments.callee;
	return self === this.constructor ? this.init() : new self;
};

/**
 * Iroha.Timer のインスタンスを作って返す。
 * @return Iroha.Timer の新規インスタンス
 * @type Iroha.Timer
 */
Iroha.Timer.create = function() {
	return new this;
};

$.extend(Iroha.Timer.prototype,
/** @lends Iroha.Timer.prototype */
{
	/**
	 * started time of this timer.
	 * @type Date
	 * @private
	 */
	started : undefined,

	/**
	 * initialize
	 * @return this instance
	 * @type Iroha.Timer
	 */
	init : function() {
		return this.reset();
	},

	/**
	 * reset timer.
	 * @return this instance
	 * @type Iroha.Timer
	 */
	reset : function() {
		this.started = new Date;
		return this;
	},

	/**
	 * get acquire time progress in milisecond.
	 * @return acquire time progress in milisecond.
	 * @type Number
	 */
	getTime : function() {
		return (new Date) - this.started;
	},

	/**
	 * get acquire time progress in second.
	 * @return acquire time progress in second.
	 * @type Number
	 */
	getSeconds : function() {
		return this.getTime() / 1000;
	}
});



/* --------------- Class : Iroha.Tag --------------- */
/**
 * @class tag-string as element object.
 */
Iroha.Tag = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * tag name (element name) to create.
	 * @type String
	 */
	this.tagName = '';

	/**
	 * associative array of attributes { name1 : value1, name2 : value2 ... }
	 * @type Object
	 */
	this.attributes = {};

	/**
	 * array of {@link Iroha.Tag} instances
	 * @type Iroha.Tag[]
	 */
	this.childNodes = [];
};

/**
 * Iroha.Tag のインスタンスを作って返す。
 * @return Iroha.Tag の新規インスタンス
 * @type Iroha.Tag
 */
Iroha.Tag.create = function() {
	var instance = new this;
	return instance.init.apply(instance, arguments);
};

$.extend(Iroha.Tag.prototype,
/** @lends Iroha.Tag.prototype */
{
	/**
	 * initialize
	 * @param {String} tagName    element name to create
	 * @param {Object} [attrs]    associative array of attributes { name1 : value1, name2 : value2 ... }
	 * @return このインスタンス自身
	 * @type Iroha.Tag
	 */
	init : function(tagName, attrs) {
		if (typeof tagName != 'string') {
			throw new TypeError('Iroha.Tag#.init: first argument must be a string (tagName).');
		} else {
			this.tagName    = tagName;
			this.attributes = attrs || {};
			this.childNodes = [];

			return this;
		}
	},

	/**
	 * 属性値を設定する／読み出す
	 * @param {String} name       対象とする属性の名前
	 * @param {String} [value]    その属性に値を設定する場合は、その値。（無指定時は属性値の読み出しとなる）
	 * @return 指定された属性の現在の値、または今セットした値そのもの、
	 * @type String
	 */
	attr : function(name, value) {
		if (typeof name != 'string') {
			throw new TypeError('Iroha.Tag#.attr: first argument must be a string (name).');
		} else if (value == undefined) {
			return this.attributes[name] || '';
		} else {
			return (this.attributes[name] = String(value));
		}
	},

	/**
	 * append child instance.
	 * @param {Iroha.Tag|String} arg 　　instance to append
	 * @return このインスタンス自身
	 * @type Iroha.Tag
	 */
	append : function(arg) {
		if (arg == undefined || arg == null) {
			throw new TypeError('Iroha.Tag#append: first argument must be a string or a Iroha.Tag instance.');
		} else {
			if (arg.constructor != this.constructor) {
				arg = String(arg);
			}
			this.childNodes.push(arg);
			return this;
		}
	},

	/**
	 * output instance data as tag string. typically to use document.write().
	 * @param {Boolean} [debug=false]    debug mode - escaped output
	 * @return HTML tag string
	 * @type String
	 */
	toString : function(debug) {
		var tagOpen    = (debug) ? '&lt;' : '<';
		var tagClose   = (debug) ? '&gt;' : '>';
		var tag        = tagOpen + this.tagName;
		var content    = (this.childNodes.length) ? '' : null;
		for (var i = 0, n = this.childNodes.length; i < n; i++) {
			content += this.childNodes[i].toString(debug);
		}
		for (var attr in this.attributes) {
			tag += ' ' + attr + '="' + this.attributes[attr] + '"';
		}
		tag += (content != null) ?
			tagClose + content + tagOpen + '/' + this.tagName + tagClose :
			' /' + tagClose;
		return tag;
	}
});



/* ============================== Iroha static functions ============================== */

/* --------------- Function : Iroha.setValue --------------- */
/**
 * set value to deep object directly.
 * @param {String} expr            object expression string to set value
 * @param {Object} [value]         value to set
 * @param {Object} [obj=window]    base object of expr
 * @returns value that set
 * @type Object
 */
Iroha.setValue = function(expr, value, obj) {
	if (typeof expr != 'string' || !expr) {
		throw new TypeError('Iroha.setValue: first argument type must be string (expr).');
	} else if (obj !== null) {
		var props = expr.split('.');
		var obj   = (obj === undefined) ? window : obj
		if (props.length == 1) {
			return (obj[expr] = value);
		} else {
			var prop = props.shift();
			if (obj[prop] == undefined) {
				obj[prop] = {};
			}
			return arguments.callee(props.join('.'), value, obj[prop]);
		}
	}
};



/* --------------- Function : Iroha.getValue --------------- */
/**
 * get value from deep object directly.
 * @param {String} expr            object expression string to get value
 * @param {Object} [obj=window]    base object of expr
 * @returns any type of value
 * @type Object
 */
Iroha.getValue = function(expr, obj) {
	if (typeof expr != 'string' || !expr) {
		throw new TypeError('Iroha.getValue: first argument type must be string (expr).');
	} else {
		var expr = ('this.' + expr).replace(/\b\.?(\d+)\b/g, '[$1]').replace(/\[\[/g, '[').replace(/\]\]/g, ']');
		var obj  = $.type(obj) != 'object' ? window : obj;
		var get  = new Function('try { return ' + expr + ' }catch(e){}');
		return get.call(obj);
	}
};



/* --------------- Function : Iroha.singleton --------------- */
/**
 * create object as single instance. or put existing instance.
 * @param {Function} _constructor    constructor
 * @param {Object}   [_arguments]    arguments for constructor
 * @return single instance.
 * @type Object
 */
Iroha.singleton = function(_constructor, /* arg1, arg2, ... */ _arguments) {
	if (typeof _constructor != 'function') {
		throw new TypeError('Iroha.singleton: first argument must be a constructor function.');
	} else {
//		var args = Array.prototype.slice.call(arguments, 1);
		return _constructor.__Iroha_SingleInstance__ || (_constructor.__Iroha_SingleInstance__ = new _constructor());
	}
};



/* --------------- Function : Iroha.throttle --------------- */
/**
 * 指定した時間に1度しか実行されない関数を生成する。
 * @param {Function} func           対象となる関数。
 * @param {Number} wait             制限時間。単位 ms 。
 * @param {Object} [aThisObject]    関数内で "this" が指し示すことになるもの
 * @return {Function} 実行間隔が制限された関数
 */
Iroha.throttle = function (func, wait, aThisObject) {
	var last = 0, ctx, args, timer;
	var later = function () {
		last = +new Date;
		timer = null;
		func.apply(ctx, args);
	};
	return function () {
		var remains = last + wait - new Date;
		ctx = aThisObject || this;
		args = arguments;
		if (remains <= 0) {
			later();
			return;
		}
		if (!timer) {
			timer = window.setTimeout(later, remains);
		}
	};
};



/* --------------- Function : Iroha.debounce --------------- */
/**
 * 指定した時間呼ばれなかったら初めて実行される関数を生成する。
 * @param  {Function} func          対象となる関数。
 * @param {Number} delay            最後に呼んでから実行までの時間。単位 ms。
 * @param {Object} [aThisObject]    関数内で "this" が指し示すことになるもの
 * @return {Function} 指定した時間呼ばれなかったら初めて実行される関数
 */
Iroha.debounce = function (func, delay, aThisObject) {
	var timer, ctx, args;
	var delayed = function () {
		func.apply(ctx, args);
	};
	return function () {
		ctx = aThisObject || this;
		args = arguments;
		if (timer) {
			window.clearTimeout(timer);
		}
		timer = window.setTimeout(delayed, delay);
	};
};



/* --------------- Function : Iroha.barrageShield --------------- */
/**
 * create wrapper function which ignores and unify barraged-function-calls.
 * @param {Function} func             a function which has possibility to be barraged function-calls
 * @param {Number}   [delay=1]        delay time to ignore barraged function-calls
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the function
 * @return wrapper function.
 * @type Function
 * @deprecated use Iroha.debounce
 */
Iroha.barrageShield = function(func, delay, aThisObject) {
	if (typeof func != 'function') {
		throw new TypeError('Iroha.barrageShield: first argument must be a function object.');
	} else {
		return function() {
			var _args  = arguments;
			var _delay = Math.max(delay, 1) || 1;
			clearTimeout(func.__Iroha_BarrageShield_Timer__);
			func.__Iroha_BarrageShield_Timer__ = setTimeout(function() { func.apply(aThisObject || window, _args) }, _delay);
		}
	}
};



/* --------------- Function : Iroha.alreadyApplied --------------- */
/**
 * return 'true' if the function is already applied.
 * @param {Function} func    typically 'arguments.callee'
 * @return boolean
 * @type Boolean
 */
Iroha.alreadyApplied = function(func) {
	if (typeof func != 'function') {
		throw new TypeError('Iroha.alreadyApplied: first argument must be a function object.');
	} else {
		return func.__Iroha_alreadyApplied__ || !(func.__Iroha_alreadyApplied__ = true);
	}
};



/* --------------- Function : Iroha.preloadImage --------------- */
/**
 * create Image object (load image).
 * @param {String} src     image url to load
 * @return image object
 * @type Image
 */
Iroha.preloadImage = function(src) {
	if (typeof src != 'string' || !src) {
		throw new TypeError('Iroha.preloadImage: first argument must be a string (img src).');
	} else {
		var img = new Image;
		img.src = src;
		return img;
	}
};



/* --------------- Function : Iroha.getLinkTarget --------------- */
/**
 * get an element which is linked from given anchor element in same page.
 * @see jQuery.fn.Iroha_getLinkTarget
 * @param {Element|jQuery|String}  anchor             anchor element (a, area).
 * @param {String}                [target="_self"]    target name to assume that given anchor is inner-page link.
 * @return jQuery indicating an element which is linked from given anchor element.
 * @type jQuery
 */
Iroha.getLinkTarget = function(anchor, target) {
	var anchor = $(anchor).filter('a, area').get(0);
	var target = target ? String(target) : '_self';
	var $ret   = $();
	if (anchor) {
		var _target = anchor.target || '_self';
		var _hash   = anchor.hash   || '#';
		var _href   = decodeURIComponent(anchor.href)
		              	.replace(_hash, '')
		              	.replace(decodeURIComponent(location.href.split('#')[0]), '');
		              		// decodeURIComponent は Safari 対策。
		if (_target == target && _hash != '#' && !_href) {
			$ret = $(_hash);
			$ret = $ret.length ? $ret : _hash == '#top' ? $(document.body) : $();
		}
	}
	return $ret;
};



/* --------------- Function : Iroha.urlToAnchor --------------- */
/**
 * 指定要素ノードが内包しているすべてのテキスト中の URL らしき文字列をリンクにする。
 * DOM Range の使えるブラウザでないとエラーになります。
 * IE8 を含むそれより古い IE では以下のいずれかが必要。（ちなみに、この2つは同居できない）
 *   - <a href="http://code.google.com/p/ierange/">W3C DOM Ranges for IE</a>
 *   - <a href="http://code.google.com/p/rangy/">Rangy</a>
 * @param {jQuery|Element|String} node      処理対象（起点）の要素ノード
 * @param {String}                [tmpl]    URL をリンクにするとき雛形とする a 要素の HTML 文字列
 * @return 与えた要素ノード（を内包した jQuery オブジェクト）
 * @type jQuery
 */
Iroha.urlToAnchor = function(node, tmpl) {
	var range = document.createRange();
	var tmpl  = tmpl || '<a href="${0}">${0}</a>';
	var regex = /(h?ttps?:\/\/[^\s]+)/;

	return $(node)
		.filter(function() { return $(this).closest('a').length == 0 })
		.each  (function() {
			(function(_node) {
				var _callee = arguments.callee;
				$(_node).contents().each(function() {
					switch(this.nodeType) {
						case 1 :
							_callee(this);
							break;
						case 3 :
							if (regex.test(this.nodeValue)) {
								var url = RegExp.$1;
								var pos = this.nodeValue.indexOf(url);
								range.setStart(this, pos);
								range.setEnd  (this, pos + url.length);
								range.deleteContents();
								range.insertNode($(Iroha.String(tmpl).format(url).get()).get(0));

								// 現在のテキストノードは分割されたので、同一の親ノードの下にぶら下がった次のテキストノードを探す
								// 存在していればそれを次の処理対象にする。
								var next = this.nextSibling;
								while (next && next.nodeType != 3) { next = next.nextSibling };
								next && arguments.callee.call(next);
							}
							break;
					}
				})
			})(this);
		});
};



/* --------------- Function : Iroha.getQuery --------------- */
/**
 * クエリ文字列を連想配列化したものを得る。
 * @param {String} [serialized]    "serialized" の場合、{ name, value } の連想配列を、クエリ文字列の並び順に収めたシリアライズド配列を得る。
 * @return クエリ文字列を連想配列化したオブジェクト、または { name, value } の連想配列をクエリ文字列の並び順に収めたシリアライズド配列。
 * @type Object|Object[]
 */
Iroha.getQuery = function(serialized) {
	var pairs = [];
	var query = location.search.split('?')[1];
	if (query) {
		query.split('&').forEach(function(pair) {
			pair = pair.split('=');
			pairs.push({ name : pair[0], value : pair[1] });
		});
	}
	if (!serialized || serialized != 'serialized') {
		var arr   = pairs;
			pairs = {};
		arr.forEach(function(pair) { pairs[pair.name] = pair.value });
	}
	return pairs;
};



/* --------------- Function : Iroha.getGeometry --------------- */
/**
 * get window geometry and mouse position.
 * @param {Event} e       event object - this param exists when this function is called as an event handler.
 * @param {Window} win    window object - specify this param to alter window object.
 * @returns an associative array of geometry properties
 * @type Iroha.geom
 */
Iroha.getGeometry = function(e, win) {
	var w = win || window;
	var d = w.document.documentElement;
	var b = w.document.body;
	var g = Iroha.geom;
	var _ = arguments.callee;

	var isWinIEqm = (Iroha.ua.isIE && Iroha.ua.isWin && Iroha.ua.isQuirksMode);
	var isMacIE   = (Iroha.ua.isIE && Iroha.ua.isMac);
	var isSafari2 = (Iroha.ua.isSafari && Iroha.ua.version < 522); /* Safari 2.0.x or ealier */
	var isAndrStd = Iroha.ua.isAndroidBrowser;
	var isAndrCrm = Iroha.ua.isAndroid && Iroha.ua.isChrome;

	g.density     = w.devicePixelRatio || 1;
	g.orientation = w.orientation      || 0;
	g.screenW     = Math.floor((isAndrCrm && Math.abs(g.orientation) == 90 ? screen.height : screen.width ) / (isAndrStd ? g.density : 1));
	g.screenH     = Math.floor((isAndrCrm && Math.abs(g.orientation) == 90 ? screen.width  : screen.height) / (isAndrStd ? g.density : 1));
	g.windowW     = w.innerWidth  || (isMacIE ? b.scrollWidth  : d.offsetWidth );
	g.windowH     = w.innerHeight || (isMacIE ? b.scrollHeight : d.offsetHeight);
	g.pageW       = (isMacIE) ? d.offsetWidth  : (isWinIEqm) ? b.scrollWidth  : d.scrollWidth ;
	g.pageH       = (isMacIE) ? d.offsetHeight : (isWinIEqm) ? b.scrollHeight : d.scrollHeight;
	g.scrollX     = w.scrollX || d.scrollLeft || b.scrollLeft || 0;
	g.scrollY     = w.scrollY || d.scrollTop  || b.scrollTop  || 0;
	g.windowX     = (!e) ? (g.windowX || 0) : e.clientX - (( isSafari2) ? g.scrollX : 0);
	g.windowY     = (!e) ? (g.windowY || 0) : e.clientY - (( isSafari2) ? g.scrollY : 0);
	g.pageX       = (!e) ? (g.pageX   || 0) : e.clientX + ((!isSafari2) ? g.scrollX : 0);
	g.pageY       = (!e) ? (g.pageX   || 0) : e.clientY + ((!isSafari2) ? g.scrollY : 0);
	g.zoom        = _.getZoomRatio();
	g.scrollBar   = _.getScrollBarWidth();

	if (Iroha.settings.common.showGeometry) {
		var msg = [
			  ['screen'     , '${screenW}x${screenH}']
			, ['window'     , '${windowW}x${windowH}']
			, ['page'       , '${pageW}x${pageH}'    ]
			, ['scroll'     , '${scrollX},${scrollY}']
			, ['pos(view)'  , '${windowX},${windowY}']
			, ['pos(abs)'   , '${pageX},${pageY}'    ]
			, ['zoom'       , '${zoom}'              ]
			, ['scrollBar'  , '${scrollBar}'         ]
			, ['density'    , '${density}'           ]
			, ['orientation', '${orientation}'       ]
		].map(function(a) { return a.join(': ') }).join(' | ');
		window.status = Iroha.String(msg).format(g).get();
	}

	return g;
};

/**
 * get window zoom ratio for IE7+
 * @returns window zoom ratio on IE7+ / always 1 on other browsers.
 * @type Number
 * @private
 */
Iroha.getGeometry.getZoomRatio = function() {
	var d = document.documentElement;
	var b = document.body;
	var _ = arguments.callee;
	_._cache_ = _._cache_ || 1;
	if (Iroha.ua.isIE && Iroha.ua.version >= 7.0) {
		if (_._lock_) {
			_._lock_.clear();
			_._lock_ = new Iroha.Timeout(function() { _._lock_ = null }, 500);
		} else {
			_._lock_ = new Iroha.Timeout(function() { _._lock_ = null }, 500);
			if (Iroha.ua.isQuirksMode) {
				_._cache_ = d.offsetWidth / b.offsetWidth;
			} else {
				var id  = 'Iroha_getGeometry_getZoomRatio_TestNode';
				var css = {
					  'position'   : 'absolute'
					, 'left'       : '0px'
					, 'top'        : '0px'
					, 'width'      : (d.scrollWidth * 10) + 'px'
					, 'height'     : '10px'
					, 'background' : 'red'
				};
				var node = $('#' + id).get(0) || $(document.createElement('ins')).attr('id', id).css(css).appendTo(document.body).get(0);
				$(node).show();
				_._cache_ = d.scrollWidth / node.offsetWidth;
				$(node).hide();
			}
		}
	}
	return _._cache_;
};

/**
 * get scrollbar width
 * @return scrollbar width in px unit
 * @type Number
 * @private
 */
Iroha.getGeometry.getScrollBarWidth = function() {
	var _ = arguments.callee;
	if (typeof _._cache_ != 'number') {
		var id  = 'Iroha_getGeometry_getScrollBarWidth_TestNode';
		var css = {
			  'position'   : 'absolute'
			, 'left'       : '-10000px'
			, 'top'        : '-10000px'
			, 'display'    : 'block'
			, 'visibility' : 'hidden'
			, 'overflow'   : 'scroll'
			, 'width'      : '100px'
			, 'height'     : '100px'
			, 'border'     : 'none'
			, 'margin'     : '0'
			, 'padding'    : '0'
		};
		var node = $('#' + id).get(0) || $(document.createElement('ins')).attr('id', id).css(css).appendTo(document.body).get(0);
		_._cache_ = node.offsetWidth - node.clientWidth;
		$(node).remove();
	}
	return _._cache_;
};

/**
 * measuring the geometry continuously
 */
Iroha.getGeometry.continuously = function() {
	if (!Iroha.alreadyApplied(arguments.callee)) {
		Iroha.getGeometry();
		$(document).mousemove(Iroha.getGeometry);
	}
};



/* --------------- Function : Iroha.getCommonDir --------------- */
/**
 * get URL of common directory.
 * @param {String} dirName     name of common directory
 * @return absolute URL of common directory.
 * @type String
 */
Iroha.getCommonDir = function(dirName) {
	if (typeof dirName != 'string' || !dirName) {
		throw new TypeError('Iroha.getCommonDir: first argument must be a string (directory name to find).');
	} else {
		var path  = './';
		var nodes = document.getElementsByTagName('head')[0].getElementsByTagName('script');
		for (var i = 0, n = nodes.length; i < n; i++) {
			var arr = nodes[i].src.split('/');
			var idx = arr.indexOf(dirName);
			if (idx != -1) {
				path = arr.slice(0, idx + 1).join('/') + '/';
				break;
			}
		}
		if (!path.match(':')) {   // if path is not absolute url (workaround for IE)
			var base = document.getElementsByTagName('base')[0];
			var burl = (base) ? base.href : location.href;
			if (Iroha.String(path).startsWith('/')) {
				path = burl.match(/^\w+:\/*[^\/]+/)[0] + path;
			} else {
				path = Iroha.String(path).rel2abs(burl).get();
			}
		}
		return path;
	}
};



/* --------------- Function : Iroha.watchFor --------------- */
/**
 * watch existing of the specified object.
 * @param {String} expr              string-expression of watching target object.
 * @param {Number} [timeout=3000]    time to giving up (ms, positive number)
 * @param {Object} [base=window]     base object of expr
 * @param {Number} [interval=96]     watching interval (ms, positive number)
 * @return a Deferred's Promise object.
 * @type jQuery.Deferred.Promise
 */
Iroha.watchFor = function(expr, timeout, base, interval) {
	var deferred = $.Deferred();
	var observer = function() {
		var obj = Iroha.getValue(expr, base);
		if (obj) {
			observe.clear();
			giveup .clear();
			deferred.resolve(obj);
		}
	};
	var terminate = function() {
		observe.clear()
		deferred.reject()
	}
	var observe = new Iroha.Interval(observer , Math.max(0, interval) ||   96);
	var giveup  = new Iroha.Timeout (terminate, Math.max(0, timeout ) || 3000);
	observer();

	return deferred.promise();
};



/* --------------- Function : Iroha.openWindow --------------- */
/**
 * open new window.
 * @namespace window opener
 * @param {String}        url               url to open in new window
 * @param {String}        [target="_blank"] window target name
 * @param {Object|String} [option]          window options (in string form, or an associative array)
 * @return new window object
 * @type Window
 */
Iroha.openWindow = function(url, target, option) {
	var _this    = arguments.callee;
	var target   = target || '_blank';
	var option  = $.type(option) == 'string' ? _this.parse(option) : option;
		option  = $.extend(null, _this.DEF_OPTIONS, option);

	option.width  || delete option.width ;
	option.height || delete option.height;
	var newWin = window.open(url, target, _this.parse(option));
	try {  // workaround for IETester
		newWin.focus();
		if (option.moveToOrigin) {
			newWin.moveTo(0, 0);
		}
	} catch(err) {
		console.error(err);
	}
	if (option.autoResizeTo) {
		switch ($.type(option.autoResizeTo)) {
			case 'boolean' : _this.autoResize(newWin, option.width, option.height); break;
			case 'string'  : _this.autoResize(newWin, option.autoResizeTo); break;
		}
	}

	if (window.event) window.event.returnValue = false;
	return newWin;
};

$.extend(Iroha.openWindow,
/** @lends Iroha.openWindow */
{
	/**
	 * 指定できるオプション
	 * @param Object
	 * @constant
	 * @private
	 */
	DEF_OPTIONS : {
		  'width'        : 0
		, 'height'       : 0
		, 'toolbar'      : true
		, 'location'     : true
		, 'directories'  : true
		, 'status'       : true
		, 'menubar'      : true
		, 'scrollbars'   : true
		, 'resizable'    : true
		, 'moveToOrigin' : true  // additional option affects in Iroha.openWindow() only, @type {Boolean}
		, 'autoResizeTo' : ''    // additional option affects in Iroha.openWindow() only, @type {String|Boolean}
	},

	/**
	 * 連想配列からオプション指定用の文字列を作り出す。またはオプション指定用文字列を連想配列に変換したものを得る。
	 * @param {String|Object}    オプション指定用文字列、またはオプション指定の連想配列表現
	 * @return 引数が String のときは連想配列、引数が Object のときは文字列。
	 * @type Object|String;
	 */
	parse : function(option) {
		switch ($.type(option)) {
			case 'string' :
				var pairs = option.split(',');
				var obj   = {};
				pairs.forEach(function(pair) {
					var key   = pair.split('=')[0];
					var value = pair.split('=')[1] || '';
					obj[key]  = $.isNumeric(value) ? Number(value) : (value == 'yes') ? true : (value == 'no' ) ? false : String(value);
				});
				return obj;

			case 'object' :
				var ret = [];
				$.each(option, function(key, value) {
					value = ($.isNumeric(value) || $.type(value) != 'boolean') ? value : (value) ? 'yes' : 'no';
					ret.push([ key, value ].join('='));
				});
				return ret.join();

			default :
				return undefined;
		}
	},

	/**
	 * open new fullscreen window.
	 * @param {String}        url               url to open in new window
	 * @param {String}        [target="_blank"] window target name
	 * @param {Object|String} [option]          window options (in string form, or an associative array)
	 * @return new window object
	 * @type Window
	 */
	full : function(url, target, option) {
		var def = {};
		$.each(this.DEF_OPTIONS, function(key, value) {
			def[key] = ($.type(value) == 'boolean') ? false : value;
		});

		option = ($.type(option) == 'string') ? this.parse(option) : option;
		option = $.extend(def, option, { width : screen.availWidth, height : screen.availHeight, moveToOrigin : true });

		return Iroha.openWindow(url, target, option);
	},

	/**
	 * 新しいウインドウサイズ（というよりビューポートサイズ）を指定のサイズに合わせる。
	 * @param {Window}        newWin    新しいウインドウのウインドウオブジェクト
	 * @param {Number|String} [arg1]    横幅を数値で指定。または、リサイズの基準にする要素ノードのセレクタ。
	 * @param {Number}        [arg2]    縦幅を数値で指定。
	 * @return 与えたウインドウオブジェクト自身
	 * @type Window
	 */
	autoResize : function(newWin, arg1, arg2) {
		var watchFor = Iroha.watchFor;
		var mainProc = function() {
			watchFor('Iroha', 3000, newWin)
				.done(function(Iroha) {
					var destW;
					var destH;

					if ($.type(arg1) == 'string') {
						var $node = Iroha.jQuery(arg1);
							destW = $node.outerWidth () || 0;
							destH = $node.outerHeight() || 0;
					} else {
						destW = Math.max(0, arg1) || 0;
						destH = Math.max(0, arg2) || 0;
					}
					destW += Iroha.ua.isIE && Iroha.ua.documentMode <= 8 ? 4 : 0;
					destH += Iroha.ua.isIE && Iroha.ua.documentMode <= 8 ? 4 : 0;
					if (destW > 0 && destH > 0) {
						var diffW = 0
						var diffH = 0;
						var retry = 10;
						var timer = setInterval(function() {
							var g = Iroha.getGeometry();
							diffW = destW - g.windowW;
							diffH = destH - g.windowH;
							newWin.resizeBy(diffW, diffH);
							if (!retry-- || diffW == 0 && diffH == 0) clearInterval(timer);
						}, 100);
					}
				});
		};
		mainProc();                // WebKit, IE8+
		$(newWin).load(mainProc);  // Gecko , IE7-
		return newWin;
	}
});



/* --------------- Function : Iroha.addUserAgentCName --------------- */
/**
 * ブラウザ別の className を <body> 要素に付加する。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.addUserAgentCName = function() {
	var cnames  = [];
	var ua      = $.extend(null, this.ua);  // オブジェクト参照切断しつつコピー
	var mbVers  = String(ua.mbVersion).replace(/\./g, '_');
	    mbVers += Iroha.String(mbVers).contains('_') ? '' : '_0';

	delete ua.isWebkit;
	delete ua.isDOMReady;

	$.each(ua, function(key, bool) { bool === true && cnames.push('iroha-ua-' + key) });
	ua.isIE      && cnames.push('iroha-ua-isIE'      + ua.version);
	ua.isiOS     && cnames.push('iroha-ua-isiOS'     + mbVers);
	ua.isAndroid && cnames.push('iroha-ua-isAndroid' + mbVers);

//	// onload で即座に実行すると古い IE でスピードダウンする現象を軽減するために delay しつつ適用
//  // …するのはヤメた！
//	Iroha.delay(1).done(function() { $(document.body).addClass(cnames.join(' ')) });
	$(document.body).addClass(cnames.sort().join(' '));

	return this;
};



/* --------------- Function : Iroha.removeComments --------------- */
/**
 * コメントノードを削除 (for IE7 only)
 * @param {jQuery|Element|String} [base=document.body]    処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.removeComments = function(base) {
	if (Iroha.ua.isIE && Iroha.ua.documentMode == 7) {
		$(base || document.body)
			.each(function() {
				var nodes = this.getElementsByTagName('!');
				while (nodes[0]) { $(nodes[0]).remove() }
			});
	}
	return this;
};



/* --------------- Function : Iroha.setTitleFromAlt --------------- */
/**
 * img 要素などの alt 属性値を title 属性に設定する。 (IE7とそれ以前のブラウザを除く）
 * @param {jQuery|Element|String} [target="img, :image, area"]    処理対象とする（img 要素などの）要素ノード。
 * @param {jQuery|Element|String} [base=document.body]            処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.setTitleFromAlt = function(target, base) {
	if (!Iroha.ua.isIE || Iroha.ua.documentMode >= 8) {
		target || (target = 'img, :image, area');
		base   || (base   = document.body      );

		var dataKey = 'Iroha.setTitleFromAlt.origTitle';

		$(base)
			.on('mouseenter', target, function(e) {
				var title = this.getAttribute('title');
				if (title == null && this.alt) {
					this.title = this.alt;
				}
				$(this).data(dataKey, title);
			})
			.on('mouseleave', target, function(e) {
				var title = $(this).data(dataKey);
				if (title) {
					this.title = title;
				}
			});
	}
	return this;
};



/* --------------- Function : Iroha.setTitleFromInnerText --------------- */
/**
 * マイナスインデントで隠したテキストを title 属性に設定する
 * @param {jQuery|Element|String} [target]                処理対象とする要素ノード。
 * @param {jQuery|Element|String} [base=document.body]    処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.setTitleFromInnerText = function(target, base) {
	var dataKey = 'Nisoc.setTitleFromInnerText.origTitle';

	$(base || document.body)
		.on('mouseenter', target, function(e) {
			var title = this.getAttribute('title');
			if (title == null) {
				this.title = $(this).Iroha_getInnerText().replace(/\s+/g, ' ');
			}
			$(this).data(dataKey, title);
		})
		.on('mouseleave', target, function(e) {
			var title = $(this).data(dataKey);
			if (title) {
				this.title = title;
			}
		});

	return this;
};



/* --------------- Function : Iroha.trapWheelEvent --------------- */
/**
 * マウスホイールイベントを指定要素ノードの領域内にがんばって閉じ込める。これにより領域内のホイール操作ではページスクロールが（ほぼ）発生しなくなる。
 * @param {jQuery|Element|String}  node    対象要素ノード。単にセレクタ文字列を与えるのを推奨、その瞬間存在しない要素ノードでも有効に機能させることができるため。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.trapWheelEvent = function(node) {
	var ns = '.Iroha.trapWheelEvent';

	var wheel       = 'mousewheel' + ns;
	var msPointer   = navigator.msPointerEnabled;
	var touchstart  = (msPointer ? 'MSPointerDown' : 'touchstart') + ns;
	var touchend    = (msPointer ? 'MSPointerUp'   : 'touchend'  ) + ns;
	var swipe       = touchstart + ' ' + touchend;
	var postSwipe   = Iroha.Timeout ();

	$.type(node) == 'string'
		? $(document).on(wheel, node, wheelHandler).on(swipe, node, swipeHandler)
		: $(node    ).on(wheel,       wheelHandler).on(swipe,       swipeHandler);

	return this;

	function swipeHandler(e) {
		var $node    = $(e.currentTarget);
		var $content = $node.children().first();
		var padding  = 1;

		switch (e.type) {
			case 'touchstart'    :
			case 'MSPointerDown' :
				postSwipe.clear();
				$content.css('padding', padding);

				var scrollLeft  = $node.scrollLeft();
				var scrollTop   = $node.scrollTop ();
				var maxScrLeft  = $node.prop('scrollWidth' ) - $node.width ();
				var maxScrTop   = $node.prop('scrollHeight') - $node.height();

				scrollLeft == 0                            && $node.scrollLeft(scrollLeft + padding);
				scrollTop  == 0                            && $node.scrollTop (scrollTop  + padding);
				scrollLeft == maxScrLeft && maxScrLeft > 0 && $node.scrollLeft(scrollLeft - padding);
				scrollTop  == maxScrTop  && maxScrTop  > 0 && $node.scrollTop (scrollTop  - padding);
				break;

			case 'touchend'    :
			case 'MSPointerUp' :
				postSwipe = Iroha.Timeout(function() {
					$content.css('padding', 0);
					$node.scrollLeft($node.scrollLeft() - 2 * padding);
					$node.scrollTop ($node.scrollTop () - 2 * padding);
				}, 1000);
				break;
		}
	}

	function wheelHandler(e, delta, deltaX, deltaY) {
		var $node   = $(e.currentTarget);
		var width   = $node.prop('scrollWidth' ) - $node.width ();
		var height  = $node.prop('scrollHeight') - $node.height();
		var scrLeft = $node.scrollLeft();
		var scrTop  = $node.scrollTop ();
		isNaN(deltaX) && (deltaX = 0    );
		isNaN(deltaY) && (deltaY = delta);
		(deltaX > 0 && scrLeft == width  || deltaX < 0 && scrLeft == 0) && e.preventDefault();
		(deltaY < 0 && scrTop  == height || deltaY > 0 && scrTop  == 0) && e.preventDefault();
	}
};



/* --------------- Function : Iroha.untrapWheelEvent --------------- */
/**
 * マウスホイールイベントの閉じ込め処理を止める。
 * @param {jQuery|Element|String}  node    対象要素ノード。 {@link Iroha.trapWheelEvent} で指定したものと同形式のもの。例えば、セレクタ文字列で指定していたならセレクタ文字列。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.untrapWheelEvent = function(node) {
	var type = 'mousewheel.Iroha.trapWheelEvent';
	$.type(node) == 'string'
		? $(document).off(type, node)
		: $(node    ).off(type);

	return this;
};



/* --------------- Function : Iroha.fireShigekix --------------- */
/**
 * シゲキックス発動
 * @param {jQuery|Element|String}    シゲキックスを与える要素ノード
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.fireShigekix = function(target) {
	$(target).css('border', '1px solid red').css('border', 'none');
	return this;
};



/* --------------- Function : Iroha.delay --------------- */
/**
 * 指定時間のディレイをかける（ Deferred 。指定時間が経過すると resolve される Promise を返す）。
 * @param {Number} delay            ディレイする時間。非負整数。単位 ms 。
 * @param {Object} [aThisObject]    deferred.done() などの関数内で "this" が指し示すことになるもの
 * @return jQuery.Deferred.Promise オブジェクト
 * @type jQuery.Deferred.Promise
 */
Iroha.delay = function(delay, aThisObject) {
	var dfd     = $.Deferred();
	var resolve = function() { aThisObject ? dfd.resolveWith(aThisObject) : dfd.resolve() };
	delay > 0
		? setTimeout(resolve, delay)
		: resolve();
	return dfd.promise();
};



/* --------------- Function : Iroha.injectWeinre --------------- */
/**
 * Weinre をつかってインスペクトを始める（そのための外部 JS を非同期で注入する）。
 * Weinre : {@link http://people.apache.org/~pmuellr/weinre/docs/latest/}
 * @param {String} [ident="anonymous"]         アプリケーション識別子。任意に設定。
 * @param {Stirng] [host=location.hostname]    Weinre が稼働しているマシンのホストネーム。無指定時は表示中の HTML と同じものが指定される。
 * @param {Stirng] [port="8080"]               Weinre が稼働している（Listenしている）ポート番号。無指定時はデフォルトの "8080"。
 * @return Iroha オブジェクト
 * @type Iroha
 */
Iroha.injectWeinre = function(ident, host, port) {
	if (!Iroha.alreadyApplied(arguments.callee)) {
		var url   = '${protocol}//${host}:${port}/target/target-script-min.js#${ident}';
		var param = {
			  protocol : location.protocol
			, ident    : ident || 'anonymous'
			, host     : host  || location.hostname
			, port     : port  || '8080'
		};
		var src = Iroha.String(url).format(param).get();

		!Iroha.env.isDOMReady
			? document.write('<script src="' + src + '"></scr' + 'ipt>')
			: (function(node) {
				node.setAttribute('src', src);
				document.body.appendChild(node);
			})(document.createElement('script'));
	}
	return this;
};



/* =============== additional jQuery plugin methods =============== */

/* -------------------- jQuery.fn : Iroha_getComputedStyle -------------------- */
/**
 * get computed style value.
 * @exports $.fn.Iroha_getComputedStyle as jQuery.fn.Iroha_getComputedStyle
 * @param {String}  prop          style property name to get value
 * @param {String} [pseudo=""]    pseudo element/class name (effective in standard browsers only)
 * @return conputed style value string
 * @type String
 */
$.fn.Iroha_getComputedStyle = function(prop, pseudo) {
	var prop   = String(prop || '');
	var pseudo = String(pseudo   || '');
	var node   = this.get(0);
	if (!prop || !node) {
		return '';
	} else {
		return (node.currentStyle || document.defaultView.getComputedStyle(node, pseudo))[prop] || '';
	}
};



/* -------------------- jQuery.fn : Iroha_getLinkTarget -------------------- */
/**
 * get an element which is linked from given anchor element in same page.
 * @exports $.fn.Iroha_getLinkTarget as jQuery.fn.Iroha_getLinkTarget
 * @see Iroha.getLinkTarget
 * @param {String} [target="_self"]    target name to assume that given anchor is inner-page link.
 * @return jQuery indicating an element which is linked from given anchor element.
 * @type jQuery
 */
$.fn.Iroha_getLinkTarget = function(target) {
	return Iroha.getLinkTarget(this, target);
};



/* -------------------- jQuery.fn : Iroha_urlToAnchor -------------------- */
/**
 * 内包しているすべてのテキスト中の URL らしき文字列をリンクにする。
 * @exports $.fn.Iroha_urlToAnchor as jQuery.fn.Iroha_urlToAnchor
 * @see Iroha.urlToAnchor
 * @param {String} [tmpl]    URL をリンクにするとき雛形とする a 要素の HTML 文字列
 * @return jQuery current context object
 * @type jQuery
 */
$.fn.Iroha_urlToAnchor = function(target) {
	return Iroha.urlToAnchor(this, target);
};



/* -------------------- jQuery.fn : Iroha_normalizeTextNode -------------------- */
/**
 * remove text nodes that have only white spaces, and normalize space of each text nodes.
 * @exports $.fn.Iroha_normalizeTextNode as jQuery.fn.Iroha_normalizeTextNode
 * @param {Boolean} [deep]    process recursive node tree?
 * @return jQuery current context object
 * @type jQuery
 */
$.fn.Iroha_normalizeTextNode = function(deep) {
	this.contents().each(function() {
		if (this.nodeType == Node.TEXT_NODE) {
			if ((this.nodeValue = $.trim(this.nodeValue)) == '') {
				this.parentNode.removeChild(this);
			}
		} else if (deep && this.nodeType == Node.ELEMENT_NODE) {
			$(this).Iroha_normalizeTextNode(deep);
		}
	});
	return this;
};



/* -------------------- jQuery.fn : Iroha_getInnerText -------------------- */
/**
 * get whole inner texts in the node.
 * @exports $.fn.Iroha_getInnerText as jQuery.fn.Iroha_getInnerText
 * @param {Boolean} includeAlt    if true, alt texts of <img> elements are included.
 * @return whole inner texts.
 * @type String
 */
$.fn.Iroha_getInnerText = function(includeAlt) {
	var ret = [];
	this.eq(0).contents().each(function() {
		if (this.hasChildNodes()) {
			ret.push($(this).Iroha_getInnerText());
		} else if (this.nodeType == Node.TEXT_NODE) {
			ret.push(this.nodeValue);
		} else if (includeAlt && this.alt) {
			ret.push(this.alt);
		}
	});
//	return ret.join('').replace(/\s+/g, ' ');
	return ret.join('');
};



/* -------------------- jQuery.fn : Iroha_assistSelectEvent -------------------- */
/**
 * "change" event handler helper for "select" elements;
 * fire "change" event when "keyup" or "mousewheel" event comes.
 * @exports $.fn.Iroha_assistSelectEvent as jQuery.fn.Iroha_assistSelectEvent
 * @param {Number} [wait=100]    wait for preventing multiple fire (nonnegative integer in ms)
 * @return jQuery current context object
 * @type jQuery
 */
$.fn.Iroha_assistSelectEvent = function(wait) {
	wait = Math.max(wait, 0) || 100;
	return this.filter('select').keyup(trigger).mousewheel(trigger);

	function trigger() {
		var $node = $(this);
		var key   = 'Iroha.SelectEventAssist.trigger';
		$node.data(key) || $node.data(key, Iroha.barrageShield(function($) { $.trigger('change') }, wait));
		$node.data(key)($node);
	}
};



/* -------------------- jQuery.fn : Iroha_trapWheelEvent -------------------- */
/**
 * マウスホイールイベントをコンテキスト要素ノードの領域内にがんばって閉じ込める。これにより領域内のホイール操作ではページスクロールが（ほぼ）発生しなくなる。
 * その瞬間存在しない要素に対して適用したい場合は {@link Iroha.trapWheelEvent} を用いる。その第1引数に対象要素を見つけるためのセレクタ文字列を与える。
 * @exports $.fn.Iroha_trapWheelEvent as jQuery.fn.Iroha_trapWheelEvent
 * @see Iroha.trapWheelEvent
 * @return jQuery current context object
 * @type jQuery
 */
jQuery.fn.Iroha_trapWheelEvent = function() {
	Iroha.trapWheelEvent(this);
	return this;
};



/* -------------------- jQuery.fn : Iroha_untrapWheelEvent -------------------- */
/**
 * マウスホイールイベントの閉じ込め処理を解除する。
 * {@link Iroha.trapWheelEvent} を使ってセレクタ文字列指定で適用していたものは、{@link Iroha.untrapWheelEvent} を使って解除する必要がある。
 * @exports $.fn.Iroha_untrapWheelEvent as jQuery.fn.Iroha_untrapWheelEvent
 * @see Iroha.untrapWheelEvent
 * @return jQuery current context object
 * @type jQuery
 */
jQuery.fn.Iroha_untrapWheelEvent = function() {
	Iroha.untrapWheelEvent(this);
	return this;
};



/* -------------------- jQuery.fn : Iroha_addBeforeUnload -------------------- */
/**
 * temporary wrapper for adding event listener of "window.onBeforeUnload".
 * @exports $.fn.Iroha_addBeforeUnload as jQuery.fn.Iroha_addBeforeUnload
 * @param {Function} listener         an event listener function
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the listener func.
 * @return jQuery current context object
 * @type jQuery
 */
$.fn.Iroha_addBeforeUnload = function(listener, aThisObject) {
	if (this.get(0) === window) {
		if (window.addEventListener) {    // except IE8 and above
			window.addEventListener('beforeunload', $.proxy(listener, aThisObject), false);
		} else {
			this.bind('beforeunload', function(e) {
				if (e && e.originalEvent) {    // prevent error on IE (since jQuery1.4)
					listener.call(aThisObject, e.originalEvent);
				}
			});
		}
	}
	return this;
};



/* =============== for JSDoc toolkit output =============== */
/**
 * jQuery object, contains jQuery static methods.
 * @name jQuery
 * @namespace contains jQuery methods.
 */
/**
 * jQuery instance methods.
 * @name jQuery.fn
 * @namespace jQuery instance methods.
 */



})(jQuery, window, document);