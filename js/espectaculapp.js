/*! EspectaculApp v0.0.1 ~ (c) 2015 Juan García Fernández (@juan_gf) ~ http://www.espectaculapp.com */
"use strict";
(function(_w, _d){
	function trace(message, type){
		app.trace(message, type);
	}
	_w.app = {
		_debug : false,
		_pages : {},
		trace : function(message, type){
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
		setPage : function(name){
			trace('Set Page: '+ name, 'info');
			this._pages[name] = {
				name : name
			};
		},
		getPage : function(name){
			return this._pages[name];	
		},
		getPages : function(){
			return this._pages;	
		},
		init : function(debug){
			/* Set the debug flag */
			if(debug) this._debug = debug;

			/* Register app pages */
			var pageTags = _d.getElementsByTagName("page");
			for(var i=0; i<pageTags.length; i++)
			{
				var page = pageTags[i];
				
				this.setPage(page.id);		
			}
		}
	};

})(window, document);