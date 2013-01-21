/* -------------------------------------------------------------------------- */
/** 
 *    @fileoverview
 *       flatten heights of the element nodes.
 *       (charset : "UTF-8")
 *
 *    @version 3.0.20120419
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.fontSizeObserver.js (optional)
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- jQuery.fn : Iroha_FlatHeights -------------------- */
/**
 * Iroha.FlatHeights の jQuery plugin 形式。
 * @exports $.fn.Iroha_FlatHeights as jQuery.fn.Iroha_FlatHeights
 * @param {Number} [unit]    要素ノード群をこの数ごとにグループ化（分割）して高さ揃えの対象にする
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_FlatHeights = function(unit) {
	var unit   = (unit > 0) ? unit : this.size();
	var blocks = this.get();
	while (blocks.length) {
		Iroha.FlatHeights.create(blocks.splice(0, unit));
	}
	return this;
}



/* -------------------- Class : Iroha.FlatHeights -------------------- */

/**
 * @class 要素ノード群の高さを自動的に揃える。
 */
Iroha.FlatHeights = function() {
	/**
	 * 高さを揃える対象の要素ノード群
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * 現在の高さ (px)
	 * @type Number
	 * @private
	 */
	this.height = 0;
};

Iroha.ViewClass(Iroha.FlatHeights);

$.extend(Iroha.FlatHeights,
/** @lends Iroha.FlatHeights */
{
	/**
	 * すべての Iroha.FlatHeights インスタンスの処理対象要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-flatheights-target',
	
	/**
	 * すべての既存インスタンスの高さ揃えを実行する
	 * @return このクラスオブジェクト自身
	 * @type Iroha.FlatHeights
	 */
	processAll : function() {
		this.instances.forEach(function(_) { _.process() });
	}
});

$.extend(Iroha.FlatHeights.prototype, {
	/**
	 * 初期化
	 * @param {jQuery|NodeList|Element[]|Element|String} nodes    高さを揃える対象の要素ノード群
	 * @return このインスタンス自身
	 * @type Iroha.FlatHeights
	 * @constructs
	 */
	init : function(nodes) {
		this.$node = $(nodes);
		this.height = 0;
		
		this.$node.addClass(this.constructor.BASE_CLASSNAME);
		this.process();
		
		if (Iroha.FontSizeObserver) {
			Iroha.FontSizeObserver
				.init()
				.addCallback('onChange', this.process, this);
		}
		
		// しばらく間、高さを揃え続ける (Webkit対策)
		var height = 0;
		var timer  = new Iroha.Interval(function() {
			this.process();
			if (height == this.height) {
				timer.clear();
			} else {
				height = this.height;
			}
		}, 100, this);
	
		// それを1秒でやめる。
		new Iroha.Timeout(timer.clear, 1000, timer);
		
		return this;
	},
	
	/**
	 * 対象要素ノード群の高さを揃える。
	 * @return このインスタンス自身
	 * @type Iroha.FlatHeights
	 */
	process : function() {
		this.setHeight(this.getHeight(true));
		return this;
	},
	
	/**
	 * 現在の高さ、または対象要素ノード群の高さのうち最大のものを返す
	 * @param {Boolean} recalibrate    true の場合は、一旦高さをそろえない状態に戻してから高さを得る。
	 * @return または対象要素ノード群の現在の高さ ( px 値）
	 * @type Number
	 */
	getHeight : function(recalibrate) {
		if (!recalibrate) {
			return this.height;
		} else {
			var height = this.$node.css ('height', 'auto')
							 .map (function()     { return this.offsetHeight })
							 .sort(function(a, b) { return b - a             })
							 .get(0) || 0;
			this.setHeight(height);
			return height;
		}
	},
	
	/**
	 * 対象要素ノード群の高さを指定値に変更する。
	 * @param {Number} height    高さ (border-box height)。 0 の指定は height:auto を意味する。
	 * @return このインスタンス自身
	 * @type Iroha.FlatHeights
	 */ 
	setHeight : function(height) {
		height = Math.max(height, 0) || 0;
		this.$node.each(function() {
			var $node   = $(this).css('height', (height == 0) ? 'auto' : height + 'px');
			var current = $node.outerHeight();
			var revise  = 2 * height - current;
	
			if (current != height && revise >= 0) {
				$node.css('height', revise + 'px');
			}
		});
		this.height = height;
		return this;
	}
});



})(Iroha.jQuery);