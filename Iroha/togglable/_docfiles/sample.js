/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Togglable
 *       (charset : "UTF-8")
 *
 *    @version 3.01.20130314
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.togglable.js
 */
/* -------------------------------------------------------------------------- */
(function($, Iroha, window, document) {



$(function() {
	
	
	
	/* ---------- サンプル実装「基本的な使い方」 ----------- */
	
	$('#example1_1, #example1_2').each(function() {
		var $base     = $(this);
		var $button   = $base.children('button');
		var $target   = $base.children('div'   );
		var togglable = Iroha.Togglable.create($target, $button);
	});
	
	
	
	/* ---------- 「AutoSetup」 ----------- */
	
	Iroha.Togglable.autoSetup();
	
	
	
	/* ---------- サンプル実装「多対多連携の例」 ----------- */
	
	var $base     = $('#example3');
	var $buttons  = $base.find('> p > a');
	var $targets  = $base.find('> div:nth-of-type(odd)');
	var togglable = Iroha.Togglable.create($targets, $buttons);
	
	
	
	/* ---------- サンプル実装「チェックボックス連携の例」 ----------- */
	
	var $base     = $('#example4');
	var $target   = $base.children('div').first();
	var $check    = $base.find(':checkbox');
	var togglable = Iroha.Togglable.create($target, $check);
	
	// HTML 読み込み時点のチェックボックス状態により即座開閉。
	$check.attr('checked') ? togglable.open(0) : togglable.close(0);
	
	
	
	/* ---------- サンプル実装「ラジオボタン連携の例」 ----------- */
	
	var $base      = $('#example5');
	var togglables = $base.children('div').map(function() { return Iroha.Togglable.create(this) });
	var $radios    = $base.find(':radio').change(function() {
		togglables.each(function() { this.close() });
		togglables[this.value].open();
	});
	
	// HTML 読み込み時点のチェックボックス状態により即座開閉。
	togglables.each(function() { this.close(0) });
	$radios.filter(':checked').trigger('change');
	
	
	
});



})(Iroha.$, Iroha, window, document);