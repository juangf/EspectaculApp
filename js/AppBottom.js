/*! 
* EspectaculApp ~ (c) 2017 ~ http://www.espectaculapp.com
* Juan García Fernández (@juan_gf) 
* AppBottom Class
*/
function AppBottom() {
    this._element = null;

    this.setElement = function(element) {
        this._element = element;
        return this;
    };

    this.getElement = function() {
        return this._element;
    };
}