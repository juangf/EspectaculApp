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
  callBacks[i].apply(null, args);
}
return true;
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
}