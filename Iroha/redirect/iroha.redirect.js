/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       url redirector
 *
 *    @version 3.00.20130316
 *
 *    @example
 *    <script src="iroha.redirect.js?url=URL;delay=3;hide=yes"></script>
 *      - url    : absolute/relative URL string (requred)
 *      - hide   : if "yes" then whole page will be hidden. (default:no) 
 *      - delay  : number of seconds to delay redirecttion. (default:0) 
 *      - appear : number of seconds to before page appears again. (default:0) (0 means "never appear")
 */
/* -------------------------------------------------------------------------- */

(function() {
	var THISFILE = /^iroha\.redirect([\.\-].+)?\.js$/;  // matches this file's filename.
	
	
	
	var head    = document.getElementsByTagName('head')[0];
	var scripts = head ? head.getElementsByTagName('script') : [];
	
	// find script element by filename...
	for (var i = 0, n = scripts.length; i < n; i++) {
		var script = scripts[i];
		var fname  = script.src.split('?')[0].split('/').pop();
		var query  = script.src.split('?').slice(1).join('?');
		var param  = {};
		
		// found.
		if (THISFILE.test(fname)) {
			var pairs = (query || '').split(';');
			for (var j = 0, m = pairs.length; j < m; j++) {
				var pair = pairs[j].split('=');
				param[pair[0]] = pair.slice(1).join('=') || '';
			};
			
			// "url" param value is required.
			if (param.url) {
				var style;
				
				// add style rule to hide whole page.
				if (param.hide == 'yes') {
					style           = document.createElement('style');
					style.innerHTML = 'html, body { display: none !important }';
					style.id        = 'iroha-redirector-injected';
					head.insertBefore(style, script.nextSibling);
				}
				
				param.delay  = Math.max(0, param.delay ) || 0;
				param.appear = Math.max(0, param.appear) || 0;
				
				// do redirect after delay.
				setTimeout(function() {
					// show page again after delay.
					param.appear > 0 && setTimeout(function() {
						style && style.parentNode.removeChild(style);
					}, param.appear * 1000);
					
					// redirection
					location.replace(param.url);
				}, param.delay * 1000);
			}
			
			break;
		}
	}
})();