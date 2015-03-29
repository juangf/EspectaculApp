/**
 * App Page Class
 */
"use strict";
function Page(name, element){
	this.name = name;
	this.element= element;

	this.resize = function(width, height){
		this.element.style.width = width+'px';
		this.element.style.height = height+'px';

		return this;
	};
}