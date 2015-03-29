/*! 
 * EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
 * Juan García Fernández (@juan_gf) 
 * Alberto Córcoles (@finkux) 
 */
"use strict";
(function(_w, _d){
	function trace(message, type, indentNum){
		app.trace(message, type, indentNum);
	}
	_w.app = {
		/* Debug Flag */
		_debug : false,

		/* App pages*/
		_pages : {},

		/* Current App page */
		_currentPage : null,

		/**
		 * Console log helper
		 * @param  {String} message   Console message
		 * @param  {String} type      Message Type ('info' | 'error' | 'warn')
		 * @param  {Integer} indentNum Message indentation
		 */
		trace : function(message, type, indentNum){
			if(indentNum){
				var indent = "";

				for(var i=0; i<indentNum; i++){
					indent += " ";
				}

				message = indent + '└──> ' + message;
			}

			if(this._debug){
				switch(type){
					case "info":
						console.info(message);
						break;
					case "error":
						console.error(message);
						break;
					default:
						console.log(message);
				}				
			}
		},

		/**
		 * Set an App page
		 * @param {String} name Page name
		 */
		setPage : function(name){			
			this._pages[name] = {
				name : name
			};
		},

		/**
		 * Get an App Page
		 * @param  {[type]} name Page name
		 * @return {Object}      Page
		 */
		getPage : function(name){
			return this._pages[name];	
		},

		/**
		 * Get all the App Pages
		 * @return {Array} List of pages
		 */
		getPages : function(){
			return this._pages;	
		},

		/**
		 * Set the App current page
		 * @param {String} name Page name
		 */
		setCurrentPage : function(name){
			this._currentPage = this._pages[name];
		},

		/**
		 * Get the current App page
		 * @param  {String} name Page name
		 * @return {Object}      Page
		 */
		getCurrentPage : function(name){
			return this._currentPage;
		},

		/**
		 * Init EspectaculApp
		 * @param  {Boolean} debug Set the debug mode
		 */
		init : function(debug){			
			/* Set the debug flag */
			if(debug) this._debug = debug;

			trace('Init EspectaculApp', 'info');

			trace('Register App Pages', 'info');

			/* Register app pages */
			var pageTags = _d.getElementsByTagName("page");

			for(var i=0; i<pageTags.length; i++){
				
				var page = pageTags[i],
					isCurrent = false;

				trace('Set Page: '+ page.id, 'info', 1);				

				//Add new page to the system
				this.setPage(page.id);

				//Check if has the flag 'First' (current page)
				isCurrent = page.getAttribute('first')!==null ? (page.getAttribute('first')==='true' || page.getAttribute('first')==='') : false;

				//Check if we have to set the first current page
				if(!this.getCurrentPage() && isCurrent){
					this.setCurrentPage(page.id);
					trace('Set as current', 'info', 2);
				}
			}
		}
	};

})(window, document);
