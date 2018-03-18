_w.esp = _w.s = {

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
            var view        = this._getViewByUrl(viewUrl);

            if (view) {
                // Disable user touching
                this._noTouch(true);

                if (!view.isLoaded()) {
                    var templateUrl           = view.getTemplateUrl();
                    var templateCommand       = templateUrl.substr(0,1);
                    var afterTemplateRenderFn = function(viewElement) {
                        // If the system is allowed to use Handlebars templates
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
                    }

                    // If we have to get the view by its id (prefix '#')
                    if (templateCommand === '#') {
                        var viewId      = templateUrl.substr(1, templateUrl.length - 1);
                        var viewElement = _d.getElementById(viewId);
                        
                        if (viewElement) {
                            afterTemplateRenderFn(viewElement);
                        } else {
                            trace('Cannot load the view by its id "' + templateUrl + '".', 'error');
                        }
                    } else if (that._handlebars) {
                        // If the system is allowed to use Handlebars templates
                        trace('Using Handlebars for render the view template', 'info', 1);
                        
                        view.raiseEvent('beforeRenderTemplate', view._params);
                        
                        var templateData = view.getTemplateData();
                        
                        // If we have to use a handlebars compiled template (prefix '@')
                        if (templateCommand === '@') {
                            view.raiseEvent('beforeRenderTemplate', view._params);
                            
                            var templateName = templateUrl.substr(1, templateUrl.length - 1);
                            trace('Using the compiled template \'' + templateName + '\'', 'info', 2);

                            var template = Handlebars.templates[templateName];
                            var viewElement = this._appendView(template(templateData));

                            afterTemplateRenderFn(viewElement);
                        } else {
                            // Load the view template
                            this._loadTemplate(view, function(status, viewElement) {
                                if (status) {
                                    view.raiseEvent('beforeRenderTemplate', view._params);
                                    
                                    if (templateData) {
                                        var template = Handlebars.compile(viewElement.innerHTML);
                                        viewElement.innerHTML = template(templateData);
                                    }
                                    
                                    afterTemplateRenderFn(viewElement);
                                } else {
                                    trace('Cannot load the view template "' + view.url + '".', 'error');
                                }
                            });
                        }
                    } else {
                        trace('Cannot load the view by its template url "' + templateUrl+ '".', 'error');
                    }
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
        var newNode    = _d.createElement('esp-header');
        var navWrapper = this.getNavWrapper();

        newNode.innerHTML = '<div class="title">'+title+'</div>';
        
        navWrapper.insertBefore(newNode, navWrapper.firstChild);

        return newNode;
    },

    _appendHeaderNode : function(headerNode) {
        var navWrapper = this.getNavWrapper();
        
        navWrapper.insertBefore(headerNode, navWrapper.firstChild);

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
        var templateUrl    = view.getTemplateUrl();
        var scriptTemplate = _d.getElementById(templateUrl),
            that = this;
        
        if (scriptTemplate) {
            trace('Loading the template from script with id \'' + templateUrl + '\'', 'info', 2);
            
            // Load the view HTML
            var viewTag = this._appendView(scriptTemplate.innerHTML);

            if (callBack) callBack(true, viewTag);
        } else {
            trace('Loading the template from file \'' + templateUrl + '\'', 'info', 2);
            
            //  Load the view HTML from external file
            this.ajax({
                url : templateUrl,
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
