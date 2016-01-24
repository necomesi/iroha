/*! "iroha.js" | Iroha - Necomesi JSLib : Base Script | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Base Script
 *       (charset : "UTF-8")
 *
 *    @version 3.64.20160102
 *    @requires jquery.js (or zepto.js)
 *    @requires underscore.js (or lodash.js)
 */
/* -------------------------------------------------------------------------- */
;(function($, _, Iroha) {



// supplements 'undefined'
window.undefined = window.undefined;



/* ============================== "Iroha" global object and prepartions ============================== */
/**
 * Iroha global object.
 * @name Iroha
 * @namespace
 * @global
 */
$.extend(Iroha, new (function() {
	var d = document;
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
				/(trident)(?:.*?rv:)([\w.]+)/.exec(ua) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
			return {
				browser: match[1] || "",
				version: match[2] || "0"
			};
		}
		matched = uaMatch(ua);
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
	 * stored jQuery (or Zepto) object, considering conflict.
	 * @name Iroha.$
	 */
	this.$ = $.isFunction($.noConflict) ? $.noConflict() : $;

	/**
	 * stored Underscore (or Lo-Dash) object, considering conflict.
	 * @name Iroha._
	 */
	this._ = $.isFunction(_.noConflict) ? _.noConflict() : _;

	/**
	 * default setting values of Iroha function/classes
	 * @name Iroha.settings
	 * @namespace
	 * @property {Object} common    common settings
	 */
	this.settings        = {};
	this.settings.common = {};

	/**
	 * identifier urls of frequently used XML-Namespaces.
	 * @name Iroha.ns
	 * @namespace
	 * @property {string} defaultNS    current default namespace of the docuemnt elmeent
	 * @property {string} xhtml1       XHTML1 namespace
	 * @property {string} xhtml2       XHTML2 namespace
	 * @property {string} iroha         Iroha namespace
	 */
	this.ns           = {};
	this.ns.defaultNS = (!de) ? '' : de.namespaceURI || de.tagUrn || '';
	this.ns.xhtml1    = 'http://www.w3.org/1999/xhtml';
	this.ns.xhtml2    = 'http://www.w3.org/2002/06/xhtml2';
	this.ns.iroha     = 'http://necomesi.jp/iroha';

	/**
	 * browser distinction results.
	 * @name Iroha.ua
	 * @namespace
	 * @property {string}  versionText         string form of the browser version number (ex: "1.9.0.2", "528.18.1", "7.0")
	 * @property {number}  version             float number of the browser version (ex: 1.9, 528.18, 7.0)
	 * @property {string}  mbVersText          string form of Mobile OS version number (ex: "5.0.1", "2.3.3", "6.5.3.5")
	 * @property {number}  mbVersion           float number of Mobile OS version (ex: 5, 2.3, 6.5)
	 *
	 * @property {boolean} isSafari            true if the browser is AppleWebKit-based (but in iOS/MacOS/Windows only, except Chrome Browser)
	 * @property {boolean} isWebKit            true if the browser is AppleWebKit-based any browsers
	 * @property {boolean} isChrome            true if the browser is Chrome Browser
	 * @property {boolean} isAndroidBrowser    true if the browser is Android "Standard Browser"
	 * @property {boolean} isGecko             true if the browser is Gecko-based.
	 * @property {boolean} isOpera             true if the browser is Opera
	 * @property {boolean} isIE                true if the browser is IE-based
	 * @property {boolean} isWin               true if the browser runs on Windows
	 * @property {boolean} isMac               true if the browser runs on MacOS(X)
	 *
	 * @property {boolean} isMobile            true if the browser runs on some mobile device
	 * @property {boolean} isiPhone            true if the browser runs on iPhone
	 * @property {boolean} isiPad              true if the browser runs on iPad
	 * @property {boolean} isiPod              true if the browser runs on iPod
	 * @property {boolean} isiOS               true if the browser runs on some Apple iOS device
	 * @property {boolean} isAndroid           true if the browser runs on Android
	 * @property {boolean} isWinPhone          true if the browser runs on Windows Phone
	 *
	 * @property {boolean} isQuirksMode        true if the browser runs under 'quirks mode'
	 * @property {number}  documentMode        number of documentMode; this avaiable on IE, the value is 0 on other browsers.
	 *
	 * @property {boolean} isTouchable         true if the browser supports touch evnets
	 *
	 * @property {boolean} isDOMReady          true if the browser had DOM feature.
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
	this.ua.isIE         = !!($.browser.ie || $.browser.msie || $.browser.trident);
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
	this.ua.isTouchable  = ('ontouchstart' in document);
	this.ua.isDOMReady   = (di) ? di.hasFeature('HTML', '1.0') : (this.ua.isIE && de);

	// isSafari と判別されていたとしても、iOS, Mac, Windows でないものや、Chrome の場合は false に戻す。
	this.ua.isSafari = this.ua.isSafari && !this.ua.isChrome && (this.ua.isiOS || this.ua.isMac || this.ua.isWin);

	// Android 標準ブラウザを判別
	this.ua.isAndroidBrowser = this.ua.isAndroid && this.ua.isWebKit && !this.ua.isChrome;

	// iOS Simulator の Mobile Safari 8.0 の UA 文字列がおかしい（？）件
	// こんなの "Mozilla/5.0 (iPhone; CPU iPhone OS 10_9_5 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A365 Safari/600.1.4"
	if (this.ua.mbVersion >= 10.9 && /Version\/(8[\d\.]+)/.test(ua)) {
		this.ua.mbVersion = parseFloat(this.ua.mbVersText = RegExp.$1);
	}

	/**
	 * geometry properties object; the property values are updated when {@link Iroha.getGeometry} is called.
	 * @name Iroha.geom
	 * @namespace
	 * @property {number} screenW      width  of the screen (devicePixelRatio considered, never change by orientation)
	 * @property {number} screenH      height of the screen (devicePixelRatio considered, never change by orientation)
	 * @property {number} windowW      width  of the window viewport.
	 * @property {number} windowH      height of the window viewport.
	 * @property {number} pageW        width  of the document.
	 * @property {number} pageH        height of the document.
	 * @property {number} scrollX      scrollLeft position of the document.
	 * @property {number} scrollY      scrollTop position of the document.
	 * @property {number} windowX      mouse position on X-axis (the origin is top left of the window viewport)
	 * @property {number} windowY      mouse position on Y-axis (the origin is topleft of the window viewport)
	 * @property {number} pageX        mouse position on X-axis (the origin is topleft of the document)
	 * @property {number} pageY        mouse position on Y-axis (the origin is topleft of the document)
	 * @property {number} zoom         window zoom ratio (in WinIE7).
	 * @property {number} scrollBar    browser's scrollbar width.
	 * @proprety {number} density      pixel density of the screen (devicePixelRatio).
	 * @proprety {number} orientation  screen orientation. (0, 90, -90, 180)
	 */
	this.geom = {};

	/**
	 * misc environment values.
	 * @name Iroha.env
	 * @namespace
	 * @property {boolean} isOnline      true if the browser is online.
	 * @property {boolean} isDOMReady    true if the document is ready for DOM manipulation
	 */
	this.env            = {};
	this.env.isOnline   = navigator.onLine;
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

// dummy object of window.console
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

// windowAnimationFrame workaround for old browsers.
!function(window) {
	window.requestAnimationFrame =
		   window.requestAnimationFrame
		|| window.msRequestAnimationFrame
		|| window.mozRequestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| function(callback) { _.delay(callback, 1000 / 60) };
}(window);







/* =============== custom / shortage methods for built-in objects =============== */

/**
 * The built in array object.
 * @external Array
 * @see {@link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array Array}
 */

/* ----- Array.indexOf() ----- */

if (!Array.prototype.indexOf) {
	/**
	 * returns the first index of an element within the array equal to the specified value, or -1 if none is found.
	 * (implement emulation of the method defined in JavaScript1.6)
	 * @function external:Array#indexOf
	 * @param {Object} aSearchElement    the item to search
	 * @param {number} [aFromIndex]      index number to start searching
	 * @return {number} index number
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
	 * @function external:Array#lastIndexOf
	 * @param {Object} aSearchElement    the item to search
	 * @param {number} [aFromIndex]      index number to start searching
	 * @return {number} index number
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
	 * @function external:Array#forEach
	 * @param {external:Array~cbIterate} aCallback        the function to exec for every element
	 * @param {Object}        [aThisObject]    the object that will be a global object ('this') in aCallback func.
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
	 * @function external:Array#map
	 * @param {external:Array~cbIterate} aCallback        the function to exec for every element
	 * @param {Object}        [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return {Array} array that consisted of returned values.
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
	 * @function external:Array#filter
	 * @param {external:Array~cbTest} aCallback        the function to test all elements
	 * @param {Object}     [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return {Array} array that consisted of only adapted elements.
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
	 * @function external:Array#some
	 * @param {external:Array~cbTest} aCallback        the function to test condition of the elements
	 * @param {Object}     [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return {boolean} did some elements satisfy the condition?
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
	 * @function external:Array#every
	 * @param {external:Array~cbTest} aCallback        the function to test condition of the elements
	 * @param {Object}     [aThisObject]    the object that will be a global object ('this') in aCallback func.
	 * @return {boolean} did all elements satisfy the condition?
	 */
	Array.prototype.every = function(aCallback, aThisObject){
		for (var i = 0, n = this.length; i < n; i++) {
			if(!aCallback.call(aThisObject, this[i], i, this)) return false;
		}
		return true;
	}
}

/* ----- for JSDoc output ----- */
/**
 * higher-order function for {@link Array#forEach}, {@link Array#map}
 * @callback external:Array~cbIterate
 * @param {Object} anElement    current processing element of the Array.
 * @param {number} anIndex      current processing index-num of the Array.
 * @param {Array}  anArray      the Array itself.
 * @return {Object} processing result value (any type) of this function
 */
/**
 * higher-order function for {@link Array#filter}, {@link Array#some}, {@link Array#every}
 * @callback external:Array~cbTest
 * @param {Object} anElement    current processing element of the Array.
 * @param {number} anIndex      current processing index-num of the Array.
 * @param {Array}  anArray      the Array itself.
 * @return {boolean} processing result value (boolean) of this function
 */



/**
 * The built in string object.
 * @external String
 * @see {@link https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String String}
 */

/* ----- String.startsWith() ----- */

if (!String.prototype.startsWith) {
	/**
	 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith startsWith}
	 * @function external:String#startsWith
	 * @param {string} searchString
	 * @param {number} [position=0]
	 * @returns {boolean}
	 */
	String.prototype.startsWith = function (searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}

/* ----- String.endsWith() ----- */

if (!String.prototype.endsWith) {
	/**
	 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith}
	 * @function external:String#endsWith
	 * @param {string} searchString
	 * @param {number} [position=searchString.length]
	 * @returns {boolean}
	 */
	String.prototype.endsWith = function (searchString, position) {
		position = position || this.length;
		position = position - searchString.length;
		var lastIndex = this.lastIndexOf(searchString);
		return lastIndex !== -1 && lastIndex === position;
	};
}

/* ----- String.contains() ----- */

if (!String.prototype.contains) {
	/**
	 * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/contains}
	 * @function external:String#contains
	 * @param {string} searchString
	 * @param {number} [position=0]
	 * @returns {boolean}
	 */
	String.prototype.contains = function (searchString, position) {
		return String.prototype.indexOf.call(this, searchString, position) !== -1;
	};
}

/* ----- String.trim() ----- */

if (!String.prototype.trim) {
	/**
	 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/trim}
	 * @function external:String#trim
	 * @returns {string}
	 */
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}



/* ============================== Iroha classes ============================== */

/* -------------------- Class : Iroha.ViewClass -------------------- */
/**
 * @class DOM要素ノードを取扱う典型的なクラスのためのクラスメソッドを提供
 * @param {Function} [constructor]    対象のコンストラクタ関数
 * @return 汎用クラスプロパティ・メソッド群を与えられたコンストラクタ
 */
Iroha.ViewClass = function(constructor) {
	return $.isFunction(constructor) ? arguments.callee.applyTo(constructor) : constructor;
};

$.extend(Iroha.ViewClass,
/** @lends Iroha.ViewClass */
{
	/**
	 * 新規インスタンスを生成して返す。
	 * @return {Iroha.ViewClass} 新規インスタンス
	 * @constructs
	 */
	create : function() {
		return $.extend(new this, {
			  instances : []
			, key       : _.uniqueId('Iroha.ViewClass.')
		});
	},

	/**
	 * 与えられたコンストラクタ（クラス）に汎用クラスプロパティ・メソッド群を与える。
	 * @param {Function} constructor    対象のコンストラクタ関数
	 * @return {Function} 汎用クラスプロパティ・メソッド群を与えられたコンストラクタ
	 */
	applyTo : function(constructor) {
		$.isFunction(constructor) || (constructor = new Function);
		return $.extend(constructor, this.create());
	}
});

$.extend(Iroha.ViewClass.prototype,
/** @lends Iroha.ViewClass.prototype */
{
	/**
	 * Iroha.ViewClass のものであることを示すフラグ
	 * @type {boolean}
	 * @constant
	 */
	isIrohaViewClass : true,

	/**
	 * 生成したインスタンス群からなる配列
	 * @type {Array}
	 */
	instances : [],

	/**
	 * インスタンスのインデックス番号を格納するためのキー。
	 * @type {string}
	 */
	key : '',

	/**
	 * コンストラクタの prototype が備えているべき「既定のメソッド」。無ければここから補われる。
	 * @type {{string: Function}}
	 * @private
	 */
	defMethods : {
		  init         : function(node)   { this.$node = $(node); return this }
		, dispose      : function()       { this.constructor.disposeInstance(this) }
		, appendTo     : function(target) { this.$node.appendTo    (target.$node || $(target)); return this }
		, prependTo    : function(target) { this.$node.prependTo   (target.$node || $(target)); return this }
		, insertBefore : function(target) { this.$node.insertBefore(target.$node || $(target)); return this }
		, insertAfter  : function(target) { this.$node.insertAfter (target.$node || $(target)); return this }
	},

	/**
	 * クラスから生成されたインスタンスを格納する
	 * @param {Object} instance    生成したインスタンス
	 * @return {Object} 格納したインスタンスそれ自身
	 * @private
	 */
	storeInstance : function(instance) {
		$(instance.$node).data(this.key + '.index', this.instances.push(instance) - 1);
		return instance;
	},

	/**
	 * クラスから作られた既存インスタンスを得る。
	 * @param {number|jQuery|Element|string} [arg]    インデックス番号、またはインスタンス生成時に指定した「基底要素ノード」。
	 *                                                引数無指定時は全ての既存インスタンスからなる配列が返る。
	 * @return {Object} 該当のインスタンス。存在しなければ undefined が返る。引数無指定時は全ての既存インスタンスからなる配列が返る。
	 */
	getInstance : function(arg) {
		if (arguments.length == 0) {
			// オブジェクト参照切断済の配列として返す。 dispose() されて undefined になっているものは除外。
			return $.merge([], this.instances).filter(function(instance) { return Boolean(instance) });
		} if ($.type(arg) == 'number') {
			return this.instances[arg];
		} else if (arg && (arg.nodeType == Node.ELEMENT_NODE || $.type(arg.jquery) == 'string' || $.type(arg) == 'string')) {
			return this.instances[$(arg).data(this.key + '.index')];
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
			instance.$node.removeData(this.key + '.index');
			$.each(instance, function(prop) { delete instance[prop] });
		}
		// インスタンス群の配列を後ろから走査し、生きているインスタンスに突き当たるまで undefined になっているものを消す。
		while (instances.length > 0 && !instances[instances.length - 1]) {
			instances.pop();
		}
	},

	/**
	 * 任意の要素ノードを与えて新しくインスタンスを生成するか、同じ要素ノードから生成された既存のインスタンスを得る。
	 *
	 * 第1引数には要素ノードを与えなければならない。この要素ノードを、インスタンスが主として取扱う「基底要素ノード」と定義する。
	 * 生成されたインスタンスに init(), dispose() 等の既定のメソッドが無ければ、最低限度の機能のそれらが付与される。
	 * 最後に instance.init() が自動的に呼び出される。
	 * instance.init() で最低限必要な処理は、第1引数として与えられる「基底要素ノード」を instance.$node に格納することである。
	 *
	 * @param {jQuery|Element|string} node      インスタンスが主として取扱う「基底要素ノード」。instance.init() の第1引数として渡される。
	 * @param {Arguments}             [args]    instance.init() に渡される2番目以降の引数。
	 * @return {Object} 生成したインスタンス
	 */
	create : function(node, args) {
		if (!$(node).is('*')) {
//			throw new TypeError('Iroha.ViewClass#create: 第1引数は要素ノード、要素ノードを内包した jQuery オブジェクト、要素ノードを見つけられる selector 文字列でなければなりません。');
			console.warn('Iroha.ViewClass#create: 第1引数は要素ノード、要素ノードを内包した jQuery オブジェクト、要素ノードを見つけられる selector 文字列でなければなりません。')
			console.trace && console.trace();
		} else {
			return this.getInstance(node) || this.add.apply(this, arguments);
		}
	},

	/**
	 * 新しいインスタンスを生成し、このクラス（コンストラクタ）のインスタンスリストに追加する。
	 *
	 * create() の第1引数に要素ノードを（まだ）与えることができない場合に、このメソッドを用いることができる。
	 * 生成されたインスタンスに init(), dispose() 等の既定のメソッドが無ければ、最低限度の機能のそれらが付与される。
	 * 最後に instance.init() が自動的に呼び出される。
	 * instance.init() で最低限必要な処理は、第1引数として与えられる「基底要素ノード」を instance.$node に格納することである。
	 *
	 * @param {Arguments} [args]      instance.init() に渡される引数（群）。
	 * @return {Object} 生成したインスタンス
	 */
	add : function(args) {
		// 既定のメソッド群がコンストラクタの prototype になければ、補う。
		$.each(this.defMethods, $.proxy(function(name, func) { this.prototype[name] || (this.prototype[name] = func) }, this));

		var instance = new this;
		instance.init.apply(instance, arguments);
		return this.storeInstance(instance);
	},

	/**
	 * 指定したコンストラクタ（クラス）のプロトタイプを現在のコンテキストのコンストラクタ（クラス）へ継承させる。
	 * @param {Function} constructor    継承元のコンストラクタ（クラス）
	 * @return {Function} コンテキストのコンストラクタ自身
	 */
	extend : function(constructor) {
		$.isFunction(constructor) || (constructor = new Function);
		$.extend(this.prototype, new constructor);

		// コンストラクタ関数に直接取り付けられたプロパティ・メソッドを継承させる。
		// ただし一部プロパティは除外しなければならない。
		// "prototype" を除外リストに含めるのは Android2.x 対策。
		var except = 'isIrohaViewClass,instances,key,defMethods,extend,prototype'.split(',');
		$.each(constructor, $.proxy(function(key, value) {
			value.isIrohaViewClass    ||  // Iroha.ViewClass なコンストラクタなら除外（サブクラス的なもの）
			this[key] === value       ||  // 完全同値なら除外
			except.indexOf(key) != -1 ||  // 除外プロパティを除外
				(this[key] = value);
		}, this));

		return this;
	}
});



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
	 * @type {number}
	 * @private
	 */
	this.value = 0;
};

/**
 * Iroha.Number のインスタンスを作って返す。
 * @return {Iroha.Number} Iroha.Number の新規インスタンス
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
	 * @param {number} [value=0]    処理対象とする数値。
	 * @return {Iroha.Number} このインスタンス自身
	 */
	init : function(value) {
		this.value = Number(value) || 0;
		return this;
	},

	/**
	 * 現在の数値を文字列として取得する。
	 * @return {string} 現在の数値を文字列化したもの
	 */
	toString : function() {
		return String(this.value);
	},

	/**
	 * 現在の数値を取得する
	 * @return {number} 現在の数値
	 */
	get : function() {
		return this.value;
	},

	/**
	 * 簡易フォーマッタ。現在の数値を指定形式の文字列へ整形する。
	 * @param {string} format     整形フォーマット
	 * @return {Iroha.String} 整形された文字列を保持している {@link Iroha.String} インスタンス
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

			loop :
			do {
				var _value  = intValue .pop() || '';
				var _format = intFormat.pop() || '';
				switch (_format) {
					case '0' : ret.push(_value  ? _value : '0');                        break;
					case '#' : ret.push(_value  ? _value : '' );                        break;
					case ''  :                                                          break loop;
					default  : ret.push(_format               ); intValue.push(_value); break;
				}
			} while (intValue.length > 0 || intFormat.length > 0);

			ret = ret.reverse().join('').replace(/^\D+/, '');

			if (decFormat) {
				var scale     = Math.pow(10, decFormat.length);
				var rounded   = Math.round(value * scale) / scale;
				var decValue  = rounded.toString().split('.')[1] || '0';
					decValue  = decValue .split('').reverse().join('');
					decFormat = decFormat.split('').reverse().join('');
					ret       = ret + '.' + Iroha.Number(decValue).format(decFormat).get().split('').reverse().join('');
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
	 * @type {string}
	 * @private
	 */
	this.value = '';

	/**
	 * 処理対象となっている文字列の現在の長さ
	 * @type {number}
	 */
	this.length = 0;
};

$.extend(Iroha.String,
/** @lends Iroha.String */
{
	/**
	 * ランダムな文字列を得る。
	 * @param {number} [num=24]    ランダム文字列の長さ
	 * @param {string} [chars]     ランダム文字列を構成する文字群
	 * @return {Iroha.String} 作成したランダム文字列を保持している Iroha.String インスタンス
	 */
	random : function(num, chars) {
		num   = Math.max(0, num) || 24;
		chars = _.isString(chars) ? chars : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var ret = '';
		while (num--) {
			ret += chars.split('')[Math.floor(Math.random() * chars.length)]
		}
		return new this(ret);
	},

	/**
	 * @deprecated {@link Iroha.String.uuid} に名称変更しました。
	 * @see Iroha.String.uuid
	 */
	guid : function() { return this.uuid() }

	/**
	 * 汎用一意識別子 (UUID; Universally Unique Identifier) を得る。
	 * @return {string}
	 */
	uuid : function() {
		var chars = '0123456789ABCDEF';
		var arr   = [ 8, 4, 4, 4, 12 ].map(function(n) { return this.random(n, chars) }, this);
		return new this(arr.join('-'));
	},

	/**
	 * Iroha.String のインスタンスを作って返す。
	 * @return {Iroha.String} Iroha.String の新規インスタンス
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
	 * @param {number} [value=""]    処理対象とする文字列。
	 * @return {Iroha.String} このインスタンス自身
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
	 * @return {string} 現在の文字列を取得
	 */
	toString : function() {
		return this.value;
	},

	/**
	 * 現在の文字列を取得する。
	 * @return {string} 現在の文字列を取得
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
	 * @param {string|string[]|Object}  arg1     文字列、または文字列の入っている配列、または文字列をプロパティ値とする連想配列。
	 * @param {string}                 [argN]    文字列（2個目以降）
	 * @return {Iroha.String} このインスタンス自身
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
		});
		return this;
	},

	/**
	 * 指定の文字列より前の部分の文字列を得る。
	 * @param {string}  str            検索文字列
	 * @param {boolean} [include]      true の場合、戻値は検索文字列自身を含む。
	 * @param {boolean} [longMatch]    true の場合、最長一致で探す。
	 * @return {Iroha.String} このインスタンス自身
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
	 * @param {string}  str            検索文字列
	 * @param {boolean} [include]      true の場合、戻値は検索文字列自身を含む。
	 * @param {boolean} [longMatch]    true の場合、最長一致で探す。
	 * @return {Iroha.String} このインスタンス自身
	 */
	getAfter : function(str, include, longMatch) {
		if (typeof str != 'string') {
			throw new TypeError('String.Wrapper.getAfter: first argument must be a string.');
		} else if (str) {
			var idx     = (!longMatch) ? this.value.lastIndexOf(str) : this.value.indexOf(str);
			this.value  = (idx == -1) ? '' : (include ? str : '') + this.value.substring(idx + str.length, this.value.length);
			this.length = this.value.length;
		}
		return this;
	},

	/**
	 * 指定文字数で裁ち落とし処理する。
	 * @param {number} [chars=this.length]    トリミング後の目標文字数。
	 * @param {string} [from="start"]         トリミング方式。目標文字数を先頭末尾どちらから数えるかの指定。 "start":末尾側裁ち落とし, "end": 先頭側裁ち落とし, "both": 中間裁ち落とし。
	 * @param {string} [ellipsis="\u2026"]    トリミングで文字が断ち切られる際につける省略記号。デフォルトは "…"。
	 * @return {Iroha.String} このインスタンス自身
	 */
	ellipsis : function(chars, from, ellipsis) {
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
	 * 指定文字数で裁ち落とし処理する。
	 * @param {number} [chars=this.length]    トリミング後の目標文字数。
	 * @param {string} [from="start"]         トリミング方式。目標文字数を先頭末尾どちらから数えるかの指定。 "start":末尾側裁ち落とし, "end": 先頭側裁ち落とし, "both": 中間裁ち落とし。
	 * @param {string} [ellipsis="\u2026"]    トリミングで文字が断ち切られる際につける省略記号。デフォルトは "…"。
	 * @return {Iroha.String} このインスタンス自身
	 * @deprecated Use {@link Iroha.String#ellipsis} or {@link external:String#trim}
	 */
	trim : function(chars, from, ellipsis) {
		return this.ellipsis.apply(this, arguments);
	},

	/**
	 * 現在の文字列が指定文字列から始まっていれば true を返す。
	 * @param {string}  str    検索文字列
	 * @return {boolean} 現在の文字列が指定文字列から始まっていれば true。
	 * @deprecated Use {@link external:String#startsWith}
	 */
	startsWith : function(str) {
		return (this.value.indexOf(str) == 0);
	},

	/**
	 * 現在の文字列が指定文字列で終わっていれば true を返す。
	 * @param {string}  str    検索文字列
	 * @return {boolean} 現在の文字列が指定文字列で終わっていれば true。
	 * @deprecated Use {@link external:String#endsWith}
	 */
	endsWith : function(str) {
		var idx = this.value.lastIndexOf(str);
		return (idx > -1 && idx + str.length == this.value.length);
	},

	/**
	 * 現在の文字列が指定文字列を含んでいれば true を返す。
	 * @param {string}  str    検索文字列
	 * @return {boolean} 現在の文字列が指定文字列を含んでいれば true。
	 * @deprecated Use {@link external:String#contains}
	 */
	contains : function(str) {
		return (this.value.indexOf(str) != -1);
	},

	/**
	 * 現在の文字列が指定文字列と完全に一致するなら true を返す。
	 * @param {string}  str    検索文字列
	 * @return {boolean} 現在の文字列が指定文字列と完全に一致するなら true。
	 */
	isMatch : function(str) {
		return (this.value === str);
	},

	/**
	 * 相対パス(URL)を絶対パス(URL)へ変換する。
	 * @param {string} base    相対パス(URL)の起点となる場所を絶対パス(URL)で示したもの
	 * @return {Iroha.String} このインスタンス自身
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
	 * @param {string} base    相対パス(URL)の起点となる場所を絶対パス(URL)で示したもの
	 * @return {Iroha.String} このインスタンス自身
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
	 * @param {string|RegExp} find       検索文字列、または正規表現
	 * @param {string|Function}        replace    置換文字列
	 * @return {Iroha.String} このインスタンス自身
	 */
	replace : function(find, replace) {
		this.value  = this.value.replace(find, replace);
		this.length = this.value.length;
		return this;
	},

	/**
	 * 文字列を「サニタイズ」する。
	 * @return {Iroha.String} このインスタンス自身
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
			if (pairs.hasOwnProperty(key)) {
				this.replace(new RegExp(key, 'g'), pairs[key]);
			}
		}
		return this;
	},

	/**
	 * 文字列を％エスケープに変換する。"encodeURI" か "encodeURIComponent" を使用している。
	 * @param {boolean} [bool=false]    true の場合, "encodeURIComponent" で変換。それ以外は "encodeURI" で変換。
	 * @return {Iroha.String} このインスタンス自身
	 */
	encodeURI : function(bool) {
		this.value  = bool ? encodeURIComponent(this.value) : encodeURI(this.value);
		this.length = this.value.length;
		return this;
	},

	/**
	 * ％エスケープされた文字列を元に戻す。"decodeURI" か "decodeURIComponent" を使用している。
	 * @param {boolean} [bool=false]    true の場合, "decodeURIComponent" で変換。それ以外は "decodeURI" で変換。
	 * @return {Iroha.String} このインスタンス自身
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
 *    Iroha.StyleSheets().insertRule('body { color: red }');          // set font color to red
 *    Iroha.StyleSheets().each(function() { this.disabled = true });  // diable all style
 */
Iroha.StyleSheets = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * このインスタンスが保持しているスタイルシートオブジェクトの数。
	 * @type {number}
	 */
	this.length = 0;
};

/**
 * Iroha.StyleSheets のインスタンスを作って返す。
 * @return {Iroha.StyleSheets} Iroha.StyleSheets の新規インスタンス
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
	 * @param {number|CSSStyleSheet|CSSStyleSheet[]} [arg]    保持するスタイルシート。インデックス番号で指定、またはスタイルシートオブジェクト(群)を指定。
	 * @return {Iroha.StyleSheets} このインスタンス自身
	 */
	init : function(arg) {
		var sheets = arg;

		if (arguments.length == 0 || $.type(arg) == 'number') {
			    sheets   = document.styleSheets;
			var $cssNode = $('link').filter(function() { return !!this.sheet });
			var evaluted = 'BAJL.StyleSheets.Evaluted';

			$cssNode.each(function() {
				var node  = this;
				var sheet = node.sheet;

				// [少なくとも 2015-03-24 ごろの Safari 最新版 (Mac: 8.0.4, iOS Mobile Safari: 8.0) の場合]
				//   なぜか、代替スタイルシートが document.styleSheets に含まれてこない。
				//   なぜか、代替スタイルシートの ownerNode.disabled 値を無意味に2度真偽値反転すると、含まれるようになる。
				//   ちなみに Safari の場合、代替スタイルシートであろうとなかろうと ownerNode.disabled の初期値は false。
				//   これを true に変更するとまたも document.styleSheets に含まれなくなる。なぜなのか。
				if ($.inArray(sheet, sheets) == -1) {
					sheet[evaluted] = sheet.disabled = node.disabled = true;
					                                   node.disabled = false;
				}

				// [少なくとも 2015-03-24 ごろの Chrome 最新版 (41.0.2272.101) の場合]
				//   初期状態では、代替スタイルシートであろうとなかろうと、スタイルシート自身と ownerNode の disabled 初期値は false。
				//   なお Chrome は、優先／代替スタイルシートの切替に、スタイルシート自身と ownerNode 双方の disabled 値の変更を要する。
				if (!sheet[evaluted] && (!sheet.disabled || !node.disabled) && /\balternate\b/i.test(node.rel)) {
					sheet[evaluted] = sheet.disabled = node.disabled = true;
				}

				// 2度目以降、上記 Chrome 用の代替スタイルシートの整合チェックをさせない。
				// 代替スタイルシートへのオンザフライのスタイル切替ができなくなるから。
				sheet[evaluted] = true;
			});

			// 指定インデックス番号の物のみに絞る
			($.type(arg) == 'number') && (sheets = sheets[arg]);
		}

		return this.add(sheets);
	},

	/**
	 * このインスタンスが保持しているスタイルシートのコレクションに新たにスタイルシートを追加する。
	 * @param {CSSStyleSheet|CSSStyleSheet[]} [sheets]    追加するスタイルシートオブジェクト(群)
	 * @return {Iroha.StyleSheets} このインスタンス自身
	 */
	add : function(sheets) {
		$.makeArray(sheets).forEach(function(sheet) {
			// 追加するのは "text/css" のものに限定する。（へんなのが来ても困る）
			// しかし HTML5 で <link> や <style> の type 属性を省略しているとき、 IE8 以前では本当に type が未定義になってる。うざい。
			if (!sheet.type || sheet.type == 'text/css') {
				this[this.length++] = sheet;
			}
		}, this);

		return this;
	},

	/**
	 * 現在保持しているスタイルシート群のうち指定番号に該当する物を取り出し、それを保持した新規インスタンスを得る
	 * @param {number} [index]    インデックス番号
	 * @return {Iroha.StyleSheets} 該当スタイルシートオブジェクトを保持した新規インスタンス
	 */
	eq : function(index) {
		var sheet = (typeof index == 'number') ? this[index] : null;
		return new this.constructor(sheet);
	},

	/**
	 * 現在保持しているスタイルシート群のうち1番目のものを取り出し、それを保持した新規インスタンスを得る
	 * @return {Iroha.StyleSheets} new instance that has a styleSheet
	 */
	first : function() {
		return new this.constructor(this[0]);
	},

	/**
	 * 現在保持しているスタイルシート群のうち最後のものを取り出し、それを保持した新規インスタンスを得る
	 * @return {Iroha.StyleSheets} new instance that has a styleSheet
	 */
	last : function() {
		return new this.constructor(this[this.length - 1]);
	},

	/**
	 * 現在保持しているスタイルシート群のうち指定番号のもの、あるいはすべてを取り出す。
	 * @param {number} [index]    番号指定。
	 * @return {CSSStyleSheet|CSSStyleSheet[]} 単体のスタイルシートオブジェクト (DOM StyleSheet) 、または保持しているスタイルシートオブジェクトすべてからなる配列。
	 */
	get : function(index) {
		return (typeof index == 'number') ? this[index] : Array.prototype.slice.call(this);
	},

	/**
	 * 現在保持しているスタイルシート群の "ownerNode" を得る。
	 * @param {number} [index]    番号指定。
	 * @return {Element|Element[]} 番号指定時はコレクション中の特定スタイルシートのもの、無指定時はコレクションすべての分を収めた配列。
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
	 * @return {number} number of styleSheets owned by this instance.
	 */
	size : function() {
		return this.length;
	},

	/**
	 * 現在保持しているスタイルシート群それぞれに対して処理を実施（イテレーション）。jQuery(selector).each(aCallback) に相似。
	 * @param {Iroha.StyleSheets~cbEach} aCallback    実施する処理（コールバック関数）。この関数が false を返したらそこでイテレーションを止める。
	 * @return {Iroha.StyleSheets} このインスタンス自身
	 */
	each : function(aCallback) {
		$.each(this.get(), aCallback);
		return this;
	},

	/**
	 * 現在保持しているスタイルシート群の絞り込み処理を実施。jQuery(selector).filterh(aCallback) に相似。
	 * @param {Iroha.StyleSheets~cbFilter} aCallback    絞り込み処理（コールバック関数）。この関数が true を返したスタイルシートが残る。
	 * @return {Iroha.StyleSheets} 絞り込まれたスタイルシート群のみを保持する新規インスタンス
	 */
	filter : function(aCallback) {
		return new this.constructor(this.get().filter(function(s, i) { return aCallback.call(s, i, s) }));
	},

	/**
	 * スタイルルールを追加する。現在保持しているスタイルシート群のうち1番目のものに追加される。
	 * @param {string} cssText    追加するスタイルルールのテキスト。
	 * @return {Iroha.StyleSheets} このインスタンス自身
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
	 * @return {CSSRuleList} スタイルルールオブジェクト群
	 */
	getRules : function() {
		var sheet = this.get(0);
		return !sheet ? undefined : sheet.cssRules || sheet.rules;
	},

	/**
	 * 現在保持しているスタイルシート群のうち最初の物の中の、指定インデックス番号にあるスタイルルールを削除する。
	 * @param {number} index    削除対象のスタイルルールインデックス番号。非負整数。
	 * @return {Iroha.StyleSheets} このインスタンス自身
	 */
	deleteRule : function(index) {
		var sheet = this.get(0);
		if (sheet) {
			     if (sheet.deleteRule) sheet.deleteRule(index);  // Std. DOM
			else if (sheet.removeRule) sheet.removeRule(index);  // IE
		}
		return this;
	},

	/** @deprecated use #deleteRule */
	removeRule : function() { return this.deleteRule.apply(this, arguments) }
});

/* ----- for JSDoc output ----- */
/**
 * {@link Iroha.StyleSheets#each} に与えるコールバック関数。
 * @callback Iroha.StyleSheets~cbEach
 * @param {number}      anIndex      ループカウンタ。0 始まり正整数。
 * @param {CSSStyleSheet}  anSheet      スタイルシートオブジェクト
 * @return {boolean} false を返した場合、イテレーション（ループ）がそこで停止される。
 */
/**
 * {@link Iroha.StyleSheets#filter} に与えるコールバック関数。
 * @callback Iroha.StyleSheets~cbFilter
 * @param {number}      anIndex      ループカウンタ。0 始まり正整数。
 * @param {CSSStyleSheet}  anSheet      スタイルシートオブジェクト
 * @return {boolean} true を返したスタイルシートオブジェクトだけが残される。
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
	 * @type {Object}
	 * @private
	 */
	this.callbackChains = null;

	/**
	 * callback ignoring level - pairs of callback name and level string; 'all', 'preserved', 'disposable', 'none'.
	 * @type {Object}
	 * @private
	 */
	this.callbackIgnoreLevel = null;
};

/**
 * Iroha.Observable のインスタンスを作って返す。
 * @return {Iroha.Observable} Iroha.Observable の新規インスタンス
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
	 * @return {Iroha.Observable} このインスタンス自身
	 */
	init : function() {
		return this;
	},

	/**
	 * process callback functions.
	 * @param {string} name      callback name
	 * @param {Object} [args]    arguments for callback function
	 * @return {Object} result value of last one of the callback functions chain.
	 */
	doCallback : function(name, /* arg1, arg2, ... */ args) {
		var chains = this.callbackChains      || {};  // 内容を参照するだけだし、インスタンスに紐づかない空オブジェクトでもOK
		var ignore = this.callbackIgnoreLevel || {};  // 同上

		if (!chains[name]) {
			return undefined;

		} else {
			var ret;
			args  = Array.prototype.slice.call(arguments, 1);
			var chain = chains[name].slice();  // 参照切断して複製

			// "disposable" な callback はこの時点で掃除しておく。
			this.removeDisposableCallback(name);

			chain
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

			return ret;
		}
	},

	/**
	 * add callback function.
	 * @param {string}   name             callback name
	 * @param {Function} func             callback function/method
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
	 * @param {string}   [disposable]     if 'disposable' specified, the callback function is treated as 'disposable'.
	 * @return {Iroha.Observable} this instance
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
	 * @param {string}   name             callback name
	 * @param {Function} [func]           callback function/method to remove, if no funcs given, all callback funcs will be removed.
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
	 * @return {Iroha.Observable} this instance
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
	 * @param {string} name    callback name
	 * @return {Iroha.Observable} this instance
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
	 * @param {string} name             callback name
	 * @param {string} [level="all"]    ignoring level - 'all', 'preserved', 'disposable', 'none'
	 * @return {Iroha.Observable} this instance
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
 * @class Iterator
 */
Iroha.Iterator = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * iterated elements; an associative array, an array, or an object like those.
	 * @type {Object}
	 * @private
	 */
	this.targets = undefined;

	/**
	 * an array of keys in iterated elements.
	 * @type {string[]}
	 * @private
	 */
	this.keys = [];

	/**
	 * a number of current position of the iterator.
	 * @type {number}
	 * @private
	 */
	this.counter = 0;

	/**
	 * element getting mode; "key", "value", or "both".
	 * @type {string}
	 * @private
	 */
	this.mode = 'value';

	/**
	 * flag to abort automatic iterating
	 * @type {boolean}
	 * @private
	 */
	this.aborted = false;
};

/**
 * Iroha.Iterator のインスタンスを作って返す。
 * @return {Iroha.Iterator} Iroha.Iterator の新規インスタンス
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
	 * @return {Iroha.Iterator} this instance
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
	 * @return {boolean} true if the iterator has next element.
	 */
	hasNext : function() {
		return (this.counter < this.keys.length);
	},

	/**
	 * get next element in the iteration; the form of an acquired element depends on "element getting mode"
	 * @return {Object} next element in the iteration
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

	/**
	 * start automatic iterating.
	 * @param {Function} func             callback function
	 * @param {number}   [ms=0]           milliseconds to interval
	 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
	 * @param {Deferred} [_dfd]           (internal use)
	 * @return {jQuery.Deferred.Promise} jQuery.Deferred.Promise
	 */
	iterate : function(func, ms, aThisObject, _dfd) {
		if (typeof func != 'function') {
			throw new TypeError('Iroha.Iterator#iterate: first argument must be a function object.');

		} else {
			var dfd  = _dfd || $.Deferred();
			var flag = !this.aborted && this.hasNext()
				? func.apply(aThisObject, $.makeArray(this.next()))
				: false;

			if (flag === false) {
				dfd.resolve(this.aborted ? 'aborted' : 'complete');

			} else {
				ms > 0
					? Iroha.delay(ms, this).done(function() { this.iterate(func, ms, aThisObject, dfd) })
					: this.iterate(func, ms, aThisObject, dfd);
			}
		}
		return dfd.promise();
	},

	/**
	 * abort automatic iterating
	 * @return {Iroha.Iterator} this instance
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
	 * @type {number}
	 * @private
	 */
	this.id = 0;

	/**
	 * native timer function name.
	 * @type {string}
	 * @private
	 * @constant
	 */
	this.timerFunc = 'setTimeout';
};

/**
 * Iroha.Timeout のインスタンスを作って返す。
 * @return {Iroha.Timeout} Iroha.Timeout の新規インスタンス
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
	 * @param {number}   [ms=0]           milliseconds to timeout
	 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
	 * @param {boolean}  [immediate]      if true, do immediate callback at start
	 * @return {Iroha.Timeout} this instance
	 */
	init : function(func, ms, aThisObject, immediate) {
		func  = $.proxy($.isFunction(func) ? func : new Function, aThisObject);
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
	 * @return {Iroha.Timeout} this instance
	 */
	clear : function() {
		clearTimeout (this.id);
		clearInterval(this.id);
		return this;
	},

	/**
	 * @deprecated use {@link #clear} method instead of this method.
	 * @return {Iroha.Timeout} this instance
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
	 * @type {number}
	 * @private
	 */
	this.id = 0;

	/**
	 * native timer function name.
	 * @type {string}
	 * @private
	 * @constant
	 */
	this.timerFunc = 'setInterval';
};

/**
 * Iroha.Interval のインスタンスを作って返す。
 * @return {Iroha.Interval} Iroha.Interval の新規インスタンス
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
 * @return {Iroha.Timer} Iroha.Timer の新規インスタンス
 */
Iroha.Timer.create = function() {
	return new this;
};

$.extend(Iroha.Timer.prototype,
/** @lends Iroha.Timer.prototype */
{
	/**
	 * started time of this timer.
	 * @type {Date}
	 * @private
	 */
	started : undefined,

	/**
	 * initialize
	 * @return {Iroha.Timer} this instance
	 */
	init : function() {
		return this.reset();
	},

	/**
	 * reset timer.
	 * @return {Iroha.Timer} this instance
	 */
	reset : function() {
		this.started = new Date;
		return this;
	},

	/**
	 * get acquire time progress in milisecond.
	 * @return {number} acquire time progress in milisecond.
	 */
	getTime : function() {
		return (new Date) - this.started;
	},

	/**
	 * get acquire time progress in second.
	 * @return {number} acquire time progress in second.
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
	 * @type {string}
	 */
	this.tagName = '';

	/**
	 * associative array of attributes { name1 : value1, name2 : value2 ... }
	 * @type {Object}
	 */
	this.attributes = {};

	/**
	 * array of {@link Iroha.Tag} instances
	 * @type {Iroha.Tag[]|string[]}
	 */
	this.childNodes = [];
};

/**
 * Iroha.Tag のインスタンスを作って返す。
 * @return {Iroha.Tag} Iroha.Tag の新規インスタンス
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
	 * @param {string} tagName    element name to create
	 * @param {Object} [attrs]    associative array of attributes { name1 : value1, name2 : value2 ... }
	 * @return {Iroha.Tag} このインスタンス自身
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
	 * @param {string} name       対象とする属性の名前
	 * @param {string} [value]    その属性に値を設定する場合は、その値。（無指定時は属性値の読み出しとなる）
	 * @return {string} 指定された属性の現在の値、または今セットした値そのもの、
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
	 * @param {Iroha.Tag|string} arg 　　instance to append
	 * @return {Iroha.Tag} このインスタンス自身
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
	 * @param {boolean} [debug=false]    debug mode - escaped output
	 * @return {string} HTML tag string
	 */
	toString : function(debug) {
		var tag        = '<' + this.tagName;
		var content    = (this.childNodes.length) ? '' : null;
		var instanceFlag;
		for (var i = 0, n = this.childNodes.length; i < n; i++) {
			instanceFlag = this.childNodes[i] instanceof this.constructor;
			content += instanceFlag ? this.childNodes[i].toString() : Iroha.String(this.childNodes[i]).sanitize().get();
		}
		for (var attr in this.attributes) {
			if (this.attributes.hasOwnProperty(attr)) {
				tag += ' ' + attr + '="' + Iroha.String(this.attributes[attr]).sanitize().get() + '"';
			}
		}
		tag += (content != null) ?
			'>' + content + '</' + this.tagName + '>' :
			' />';
		return debug ? Iroha.String(tag).sanitize().get() : tag;
	}
});



/* ============================== Iroha static functions ============================== */

/* --------------- Function : Iroha.setValue --------------- */
/**
 * set value to deep object directly.
 * @function Iroha.setValue
 * @param {string} expr            object expression string to set value
 * @param {Object} [value]         value to set
 * @param {Object} [obj=window]    base object of expr
 * @return {Object} value that set
 */
Iroha.setValue = function(expr, value, obj) {
	if (typeof expr != 'string' || !expr) {
		throw new TypeError('Iroha.setValue: first argument type must be string (expr).');
	} else if (obj !== null) {
		var props = expr.split('.');
		    obj   = (obj === undefined) ? window : obj
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
 * @function Iroha.getValue
 * @param {string} expr            object expression string to get value
 * @param {Object} [obj=window]    base object of expr
 * @return {Object} any type of value
 */
Iroha.getValue = function(expr, obj) {
	if (typeof expr != 'string' || !expr) {
		throw new TypeError('Iroha.getValue: first argument type must be string (expr).');
	} else {
		expr = ('this.' + expr).replace(/\b\.?(\d+)\b/g, '[$1]').replace(/\[\[/g, '[').replace(/\]\]/g, ']');
		obj  = $.type(obj) != 'object' ? window : obj;
		var get  = new Function('try { return ' + expr + ' }catch(e){}');
		return get.call(obj);
	}
};



/* --------------- Function : Iroha.singleton --------------- */
/**
 * create object as single instance. or put existing instance.
 * @function Iroha.singleton
 * @param {Function} _constructor    constructor
 * @param {...*}     [args]    arguments for constructor
 * @return {Object} single instance.
 */
Iroha.singleton = function(_constructor, args) {
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
 * @function Iroha.throttle
 * @param {Function} func             対象となる関数。
 * @param {number}   wait             制限時間。単位 ms 。
 * @param {Object}   [aThisObject]    関数内で "this" が指し示すことになるもの
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
 * @function Iroha.debounce
 * @param  {Function} func          対象となる関数。
 * @param {number} delay            最後に呼んでから実行までの時間。単位 ms。
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
 * @function Iroha.barrageShield
 * @param {Function} func             a function which has possibility to be barraged function-calls
 * @param {number}   [delay=1]        delay time to ignore barraged function-calls
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the function
 * @return {Function} wrapper function.
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
 * @function Iroha.alreadyApplied
 * @param {Function} func    typically 'arguments.callee'
 * @return {boolean} boolean
 */
Iroha.alreadyApplied = function(func) {
	if (typeof func != 'function') {
		throw new TypeError('Iroha.alreadyApplied: first argument must be a function object.');
	} else {
		var stored = '__Iroha_alreadyAapplied__';
		return func[stored] || !(func[stored] = true);
	}
};



/* --------------- Function : Iroha.contextBound --------------- */
/**
 * コンテキストが固定された関数をつくって返す。
 * 第2引数に与えたオブジェクトに固定された関数インスタンスは単一であることが保証されている。
 * @function Iroha.contextBound
 * @param {Function} func  コンテキストを固定したい関数
 * @return {Object} obj    固定したいコンテキスト
 */
Iroha.contextBound = function(func, obj) {
	if (typeof func != 'function') {
		throw new TypeError('Iroha.contextBound: first argument must be a function object.');
	} if (typeof obj != 'object') {
		throw new TypeError('Iroha.contextBound: second argument must be an object.');
	}
	var map, matched, bound;
	map = func.__Iroha_contextBound_contexts__ || (func.__Iroha_contextBound_contexts__ = []);
	map.forEach(function (val) {
		if (val.context === obj) matched = val;
	});
	if (matched) {
		return matched.bound;
	}
	bound = $.proxy(func, obj);
	map.push({
		context: obj,
		bound: bound
	});
	return bound;
};



/* --------------- Function : Iroha.preloadImage --------------- */
/**
 * create Image object (load image).
 * @function Iroha.preloadImage
 * @param {string} src     image url to load
 * @return {HTMLImageElement} image object
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
 * @function Iroha.getLinkTarget
 * @see external:jQuery.fn.Iroha_getLinkTarget
 * @param {Element|jQuery|string}  anchor             anchor element (a, area).
 * @param {string}                [target="_self"]    target name to assume that given anchor is inner-page link.
 * @return {jQuery} jQuery indicating an element which is linked from given anchor element.
 */
Iroha.getLinkTarget = function(anchor, target) {
	anchor = $(anchor).filter('a, area').get(0);
	target = target ? String(target) : '_self';
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
 * @function Iroha.urlToAnchor
 * @param {jQuery|Element|string} node      処理対象（起点）の要素ノード
 * @param {string}                [tmpl]    URL をリンクにするとき雛形とする a 要素の HTML 文字列
 * @return {jQuery} 与えた要素ノード（を内包した jQuery オブジェクト）
 */
Iroha.urlToAnchor = function(node, tmpl) {
	var range = document.createRange();
	tmpl  = tmpl || '<a href="${0}">${0}</a>';
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
								while (next && next.nodeType != 3) { next = next.nextSibling }
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
 * @function Iroha.getQuery
 * @param {string} [serialized]    "serialized" の場合、{ name, value } の連想配列を、クエリ文字列の並び順に収めたシリアライズド配列を得る。
 * @return {Object|Object[]} クエリ文字列を連想配列化したオブジェクト、または { name, value } の連想配列をクエリ文字列の並び順に収めたシリアライズド配列。
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
 * @function Iroha.getGeometry
 * @param {Event} e       event object - this param exists when this function is called as an event handler.
 * @param {Window} win    window object - specify this param to alter window object.
 * @return {Iroha.geom} an associative array of geometry properties
 * @todo Iroha.getGeometry にいくつかメソッドがぶら下がっているがドキュメント化できないため構造を検討
 */
Iroha.getGeometry = function(e, win) {
	var win  = win || window;
	var html = win.document.documentElement;
	var body = win.document.body;
	var geom = Iroha.geom;
	var func = arguments.callee;

	var isAndrStd   = Iroha.ua.isAndroidBrowser;
	var isAndrCrm   = Iroha.ua.isAndroid && Iroha.ua.isChrome;
	var orientation = win.orientation;

	geom.density     = win.devicePixelRatio || 1;
	geom.orientation = orientation;
	geom.portrait    = orientation ==  0 ? 1 : orientation == 180 ? -1 : 0;  // 上: 1, 下: -1, 他 0
	geom.landscape   = orientation == 90 ? 1 : orientation == -90 ? -1 : 0;  // 右: 1, 左: -1, 他 0
	geom.screenW     = Math.floor((isAndrCrm && geom.landscape ? screen.height : screen.width ) / (isAndrStd ? geom.density : 1));
	geom.screenH     = Math.floor((isAndrCrm && geom.landscape ? screen.width  : screen.height) / (isAndrStd ? geom.density : 1));
	geom.windowW     = win.innerWidth  || html.offsetWidth ;
	geom.windowH     = win.innerHeight || html.offsetHeight;
	geom.pageW       = html.scrollWidth ;
	geom.pageH       = html.scrollHeight;
	geom.scrollX     = win.scrollX || html.scrollLeft || body.scrollLeft || 0;
	geom.scrollY     = win.scrollY || html.scrollTop  || body.scrollTop  || 0;
	geom.windowX     = !e ? (geom.windowX || 0) : e.clientX;
	geom.windowY     = !e ? (geom.windowY || 0) : e.clientY;
	geom.pageX       = !e ? (geom.pageX   || 0) : e.clientX + geom.scrollX;
	geom.pageY       = !e ? (geom.pageX   || 0) : e.clientY + geom.scrollY;
	geom.zoom        = func.getZoomRatio();
	geom.scrollBar   = func.getScrollBarWidth();

	return geom;
};

/**
 * get window zoom ratio for IE7+
 * @return {number} window zoom ratio on IE7+ / always 1 on other browsers.
 * @private
 */
Iroha.getGeometry.getZoomRatio = function() {
	var html = document.documentElement;
	var body = document.body;
	var func = arguments.callee;
	func._cache_ = func._cache_ || 1;
	if (Iroha.ua.isIE && Iroha.ua.version >= 7.0) {
		if (func._lock_) {
			func._lock_.clear();
			func._lock_ = new Iroha.Timeout(function() { func._lock_ = null }, 500);
		} else {
			func._lock_ = new Iroha.Timeout(function() { func._lock_ = null }, 500);
			if (Iroha.ua.isQuirksMode) {
				func._cache_ = html.offsetWidth / body.offsetWidth;
			} else {
				var id  = 'Iroha_getGeometry_getZoomRatio_TestNode';
				var css = {
					  'position'   : 'absolute'
					, 'left'       : '0px'
					, 'top'        : '0px'
					, 'width'      : (html.scrollWidth * 10) + 'px'
					, 'height'     : '10px'
					, 'background' : 'red'
				};
				var node = $('#' + id).get(0) || $(document.createElement('ins')).attr('id', id).css(css).appendTo(document.body).get(0);
				$(node).show();
				func._cache_ = html.scrollWidth / node.offsetWidth;
				$(node).hide();
			}
		}
	}
	return func._cache_;
};

/**
 * get scrollbar width
 * @return {number} scrollbar width in px unit
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
 * @function Iroha.getCommonDir
 * @param {string} dirName     name of common directory
 * @return {string} absolute URL of common directory.
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
 * @function Iroha.watchFor
 * @param {string} expr              string-expression of watching target object.
 * @param {number} [timeout=3000]    time to giving up (ms, positive number)
 * @param {Object} [base=window]     base object of expr
 * @param {number} [interval=96]     watching interval (ms, positive number)
 * @return {jQuery.Deferred.Promise} a Deferred's Promise object.
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
		observe.clear();
		deferred.reject();
	};
	var observe = new Iroha.Interval(observer , Math.max(0, interval) ||   96);
	var giveup  = new Iroha.Timeout (terminate, Math.max(0, timeout ) || 3000);
	observer();

	return deferred.promise();
};



/* --------------- Function : Iroha.openWindow --------------- */
/**
 * open new window.
 * @function Iroha.openWindow
 * @param {string}        url               url to open in new window
 * @param {string}        [target="_blank"] window target name
 * @param {Object|string} [option]          window options (in string form, or an associative array)
 * @return {Window} new window object
 * @todo Iroha.openWindow にいくつかメソッドがぶら下がっているがドキュメント化できないため構造を検討
 */
Iroha.openWindow = function(url, target, option) {
	var _this  = arguments.callee;
	    target = target || '_blank';
	    option = $.type(option) == 'string' ? _this.parse(option) : option;
	    option = $.extend(null, _this.DEF_OPTIONS, option);

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
		, 'moveToOrigin' : true  // additional option affects in Iroha.openWindow() only, @type {boolean}
		, 'autoResizeTo' : ''    // additional option affects in Iroha.openWindow() only, @type {string|boolean}
	},

	/**
	 * 連想配列からオプション指定用の文字列を作り出す。またはオプション指定用文字列を連想配列に変換したものを得る。
	 * @param {string|Object} option    オプション指定用文字列、またはオプション指定の連想配列表現
	 * @return {Object|string} 引数が String のときは連想配列、引数が Object のときは文字列。
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
	 * @param {string}        url               url to open in new window
	 * @param {string}        [target="_blank"] window target name
	 * @param {Object|string} [option]          window options (in string form, or an associative array)
	 * @return {Window} new window object
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
	 * @param {number|string} [arg1]    横幅を数値で指定。または、リサイズの基準にする要素ノードのセレクタ。
	 * @param {number}        [arg2]    縦幅を数値で指定。
	 * @return {Window} 与えたウインドウオブジェクト自身
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
						var diffW = 0;
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
 * ブラウザ別の className を &lt;body&gt; 要素に付加する。
 * @function Iroha.addUserAgentCName
 * @return {Iroha} Iroha オブジェクト
 */
Iroha.addUserAgentCName = function() {
	var cnames  = [];
	var prefix  = 'iroha-ua-';
	var ua      = _.clone(this.ua);
	var mbVers  = String(ua.mbVersion).replace(/\./g, '_');
	    mbVers += /_/.test(mbVers) ? '' : '_0';

	delete ua.isWebkit;
	delete ua.isDOMReady;

	$.each(ua, function(key, bool) { bool === true && cnames.push(prefix + key) });
	ua.isIE      && cnames.push(prefix + 'isIE'      + ua.version);
	ua.isiOS     && cnames.push(prefix + 'isiOS'     + mbVers);
	ua.isAndroid && cnames.push(prefix + 'isAndroid' + mbVers);

	$(document.body).addClass(cnames.sort().join(' '));
	return this;
};



/* --------------- Function : Iroha.removeComments --------------- */
/**
 * コメントノードを削除 (for IE7 only)
 * @function Iroha.removeComments
 * @param {jQuery|Element|string} [base=document.body]    処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return {Iroha} Iroha オブジェクト
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
 * @function Iroha.setTitleFromAlt
 * @param {jQuery|Element|string} [target="img, :image, area"]    処理対象とする（img 要素などの）要素ノード。
 * @param {jQuery|Element|string} [base=document.body]            処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return {Iroha} Iroha オブジェクト
 */
Iroha.setTitleFromAlt = function(target, base) {
	if (!Iroha.ua.isIE || Iroha.ua.documentMode >= 8) {
		target || (target = 'img, :image, area');
		base   || (base   = document.body      );

		var dataKey = 'Iroha.setTitleFromAlt.origTitle';

		$(base)
			.on('mouseenter', target, function() {
				var title = this.getAttribute('title');
				if (title == null && this.alt) {
					this.title = this.alt;
				}
				$(this).data(dataKey, title);
			})
			.on('mouseleave', target, function() {
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
 * @function Iroha.setTitleFromInnerText
 * @param {jQuery|Element|string} [target]                処理対象とする要素ノード。
 * @param {jQuery|Element|string} [base=document.body]    処理の対象範囲とする（DOMツリー的に最上位の）要素ノード。
 * @return {Iroha} Iroha オブジェクト
 */
Iroha.setTitleFromInnerText = function(target, base) {
	var dataKey = 'Nisoc.setTitleFromInnerText.origTitle';

	$(base || document.body)
		.on('mouseenter', target, function() {
			var title = this.getAttribute('title');
			if (title == null) {
				this.title = $(this).Iroha_getInnerText().replace(/\s+/g, ' ');
			}
			$(this).data(dataKey, title);
		})
		.on('mouseleave', target, function() {
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
 * @function Iroha.trapWheelEvent
 * @param {jQuery|Element|string}  node    対象要素ノード。単にセレクタ文字列を与えるのを推奨、その瞬間存在しない要素ノードでも有効に機能させることができるため。
 * @return {Iroha} Iroha オブジェクト
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
 * @function Iroha.untrapWheelEvent
 * @param {jQuery|Element|string}  node    対象要素ノード。 {@link Iroha.trapWheelEvent} で指定したものと同形式のもの。例えば、セレクタ文字列で指定していたならセレクタ文字列。
 * @return {Iroha} Iroha オブジェクト
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
 * @function Iroha.fireShigekix
 * @param {jQuery|Element|string} target    シゲキックスを与える要素ノード
 * @return {Iroha} Iroha オブジェクト
 */
Iroha.fireShigekix = function(target) {
	$(target).css('border', '1px solid red').css('border', 'none');
	return this;
};



/* --------------- Function : Iroha.delay --------------- */
/**
 * 指定時間のディレイをかける（ Deferred 。指定時間が経過すると resolve される Promise を返す）。
 * @function Iroha.delay
 * @param {number} delay            ディレイする時間。非負整数。単位 ms 。
 * @param {Object} [aThisObject]    deferred.done() などの関数内で "this" が指し示すことになるもの
 * @return {jQuery.Deferred.Promise} jQuery.Deferred.Promise オブジェクト
 */
Iroha.delay = function(delay, aThisObject) {
	var dfd     = $.Deferred();
	var resolve = function() { aThisObject ? dfd.resolveWith(aThisObject) : dfd.resolve() };
	delay > 0
		? setTimeout(resolve, delay)
		: resolve();
	return dfd.promise();
};



/* --------------- Function : Iroha.template --------------- */
/**
 * Underscore.js の _.template() の Wrapper。テンプレ文字列で Mustache スタイル {{ hoge }} を使う形。
 * @param {string} templateString    Mustache スタイル {{ hoge }} を含むテンプレ文字列
 * @param {Object} settings          _.template の第2引数と同じもの。
 * @return {Function} _.template() の返値と同様。関数オブジェクト。
 */
Iroha.template = function(templateString, settings) {
	settings = _.extend({ interpolate : /\{\{(.+?)\}\}/g }, settings);
	return _.template(templateString, settings);
};



/* --------------- Function : Iroha.injectWeinre --------------- */
/**
 * Weinre をつかってインスペクトを始める（そのための外部 JS を非同期で注入する）。
 * Weinre : {@link http://people.apache.org/~pmuellr/weinre/docs/latest/}
 * @function Iroha.injectWeinre
 * @param {string} [ident="anonymous"]             アプリケーション識別子。任意に設定。
 * @param {string} [base="//{samedomain}:8080"]    Weinre が稼働している場所。無指定時は表示中の HTML と同じプロトコル・ドメインのポート 8080 番。
 * @return {Iroha} Iroha オブジェクト
 * @todo Iroha.injectWeinre にいくつかメソッドがぶら下がっているがドキュメント化できないため構造を検討
 */
Iroha.injectWeinre = function(ident, base) {
	var args  = arguments;
	var self  = args.callee;
	var param = {
		  base  : base  || Iroha.template('//{{lh}}:8080')({ lh : location.hostname })
		, ident : ident || 'anonymous'
	};
	var src = Iroha.template('{{base}}/target/target-script-min.js#{{ident}}')(param);
	var id  = self.SCRIPT_ID_PREFIX + param.ident;

	if (!document.getElementById(id)) {
		!Iroha.env.isDOMReady
			? document.write(Iroha.template('<script src="{{src}}" id="{{id}}"></scr' + 'ipt>')({ src : src, id : id }))
			: (function(node) {
				node.setAttribute('src', src);
				node.setAttribute('id' , id );
				document.body.appendChild(node);
			})(document.createElement('script'));
	}

	return self.getInfo(param.ident);
};

$.extend(Iroha.injectWeinre,
/** @lends Iroha.injectWeinre */
{
	/**
	 * script 要素につける id 属性値の接頭辞
	 * @type {string}
	 * @constant
	 */
	SCRIPT_ID_PREFIX : 'iroha-inject-weinre-',

	/**
	 * 注入した Weinre についての各種 URL 等の情報を得る
	 * @param {string} [ident="anonymous"]    アプリケーション識別子。任意に設定。
	 * @return { injected:string, toppage:string, client:string, docs:string }
	 */
	getInfo : function(ident) {
		ident = ident || 'anonymous';
		var node  = document.getElementById(this.SCRIPT_ID_PREFIX + ident);
		if (!node) {
			return {
				  injected : ''
				, toppage  : ''
				, client   : ''
				, docs     : ''
			};
		} else {
			var src  = node.src;
			var base = /^.+?:\/+[^\/]+\//.test(src) ? RegExp.lastMatch : undefined;
			return {
				  injected : src
				, toppage  : base
				, client   : base + 'client/#' + ident
				, docs     : base + 'doc/'
			};
		}
	}
});



/* ============================== Libs modification ============================== */

/* -------------------- jQuery.fn : Iroha_getComputedStyle -------------------- */
/**
 * get computed style value.
 * @function external:jQuery#Iroha_getComputedStyle
 * @param {string}  prop          style property name to get value
 * @param {string} [pseudo=""]    pseudo element/class name (effective in standard browsers only)
 * @return {string} computed style value string
 */
$.fn.Iroha_getComputedStyle = function(prop, pseudo) {
	prop   = String(prop || '');
	pseudo = String(pseudo   || '');
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
 * @function external:jQuery#Iroha_getLinkTarget
 * @see Iroha.getLinkTarget
 * @param {string} [target="_self"]    target name to assume that given anchor is inner-page link.
 * @return {jQuery} jQuery indicating an element which is linked from given anchor element.
 */
$.fn.Iroha_getLinkTarget = function(target) {
	return Iroha.getLinkTarget(this, target);
};



/* -------------------- jQuery.fn : Iroha_urlToAnchor -------------------- */
/**
 * 内包しているすべてのテキスト中の URL らしき文字列をリンクにする。
 * @function external:jQuery#Iroha_urlToAnchor
 * @see Iroha.urlToAnchor
 * @param {string} [tmpl]    URL をリンクにするとき雛形とする a 要素の HTML 文字列
 * @return {jQuery} jQuery current context object
 */
$.fn.Iroha_urlToAnchor = function(tmpl) {
	return Iroha.urlToAnchor(this, tmpl);
};



/* -------------------- jQuery.fn : Iroha_normalizeTextNode -------------------- */
/**
 * remove text nodes that have only white spaces, and normalize space of each text nodes.
 * @function external:jQuery#Iroha_normalizeTextNode
 * @param {boolean} [deep]    process recursive node tree?
 * @return {jQuery} jQuery current context object
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
 * @function external:jQuery#Iroha_getInnerText
 * @param {boolean} includeAlt    if true, alt texts of &lt;img&gt; elements are included.
 * @return {string} whole inner texts.
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
 * @function external:jQuery#Iroha_assistSelectEvent
 * @param {number} [wait=100]    wait for preventing multiple fire (nonnegative integer in ms)
 * @return {jQuery} jQuery current context object
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
 * @function external:jQuery#Iroha_trapWheelEvent
 * @see Iroha.trapWheelEvent
 * @return {jQuery} jQuery current context object
 */
$.fn.Iroha_trapWheelEvent = function() {
	Iroha.trapWheelEvent(this);
	return this;
};



/* -------------------- jQuery.fn : Iroha_untrapWheelEvent -------------------- */
/**
 * マウスホイールイベントの閉じ込め処理を解除する。
 * {@link Iroha.trapWheelEvent} を使ってセレクタ文字列指定で適用していたものは、{@link Iroha.untrapWheelEvent} を使って解除する必要がある。
 * @function external:jQuery#Iroha_untrapWheelEvent
 * @see Iroha.untrapWheelEvent
 * @return {jQuery} jQuery current context object
 */
$.fn.Iroha_untrapWheelEvent = function() {
	Iroha.untrapWheelEvent(this);
	return this;
};



/* -------------------- jQuery.fn : Iroha_shuffleContent -------------------- */
/**
 * コンテキスト要素の直接子ノード群をシャッフル（ランダム並び替え）
 * @function external:jQuery#Iroha_shuffleContent
 * @return {jQuery} jQuery current context object
 */
$.fn.Iroha_shuffleContent = function() {
	return this.each(function() {
		var $node = $(this);
		$.each(shuffle($node.contents().get()), function() { $node.append(this) });
	});

	function shuffle(arr){
		var len = arr.length;
		var ret = [];
		while(len) ret.push(arr.splice(Math.floor(Math.random() * len--), 1)[0]);
		return ret;
	}
};



/* -------------------- jQuery.fn : Iroha_addBeforeUnload -------------------- */
/**
 * temporary wrapper for adding event listener of "window.onBeforeUnload".
 * @function external:jQuery#Iroha_addBeforeUnload
 * @param {Function} listener         an event listener function
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the listener func.
 * @return {jQuery} jQuery current context object
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



/* -------------------- jQuery.fn : Iroha_getBoundingClientRect -------------------- */
/**
 * HTMLElement#getBoundingClientRect のエイリアス。要素集合1番目の要素の ClientRect を得る。
 * @function external:jQuery#Iroha_getBoundingClientRect
 * @return { top:number, bottom:number, left:number, right:number, width:number, height:number } ClientRect オブジェクト
 */
$.fn.Iroha_getBoundingClientRect = function() {
	return (this.get(0) || document.createElement('i')).getBoundingClientRect();
};



/* -------------------- jQuery.fn : getBoundingClientRect -------------------- */
/**
 * @see jQuery#Iroha_getBoundingClientRect
 */
$.fn.getBoundingClientRect = $.fn.getBoundingClientRect || $.fn.Iroha_getBoundingClientRect;



/* -------------------- jQuery.expr : Iroha_focusable -------------------- */
// Fetch focusable elementsnippet from jQuery UI
// http://jqueryui.com
!function () {
	function visible(element) {
		return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
			return $.css(this, "visibility") === "hidden";
		}).length;
	}
	function focusable(element, isTabIndexNotNaN) {
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase();
		if ('area' === nodeName) {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
				return false;
			}
			img = $('img[usemap=#' + mapName + ']')[0];
			return !!img && visible(img);
		}
		return (/input|select|textarea|button|object/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);
	}
	$.extend($.expr[':'], {
		Iroha_focusable : function (element) {
			return focusable(element, !isNaN($.attr(element, 'tabindex')));
		},
		Iroha_tabbable : function (element) {
			var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
			return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});
}();



/* ============================== for JSDoc output ============================== */
/**
 * The jQuery namespace.
 * @external jQuery
 * @see {@link http://jquery.com/ jQuery}
 */



/* ============================== Startup ============================== */

$(function() {
	// indicates that the browser has ability to manipulate DOM tree.
	Iroha.env.isDOMReady = true;
	// add classname which indicates "Iroha is enabled".
	$(document.body).addClass('iroha-enabled');
});




})(window.jQuery || window.Zepto, _, Iroha = window.Iroha || {});