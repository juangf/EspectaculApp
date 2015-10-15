_w.esp._events = {
	touchStartEventName : window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart',
	touchMoveEventName : window.navigator.msPointerEnabled ? 'MSPointerMove' : 'touchmove',
	touchEndEventName : window.navigator.msPointerEnabled ? 'MSPointerUp' : 'touchend',	
	tap : {
		current : null,
		onTouchStart : function(e){
			var that = _w.esp._events.tap,
				touch = window.navigator.msPointerEnabled ? {clientX:e.layerX, clientY:e.layerY} : e.changedTouches[0];

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

			var touchPoints = window.navigator.msPointerEnabled ? [{clientX:e.layerX, clientY:e.layerY}] : e.changedTouches;

			for(var i=0; i<touchPoints.length; i++){
				var touch = touchPoints[i];
				
				if(that.current && touch.identifier === that.current.id){
					if( 
						(time - that.current.time)<300 /* 300ms */ &&
						pointsDistance(that.current.point, {x:touch.clientX, y:touch.clientY}) < 4 /* 4px */
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
				target.addEventListener(this._events.touchStartEventName, this._events.tap.onTouchStart, false);

				target.addEventListener(this._events.touchEndEventName, function(e){					
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
				//Remove tap event
				target.removeEventListener(this._events.touchStartEventName, this._events.tap.onTouchStart);
				target.removeEventListener(this._events.touchEndEventName, function(e){
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