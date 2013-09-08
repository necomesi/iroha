/*! "iroha.scroller.js" | Iroha.Scroller - Necomesi JS Library | by Necomesi Ltd. */
/* -------------------------------------------------------------------------- */
/** 
 *    @fileoverview
 *       Smooth Scroller
 *       (charset : "UTF-8")
 *
 *    @version 3.18.20130402
 *    @requires jquery.js
 *    @requires jquery.easing.js     (optional)
 *    @requires jquery.mousewheel.js (optional)
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($, window, document) {



/* -------------------- Class : Iroha.Scroller -------------------- */
/**
 * provide smooth scroll behavior to the scrollable block elements.
 * @class smooth scroller
 * @extends Iroha.Observable
 * @expample new Iroha.Scroller       (args) -> new instance
 *               Iroha.Scroller       (args) -> new instance
 *               Iroha.Scroller.create(args) -> new instance
 */
Iroha.Scroller = function() {
	var args = arguments;
	var self = args.callee;
	var suit = this instanceof self;
	if (!suit || args.length) return self.create.apply(self, args);
	
	/**
	 * element node to apply behavior
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * element node as "CSS Transform translate()" target.
	 * @type jQuery
	 * @private
	 */
	this.$stage = $();
	
	/** 
	 * X-distance from original destination of scrolling (px)
	 * @type Number
	 * @private
	 */
	this.offsetX = 0;
	
	/** 
	 * Y-distance from original destination of scrolling (px)
	 * @type Number
	 * @private
	 */
	this.offsetY = 0;
	
	/** 
	 * animation duration time (ms).
	 * @type Number
	 * @private
	 */
	this.duration = 1000;
	
	/** 
	 * easing function name existing in jQuery.easing
	 * @type String
	 * @private
	 */
	this.easing = 'swing';
	
	/** 
	 * an associative array { left, top } of last designated destination of scrolling.
	 * @type Object
	 * @private
	 */
	this.destination = { left : 0, top : 0 };
	
	/** 
	 * avaliability of "smart abort" feature; it can abort scrolling on mouse click, mouse wheel events.
	 * @type Boolean
	 */
	this.useSmartAbort = false;
	
	/** 
	 * [experimental] スクロール処理を CSS Transform の translate() で実現するモードかどうか
	 * @type Object
	 * @private
	 */
	this.cssTranslateMode = false;
	
	/** 
	 * [experimental] スクロール処理を CSS Transform の translate() で実現するモードで、スクロール完了後の実スクロール位置を調整しないモードかどうか
	 * @type Object
	 * @private
	 */
	this.cssTranslateNoRevise = false;
	
	/** 
	 * interval timer which handles scrolling animation (for page scrolling on mobile devices).
	 * @type Iroha.Interval
	 * @private
	 */
	this.animeTimer = new Iroha.Interval;
	
	/** 
	 * true if the scroller is currently running.
	 * @type Boolean
	 */
	this.busy = false;
};

Iroha.ViewClass(Iroha.Scroller).extend(Iroha.Observable);

$.extend(Iroha.Scroller.prototype,
/** @lends Iroha.Scroller.prototype */
{
	/**
	 * initialize.
	 * @param {Element|jQuery|String} node                  element to apply behavior
	 * @param {Number}                [offsetX=0]           X-distance from original destination of scrolling (px)
	 * @param {Number}                [offsetY=0]           Y-distance from original destination of scrolling (px)
	 * @param {Number}                [duration=1000]       animation duration (ms)
	 * @param {String}                [easing="swing"]      easing function name existing in jQuery.easing
	 * @param {Boolean}               [smartAbort=false]    avaliability of "smart abort" feature; it can abort scrolling on mouse click, mouse wheel events.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	init : function(node, offsetX, offsetY, duration, easing, smartAbort) {
		this.$node         = $(node).eq(0);
		this.offsetX       = Number(offsetX) || 0;
		this.offsetY       = Number(offsetY) || 0;
		this.duration      = (Number(duration) >= 0) ? Number(duration) : 1000;
		this.easing        = ($.easing[easing]) ? easing : 'swing';
		this.useSmartAbort = $.type(smartAbort) == 'boolean' ? smartAbort : false;
		
		var $node = (this.$node.is('html, body')) ? $(document) : this.$node;
		this.destination = this.scrollPos();
		
		// （ jquery.mousewheel.js が無く）.mousewheel() がない状況への考慮
		$node.mousewheel || ($node.mousewheel = $.noop);
		
		// "smart abort"。スクロール注に領域内のクリック、ホイール操作、タップ等されたら、スクロールを止める。
		// smartAbort = true の場合、スクロール領域内の任意要素のクリック等のイベントによりスクロールを
		// 発動させるなら、そのイベントのバブリングを停止 (event.stopPropagation()) しないとダメ。
		$node.on('click mousewheel touchstart', $.proxy(function() { this.useSmartAbort && this.abort() }, this));
		
		(this.$node.is('html') ? $(document.body) : this.$node)
			.addClass('iroha-scroller-enabled');
		
		return this;
	},
	
	/**
	 * scroll to the specified coordinate.
	 * @param {Number} x             X-coordinate of the scroll destination (px)
	 * @param {Number} y             Y-coordinate of the scroll destination (px)
	 * @param {Number} [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollTo : function(x, y, duration) {
		if (isNaN(x) || isNaN(y)) {
			throw new TypeError('Iroha.Scroller.scrollTo: all arguments must be numbers.');
		
		} else {
			this.abort();
			this.busy = true;
			
			var $node = this.$node.is('body') ? $(document.documentElement) : this.$node;
			var zoom  = 1;  // temporary, correct zoom ratio is needed for IE7...
			var trans = this.$stage.data('Iroha.Scroller.Translate.pos') || { left : 0, top : 0 };  // CSS Translate で動かしている場合、scrollWidth/scrollHeight が動かした分だけ減少するのを補う必要がある。
			var maxX  = Math.max(0, $node.prop('scrollWidth' ) - $node.prop('clientWidth' ) - trans.left);
			var maxY  = Math.max(0, $node.prop('scrollHeight') - $node.prop('clientHeight') - trans.top );
			duration  = (Number(duration) >= 0) ? Number(duration) : this.duration;
			
			var start = this.scrollPos();
			var end = {
				  left : Math.min(maxX, Math.max(0, Math.round((x + this.offsetX) * zoom)))
				, top  : Math.min(maxY, Math.max(0, Math.round((y + this.offsetY) * zoom)))
			};
			var options = {
				  duration : duration
				, easing   : this.easing
				, step     : $.proxy(this.step    , this)
				, complete : $.proxy(this.complete, this)
			};
			
			// スクロールの必要がまったくない場合。それでも完了コールバックをする。
			if (start.left == end.left && start.top == end.top) {
				options.complete();
			
			} else {
				this.destination = $.extend(null, end);  // 参照切断して格納。
				this.doCallbackByName('onStart');
				
				// ----- 以下、スクロールアニメ処理 -----
				
				// CSS transform, translate(3d), transition によりスクロール（しているかのように見せる）
				// GPU による加速が期待できるかわりに表示に不具合を起こしがち。スマホ、タブレットデバイス等向け。
				if (this.cssTranslateMode) {
					if (!this.cssTranslateNoRevise) {
						end.left -= start.left;
						end.top  -= start.top;
						start.left = 0;
						start.top  = 0;
					}
					
					this.translate(end.left, end.top, duration)
						.progress(function(name) { options.step()     })
						.done    (function()     { options.complete() });
				
				
				// 旧来の DOM メソッド使用のスクロール。
				// PC ブラウザであればこれで十分にパフォーマンスする。
				} else {
					// 一見、 jQuery.animate() を使えばいいように見えるが、あえてしていない。
					var $node    = this.$node;
					var timer    = new Iroha.Timer;
					var easing   = options.easing == 'linear'
						? function(x, t, b, c, d) { return b + c * t / d }
						: $.easing[options.easing];
					var scrollTo = (Iroha.ua.isiOS && this.$node.is('html, body'))
						? window.scrollTo
						: function(left, top) { $node.prop({ scrollLeft : left, scrollTop : top }) };
					
					// 実際にスクロールを駆動させている
					var animate = $.proxy(function() {
						var elapsed = timer.getTime();
						var left    = Math.round(easing(null, elapsed, start.left, end.left - start.left, duration));
						var top     = Math.round(easing(null, elapsed, start.top , end.top  - start.top , duration));
						
						scrollTo(left, top);
						options.step();
						
						if (duration <= elapsed) {
							scrollTo(end.left, end.top);
							options.complete();
						}
					}, this);
					
					// スクロール開始
					duration == 0
						? animate()
						: (this.animeTimer = new Iroha.Interval(animate, 16));
				}
			}
		}
		return this;
	},
	
	/**
	 * scroll by relative value.
	 * @param {Number} [x=0]         relative value to scroll on X-axis (px)
	 * @param {Number} [y=0]         relative value to scroll on Y-axis (px)
	 * @param {Number} [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollBy : function(x, y, duration) {
		this.abort();
		
		x = Number(x) || 0;
		y = Number(y) || 0;
		if (x || y) {
			var pos = this.scrollPos();
			this.scrollTo(pos.left + x, pos.top + y, duration);
		}
		return this;
	},
	
	/**
	 * scroll to the position of the specified element node.
	 * @param {Element|jQuery|String} node          an element as scroll destination
	 * @param {Number}                [duration]    animation duration (ms); if nonspecified, value of "this.duration" is used.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	scrollToNode : function(node, duration) {
		var $base = this.$node;
		var $node = $(node);
		
		if ($node.closest($base).length) {
			var basePos = $base.is('html, body') ? { left : 0, top : 0 } : $base.offset();
			var baseSrl = $base.is('html, body') ? { left : 0, top : 0 } : this.scrollPos();
			var nodePos = $node.offset();
			this.scrollTo(
				  nodePos.left + baseSrl.left - basePos.left
				, nodePos.top  + baseSrl.top  - basePos.top
				, duration
			);
		}
		return this;
	},
	
	/**
	 * get/set scroll positions;
	 * this works as getter when 0 arguments are given,
	 *   or works as setter when 2 arguments are given.
	 * @param {Number} [x]    (as setter) X-coordinate of the scroll destination (px)
	 * @param {Number} [y]    (as setter) Y-coordinate of the scroll destination (px)
	 * @return as getter : current scroll positions { left, top }
	 *         as setter : this instance
	 * @type Object|Iroha.Scroller
	 */
	scrollPos : function() {
		switch (arguments.length) {
			case 0  :
				var $node = this.$node;
				var pos   = this.$stage.data('Iroha.Scroller.Translate.pos') || { left : 0, top : 0 };
				return { left : $node.scrollLeft() - pos.left, top : $node.scrollTop() - pos.top };
			case 1  :
				throw new ReferenceError('Iroha.Scroller#scrollPos: 2 arguments are required in setter mode.');
			case 2  :
				var ignore = $.proxy(this.ignoreCallback, this);
				var names  = [ 'onStart', 'onScroll', 'onDone', 'onComplete' ];
				names.forEach(function(name) { ignore(name, 'all' ) });
				this.scrollTo(arguments[0], arguments[1], 0);
				names.forEach(function(name) { ignore(name, 'none') });
			default :
				return this;
		}
	},
	
	/**
	 * [experimental] スクロール処理を CSS Transform の translate() で実現するモードへ変更する。
	 * スクロール領域内のコンテンツすべてが乗った要素ノードの位置を translate() で動かし、あたかもスクロールしているかのように見せる。
	 * @param {jQuery|Element|String} [node]        translate() の適用対象ノード。スクロール領域内のコンテンツすべてを内包する要素。無指定時はそのような div 要素が生成される。
	 * @param {Boolean|String}        [norevise]    true または "norevise" のとき、スクロール領域の実スクロール位置を調整しない（translate による位置変更のみでスクロールを表現する）モードになる。
	 * @return このインスタンス自身
	 * @type Iroha.Scroller
	 */
	useCssTranslate : function(stage, norevise) {
		var $base    = (this.$node.is('html') ? $(document.body) : this.$node);
		var $stage   = $(stage).first();
		    norevise = $.type(norevise) == 'boolean' ? norevise : (norevise == 'norevise');
		
		// 適合ブラウザ（後述）に対して、必要な準備を行う。適合ブラウザと判別され次第これを実行。
		var prepare = $.proxy(function() {
			this.cssTranslateMode     = true;
			this.cssTranslateNoRevise = norevise;
			
			if (!$stage.length) {
				$stage = $(document.createElement('div'));
			}
			if (!$base.children('*').is($stage)) {
				$stage = $base.wrapInner($stage).children('*').first();
			}
			this.$stage = $stage;
			
			var cnpfx  = 'iroha-scroller-translate';
			$base .addClass(cnpfx + '-enabled');
			$stage.addClass(cnpfx + '-target' );
			
			// transform, transition 等のプロパティ初期値をあらかじめセットしておくことで、スクロール開始時のチラツキを抑える。
			// ただしこれ、 translate3d の悪影響がイキナリ発生するので、norevise のときだけに限定。ひとまず。
			norevise && this.translate(0, 0, 0, $stage);
		}, this);

		// CSS Translate と CSS Transition が両方使えるものを適合ブラウザとする。
		// 特定のブラウザについては指名により適合・不適合を決めつけ。
		var capable;
		var ua    = Iroha.ua;
		var IEver = ua.documentMode;
		(ua.isWebKit || ua.isGecko || ua.isIE && IEver >= 10) && (capable = true );
		(                             ua.isIE && IEver <=  0) && (capable = false);
		
		// 適合を指名されたブラウザ
		if (capable) {
			prepare();
		
		// 特定ブラウザ以外：適合かどうか、実際に translate と transition を動かして判定。
		} else if ($.type(capable) != 'boolean') {
			var $test  = $(document.createElement('ins')).css('position', 'absolute').appendTo(document.body);
			var before = $test.offset();
			
			this.translate(100, 100, 16, $test)
			
				// 500ms くらいのディレイが無いと判定にしくじる人がいる（ Android Browser とか…）
				.pipe(function() { return Iroha.delay(500) })  // deferred.pipe() は jQuery 1.8 で Deprecated とされてる…しかし…
//				.then(function() { return Iroha.delay(500) })  // deferred.then() の動きが 1.7 以前と 1.8 以降で違っている…。
				
				.done($.proxy(function() {
					var after   = $test.offset();
					var capable = Math.abs(before.left - after.left) + Math.abs(before.top - after.top) > 0;
					capable && prepare();
					$test.remove();
				}, this));
		}
		
		// 適合・非適合ブラウザ関係なく、
		// 実スクロール位置の補正をしないモードの指定なら、スクロール領域の基底要素ノードは overflow:hidden にしておく。
		norevise && $base.css('overflow', 'hidden');
		
		return this;
	},
	
	/**
	 * [experimental] CSS Tranform の translate() を用いて、対象要素ノードの表示位置を移動する。
	 * @param {Number}                [x=0]     移動距離 (X軸)。通常の translate() とは方向が逆。
	 * @param {Number}                [y=0]     移動距離 (Y軸)。通常の translate() とは方向が逆。
	 * @param {Number}                [d=0]     トランジション時間。ミリ秒で指定。
	 * @param {jQuery|Element|String} [node]    translate() の対象要素ノード。無指定時はスクロール領域の wrapper 要素。
	 * @return jQuery.Deferred.Promise オブジェクト
	 * @type jQuery.Deferred.Promise
	 * @private
	 */
	translate : function(x, y, d, node) {
		var dfd = $.Deferred();
		var ns  = 'Iroha.Scroller.Translate';
		
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
		
		x = (Number(x) || 0) * -1;
		y = (Number(y) || 0) * -1;
		d = Math.max(0, d) || 0;
		f = (function(easing) {
			easing = Iroha.String(easing);
			     if (easing.startsWith('easeInOut')) return 'ease-in-out';
			else if (easing.startsWith('easeIn'   )) return 'ease-in';
			else if (easing.startsWith('easeOut'  )) return 'ease-out';
			else if (easing.isMatch   ('linear'   )) return 'linear';
			else                                     return 'ease';
		})(this.easing);
		
		var $node      = node ? $(node).first() : this.$stage;
		var transform  = 'translate3d(${x}px, ${y}px, 0px)';
		var transition = '${pfx}transform ${d}s ${f} 0s';
		var params     = { x : x, y : y, d : d / 1000, f : f };
		var origin     = $node.offset();
		
		// 既存のタイマーを停止
		clearInterval($node.data(ns + '.interval'));
		clearTimeout ($node.data(ns + '.timeout' ));
		
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
			$node.data(ns + '.pos', { left : x, top : y });
			dfd.notify();
			dfd.resolve();
		
		// そうでなければふつうに TransitionEnd を検出して完了をコールバック
		} else {
			// 途中経過を等間隔でコールバックしつづけるインターバルタイマー。
			// translate による表示位置の移動量を、純粋な引き算で検出しつつ
			// data 属性に保持。これを {@link #scrollPos} メソッドが利用する。
			var interval = setInterval(function() {
				var pos = $node.offset();
				$node.data(ns + '.pos', { left : Math.round(pos.left - origin.left), top : Math.round(pos.top - origin.top) });
				dfd.notify();
			}, 16);
			
			// TransitionEnd が所要時間内に終わらない場合があるのを考慮。
			// 時間が来たら強制的に発火。
			var timeout  = setTimeout (function() {
				$node.trigger(transend.split(' ')[0])
			}, d);
			
			// 上記のタイマーを保持して走らせつつ、TransitionEnd を待つ。
			$node
				.data(ns + '.interval', interval)
				.data(ns + '.timeout' , timeout )
				
				// {@link #abort} したときにイベントが unbind されず残って、不具合を起こすのを回避。
				.unbind(transend)
				
				// transition 完了（または強制発火）により完了コールバック
				.bind(transend, function() {
					$node.unbind(transend).data(ns + '.pos', { left : x, top : y });
					clearInterval(interval);
					clearTimeout(timeout  );
					dfd.resolve();
				});
		}
		
		return dfd.promise();
	},
	
	/**
	 * callback func for scrolling
	 * @private
	 */
	step : function() {
		this.doCallbackByName('onScroll');
	},
	
	/**
	 * callback func for completed scrolling
	 * @private
	 */
	complete : function() {
		if (this.busy) {
			this.postProcess();
			this.doCallbackByName('onComplete');
		}
	},
	
	/**
	 * abort scrolling.
	 * @return this instance
	 * @type Iroha.Scroller
	 */
	abort : function() {
		if (this.busy) {
			// CSS transform, translate(3d), transition により
			// 擬似的にスクロールさせているのを中断するために、transition プロパティを消す。
			this.cssTranslateMode && this.$stage.css('transition', '');
			
			this.postProcess();
			this.doCallbackByName('onAbort');
		}
		return this;
	},
	
	/**
	 * post process for end of scrolling.
	 * @return this instance
	 * @type Iroha.Scroller
	 * @private
	 */
	postProcess : function () {
		this.busy = false;
		this.$node.stop();
		this.animeTimer.clear();
		
		// CSS transform, translate(3d), transition により擬似的にスクロールさせていたなら
		// translate で動かした分を実際のスクロール量に置き換え、translate は無かったことにして
		// つじつまを合わせる。
		if (this.cssTranslateMode && !this.cssTranslateNoRevise) {
			var pos = this.scrollPos();
			this.$stage
				.removeData('Iroha.Scroller.Translate.pos')
				.css({
					  'transition'          : ''
					, 'transform'           : ''
					, 'backface-visibility' : ''
					, 'perspective'         : ''
				});
			this.$node
				.prop({
					  'scrollLeft' : pos.left
					, 'scrollTop'  : pos.top
				});
		}
		
		this.doCallbackByName('onDone');
		return this;
	},
	
	/**
	 * get status or, set enabled/disabled status of "smart abort" feature.
	 * @param {Boolean} [bool]    set enable/disable of the feature. if nonspecified, this method works as a getter.
	 * @return this instance or current status of the feature as boolean
	 * @type Iroha.Scroller|Boolean
	 */
	smartAbort : function(bool) {
		if (arguments.length == 0) {
			return this.useSmartAbort;
		} else {
			this.useSmartAbort = Boolean(bool);
			return this;
		}
	},
	
	/**
	 * process callback.
	 * @param {String} name    callback name (preferred to start with 'on')
	 * @return this instance
	 * @type BAJL.Scroller
	 * @private
	 */
	doCallbackByName : function(name) {
		var pos  = this.scrollPos();
		var dest = this.destination;
		this.doCallback(name, pos.left, pos.top, dest.left, dest.top);
		return this;
	}
});



/* ============================== Static class : Iroha.PageScroller ============================== */
/**
 * ページスクローラー。古式ゆかしい、ページ内リンクのクリックでびよーんとスクロールするアレ、ほぼ専用。
 * {@link #create} あるいは {@link #init} で得られるのは、設定初期値をページスクロール専用に調整し、
 * コールバックに若干の拡張を施した状態の、 {@link Iroha.Scroller} を継承したシングルインスタンス。
 * @namespace page scroller
 * @type Iroha.Scroller
 */
Iroha.PageScroller = {
	/**
	 * ページスクローラーを生成（初期化）して返す。
	 * このメソッドは {@link #init} のエイリアス。
	 * @param {Iroha.PageScroller.Setting} [setting]    設定用オブジェクト
	 * @return ページスクローラー
	 * @type Iroha.PageScroller
	 */
	create : function() {
		return this.init.apply(this, arguments);
	},
	
	/**
	 * ページスクローラーを生成（初期化）して返す。
	 * @param {Iroha.PageScroller.Setting} [setting]    設定用オブジェクト
	 * @return ページスクローラー
	 * @type Iroha.PageScroller
	 */
	init : function(setting) {
		if (Iroha.alreadyApplied(arguments.callee)) return this;
		
		var settings   = $.extend(Iroha.PageScroller.Setting.create(), setting);
		
		var pageNode   = Iroha.ua.isWebKit || Iroha.ua.isQuirksMode ? document.body : document.documentElement;
		var scroller   = Iroha.Scroller.create(pageNode, settings.offsetX, settings.offsetY, settings.duration, settings.easing, settings.smartAbort);
		var lastAnchor = null;
		
		$(document.body).addClass('iroha-pagescroller-enabled');
		
		// add event
		$(document).on('click', 'a, area', function(e) {
			var $anchor = $(this).filter(function() {
				var ignore = $(this).is(settings.ignore);
				var target = $(this).attr('target');
				return (!ignore && (!target || target == '_self'));
			});
			var $target = $anchor.Iroha_getLinkTarget();
			if ($target.length) {
				e.preventDefault();
				e.stopPropagation();
				$anchor.blur();
				scroller.scrollToNode($target);
				lastAnchor = $anchor.get(0);
			}
		});
	
		// add callbacks
		var callback = function(func, delFlag) {
			return function(x, y) {
				if (typeof func == 'function') func(x, y, lastAnchor);
				if (delFlag) lastAnchor = null;
			}
		};
		scroller.addCallback('onStart'   , callback(settings.onStart   , false));
		scroller.addCallback('onScroll'  , callback(settings.onScroll  , false));
		scroller.addCallback('onAbort'   , callback(settings.onAbort   , true ));
		scroller.addCallback('onComplete', callback(settings.onComplete, true ));
		scroller.addCallback('onDone'    , callback(settings.onDone    , true ));
		
		// replace Iroha.PageScroller with Iroha.Scroller instance.
		scroller.create = function() { return scroller };
		scroller.init   = function() { return scroller };
		scroller.stop   = function() { new Iroha.Timeout(scroller.abort, 1, scroller); return scroller };
		return (Iroha.PageScroller = scroller);
	},
	
	// 以下、Iroha.PageScroller.init() が呼び出されるまでの間、
	// Iroha.Scroller.prototype の非 private なメソッドがいきなり呼ばれても大丈夫なようにしておく。
	// 表層上存在しているだけであり本来の返値を返さないから、返値のある前提で処理を続行されると当然エラーになる。
	// Iroha.PageScroller.init() が呼びだされれた後、Iroha.PageScroller は Iroha.Scroller の
	// いちインスタンスとなるため、ふつうに本来のあるべきメソッドがあるべき処理内容で備わる事になる。
	scrollTo        : $.noop,
	scrollBy        : $.noop,
	scrollToNode    : $.noop,
	scrollPos       : $.noop,
	useCssTranslate : $.noop,
	abort           : $.noop,
	smartAbort      : $.noop
};



/* -------------------- Class : Iroha.PageScroller.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PageScroller}
 * @class setting data object for {@link Iroha.PageScroller}
 */
Iroha.PageScroller.Setting = function() {
	/** 
	 * X-distance from original destination of scrolling (px)
	 * @type Number
	 */
	this.offsetX = 0;
	
	/** 
	 * Y-distance from original destination of scrolling (px)
	 * @type Number
	 */
	this.offsetY = 0;
	
	/** 
	 * animation duration (ms)
	 * @type Number
	 */
	this.duration = 1000;
	
	/** 
	 * easing function name existing in jQuery.easing
	 * @name String
	 */
	this.easing = 'easeInOutCubic';
	
	/** 
	 * avaliability of "smart abort" feature.
	 * @type Boolean
	 */
	this.smartAbort = true;
	
	/** 
	 * a jQuery object, an element node, a node list of elements, an array of element nodes, or an expression,
	 * to specify an clicked element which doesn't start scrolling.
	 * @type jQuery|Element|Element[]|NodeList|String
	 */
	this.ignore = '.iroha-pagescroller-ignore';
	
	/** 
	 * a callback for when scrolling starts
	 * @type Function
	 */
	this.onStart = function(x, y, lastAnchor) { };
	
	/** 
	 * a callback for during scrolling continues
	 * @type Function
	 */
	this.onScroll = function(x, y, lastAnchor) { };
	
	/** 
	 * a callback for when scrolling is aborted
	 * @type Function
	 */
	this.onAbort = function(x, y, lastAnchor) { };
	
	/** 
	 * a callback for when scrolling is completed
	 * @type Function
	 */
	this.onComplete = function(x, y, lastAnchor) {
		var ua = Iroha.ua;
		if (lastAnchor && !ua.isMobile && (ua.isGecko || ua.isIE || (ua.isWebKit && ua.version > 522))) {
			location.href = lastAnchor.href;
		}
	};
	
	/** 
	 * a callback for when scrolling is completed, or aborted
	 * @type Function
	 */
	this.onDone = function(x, y, lastAnchor) { };
};

/**
 * create an instance and return.
 * @type Iroha.PageScroller.Setting
 */
Iroha.PageScroller.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.Scroller}
 * @name Iroha.Scroller.callback
 * @namespace callback functions for {@link Iroha.Scroller}
 */
/**
 * a callback for when scrolling starts
 * @name Iroha.Scroller.callback.onStart
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for during scrolling continues
 * @name Iroha.Scroller.callback.onScroll
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for when scrolling is aborted
 * @name Iroha.Scroller.callback.onAbort
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for when scrolling is completed
 * @name Iroha.Scroller.callback.onComplete
 * @function
 * @param {Number} curX     current scroll position (X-coordinate) (px)
 * @param {Number} curY     current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */
/**
 * a callback for when scrolling is completed or aborted
 * @name Iroha.Scroller.callback.onDone
 * @function
 * @param {Number}  curX    current scroll position (X-coordinate) (px)
 * @param {Number}  curY    current scroll position (Y-coordinate) (px)
 * @param {Number} destX    last designated destination (X-coordinate) (px)
 * @param {Number} destY    last designated destination (Y-coordinate) (px)
 */

/**
 * callback functions for {@link Iroha.PageScroller}
 * @name Iroha.PageScroller.callback
 * @namespace callback functions for {@link Iroha.PageScroller}
 */
/**
 * a callback for when scrolling starts
 * @name Iroha.PageScroller.callback.onStart
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for during scrolling continues
 * @name Iroha.PageScroller.callback.onScroll
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is aborted
 * @name Iroha.PageScroller.callback.onAbort
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is completed
 * @name Iroha.PageScroller.callback.onComplete
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */
/**
 * a callback for when scrolling is completed or aborted
 * @name Iroha.PageScroller.callback.onDone
 * @function
 * @param {Number}  curX          current scroll position (X-coordinate) (px)
 * @param {Number}  curY          current scroll position (Y-coordinate) (px)
 * @param {Element} lastAnchor    an anchor element which is clicked recently
 */



})(Iroha.jQuery, window, document);