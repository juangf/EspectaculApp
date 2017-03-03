_w.esp.ajax = function(params) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 ) {
        if (xmlhttp.status == 200 || xmlhttp.status == 0 /* Local file */) {
            params.success(xmlhttp.responseText);
        } else {
            params.error(xmlhttp, xmlhttp.status, 'error');
        }
    }
};

xmlhttp.open(params.method ? params.method : 'GET', params.url, params.asynch ? params.asynch : true);

if (params.headers) {
    for (var key in params.headers) {
        xmlhttp.setRequestHeader(key, params.headers[key]);
    }
}

xmlhttp.send();

return this;
};