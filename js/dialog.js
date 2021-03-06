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
        
        title.id = 'esp-dialog-title';

        dialog.setAttribute('aria-labelledby', 'esp-dialog-title');
        dialog.setAttribute('tabindex', '-1');

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
            
            // Add the role
            option.setAttribute('role', 'button');
            
            // Add the aria label
            option.setAttribute('aria-label', button.title);

            // Check the button Highlight flag
            if (button.highlight) {
                option.classList.add('highlight');
            }

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
            var navWrapper    = _w.esp.getNavWrapper();
            var bottomWrapper = _w.esp.getBottomWrapper();
            var viewWrapper   = _w.esp.getViewWrapper();
            
            dialogWrapper.classList.add('in');

            viewWrapper.classList.add('blur');
            viewWrapper.setAttribute('aria-hidden', true);

            if (navWrapper) {
                navWrapper.classList.add('blur');
                navWrapper.setAttribute('aria-hidden', true);
            }
            
            if (bottomWrapper) {
                bottomWrapper.classList.add('blur');
                bottomWrapper.setAttribute('aria-hidden', true);
            }
        },0);
        
        _w.esp.accessibility.setVoiceOverFocus(title);

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
                    var navWrapper    = _w.esp.getNavWrapper();
                    var bottomWrapper = _w.esp.getBottomWrapper();
                    var viewWrapper   = _w.esp.getViewWrapper();
                    
                    that._hideBackground();

                    viewWrapper.classList.remove('blur');
                    viewWrapper.removeAttribute('aria-hidden');

                    if (navWrapper) {
                        navWrapper.classList.remove('blur');
                        navWrapper.removeAttribute('aria-hidden');
                    }
                    
                    if (bottomWrapper) {
                        bottomWrapper.classList.remove('blur');
                        bottomWrapper.removeAttribute('aria-hidden');
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