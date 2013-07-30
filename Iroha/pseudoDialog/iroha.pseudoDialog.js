/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Pseudo Dialog.
 *       (charset : "UTF-8")
 *
 *    @version 3.07.20130730
 *    @requires jquery.js
 *    @requires jquery.easing.js
 *    @requires jquery.mousewheel.js
 *    @requires iroha.js
 *    @requires iroha.balloon.js
 *    @requires iroha.fontSizeObserver.js    (optional)
 *    @requires iroha.keyEquiv.js            (optional)
 *    @requires iroha.throbber.js            (optional)
 *    @requires iroha.pseudoDialogContent.js (in content frame page)
 *    @requires iroha.pseudoDialog.css
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- AutoSetup : Iroha.PseudoDialog -------------------- */
//
// この由緒正しいレガシーコード、あとでなんとかしたい
//
//$(function() {
//	$('a, area').live('click', function(e) {
//		var $opener = $(this).filter(autoSetup.anchorExpr);
//
//		if ($opener.size()) {
//			e.preventDefault();
//
//			// aware of a behavior of Iroha.PageScroller.
//			if (Iroha.PageScroller) {
//				Iroha.PageScroller.abort();
//				$opener.focus().addClass(Iroha.getValue('Iroha.settings.PageScroller.ignore'));
//			}
//
//			var pdialog = Iroha.Singleton(Iroha.PseudoDialog);
//			if (!pdialog.isActive()) {
//				var $source = $opener.Iroha_getLinkTarget($opener.attr('target'));
//
//				if ($source.size()) {
//					pdialog.update($source.contents()).open();
//				} else {
//					pdialog.openURL($opener.attr('href'));
//				}
//
//				pdialog.setCloseCallback(function() {
//					$opener.focus();
//					$source.append(pdialog.getContent());
//				});
//			}
//		}
//	});
//});



/* --------------- Class : Iroha.PseudoDialog --------------- */
/**
 * @class pseudo dialog
 * @extends Iroha.Balloon
 * */
Iroha.PseudoDialog = function() {
	/**
	 * 設定オブジェクト
	 * @type Iroha.PseudoDialog.Setting
	 * @private
	 */
	this.setting      = {};
	/** dialog content frame controller.
	    @type Iroha.PseudoDialogCotentFrame */
	this.contentFrame = null;
	/** confirm button (OK button) node.
	    @type jQuery
	    @private */
	this.$confirmBtn  = $();
	/** close button (CANCEL button) node.
	    @type jQuery
	    @private */
	this.$closeBtn    = $();
	/** an assciative array {'click', 'focus', 'scroll'} of the 'shield' instances.
		@type Object
	    @private */
	this.shields      = {};
	/** flag for prevent close function of the dialog.
		@type Boolean
	    @private */
	this.closeAllowed = true;
	/** processing information display.
	    @type Iroha.Throbber
	    @private */
	this.throbber     = null;
};

Iroha.ViewClass(Iroha.PseudoDialog).extend(Iroha.Balloon);

$.extend(Iroha.PseudoDialog,
/** @lends Iroha.PseudoDialog */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-pdialog',

	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {Iroha.PseudoDialog.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : Iroha.Balloon.create
});

$.extend(Iroha.PseudoDialog.prototype,
/** @lends Iroha.PseudoDialog.prototype */
{
	/** @private */
	initSuper : Iroha.Balloon.prototype.init,

	/**
	 * 初期化。
	 * @param {Iroha.PseudoDialog.Setting} [setting]    設定オブジェクト
	 * @return このインスタンス自身
	 * @type Iroha.PseudoDialog
	 */
	init : function(setting) {
		var setting = this.setting = $.extend(Iroha.PseudoDialog.Setting.create(), setting);

		// replacing iframe's src attribute value to "initial URL"
		if (/(<iframe[^>]*>.*?<\/iframe>)/.test(setting.template)) {
			var iframe  = RegExp.$1;
			var $iframe = $(iframe);
			var $tmp    = $(document.createElement('ins')).append($iframe);
			$iframe.attr('src', setting.contentFrame.initial || 'about:blank');
			setting.template = setting.template.replace(iframe, $tmp.html());
		}

		// initialize.
		this.initSuper(setting);
		this.moveTo(-10000, -10000);

		// set events.
		$(window)
			.resize($.proxy(function() { if (this.active) this.moveToCenter() }, this));
		this.$node
			.on('click', setting.confirmBtnExpr, $.proxy(function(e) {
				e.preventDefault();
				if (!$(e.currentTarget).hasClass('pseudo-disabled')) {
					this.close(true);
				}
			}, this))
			.on('click', setting.closeBtnExpr, $.proxy(function(e) {
				e.preventDefault();
				if (!$(e.currentTarget).hasClass('pseudo-disabled')) {
					this.close();
				}
			}, this));

		// prepare content frame.
		this.contentFrame = Iroha.PDContentFrame.create(setting.contentFrame);
		this.contentFrame.addCallback('onLoadTimeout'   , function() { this.allowClose(); this.close(    ); }, this);
		this.contentFrame.addCallback('onConfirmed'     , function() { this.allowClose(); this.close(true); }, this);
		this.contentFrame.addCallback('onCloseRequested', function() { this.allowClose(); this.close(    ); }, this);

		// set key equivalents.
		if (Iroha.KeyEquiv) {
			// this is an attitude that "ESC" key is an shortcut key of the close button(s)
			Iroha.KeyEquiv.create().addKey('!', function() {
				if (this.$closeBtn.length) {
					this.close();
				}
			}, this);
		}

		// create throbber
		if (Iroha.Throbber && setting.throbber && !$.isEmptyObject(setting.throbber)) {
			this.throbber = Iroha.Throbber.create(setting.throbber);
		}

		// observe font size changing.
		if (Iroha.FontSizeObserver) {
			Iroha.FontSizeObserver.addCallback('onChange', function() {
				if (this.contentFrame.hasContent()) {
					this.contentFrame.adjustSize();
				}
				this.adjustSize();
			}, this);
		};

		// register shields.
		if (setting.useShield.click ) this.shields.click  = Iroha.ClickShield   .create(setting.clickShield);
		if (setting.useShield.focus ) this.shields.focus  = Iroha.TabFocusShield.create(this.$node);
		if (setting.useShield.scroll) this.shields.scroll = Iroha.ScrollShield  .create(this.$node);

		// event handling of the shields.
		if (this.shields.click) {
			this.addCallback('onResize', this.shields.click.adjustSize, this.shields.click);
			if (setting.allowEasyClose) {
				this.shields.click.addCallback('onPrevented', this.close, this);
			}
		}
		if (this.shields.focus) {
			this.shields.focus.addCallback('onPrevented', this.setDefaultFocus, this);
		}
		if (this.shields.scroll) {
		}

		// z-index 制御。
		// この疑似ダイアログとそのクリックシールドが、既存の疑似ダイアログとそのクリックシールドの上に乗るように。
		var zIndex = this.constructor.getInstance()
		             	.map (function(instance) { return instance.zIndex() })
		             	.sort(function(a, b)     { return b - a })
		             	[0] || this.zIndex() - 2;
		this.zIndex(zIndex + 2);
		this.shields.click && this.shields.click.zIndex(zIndex + 1);

		return this;
	},

	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		try { this.$node.remove()           } catch(err) {}
		try { this.shields.click .dispose() } catch(err) {}
		try { this.shields.focus .dispose() } catch(err) {}
		try { this.shields.scroll.dispose() } catch(err) {}
		this.constructor.disposeInstance(this);
	},

	/**
	 * update dialog content.
	 * @param {NodeList|Element|Element[]|jQuery|String} content    content for dialog content.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	update : function(content) {
		return this.setContent(content).adjustSize();
	},

	/**
	 * open the dialog.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	open : function() {
		if (!this.active) {
			// set dialog status by current type of content to be shown.
			var url    = this.contentFrame.url.replace(this.contentFrame.initial, '');
			var cname  = this.setting.srcKindCName;
			var imgPtn = /\.(jpe?g|gif|png)$/i;
			this.addClass(imgPtn.test(url) ? cname.externalImage : url ? cname.externalPage : cname.fragment);

			// hide processing info display.
			this.throbber && this.throbber.hide();

			// pre process for open dialog
			this.disallowClose().show().moveToCenter();
			this.$node.stop().hide();
			if (!this.contentFrame.hasContent()) {
				// in the case of the dialog shows contents in the same page.
				if (this.shields.click) {
					this.shields.click.addCallback('onEnabled', _show, this, 'disposable');
				} else {
					_show.call(this);
				}
			} else {
				// in the case of the dialog shows contents in the iframe.
				_show.call(this);
			}
			this.enableShield();
		}
		return this;

		// show dialog with slideDown effect
		function _show() {
			var duration = this.setting.effect.duration;
			var callback = $.proxy(_postProcess, this);
			this.moveToCenter();
//			this.$node.slideDown(duration, callback);
			this.$node
				.show()
				.css    ({ marginTop : -20, opacity : 0 })
				.animate({ marginTop :   0, opacity : 1 }, duration, $.easing.def, callback);
		}

		function _postProcess() {
			this
				.allowClose()
				.setDefaultFocus()
				.doCallbackByName('onOpen');
		}
	},

	/**
	 * open specified url in the dialog.
	 * @param {String} url    url to load
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	openURL : function(url) {
		if (typeof url != 'string') {
			throw new URIError('Iroha.PseudoDialog.openURL: first argument must be a string (URL).');
		} else {
			this.disallowClose();
			this.enableShield();
			this.throbber && this.throbber.show();

			this.contentFrame.addCallback('onLoaded', function() {
				this.allowClose();
				this.update();
				this.open();
			}, this, 'disposable');

			var loading = this.setting.loading;
			new Iroha.Timeout(function() { this.contentFrame.load(url, loading.timeout) }, loading.startDelay, this);

			return this;
		}
	},

	/**
	 * close the dialog.
	 * @param {Boolean} confirmed    close with confirming or not
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	close : function(confirmed) {
		if (this.closeAllowed) {
			// close() 処理中に再び close() が呼び出されると都合が悪いことがある。
			// (onClose でこのインスタンスを dispose() する場合など）
			this.disallowClose();

			// openURL() で URL を読み込んだとき、それが開かれるより前に close() が呼び出された場合を考慮。
			this.removeDisposableCallback('onLoaded');

			this.throbber && this.throbber.hide();

			if (!this.active) {   // in the case of loading timeout of pseudo dialog content
//				this.disableShield();
				_hide.call(this);
			} else {
				var duration = this.setting.effect.duration;
				var callback = $.proxy(_hide, this);
//				this.$node.slideUp(duration, callback);
				this.$node
					.animate({ marginTop : 20, opacity : 0 }, duration, $.easing.def, callback);
			}
		}
		return this;

		function _hide() {
			this.hide();
			this.moveTo(-10000, -10000);
			this.resizeTo(0, 0);
			this.contentFrame.unload();
			if (this.shields.click) {
				this.shields.click.addCallback('onDisabled', _postProcess, this, 'disposable');
			} else {
				_postProcess.call(this);
			}
			this.disableShield();
		}

		function _postProcess() {
			$.each(this.setting.srcKindCName, $.proxy(function(i, cn) { this.removeClass(cn) }, this));

			// close() が呼び出されたら一時的に disallowClose() していたので。
			// ここまで処理が到達したということは元々 close は allowed だったわけであり。
			this.allowClose();

			if (confirmed) {
				this.doCallbackByName('onConfirmed');
			} else {
				this.removeDisposableCallback('onConfirmed');
			}
			this.doCallbackByName('onClose');
		}
	},

	/**
	 * set callback function for 'onClose' as disposable callback.
	 * @param {Function} func             callback function/method
	 * @param {Object}   [aThisObject]    object that will be a global object ('this') in func
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 * @deprecated
	 */
	setCloseCallback : function(func, aThisObject) {
		this.removeDisposableCallback('onClose');
		this.addCallback('onClose', func, aThisObject, 'disposable');
		return this;
	},

	/**
	 * enable close function
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	allowClose : function() {
		this.closeAllowed = true;
		this.$node.removeClass(this.setting.closeDisallowedCName);
		return this;
	},

	/**
	 * disable close function.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	disallowClose : function() {
		this.closeAllowed = false;
		this.$node.addClass(this.setting.closeDisallowedCName);
		return this;
	},

	/**
	 * enable all shields.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 * @private
	 */
	enableShield : function() {
		var shields = this.shields;

		if (shields.scroll) shields.scroll.enable();
		if (shields.click ) shields.click .enable();
		if (shields.focus ) {
			shields.focus.enable();
			Iroha.TabFocusShield.disableAll(shields.focus);  // 他のタブシールドインスタンスを一時的に無効にする
		}

		return this;
	},

	/**
	 * disalbe all shields.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 * @private
	 */
	disableShield : function() {
		var shields = this.shields;

		if (shields.click) {
			if (shields.scroll) {
				shields.click.addCallback('onDisabled', function() { shields.scroll.disable() }, this, 'disposable');
			}
			shields.click .disable();
		} else if (shields.scroll) {
			shields.scroll.disable();
		}

		if (shields.focus) {
			shields.focus.disable();
			Iroha.TabFocusShield.blessRecent();  // 他のタブシールドインスタンスの動作を復帰させる
		}

		return this;
	},

	/**
	 * adjust dialog size.
	 * @return this instance itself
	 * @type Iroha.PseudoDialog
	 */
	adjustSize : function() {
//		if (this.templateNode && this.active) {
//			var geom = this.getGeometry();
//			this.resizeTo(0, 0); // set width and height to 'auto'
//			var width  = this.templateNode.offsetWidth;
//			var height = this.templateNode.offsetHeight;
//			this.resizeTo(geom.width, geom.height);
//			if (!this.effect) {
//				this.resizeTo(width, height);
//				this.moveToCenter();
//			} else {
//				this.effect.open();
//			}
//		}
		// @@@@@@@@@@@@@ TODO : temporary @@@@@@@@@@@@@@@@@@
		this.moveToCenter(this.ignoreX, this.ignoreY);

		return this;
	},

	/**
	 * ダイアログの内の所定の要素ノードにフォーカスを当てる。
	 * @param {String} [expr]    フォーカスを当てる対象を（このあと恒久的に）変更する場合に指定。
	 *                           "" or "none" : フォーカスしない, "auto" : 自動選択, "<セレクタ表現>" : セレクタ表現（基底要素ノード起点）で指定。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoDialog
	 */
	setDefaultFocus : function(expr) {
		var setting = this.setting;

		($.type(expr) != 'string')
			? (expr = 'auto')
			: (setting.autoFocusExpr = expr);

		if (this.active) {
			expr = setting.autoFocusExpr;
			switch (expr) {
				case ''     :
				case 'none' :
					break;

				case 'auto' :
					var $input      = this.$node.find('input:text').eq(0);
					var $closeBtn   = this.$node.find(setting.closeBtnExpr  );
					var $confirmBtn = this.$node.find(setting.confirmBtnExpr);
					var $anchor     = $closeBtn.add($confirmBtn).find('a').addBack().filter('a').eq(0);
					$input .focus();
					$anchor.focus();
					break;

				default :
					this.$node.find(expr).focus();
					break;
			}

			this.contentFrame.setDefaultFocus(expr);
		}
		return this;
	}
});



/* --------------- Class : Iroha.PDContentFrame --------------- */
/**
 * @class pseudo dialog content frame
 * @extends Iroha.Observable
 * */
Iroha.PDContentFrame = function() {
	/** iframe element node.
		@type jQuery
	    @private */
	this.$node     = $();
	/** iframe (window) object.
		@type Window
	    @private */
	this.frame     = null;
	/** url of the page currently loaded in the iframe
	    @type String */
	this.url       = '';
	/** initial url of the iframe
	    @type String */
	this.initial   = '';
	/** max width of the frame
	    @type Number */
	this.maxWidth  = 950;
	/** max height of the frame
	    @type Number */
	this.maxHeight = 700;
	/** iframe loading timeout timer.
		@type Iroha.Timeout
	    @private */
	this.timer     = null;
	/** an Image, or an instance of 'dialog content object' (created in pseudoDialogContent.js in the iframe)
		@type Image|Iroha.PseudoDialogContent
	    @private */
	this.content   = null;
	/** flag for prevent dialog from opening without intending.
		@type Boolean
	    @private */
	this.allowOpen = false;
};

Iroha.ViewClass(Iroha.PDContentFrame).extend(Iroha.Observable);

$.extend(Iroha.PDContentFrame,
/** @lends Iroha.PDContentFrame */
{
	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードたる iframe 要素ノードは init() で自動的に設定される。
	 * 通常、第1引数には設定オブジェクト {@link Iroha.PDContentFrame.Setting} を与える。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とするインスタンスを探す。
	 * @param {Iroha.PDContentFrame.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : function(arg) {
		if ($(arg).eq(0).prop('nodeType') != 1) {
			return this.storeInstance((new this).init(arg));
		} else {
			return this.getInstance(arg);
		}
	}
});

$.extend(Iroha.PDContentFrame.prototype,
/** @lends Iroha.PDContentFrame.prototype */
{
	/**
	 * 初期化
	 * @param {Iroha.PDContentFrame.Setting} setting    設定オブジェクト
	 * @return this instance
	 * @type Iroha.PDContentFrame
	 */
	init : function(setting) {
		var setting    = $.extend(Iroha.PDContentFrame.Setting.create(), setting);
		this.$node     = $('iframe[name="' + setting.name + '"]');
		this.frame     = window.frames[setting.name];
		this.url       =
		this.initial   = setting.initial || 'about:blank';
		this.maxWidth  = setting.maxWidth;
		this.maxHeight = setting.maxHeight;

		// Iroha.PDContentFrame インスタンスは Iroha.PseudoDialog インスタンスの数だけ同時に複数存在しうる。
		// そのため Iroha.PseudoDialogContent インスタンスが自分を送り込む先の見分けのために
		// GUID 的な name 属性値が iframe には必要。
		// この name 値を Iroha.PseudoDialogContent インスタンス側では window.name として得られる。
		this.frame.name += '-' + Iroha.String.guid().get();
		this.$node.attr('name', this.frame.name);

		this.unload();

		return this;
	},

	/**
	 * このインスタンスが保持している iframe の name 属性値を得る
	 * @return iframe の name 属性値
	 * @type String
	 */
	getName : function() {
		return this.frame.name;
	},

	/**
	 * show the iframe
	 */
	show : function() {
		this.$node.css({ position : 'static', top : '0px', left : '0px' });
		this.adjustSize();
	},

	/**
	 * hide the iframe
	 */
	hide : function() {
		this.$node.css({ position : 'absolute', top : '-10000px', left : '-10000px' });
		this.adjustSize(1, 1);
	},

	/**
	 * load specified url in the iframe.
	 * @param {String} [url=this.initial]    url to load; if unspecified, load "initial URL".
	 * @param {Number} [timeout]             miliseconds to timeout
	 */
	load : function(url, timeout) {
		this.clearTimer();

		if (!url || typeof url != 'string') {
			url = this.initial;
		}
		if (!this.frame) {
//			this.doCallbackByName('onCloseRequested');
			// これ（↑）何の為に書いたのか不明。とりあえず、 <iframe> なしのテンプレートを使っている場合に
			// ここの影響でダイアログクローズ時に無限ループになる。
			// PseudoDialog.close() -> this.unload() -> this.load() -> callback -> PseudoDialog.close() -> ...

		} else if (this.url != url ) {
			this.url = url;

			// load iframe content (both an image and an external html page).
			// 'this.setContent()' will be called from 'pseudoDialogContent.js'.
			this.frame.location.replace(this.url);

			// set timeout callback.
			if (timeout > 0) {
				this.timer = new Iroha.Timeout(function() { this.doCallbackByName('onLoadTimeout') }, timeout, this);
			}

			// when an external image is to be loaded.
			if (/\.(jpe?g|gif|png)$/i.test(this.url)) {
				var img = new Image();
				img.src = this.url;
				if (img.complete) {
					this.setContent(img);
				} else {
					img.onload = $.proxy(function() { this.setContent(img) }, this);
				}

			// 読み込むものが画像ではない (＝ HTML だと決めつける）場合
			} else {
				// iframe に読み込まれたページにメソッドのアドホック取り付け。
				// そのページに Iroha.PseudoDialogContent が存在しない場合のみ。
				this.$node.on('load', $.proxy(function () {
					var frame = this.frame;
					if (!frame.Iroha || !frame.Iroha.PseudoDialogContent) {
						$.extend(true, frame, {
							Iroha : {
								PseudoDialogContent : {
									  getGeometry     : function() { return frame.parent.Iroha.getGeometry(null, frame) }
									, setDefaultFocus : function() {}
								}
							}
						});
						this.setContent(frame.Iroha.PseudoDialogContent);
					}
				}, this));
			}
		}
	},

	/**
	 * unload page in the iframe.
	 */
	unload : function() {
		this.hide();
		this.load();
		this.content = null;
		this.$node.off('load');
	},

	/**
	 * process for iframe loaded;
	 * this method is only called from below;
	 *  - dialog content page's function    (it is in pseudoDialogContent.js)
	 *  - Iroha.PDContentFrame.load() (when the content is an image)
	 * @param {Image|Iroha.PseudoDialogContent} content    an Image, or a 'Iroha.PseudoDialogContent' instance of the iframe content page
	 */
	setContent : function(content) {
		if (!content) {
			throw new TypeError('Iroha.PseudoDialog.setContent: first argument must be a Iroha.PseudoDialogContent instance.');

		} else if (!this.content) {
			// preparations.
			this.clearTimer();
			this.content = content;

			// add callbacks to dialog content object.
			if (this.content.addCallback) {
				this.content.addCallback('onConfirmed'      , function() { this.doCallbackByName('onConfirmed'     ) }, this);
				this.content.addCallback('onCloseRequested' , function() { this.doCallbackByName('onCloseRequested') }, this);
			}

			// show the iframe.
			this.show();

			new Iroha.Timeout(function() {
				this.doCallbackByName('onLoaded');
			}, 100, this);
		}
	},

	/**
	 * does the iframe have the content? (the content is loaded)?
	 * @return true if the iframe has the content (the content is loaded).
	 * @type Boolean
	 */
	hasContent : function() {
		return Boolean(this.content);
	},

	/**
	 * clear timeout timer.
	 * @private
	 */
	clearTimer : function() {
		if (this.timer) {
			this.timer.clear();
		}
		this.timer = null;
	},

	/**
	 * set size of the iframe (MacIE / Safari 1.x / Old Opera not work).
	 * both width and height not given, iframe size is set to 'fit' as content page automatically.
	 * @param {Number} width     new width  (px)
	 * @param {Number} height    new height (px)
	 */
	adjustSize : function(width, height) {
		if (Iroha.ua.isIE && Iroha.ua.isMac) return;
		if (Iroha.ua.isSafari && Iroha.ua.version <= 100) return;
		if (isNaN(width) || isNaN(height)) {
			this.adjustSize(1, 1);
			var geom;
			geom   = this.content.getGeometry
			         	? this.content.getGeometry()
			         	: { pageW : this.content.width, pageH : this.content.height }
			width  = (this.maxWidth  > 0) ? Math.min(geom.pageW, this.maxWidth ) : geom.pageW;
			height = (this.maxHeight > 0) ? Math.min(geom.pageH, this.maxHeight) : geom.pageH;
		}
		this.$node.width (width );
		this.$node.height(height);
	},

	/**
	 * iframe 内のページの所定の要素ノードにフォーカスを当てる。
	 * @param {String} [expr="auto"]    フォーカスを当てる対象。
	 *                                  "" or "none" : フォーカスしない, "auto" : 自動選択, "<セレクタ表現>" : セレクタ表現（基底要素ノード起点）で指定。
	 */
	setDefaultFocus : function(expr) {
		this.content && this.content.setDefaultFocus && this.content.setDefaultFocus(expr);
	},

	/**
	 * process callback.
	 * @param {String} name    callback name (preferred to start with 'on')
	 * @private
	 */
	doCallbackByName : function(name) {
		this.doCallback(name, this.url);
	}
});



/* --------------- Class : Iroha.ClickShield --------------- */
/**
 * @class クリックシールド。疑似ダイアログの背面に展開される半透明レイヤー
 * @extends Iroha.Balloon
 * */
Iroha.ClickShield = function() {
	/**
	 * アニメ効果設定オブジェクト
	 * @type Object
	 */
	this.effect = {
		  'fadeDuration' : 350
		, 'maxOpacity'   : 0.5
	};
};

Iroha.ViewClass(Iroha.ClickShield).extend(Iroha.Balloon);

$.extend(Iroha.ClickShield,
/** @lends Iroha.ClickShield */
{
	/**
	 * すべてのインスタンスの基底要素ノードに付与される className
	 * @type String
	 * @constant
	 */
	BASE_CLASSNAME : 'iroha-clickshield',

	/**
	 * 新しくインスタンスを生成するか、基底要素ノードから既存のインスタンスを得る。
	 * 基底要素ノードは init() で自動的に作られる。
	 * 第1引数に要素ノードを与えたときは、それを基底要素とする既存のインスタンスを探す。
	 * @param {Iroha.ClickShield.Setting|jQuery|Element|String} [arg]    設定オブジェクト、または要素ノード
	 */
	create : Iroha.Balloon.create
});

$.extend(Iroha.ClickShield.prototype,
/** @lends Iroha.ClickShield.prototype */
	{

	/** @private */
	initSuper : Iroha.Balloon.prototype.init,

	/**
	 * 初期化
	 * @return このインスタンス自身
	 * @type Iroha.ClickSheld
	 */
	init : function(setting) {
		var setting = $.extend(Iroha.ClickShield.Setting.create(), setting);
		this.effect = setting.effect;

		this.initSuper(setting);
		this.moveTo(0, 0);
		this.hide();
		this.$node.click ($.proxy(this.eventPreventer, this));
		$(window) .resize($.proxy(this.adjustSize    , this));

		if (Iroha.FontSizeObserver) {
			Iroha.FontSizeObserver.addCallback('onChange', this.adjustSize, this);
		};

		return this;
	},

	/**
	 * preventer body (event handler).
	 * @type {Event} e    event object
	 * @private
	 */
	eventPreventer : function(e) {
		if (this.active) {
			this.doCallback('onPrevented');
		}
	},

	/**
	 * adjust shield size.
	 * @return このインスタンス自身
	 * @type Iroha.ClickSheld
	 */
	adjustSize : function() {
		if (this.active && (Iroha.ua.isMobile || Iroha.ua.isIE && Iroha.ua.version <= 6)) {
			var geom   = Iroha.getGeometry();
			var width  = geom.pageW;
			var height = Math.max(geom.pageH, geom.windowH) + ((Iroha.ua.isIE && Iroha.ua.version < 7) ? -4 : 0);
			this.resizeTo(width, height);
		}

		return this;
	},

	/**
	 * enable (visible) the shield.
	 * @return このインスタンス自身
	 * @type Iroha.ClickSheld
	 */
	enable : function() {
		if (!this.active) {
			this.show();
			this.adjustSize();
			this.$node.css('opacity', '0').fadeTo(
				  this.effect.fadeDuration
				, this.effect.maxOpacity
				, $.proxy(_postProcess, this)
			);
		}

		return this;

		function _postProcess() {
			this.doCallback('onEnabled');
		}
	},

	/**
	 * disable (hide) the shield.
	 * @return このインスタンス自身
	 * @type Iroha.ClickSheld
	 */
	disable : function() {
		if (this.active) {
			this.$node.fadeOut(
				  this.effect.fadeDuration
				, $.proxy(_postProcess, this)
			);
		}

		return this;

		function _postProcess() {
			this.hide();
			(Iroha.ua.isIE && Iroha.ua.version <= 6) && this.resizeTo(0, 0);
			this.doCallback('onDisabled');
		}
	}
});



/* --------------- Class : Iroha.TabFocusShield --------------- */
/**
 * @class タブフォーカスシールド
 * @extends Iroha.Observable
 */
Iroha.TabFocusShield = function() {
	/**
	 * 基底要素ノード。この要素ノード内の要素へフォーカスのみが許可される。
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * このシールドの有効状態
	 * @type Boolean
	 *  @private
	 */
	this.active = false;

	/**
	 * インスタンスごとに一意な ID 文字列。
	 * @type String
	 * @private
	 */
	this.guid = '';

	/**
	  * 弾幕的呼び出し抑制済みイベントハンドラ
	  * @type Function
	  * @private
	  */
	this.barrageShield = new Function;
};

Iroha.ViewClass(Iroha.TabFocusShield).extend(Iroha.Observable);

$.extend(Iroha.TabFocusShield,
/** @lends Iroha.TabFocusShield */
{
	/**
	 * 一時停止状態にあるインスタンス群の格納場所
	 * @type Iroha.TabFocusShield[]
	 * @private
	 */
	recents : [],

	/**
	 * すべてのインスタンスを一時的に停止（無効化）
	 * @param {Iroha.TabFocusShield} except    一時停止から除外するインスタンス。
	 * @return 一時停止になったインスタンス群
	 * @type Iroha.TabFocusShield[]
	 */
	disableAll : function(except) {
		var instances = this.getInstance();
		this.recents  = instances.filter(function(instance) { return instance !== except && instance.active });
		instances.forEach(function(instance) { instance !== except && instance.disable() });
		return this.recents;
	},

	/**
	 * 直前に enable だったインスタンスを再開（有効化）
	 * @return 再開されたインスタンス
	 * @type Iroha.TabFocusShield
	 */
	blessRecent : function() {
		var instance;
		if (instance = this.recents.pop()) instance.enable();
		this.recents = [];
		return instance;
	}
})

$.extend(Iroha.TabFocusShield.prototype,
/** @lends Iroha.TabFocusShield.prototype */
{
	/**
	 * 初期化
	 * @param {jQuery|Element|String} node    基底要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.TabFocusShield
	 * @private
	 */
	init : function(node) {
		this.$node         = $(node);
		this.guid          = Iroha.String.guid().get();
		this.barrageShield = Iroha.barrageShield(this.eventPreventer, 10, this);

		$(document)
			.on('focus.Iroha.TabFocusShield.' + this.guid, '*', $.proxy(function(e) {
				if ($(e.target).closest(this.$node).length == 0) {
					this.barrageShield();
				}
			}, this));

		return this;
	},

	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		try { this.disable() } catch(err) {}
		$(document).off('focus.Iroha.TabFocusShield.' + this.guid, '*');
		this.constructor.disposeInstance(this);
	},

	/**
	 * preventer body.
	 * @return this instance
	 * @type Iroha.TabFocusShield
	 * @private
	 */
	eventPreventer : function() {
		if (this.active) {
			this.doCallback('onPrevented');
		}
		return this;
	},

	/**
	 * enable the shield.
	 * @return このインスタンス自身
	 * @type Iroha.TabFocusShield
	 */
	enable : function() {
		this.active = true;
		return this;
	},

	/**
	 * disable the shield.
	 * @return このインスタンス自身
	 * @type Iroha.TabFocusShield
	 */
	disable : function() {
		this.active = false;
		return this;
	}
});



/* --------------- Class : Iroha.ScrollShield --------------- */
/**
 * @class スクロールシールド
 * @extends Iroha.Observable
 * */
Iroha.ScrollShield = function() {
	/**
	 * 基底要素ノード。この要素ノード内のスクロールは許可される。
	 * @type jQuery
	 */
	this.$node = $();

	/**
	 * このシールドの有効状態
	 * @type Boolean
	 *  @private
	 */
	this.active = false;

	/**
	 * インスタンスごとに一意な ID 文字列。
	 * @type String
	 * @private
	 */
	this.guid = '';

	/**
	 * このシールドを有効にした瞬間のスクロール位置。連想配列 { X:number, Y:number }
	 *  @type Object
	 *  @private
	 */
	this.scrollPos = { X : 0, Y : 0 };

	/**
	 * オリジナルのスタイルを格納。
	 * @type Array
	 * @private
	 */
	this.storedStyle = [];
};

Iroha.ViewClass(Iroha.ScrollShield).extend(Iroha.Observable);

$.extend(Iroha.ScrollShield,
/** @lends Iroha.ScrollShield */
{
	getActiveInstance : function (except) {
		return this.getInstance().filter(function(instance) { return instance !== except && instance.active });
	}
});

$.extend(Iroha.ScrollShield.prototype,
/** @lends Iroha.ScrollShield.prototype */
{

	/**
	 * initialize, setup event handler.
	 * @param {jQuery|Element|String} node    スクロールを許可する範囲を示す要素ノード
	 * @return このインスタンス自身
	 * @type Iroha.ScrollShield
	 * @private
	 */
	init : function(node) {
		this.$node = $(node);  // この要素ノードをスクロールロックの対象外にする処理はまだやっていない！！
		this.guid  = Iroha.String.guid().get();

		var suffix = '.Iroha.ScrollShield.' + this.guid;

		this.$node.bind(    'scroll' + suffix, function(e) { e.stopPropagation() });
		this.$node.bind('mousewheel' + suffix, function(e) { e.stopPropagation() });

//		$(window  ).bind(    'scroll' + suffix, $.proxy(this.eventPreventer, this));
//		$(document).bind('mousewheel' + suffix, $.proxy(this.eventPreventer, this));

		return this;
	},

	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		var suffix = '.Iroha.ScrollShield.' + this.guid;

		try { this.disable() } catch(err) {}
		$(window  ).unbind(    'scroll' + suffix);
		$(document).unbind('mousewheel' + suffix);
		this.constructor.disposeInstance(this);
	},

	/**
	 * preventer body (event handler).
	 * @type {Event} e    event object
	 * @private
	 */
	eventPreventer : function(e) {
		if (this.active) {
			switch (e.type) {
				case 'scroll' :
					e.preventDefault();
					window.scrollTo(this.scrollPos.X, this.scrollPos.Y);
					this.doCallback('onPrevented');
					break;
				case 'mouswheel' :
					e.preventDefault();
					this.doCallback('onPrevented');
					break;
				default :
					break;
			}
		}
	},

	/**
	 * enable the shield.
	 * @return このインスタンス自身
	 * @type Iroha.ScrollShield
	 */
	enable : function() {
		if (!this.active) {
			this.active = true;

			if (this.constructor.getActiveInstance(this).length) {
				// 自分の他に有効状態の Iroha.ScrollShield インスタンスがいるなら、もう何もする必要がない。

			} else {
				var geom = Iroha.getGeometry();
				var node;

				// style for 'body' (or 'html' in Safari)
				node = (!Iroha.ua.isSafari) ? document.body : document.documentElement;
				this.storedStyle.push({
					  node  : node
					, style : {
							borderRightWidth : $(node).css('borderRightWidth')
						  , borderRightStyle : $(node).css('borderRightStyle')
						  , borderRightColor : $(node).css('borderRightColor')
					}
				});

				if (geom.windowH < geom.pageH || Iroha.ua.isIE) {
					$(node).css('borderRight', geom.scrollBar + 'px solid white');
				}

				// style for 'html'
				node = document.documentElement;
				this.storedStyle.push({
					  node  : node
					, style : {
						  overflow  : $(node).css('overflow' )
						, overflowX : $(node).css('overflowX')
						, overflowY : $(node).css('overflowY')
					}
				});
				$(node).css({ 'overflow' : 'hidden', 'overflowX' : 'hidden', 'overflowY' : 'hidden' });

				this.scrollPos = { X : geom.scrollX, Y : geom.scrollY };
				window.scrollTo(this.scrollPos.X, this.scrollPos.Y);
			}
		}

		return this;
	},

	/**
	 * disable the shield.
	 * @return このインスタンス自身
	 * @type Iroha.ScrollShield
	 */
	disable : function() {
		if (this.active) {
			this.active = false;

			if (this.constructor.getActiveInstance(this).length) {
				// 自分以外にまだ有効状態の Iroha.ScrollShield インスタンスがいるなら、まだ何もしない。

			} else {
				this.storedStyle.forEach(function(stored) { $(stored.node).css(stored.style) });

				if (Iroha.ua.isSafari) {
					var geom = Iroha.getGeometry();
					var node = document.documentElement;
					if (geom.windowW < geom.pageW && $(node).css('overflowX') == 'visible') $(node).css('overflowX', 'scroll');
					if (geom.windowH < geom.pageH && $(node).css('overflowY') == 'visible') $(node).css('overflowY', 'scroll');
				}

				window.scrollTo(this.scrollPos.X, this.scrollPos.Y);
			}
		}

		return this;
	}
});






/* -------------------- Class : Iroha.PseudoDialog.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PseudoDialog}.
 * @extend Iroha.Balloon.Setting
 */
Iroha.PseudoDialog.Setting = function() {
	this.template       = '<div class="iroha-pdialog-body"></div>'
	                    + '<div class="iroha-pdialog-frame">'
	                    + '<iframe name="iroha-pdialog-frame" frameborder="0" scrolling="no"></iframe>'
	                    + '</div>';
	this.bodyExpr       = '.iroha-pdialog-body';
	this.confirmBtnExpr = '.iroha-pdialog-btn-confirm';
	this.closeBtnExpr   = '.iroha-pdialog-btn-close';
	this.ignoreX        = false;
	this.ignoreY        = false;
	this.srcKindCName   = {
	                      	  'fragment'      : 'iroha-pdialog-shows-fragment'
	                      	, 'externalPage'  : 'iroha-pdialog-shows-external-page'
	                      	, 'externalImage' : 'iroha-pdialog-shows-external-image'
	                      };
	this.loading        = {
	                      	  'startDelay' : 500
	                      	, 'timeout'    : 15000
	                      };
	this.effect         = {
	                      	  'duration' : 500
	                      };
	this.throbber       = {};  // Throbber　の設定オブジェクト。(Iroha.Throbber.Setting インスタンス)
	this.contentFrame   = Iroha.PDContentFrame.Setting.create();
	this.clickShield    = Iroha.ClickShield.Setting.create()
	this.useShield      = {
	                      	  'click'  : true
	                      	, 'focus'  : true
	                      	, 'scroll' : true
	                      };
	this.allowEasyClose = true;
	this.autoFocusExpr  = 'auto';
	this.closeDisallowedCName = 'iroha-pdialog-disallowed-close';
};

Iroha.PseudoDialog.Setting.prototype = new Iroha.Balloon.Setting;

/**
 * create an instance and return.
 * @type Iroha.PseudoDialog.Setting
 */
Iroha.PseudoDialog.Setting.create = function() {
	return new this;
};



/* -------------------- Class : Iroha.PDContentFrame.Setting -------------------- */
/**
 * setting data object for {@link Iroha.PseudoDialog}.
 * @extend Iroha.Balloon.Setting
 */
Iroha.PDContentFrame.Setting = function() {
	this.name      = 'iroha-pdialog-frame';
	this.initial   = 'about:blank';
	this.maxWidth  = 950;
	this.maxHeight = 700;
};

/**
 * create an instance and return.
 * @type Iroha.PDContentFrame.Setting
 */
Iroha.PDContentFrame.Setting.create = function() {
	return new this;
};



/* -------------------- Class : Iroha.ClickShield.Setting -------------------- */
/**
 * setting data object for {@link Iroha.ClickShield}.
 * @extend Iroha.Balloon.Setting
 */
Iroha.ClickShield.Setting = function() {
	this.effect = {
		  'fadeDuration' : 350
		, 'maxOpacity'   : 0.5
	};
};

/**
 * create an instance and return.
 * @type Iroha.ClickShield.Setting
 */
Iroha.ClickShield.Setting.create = function() {
	return new this;
};



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions for {@link Iroha.PseudoDialog}
 * @name Iroha.PseudoDialog.callback
 * @namespace callback functions for {@link Iroha.PseudoDialog}
 */
/**
 * a callback for when the dialog is shown - inherited from Iroha.Balloon
 * @name Iroha.PseudoDialog.callback.onShow
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is moved position - inherited from Iroha.Balloon
 * @name Iroha.PseudoDialog.callback.onMove
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog balloon's size is changed - inherited from Iroha.Balloon
 * @name Iroha.PseudoDialog.callback.onResize
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is hidden - inherited from Iroha.Balloon
 * @name Iroha.PseudoDialog.callback.onHide
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is opened completely
 * @name Iroha.PseudoDialog.callback.onOpen
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog content is changed.
 * @name Iroha.PseudoDialog.callback.onContentChange
 * @function
 * @param {Iroha.Balloon.geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the confirm button is clicked, and dialog is closed completely
 * @name Iroha.PseudoDialog.callback.onConfirmed
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */
/**
 * a callback for when the dialog is closed completely
 * @name Iroha.PseudoDialog.callback.onClose
 * @function
 * @param {Iroha.Balloon.Geometry} geom    an associative array of balloon geometry
 */

/**
 * callback functions for {@link Iroha.PDContentFrame}
 * @name Iroha.PDContentFrame.callback
 * @namespace callback functions for {@link Iroha.PDContentFrame}
 */
/**
 * a callback for when the iframe completed loading content
 * @name Iroha.PDContentFrame.callback.onLoaded
 * @function
 * @param {String} url    url of the page currently loaded in the iframe
 */
/**
 * a callback for when the loading of iframe is timeout.
 * @name Iroha.PDContentFrame.callback.onLoadTimeout
 * @function
 * @param {String} url    url of the page currently loaded in the iframe
 */
/**
 * a callback for when it confirmed, and requested to close the dialog.
 * @name Iroha.PDContentFrame.callback.onConfirmed
 * @function
 * @param {String} url    url of the page currently loaded in the iframe
 */
/**
 * a callback for when it requested to close the dialog.
 * @name Iroha.PDContentFrame.callback.onCloseRequested
 * @function
 * @param {String} url    url of the page currently loaded in the iframe
 */

/**
 * callback functions for {@link Iroha.ClickShield}
 * @name Iroha.ClickShield.callback
 * @namespace callback functions for {@link Iroha.ClickShield}
 */
/**
 * a callback for when the click shield is shown completely
 * @name Iroha.ClickShield.callback.onEnabled
 * @function
 */
/**
 * a callback for when the click shield is hidden completely
 * @name Iroha.ClickShield.callback.onDisabled
 * @function
 */
/**
 * a callback for when the shield prevents user action
 * @name Iroha.ClickShield.callback.onPrevented
 * @function
 */

/**
 * callback functions for {@link Iroha.TabFocusShield}
 * @name Iroha.TabFocusShield.callback
 * @namespace callback functions for {@link Iroha.TabFocusShield}
 */
/**
 * a callback for when the shield prevents user action
 * @name Iroha.TabFocusShield.callback.onPrevented
 * @function
 */

/**
 * callback functions for {@link Iroha.ScrollShield}
 * @name Iroha.ScrollShield.callback
 * @namespace callback functions for {@link Iroha.ScrollShield}
 */
/**
 * a callback for when the shield prevents user action
 * @name Iroha.ScrollShield.callback.onPrevented
 * @function
 */



})(Iroha.$, Iroha, window, document);