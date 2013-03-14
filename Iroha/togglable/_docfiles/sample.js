/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Togglable
 *       (charset : "UTF-8")
 *
 *    @version 3.00.20130314
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.togglable.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



$(function() {
	
	
	
	/* ---------- 「AutoSetup」 ----------- */
	/*
	 * className と構造をもとに、開閉ブロックと開閉ボタンを関連づけ、
	 * 開閉ボタンが押下されたらその場でインスタンスを自動生成する。
	 */
	Iroha.Togglable.autoSetup();
	
	
	
	/* ---------- サンプル実装「チェックボックスと連携」 ----------- */
	/*
	 * ブロック開閉をチェックボックスの ON/OFF で行うというサンプル。
	 */
	var $base     = $('#example4');
	var $panel    = $base.children('div').first();
	var $check    = $base.find(':checkbox');
	var togglable = Iroha.Togglable.create($panel, $check);

	// HTML 読み込み時点のチェックボックス状態により即座開閉。
	$check.attr('checked') ? togglable.open(0) : togglable.close(0);
	
	
	
});



})(Iroha.$, Iroha, window, document);