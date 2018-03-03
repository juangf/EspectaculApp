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
    
    this._prepareLazyLoad = function() {
        var list = this._element;
        
        if (s._checkTagAttribute(list, 'lazy-load')) {
            var lazyClass = list.getAttribute('lazy-load-class');
            
            if (lazyClass) {
                var lazyItems  = _d.getElementsByClassName(lazyClass);

                for (var i = 0, len = lazyItems.length; i < len; i++) {
                    var item     = lazyItems[i];
                    var imageSrc = item.getAttribute('lazy-src');
                    var img      = new Image();

                    img.onLoad = (function() {
                        if (item.nodeName === 'IMG') {
                            item.src = item.getAttribute('lazy-src');
                        } else {
                            item.style.backgroundImage = 'url(' + item.getAttribute('lazy-src') + ')';
                        }

                        //Raise event
                        list.dispatchEvent(
                            new CustomEvent("lazyLoad", {})
                        );
                    })();
                    
                    img.src = imageSrc;
                }
            }
        }
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
            
            this._prepareLazyLoad();
        }
    }
    
    this.runLazyLoad = this._prepareLazyLoad;

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