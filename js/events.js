_w.esp._events = {
	tap : null
};

_w.esp.on = function(targetList, type, callBack){
	var that = this,
		types = type.split(' ');
	
	if(Object.prototype.toString.call( 'a' ) !== '[object Array]'){
		targetList = [].concat(targetList);
	}
	
	for(var j=0; j<targetList.length; j++){
		var target = targetList[j];	
		
		for(var i=0; i<types.length; i++){

			if(types[i]==='tap'){
				//Prepare tap event code
				target.addEventListener('touchstart', function(e){
					var touch = e.changedTouches[0];

					that._events.tap = {
						id : touch.identifier,
						point : {
							x : touch.clientX,
							y : touch.clientY
						},
						time : new Date().getTime()
					};
					
				}, false);

				target.addEventListener('touchend', function(e){
					var time = new Date().getTime(),
						pointsDistance = function( point1, point2 ){
						  var xs = 0, ys = 0;

						  xs = point2.x - point1.x;
						  xs = xs * xs;

						  ys = point2.y - point1.y;
						  ys = ys * ys;

						  return Math.sqrt( xs + ys );
						};

					for(var i=0; i<e.changedTouches.length; i++){
						var touch = e.changedTouches[i];
						
						if(that._events.tap && touch.identifier === that._events.tap.id){
							if( 
								(time - that._events.tap.time)<150 /* 150 ms */ &&
								pointsDistance(that._events.tap.point, {x:touch.clientX, y:touch.clientY}) < 4
							){ 
								callBack.bind(this)();
							}
							break;
						}
					}

					that._events.tap = null;
				}.bind(target), false);

			}else{
				target.addEventListener(types[i], callBack, false);
			}

		}

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