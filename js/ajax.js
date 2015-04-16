_w.app.ajax = function(params){
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 ) {
			if(xmlhttp.status == 200){
				params.success(xmlhttp.responseText);
			}
		else{
				params.error(xmlhttp, xmlhttp.status, 'error');
			}
		}
	};

    xmlhttp.open(params.method ? params.method : 'GET', params.url, params.asynch ? params.asynch : true);
    xmlhttp.send();

    return this;
};