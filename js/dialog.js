_w.esp.dialog = {
	_queue : [],	
	_isOpen : false,
	_showBackground : function(){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogBg = _d.createElement('esp-dialog-bg');

		bodyTag.appendChild(dialogBg);

		setTimeout(function(){
			dialogBg.classList.add('in');
		},0);

		return this;
	},
	
	_hideBackground : function(){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogBg = _d.getElementsByTagName('esp-dialog-bg')[0];

		_w.esp.one(dialogBg, 'webkitTransitionEnd transitionEnd', function(event){
			bodyTag.removeChild(dialogBg);
		});

		dialogBg.classList.remove('in');

		return this;
	},

	_showDialogWrapper : function(){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogWrapper = _d.createElement('esp-dialog-wrapper');

		bodyTag.appendChild(dialogWrapper);

		return this;
	},

	_showDialog : function(){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogWrapper = _d.createElement('esp-dialog-wrapper'),
			dialog = _d.createElement('esp-dialog');

		dialogWrapper.appendChild(dialog);
		bodyTag.appendChild(dialogWrapper);

		setTimeout(function(){
			dialogWrapper.classList.add('in');
		},0);

		return this;
	},

	_hideDialog : function(){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogWrapper = _d.getElementsByTagName('esp-dialog-wrapper')[0];

		_w.esp.one(dialogWrapper, 'webkitTransitionEnd transitionEnd', function(event){
			bodyTag.removeChild(dialogWrapper);
		});

		dialogWrapper.classList.remove('in');

		return this;
	},

	show : function(params){
		/*
			Parameters Object properties:
			title - mandatory
			content - mandatory

		*/

		//If is not displaying a dialog
		if(!this._isOpen){
			this._showBackground();
			this._isOpen = true;

			this
			._showDialog();


		//If yes, add the new dialog to the queue
		}else{
			this._queue.push(params);
		}

		return this;
	},

	hide : function(){
		if(this._isOpen){
			
			this._hideDialog();	

			if(this._queue.length < 1){				
				this._hideBackground();
				this._isOpen = false;
			}
		}
		return this;
	}
};