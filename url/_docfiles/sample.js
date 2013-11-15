/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Url
 *
 *    @version 3.00.20130217
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.url.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	var url = Iroha.Url.create();

	$('div.example form')
		.submit(function(e) {
			e.preventDefault();
			
			var $form = $(this);
			var value = $form.find(':text').val();
			url.set(value);
			
			$form
				.find('.url'     ).text(url                        ).end()
				.find('.protocol').text(url.protocol()             ).end()
				.find('.hostname').text(url.hostname()             ).end()
				.find('.port'    ).text(url.port()                 ).end()
				.find('.host'    ).text(url.host()                 ).end()
				.find('.pathname').text(url.pathname()             ).end()
				.find('.search'  ).text(url.search()               ).end()
				.find('.hash'    ).text(url.hash()                 ).end()
				.find('.param'   ).text(JSON.stringify(url.param())).end();
		})
		.trigger('submit');
});



})(Iroha.jQuery);