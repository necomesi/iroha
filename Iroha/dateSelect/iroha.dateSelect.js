/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       年/月/日を選択する <select> メニュー。
 *
 *    @version 3.0.20120530
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- jQuery.fn : Iroha_DateSelect -------------------- */
/**
 * Iroha.DateSelect as jQuery plugin
 * @exports $.fn.Iroha_DateSelect as jQuery.fn.Iroha_DateSelect
 * @param {Iroha.DateSelect.Setting}         [setting]     動作設定オブジェクト
 * @param {Iroha.DateSelect.Callback.change} [callback]    選択状態が変更されたときのコールバック関数
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_DateSelect = function(setting, callback) {
	Iroha.DateSelect.create(this, setting).addCallback('change', callback || $.noop);
	return this;
};



/* --------------- Class : Iroha.DateSelect --------------- */

/** 
 * @class 年/月/日を選択する <select> メニュー
 * @extend Iroha.Observable
 */
Iroha.DateSelect = function() {
	/** 
	 * 年/月/日を選択するための <select> 要素（群）。
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * このインスタンスの動作設定オブジェクト
	 * @type Iroha.DateSelect.Setting
	 * @private
	 */
	this.setting = {};
};

Iroha.ViewClass(Iroha.DateSelect).extend(Iroha.Observable);

$.extend(Iroha.DateSelect.prototype,
/** @lends Iroha.DateSelect.prototype */
{
	/**
	 * 初期化
	 * @param {jQuery|Element[]|NodeList|String} nodes      年/月/日を選択するための <select> 要素（群）。最低でも <select> が 1 つ必要。
	 * @param {Iroha.DateSelect.Setting}         setting    動作設定オブジェクト
	 */
	init : function(nodes, setting) {
		this.$node   = $(nodes).filter('select').slice(0, 3);
		this.setting = $.extend(true, new Iroha.DateSelect.Setting, setting);
		
		if (!this.$node.length) {
			throw new ReferenceError('Iroha.DateSelect#init: 第1引数によって与えられる select 要素ノードは、最低でも 1 つ以上が存在しなければなりません。');
		} else {
			this.$node
				.addClass(this.setting.className.select)
				.find('.' + this.setting.className.placeholder)
					.data('iroha-dateselect-value', 0);
			
			// HTML ソースレベルでの初期選択状態 (select.value) を記憶しておく。
			var origValue = this.$node.map(function() { return $(this).val() });
			
			// 本来の選択可能範囲を記憶しておく。（参照切断しつつコピー）
			var origRange = {};
			$.each(this.setting.range, function(key, date) { origRange[key] = new Date(date) });

			// 選択肢を完全に構築させるために、一時的に 1/1 〜 12/31 までを選択可能とする（選択範囲の年はそのまま）。
			this.setting.range.from.setMonth( 0);
			this.setting.range.from.setDate ( 1);
			this.setting.range.end .setMonth(11);
			this.setting.range.end .setDate (31);
		
			// メニュー再構築
			this.fill();
			this.$node.prop('selectedIndex', 0);
			
			// HTML ソースレベルでの初期選択状態を復元
			this.$node.each(function(i) { $(this).val(origValue[i]) });
			
			// 本来の選択可能範囲を復帰させ、もういちど再構築して選択肢を絞る
			this.setting.range = origRange;
			this.fill();
			
			// イベント付与
			this.$node
				// メニューの「年」が操作されたら、「月」「日」のメニュー内容を再構築
				.eq(0)
					.change($.proxy(function(e) { this.fill('month').fill('date') }, this))
					.end()
				// メニューの「月」が操作されたら、「日」のメニュー内容を再構築
				.eq(1)
					.change($.proxy(function(e) { this.fill('date') }, this))
					.end()
				// 選択が変更されたことをコールバック
				.change($.proxy(function() { this.doCallback('change', this.get()) }, this))
		}
		
		return this;
	},

	/**
	 * 現在選択されている日付を得る
	 * @return 現在選択されている日付。1つ以上のメニューで placeholder 項目が選択状態の場合は undefined
	 * @type Date
	 */
	get : function() {
		var val  = $.proxy(this.val, this);
		var date = this.$node
		           	.map   (function() { return val(this) })
		           	.filter(function() { return this > 0  })
		           	.get();
		return (date.length != this.$node.length)
			 ? undefined
			 : new Date(date[0] || 0, (date[1] || 1) - 1, date[2] || 1);
	},

	/**
	 * 日付を指定してメニューの選択状態を変更する。
	 * 年/月/日を数値で指定する場合、 0 や undefined 等を与えた箇所は placeholder 項目が選択される。
	 * @param {Number|Date} [arg1]    年/月/日を数値で指定する場合の「年」、または選択したい日付のDateオブジェクト。
	 * @param {Number}      [arg2]    年/月/日を数値で指定する場合の「月」
	 * @param {Number}      [arg3]    年/月/日を数値で指定する場合の「日」
	 * @return このインスタンス自身。
	 * @type Iroha.DateSelect
	 */
	set : function(arg1, arg2, arg3) {
		var recent = this.get();
		var date;
		
		// ◆第1引数が Date オブジェクトであればそれを使用
		if ($.type(arg1) == 'date') {
			date = new Date(arg1);  // オブジェクト参照切断
		
		// ◆ それ以外
		} else {
			var menus = this.$node.length;
			
			// 引数(最大)3つ分からなる配列を作成。その配列要素すべてを 0 以上の数値に変換。
			date = Array.prototype.slice.call(arguments, 0, menus).map(function(num) { return Math.max(0, num) || 0 });
			
			// 配列要素の数値が 1 以上のものがメニュー数と同じであれば、Date オブジェクトを作る。
			var count = date.filter(function(num) { return num > 0 }).length;
			if (count == menus) {
				date = new Date(date[0] || 0, (date[1] || 1) - 1, date[2] || 1);
			}
		}
		
		// this.fill() で日のメニューを31日分すべてある状態へ再構築させるために。
		this.$node.prop('selectedIndex', 0);
		
		// 選択処理は生年月日メニューを完全に再構築してから行う。
		this.fill();
		
		// 選択処理
		switch ($.type(date)) {
			case 'date' :
				// 選択可能範囲内を出ないようにする
				var range = this.setting.range;
				    date  = [ range.from, range.end, date ].sort(function(a, b) { return a - b })[1];
				
				this.val(this.$node.eq(0), date.getFullYear() );
				this.val(this.$node.eq(1), date.getMonth() + 1);
				this.val(this.$node.eq(2), date.getDate()     );
				break;
			case 'array' : 
				this.val(this.$node.eq(0), date[0]);
				this.val(this.$node.eq(1), date[1]);
				this.val(this.$node.eq(2), date[2]);
				break;
		}
		
		//  選択可能範囲を再調整
		this.fill();
		
		// 日付の選択状態が変化していればコールバック
		(recent != this.get()) && this.doCallback('change', this.get());
		
		return this;
	},

	/**
	 * 年/月/日の選択メニューの中身を（再）構築。
	 * @param {String} [kind]    再構築するメニューを "year", "month", "date" で指定。無指定時は全メニュー再構築。
	 * @return このインスタンス自身。
	 * @type Iroha.DateSelect
	 * @private
	 */
	fill : function(kind) {
		var $select = this.$node;
		var setting = this.setting;
		var range   = setting.range;
		var format  = setting.format;
		var descend = setting.descend;
		
		switch(kind) {
			case 'year' :
				var from = range.from.getFullYear();
				var end  = range.end .getFullYear();
				this.fillMenu($select.eq(0), format.year, from, end, descend.year);
				break;

			case 'month' :
				var year = this.val($select.eq(0));
				var from = (year == range.from.getFullYear()) ? range.from.getMonth() + 1 :  1;
				var end  = (year == range.end .getFullYear()) ? range.end .getMonth() + 1 : 12;
				this.fillMenu($select.eq(1), format.month, from, end, descend.month);
				break;

			case 'date' :
				var year  = this.val($select.eq(0));
				var month = this.val($select.eq(1));
				var from  = (year == range.from.getFullYear() && month == range.from.getMonth() + 1) ? range.from.getDate() :  1;
				var end   = (year == range.end .getFullYear() && month == range.end .getMonth() + 1) ? range.end .getDate() : 31;
				
				//　現在選択されている年/月に存在しうる最後の日を探す
				if (year > 0 && month > 0) {
					var date;
					do { date = new Date(year, month - 1, end--) } while (month != date.getMonth() + 1);
					end++;
				}
				
				this.fillMenu($select.eq(2), format.date, from, end, descend.date);
				break;

			default :
				arguments.callee.call(this, 'year' );
				arguments.callee.call(this, 'month');
				arguments.callee.call(this, 'date' );
				break;
		}
		
		return this;
	},
	
	/**
	 * 指定の <select> 要素の内容を再構築
	 * @param {jQuery}          $select      select 要素
	 * @param {String|Function} format       select 要素内に構築する option 要素のフォーマッタ。HTML文字列テンプレート、または関数オブジェクト
	 * @param {Number}          from         選択できる値の範囲（開始値）
	 * @param {Number}          end          選択できる値の範囲（終了値)
	 * @param {Boolean}         [decsend]    true の場合、選択肢を降順で並べる（通常は昇順）
	 * @return このインスタンス自身。
	 * @type Iroha.DateSelect
	 * @private
	 */
	fillMenu : function($select, format, from, end, descend) {
		var dataKey = 'iroha-dateselect-value';
		var value   = this.val($select);
		var html    = $.type(format) == 'function'
		              	? format
		              	: function(i) { return Iroha.String(format).format(i).get() };

		// placeholder 項目以外の選択肢を消去
		$select.find('option:not(.' + this.setting.className.placeholder + ')').remove();
		
		// 選択肢を追加
		for (var i = from; i <= end; i++) {
			var $option = $(html(i))
			              	.data(dataKey, i)
			              	.addClass(this.setting.className.option);
			!descend ? $option.appendTo($select) : $option.prependTo($select);
		}
		// 降順の場合、 placeholder 項目が一番下に来ているので一番上にもってくる
		if (descend) {
			$select.find('.' + this.setting.className.placeholder).prependTo($select);
		}
		
		// append() した option を val() で選択しようとするとエラーになる IE6 対策。なぜ回避できるのか理由不明。
		$select.width();
		
		// 直前に選択していた項目か、それがなくなってしまっていれば一番末尾の項目を選択
		this.val($select, value == 0 ? 0 : Math.min(Math.max(value, from), end));
	},
	
	/**
	 * 指定の <select> 要素の選択値を得る、または指定の選択値を選択状態にする
	 * @param {jQuery} $select    select 要素。この引数のみを与えた場合は、現在の選択値(年/月/日の数字) を得る。(getter 動作)
	 * @param {Number} [value]    選択する値(年/月/日の数字)。選択肢を選択する場合はこの引数を与える。 (setter 動作)
	 * @return getter 動作の場合：現在の選択値(年/月/日の数字)。 setter 動作の場合：第1引数で与えた select 要素を保持する jQuery オブジェクト
	 * @type Number|jQuery
	 * @private
	 */
	val : function(select, value) {
		var $select = $(select).eq(0);
		var dataKey = 'iroha-dateselect-value';
		switch (arguments.length) {
			case 1 :
				return $select.find('option:selected').data(dataKey) || 0;
			case 2 : 
				return $select
					.prop('selectedIndex', 0)
					.find('option')
						.filter(function() { return $(this).data(dataKey) == value })
						.attr('selected', true);
		}
	}
});



/* -------------------- Class : Iroha.DateSelect.Setting -------------------- */
/**
 * @class {@link Iroha.DateSelect} 用の動作設定オブジェクト
 */
Iroha.DateSelect.Setting = function() {
	/**
	 * 選択可能な日付範囲。デフォルトはエポック基準日〜「今日」
	 *   - 'from' : {Date} 範囲の開始日
	 *   - 'end'  : {Date} 範囲の終了日
	 * @type Object
	 */
	this.range = {
		  'from' : (function() { var d = new Date; d.setFullYear(d.getFullYear() - 100); return d })()
		, 'end'  : new Date
	};

	/**
	 * 年/月/日それぞれの選択肢を動的再構成するときに用いるフォーマット。
	 * 文字列を指定した場合： "${0}" は年/月/日の数値で置換される。
	 * 関数を指定した場合　：　その関数の第1引数として年/月/日の数値が与えられるので、それを元に <option> 要素の HTML 文字列を生成し返却する。
	 *   - 'year'  : {Date|Function} フォーマット文字列または関数オブジェクト
	 *   - 'month' : {Date|Function} フォーマット文字列または関数オブジェクト
	 *   - 'date'  : {Date|Function} フォーマット文字列または関数オブジェクト
	 * @type Object
	 */
	this.format = {
		  'year'  : '<option value="${0}">${0}</option>'
		, 'month' : '<option value="${0}">${0}</option>'
		, 'date'  : '<option value="${0}">${0}</option>'
	};
	
	/**
	 * 年/月/日それぞれの選択肢の並び順を降順とするか。（通常は昇順）
	 *   - 'year'  : {Boolean} true の場合は降順、 false は昇順で並べる
	 *   - 'month' : {Boolean} true の場合は降順、 false は昇順で並べる
	 *   - 'date'  : {Boolean} true の場合は降順、 false は昇順で並べる
	 * @type Object
	 */
	this.descend = {
		  'year'  : false
		, 'month' : false
		, 'date'  : false
	};
	
	/**
	 * 関連要素ノードに付与される・付与しておくべき className の定義
	 *   - 'select'      : {String} DateSelect の日付選択用メニューの <select> 要素であることを示す
	 *   - 'option'      : {String} DateSelect の日付選択用メニューの <option> 要素であることを示す
	 *   - 'placeholder' : {String} DateSelect の日付選択用メニューの <option> 要素のうち、placeholder 項目であることを示す。
	 * @type Object
	 */
	this.className = {
		  'select'      : 'iroha-dateselect-select'
		, 'option'      : 'iroha-dateselect-option'
		, 'placeholder' : 'iroha-dateselect-placeholder'
	};
};

/**
 * 動作設定オブジェクトのインスタンスを得る
 * @type Iroha.DateSelect.Setting
 */
Iroha.DateSelect.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * @namespace {@link Iroha.DateSelect} に設定できるコールバック関数
 * @name Iroha.DateSelect.Callback
 */
/**
 * "change" : 選択値が変化したときのコールバック
 * @name Iroha.DateSelect.Callback.change
 * @function
 * @param {Date} date    選択された日付。1つ以上のメニューで placeholder 項目が選択状態の場合は undefined
 */



})(Iroha.jQuery);