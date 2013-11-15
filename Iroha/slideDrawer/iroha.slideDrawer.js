/*! "iroha.slideDrawer.js" | Iroha - Necomesi JSLib : Side-by-side Slidable Drawer | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Iroha - Necomesi JSLib : Side-by-side Slidable Drawer
 *       (charset : "UTF-8")
 *
 *    @version 3.30.20131016
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.touchable.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {




/* ============================== Class : Iroha.SlideDrawer ============================== */
/**
 * @class 左右にスライドしてサブペインをひきだす UI
 * @extends Iroha.Observable
 */
Iroha.SlideDrawer = function() {
	/**
	 * 基底要素ノード。本文ペインや左右のサブペインを直接内包する。
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * 本文ペインの要素ノード。
	 * @type jQuery
	 */
	this.$mainPane = $();

	/**
	 * 左側サブペインの要素ノード
	 * @type jQuery
	 */
	this.$leftPane = $();

	/**
	 * 左側サブペインの要素ノード
	 * @type jQuery
	 */
	this.$rightPane = $();

	/**
	 * サブペインを開閉させるボタンの要素ノード群
	 * @type jQuery
	 * @private
	 */
	this.$buttons = $();

	/**
	 * 左右にスライドしたときに画面上に残す本文ペインの幅
	 * @type Number
	 * @private
	 */
	this.mainPaneOffset = 0;

	/**
	 * その時々の viewport の幅
	 * @type Number
	 * @private
	 */
	this.viewPortWidth = 0;

	/**
	 * 任意のサブペインが表示されているとき true
	 * @type Boolean
	 */
	this.isOpened = false;

	/**
	 * ウインドウリサイズ（あるいは Orientation 変更（回転））が発生したときのリセットを無効にするかどうか。true で無効。
	 * @type Boolean
	 * @private
	 */
	this.isLocked = false;
};

Iroha.ViewClass(Iroha.SlideDrawer).extend(Iroha.Observable);

$.extend(Iroha.SlideDrawer,
/** @lends Iroha.SlideDrawer */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'baseNode'     : 基底要素ノードであることを示す
	 *   - 'mainPane'     : 本文ペインの要素ノードであることを示す
	 *   - 'subPane'      : サブペインの要素ノードであることを示す
	 *   - 'selectedPane' : 選択（表示）状態にあるペインの要素ノードであることを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'baseNode'     : 'iroha-slidedrawer'
		, 'mainPane'     : 'iroha-slidedrawer-mainpane'
		, 'subPane'      : 'iroha-slidedrawer-subpane'
		, 'selectedPane' : 'iroha-slidedrawer-subpane-selected'
	},

	/**
	 * 頻出の data 名
	 * @type Object
	 * @cnonsant
	 */
	DATANAME : {
		  'scrollTop' : 'Iroha.SlideDrawer.scrollTop'
	},

	/**
	 * インスタンス生成、または既存インスタンスを返す。
	 * 第1引数を省略した場合、基底要素ノードは body 要素とみなされる。
	 * @param {jQuery|Element|String} [node=document.body]    基底要素ノード。本文ペインや左右のサブペインを直接内包する。
	 * @param {Number}                [offset=0]              左右にスライドしたときに画面上に残す本文ペインの幅。非負整数。
	 * @return 新規インスタンスまたは既存インスタンス
	 * @type Iroha.SlideDrawer
	 */
	create : function(node, offset) {
		var node = node || document.body;
		return this.getInstance(node) || this.add(node, offset);
	}
});

$.extend(Iroha.SlideDrawer.prototype,
/** @lends Iroha.SlideDrawer.prototype */
{
	/**
	 * 初期化。
	 * @param {jQuery|Element|String} node          基底要素ノード。本文ペインや左右のサブペインを直接内包する。
	 * @param {Number}                [offset=0]    左右にスライドしたときに画面上に残す本文ペインの幅。非負整数。
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 */
	init : function(node, offset) {
		this.$node          = $(node).eq(0).addClass(this.constructor.CLASSNAME.baseNode);
		this.mainPaneOffset = Math.max(offset, 0) || 0;
		this.viewPortWidth  = Iroha.getGeometry().windowW;

		// ウインドウリサイズされたらレイアウト再計算
		// スマホのタテヨコ回転の際もこれで代用。
		$(window).resize(Iroha.barrageShield(this.onResize, 100, this));

		return this;
	},

	/**
	 * viewport サイズが変化したときのイベントハンドラ
	 * @param {Event} e    イベントオブジェクト
	 * @private
	 * @event
	 */
	onResize : function(e) {
		var width = Iroha.getGeometry().windowW;
		if (this.viewPortWidth != width) {
			this.viewPortWidth = width;
			this.adjust();
		}
	},

	/**
	 * 左右にスライドしたときに画面上に残す本文ペインの幅を得る、または変更する。
	 * @param {Number} [offset]    無指定時は現在の値を得る。指定時はこの値へ変更する。
	 * @return 引数無指定時は現在の値、指定時はこのインスタンス自身
	 * @type Number|Iroha.SlideDrawer
	 */
	offset : function(offset) {
		switch (arguments.length) {
			case 0 :
				return this.mainPaneOffset;
			case 1 :
				this.mainPaneOffset = Math.max(0, offset) || 0;
				return this.adjust();
		}
	},

	/**
	 * 本文ペイン・サブペインを追加する
	 * @param {String}                kind        本文ペイン ("main") か、左側サブペイン ("left") か、右側サブペイン ("right") か。
	 * @param {jQuery|Element|String} pane        本文ペイン・サブペインとするブロックの要素ノード
	 * @param {jQuery|Element|String} [button]    サブペインの場合、それを開閉するボタンになる要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 */
	addPane : function(kind, pane, button) {
		var $pane   = $(pane  ).eq(0);
		var $button = $(button).eq(0);
		var cnames  = this.constructor.CLASSNAME;
		var dnames  = this.constructor.DATANAME;
		var $oldPane;

		switch(kind) {
			case 'main'  : $oldPane = this.$mainPane ; break;
			case 'left'  : $oldPane = this.$leftPane ; break;
			case 'right' : $oldPane = this.$rightPane; break;
		}

		if (!$oldPane) {
			throw new Error('Iroha.SlideDrawer#addPane: 引数 "kind" は "main", "left", "right" のいずれかでなければなりません。');

		} else {
			// 既存の要素ノードがあったら、ひとまず無関係とする
			$oldPane.removeClass(cnames.mainPane).removeClass(cnames.subPane);

			// 追加対象ペインの親要素がこのインスタンスの基底要素でなければ、移動させて基底要素の子要素にする
			if (!$pane.parent().is(this.$node)) {
				$pane.appendTo(this.$node);
			}

			// 所定の className を与える
			$pane.addClass(kind == 'main' ? cnames.mainPane : cnames.subPane);

			// スクロール位置の記憶場所を初期化
			$pane.data(dnames.scrollTop, 1);  // 0 じゃなくて 1 なのは、アドレスバーの出現を抑止するため。

			// ボタン押下でサブペインを開閉する
			if ($button.length && this.$buttons.index($button) == -1) {
				this.$buttons = this.$buttons.add($button);
				$button.on('click', $.proxy(function(e) { e.preventDefault(); this.toggle($pane) }, this));
			}

			// 本文ペイン開閉処理関連
			if (kind == 'main') {
				$pane.touchable().bind('click touchstart touchend touch.flick', $.proxy(function(e) {
					var ns   = e.namespace;
					var type = e.type + (ns ? '.' + ns : '');
					switch(type) {
						// サブペインが開いているとき、本文ペインのクリック／タップでサブペインを閉じる
						case 'click' :
							this.isOpened && this.close() && e.preventDefault();
							break;

						// サブペインが開いているとき、本文ペインのタッチイベントを無効にする（リンク飛ぶとかスクロールとか）
						case 'touchstart' :
							this.isOpened && e.preventDefault();
							break;

						// サブペインが開いているとき、開閉ボタンがタップされたら、ちゃんと閉じるようにする
						// （touchstart にてタッチイベントがキャンセルされてるので）
						case 'touchend'   :
							this.isOpened && $(e.target).closest(this.$buttons).length && this.close();
							break;

						// 本文ペインの左右フリックでサブペインを開閉する
						case 'touch.flick' :
							var dir = arguments[1];

							// 即時実施すると変になるからアドホックにディレイかける
							Iroha.delay(16, this).done(function() {
								var $shown = this.getShownPane();
								var $left  = this.$leftPane;
								var $right = this.$rightPane;
								var opened = this.isOpened;

								switch (dir) {
									case TouchSession.DIR_LEFT :
										e.preventDefault();
//										!opened ? this.open($right) : $left.is($shown) && this.close();  // <textarea> 内のフリックも反応する等の誤動作の除外が面倒
										opened && $left.is($shown) && this.close();
										break;
									case TouchSession.DIR_RIGHT :
										e.preventDefault();
//										!opened ? this.open($left ) : $right.is($shown) && this.close();  // <textarea> 内のフリックも反応する等の誤動作の除外が面倒
										opened && $right.is($shown) && this.close();
										break;
								}
							});
							break;
					}
				}, this));
			}

			// インスタンスプロパティに再投入
			switch(kind) {
				case 'main'  : this.$mainPane  = $pane; break;
				case 'left'  : this.$leftPane  = $pane; break;
				case 'right' : this.$rightPane = $pane; break;
			}

			// 初期位置を計算
			this.adjust();
		}

		return this;
	},

	/**
	 * 本文ペイン・サブペインの要素ノード群を得る。
	 * @param {jQuery|Element|String|Function|} [filter]    要素ノード群をフィルタする条件
	 * @return 本文ペイン・サブペインの要素ノード群
	 * @type jQuery
	 * @private
	 */
	getAllPanes : function(filter) {
		return $()
			.add(this.$mainPane )
			.add(this.$leftPane )
			.add(this.$rightPane)
				.filter(filter || '*');
	},

	/**
	 * 現在開いている（表示している）ペインの要素ノードを得る。
	 * @return 要素ノード。左右サブペインのどちらかが開かれていればそれ、どちらも閉じているなら本文ペインのそれ。
	 * @type jQuery
	 */
	getShownPane : function() {
		var $selectedSubPane = this.getAllPanes('.' + this.constructor.CLASSNAME.selectedPane);
		return $selectedSubPane.length ? $selectedSubPane : this.$mainPane;
	},

	/**
	 * 各ペインの幅と位置を再計算
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 * @private
	 */
	adjust : function() {
		var geom   = Iroha.getGeometry();
		var width  = geom.windowW;
		var offset = this.mainPaneOffset;
		var cnames = this.constructor.CLASSNAME;

		this.$leftPane .css({ 'width' : width - offset, 'margin-right' : 'auto' });
		this.$rightPane.css({ 'width' : width - offset, 'margin-left'  : 'auto' });

		// 左右サブパネルが開いた状態だったらもういちど開く処理を実施して位置調整
		this.isOpened && this.open(this.getShownPane());

		return this;
	},

	/**
	 * 指定のサブペインを表示する
	 * @param {jQuery|Element|String} pane    見えるようにするサブペインの要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 */
	open : function(pane) {
		var $base     = this.$node;
		var $main     = this.$mainPane;
		var cnames    = this.constructor.CLASSNAME;
		var dnames    = this.constructor.DATANAME;
		var $pane     = $(pane).eq(0);
		var $subPanes = this.getAllPanes('.' + cnames.subPane);

		if (this.isLocked || !$pane.is($subPanes)) return this;
		this.isLocked  = true;

		var geom      = Iroha.getGeometry();
		var width     = geom.windowW;
		var height    = geom.windowH;
		var scrollTop = geom.scrollY;
		var offset    = this.mainPaneOffset;
		var factor    = $pane.is(this.$rightPane) ? -1 : 1;
		var eventNS   = 'Iroha.SlideDrawer.toggle';
		var isShitUA  = Iroha.ua.isAndroidBrowser;

		this.doCallback('openStart', $pane, this);

		// 本文ペインの縦スクロール位置を記憶
		// ただし本文ペインが位置固定されたままなら記憶しない。
		if ($main.css('position') != 'fixed') {
			$main.data(dnames.scrollTop, scrollTop);
		}

		// 本文ペイン・サブペインを同時に固定するとページ高が失われる。
		// それによりアドレスバーが出てくる環境があるが、それを避ける。
		$base.css('min-height', height);

		// 本文ペイン固定＆スライド移動開始（左右へ掃ける）
		var left = factor * (width - offset);
		$main.css({
			  'position'  : 'fixed'
			, 'top'       : -1 * $main.data(dnames.scrollTop)
			, 'transform' : isShitUA ? 'none' : 'translate3d(' + left + 'px,0,0)'
			, 'left'      : isShitUA ? left   : 'auto'
		});

		// サブペイン固定
		$pane.css({
			  'position' : 'fixed'
			, 'top'      : -1 * $pane.data(dnames.scrollTop)
			, 'left'     : $pane.is(this.$leftPane ) ? 0 : 'auto'
			, 'right'    : $pane.is(this.$rightPane) ? 0 : 'auto'
		});

		// サブペインに可視になったことを示す className 付与
		$pane.addClass(cnames.selectedPane);

		var transitionEnd = this.addEventNamespace('transitionend webkitTransitionEnd', eventNS);
		var touchStart    = this.addEventNamespace('touchstart mousemove'             , eventNS);

		$main
			.unbind(transitionEnd)
			.unbind(touchStart   )

			// 本文ペインのスライド移動完了したら
			.bind(transitionEnd, $.proxy(function(e) {
				$main.unbind(transitionEnd);

				// サブペインをタッチしたら
				$pane.bind(touchStart, $.proxy(function(e) {
					$pane.unbind(touchStart);

					// サブペイン固定解除
					$pane.css({
						  'position'  : 'relative'
						, 'top'       : 'auto'
						, 'left'      : 'auto'
						, 'right'     : 'auto'
					});

					// ページ高をリセット
					$base.css('min-height', 0);

					// サブペインの縦スクロール位置を復元
					window.scrollTo(0, $pane.data(dnames.scrollTop));
				}, this));

				// 後処理
				this.isOpened = true;
				this.isLocked = false;
				this.doCallback('openComplete', $pane, this);
			}, this));

		return this;
	},

	/**
	 * サブペインを隠して本文ペインだけ見えるようにする。
	 * その際、 Viewport 幅を参照し、本文ペインとサブペインの位置と幅をリセットする。
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 */
	close : function() {
		if (this.isLocked) return this;
		this.isLocked  = true;

		var $base     = this.$node;
		var $main     = this.$mainPane;
		var cnames    = this.constructor.CLASSNAME;
		var dnames    = this.constructor.DATANAME;
		var $pane     = this.getAllPanes('.' + cnames.selectedPane);
		var geom      = Iroha.getGeometry();
		var height    = geom.windowH;
		var scrollTop = geom.scrollY;
		var eventNS   = 'Iroha.SlideDrawer.toggle';
		var isShitUA  = Iroha.ua.isAndroidBrowser;

		this.doCallback('closeStart', $pane, this);

		// サブペインのスクロール位置を記憶
		// ただしサブペインが位置固定されたままなら記憶しない。
		if ($pane.css('position') != 'fixed') {
			$pane.data(dnames.scrollTop, scrollTop);
		}

		// 本文ペイン・サブペインを同時に固定するとページ高が失われる。
		// それによりアドレスバーが出てくる環境があるが、それを避ける。
		$base.css('min-height', height);

		// サブペイン固定
		$pane.css({
			  'position' : 'fixed'
			, 'top'      : -1 * $pane.data(dnames.scrollTop)
			, 'left'     : $pane.is(this.$leftPane ) ? 0 : 'auto'
			, 'right'    : $pane.is(this.$rightPane) ? 0 : 'auto'
		});

		// 本文ペインのスライド移動開始（元位置へ戻る）
		$main.css({
			  'transform' : isShitUA ? 'none' : 'translate3d(0,0,0)'
			, 'left'      : 0
		})

		var transitionEnd = this.addEventNamespace('transitionend webkitTransitionEnd', eventNS);
		var touchStart    = this.addEventNamespace('touchstart mousemove'             , eventNS);

		$main
			.unbind(transitionEnd)
			.unbind(touchStart   )

			// 本文ペインのスライド移動完了したら
			.bind(transitionEnd, $.proxy(function(e) {
				$main.unbind(transitionEnd);

				// サブペインを不可視にするため className 削除
				$pane.removeClass(cnames.selectedPane);

				// 本文ペインをタッチしたら
				$main.bind(touchStart, $.proxy(function(e) {
					$main.unbind(touchStart);

					// 本文ペイン固定解除
					$main.css({
						  'position' : 'relative'
						, 'top'      : 'auto'
					});

					// サブペイン固定解除
					$pane.removeClass(cnames.selectedPane)
					$pane.css({
						  'position'  : 'relative'
						, 'top'       : 'auto'
						, 'left'      : 'auto'
						, 'right'     : 'auto'
					});

					// ページ高をリセット
					$base.css('min-height', 0);

					// 本文ペインの縦スクロール位置を復元
					window.scrollTo(0, $main.data(dnames.scrollTop));
				}, this));

				// 後処理
				this.isOpened = false;
				this.isLocked = false;
				this.doCallback('closeComplete', $pane, this);
			}, this));

		return true;
	},

	/**
	 * サブペインが見えている時はそれを隠し、見えていない時にサブペンの要素ノードを与えられたらそれを表示する。
	 * @param {jQuery|Element|String} pane    見えるようにするサブペインの要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.SlideDrawer
	 */
	toggle : function(pane) {
		return this.isOpened ? this.close() : this.open(pane);
	},

	/**
	 * プリミティブなイベントタイプに名前空間的な接尾辞をつけたものを返す。 jQuery().bind() 系メソッド用。
	 * @param {String} eventTypes    プリミティブなイベントタイプ名。空白文字区切りの文字列。
	 * @return 与えられたイベントタイプ名に名前空間的な接尾辞をつけたもの。空白文字区切りの文字列。
	 * @type String
	 */
	addEventNamespace : function(eventTypes, suffix) {
		return $.makeArray(eventTypes.replace(/\s+/g, ' ').split(' ')).map(function(type) { return type + '.' + suffix }).join(' ');
	}
});



})(Iroha.$, Iroha, window, document);