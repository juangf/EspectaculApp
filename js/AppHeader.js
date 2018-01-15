/*! 
* EspectaculApp v0.0.1 ~ (c) 2015 ~ http://www.espectaculapp.com
* Juan García Fernández (@juan_gf) 
* AppHeader Class
*/
function AppHeader(title) {
    this._title = title;
    this._element = null;

    this.setElement = function(element) {
        this._element = element;
        return this;
    };

    this.getElement = function() {
        return this._element;
    };

    this.setTitle = function(title) {
        this._title = title;

        var titleElement = this._element.getElementsByClassName('title');

        if (titleElement.length) {
            this._element.getElementsByClassName('title')[0].innerHTML = title;
        }

        return this;
    };

    this.getTitle = function() {
        return this._title;
    };
    
    this.hide = function() {
        this._element.parentElement.classList.add('hide');
    };
    
    this.show = function() {
        this._element.parentElement.classList.remove('hide');
    };
}