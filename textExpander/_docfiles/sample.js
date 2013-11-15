/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.TextExpander.
 *
 *    @version 1.00.20121111
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.textExpander.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	$('p.iroha-expandable-text').each(function() {
		var $node = $(this);
		var tmpl  = '<a href="${0}">${0}</a>';
		$node.text($.trim($node.Iroha_getInnerText())).Iroha_urlToAnchor(tmpl);
		Iroha.TextExpander.create($node, { threshold : 150 });
	});
});



})(Iroha.jQuery);