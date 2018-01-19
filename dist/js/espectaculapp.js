"use strict";(function(_w, _d){_w.esp = _w.s = {

    _events : {},

    /**
     * Custom addEventListener
     * @param {[type]} eventName [description]
     * @param {[type]} callBack  [description]
     */
    addEventListener : function(eventName, callBack) {
        var events = this._events,
            callBacks = events[eventName] = events[eventName] || [];
        callBacks.push(callBack);

        return true;
    },

    /**
     * Custom removeEventListener
     * @param {[type]} eventName [description]
     * @param {[type]} callBack  [description]
     */
    removeEventListener : function(eventName, callBack) {
        var callBacks = this._events[eventName];

        for (var i = 0, l = callBacks.length; i < l; i++) {
            if (callBacks[i].toString() === callBack.toString()) {
                view._events[eventName].splice(i, 1);   
                return true;
            }                       
        }
        return false;
    },

    /**
     * Custom raiseEvent
     * @param {[type]} eventName [description]
     * @param {[type]} callBack  [description]
     */
    raiseEvent : function(eventName, args) {
        var callBacks = this._events[eventName];

        if (callBacks)
        for (var i = 0, l = callBacks.length; i < l; i++) {
            callBacks[i].apply(this, [args]);
        }

        return true;
    },

    /**
     * Register system events
     */
    _registerEvents : function() {
        var that = this;

        // On Hash change
        _w.onhashchange = function() {
            that._appNavigation(_w.location.hash.substr(1));
        };

        // Touching control system
        this._registerTouchEvents();

        /*_w.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('------------------- TOUCH ---------------');
        };*/

        return this;
    },

    /**
     * Find a view by an url
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    _getViewByUrl : function(url) {
        for (var key in this._views) {

            if (this.getView(key).getUrl() === url) {
                return this.getView(key);
            }
        }

        return null;
    },

    _noTouch : function(val) {
        var bodyTag = _d.getElementsByTagName('body')[0],
            disableNode = _d.getElementsByTagName('disable-touch');

        if (val) {
            if(!disableNode.length) {
                var disableNode = _d.createElement('disable-touch');
                bodyTag.appendChild(disableNode);
            }
        } else {
            if (disableNode.length) {
                bodyTag.removeChild(disableNode[0]);
            }
        }       

        return this;
    },

    /**
     * Transition between two views
     * @param  {[type]} inView  [description]
     * @param  {[type]} outView [description]
     * @param  {[type]} callBack [description]
     * @return {[type]}          [description]
     */
    _viewsTransition : function(inView, outView, callBack) {
        var inViewElement = inView.getElement(),
            inViewIsFullscreen = inViewElement.classList.contains('fullscreen'),
            outViewElement = outView ? outView.getElement() : null,
            outViewIsFullscreen = outViewElement ? outViewElement.classList.contains('fullscreen') : false,
            transition = inView.getTransition() ? inView.getTransition() : 'fade';          

        // If the user put an specified transition on the goTo
        if (this._userTransition) {
            transition = this._userTransition;
            this._userTransition = null;
        }

        // Call to view beforeShow event
        inView.raiseEvent('beforeShow', inView._params);

        this.one(inViewElement, 'webkitAnimationEnd animationEnd', function(event) {
            var transitionClasses = transition.split(' ');

            for (var i = 0; i < transitionClasses.length; i++) {
                inViewElement.classList.remove(transitionClasses[i]);
            }
            
            inViewElement.classList.remove('in');
            
            // Call to view show event
            inView.raiseEvent('show', inView._params);

            callBack(inView);
        });

        inViewElement.className = 'current ' + transition +' in' + (inViewIsFullscreen ? ' fullscreen' : '');

        // In header
        if (inView.getHeader())
        inView.getHeader().getElement().classList.add('current');

        if (outViewElement) {
            var that = this;
            // Call to view beforeHide event
            outView.raiseEvent('beforeHide', outView._params);

            this.one(outViewElement, 'webkitAnimationEnd animationEnd', function(event) {
                var className = outViewIsFullscreen ? 'fullscreen' : '';
                
                // If the user wants to mantain visible the outer view
                if (that._previousViewStayVisible) {
                    className+=' visible';

                    that._previousViewStayVisible = false;
                }

                outViewElement.className = className; 

                // Call to view hide event
                outView.raiseEvent('hide', outView._params);

                // Reset params
                outView._params = null;
            }); 

            outViewElement.className = 'current ' + transition + ' out' + (outViewIsFullscreen ? ' fullscreen' : '');

            // out header
            if (outView.getHeader())
            outView.getHeader().getElement().classList.remove('current');
        }
    },
    
    /**
     * Show the app navigation header and prepare the view
     * @param  {[type]} view [description]
     * @return {[type]}      [description]
     */
    _showHeader : function(view) {
        var bottomWrapper  = this.getNavWrapper();
        var contentElement = view.getElement().getElementsByTagName('esp-content')[0];
        
        bottomWrapper.classList.remove('hide');
        contentElement.classList.add('has-header');
    },

    /**
     * Hide the app navigation header and prepare the view
     * @param  {[type]} view [description]
     * @return {[type]}      [description]
     */    
    _hideHeader : function(view) {
        var bottomWrapper  = this.getNavWrapper();
        var contentElement = view.getElement().getElementsByTagName('esp-content')[0];
        
        bottomWrapper.classList.add('hide');
        contentElement.classList.remove('has-header');
    },

    /**
     * Show the app bottom and prepare the view
     * @param  {[type]} view [description]
     * @return {[type]}      [description]
     */
    _showBottom : function(view) {
        var bottomWrapper  = this.getBottomWrapper();
        var contentElement = view.getElement().getElementsByTagName('esp-content')[0];
        
        bottomWrapper.classList.remove('hide');
        contentElement.classList.add('has-bottom');
    },
    
    /**
     * Hide the app bottom and prepare the view
     * @param  {[type]} view [description]
     * @return {[type]}      [description]
     */
    _hideBottom : function(view) {
        var bottomWrapper  = this.getBottomWrapper();
        var contentElement = view.getElement().getElementsByTagName('esp-content')[0];
        
        bottomWrapper.classList.add('hide');
        contentElement.classList.remove('has-bottom');
    },

    /**
     * [_appNavigation description]
     * @param  {[type]} viewId [description]
     * @return {[type]}         [description]
     */
    _appNavigation : function(viewUrl) {
        var that = this;

        if (viewUrl === '') return this;

        if (!this._currentView || this._currentView.url !== viewUrl) {
            var view = this._getViewByUrl(viewUrl);

            if (view) {
                // Disable user touching
                this._noTouch(true);

                if (!view.isLoaded()) {
                    // Load the view template
                    this._loadTemplate(view, function(status, viewElement) {
                        if (status) {

                            // If the system is allowed to use Handlebars templates
                            if (that._handlebars) {
                                view.raiseEvent('beforeRenderTemplate', view._params);
                                
                                var templateData = view.getTemplateData();

                                if (templateData) {
                                    var template = Handlebars.compile(viewElement.innerHTML);
                                    viewElement.innerHTML = template(view.getTemplateData());
                                }
                            }

                            view
                            .setElement(viewElement)
                            .setIsLoaded(true)
                            .raiseEvent('load', view._params);

                            var contentElements = viewElement.getElementsByTagName('esp-content');
                            
                            if (contentElements.length) {
                                var navWrapper = that.getNavWrapper();
                                var bottomWrapper = that.getBottomWrapper();
                                
                                // If there is navigation top header, add 'has-header' class to content
                                if (navWrapper) {
                                    var title = view.getElement().getAttribute('view-title');

                                    // Check if the view has an personalized header
                                    var headerElement = viewElement.getElementsByTagName('esp-header');

                                    // If the view has its own header, put it and set the title
                                    if (headerElement.length) {
                                        var header = new AppHeader();
                                        
                                        header.setElement(that._appendHeaderNode(headerElement[0]));
                                        
                                        if (title) {
                                            header.setTitle(title);
                                        }
                                        
                                        view.setHeader(header);
                                        that._showHeader(view);
                                    } else if (title) {
                                        var header = new AppHeader(title);
                                        
                                        header.setElement(that._appendHeader(title));
                                        
                                        view.setHeader(header);
                                        that._showHeader(view);
                                    } else {
                                        that._hideHeader(view);
                                    }
                                }
                                
                                // If there is the app bottom wrapper, add 'has-bottom' class to content
                                if (bottomWrapper) {
                                    var bottomFlag = viewElement.getAttribute('view-bottom');
                                    
                                    if (bottomFlag !== 'false' && bottomFlag !== '0') {
                                        
                                        // Check if the view has an personalized bottom
                                        var bottomElement = viewElement.getElementsByTagName('esp-bottom');
                                        var bottom = new AppBottom();
                                        
                                        contentElements[0].classList.add('has-bottom');
                                        
                                        if (bottomElement.length) {
                                            bottom.setElement(that._appendBottomNode(bottomElement[0]));
                                        } else {
                                            var bottomNode = that._getBotomNode();
                                            
                                            if (bottomNode) {
                                                bottom.setElement(bottomNode);
                                            }
                                        }
                                        
                                        view.setBottom(bottom);
                                        that._showBottom(view);
                                    } else {
                                        that._hideBottom(view);
                                    }
                                }
                            } else {
                                trace('Cannot find an "esp-content" tag".', 'error');
                            }

                            // Prepare View System Tags
                            view.prepareSystemTags();

                            // Run the views transitions
                            that._viewsTransition(view, that.getCurrentView(), function(newCurrentView) {
                                // Set the current and previous views
                                that
                                .setPreviousView(that.getCurrentView())
                                .setCurrentView(newCurrentView)
                                ._noTouch(false);
                            });

                        } else {
                            trace('Cannot load the view template "'+view.url+'".', 'error');
                        }
                    });
                } else {
                    // Show or hide the header if the view has it          
                    if (view.getHeader()) {
                        that._showHeader(view);
                    } else {
                        that._hideHeader(view);
                    }
                    
                    // Show or hide the bottom if the view has it          
                    if (view.getBottom()) {
                        that._showBottom(view);
                    } else {
                        that._hideBottom(view);
                    }
                    
                    that._viewsTransition(view, that.getCurrentView(), function(newCurrentView) {
                        // Set te previous view value
                        that.setPreviousView(that.getCurrentView());

                        that
                        .setCurrentView(newCurrentView)
                        ._noTouch(false);
                    });
                }

            } else {
                trace('Cannot find the view "'+viewUrl+'".', 'error');
            }
        }

        return this;
    },

    /**
     * Inject the system dependencies
     * @param  {function} callBack A callback function
     */
    _injectDependencies : function(callBack) {
        var dependencies = [
            "js/Page.js"
        ],          
        loadedDependenciesNum = 0,
        bodyTag = _d.getElementsByTagName('body')[0];

        // Load each dependency
        for (var i=0; i<dependencies.length; i++) {
            var script = _d.createElement('script');

            script.src = dependencies[i];

            trace('Injecting "'+script.src+'"', 'info', 1);
            
            if (callBack) {
                script.onload = function() {
                    // If all the dependencies are loaded --> callback
                    if (++loadedDependenciesNum === dependencies.length) {
                        callBack();
                    }
                }
            }
            
            bodyTag.appendChild(script);
        }

        return this;
    },



    getViews : function() {
        return this._views;
    },

    setViews : function(views) {
        this._views = views;
        return this;
    },

    setCurrentView : function(view) {
        this._currentView = view;
        return this;
    },

    getCurrentView : function() {
        return this._currentView;
    },

    setPreviousView : function(view) {
        this._previousView = view;
        return this;
    },

    getPreviousView : function() {
        return this._previousView;
    },

    setFirstView : function(view) {
        this._firstView = view;
        return this;
    },

    getFirstView : function() {
        return this._firstView;
    },

    setNavWrapper : function(w) {
        this._navWrapper = w;
        return this;
    },
    
    setBottomWrapper : function(w) {
        this._bottomWrapper = w;
        return this;
    },

    getNavWrapper : function() {
        return this._navWrapper;
    },
    
    getBottomWrapper : function() {
        return this._bottomWrapper;
    },

    getViewWrapper : function() {
        return this._viewWrapper;
    },

    getView : function(viewId) {
        if (this._views.hasOwnProperty(viewId)) {
            return this._views[viewId];
        } else {
            trace('The view id "'+viewId+'" does not exist.', 'error');                 
        }

        return null;        
    },

    /**
     * Go to an specified view
     * @param  {[type]} viewId [description]
     * @return {[type]}         [description]
     */
    goTo : function(viewId, options) {
        // transition, stayVisible
        if (this._views.hasOwnProperty(viewId)) {
            if (options) {
                // Set the wanted user transition
                if (options.transition) this._userTransition = options.transition;

                // Set to mantain the current view visible
                if (options.stayVisible) this._previousViewStayVisible = options.stayVisible;

                // Set the params object available in view event
                if (options.params) {
                    this.getView(viewId)._params = {params: options.params};
                }
            }

            window.location = '#' + viewId;
        } else {
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
        return element.getAttribute(attributeName) !== null ? (element.getAttribute(attributeName) === 'true' || element.getAttribute(attributeName) === '') : false;
    },

    /**
     * Console log helper
     * @param  {String} message   Console message
     * @param  {String} type      Message Type ('info' | 'error' | 'warn')
     * @param  {Integer} indentNum Message indentation
     */
    trace : function(message, type, indentNum){
        if (indentNum){
            var indent = "";

            for (var i=1; i<indentNum; i++) {
                indent += "  ";
            }

            message = indent + '└──> ' + message;
        }

        if (this._debug) {
            switch(type) {
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
    _appendView : function(viewHTML) {
        var newNode = _d.createElement('div');

        newNode.innerHTML = viewHTML;

        var viewTag = newNode.getElementsByTagName('esp-view')[0];

        this._viewWrapper.appendChild(viewTag);

        return viewTag;
    },

    _appendHeader : function(title) {
        var newNode = _d.createElement('esp-header');

        newNode.innerHTML = '<div class="title">'+title+'</div>';
        
        this.getNavWrapper().appendChild(newNode);

        return newNode;
    },

    _appendHeaderNode : function(headerNode) {
        this.getNavWrapper().appendChild(headerNode);

        return headerNode;
    },
    
    _appendBottom : function() {
        var newNode = _d.createElement('esp-bottom');
        
        this.getBottomWrapper().appendChild(newNode);

        return newNode;
    },
    
    _appendBottomNode : function(bottomNode) {
        this.getBottomWrapper().appendChild(bottomNode);

        return bottomNode;
    },
    
    _getBotomNode : function() {
        var bottomNode =  this.getBottomWrapper().getElementsByTagName('esp-bottom');
        
        if (bottomNode.length) {
            return bottomNode[0];
        }
        
        return null;
    },

    /**
     * Load App template by View object
     * @param  {[type]} view [description]
     * @return {[type]}       [description]
     */
    _loadTemplate : function(view, callBack) {
        // Check if there is a template <script>
        var scriptTemplate = _d.getElementById(view.getTemplateUrl()),
            that = this;
        
        if (scriptTemplate) {
            // Load the view HTML
            var viewTag = this._appendView(scriptTemplate.innerHTML);

            if (callBack) callBack(true, viewTag);
        } else {

            //  Load the view HTML from external file
            this.ajax({
                url : view.getTemplateUrl(),
                success : function(data){
                    var viewTag = that._appendView(data);

                    if (callBack) callBack(true, viewTag);
                },
                error : function(xhr, status){
                    if (status == 400) {
                      trace('The view template does not exist.', 'error');
                    } else {
                      trace('Cannot load view template.', 'error');                 
                    }

                    if (callBack) callBack(false);
                }
            });

        }

        return this;
    },

    /**
     * [_prepareViews description]
     * @param {[type]} views [description]
     */
    _prepareViews : function(viewsData, handlebarsTemplates) {
        for(var key in viewsData){
            var viewData = viewsData[key],
                events = viewData.events,
                view = new AppView(key);

            if (viewData.url)
                view.setUrl(viewData.url);
            else {
                trace('The view "' + view.getName() + '" needs an url.', 'error');
                return false;
            }

            if (viewData.templateUrl)
                view.setTemplateUrl(viewData.templateUrl);
            else {
                trace('The view "' + view.getName() + '" needs a template url.', 'error');
                return false;
            }

            if (viewData.transition)
            view.setTransition(viewData.transition);

            // if there are predefined events in the config
            if (events) {
                if (events.load) this.on(view, 'load', events.load);
                if (events.show) this.on(view, 'show', events.show);
                if (events.hide) this.on(view, 'hide', events.hide);
                if (events.beforeShow) this.on(view, 'beforeShow', events.beforeShow);
                if (events.beforeHide) this.on(view, 'beforeHide', events.beforeHide);
            }

            // If there is template data
            if (handlebarsTemplates && viewData.templateData) {
                view.setTemplateData(viewData.templateData());
            }

            this._views[key] = view;

        }
    },

    /**
     * Configure EspectaculApp
     */
    config : function(params) {          
        var that = this;

        //  Set the debug flag
        if (params.debugMode) {
            // Store the flag
            this._debug = params.debugMode;
        }

        trace('Configure EspectaculApp.', 'info');

        // Register basic events
        this._registerEvents();

        // Set the view wrapper
        this._viewWrapper = _d.getElementsByTagName('esp-view-wrapper')[0];

        // Set the navigation wrapper (if exists)
        var navWrapper = _d.getElementsByTagName('esp-nav-wrapper');    
        
        // Set the bottom wrapper (if exists)
        var bottomWrapper = _d.getElementsByTagName('esp-bottom-wrapper');    

        // Set if we must use handlebars
        this._handlebars = params.handlebarsTemplates !== undefined ? params.handlebarsTemplates : true;

        // Set if we have to simulate touch event
        this._simulateTouch = params.simulateTouch !== undefined ? params.simulateTouch : false;

        if (navWrapper.length) {
            this.setNavWrapper(navWrapper[0]);
        }
        
        if (bottomWrapper.length) {
            this.setBottomWrapper(bottomWrapper[0]);
        }

        //  Work the app views
        if (params.views) {
            // Prepare the system views
            this._prepareViews(params.views, this._handlebars);

            // check the "fistView" param
            if (params.firstView) {
                if (this.getViews().hasOwnProperty(params.firstView)) {
                    this.setFirstView(this.getView([params.firstView]));
                } else {
                    trace('The first view "'+params.firstView+'" does not exist.', 'error');
                }
            }

        } else {
            trace('views values fault.', 'error');              
        }

    },

    /**
     * [init description]
     * @return {[type]} [description]
     */
    init : function() {
        trace('Init EspectaculApp.', 'info');

        if (this._debug) {
            // Reset the location hash for easy manual window refreshing
            _w.location.hash = '';
        }

        // check the "fistView" param
        if (!this.getFirstView()) {
            // If the "firstRout2e param is not defined, get the first defined.
            var viewsKeys = Object.keys(this.getViews());

            this.setFirstView(this.getView([viewsKeys[0]]));
        }
    
        if (this._debug) {
            var that = this;
            setTimeout(function() {
                _w.location = '#'+that.getFirstView().getUrl();
            },0);
        } else {
            _w.location = '#'+this.getFirstView().getUrl();
        }
                    
    }
};

/*! 
* EspectaculApp ~ (c) 2017 ~ http://www.espectaculapp.com
* Juan García Fernández (@juan_gf) 
* AppBottom Class
*/
function AppBottom() {
    this._element = null;

    this.setElement = function(element) {
        this._element = element;
        return this;
    };

    this.getElement = function() {
        return this._element;
    };
    
    this.hide = function() {
        this._element.parentElement.classList.add('hide');
    };
    
    this.show = function() {
        this._element.parentElement.classList.remove('hide');
    };
}
/*! 
* EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
* Juan García Fernández (@juan_gf) 
* AppHeader Class
*/
function AppHeader(title) {
    this._title = title;
    this._element = null;

    this.setElement = function(element) {
        this._element = element;
        return this;
    };

    this.getElement = function() {
        return this._element;
    };

    this.setTitle = function(title) {
        this._title = title;

        var titleElement = this._element.getElementsByClassName('title');

        if (titleElement.length) {
            this._element.getElementsByClassName('title')[0].innerHTML = title;
        }

        return this;
    };

    this.getTitle = function() {
        return this._title;
    };
    
    this.hide = function() {
        this._element.parentElement.classList.add('hide');
    };
    
    this.show = function() {
        this._element.parentElement.classList.remove('hide');
    };
}
/*! 
 * EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
 * Juan García Fernández (@juan_gf) 
 * AppList Class
 */
function AppList(element) {

    this._element = null;

    this._pullToRefresh = {
        listTop : 0,
        touchTop : 0,
        loadingBox : null,
        PTR_MAX_BOX_HEIGHT : 100
    };

    this._init = function() {
        var list = this._element,
            that = this;

        if (s._checkTagAttribute(list, 'pull-to-refresh')) {

            trace('Pull to refresh detected.', '', 2);                          

            var ptrLoadingBox = _d.createElement('esp-list-ptr-loading-box');

            ptrLoadingBox.innerHTML = '<i class="fa fa-arrow-down"></i>';

            list.parentNode.insertBefore(ptrLoadingBox, list);

            list.addEventListener("touchstart", function(e) {
                if (list.scrollTop === 0){

                    that._pullToRefresh.listTop = list.getBoundingClientRect().top;
                    that._pullToRefresh.touchTop = e.touches[0].clientY;

                    that._pullToRefresh.loadingBox = ptrLoadingBox;

                    if (that._pullToRefresh.loadingBox.classList.contains('closeAnim')) {
                        that._pullToRefresh.loadingBox.classList.remove('closeAnim');
                        list.classList.remove('closeAnim');
                    }
                }
            });

            list.addEventListener("touchmove", function(e) {

                if (that._pullToRefresh.loadingBox) {
                    var touch = e.touches[0];
                    var ptrBoxHeight = touch.clientY - that._pullToRefresh.touchTop;

                    if (ptrBoxHeight > 0) {
                        e.preventDefault();
                    }

                    if (ptrBoxHeight <= that._pullToRefresh.PTR_MAX_BOX_HEIGHT) {

                        if (that._pullToRefresh.loadingBox.classList.contains('refresh')) {
                            that._pullToRefresh.loadingBox.classList.remove('refresh');
                        }

                    } else {
                        
                        if (!that._pullToRefresh.loadingBox.classList.contains('refresh')) {
                            that._pullToRefresh.loadingBox.classList.add('refresh');
                        }

                    }

                    that._pullToRefresh.loadingBox.style.height = ptrBoxHeight+'px';
                    that._pullToRefresh.loadingBox.style.lineHeight = that._pullToRefresh.loadingBox.style.height;
                    list.style.top = that._pullToRefresh.loadingBox.style.height;
                }

            });

            list.addEventListener("touchend", function(e) {
                if (that._pullToRefresh.loadingBox) {

                    if (that._pullToRefresh.loadingBox.classList.contains('refresh')) {
                        that._pullToRefresh.loadingBox.classList.remove('refresh');

                        //Raise event
                        this.dispatchEvent(
                            new CustomEvent("pullToRefresh", {})    
                        );
                    }

                    that._pullToRefresh.loadingBox.classList.add('closeAnim');
                    that._pullToRefresh.loadingBox.style.height = '';
                    this.classList.add('closeAnim');
                    this.style.top = '';

                    that._pullToRefresh.loadingBox = null;
                }
            });
        }
    }

    this.setElement = function(element) {
        this._element = element;

        this._init();

        return this;
    };

    this.getElement = function() {
        return this._element;
    };

    //Constructor
    if (element) {
        this.setElement(element);
    }
}
/*! 
 * EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
 * Juan García Fernández (@juan_gf) 
 * AppView Class
 */
function AppView(name) {

    this._events = {};

    this._name = name;

    this._url = '';

    this._transition = 'fade';

    this._templateUrl = '';

    this._loaded = false;

    this._element = null;

    this._header = null;
    
    this._bottom = null;

    this._templateData = null;

    this._params = null;

    this.systemTags = {
        lists : []
    }

    this.addEventListener = function(eventName, callBack) {
        var events = this._events,
            callBacks = events[eventName] = events[eventName] || [];
        callBacks.push(callBack);

        return true;
    };

    this.removeEventListener = function(eventName, callBack) {
        var callBacks = this._events[eventName];

        for (var i = 0, l = callBacks.length; i < l; i++) {
            if (callBacks[i].toString() === callBack.toString()) {
                view._events[eventName].splice(i, 1);   
                return true;
            }                       
        }
        return false;
    };

    this.raiseEvent = function(eventName, args) {
        var callBacks = this._events[eventName];

        if (callBacks)
        for (var i = 0, l = callBacks.length; i < l; i++) {
            callBacks[i].apply(this, [args]);
        }

        return true;
    };

    this.setTemplateData = function(templateData) {
        this._templateData = templateData;
        return this;
    };

    this.getTemplateData = function() {
        return this._templateData;
    };

    this.setHeader = function(header) {
        this._header = header;
        return this;
    };

    this.getHeader = function() {
        return this._header;
    };
    
    this.setBottom = function(bottom) {
        this._bottom = bottom;
        return this;
    };

    this.getBottom = function() {
        return this._bottom;
    };

    this.setTransition = function(trans) {
        this._transition = trans;
        return this;
    };

    this.getTransition = function() {
        return this._transition;
    };

    this.setTemplateUrl = function(turl) {
        this._templateUrl = turl;
        return this;
    };

    this.getTemplateUrl = function() {
        return this._templateUrl;
    };

    this.setElement = function(element) {
        this._element = element;
        return this;
    };

    this.getElement = function() {
        return this._element;
    };

    this.getName = function() {
        return this._name;
    };

    this.setUrl = function(url) {
        this._url = url;
        return this;
    };

    this.getUrl = function() {
        return this._url;
    };

    this.setIsLoaded = function(val) {
        this._loaded = val;
        return this;
    };

    this.isLoaded = function() {
        return this._loaded;
    };

    this.unload = function() {
        var viewWrapper = _d.getElementsByTagName('esp-view-wrapper')[0];

        viewWrapper.removeChild(this._element);

        this._element = null;
        this._loaded = false;
    }; 

    this.getSystemTags = function() {
        return this.systemTags;
    };

    this.prepareSystemTags = function() {
        trace('Preparing view "'+this._name+'" system tags.', 'info');

        //Custom tags list
        var tags = ['esp-list'];
        
        
        //Check for custom tags in the view
        for (var i=0; i<tags.length; i++) {
            var tag = tags[i];          

            switch (tag) {

                case 'esp-list':
                    var lists = this._element.getElementsByTagName(tag);

                    for(var j=0; j<lists.length; j++){
                        var listEl = lists[j];
                        
                        trace('<'+tag+(listEl.hasAttribute('id')?' id="'+listEl.getAttribute('id')+'"':'')+'>', '', 1);

                        var listObj = new AppList(listEl);

                        this.systemTags.lists.push(listObj);

                    }

                break;
            }
        }
    
    };

}
_w.esp.ajax = function(params) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 ) {
        if (xmlhttp.status == 200 || xmlhttp.status == 0 /* Local file */) {
            params.success(xmlhttp.responseText);
        } else {
            params.error(xmlhttp, xmlhttp.status, 'error');
        }
    }
};

xmlhttp.open(params.method ? params.method : 'GET', params.url, params.asynch ? params.asynch : true);

if (params.headers) {
    for (var key in params.headers) {
        xmlhttp.setRequestHeader(key, params.headers[key]);
    }
}

xmlhttp.send();

return this;
};
_w.esp.dialog = {
    _queue : [],    
    _isOpen : false,
    _showBackground : function() {
        var bodyTag = _d.getElementsByTagName('body')[0],
            dialogBg = _d.createElement('esp-dialog-bg');

        bodyTag.appendChild(dialogBg);

        setTimeout(function() {
            dialogBg.classList.add('in');
        },0);

        return this;
    },
    
    _hideBackground : function() {
        var bodyTag = _d.getElementsByTagName('body')[0],
            dialogBg = _d.getElementsByTagName('esp-dialog-bg')[0];

        _w.esp.one(dialogBg, 'webkitTransitionEnd transitionEnd', function(event) {
            bodyTag.removeChild(dialogBg);
        });

        dialogBg.classList.remove('in');

        return this;
    },

    _showDialogWrapper : function() {
        var bodyTag = _d.getElementsByTagName('body')[0],
            dialogWrapper = _d.createElement('esp-dialog-wrapper');

        bodyTag.appendChild(dialogWrapper);

        return this;
    },

    _showDialog : function(params) {
        var that = this,
            bodyTag = _d.getElementsByTagName('body')[0],
            dialogWrapper = _d.createElement('esp-dialog-wrapper'),
            dialog = _d.createElement('esp-dialog'),
            title = _d.createElement('esp-dialog-title'),
            content = _d.createElement('esp-dialog-content'),
            controls = _d.createElement('esp-dialog-controls');

        //If there is no buttons defined, put a default closing dialog button
        if (!params.buttons) {
            params.buttons = [
                {
                    title : 'OK',
                    /*onPress: optional function parameter */
                }
            ];
        }

        //Process the buttons (MAX 3 buttons)
        for (var i=0; i<params.buttons.length && i<3; i++) {
            var button = params.buttons[i],
                option = _d.createElement('esp-dialog-option');

            //Set the button title
            option.innerText = button.title;            

            //Set the Press button event
            _w.esp.one(option, 'tap', button.onPress ? button.onPress : function(){that.close()});

            controls.appendChild(option);
        }

        //Set the title
        title.innerText = params.title;

        //Set the content
        content.innerHTML = params.content;     

        //Append dialog parts
        dialog.appendChild(title);
        dialog.appendChild(content);
        dialog.appendChild(controls);

        dialogWrapper.appendChild(dialog);
        bodyTag.appendChild(dialogWrapper);

        setTimeout(function(){
            dialogWrapper.classList.add('in');

            _w.esp.getViewWrapper().classList.add('blur');

            if (_w.esp.getNavWrapper()) {
                _w.esp.getNavWrapper().classList.add('blur');
            }
        },0);

        return this;
    },

    _hideDialog : function(callBack) {
        var bodyTag = _d.getElementsByTagName('body')[0],
            dialogWrapper = _d.getElementsByTagName('esp-dialog-wrapper')[0];

        _w.esp.one(dialogWrapper, 'webkitTransitionEnd transitionEnd', function(event) {
            bodyTag.removeChild(dialogWrapper);
            callBack();
        });

        dialogWrapper.classList.remove('in');       

        return this;
    },

    show : function(params) {
        /*
            Parameters Object properties:
            title   - mandatory
            content - mandatory
            okOnly  - optional
        */

        //If is not displaying a dialog
        if (!this._isOpen) {
            this._showBackground();
            this._isOpen = true;

            this._showDialog(params);

        } else {
            this._queue.push(params);
        }

        return this;
    },

    close : function() {
        
        if (this._isOpen) {
            var that = this;

            this._hideDialog(function() {
                if (that._queue.length < 1) {

                    that._hideBackground();

                    _w.esp.getViewWrapper().classList.remove('blur');

                    if (_w.esp.getNavWrapper()) {
                        _w.esp.getNavWrapper().classList.remove('blur');
                    }

                    that._isOpen = false;

                } else {
                    that._showDialog(that._queue.shift());
                }
            });
        }

        return this;
    }
};
_w.esp._events = {
    touchStartEventName : window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart',
    touchMoveEventName : window.navigator.msPointerEnabled ? 'MSPointerMove' : 'touchmove',
    touchEndEventName : window.navigator.msPointerEnabled ? 'MSPointerUp' : 'touchend', 
    tap : {
        current : null,
        onTouchStart : function(e) {
            var that = _w.esp._events.tap,
                touch = window.navigator.msPointerEnabled ? {clientX:e.layerX, clientY:e.layerY} : e.changedTouches[0];

            that.current = {
                id : touch.identifier,
                point : {
                    x : touch.clientX,
                    y : touch.clientY
                },
                time : new Date().getTime()
            };
        },
        onTouchEnd : function(e) {
            var that = _w.esp._events.tap,
                time = new Date().getTime(),
                pointsDistance = function(point1, point2) {
                  var xs = 0, ys = 0;

                  xs = point2.x - point1.x;
                  xs = xs * xs;

                  ys = point2.y - point1.y;
                  ys = ys * ys;

                  return Math.sqrt( xs + ys );
                };

            var touchPoints = window.navigator.msPointerEnabled ? [{clientX:e.layerX, clientY:e.layerY}] : e.changedTouches;

            for (var i=0; i<touchPoints.length; i++) {
                var touch = touchPoints[i];
                
                if (that.current && touch.identifier === that.current.id) {
                    if ( 
                        (time - that.current.time)<300 /* 300ms */ &&
                        pointsDistance(that.current.point, {x:touch.clientX, y:touch.clientY}) < 4 /* 4px */
                    ) { 
                        that.current = null;
                        return true;
                    }
                }
            }

            return false;
        }
    }
};

_w.esp.on = function(targetList, type, callBack) {
    var that = this,
        types = type.split(' ');
    
    if (Object.prototype.toString.call(targetList) === '[object HTMLCollection]') {
        targetList = Array.prototype.slice.call(targetList);
    } else if (Object.prototype.toString.call(targetList) !== '[object Array]') {
        targetList = [].concat(targetList);
    }   
    
    for (var j=0; j<targetList.length; j++) {
        var target = targetList[j]; 
        
        for (var i=0; i<types.length; i++) {

            if (_w.esp._simulateTouch && types[i]==='tap') {
                types[i] = 'click';
            }

            if (types[i]==='tap') {

                //Prepare tap event code
                target.addEventListener(this._events.touchStartEventName, this._events.tap.onTouchStart, false);

                target.addEventListener(this._events.touchEndEventName, function(e){                    
                    if(that._events.tap.onTouchEnd(e)){
                        callBack.apply(this, e);
                    }
                }, false);

            } else {
                target.addEventListener(types[i], callBack, false);
            }
        }

    }
};

_w.esp.off = function(targetList, type, callBack) {
    var types = type.split(' ');

    if (Object.prototype.toString.call( targetList ) === '[object HTMLCollection]') {
        targetList = Array.prototype.slice.call(targetList);
    } else if (Object.prototype.toString.call( targetList ) !== '[object Array]') {
        targetList = [].concat(targetList);
    }

    for (var j=0; j<targetList.length; j++) {
        var target = targetList[j]; 

        for (var i=0; i<types.length; i++) {

            if (_w.esp._simulateTouch && types[i]==='tap') {
                types[i] = 'click';
            }
            
            if (types[i]==='tap') {
                //Remove tap event
                target.removeEventListener(this._events.touchStartEventName, this._events.tap.onTouchStart);
                target.removeEventListener(this._events.touchEndEventName, function(e) {
                    if (that._events.tap.onTouchEnd(e)) {
                        callBack.apply(this, e);
                    }
                });
            } else {
                target.removeEventListener(types[i], callBack);
            }
        }
    }
};

_w.esp.one = function(target, type, callBack) {
    var that = this,
    newCallBackFn = function(e) {
        that.off(target, type, newCallBackFn);
        callBack.apply(this, e);
    };

    this.on(target, type, newCallBackFn);
};
/*! 
 * EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
 * Juan García Fernández (@juan_gf) 
 * Global Functions
 */
function trace(message, type, indentNum) {
    esp.trace(message, type, indentNum);
}
_w.esp.loading = {
    _isOpen : false,
    show : function(params) {
        if (!this._isOpen) {
            this._isOpen = true;

            var bodyTag = _d.getElementsByTagName('body')[0],
                loading = _d.createElement('esp-loading');

            loading.innerHTML = '<div class="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div>';

            bodyTag.appendChild(loading);

            setTimeout(function() {
                loading.classList.add('in');
            }, 0);
            
        }
        return this;
    },

    hide : function() {
        if (this._isOpen) {
            this._isOpen = false;   
            var bodyTag = _d.getElementsByTagName('body')[0],
                loading = _d.getElementsByTagName('esp-loading')[0];


            _w.esp.one(loading, 'webkitTransitionEnd transitionEnd', function(event) {
                bodyTag.removeChild(loading);
            });

            loading.classList.remove('in');
            
        }
        return this;
    }
};
_w.esp._touches = {};

_w.esp._drawTouches = false;

_w.esp._registerTouchEvents = function() {
    var that = this,
    removeTouchFn = function(e) {
        for (var i=0; i<e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];

            if (that._drawTouches) {
                var bodyTag = _d.getElementsByTagName('body')[0];

                bodyTag.removeChild(_d.getElementById('esp-finger-'+touch.identifier));
            }

            delete that._touches[touch.identifier];
        }
    };
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    _w.ontouchstart = function(e) {
        for (var i=0; i<e.changedTouches.length; i++) {
            var touch = e.changedTouches[i];

            if (that._drawTouches) {
                var touchElement = _d.createElement('esp-finger'),
                    bodyTag = _d.getElementsByTagName('body')[0];

                touchElement.setAttribute('id','esp-finger-'+touch.identifier);

                touch.color = getRandomColor();

                touchElement.style.cssText  = '-webkit-transform: translate3d('+touch.clientX+'px,'+touch.clientY+'px,0px); background-color:'+touch.color;

                bodyTag.appendChild(touchElement);
            }

            that._touches[touch.identifier] = touch;
        }       
    };
    _w.ontouchmove = function(e) {
        for (var i=0; i<e.changedTouches.length; i++) {
            var color = that._touches[e.changedTouches[i].identifier].color;
            var touch = e.changedTouches[i];

            touch.color = color;

            if (that._drawTouches) {
                var touchElement = _d.getElementById('esp-finger-'+touch.identifier);

                //touchElement.style.cssText  = 'left:'+touch.clientX+'px; top:'+touch.clientY+'px';
                touchElement.style.cssText  = '-webkit-transform: translate3d('+touch.clientX+'px,'+touch.clientY+'px,0px); background-color:'+color; 
            }
            that._touches[touch.identifier] = touch;
        }   
    };

    _w.ontouchend = _w.ontouchleave = _w.ontouchcancel = removeTouchFn;
    
};

_w.esp.getTouches = function() {
    return this._touches;
};

_w.esp.drawTouches = function(val) {
    this._drawTouches = val ? true : false;
};

/* Debug Flag */
_w.esp._debug = false;

/* App navigation header wrapper */
_w.esp._navWrapper = null;

/* App bottom wrapper */
_w.esp._bottomWrapper = null;

/* App view wrapper */
_w.esp._viewWrapper = null;

/* App views config */
_w.esp._views = {};

/* App current view */
_w.esp._currentView = null;

/* App Previous view */
_w.esp._previousView = null;

/* App first view */
_w.esp._firstView = null;

/* App is in views transition */
_w.esp._inTransition = false;

/* User Handlebars to compile templates */
_w.esp._handlebars = true;

/* Listen to 'click' events in the 'tap' event */
_w.esp._simulateTouch = false;

/* User specified transition demand */
_w.esp._userTransition = null;

/* User specified stay visible previous view on change */
_w.esp._previousViewStayVisible = false;
_w.esp.zoom = {

};
})(window, document);