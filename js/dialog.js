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

	_showDialog : function(params){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogWrapper = _d.createElement('esp-dialog-wrapper'),
			dialog = _d.createElement('esp-dialog'),
			title = _d.createElement('esp-dialog-title');


		//Set the title
		title.innerText = params.title;

		dialog.appendChild(title);
		dialogWrapper.appendChild(dialog);
		bodyTag.appendChild(dialogWrapper);

		setTimeout(function(){
			dialogWrapper.classList.add('in');
		},0);

		return this;
	},

	_hideDialog : function(callBack){
		var bodyTag = _d.getElementsByTagName('body')[0],
			dialogWrapper = _d.getElementsByTagName('esp-dialog-wrapper')[0];

		_w.esp.one(dialogWrapper, 'webkitTransitionEnd transitionEnd', function(event){
			bodyTag.removeChild(dialogWrapper);
			callBack();
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

			this._showDialog(params);

		}else{
			this._queue.push(params);
		}

		return this;
	},

	close : function(){
		
		if(this._isOpen){
			var that = this;

			this._hideDialog(function(){
				if(that._queue.length < 1){
					that._hideBackground();
					that._isOpen = false;
				}else{
					that._showDialog(that._queue.shift());
				}
			});
		}

		return this;
	}
};