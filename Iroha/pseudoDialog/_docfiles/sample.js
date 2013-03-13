/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       example script for Iroha.PseudoDialog
 *
 *    @version 3.00.20130313
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.throbber.js
 *    @requires iroha.pseudoDialog.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() { 
	var setting = $.extend(Iroha.PseudoDialog.Setting.create(), {
		'throbber' : $.extend(Iroha.Throbber.Setting.create(), {
			'content' : '<img src="./throbber.gif" width="32" height="32" alt="" />Please wait...'
		})
	});
	
	var pdialog = Iroha.PseudoDialog.create(setting)
		.addCallback('onConfirmed', function() { alert('OK!') });

	$(document).on('click', 'a, area', function(e) {
		var $opener = $(this).filter('[target="iroha-pdialog"]');
		
		if ($opener.length && !pdialog.isActive()) {
			e.preventDefault();
			var $source = $opener.Iroha_getLinkTarget($opener.attr('target'));
			$source.length
				? pdialog.update ($source.contents()  ).open()
				: pdialog.openURL($opener.attr('href'));

			pdialog
				.addCallback('onClose', function() {
					$opener.focus();
					$source.append(pdialog.getContent());
				}, this, 'disposable');
		}
	});
});



})(Iroha.jQuery);