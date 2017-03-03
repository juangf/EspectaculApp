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