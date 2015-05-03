_w.esp.on = function(target, type, callBack){
	var types = type.split(' ');

	for(var i=0; i<types.length; i++){
		target.addEventListener(types[i], callBack, false);	
	}
};

_w.esp.off = function(target, type, callBack){
	var types = type.split(' ');

	for(var i=0; i<types.length; i++){
		target.removeEventListener(types[i], callBack);	
	}
};

_w.esp.one = function(target, type, callBack){
	var that = this,
	newCallBackFn = function(event){
		that.off(target, type, newCallBackFn);
		callBack(event);
	};

	this.on(target, type, newCallBackFn);
};