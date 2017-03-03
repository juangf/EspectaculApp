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