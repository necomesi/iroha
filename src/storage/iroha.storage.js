/*! "iroha.storage.js" |  Iroha - Necomesi JSLib : Data Storages | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Data Storages
 *       (charset : "UTF-8")
 *
 *    @version 3.02.20131003
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* ==================== Class : Iroha.LocalStorage ==================== */
/**
 * @class データストレージ。LocalStorage の格納データを読み書き。永続的。
 */
Iroha.LocalStorage = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * インスタンスが取扱うデータの格納名。
	 * @type String
	 */
	this.name = '';

	/**
	 * インスタンスが取扱うデータのタイムスタンプ。
	 * タイムスタンプ情報のないものは常時「現在時刻」
	 * @type Date
	 */
	this.timestamp = undefined;

	/**
	 * Web Storage
	 * @type Storage
	 */
	this.storage = localStorage;
};

$.extend(Iroha.LocalStorage,
/** @lends Iroha.LocalStorage */
{
	/**
	 * インスタンスを作って返す。
	 * @return Iroha.LocalStorage の新規インスタンス
	 * @type Iroha.LocalStorage
	 */
	create : function() {
		var instance = new this;
		return instance.init.apply(instance, arguments);
	}
});

$.extend(Iroha.LocalStorage.prototype,
/** @lends Iroha.Storage.prototype */
{
	/**
	 * 初期化
	 * @param {String} name       このインスタンスが取扱うデータの名称。
	 * @param {Object} [value]    初期格納データ。JSON 文字列に変換可能な形式の値でなければならない。無指定時は既存データをそのまま利用する。
	 * @return このインスタンス自身
	 * @type Iroha.LocalStorage
	 */
	init : function(name, value) {
		if ($.type(name) != 'string' || !name) {
			throw new TypeError('Iroha.Storage#init: first argument must be a string (name).');
		}

		this.name = name;
		value === undefined || this.set(value);
		return this;
	},

	/**
	 * データを取り出す
	 * @return 格納データ。JSON 文字列から作られるオブジェクトか、プリミティブ値。該当なき場合は null。
	 * @type Object|String|Number|Boolean
	 */
	get : function() {
		var json = JSON.parse(this.storage.getItem(this.name));
		if (json === null) {
			return null;
		} else {
			json.timestamp > 0 && (this.timestamp = new Date(json.timestamp));
			return json.value
		}
	},

	/**
	 * データを格納する。
	 * @param {Object}  [value]           格納するデータ。JSON 文字列に変換可能な形式の値でなければならない。
	 * @param {Boolean} [update=true]     タイムスタンプを更新するかどうか（デフォルトは「する」）
	 * @return 格納したデータ。JSON 文字列から作られるオブジェクトか、プリミティブ値。
	 * @type Object|String|Number|Boolean
	 */
	set : function(value, update) {
		if (value === undefined) {
			throw new TypeError('Iroha.Storage#set: first argument is undefined.');
		}

		// 一旦 JSON 相互変換を掛けることでサニタイズと妥当性検証（だめならここでエラー）
		value = JSON.parse(JSON.stringify(value));

		// タイムスタンプを更新
		($.type(update) != 'boolean' || update) && (this.timestamp = new Date);

		// タイムスタンプ情報とともに格納
		this.storage.setItem(this.name, JSON.stringify({ value : value, timestamp : this.timestamp.getTime() }));

		return this.get();
	}
});



/* ==================== Class : Iroha.SessionStorage ==================== */
/**
 * @class データストレージ。SessionStorage の格納データを読み書き。セッション終了まで有効。
 */
Iroha.SessionStorage = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * インスタンスが取扱うデータの格納名。
	 * @type String
	 */
	this.name = '';

	/**
	 * インスタンスが取扱うデータのタイムスタンプ。
	 * タイムスタンプ情報のないものは常時「現在時刻」
	 * @type Date
	 */
	this.timestamp = undefined;

	/**
	 * Web Storage
	 * @type Storage
	 */
	this.storage = sessionStorage;
};

Iroha.SessionStorage.create    =     Iroha.LocalStorage.create;
Iroha.SessionStorage.prototype = new Iroha.LocalStorage;



/* ============================== Class : Nextia.Simulator.InterimStorage ============================== */
/**
 * @class データストレージ。JS オブジェクトツリーの格納データを読み書き。ページ遷移で即座に揮発。
 */
Iroha.InterimStorage = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * データ格納オブジェクト
	 * @type Object
	 * @private
	 */
	this.storage = {};
};

$.extend(Iroha.InterimStorage,
/** @lends Iroha.InterimStorage */
{
	/**
	 * Iroha.InterimStorage のインスタンスを作って返す。
	 * @return Iroha.InterimStorage の新規インスタンス
	 * @type Iroha.InterimStorage
	 */
	create : function() {
		var instance = new this;
		return instance.init.apply(instance, arguments);
	}
});

$.extend(Iroha.InterimStorage.prototype,
/** @lends Iroha.InterimStorage.prototype */
{
	/**
	 * 初期化
	 * @return このインスタンス自身
	 * @type Iroha.InterimStorage
	 */
	init : function() {
		//
		// nothing to do...
		//
		return this;
	},

	/**
	 * データを格納する。
	 * @param {String} expr     格納名。オブジェクト階層の直接的指定 "Object1.Object2.key" も可。
	 * @param {Object} value    格納するデータ。型はさまざま。
	 * @return 格納したデータ（型はさまざま）。
	 * @type Object
	 */
	set : function(expr, value) {
		return Iroha.setValue(expr, value, this.storage);
	},

	/**
	 * データを取り出す。
	 * @param {String} [expr]    格納名。オブジェクト階層の直接的指定 "Object1.Object2.key" も可。無指定時は格納データすべて。
	 * @return 格納データ。型はさまざま。該当なしの場合は undefined が返る。返値がオブジェクトの場合は参照切断されたものを返す。
	 * @type Object
	 */
	get : function(expr) {
		var data = !expr ? this.storage : Iroha.getValue(expr, this.storage);
		switch($.type(data)) {
			case 'object' : data = $.extend   (true, null, data); break;
			case 'array'  : data = $.makeArray(data)            ; break;
			case 'date'   : data = new Date   (data)            ; break;
			default       : break;
		}
		return data;
	}
});



})(Iroha.$, Iroha, window, document);