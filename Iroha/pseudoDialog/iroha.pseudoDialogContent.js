/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       Control for Pseudo Dialog content pages.
 *       (charset : "UTF-8")
 *       (この JS は、8年前のブラウザにはどうしても必要だった。しかし2013年の今、不要のはずだからいずれ廃止する)
 *
 *    @version 3.00.20130313
 *    @requires jquery.js
 *    @requires bajl.js
 *    @requires bajl.keyEquiv.js     (optional)
 *    @requires bajl.pseudoDialog.js (in parent window page)
 */
/* -------------------------------------------------------------------------- */
(function($) {



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
	 * set focus to default button node.
	 * @return this object itself
	 * @type Iroha.PseudoDialogContent
	 */
	setDefaultFocus : function() {
		var setting = this.setting;
		var $input  = $('input:text').eq(0);
		var $anchor = $(setting.confirmBtnExpr).add(setting.closeBtnExpr).find('a').andSelf().filter('a');
		window.focus();
		$input .focus();
		$anchor.focus();
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



})(Iroha.jQuery);