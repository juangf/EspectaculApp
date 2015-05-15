_w.esp.dialog = {
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

	show : function(){
		if(!this._isOpen){
			this._showBackground();
			this._isOpen = true;
		}		

		return this;
	},

	hide : function(){
		if(this._isOpen){
			this._hideBackground();
			this._isOpen = false;
		}
		return this;
	}
};