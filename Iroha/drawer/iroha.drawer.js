/*! "iroha.drawer.js" | Iroha - Necomesi JSLib : Drawer Panel | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Drawer Panel
 *       (charset : "UTF-8")
 *
 *    @version 3.10.20130930
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* ============================== Class : Iroha.Drawer ============================== */
/**
 * @class ドロワーパネル。上下からスライドして出てくる。
 * @extend Iroha.Observable
 * @expample new Iroha.ShredMenu       (args) -> new instance
 *               Iroha.ShredMenu       (args) -> new instance
 *               Iroha.ShredMenu.create(args) -> new instance
 */
Iroha.Drawer = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);

	/**
	 * 動作設定オブジェクト
	 * @type Econavi.Odoroki.Button.Setting
	 */
	this.setting = Iroha.Drawer.Setting.create();

	/**
	 * 基底要素ノード
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * ドロワー内部のスクロール可能なエリア
	 * @type jQuery
	 * @private
	 */
	this.$scroll = $();

	/**
	 * パネルが開閉動作中かどうか
	 * @type Boolean
	 */
	this.isMoving = false;

	/**
	 * パネルが開かれた状態かどうか。
	 * @type Boolean
	 */
	this.isOpened = false;

	/**
	 * ブラウザが古いアンドロイドの標準ブラウザかどうか
	 * @type Boolean
	 * @private
	 */
	this.isUnkoroidBrowser = false;
};

Iroha.ViewClass(Iroha.Drawer)/*.extend(Iroha.Observable)*/;  // Iroha.Observable を extend するとウンコロイドで constructor を参照できなくなる…

$.extend(Iroha.Drawer,
/** @lends Iroha.Drawer */
{
	/**
	 * 各インスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-drawer',
});

$.extend(Iroha.Drawer.prototype,
/** @lends Iroha.Drawer */
{
	/**
	 * 初期化
	 * @param {jQuery|Element|String} node       基底要素ノード
	 * @param {Iroha.Drawer.Setting}  setting    設定オブジェクト
	 * @return このインスタンス自身
	 * @type Iroha.Drawer
	 */
	init : function(node, setting) {
		var baseCN = this.constructor.BASE_CLASSNAME;

		this.setting = $.extend(this.setting, setting);
		this.$node   = $(node).first().addClass(baseCN);
		this.$scroll = this.$node.find('.' + baseCN + '-scrollarea');

		// // 閉じるボタンのイベント付与。
		this.$node.on('click', '.' + baseCN + '-close', $.proxy(function(e) {
			e.preventDefault();
			this.close();
		}, this));

		// 2.x なんかの滅びた方がいいレベルの古いバージョンのウンコロイドを判別
		this.isUnkoroidBrowser = Iroha.ua.isAndroidBrowser && Iroha.ua.mbVersion < 4;

		// ウンコじゃないなら
		if (!this.isUnkoroidBrowser) {

			// スワイプスクロールの影響をスクロール領域内に完全に押し込める
			Iroha.trapWheelEvent(this.$scroll);

			// ドロワーが開いている間、基底要素ノード以外の touchmove を無効化（危険…）
			$(document).on('touchmove', $.proxy(function(e) {
				!this.isOpened || $(e.target).closest(this.$node).length || e.preventDefault();
			}, this));

			// ウインドウリサイズ検出 (orientationChange 検出も兼ねる)
			$(window).on('resize', $.proxy(this.adjustHeight, this));

		}

		return this;
	},

	/**
	 * ページ高さ調整
	 * @return このインスタンス自身
	 * @type Iroha.Drawer
	 * @private
	 */
	adjustHeight : function() {
		// ウンコじゃないなら
		if (!this.isUnkoroidBrowser) {
			$(document.body)
				.css('height'  , !this.isOpened ? 'auto'    : this.$node.outerHeight())
				.css('overflow', !this.isOpened ? 'visible' : 'hidden' );
		}
		return this;
	},

	/**
	 * 開く。
	 * @return このインスタンス自身
	 * @type Iroha.Drawer
	 */
	open : function() {
		var baseCN = this.constructor.BASE_CLASSNAME;

		if (!this.isOpened) {
			this.isOpened = true;
			this.$node.show();

			// 古いウンコロイドはアニメーション効果なし
			if (this.isUnkoroidBrowser) {
				window.scrollTo(0, 1);
				_postproc.call(this);

			} else {
				this.$scroll.scrollTop(0);
				this.adjustHeight();
				this.$node.addClass(baseCN + '-moving');
				window.scrollTo(0, 1);

				var srt = Math.max(this.$node.outerHeight(), this.$scroll.outerHeight()) * (this.setting.mode == 'ceil' ? -1 : +1);
				var end = 0;
	 			var dur = this.setting.duration;
				var fnc = this.setting.easing;

				this.translate(0, srt,   0, fnc);
				this.translate(0, end, dur, fnc).done($.proxy(_postproc, this));
			}
		}

		return this;

		/**
		 * 完了時処理
		 * @inner
		 */
		function _postproc() {
			$(document.body)
				.addClass   (baseCN + '-opened');
			this.$node
				.removeClass(baseCN + '-moving')
				.addClass   (baseCN + '-opened');
//			this.doCallback('open', this);
		}
	},

	/**
	 * 閉じる。
	 * @return このインスタンス自身
	 * @type Iroha.Drawer
	 */
	close : function() {
		var baseCN = this.constructor.BASE_CLASSNAME;

		$(document.body)
			.removeClass(baseCN + '-opened');
		this.$node
			.removeClass(baseCN + '-opened')
			.addClass   (baseCN + '-moving');

		if (this.isOpened) {
			// 古いウンコロイドはアニメーション効果なし
			if (this.isUnkoroidBrowser) {
				_postproc.call(this);

			} else {
				var stop = this.$scroll.scrollTop();
				var srt  = -stop;  // '-moving' 等の className の付与により動いた見かけのスクロール位置を補正
				var end  = Math.max(this.$node.outerHeight(), this.$scroll.outerHeight()) * (this.setting.mode == 'ceil' ? -1 : +1);
				var dur  = this.setting.duration;
				var fnc  = this.setting.easing;

				this.translate(0, srt,   0, fnc);
				this.translate(0, end, dur, fnc)
					.done($.proxy(_postproc, this));
			}
		}

		/**
		 * 完了時処理
		 * @inner
		 */
		function _postproc() {
			this.isOpened = false;
			this.$node.hide().removeClass(baseCN + '-moving');
			this.adjustHeight();
//			this.doCallback('close', this);
			window.scrollTo(0, 1);
		}

		return this;
	},

	/**
	 * 開閉状態を切り替える
	 * @param {Boolean} [bool]    真偽値を与えた場合は開閉状態の明示指定。 true で開き、 false なら閉じる。
	 * @return このインスタンス自身
	 * @type Iroha.Drawer
	 */
	toggle : function(bool) {
		return ($.type(bool) == 'boolean' ? bool : !this.isOpened)
			? this.open()
			: this.close()
	},

	/**
	 * CSS Tranform の translate() を用いて、基底要素ノードの表示位置を移動させる。
	 * @param {Number} [x=0]         移動距離 (X軸)。
	 * @param {Number} [y=0]         移動距離 (Y軸)。
	 * @param {Number} [d=0]         トランジション時間。ミリ秒で指定。
	 * @param {Number} [f="ease"]    イージング関数名。transition-timing-function に指定できるもの。
	 * @return jQuery.Deferred.Promise オブジェクト
	 * @type jQuery.Deferred.Promise
	 * @private
	 */
	translate : function(x, y, d, f) {
		var dfd = $.Deferred();
		var ns  = 'Iroha.Drawer.Translate';

		// ベンダープレフィクスの適合を探して格納
		var prefix = arguments.callee.__prefix__;
		if (!prefix) {
			var prefix = [];
			var ua     = Iroha.ua;
			ua.isWebKit && prefix.push('-webkit-');
			ua.isGecko  && prefix.push('-moz-'   );
			ua.isIE     && prefix.push('-ms-'    );
			ua.isOpera  && prefix.push('-o-'     );
			               prefix.push(''        );
			arguments.callee.__prefix__ = prefix;
		}

		// transitionend イベント名にベンダープレフィクスと、名前空間文字列を付与したものを作成。
		var transend = arguments.callee.__transend__;
		if (!transend) {
			transend = 'TransitionEnd';
			transend = prefix.map(function(pfx) {
				pfx = pfx.replace(/-/g, '');
				return (pfx ? pfx + transend : transend.toLowerCase()) + '.' + ns;
			}).join(' ');
			arguments.callee.__transend__ = transend;
		}

		x = Number(x) || 0;
		y = Number(y) || 0;
		d = Math.max(0, d) || 0;
		f = f || 'ease';

		var $node      = this.$node;
		var transform  = 'translate3d(${x}px, ${y}px, 0px)';
		var transition = '${pfx}transform ${d}s ${f} 0s';
		var params     = { x : x, y : y, d : d / 1000, f : f };
		var origin     = $node.offset();

		// 既存のタイマーを停止
		clearTimeout($node.data(ns + '.timeout' ));

		// 疑似スクロールアニメーション発動開始
		prefix.forEach(function(pfx) {
			$.extend(params, { pfx : pfx });
			$node.css({
				  'transition'          : Iroha.String(transition).format(params).get()
				, 'transform'           : Iroha.String(transform ).format(params).get()
				, 'backface-visibility' : 'hidden'
				, 'perspective'         : 1000
			});
		});

		// 所要時間 0 の指定なら即座に完了をコールバック
		if (d == 0) {
			dfd.resolve();

		// そうでなければふつうに TransitionEnd を検出して完了をコールバック
		} else {
			// TransitionEnd が所要時間内に終わらない場合があるのを考慮。時間が来たら強制的に発火。
			var timeout = setTimeout(function() { $node.trigger(transend.split(' ')[0]) }, d);

			// 上記のタイマーを保持して走らせつつ、TransitionEnd を待つ。
			$node
				.data(ns + '.timeout', timeout)
				.bind(transend, function() {
					$node.unbind(transend);
					prefix.forEach(function(pfx) {
						$node.css({
							  'transition'          : ''
							, 'transform'           : ''
							, 'backface-visibility' : ''
							, 'perspective'         : ''
						});
					});
					clearTimeout(timeout);
					dfd.resolve();
				});
		}

		return dfd.promise();
	}
});



/* -------------------- Class : Iroha.Drawer.Setting -------------------- */
/**
 * @class {@link Iroha.Drawer} の動作設定オブジェクト
 */
Iroha.Drawer.Setting = function() {
	/**
	 * 動作モード。 "ceil":上から垂れ下がる, "floor":下からせりあがる
	 * @type String
	 */
	this.mode = 'ceil';

	/**
	 * 開閉アニメの所要時間 (ms)
	 * @type Number
	 */
	this.duration = 500;

	/**
	 * イージング関数名。transition-timing-function に指定できるもの。
	 * @type String
	 */
	this.easing = 'ease';
};

/**
 * 動作設定オブジェクトインスタンスを生成
 * @type Iroha.Drawer.Setting
 */
Iroha.Drawer.Setting.create = function() { return new this };



})(Iroha.$, Iroha, window, document);