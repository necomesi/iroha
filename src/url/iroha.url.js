/*! "iroha.url.js" | Iroha - Necomesi JSLib : URL Handling Utilities | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : URL Handling Utilities
 *
 *    @version 3.00.20131118
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- Class : Iroha.Url -------------------- */
/**
 * URL handling utility.
 * @class URL handling utility.
 */
Iroha.Url = function() {
	/**
	 * an anchor element node to handle URL.
	 * @type {Element}
	 * @private
	 */
	this.anchor = document.createElement('a');
};

$.extend(Iroha.Url,
/** @lends Iroha.Url */
{
	/**
	 * create an instance
	 * @param {string} [url=location.href]    full URL string to set.
	 * @return {Iroha.Url} this instance itself
	 */
	create : function(url) {
		return (new this).set(url);
	}
});

$.extend(Iroha.Url.prototype,
/** @lends Iroha.Url.prototype */
{
	/**
	 * get full URL string which is handled by this instance.
	 * @return {string} full URL string
	 * @private
	 */
	get : function() {
		return this.anchor.href;
	},

	/**
	 * toString; an alias of {@link Iroha.Url#get}.
	 * @return {string} full URL string
	 */
	toString : function() {
		return this.get();
	},

	/**
	 * set full URL string.
	 * @param {string} [url=location.href]    full URL string to set.
	 * @return {Iroha.Url} this instance itself
	 */
	set : function(url) {
		this.anchor.href = String(url || location.href);
		return this;
	},

	/**
	 * getter / setter of protocol part of the URL.
	 * @param {string} [protocol=location.protocol]    protocol part to set.
	 * @return {string|Iroha.Url} (get) protocol part of the URL / (set) this instance itself
	 */
	protocol : function(protocol) {
		if (!arguments.length) {
			return this.anchor.protocol;
		} else {
			this.anchor.protocol = String(protocol || location.protocol);
			return this;
		}
	},

	/**
	 * getter / setter of hostname part of the URL.
	 * @param {string} [hostname=location.hostname]    hostname to set.
	 * @return {string|Iroha.Url} (get) hostname part of the URL / (set) this instance itself
	 */
	hostname : function(hostname) {
		if (!arguments.length) {
			return this.anchor.hostname;
		} else {
			this.anchor.hostname = String(hostname || location.hostname);
			return this;
		}
	},

	/**
	 * getter / setter of port number of the URL.
	 * @param {string|number} [port=location.port]    port number to set.
	 * @return {string|Iroha.Url} (get) port number of the URL / (set) this instance itself
	 */
	port : function(port) {
		if (!arguments.length) {
			var ret = this.anchor.port;
			return (!ret || ret == '0') ? '80' : ret;
		} else {
			this.anchor.port = String(Math.max(0, Number(port)) || location.port);
			return this;
		}
	},

	/**
	 * getter / setter of host string ("hostname:portnumber") of the URL.
	 * @param {string} [host=location.host]    host string to set.
	 * @return {string|Iroha.Url} (get) host string ("hostname:portnumber") of the URL / (set) this instance itself
	 */
	host : function(host) {
		if (!arguments.length) {
			return this.anchor.host;
		} else {
			this.anchor.host = String(host || location.host);
			return this;
		}
	},

	/**
	 * getter / setter of pathname of the URL.
	 * @param {string} [pathname='/']    pathname to set.
	 * @return {string|Iroha.Url} (get) pathname of the URL / (set) this instance itself
	 */
	pathname : function(pathname) {
		if (!arguments.length) {
			var ret = this.anchor.pathname;
			return (ret.charAt(0) != '/' ? '/' : '') + ret;
		} else {
			this.anchor.pathname = String(pathname || '/');
			return this;
		}
	},

	/**
	 * getter / setter of search (query string "?xxx") part of the URL.
	 * @param {string} [search]    search (query string) part to set.
	 * @return {string|Iroha.Url} (get) search part of the URL / (set) this instance itself
	 */
	search : function(search) {
		if (!arguments.length) {
			return this.anchor.search;
		} else {
			this.anchor.search = String(search || '');
			return this;
		}
	},

	/**
	 * getter / setter of hash ("#xxx") part of the URL.
	 * @param {string} [hash]    hash part to set
	 * @return {string|Iroha.Url} (get) hash part of the URL / (set) this instance itself
	 */
	hash : function(hash) {
		if (!arguments.length) {
			return this.anchor.hash;
		} else {
			this.anchor.hash = String(hash || '');
			return this;
		}
	},

	/**
	 * getter / setter of associative array of key-value; to handle query string part.
	 * @param {Object} [params]    an associative array to set
	 * @return {Object|Iroha.Url} (get) associative array created from query string part / (set) this instance itself
	 */
	param : function(params) {
		if (!arguments.length) {
			var ret = {};
			this.search().substr(1).split('&').forEach(function(param) {
				if (!param) return;
				var pair  = param.split('=');
				try {
					var key   = Iroha.String(pair[0]).decodeURI(true).get();
					var value = Iroha.String(pair[1]).decodeURI(true).get();
					// "[]" で終わるキーを持つ場合、配列として格納する。
					if (Iroha.String(key).endsWith('[]')) {
						key = key.slice(0, -2);
						ret[key] = ret[key] || [];
						ret[key].push(value);
					} else {
						ret[key] = value;
					}
				} catch(err) { }  // ignore decoding error caused by invalid percent-escaped-string.
			});
			return ret;
		} else {
			this.search($.param(params));
			return this;
		}
	}
});



})(Iroha.$, Iroha, window, document);