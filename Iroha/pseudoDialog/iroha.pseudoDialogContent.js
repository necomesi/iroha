/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Control for Pseudo Dialog content pages.
 *       (charset : "UTF-8")
 *
 *    @version 3.01.20130730
 *    @requires jquery.js
 *    @requires bajl.js
 *    @requires bajl.keyEquiv.js     (optional)
 *    @requires bajl.pseudoDialog.js (in parent window page)
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



/* -------------------- Main : register start-up -------------------- */

$(function() {
	if (self !== parent && parent.Iroha.PseudoDialog) {
		Iroha.PseudoDialogContent.init();
	}
});



/* --------------- Static class : Iroha.PseudoDialogContent --------------- */
/**
 * @namespace pseudo dialog content
 * @extends Iroha.Observable
 */
Iroha.PseudoDialogContent = $.extend(Iroha.Observable.create(),
/** @lends Iroha.PseudoDialogContent */
{
	/**
	 * settings
	 *   - {String} stateCName        className for document.body for when the page is content of iframe {@link Iroha.PseudoDialogContentFrame.frame}
	 *   - {String} confirmBtnExpr    expression to find default button element(s)
	 *   - {Number} closeBtnExpr      expression to find close button element(s)
	 * @type Object
	 */
	setting : {
		  'stateCName'     : 'iroha-pdialog-content-page'
		, 'confirmBtnExpr' : '.iroha-pdialog-btn-confirm'
		, 'closeBtnExpr'   : '.iroha-pdialog-btn-close'
	},

	/**
	 * initialize, setup event handlers.
	 * @return this object itself
	 * @type Iroha.PseudoDialogContent
	 */
	init : function() {
		// preparations
		var setting = this.setting;
		$(document.body).addClass(setting.stateCName);
		$(document.documentElement).css('width', Iroha.getGeometry().pageW + 'px');

		// setup event handlers for buttons
		$(setting.confirmBtnExpr)
			.click($.proxy(function(e) { e.preventDefault(); this.doCallback('onConfirmed'     ) }, this));
		$(setting.closeBtnExpr  )
			.click($.proxy(function(e) { e.preventDefault(); this.doCallback('onCloseRequested') }, this));

		// set key equivalents
		if (Iroha.KeyEquiv) {
			Iroha.KeyEquiv.create().addKey('!', function() { this.doCallback('onCloseRequested') }, this);
		}

		// post process
		Iroha.delay(100, this)
			.done(function() {
				// workaround to Gecko, iframe scroll position is corrupted when browser window is minimized.
				window.scrollTo(0, 0);
				// Iroha.PseudoDialog は今や複数インスタンスが同時に存在する可能性があるから、こんなずさんなのではいけない。
				parent.Iroha.PseudoDialog.getInstance(0).contentFrame.setContent(this);
			});

		return this;
	},

	/**
	 * 既定の要素ノードにフォーカスを当てる。
	 * @param {String} [expr="auto"]    フォーカスを当てる対象を（このあと恒久的に）変更する場合に指定。
	 *                                  "" or "none" : フォーカスしない, "auto" : 自動選択, "<セレクタ表現>" : セレクタ表現（基底要素ノード起点）で指定。
	 * @return このインスタンス自身
	 * @type Iroha.PseudoDialogContent
	 */
	setDefaultFocus : function(expr) {
		var setting = this.setting;
		($.type(expr) != 'string') && (expr = 'auto');

		switch (expr) {
			case ''     :
			case 'none' :
				break;

			case 'auto' :
				var $input   = $('input:text, textarea').first();
				var $close   = $(setting.closeBtnExpr  );
				var $confirm = $(setting.confirmBtnExpr);
				var $anchor   = $close.add($confirm).find('a').addBack().filter('a').first();
				window .focus();
				$input .focus();
				$anchor.focus();
				break;

			default :
				$(expr).focus();
				break;
		}

		return this;
	},

	/**
	 * get geometry of dialog content page.
	 * @return associative array of geometry: windowW, windowH, pageW, pageH, windowX, windowY, scrollX, scrollY, mouseX, mouseY, nodeName, zoom, scrollBar.
	 * @type Object
	 */
	getGeometry : function() {
		var geom = Iroha.getGeometry();
		if (Iroha.ua.isOpera) {
			geom.pageW = document.documentElement.offsetWidth ; // but opera returns invalid offsetWidth value...
			geom.pageH = document.documentElement.offsetHeight;
		}
		return geom;
	}
});



})(Iroha.$, Iroha, window, document);