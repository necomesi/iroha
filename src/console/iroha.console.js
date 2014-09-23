/*! "iroha.console.js" | Iroha - Necomesi JSLib : Tiny Console Display | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Tiny Console Display
 *       (charset : "UTF-8")
 *
 *    @version 1.03.20140623
 *    @requires jquery.js (or zepto.js)
 *    @requires underscore.js (or lodash.js)
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
;(function($, _, Iroha) {



/* ============================== Classes ============================== */

/* -------------------- Class : Iroha.Console -------------------- */
/**
 * @class 簡易コンソールログ表示
 */
Iroha.Console = function() {
	/**
	 * 基底要素ノード
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * 最後に追加されたログ行。
	 * @type jQuery
	 * @private
	 */
	 this.$lastLog = $();

	/**
	 * ログ取得（溜め込み）を一時停止中かどうか
	 * @type Boolean
	 */
	this.isPaused = false;
};

Iroha.ViewClass(Iroha.Console);

$.extend(Iroha.Console,
/** @lends Iroha.Console */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-console',

	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {jQuery|Element|String} [arg]    基底要素ノード
	 */
	create : function(arg) {
		return this.getInstance(arg) || this.add(arg);
	}
})

$.extend(Iroha.Console.prototype,
/** @lends Iroha.Console.prototype */
{
	/**
	 * 初期化。 DOM Ready 前でも呼び出し可能。ただし表示はまだされない。
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	init : function() {
		var baseCN = this.constructor.BASE_CLASSNAME;

		// 基底要素ノード生成
		this.$node = $(document.createElement('ul'))
			.addClass(baseCN)
			.on('click', $.proxy(function(e) {
				e.preventDefault();
				this.clear();
			}, this));

		// DOM Ready されたら（されていたら）ノードツリー挿入
		// (DOM Ready 前でもログは取っていて基底要素の内容として追加はしている)
		$($.proxy(function() {
			this.$node.appendTo(document.body);
			this.show();
		}, this));

		// info(), warn(), error() はここでつくりだす。
		'info,warn,error'.split(',').forEach(function(level) {
			this[level] = function() {
				this.log.apply(this, arguments);
				this.$lastLog.addClass(baseCN + '__log--' + level);
				return this;
			}
		}, this);

		this.log('console start');
		return this;
	},

	/**
	 * ログ行を追加する。 DOM Ready 前でも呼び出し可能。ただし表示はまだされない。
	 * @param {Arguments} args    表示するもの。引数いくつでも。
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	log : function(args) {
		if (this.isPaused) return this;

		var log  = [].join.call(arguments, ' ');
		var date = new Date();
		    date = {
		    	  'YYYY' : ('0000' +  date.getFullYear()    ).slice(-4)
		    	, 'MM'   : ('00'   + (date.getMonth() + 1)  ).slice(-2)
		    	, 'DD'   : ('00'   +  date.getDate()        ).slice(-2)
		    	, 'hh'   : ('00'   +  date.getHours()       ).slice(-2)
		    	, 'mm'   : ('00'   +  date.getMinutes()     ).slice(-2)
		    	, 'ss'   : ('00'   +  date.getSeconds()     ).slice(-2)
		    	, 'ms'   : ('000'  +  date.getMilliseconds()).slice(-3)
		    };
//		    date = Iroha.String('${hh}:${mm}:${ss}.${ms}| ').format(date).get();  // "Iroha.String" is not included in iroha.essential.js
		    date = _.template('{{hh}}:{{mm}}:{{ss}}.{{ms}}| ')(date);
		var $log = $(document.createElement('li'))
			.addClass(this.constructor.BASE_CLASSNAME + '__log')
			.text(date + log);

		this.$node
			.append(this.$lastLog = $log)
			.scrollTop(this.$node.prop('scrollHeight'));

		return this.show();
	},

	/**
	 * 溜まったログをいったんクリアする
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	clear : function() {
		this.$node.empty();
		this.log('console cleared');
		return this;
	},

	/**
	 * 基底要素を画面表示する（ために className の与奪をする）
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	show : function() {
		var baseCN = this.constructor.BASE_CLASSNAME;
		this.$node
			.toggleClass(baseCN + '--shown' , true )
			.toggleClass(baseCN + '--hidden', false);
		return this;
	},

	/**
	 * 基底要素を画面上から消す（ために className の与奪をする）
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	hide : function() {
		var baseCN = this.constructor.BASE_CLASSNAME;
		this.$node
			.toggleClass(baseCN + '--shown' , false)
			.toggleClass(baseCN + '--hidden', true );
		return this;
	},

	/**
	 * ログ取得（溜め込み）を再開する
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	resume : function() {
		this.isPaused = false;
		return this;
	},

	/**
	 * ログ取得（溜め込み）を一時停止する
	 * @return このインスタンス自身
	 * @type Iroha.Console
	 */
	pause : function() {
		this.isPaused = true;
		return this;
	}
});



})(Iroha.$, Iroha._, Iroha);