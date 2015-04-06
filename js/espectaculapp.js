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

		/* App navigation header wrapper */
		_navWrapper : null,

		/* App view wrapper */
		_viewWrapper : null,

		/* App views config */
		_views : {},

		/* App current view */
		_currentView : null,

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
		 * Find a view by an url
		 * @param  {[type]} url [description]
		 * @return {[type]}     [description]
		 */
		_getViewByUrl : function(url){
			for(var key in this._views){
				if(this._views[key].url === url){
					return this._views[key];
				}
			}

			return null;
		},

		/**
		 * Transition between two views
		 * @param  {[type]} inView  [description]
		 * @param  {[type]} outView [description]
		 * @param  {[type]} callBack [description]
		 * @return {[type]}          [description]
		 */
		_viewsTransition : function(inView, outView, callBack){
			var inViewElement = inView.viewElement,
					outViewElement = outView ? outView.viewElement : null,
					transition = inView.transition ? inView.transition : 'fade';

			this.one(inViewElement, 'webkitAnimationEnd animationEnd', function(event){
				inViewElement.classList.remove(transition);
				inViewElement.classList.remove('in');
				
				callBack(inView);
			});

			inViewElement.className = 'current '+transition+' in';

			if(outViewElement){

				this.one(outViewElement, 'webkitAnimationEnd animationEnd', function(event){
					outViewElement.className = '';
				});

				outViewElement.className = 'current '+transition+' out';
			}
		},

		/**
		 * [_appNavigation description]
		 * @param  {[type]} viewId [description]
		 * @return {[type]}         [description]
		 */
		_appNavigation : function(viewUrl) {
			var that = this;

			if(!this._currentView || this._currentView.url !== viewUrl){
				var view = this._getViewByUrl(viewUrl);

				if(view){

					if(!view.loaded){
						//Load the view template
						this._loadTemplate(view, function(status, viewElement){
							if(status){
								view.viewElement = viewElement;
								view.loaded = true;	

								//If there is navigation top header, add 'has-header' class to content
								if(that._navWrapper){
									var contentElements = viewElement.getElementsByTagName('esp-content');

									if(contentElements.length){
										contentElements[0].classList.add('has-header');
									}else{
										trace('Cannot find an "esp-content" tag".', 'error');
									}							
								}							

								that._viewsTransition(view, that._currentView, function(newCurrentView){
									that._currentView = newCurrentView;
								});

							}else{
								trace('Cannot load the view template "'+view.url+'".', 'error');
							}
						});
					}else{

						that._viewsTransition(view, that._currentView, function(newCurrentView){
							that._currentView = newCurrentView;
						});
					}

				}else{
					trace('Cannot find the view "'+viewUrl+'".', 'error');
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

		on : function(target, type, callBack){
			var types = type.split(' ');

			for(var i=0; i<types.length; i++){
				target.addEventListener(types[i], callBack, false);	
			}
		},

		off : function(target, type, callBack){
			var types = type.split(' ');

			for(var i=0; i<types.length; i++){
				target.removeEventListener(types[i], callBack);	
			}
		},

		one : function(target, type, callBack){
			var that = this,
			newCallBackFn = function(event){
				that.off(target, type, newCallBackFn);
				callBack(event);
			};

			this.on(target, type, newCallBackFn);
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
		 * Go to an specified view
		 * @param  {[type]} viewId [description]
		 * @return {[type]}         [description]
		 */
		goTo : function(viewId){
			if(this._views.hasOwnProperty(viewId)){
				window.location = '#' + viewId;
			}else{
				trace('The view id "'+viewId+'" does not exist.', 'error');					
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
		 * Append a new view from an HTML text
		 * @param  {[type]} viewHTML [description]
		 * @return {[type]}          [description]
		 */
		_appendView : function(viewHTML){
			var newNode = _d.createElement('div');

			newNode.innerHTML = viewHTML;

			var viewTag = newNode.getElementsByTagName('esp-view')[0];

			this._viewWrapper.appendChild(viewTag);

			return viewTag;
		},

		/**
		 * Load App template by View object
		 * @param  {[type]} view [description]
		 * @return {[type]}       [description]
		 */
		_loadTemplate : function(view, callBack){
			//Check if there is a template <script>
			var scriptTemplate = _d.getElementById(view.templateUrl),
				that = this;
			
			if(scriptTemplate){
				//Load the view HTML
				var viewTag = this._appendView(scriptTemplate.innerHTML);

				if(callBack) callBack(true, viewTag);
			}else{

				// Load the view HTML from external file
				this.ajax({
					url : view.templateUrl,
					success : function(data){
						var viewTag = that._appendView(data);

						if(callBack) callBack(true, viewTag);
					},
					error : function(xhr, status){
			           	if(status == 400) {
			              trace('The view template does not exist.', 'error');
			           	}
			           	else {
			              trace('Cannot load view template.', 'error');					
						}

						if(callBack) callBack(false);
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

			//Set the navigation wrapper (if exists)
			var navWrapper = _d.getElementsByTagName('esp-nav-wrapper');			
			if(navWrapper.length){
				this._navWrapper = navWrapper[0];
			}

			// Work the app views
			if(params.views){
				//Save internaly
				this._views = params.views;

				//check the "fistView" param
				if(params.firstView){
					if(this._views.hasOwnProperty(params.firstView)){
						_w.location = '#'+params.firstView;
					}else{
						trace('The first view "'+params.firstView+'" does not exist.', 'error');
					}
				}else{
					//If the "firstRout2e param is not defined, get the first defined.
					var viewsKeys = Object.keys(this._views);

					_w.location = '#'+viewsKeys[0];
				}
			}else{
				trace('views values fault.', 'error');				
			}

		}
	};

})(window, document);
