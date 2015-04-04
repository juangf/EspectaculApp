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

		/* App view wrapper */
		_viewWrapper : null,

		/* App routing config */
		_routing : {},

		/* App current route */
		_currentRoute : null,

		/**
		 * Resample registered Pages
		 */
		_resamplePages : function(){
			var width = _w.innerWidth,
				height = _w.innerHeight - this._header.clientHeight - this._footer.clientHeight;

			for(var key in this._pages){
				this._pages[key].resize(width, height);
			}

			return this;
		},

		/**
		 * Resample general ui
		 */
		_resampleUI : function(){
			/*
			if(this._header){
				_d.getElementsByTagName('body')[0].style.paddingTop = this._header.clientHeight + 'px';
			} 
			if(this._footer){
				_d.getElementsByTagName('body')[0].style.paddingBottom = this._footer.clientHeight + 'px';	
			}
			this._resamplePages();
			*/
		
			return this;
		},

		/**
		 * Register system events
		 */
		_registerEvents : function(){
			var that = this;

			//On Window resize
			_w.onresize = function(){
				that._resampleUI();
			};

			//On Hash change
			_w.onhashchange = function () {
            	that._appNavigation(_w.location.hash.substr(1));
         	};

			return this;
		},

		/**
		 * Find a route by an url
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		_getRouteByUrl : function(url){
			for(var key in this._routing){
				if(this._routing[key].url === url){
					return this._routing[key];
				}
			}

			return null;
		},

		/**
		 * [_appNavigation description]
		 * @param  {[type]} routeId [description]
		 * @return {[type]}         [description]
		 */
		_appNavigation : function(routeUrl) {
			if(!this._currentRoute || this._currentRoute.url !== routeUrl){
				var route = this._getRouteByUrl(routeUrl);

				if(route){
					this._currentRoute = route;

					//Load the route template
					this._loadTemplate(route);

				}else{
					trace('Cannot find the route "'+routeId+'".', 'error');
				}
			}

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
		 * Ajax call
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		ajax : function(params){
			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 ) {
					if(xmlhttp.status == 200){
						params.success(xmlhttp.responseText);
					}
				else{
						params.error(xmlhttp, xmlhttp.status, 'error');
					}
				}
			};

		    xmlhttp.open(params.method ? params.method : 'GET', params.url, params.asynch ? params.asynch : true);
		    xmlhttp.send();

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
		 * Append a new view from an HTML text
		 * @param  {[type]} viewHTML [description]
		 * @return {[type]}          [description]
		 */
		_appendView : function(viewHTML){
			var newNode = _d.createElement('div');

			newNode.innerHTML = viewHTML;

			this._viewWrapper.appendChild(newNode.getElementsByTagName('esp-view')[0]);
		},
		/**
		 * Load App template by Route object
		 * @param  {[type]} route [description]
		 * @return {[type]}       [description]
		 */
		_loadTemplate : function(route){
			//Check if there is a template <script>
			var scriptTemplate = _d.getElementById(route.templateUrl),
				that = this;
			
			if(scriptTemplate){
				//Load the view HTML
				this._appendView(scriptTemplate.innerHTML);

			}else{

				// Load the view HTML from external file
				this.ajax({
					url : route.templateUrl,
					success : function(data){
						that._appendView(data);
					},
					error : function(xhr, status){
			           	if(status == 400) {
			              trace('The view template does not exist.', 'error');
			           	}
			           	else {
			              trace('Cannot load view template.', 'error');					
						}
		           	}
				});

			}

			return this;
		},

		/**
		 * Init EspectaculApp
		 * @param  {Boolean} debug Set the debug mode
		 */
		init : function(params){			
			var that = this;

			// Set the debug flag
			if(params.debugMode) {
				//Store the flag
				this._debug = params.debugMode;

				//Reset the location hash for easy manual window refreshing
				_w.location.hash = '';
			}

			trace('Init EspectaculApp.', 'info');

			//Register basic events
			this._registerEvents();

			//Set the view wrapper
			this._viewWrapper = _d.getElementsByTagName('esp-view-wrapper')[0];

			// Work the app routing
			if(params.routing){
				//Save internaly
				this._routing = params.routing;

				//check the "fistRoute" param
				if(params.firstRoute){
					if(this._routing.hasOwnProperty(params.firstRoute)){
						_w.location = '#'+params.firstRoute;
					}else{
						trace('The first route "'+params.firstRoute+'" does not exist.', 'error');
					}
				}else{
					//If the "firstRout2e param is not defined, get the first defined.
					var routingKeys = Object.keys(this._routing);

					_w.location = '#'+routingKeys[0];
				}
			}else{
				trace('Routing values fault.', 'error');				
			}

		}
	};

})(window, document);
