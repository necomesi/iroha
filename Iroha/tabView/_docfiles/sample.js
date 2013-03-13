/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       sample script for Iroha.TabView
 *
 *    @version 3.00.20130312
 *    @requires jquery.js
 *    @requires iroha.js
 *    @requires iroha.tabView.js
 */
/* -------------------------------------------------------------------------- */
(function($) {

//Iroha.WatchFor('Iroha.settings.TabView')
//	.done(function(setting) {
//		if (setting.autoSetup.enabled) {
//			$.each(setting.presets, function(expr, setting) {
//				showhide(expr, false);
//				$(function() {
//					showhide(expr, true);
//					$(expr).Iroha_TabView(setting);
//				});
//			});
//		}
//		function showhide(expr, visible) {
//			if (!Iroha.ua.isIE || Iroha.ua.documentMode >= 8) {
//				var prop  = 'display';
//				var value = visible ? 'block' : 'none';
//				Iroha.StyleSheets().insertRule(expr + '{' + prop + ':' + value + '}');
//			}
//		}
//	});


$(function() {
	$('.iroha-tabview').Iroha_TabView();
	
	
//		  'div.bajl-tabview' : {
//			  'tabs'        : 'ul.bajl-tabview-tabs'
//			, 'tab'         : 'li.bajl-tabview-tab'
//			, 'pane'        : 'div.bajl-tabview-pane'
//			, 'fixedHeight' : false
//			, 'changeHash'  : true
//			, 'effect'      : {
//				  'enabled'  : true
//				, 'duration' : 250
//				, 'easing'   : 'swing'
//			}
	
});





})(Iroha.jQuery);