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
		 * Resample registered Pages
		 */
		_resamplePages : function(){

			var width = _w.innerWidth,
				height = _w.innerHeight;

			for(var key in this._pages){
				this._pages[key].resize(width, height);
			}

			return this;
		},

		/**
		 * Register system events
		 */
		_registerEvents : function(){
			var that = this;

			//On Window resize
			_w.onresize = function(){
				that._resamplePages();
			};

			return this;
		},

		/**
		 * Inject the system dependencies
		 * @param  {function} callBack A callback function
		 */
		_injectDependencies : function(callBack){
			var dependencies = [
				"js/Page.js"
			],			
			loadedDependenciesNum = 0,
			bodyTag = _d.getElementsByTagName('body')[0];

			//Load each dependency
			for(var i=0; i<dependencies.length; i++){
				var script = _d.createElement('script');

				script.src = dependencies[i];

				trace('Injecting "'+script.src+'"', 'info', 1);
				
				if(callBack){
					script.onload = function(){
						//If all the dependencies are loaded --> callback
						if(++loadedDependenciesNum === dependencies.length){
							callBack();
						}
					}
				}
				
				bodyTag.appendChild(script);
			}

			return this;
		},
		
		/**
		 * Check a tag attribute as flag
		 * @param  {DOM Element} element 
		 * @param  {String} attributeName 
		 * @return {Boolean}
		 */
		_checkTagAttribute : function(element, attributeName){
			return element.getAttribute(attributeName)!==null ? (element.getAttribute(attributeName)==='true' || element.getAttribute(attributeName)==='') : false;
		},

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

			return this;
		},

		/**
		 * Set an App page
		 * @param {String} name Page name
		 */
		setPage : function(name, element){			
			this._pages[name] = new Page(name, element);


			return this;
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

			return this;
		},

		/**
		 * Get the current App page
		 * @param  {String} name Page name
		 * @return {Object}      Page
		 */
		getCurrentPage : function(){
			return this._currentPage;
		},

		/**
		 * Init EspectaculApp
		 * @param  {Boolean} debug Set the debug mode
		 */
		init : function(debug){			
			var that = this;

			/* Set the debug flag */
			if(debug) this._debug = debug;

			trace('Init EspectaculApp', 'info');

			trace('Inject dependencies', 'info');

			this._injectDependencies(function(){

				trace('Register App Pages', 'info');

				/* Register app pages */
				var pageTags = _d.getElementsByTagName("page");

				for(var i=0; i<pageTags.length; i++){

					var page = pageTags[i],
						isCurrent = false;

					trace('Set Page: '+ page.id, 'info', 1);				

					//Add new page to the system
					that.setPage(page.id, page);

					//Check if has the flag 'First' (current page)
					isCurrent = that._checkTagAttribute(page, 'first');

					//Check if we have to set the first current page
					if(!that.getCurrentPage() && isCurrent){
						that.setCurrentPage(page.id);
						trace('Set as current', 'info', 2);
					}
				}

				that
				._registerEvents()
				._resamplePages();

			});
		}
	};

})(window, document);
