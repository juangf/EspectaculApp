_w.esp._events = {
	tap : {
		current : null,
		onTouchStart : function(e){
			var that = _w.esp._events.tap,
				touch = e.changedTouches[0];

			that.current = {
				id : touch.identifier,
				point : {
					x : touch.clientX,
					y : touch.clientY
				},
				time : new Date().getTime()
			};
		},
		onTouchEnd : function(e){
			var that = _w.esp._events.tap,
				time = new Date().getTime(),
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
				
				if(that.current && touch.identifier === that.current.id){
					if( 
						(time - that.current.time)<300 &&
						pointsDistance(that.current.point, {x:touch.clientX, y:touch.clientY}) < 4
					){ 
						that.current = null;
						return true;
					}
				}
			}
			return false;
		}
	}
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
				target.addEventListener('touchstart', this._events.tap.onTouchStart, false);

				target.addEventListener('touchend', function(e){					
					if(that._events.tap.onTouchEnd(e)){
						callBack.apply(this, e);
					}
				}, false);

			}else{
				target.addEventListener(types[i], callBack, false);
			}
		}

	}
};

_w.esp.off = function(targetList, type, callBack){
	var types = type.split(' ');

	if(Object.prototype.toString.call( 'a' ) !== '[object Array]'){
		targetList = [].concat(targetList);
	}

	for(var j=0; j<targetList.length; j++){
		var target = targetList[j];	

		for(var i=0; i<types.length; i++){
			if(types[i]==='tap'){
				target.removeEventListener('touchstart', this._events.tap.onTouchStart);
				target.removeEventListener('touchend', function(e){
					if(that._events.tap.onTouchEnd(e)){
						callBack.apply(this, e);
					}
				});
			}else{
				target.removeEventListener(types[i], callBack);
			}
		}
	}
};

_w.esp.one = function(target, type, callBack){
	var that = this,
	newCallBackFn = function(e){
		that.off(target, type, newCallBackFn);
		callBack.apply(this, e);
	};

	this.on(target, type, newCallBackFn);
};