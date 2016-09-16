function AJAX_(){};

AJAX_.prototype.GetResponse = function(p_url, p_callback)
{
	var httpRequest = null;
	var ready_this = this;
	//https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
	// Old compatibility code, no longer needed.
	if (window.XMLHttpRequest) 
	{ // Mozilla, Safari, IE7+ ...
		httpRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) 
	{ // IE 6 and older
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	httpRequest.onreadystatechange = function()
	{
		
		if (httpRequest.readyState === XMLHttpRequest.DONE) 
		{
			// everything is good, the response is received
			if (httpRequest.status === 200) 
			{
				// perfect!
						// process the server response
				var parent = null;
				var metadata = JSON.parse(httpRequest.responseText);
				p_callback(metadata);
				

			}
			else 
			{
				// there was a problem with the request,
				// for example the response may contain a 404 (Not Found)
				// or 500 (Internal Server Error) response code
			}
		} 
		else 
		{
			// still not ready
		}
		
	};
	httpRequest.open('GET', p_url, true);
	httpRequest.send(null);
  
}


AJAX_.prototype.PostResponse = function(p_url, p_postdata, p_callback)
{
	var httpRequest = null;
	var ready_this = this;
	//https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
	// Old compatibility code, no longer needed.
	if (window.XMLHttpRequest) 
	{ // Mozilla, Safari, IE7+ ...
		httpRequest = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) 
	{ // IE 6 and older
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	httpRequest.onreadystatechange = function()
	{
		
		if (httpRequest.readyState === XMLHttpRequest.DONE) 
		{
			// everything is good, the response is received
			if (httpRequest.status === 200) 
			{
				// perfect!
						// process the server response
				var parent = null;
				var metadata = JSON.parse(httpRequest.responseText);
				p_callback(metadata);
				

			}
			else 
			{
				// there was a problem with the request,
				// for example the response may contain a 404 (Not Found)
				// or 500 (Internal Server Error) response code
				//console.log(httpRequest.response.Text);
			}
		} 
		else 
		{
			// still not ready
		}
		
	};
	httpRequest.open('POST', p_url, true);
	httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	httpRequest.send(p_postdata);
  
}
