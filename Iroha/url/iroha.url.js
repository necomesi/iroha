/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       URL handling utility.
 *
 *    @version 3.00.20130217
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- Class : Iroha.Url -------------------- */
/**
 * URL handling utility.
 * @class URL handling utility.
 */
Iroha.Url = function(url) {
	/**
	 * an anchor element node to handle URL.
	 * @type Element
	 * @private
	 * @constant
	 */
	this.anchor = document.createElement('a');
};

$.extend(Iroha.Url,
/** @lends Iroha.Url */
{
	/** 
	 * create an instance
	 * @param {String} [url=location.href]    full URL string to set.
	 * @return this instance itself
	 * @type Iroha.Url
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
	 * @return full URL string
	 * @type String
	 * @private
	 */
	get : function() {
		return this.anchor.href;
	},
	
	/**
	 * toString; an alias of {@link Iroha.Url#get}.
	 * @return full URL string
	 * @type String
	 */
	toString : function() {
		return this.get();
	},
	
	/**
	 * set full URL string.
	 * @param {String} [url=location.href]    full URL string to set.
	 * @return this instance itself
	 * @type Iroha.Url
	 */
	set : function(url) {
		this.anchor.href = String(url || location.href);
		return this;
	},
	
	/**
	 * getter / setter of protocol part of the URL.
	 * @param {String} [url=location.protocol]    protocol part to set.
	 * @return (get) protocol part of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String} [hostname=location.hostname]    hostname to set.
	 * @return (get) hostname part of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String|Number} [port=location.port]    port number to set.
	 * @return (get) port number of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String} [host=location.host]    host string to set.
	 * @return (get) host string ("hostname:portnumber") of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String} [pathname='/']    pathname to set.
	 * @return (get) pathname of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String} [search]    search (query string) part to set.
	 * @return (get) search part of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @param {String} [hash]    hash part to set
	 * @return (get) hash part of the URL / (set) this instance itself
	 * @type String|Iroha.Url
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
	 * @return (get) associative array created from query string part / (set) this instance itself
	 * @type String|Iroha.Url
	 */
	param : function(params) {
		if (!arguments.length) {
			var ret = {};
			this.search().substr(1).split('&').forEach(function(param) {
				if (param) {
					var pair  = param.split('=');
					try {
						var key   = Iroha.String(pair[0]).decodeURI(true).get();
						var value = Iroha.String(pair[1]).decodeURI(true).get();
						ret[key] = value;
					} catch(err) { }  // ignore decoding error caused by invalid percent-escaped-string.
				}
			});
			return ret;
		} else {
			this.search($.param(params));
			return this;
		}
	}
});



})(Iroha.jQuery);