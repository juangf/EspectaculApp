/*! 
 * EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
 * Juan García Fernández (@juan_gf) 
 * AppView Class
 */
function AppView(name){

	this._events = {};

	this._name = name;

	this._url = '';

	this._transition = 'fade';

	this._templateUrl = '';

	this._loaded = false;

	this._element = null;

	this._header = null;

	this._templateData = null;

	this._params = null;

	this._pullToRequest = {
		listTop : 0,
		touchTop : 0,
		loadingBox : null,
		PTR_MAX_BOX_HEIGHT : 100
	};

	this.addEventListener = function(eventName, callBack){
		var events = this._events,
			callBacks = events[eventName] = events[eventName] || [];
		callBacks.push(callBack);

		return true;
	};

	this.removeEventListener = function(eventName, callBack){
		var callBacks = this._events[eventName];

		for (var i = 0, l = callBacks.length; i < l; i++) {
		    if(callBacks[i].toString() === callBack.toString()){
		    	view._events[eventName].splice(i, 1);	
		    	return true;
		    }					    
		}
		return false;
	};

	this.raiseEvent = function(eventName, args) {
		var callBacks = this._events[eventName];

		if(callBacks)
		for (var i = 0, l = callBacks.length; i < l; i++) {
	  		callBacks[i].apply(this, [args]);
		}

		return true;
	};

	this.setTemplateData = function(templateData){
		this._templateData = templateData;
		return this;
	};

	this.getTemplateData = function(){
		return this._templateData;
	};

	this.setHeader = function(header){
		this._header = header;
		return this;
	};

	this.getHeader = function(){
		return this._header;
	};

	this.setTransition = function(trans){
		this._transition = trans;
		return this;
	};

	this.getTransition = function(){
		return this._transition;
	};

	this.setTemplateUrl = function(turl){
		this._templateUrl = turl;
		return this;
	};

	this.getTemplateUrl = function(){
		return this._templateUrl;
	};

	this.setElement = function(element){
		this._element = element;
		return this;
	};

	this.getElement = function(){
		return this._element;
	};

	this.getName = function(){
		return this._name;
	};

	this.setUrl = function(url){
		this._url = url;
		return this;
	};

	this.getUrl = function(){
		return this._url;
	};

	this.setIsLoaded = function(val){
		this._loaded = val;
		return this;
	};

	this.isLoaded = function(){
		return this._loaded;
	};

	this.unload = function(){
		var viewWrapper = _d.getElementsByTagName('esp-view-wrapper')[0];

		viewWrapper.removeChild(this._element);

		this._element = null;
		this._loaded = false;
	}; 

	this.prepareCustomTags = function(){
		trace('Preparing view "'+this._name+'" custom tags.', 'info');

		//Custom tags list
		var tags = ['esp-list'];
		
		//Check for custom tags in the view
		for(var i=0; i<tags.length; i++){
			var tag = tags[i];			

			switch(tag){
				case 'esp-list':
					var lists = this._element.getElementsByTagName(tag),
						that = this;

					for(var j=0; j<lists.length; j++){
						var list = lists[j];

						trace('<'+tag+'>', '', 1);						

						if ( list.getAttribute('pull-to-refresh') ){

							trace('Pull to refresh detected.', '', 2);

							var ptrLoadingBox = _d.createElement('esp-list-ptr-loading-box');

							ptrLoadingBox.innerHTML = '<i class="fa fa-arrow-down"></i>';

							list.insertBefore(ptrLoadingBox, list.firstChild);

							list.addEventListener("touchstart", function(e){
								if(list.scrollTop===0){
									
									//Reset the native scrolling
									_w.scrollTo(0,0);

									that._pullToRequest.listTop = list.getBoundingClientRect().top;
									that._pullToRequest.touchTop = e.touches[0].clientY;

									that._pullToRequest.loadingBox = ptrLoadingBox;

									if(that._pullToRequest.loadingBox.classList.contains('closeAnim')){
										that._pullToRequest.loadingBox.classList.remove('closeAnim');	
									}									
								}
							});

							list.addEventListener("touchmove", function(e){

								if( that._pullToRequest.loadingBox ){

									var ptrBoxHeight = e.touches[0].clientY-that._pullToRequest.touchTop;

									that._pullToRequest.loadingBox.style.height = ptrBoxHeight+'px';

									if( ptrBoxHeight <= that._pullToRequest.PTR_MAX_BOX_HEIGHT ){										

										if(that._pullToRequest.loadingBox.classList.contains('refresh')){
											that._pullToRequest.loadingBox.classList.remove('refresh');
										}
									}else{
										//that._pullToRequest.loadingBox.style.height = that._pullToRequest.PTR_MAX_BOX_HEIGHT+'px';

										if(!that._pullToRequest.loadingBox.classList.contains('refresh')){
											that._pullToRequest.loadingBox.classList.add('refresh');
										}
									}

									that._pullToRequest.loadingBox.style.lineHeight = that._pullToRequest.loadingBox.style.height;
								}

							});

							list.addEventListener("touchend", function(e){
								if( that._pullToRequest.loadingBox ){

									if(that._pullToRequest.loadingBox.classList.contains('refresh')){
										that._pullToRequest.loadingBox.classList.remove('refresh');
									}

									that._pullToRequest.loadingBox.classList.add('closeAnim');
									that._pullToRequest.loadingBox.style.height = '';
									that._pullToRequest.loadingBox = null;
								}
							});
						}
					}

				break;
			}
		}

	
	};

}