/* -------------------------------------------------------------------------- */
/**
 *    @fileoverview
 *       text field observer.
 *       (charset : "UTF-8")
 *
 *    @version 3.01.20130312
 *    @requires jquery.js
 *    @requires iroha.js
 */
/* -------------------------------------------------------------------------- */
(function($) {



/* -------------------- jQuery.fn : Iroha_TextObserver -------------------- */
/**
 * Iroha.TextObserver as jQuery plugin
 * @exports $.fn.Iroha_TextObserver as jQuery.fn.Iroha_TextObserver
 * @param {Iroha.TextObserver.callback} [callback]    callback setting contains callback functions
 * @returns jQuery
 * @type jQuery
 */
$.fn.Iroha_TextObserver = function(callback) { 
	return this.each(function() { Iroha.TextObserver.create(this, callback) });
};



/* --------------- Class : Iroha.TextObserver --------------- */
/**
 * observe text change of form's text fields, text nodes, text node contained by element nodes.
 * @class text observer
 * @extends Iroha.Observable
 */
Iroha.TextObserver = function() {
	/**
	 * observe target node
	 * @type jQuery
	 */
	this.$node = $();
	
	/**
	 * current text of observe target
	 * @type String
	 * @private
	 */
	this.currentText = '';
	
	/**
	 * flag of focused or not (readonly)
     *  @type Boolean
	 */
	this.isFocused = false;
	
	/**
	 * validation result status (readonly)
	 *  @type Boolean
	 */
	this.isValid = true;
	
	/**
	 * store point of observing timer
	 * @type Iroha.Interval
	 * @private
	 */
	this.observeTimer = null;
};

Iroha.ViewClass(Iroha.TextObserver).extend(Iroha.Observable);

$.extend(Iroha.TextObserver,
/** @lends Iroha.PseudoDialog */
{
	/**
	 * 頻出の class 名（HTML の class 属性値）
	 *   - 'target' : 監視対象の要素ノードであることを示す
	 *   - 'error'  : 監視対象の要素ノードのテキストがバリデーションチェックでひっかかったことを示す
	 * @type Object
	 * @cnonsant
	 */
	CLASSNAME : {
		  'target' : 'iroha-textobserver-target'
		, 'error'  : 'iroha-textobserver-error'
	},
	
	/**
	 * テキストの変化を監視する間隔 (ms)
	 * @type Number
	 * @constant
	 */
	OBSERVE_INTERVAL : 100
});

$.extend(Iroha.TextObserver.prototype,
/** @lends Iroha.TextObserver.prototype */
{
	/**
	 * initialize.
	 * @param {Element|jQuery|String}       node          an element node to be observed its text.
	 * @param {Iroha.TextObserver.callback} [callback]    callback setting contains callback functions
	 * @return this instance itself
	 * @type Iroha.TextObserver
	 * @private
	 */
	init : function(node, callback) {
		this.$node = $(node).eq(0);
//		this.$node.attr('autocomplete', 'off');
		this.$node.addClass(this.constructor.CLASSNAME.target);

		if (this.$node.contents().size() > 0) {
			var text = this.$node.text();
			this.$node.empty().text(text);
		}

		this.currentText = this.getText();
		
		this.$node.focus($.proxy(this.focus, this));
		this.$node.blur ($.proxy(this.blur , this));
		
		var callback = $.extend({}, callback);
		if (callback.onChange  ) this.addCallback ('onChange', callback.onChange  , callback.aThisObject);
		if (callback.onValidate) this.setValidator(            callback.onValidate, callback.aThisObject);
		if (callback.onError   ) this.addCallback ('onError' , callback.onError   , callback.aThisObject);

		return this;
	},
	
	/**
	 * get current str of observed text field.
	 * @return current text of observed text field
	 * @type String
	 */
	getText : function() {
		var ip;
		if (Iroha.InputPrompt && (ip = Iroha.InputPrompt.getInstance(this.$node))) {
			return ip.getText();
		} else {
			return this.$node.val() || this.$node.text();
		}
	},
	
	/**
	 * set text to observed text field.
	 * @param {String} text   text to set to observed text field
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	setText : function(text) {
		text = String(text);
	
		var ip;
		if (Iroha.InputPrompt && (ip = Iroha.InputPrompt.getInstance(this.$node))) {
			ip.setText(text);
		} else if (this.$node.contents().size() > 0) {
			this.$node.text(text);
		} else if (typeof this.$node.val() == 'string') {
			var maxlen = this.$node.attr('maxlength');
			if (maxlen > -1) {
				text = (this.$node.css('text-align') != 'right') ? text.substr(0, maxlen) : text.substr(-maxlen);
			}
			this.$node.val(text);
		}
	
		this.observe();
		return this;
	},
	
	/**
	 * set focus to observed text field
	 * @param {Event} e    event object 不必要なイベント発生を防ぐ
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	focus : function(e) {
		if (!this.isFocused) {
			this.isFocused = true;
			if (!e || e.type != 'focus') this.$node.focus();
			this.startObserve();
		}
		return this;
	},
	
	/**
	 * unset focus (blur) from observed text field
	 * @param {Event} e    event object 不必要なイベント発生を防ぐ
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	blur : function(e) {
		if (this.isFocused) {
			this.isFocused = false;
			if (!e || e.type != 'blur') this.$node.blur();
			this.stopObserve();
		}
		return this;
	},
	
	/**
	 * start observing.
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	startObserve : function() {
		if (!this.observeTimer) {
			this.observe();
			this.observeTimer = new Iroha.Interval(this.observe, this.constructor.OBSERVE_INTERVAL, this);
		}
		return this;
	},
	
	/**
	 * stop observing.
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	stopObserve : function() {
		if (this.observeTimer) {
			this.observe();
			this.observeTimer.clear();
			this.observeTimer = null;
		}
		return this;
	},
	
	/**
	 * observe text changing of target text field.
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	observe : function() {
		var text = this.getText();
		if (this.currentText != text) {
			this.currentText = text;
//			if (this.observeTimer) {   // do "onChange" callback only when the observing timer is runnning
//									   // ...but this　conditional branching ignores change of text by setText().
				this.doCallback('onChange', this.currentText, this.validate(), this);
//			}
		}
		return this;
	},
	
	/**
	 * set validator function (as callback function).
	 * @param {Iroha.TextObserver.callbackFuncs.onValidate} validator        validator function to validate current text
	 * @param {Object}                                     [aThisObject]    the object that will be a global object ('this') in 'validator' func.
	 * @return this instance
	 * @type Iroha.TextObserver
	 */
	setValidator : function(validator, aThisObject) {
		if (typeof validator != 'function') {
			throw new TypeError('Iroha.TextObserver#setValidator: first argument must be a Function object.');
		} else if (typeof validator('') != 'string') {
			throw new TypeError('Iroha.TextObserver#setValidator: return value of the function must be a string.');
		} else {
			this.removeCallback('onValidate');
			this.addCallback('onValidate', validator, aThisObject);
		}
		return this;
	},
	
	/**
	 * validate current text (when validator function was given)
	 * @return validation result; error message or null string
	 * @type String
	 */
	validate : function() {
		// remove otiose functions
		var validator = (this.callbackChains || {}).onValidate || [];
		if (validator.length) {
			this.setValidator(validator.shift());
		}
	
		var errCName = this.constructor.CLASSNAME.error;
		var errMsg   = this.doCallback('onValidate', this.currentText, this) || '';
		if (typeof errMsg != 'string') {
			throw new Error('Iroha.TextObserver#validator: return value of the validator function ("onValidator" callback function) must be a string.');
		} else if (!errMsg) {
			this.isValid = true;
			this.$node.removeClass(errCName);
		} else {
			this.isValid = false;
			this.$node.addClass(errCName);
			this.doCallback('onError', this.currentText, errMsg, this);
		}
		return errMsg;
	},
	
	/**
	 * このインスタンスを破棄する
	 */
	dispose : function() {
		this.observeTimer && this.observeTimer.clear();
		
		this.constructor.disposeInstance(this);
	}
});



/* -------------------- for JSDoc toolkit output -------------------- */
/**
 * callback functions used for {@link Iroha.TextObserver}.
 * @name Iroha.TextObserver.callback
 * @namespace callback functions used for {@link Iroha.TextObserver}.
 */
/**
 * @name Iroha.TextObserver.callback.onChange
 * @function
 * @param {String}            text       current text in observing target
 * @param {String}            message    validation result message; if no error, this message is ""
 * @param {Iroha.TextObserver} TO         Iroha.TextObserver instance
 */
/**
 * @name Iroha.TextObserver.callback.onValidate
 * @function
 * @param {String}            text       current text in observing target
 * @param {Iroha.TextObserver} TO         Iroha.TextObserver instance
 * @returns validation result message (typically returns error message. if no error, the function must return "")
 * @type String
 */
/**
 * @name Iroha.TextObserver.callback.onError
 * @function
 * @param {String}            text       current text in observing target
 * @param {String}            message    error message from validator function ({@link Iroha.TextObserver.callback.onValidate})
 * @param {Iroha.TextObserver} TO         Iroha.TextObserver instance
 */
/**
 * the object that will be a global object ('this') in callback funcs.
 * @name Iroha.TextObserver.callback.aThisObject
 * @field
 */



})(Iroha.jQuery);