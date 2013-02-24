/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.Scroller.
 *
 *    @version 1.10.20130222
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.scroller.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



$(function() {
	Iroha.PageScroller.init()
//		.useCssTranslate()
		.addCallback('onStart'   , function() { console.log('page : start   ', arguments) })
		.addCallback('onScroll'  , function() { console.log('page : scroll  ', arguments) })
		.addCallback('onDone'    , function() { console.log('page : done    ', arguments) })
		.addCallback('onComplete', function() { console.log('page : complete', arguments) })
		.addCallback('onAbort'   , function() { console.log('page : abort   ', arguments) });
	
	var $field1 = $('#field1');
	var field1  = Iroha.Scroller.create($field1)
//		.useCssTranslate()
		.addCallback('onStart'   , function() { console.log('field1 : start   ', arguments) })
		.addCallback('onScroll'  , function() { console.log('field1 : scroll  ', arguments) })
		.addCallback('onDone'    , function() { console.log('field1 : done    ', arguments) })
		.addCallback('onComplete', function() { console.log('field1 : complete', arguments) })
		.addCallback('onAbort'   , function() { console.log('field1 : abort   ', arguments) });

	$field1.find('button')
		.click(function(e) {
			field1.scrollToNode(this.id.replace('scrollTo-', '#'));
		});

	var $field2 = $('#field2');
	var $stage  = $field2.children('ul');
	var field2  = Iroha.Scroller.create($field2)
		.useCssTranslate($stage)
		.addCallback('onStart'   , function() { console.log('field2 : start   ', arguments) })
		.addCallback('onScroll'  , function() { console.log('field2 : scroll  ', arguments) })
		.addCallback('onDone'    , function() { console.log('field2 : done    ', arguments) })
		.addCallback('onComplete', function() { console.log('field2 : complete', arguments) })
		.addCallback('onAbort'   , function() { console.log('field2 : abort   ', arguments) });

	$field2.find('li')
		.click(function(e) {
			field2.scrollToNode(e.currentTarget);
		});
});



})(Iroha.jQuery);