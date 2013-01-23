/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha : Necomeshi JS Library - base script.
 *       (charset : "UTF-8")
 *
 *    @version 3.22.20130110
 *    @requires jquery.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



// speed-up reference to 'window' object
var window = this;

// supplements 'undefined'
window.undefined = window.undefined;

// set default easing method
$.fx.off     = false;
$.easing.def = 'easeOutCubic';







/* =============== create Iroha global object and prepartions =============== */
/**
 * Iroha global object.
 * @name Iroha
 * @namespace Iroha global object
 */
window.Iroha = $.extend(window.Iroha, new (function() {
	var d  = document;
	var de = d.documentElement;
	var di = d.implementation;
	var ua = navigator.userAgent;

	// browser detection snippet by jQuery
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
	 * @namespace stored jQuery object, considering conflict.
	 * @name Iroha.jQuery
	 * @constant
	 */
	this.jQuery = $;
//	this.jQuery = $.noConflict();
	
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
	 * @property {Boolean} isChrome            true if the browser is AppleWebKit-based (Chrome Browser)
	 * @property {Boolean} isAndroidBrowser    true if the browser is AppleWebKit-based (Android "Standard Browser")
	 * @property {Boolean} isWebKit            true if the browser is AppleWebKit-based
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
	this.ua.isDOMReady   = (di) ? di.hasFeature('HTML', '1.0') : (this.ua.isIE && de);
	
	// isSafari と判別されていたとしても、iOS, Mac, Windows でないものや、Chrome の場合は false に戻す。
	this.ua.isSafari = this.ua.isSafari && !this.ua.isChrome && (this.ua.isiOS || this.ua.isMac || this.ua.isWin);
	// Android 標準ブラウザを判別
	this.ua.isAndroidBrowser = this.ua.isAndroid && this.ua.isWebKit && !this.ua.isChrome;
	
	/**
	 * geometry properties object; the property values are updated when {@link Iroha.getGeometry} is called.
	 * @name Iroha.geom
	 * @namespace geometry properties object; return value of {@link Iroha.getGeometry}
	 * @property {Number} windowW      width of the window viewport.
	 * @property {Number} windowH      height of the window viewport.
	 * @property {Number} pageW        width of the document.
	 * @property {Number} pageH        height of the document.
	 * @property {Number} scrollX      scrollLeft position of the document.
	 * @property {Number} scrollY      scrollTop position of the document.
	 * @property {Number} windowX      mouse position on X-axis (the origin is top left of the window viewport)
	 * @property {Number} windowY      mouse position on Y-axis (the origin is topleft of the window viewport)
	 * @property {Number} pageX        mouse position on X-axis (the origin is topleft of the document)
	 * @property {Number} pageY        mouse position on Y-axis (the origin is topleft of the document)
	 * @property {Number} zoom         window zoom ratio (in WinIE7).
	 * @property {Number} scrollBar    browser's scrollbar width.
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
	// prevent background image flicker.
	if (Iroha.ua.isIE) try { document.execCommand('BackgroundImageCache', false, true) } catch(err) { }

	$(function() {
		Iroha.env.isDOMReady = true;
		new Iroha.Timeout(function() {
			$(document.body).addClass('iroha-enabled');
		}, 1);  // workaround for IE to avoid speed down
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






/* ============================== Iroha build-in object wrapper classes ============================== */

/* --------------- Class : Iroha.Number --------------- */
/**
 * get number manipulator {@link Iroha.Number.Wrapper}.
 * @namespace number manipulator
 * @param {Number} [value]    number to manipulate.
 * @return Iroha.Number.Wrapper instance
 * @type Iroha.Number.Wrapper
 */
Iroha.Number = function(value) {
	return new Iroha.Number.Wrapper(value);
};

/* ----- Class : Iroha.Number.Wrapper ----- */
/**
 * number manipulator; the instance is available as return value of {@link Iroha.Number}
 * @class number manipulator.
 * @param {Number} [value=0]    number to manipulate.
 * @constructor
 * @see Iroha.Number
 */
Iroha.Number.Wrapper = function(value) {
	/** stored number to manipulate
	    @type Number
	    @private */
	this.value = Number(value) || 0;
};

/**
 * get current number as string
 * @returns get current number as string
 * @type String
 */
Iroha.Number.Wrapper.prototype.toString = function() {
	return String(this.value);
};

/**
 * get current number
 * @returns get current number
 * @type Number
 */
Iroha.Number.Wrapper.prototype.get = function() {
	return this.value;
};

/**
 * simple number formatter.
 * @param {String} format     fomatter string
 * @return string manipulator instance contains result string of this method
 * @type Iroha.String.Wrapper
 * @example
 *  Iroha.Number(     '56'   ).format(      '000'    ).get() ->        '056'
 *  Iroha.Number( '123456'   ).format(      '###'    ).get() ->        '456'
 *  Iroha.Number( '123456.78').format('#,###,###'    ).get() ->    '123,457'
 *  Iroha.Number( '123456.78').format('#,###,###.#'  ).get() ->    '123,456.8'
 *  Iroha.Number('-123456.78').format('0,###,###.000').get() -> '-0,123,456.780'
 */
Iroha.Number.Wrapper.prototype.format = function(format) {
	if (!format || typeof format != 'string') {
		throw new TypeError('Iroha.Number.Wrapper.format: first argument must be a formatting string.');
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
};



/* --------------- Class : Iroha.String --------------- */
/**
 * get string manipulator {@link Iroha.String.Wrapper}.
 * @namespace string manipulator
 * @param {String} [value]    string to manipulate.
 * @returns Iroha.String.Wrapper instance
 * @type Iroha.String.Wrapper
 */
Iroha.String = function(value) {
	return new Iroha.String.Wrapper(value);
};

/**
 * get random string.
 * @param {String} [chars]    characters which is using for random string.
 * @param {Number} num        number of characters
 * @returns Iroha.String.Wrapper instance
 * @type Iroha.String.Wrapper
 */
Iroha.String.random = function(chars, num) {
	var chars = ($.type(chars) == 'string') ? chars : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var num   = (num > 0) ? num : 24;
	var ret   = '';
	while (num--) {
		ret += chars.split('')[parseInt(Math.random() * chars.length)]
	}
	return this(ret);
};

Iroha.String.guid = function() {
	var chars = '0123456789ABCDEF';
	var arr   = [ 8, 4, 4, 4, 12 ].map(function(n) { return Iroha.String.random(chars, n).get() });
	return Iroha.String('${0}-${1}-${2}-${3}-${4}').format(arr);
}


/* ----- Class : Iroha.String.Wrapper ----- */
/**
 * creates string manipulator; the instance is available as return value of {@link Iroha.String}
 * @class string manipulator.
 * @param {String} [value='']    string to manipulate.
 * @constructor
 * @see Iroha.String
 */
Iroha.String.Wrapper = function(value) {
	/** stored string to manipulate
	    @type String
	    @private */
	this.value  = String(value === undefined ? '' : value);
	/** string length
	    @type Number */
	this.length = this.value.length;
};

/**
 * get current string
 * @returns current string
 * @type String
 */
Iroha.String.Wrapper.prototype.toString = function() {
	return this.value;
};

/**
 * get current string
 * @returns current string
 * @type String
 * @function
 */
Iroha.String.Wrapper.prototype.get = Iroha.String.Wrapper.prototype.toString

/**
 * simple text formatter. (super tiny!)
 * @param {String|String[]|Object}  arg1     a string, an array, or an associative array.
 * @param {String}                 [argN]    a string
 * @return this instance itself
 * @type Iroha.String.Wrapper
 * @example
 *  Iroha.String('${0}HOGE${1}FUGA${2}').format(    'xxx', '  yyy',   'zzz'  ).get()
 *  Iroha.String('${0}HOGE${1}FUGA${2}').format([   'xxx',   'yyy',   'zzz' ]).get()
 *  Iroha.String('${A}HOGE${B}FUGA${C}').format({ A:'xxx', B:'yyy', C:'zzz' }).get()
 *  Iroha.String('${A}HOGE${B.C}FUGA${B.D.E}').format({ A: 'xxx', B: { C:'yyy', D: { E:'zzz' } } }).get()
 *      -> 'xxxHOGEyyyFUGAzzz'
 */
Iroha.String.Wrapper.prototype.format = function(arg1, /* arg2, arg3 ..., */ argN) {
	var data;
	if (arguments.length == 0) {
		return this;
	} else if (typeof arg1 == 'object') {
		data = arg1;
	} else {
		data = $.makeArray(arguments).map(function(a) { return $.type(a) == 'undefined' ? a : String(a) });
	}
	this.replace(/\$\{(.+?)\}/g, function(_, key) {
		var replace = $.type(data) == 'array' ? data[key] : Iroha.getValue(key, data);
		return ($.type(replace) == 'undefined') ? '${' + key + '}' : replace;
	})
	return this;
};

/**
 * get string before specified keyword.
 * @param {String}  str            find keyword
 * @param {Boolean} [include]      if true, 'str' is included in manipulating string
 * @param {Boolean} [longMatch]    if true, use longest match (returned text length is longer)
 * @return this instance itself
 * @type Iroha.String.Wrapper
 */
Iroha.String.Wrapper.prototype.getBefore = function(str, include, longMatch) {
	if (typeof str != 'string') {
		throw new TypeError('Iroha.String.Wrapper.getBefore: first argument must be a string.');
	} else if (str) {
		var idx     = (!longMatch) ? this.value.indexOf(str) : this.value.lastIndexOf(str);
		this.value  = (idx == -1) ? '' : this.value.substring(0, idx) + (include ? str : '');
		this.length = this.value.length;
	}
	return this;
};

/**
 * get string after specified keyword.
 * @param {String}  str            find keyword
 * @param {Boolean} [include]      if true, 'str' is included in manipulating string
 * @param {Boolean} [longMatch]    if true, use longest match (returned text length is shorter)
 * @return this instance itself
 * @type Iroha.String.Wrapper
 */
Iroha.String.Wrapper.prototype.getAfter = function(str, include, longMatch) {
	if (typeof str != 'string') {
		throw new TypeError('String.Wrapper.getAfter: first argument must be a string.');
	} else if (str) {
		var idx     = (!longMatch) ? this.value.indexOf(str) : this.value.lastIndexOf(str);
		this.value  = (idx == -1) ? '' : (include ? str : '') + this.value.substring(idx + str.length, this.value.length);
		this.length = this.value.length;
	}
	return this;
};

/**
 * returns true if the string is started with specified keyword.
 * @param {String}  str    checking keyword
 * @return is the string started with the keyword?
 * @type Boolean
 */
Iroha.String.Wrapper.prototype.startsWith = function(str) {
	return (this.value.indexOf(str) == 0);
};

/**
 * returns true if the string is ended with specified keyword.
 * @param {String} str    checking keyword
 * @return is the string ended with the keyword?
 * @type Boolean
 */
Iroha.String.Wrapper.prototype.endsWith = function(str) {
	var idx = this.value.lastIndexOf(str);
	return (idx > -1 && idx + str.length == this.value.length);
};

/**
 * returns true if the string contains specified keyword.
 * @param {String} str    checking keyword
 * @return does the string contain the keyword?
 * @type Boolean
 */
Iroha.String.Wrapper.prototype.contains = function(str) {
	return (this.value.indexOf(str) != -1);
};

/**
 * convert relative path/URL to absolute path/URL.
 * @param {String} base    absolute path/URL as a base.
 * @return this instance itself
 * @type Iroha.String.Wrapper
 * @example
 *  Iroha.String('../target/').rel2abs('/path/to/base/'      ).get() -> '/path/to/target/'
 *  Iroha.String('../target/').rel2abs('http://path/to/base/').get() -> 'http://path/to/target/'
 */
Iroha.String.Wrapper.prototype.rel2abs = function(base) {
	var target = this.value;
	var b      = base  .split('/');
	var t      = target.split('/');
	var ptn = /^(\/|\w+:)/;
	if (!base.match(ptn)) {
		throw new TypeError('Iroha.String.Wrapper.rel2abs: first argument must be an absolute path/URL.');
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
};

/**
 * convert absolute path/URL to relative path/URL.
 * @param {String} base    absolute path/URL as a base.
 * @return this instance itself
 * @type Iroha.String.Wrapper
 * @example
 *  Iroha.String(      '/path/to/target/').abs2rel('/path/to/base/'      ).get() -> '../target/'
 *  Iroha.String('http://path/to/target/').abs2rel('http://path/to/base/').get() -> '../target/'
 */
Iroha.String.Wrapper.prototype.abs2rel = function(base) {
	var ptn = /^(\/|\w+:)/;
	if (!base.match(ptn)) {
		throw new TypeError('Iroha.String.Wrapper.abs2rel: first argument must be an absolute path/URL.');
	} else if (!this.value.match(ptn)) {
		throw new TypeError('Iroha.String.Wrapper.abs2rel: current string is not an absolute path/URL.');
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
};

/**
 * replace string, similar to String#replace.
 * @param {String|RegExp} find       expression to find target.
 * @param {String}        replace    replacing text.
 * @return this instance itself
 * @type Iroha.String.Wrapper
 */
Iroha.String.Wrapper.prototype.replace = function(find, replace) {
	this.value  = this.value.replace(find, replace);
	this.length = this.value.length;
	return this;
};

/**
 * convert to sanitized string
 * @return this instance itself
 * @type Iroha.String.Wrapper
 */
Iroha.String.Wrapper.prototype.sanitize = function() {
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
};



/* --------------- Class : Iroha.StyleSheets --------------- */
/**
 * get styleSheet wrapper instance.
 * @namespace styleSheet manipulator
 * @param {Number|StyleSheet} [arg]    index number in StyleSheet list / StyleSheet object
 * @return styleSheet wrapper instance
 * @type Iroha.StyleSheets.Wrapper
 * @example
 *  Iroha.StyleSheets().insertRule('body { color: red }');          // set font color to red
 *  Iroha.StyleSheets().each(function() { this.disabled = true });  // diable all style
 */
Iroha.StyleSheets = function(arg) {
	var sheets = document.styleSheets;
	
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

	if (typeof arg == 'number') {
		sheets = sheets[arg];
	} else if (typeof arg == 'object' && arg.type == 'text/css') {
		sheets = arg;
	}

	return new Iroha.StyleSheets.Wrapper(sheets);
};

/* ----- Class : Iroha.StyleSheets.Wrapper ----- */
/**
 * styleSheet wrapper; the instance is available as return value of {@link Iroha.StyleSheets}
 * @class styleSheet wrapper
 * @param {StyleSheetList} [sheets]    styleSheet list
 * @constructor
 */
Iroha.StyleSheets.Wrapper = function(sheets) {
	/** number of styleSheets owned by this instance.
	    @type Number */
	this.length = 0;

	$.makeArray(sheets).forEach(function(sheet, i) {
		this[i] = sheet;
		this.length++;
	}, this);
};

/**
 * get new instance that has a styleSheet indicated by index number.
 * @param {Number} [index]    index number to get.
 * @return new instance that has a styleSheet indicated by index number.
 * @type Iroha.StyleSheets.Wrapper
 */
Iroha.StyleSheets.Wrapper.prototype.eq = function(index) {
	var sheet = (typeof index == 'number') ? this[index] : null;
	return new this.constructor(sheet);
};

/**
 * get DOM StyleSheet object specified by index number, or an array of StyleSheets
 * @param {Number} [index]    index number to get.
 * @return StyleSheet object specified by index number, or an array of StyleSheets
 * @type StyleSheet|Array
 */
Iroha.StyleSheets.Wrapper.prototype.get = function(index) {
	return (typeof index == 'number') ? this[index] : Array.prototype.slice.call(this);
};

/**
 * get "ownerNode" of a DOM StyleSheet specified by index number, or an array of ownerNodes of the StyleSheets.
 * @param {Number} [index]    index number to get.
 * @return "ownerNode" of a DOM StyleSheet specified by index number, or an array of ownerNodes of the StyleSheets
 * @type Element|Element[]
 */
Iroha.StyleSheets.Wrapper.prototype.getOwnerNode = function(index) {
	if (typeof index == 'number') {
		return this[index].ownerNode || this[index].owingElement;
	} else {
		return Array.prototype.map.call(this, function(e, i) { return this.getOwnerNode(i) }, this);
	}
};

/**
 * get number of styleSheets owned by this instance.
 * @return number of styleSheets owned by this instance.
 * @type Number
 */
Iroha.StyleSheets.Wrapper.prototype.size = function() {
	return this.length;
};

/**
 * calls a function for each styleSheet in this instance; compatible with jQuery.each().
 * @param {Iroha.StyleSheets.Wrapper.callback.test} aCallback    the function to exec for every styleSheet; if the func returns false, it terminates iteration.
 * @return this instance itself
 * @type Iroha.StyleSheets.Wrapper
 */
Iroha.StyleSheets.Wrapper.prototype.each = function(aCallback) {
	$.each(this.get(), aCallback);
	return this;
};

/**
 * filter styleSheets in this instance; compatible with jQuery.filter().
 * @param {Iroha.StyleSheets.Wrapper.callback.test} aCallback    the function to exec for every styleSheet; if the func returns false, the styleSheet is filtered.
 * @return new instance that has filtered styleSheets.
 * @type Iroha.StyleSheets.Wrapper
 */
Iroha.StyleSheets.Wrapper.prototype.filter = function(aCallback) {
	return new this.constructor(this.get().filter(function(s, i) { return aCallback.call(s, i, s) }));
};

/**
 * insert css rule; the rule insert to the first styleSheet in this instance.
 * @param {String} cssText    css rule text to add
 * @return this instance itself
 * @type Iroha.StyleSheets.Wrapper
 */
Iroha.StyleSheets.Wrapper.prototype.insertRule = function(cssText) {
	var expr  = /([^\{]+)(\{.+\})/;
	var sheet = this.get(0);
	if (!sheet) {
		return;
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
};

/**
 * 現在保持しているスタイルシートのうち最初のものが持つ、スタイルルールオブジェクト群を得る
 * @return スタイルルールオブジェクト群
 * @type CSSRuleList
 */
Iroha.StyleSheets.Wrapper.prototype.getRules = function() {
	var sheet = this.get(0);
	return !sheet ? undefined : sheet.cssRules || sheet.rules;
};

/**
 * 現在保持しているスタイルシートのうち最初のものの、指定インデックス番号にあるスタイルルールを削除する。
 * @param {Number} index    削除対象のスタイルルールインデックス番号。非負整数。
 * @return このインスタンス自身
 * @type Iroha.StyleSheets.Wrapper
 */
Iroha.StyleSheets.Wrapper.prototype.removeRule = function(index) {
	var sheet = this.get(0);
	sheet && sheet.removeRule(index);
	return this;
};



/* ----- for JSDoc toolkit output ----- */
/**
 * higher-order functions for member methods of {@link Iroha.StyleSheets.Wrapper}
 * @name Iroha.StyleSheets.Wrapper.callback
 * @namespace higher-order functions for member methods of  {@link Iroha.StyleSheets.Wrapper}
 */
/**
 * higher-order function for {@link Iroha.StyleSheets.Wrapper#each}, {@link Iroha.StyleSheets.Wrapper#filter}
 * @function
 * @name Iroha.StyleSheets.Wrapper.callback.test
 * @param {Number}      anIndex      current processing index-num of the styleSheet.
 * @param {StyleSheet}  anSheet      current styleSheet.
 * @returns processing result value (boolean) of this function
 * @type Boolean
 */







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
	 * @type 新規インスタンス
	 * @type Iroha.ViewClass
	 * @constructs
	 */
	create : function() {
		return $.extend(new this, {
			  instances : []
			, key       : 'Iroha.ViewClass.' + Iroha.String.guid().replace(/-/g, '')
		});
	},
	
	/**
	 * 与えられたコンストラクタ（クラス）に汎用クラスプロパティ・メソッド群を与える。
	 * @param {Function} constructor    対象のコンストラクタ関数
	 * @return 汎用クラスプロパティ・メソッド群を与えられたコンストラクタ
	 * @type Function
	 */
	applyTo : function(constructor) {
		$.isFunction(constructor) || (constructor = function(){});
		return $.extend(constructor, this.create());
	}
});

$.extend(Iroha.ViewClass.prototype,
/** @lends Iroha.ViewClass.prototype */
{
	/**
	 * 生成したインスタンス群からなる配列
	 * @type Object[]
	 */
	instances : [],
	
	/**
	 * インスタンスのインデックス番号を格納するためのキー。
	 * @type String
	 */
	key : '',
	
	/**
	 * コンストラクタの prototype が備えているべき「既定のメソッド」。無ければここから補われる。
	 * @type Object
	 * @private
	 */
	defMethods : {
		  init      : function(node) { this.$node = $(node);       return this }
		, dispose   : function()     { this.constructor.disposeInstance(this)  }
		, appendTo  : function(node) { this.$node.appendTo (node); return this }
		, prependTo : function(node) { this.$node.prependTo(node); return this }
	},
	
	/**
	 * クラスから生成されたインスタンスを格納する
	 * @param {Object} instance    生成したインスタンス
	 * @return 格納したインスタンスそれ自身
	 * @type Object
	 * @private
	 */
	storeInstance : function(instance) {
		$(instance.$node).data(this.key + '.index', this.instances.push(instance) - 1);
		return instance;
	},
	
	/**
	 * クラスから作られた既存インスタンスを得る。
	 * @param {Number|jQuery|Element|String} arg    インデックス番号、またはインスタンス生成時に指定した「基底要素ノード」。
	 * @return 該当のインスタンス。存在しなければ undefined が返る。
	 * @type Object
	 */
	getInstance : function(arg) {
		if ($.type(arg) == 'number') {
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
	 * @param {jQuery|Element|String} node      インスタンスが主として取扱う「基底要素ノード」。instance.init() の第1引数として渡される。
	 * @param {Arguments}             [args]    instance.init() に渡される2番目以降の引数。
	 * @return 生成したインスタンス
	 * @type Object
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
	 * @return 与えられたインスタンス
	 * @type Object
	 */
	add : function(args) {
		// 既定のメソッド群がコンストラクタの prototype になければ、補う。
		$.each(this.defMethods, $.proxy(function(name, func) { this.prototype[name] || (this.prototype[name] = func) }, this));
		
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
	extend : function(constructor) {
		$.isFunction(constructor) || (constructor = function(){});
		$.extend(this.prototype, new constructor);
		return this;
	}
});



/* -------------------- Class : Iroha.Observable -------------------- */
/**
 * create observable object
 * @class observable
 * @constructor
 */
Iroha.Observable = function() {
	/** callback function chain, pair of key name and function.
	    @type Object
	    @private */
	this.callbackChains      = null;
	/** callback ignoring level - pairs of callback name and level string; 'all', 'preserved', 'disposable', 'none'.
	    @type Object
	    @private */
	this.callbackIgnoreLevel = {};
};

/**
 * Iroha.Observable のインスタンスを作って返す。
 * @return Iroha.Observable の新規インスタンス
 * @type Iroha.Observable
 */
Iroha.Observable.create = function() {
	return new this;
};

/**
 * process callback functions.
 * @param {String} name            callback name (preferred to start with 'on')
 * @param {Object} [_arguments]    arguments for callback function
 * @return result value of last one of the callback functions chain.
 * @type Object
 */
Iroha.Observable.prototype.doCallback = function(name, /* arg1, arg2, ... */ _arguments) {
	var chain = this.callbackChains;
	if (!chain || !chain[name]) {
		return undefined;
	} else {
		var ret;
		var args = Array.prototype.slice.call(arguments, 1);

		chain[name]
			.filter(function(delegate) {
				var level = this.callbackIgnoreLevel[name] || 'none';
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
};

/**
 * add callback function.
 * @param {String}   name             callback name (preferred to start with 'on')
 * @param {Function} func             callback function/method
 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
 * @param {String}   [disposable]     if 'disposable' specified, the callback function is treated as 'disposable'.
 * @return this instance
 * @type Iroha.Observable
 */
Iroha.Observable.prototype.addCallback = function(name, func, aThisObject, disposable) {
	if (typeof name != 'string' || name == '') {
		throw new TypeError('Iroha.Observable.addCallback: argument \'name\' must be a string as callback name.');
	} else if (typeof func != 'function') {
		throw new TypeError('Iroha.Observable.addCallback: argument \'func\' must be a Function object.');
	} else {
		if (!this.callbackChains      ) this.callbackChains       = {};
		if (!this.callbackChains[name]) this.callbackChains[name] = [];

		var delegate = $.proxy(func, aThisObject);
		delegate.isDisposable = (disposable == 'disposable');
		this.callbackChains[name].push(delegate);
	}
	return this;
};

/**
 * remove callback function.
 * @param {String}   name             callback name (preferred to start with 'on')
 * @param {Function} [func]           callback function/method to remove, if no funcs given, all callback funcs will be removed.
 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
 * @return this instance
 * @type Iroha.Observable
 */
Iroha.Observable.prototype.removeCallback = function(name, func, aThisObject) {
	var chain = this.callbackChains;
	if (typeof name != 'string' || name == '') {
		throw new TypeError('Iroha.Observable.removeCallback: argument \'name\' must be a string as callback name.');
	} else if (chain && chain[name]) {
		if (typeof func != 'function') {
			delete chain[name];
		} else {
			var obj = (typeof aThisObject == 'object' && aThisObject) ? aThisObject : window;
			chain[name] = chain[name].filter(function(delegate) {
				return (delegate.func !== func || delegate.aThisObject !== obj);
			});
		}
	}
	return this;
};

/**
 * remove 'disposable' callback function.
 * @param {String} name    callback name (preferred to start with 'on')
 * @return this instance
 * @type Iroha.Observable
 */
Iroha.Observable.prototype.removeDisposableCallback = function(name) {
	var chain = this.callbackChains;
	if (chain && chain[name]) {
		chain[name] = chain[name].filter(function(delegate) { return !delegate.isDisposable });
	}
	return this;
};

/**
 * set callback ignoring level.
 * @param {String} name             callback name (preferred to start with 'on')
 * @param {String} [level="all"]    ignoring level - 'all', 'preserved', 'disposable', 'none'
 * @return this instance
 * @type Iroha.Observable
 */
Iroha.Observable.prototype.ignoreCallback = function(name, level) {
	var chain = this.callbackChains;
	if (typeof name != 'string' || name == '') {
		throw new TypeError('Iroha.Observable.ignoreCallback: argument \'name\' must be a string as callback name.');
	} else if (chain && chain[name]) {
		var levels = ['all', 'preserved', 'disposable', 'none'];
		this.callbackIgnoreLevel[name] = (levels.indexOf(level) != -1) ? level : 'all';
	}
	return this;
};



/* --------------- Class : Iroha.Iterator --------------- */
/**
 * create iterator object
 * @class iterator
 */
Iroha.Iterator = function(obj, mode) {
	/** iterated elements; an associative array, an array, or an object like those.
	    @type Object
	    @private */
	this.targets = undefined;
	/** an array of keys in iterated elements.
	    @type String[]
	    @private */
	this.keys    = [];
	/** a number of current position of the iterator.
	    @type Number
	    @private */
	this.counter = 0;
	/** element getting mode; "key", "value", or "both".
	    @type String
	    @private */
	this.mode    = 'value';
	/** flag to abort automatic iterating
	    @type Boolean
	    @private */
	this.aborted = false;
};

/**
 * Iroha.Iterator のインスタンスを作って返す。
 * @return Iroha.Iterator の新規インスタンス
 * @type Iroha.Iterator
 */
Iroha.Iterator.create = function() {
	var instance = new this;
	instance.init.apply(instance, arguments);
	return instance;
};

/**
 * initialize
 * @param {Object} targets           iterated elements; an associative array, an array, or an object like those.
 * @param {Object} [mode="value"]    element getting mode; 'key', 'value', or 'both'
 * @return this instance
 * @type Iroha.Iterator
 */
Iroha.Iterator.prototype.init = function(targets, mode) {
	if (!targets || typeof targets != 'object') {
		throw new TypeError('Iroha.Iterator#init: invalid object type.');
	} else {
		this.targets = targets;
		this.mode    = mode || 'value';
		$.each(this.targets, $.proxy(function(key) { this.keys.push(key) }, this));
	}
	return this;
};

/**
 * does the iterator has next element?
 * @return true if the iterator has next element.
 * @type Boolean
 */
Iroha.Iterator.prototype.hasNext = function() {
	return (this.counter < this.keys.length);
};

/**
 * get next element in the iteration; the form of an acquired element depends on "element getting mode"
 * @return next element in the iteration
 * @type Object
 */
Iroha.Iterator.prototype.next = function() {
	if (!this.hasNext()) {
		throw new ReferenceError('Iroha.Iterator#next: StopIteration');
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
};

/*
 * start automatic iterating.
 * @param {Function} func             callback function
 * @param {Number}   [ms=0]           milliseconds to interval
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
 * @return this instance
 * @type Iroha.Iterator
 */
Iroha.Iterator.prototype.iterate = function(func, ms, aThisObject) {
	if (typeof func != 'function') {
		throw new TypeError('Iroha.Iterator#iterate: first argument must be a function object.');
	} else {
		var flag = (!this.aborted && this.hasNext()) ?
		           	func.apply(aThisObject, $.makeArray(this.next())) :
		           	false;
		if (flag !== false) {
			if (ms > 0) {
				new Iroha.Timeout(function() {
					this.iterate(func, ms, aThisObject);
				}, ms, this);
			} else {
				this.iterate(func, ms, aThisObject);
			}
		}
	}
	return this;
};

/**
 * abort automatic iterating 
 * @return this instance
 * @type Iroha.Iterator
 */
Iroha.Iterator.prototype.abort = function() {
	this.aborted = true;
	return this;
};



/* --------------- Class : Iroha.Timeout --------------- */
/**
 * a wrapper of 'setTimeout()'.
 * @class timeout timer
 * @param {Function} [func]           callback function
 * @param {Number}   [ms=0]           milliseconds to timeout
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
 * @constructor
 */
Iroha.Timeout = function(func, ms, aThisObject) {
	/** timer ID.
	    @type Number
	    @private */
	this.timer       = 0;
	/** callback function
	    @type Function
	    @private
	    @constant */
	this.func        = $.isFunction(func) ? func : new Function;
	/** milliseconds to timeout
	    @type Function
	    @private
	    @constant */
	this.ms          = Math.max(0, ms) || 0
	/** the object that will be a global object ('this') in the func
	    @type Object
	    @private
	    @constant */
	this.aThisObject = aThisObject || window;
	/** native timer function name; 'setTimeout' or 'setInterval'
	    @type String
	    @private
	    @constant */
	this.timerFunc   = 'setTimeout';

	if (arguments.length) {
		this.init();
	}
};

/**
 * initialize.
 * @private
 */
Iroha.Timeout.prototype.init = function() {
	var delegate  = $.proxy(this.func, this.aThisObject);
	var timerFunc = window[this.timerFunc];
	this.timer    = (Iroha.ua.isIE) ?
	              	timerFunc(delegate, this.ms, 'JScript') : // workaround to the page weaved with vbscript.
	              	timerFunc(delegate, this.ms           ) ;
};

/**
 * clear timer.
 */
Iroha.Timeout.prototype.clear = function() {
	clearTimeout (this.timer);
	clearInterval(this.timer);
};

/** @deprecated use {@link #clear} method instead of this method. */
Iroha.Timeout.prototype.clearTimer = function() { return this.clear.apply(this, arguments) };



/* --------------- Class : Iroha.Interval --------------- */
/**
 * a wrapper of 'setInterval()'.
 * @class interval timer
 * @extends Iroha.Timeout
 * @param {Function} func             callback function
 * @param {Number}   [ms=0]           milliseconds to interval
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the func
 * @constructor
 */
Iroha.Interval = function(func, ms, aThisObject) {
	/** timer ID.
	    @type Number
	    @private */
	this.timer       = 0;
	/** callback function
	    @type Function
	    @private
	    @constant */
	this.func        = func;
	/** milliseconds to timeout
	    @type Function
	    @private
	    @constant */
	this.ms          = Math.max(0, ms) || 0
	/** the object that will be a global object ('this') in the func
	    @type Object
	    @private
	    @constant */
	this.aThisObject = aThisObject || window;
	/** native timer function name; 'setTimeout' or 'setInterval'
	    @type String
	    @private
	    @constant */
	this.timerFunc   = 'setInterval';

	if (arguments.length) {
		this.init();
	}
};
Iroha.Interval.prototype = new Iroha.Timeout;



/* --------------- Class : Iroha.Timer --------------- */
/**
 * construct simple elapsed timer object.
 * @class simple elapsed timer.
 * @constructor
 */
Iroha.Timer = function() {
	/** started time of the timer in 'epoch time'.
	    @type Number
	    @private */
	this.startTime = null;

	this.reset();
};

/**
 * reset timer.
 */
Iroha.Timer.prototype.reset = function() {
	this.startTime = (new Date()).getTime();
};

/**
 * get acquire time progress in milisecond.
 * @return acquire time progress in milisecond.
 * @type Number
 */
Iroha.Timer.prototype.getTime = function() {
	return (new Date()).getTime() - this.startTime;
};

/**
 * get acquire time progress in second.
 * @return acquire time progress in second.
 * @type Number
 */
Iroha.Timer.prototype.getSeconds = function() {
	return this.getTime() / 1000;
};



/* --------------- Class : Iroha.Tag --------------- */
/**
 * create tag string object for document.write().
 * @class tagstring as element object.
 * @constructor
 * @param {String} tagName    element name to create
 * @param {Object} [attrs]    associative array of attributes { name1 : value1, name2 : value2 ... }
 */
Iroha.Tag = function(tagName, attrs) {
	/** tag name (element name) to create
	    @type String
	    @constant */
	this.tagName    = tagName;
	/** associative array of attributes { name1 : value1, name2 : value2 ... }
	    @type Object */
	this.attributes = attrs || {};
	/** array of {@link Iroha.Tag} instances
	    @type Iroha.Tag[] */
	this.childNodes = [];
};

/**
 * get/set attribute value.
 * @param {String} name    attribute name
 * @param {String} [value]    value to set
 */
Iroha.Tag.prototype.attr = function(name, value) {
	if (typeof name != 'string') {
		throw new TypeError('Iroha.Tag.attr: first argument must be a string (name).');
	} else if (value == undefined) {
		return this.attributes[name] || '';
	} else {
		return (this.attributes[name] = String(value));
	}
};

/**
 * append child instance.
 * @param {Iroha.Tag|String} arg     instance to append
 */
Iroha.Tag.prototype.append = function(arg) {
	if (arg == undefined || arg == null) {
		throw new TypeError('Iroha.Tag.append: first argument must be a string or a Iroha.Tag instance.');
	} else {
		if (arg.constructor != this.constructor) {
			arg = String(arg);
		}
		this.childNodes.push(arg);
	}
};

/**
 * output instance data as tag string. typically to use document.write().
 * @param {Boolean} [debug=false]    debug mode - escaped output
 * @return HTML tag string
 * @type String
 */
Iroha.Tag.prototype.toString = function(debug) {
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
};







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
		var obj = $.type(obj) != 'object' ? window : obj;
		var get = new Function('try { return this.' + expr + ' }catch(e){}');
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



/* --------------- Function : Iroha.barrageShield --------------- */
/**
 * create wrapper function which ignores and unify barraged-function-calls.
 * @param {Function} func             a function which has possibility to be barraged function-calls
 * @param {Number}   [delay=1]        delay time to ignore barraged function-calls
 * @param {Object}   [aThisObject]    the object that will be a global object ('this') in the function
 * @return wrapper function.
 * @type Function
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
 * IE8 を含むそれより古い IE では <a href="http://code.google.com/p/ierange/">W3C DOM Ranges for IE</a> が必要。
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
 * @param {Event} e    event object - this param exists when this function is called as an event handler.
 * @returns an associative array of geometry properties
 * @type Iroha.geom
 */
Iroha.getGeometry = function(e) {
	var w = window;
	var d = document.documentElement;
	var b = document.body;
	var g = Iroha.geom;
	var _ = arguments.callee;

	var isWinIEqm = (Iroha.ua.isIE && Iroha.ua.isWin && Iroha.ua.isQuirksMode);
	var isMacIE   = (Iroha.ua.isIE && Iroha.ua.isMac);
	var isSafari2 = (Iroha.ua.isSafari && Iroha.ua.version < 522); /* Safari 2.0.x or ealier */

	g.windowW   = w.innerWidth  || (isMacIE ? b.scrollWidth  : d.offsetWidth );
	g.windowH   = w.innerHeight || (isMacIE ? b.scrollHeight : d.offsetHeight);
	g.pageW     = (isMacIE) ? d.offsetWidth  : (isWinIEqm) ? b.scrollWidth  : d.scrollWidth ;
	g.pageH     = (isMacIE) ? d.offsetHeight : (isWinIEqm) ? b.scrollHeight : d.scrollHeight;
	g.scrollX   = w.scrollX || d.scrollLeft || b.scrollLeft || 0;
	g.scrollY   = w.scrollY || d.scrollTop  || b.scrollTop  || 0;
	g.windowX   = (!e) ? (g.windowX || 0) : e.clientX - (( isSafari2) ? g.scrollX : 0);
	g.windowY   = (!e) ? (g.windowY || 0) : e.clientY - (( isSafari2) ? g.scrollY : 0);
	g.pageX     = (!e) ? (g.pageX   || 0) : e.clientX + ((!isSafari2) ? g.scrollX : 0);
	g.pageY     = (!e) ? (g.pageX   || 0) : e.clientY + ((!isSafari2) ? g.scrollY : 0);
	g.zoom      = _.getZoomRatio();
	g.scrollBar = _.getScrollBarWidth();

	if (Iroha.settings.common.showGeometry) {
		var msg = [
			  ['window'   , '${windowW}x${windowH}']
			, ['page'     , '${pageW}x${pageH}'    ]
			, ['scroll'   , '${scrollX},${scrollY}']
			, ['pos(view)', '${windowX},${windowY}']
			, ['pos(abs)' , '${pageX},${pageY}'    ]
			, ['zoom'     , '${zoom}'              ]
			, ['sbar'     , '${scrollBar}'         ]
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
 * @return a Deferred's Promise object.
 * @type jQuery.Deferred.Promise
 */
Iroha.watchFor = function(expr, timeout, base) {
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
	var observe = new Iroha.Interval(observer , 100);
	var giveup  = new Iroha.Timeout (terminate, Math.max(0, timeout) || 3000);
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



/* --------------- Function : Iroha.fireShigekix --------------- */
/**
 * シゲキックス発動（IE7用）
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
	var dfd = $.Deferred();
	if (delay > 0) {
		new Iroha.Timeout(function() {
			aThisObject ? dfd.resolveWith(aThisObject) : dfd.resolve();
		}, delay);
	} else {
		aThisObject ? dfd.resolveWith(aThisObject) : dfd.resolve();
	}
	return dfd.promise();
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

/* -------------------- jQuery.fn : Iroha_getInnerText() -------------------- */
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



})(jQuery);