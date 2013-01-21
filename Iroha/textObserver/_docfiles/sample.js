/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.TextObserver.
 *
 *    @version 3.01.20121111
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.textObserver.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var $input   = $('#example1');
	var $disp    = $('#example1-disp');
	var callback = {
		'onValidate' : function(text) {
			if (text.match(/\D/)) {
				return '\u534A\u89D2\u6570\u5B57\u306E\u307F\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044';
			} else if (text.length > 10) {
				return '\u6587\u5B57\u6570\u5236\u9650\u3092\u8D85\u3048\u3066\u3044\u307E\u3059';
			} else {
				return '';
			}
		},
		'onError' : function(text, message) {
			$disp.html('Error : ' + message);
		},
		'onChange' : function(text, message) {
			if (message == '') $disp.html(text || '&nbsp;');
		}
	};

	var observer = Iroha.TextObserver.create($input, callback);
	
	// initial display
	$disp.html(observer.getText() || '&nbsp;');
	observer.validate();
});



})(Iroha.jQuery);