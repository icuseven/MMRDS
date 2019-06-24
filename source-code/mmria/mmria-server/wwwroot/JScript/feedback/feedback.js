/*
 * This javascript file contains the declarations and functions needed to implement the Feedback
 * functionality on the CDC Internet site.
 */
var CDC_ENABLE_POPUPS = true;
var CDC_FORM_ID = 'cdc_feedback_window';
var CDC_FORM_TITLE_ID = 'cdc_feedback_title';
var CDC_FORM_QUESTION_ID = 'cdc_feedback_question';
var CDC_FORM_QUESTION_NUMBER_ID = 'questionNumber';
var CDC_FORM_TEXTAREA_ID = 'cdc_feedback_textarea';
var CDC_FORM_FEEDBACK_TEXT_ID = 'feedbackText';
var CDC_FORM_COMPLETE_ID = 'cdc_feedback_complete';
var CDC_FORM_BUTTONS_ID = 'cdc_feedback_buttons';
var CDC_SUBMIT_ID = 'cdc_feedback_submit';
var CDC_CANCEL_ID = 'cdc_feedback_cancel';
var CDC_CLOSE_ID = 'cdc_feedback_close';
var CDC_TITLE_SUBMIT = 'Submit';
var CDC_TITLE_CANCEL = 'Cancel';
var CDC_TITLE_CLOSE = 'Close Window';
var CDC_TITLE_FEEDBACK = 'Quick Question';
var CDC_TITLE_FEEDBACK_CONFIRM = 'Quick Question Complete';
var CDC_LABEL_FEEDBACK_CONFIRM = 'Thank you for helping us improve our site.';
var CDC_FORM_WIDTH = 600;  // DHTML feedback form width
var CDC_FORM_HEIGHT = 250; // DHTML feedback form height

/*
 * Simple function to attempt to determine if the browser is running on a Macintosh computer.  This function
 * makes a broad assumption that if the computer is not a Win32 computer, it is a Mac.  This is not 100% correct.
 */
function isMac()
{
	if(navigator.platform.indexOf("Win32") >= 0)
		return false;
	else
		return true;
}

/*
 * Simple function to test browser to see if it is an AOL browser.
 */
function isAOL()
{
	if (navigator.userAgent.toLowerCase().indexOf("aol") >= 0)
		return true;
	else
		return false;
}

/*
 * A browser-aware function to associate an event handler to an
 * object.
 */
function addEvent(obj, evType, fn)
{
	if (obj.addEventListener)
	{
		obj.addEventListener(evType, fn, false);
		return true;
	}
	else if (obj.attachEvent)
	{
		var r = obj.attachEvent("on" + evType, fn);
		return r;
	}
	else
	{
		return false;
	}
}

/*
 * A browser-aware function to remove an event handler from an
 * object.
 */
function detachEvent(obj, evType, fn)
{
	if (obj.removeEventListener)
	{
		obj.removeEventListener(evType, fn, false);
		return true;
	}
	else if (obj.detachEvent)
	{
		var r = obj.detachEvent("on" + evType, fn);
		return r;
	}
	else
	{
		return false;
	}
}

/*
 * A browser-aware function to cancel an event (prevent the
 * event from propagating).
 */
function cancel(e)
{
	if (e && e.preventDefault)
	{
		e.preventDefault(); // DOM style
	}
	else if (window.event)
	{
		window.event.returnValue = false;
		window.event.cancelBubble = true;
	}
	return false; // IE style
}

/*
 * Function to URL encode a string.  Take into account special characters that may appear in a string that needs
 * to be encoded (i.e., '+', '"', ''', and '/').
 */
function URLencode(sStr)
{
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
}

/*
 * Function to display the Feedback form.  An attempt is made to display window in new browser window.  If this
 * is blocked for some reason, then a DHTML form is displayed.
 */
function showWindow(questionNumber)
{
	var popupWindow;
	var winOptions = "width=" + CDC_FORM_WIDTH + ",height=" + CDC_FORM_HEIGHT + 
		",top=" + getFeedbackWindowTop() + 
		",left=" + getFeedbackWindowLeft() + 
		",resizable=no,scrollbars=no";
	var fullURL = 'https://www.cdc.gov/feedback.do?questionNumber=' + questionNumber +
		'&url=' + URLencode(window.location.href) + 
		'&title=' + window.document.title;
	if (!isAOL() && CDC_ENABLE_POPUPS)
	{
		popupWindow = window.open(fullURL, '_blank', winOptions);
	}

	if (!popupWindow)
	{


		clientSideInclude(CDC_FORM_QUESTION_ID, '/JScript/feedback/' + questionNumber + '.html');

		if (document.all)
		{
			document.all(CDC_FORM_TITLE_ID).innerHTML = CDC_TITLE_FEEDBACK;
			document.all(CDC_FORM_QUESTION_NUMBER_ID).value = questionNumber;
			document.all(CDC_FORM_TEXTAREA_ID).style.display = 'inline';
			document.all(CDC_FORM_COMPLETE_ID).style.display = 'none';
			document.all(CDC_SUBMIT_ID).style.display = 'inline';
			document.all(CDC_CANCEL_ID).style.display = 'inline';
			document.all(CDC_CLOSE_ID).style.display = 'none';	
			document.all(CDC_FORM_ID).style.display = 'inline';
			if (document.all(CDC_FORM_ID).filters && document.all(CDC_FORM_ID).filters.revealTrans)
			{
				document.all(CDC_FORM_ID).filters.revealTrans.transition = 23;
				document.all(CDC_FORM_ID).filters.revealTrans.Apply();
				document.all(CDC_FORM_ID).style.visibility = 'visible';
				document.all(CDC_FORM_ID).filters.revealTrans.Play();
			}
			else
			{
				document.all(CDC_FORM_ID).style.visibility = 'visible';
			}
		}
		else if (document.getElementById)
		{
			document.getElementById(CDC_FORM_TITLE_ID).innerHTML = CDC_TITLE_FEEDBACK;
			document.getElementById(CDC_FORM_QUESTION_NUMBER_ID).value = questionNumber;
			document.getElementById(CDC_FORM_TEXTAREA_ID).style.display = 'inline';
			document.getElementById(CDC_FORM_COMPLETE_ID).style.display = 'none';
			document.getElementById(CDC_SUBMIT_ID).style.display = 'inline';
			document.getElementById(CDC_CANCEL_ID).style.display = 'inline';
			document.getElementById(CDC_CLOSE_ID).style.display = 'none';			
			document.getElementById(CDC_FORM_ID).style.visibility = 'visible';
		}
	}
	return cancel(this);
}


/*
 * Function to hide the DHTML generated form.
 */
function hideWindow() 
{		
	if (document.all)
	{
		if (document.all(CDC_FORM_ID).filters && document.all(CDC_FORM_ID).filters.revealTrans)
		{
			document.all(CDC_FORM_ID).filters.revealTrans.transition = 23;
			document.all(CDC_FORM_ID).filters.revealTrans.Apply();
			document.all(CDC_FORM_ID).style.visibility = 'hidden';
			document.all(CDC_FORM_ID).filters.revealTrans.Play();
		}
		else
		{
			document.all(CDC_FORM_ID).style.visibility = 'hidden';
		}
	}
	else if (document.getElementById)
	{
		document.getElementById(CDC_FORM_ID).style.visibility = 'hidden';
	}
	return cancel(this);
}

/*
 * This function submits the DHTML form to the appropriate page to be processed and hides the DHTML form.
 */
function submitFeedback()
{

	makeSubmitFeedbackRequest();
	
	if (document.all)
	{
		document.all(CDC_FORM_TITLE_ID).innerHTML = CDC_TITLE_FEEDBACK_CONFIRM;
		document.all(CDC_FORM_QUESTION_ID).innerHTML = '';
		document.all(CDC_FORM_TEXTAREA_ID).style.display = 'none';
		document.all(CDC_FORM_COMPLETE_ID).style.display = 'inline';
		document.all(CDC_SUBMIT_ID).style.display = 'none';
		document.all(CDC_CANCEL_ID).style.display = 'none';
		document.all(CDC_CLOSE_ID).style.display = 'inline';
	}
	else if (document.getElementById)
	{		
		document.getElementById(CDC_FORM_TITLE_ID).innerHTML = CDC_TITLE_FEEDBACK_CONFIRM;
		document.getElementById(CDC_FORM_QUESTION_ID).innerHTML = '';
		document.getElementById(CDC_FORM_TEXTAREA_ID).style.display = 'none';
		document.getElementById(CDC_FORM_COMPLETE_ID).style.display = 'inline';
		document.getElementById(CDC_SUBMIT_ID).style.display = 'none';
		document.getElementById(CDC_CANCEL_ID).style.display = 'none';
		document.getElementById(CDC_CLOSE_ID).style.display = 'inline';
	}
	return cancel(this);
}

/*
 * Helper function to determine where the top of the DHTML Feedback form should be.
 */
function getFeedbackWindowTop()
{
	var windowheight;
	if (document.documentElement)
	{
		windowheight = document.documentElement.offsetHeight;
	}
	else if (document.body.clientWidth && document.body.clientWidth > 0)
	{ 
		windowheight = document.body.clientHeight;
	} 
	else
	{ 
		windowheight = window.innerHeight;
	} 
	
	var feedbackWindowTop;		
	if (document.documentElement && document.documentElement.scrollTop)
		feedbackWindowTop = document.documentElement.scrollTop;
	else if (document.body)
		feedbackWindowTop = document.body.scrollTop;
	else
		feedbackWindowTop = 0;
	return Math.min(feedbackWindowTop + ((screen.height - 300) / 2), 150);
}

/*
 * Helper function to determine where the left of the DHTML Feedback form should be.
 */
function getFeedbackWindowLeft()
{
	var windowwidth;
	if (document.documentElement)
	{
		windowwidth = document.documentElement.offsetWidth; 
	}
	else if (document.body.clientWidth && document.body.clientWidth > 0)
	{ 
		windowwidth = document.body.clientWidth; 
	} 
	else
	{ 
		windowwidth = window.innerWidth; 
	}
	return (windowwidth - CDC_FORM_WIDTH)/2;
}


/*
 * This function includes the content of the specified URL and stores the results in the HTML element (div or span)
 * with the given ID.
 */
function clientSideInclude(id, url)
{
	var req = false;
	// For Safari, Firefox, and other non-MS browsers
	if (window.XMLHttpRequest)
	{
		try
		{
			req = new XMLHttpRequest();
		}
		catch (e)
		{
			req = false;
		}
	}
	else if (window.ActiveXObject)
	{
		// For Internet Explorer on Windows
		try
		{
			req = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				req = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				req = false;
			}
		}
	}

	var element;
	if (document.all)
	{
		element = document.all(id);
	}
	else if (document.getElementById)
	{
		element = document.getElementById(id);
	}

	if (!element)
	{
		alert("Bad id " + id + 
			"passed to clientSideInclude." +
			"You need a div or span element " +
			"with this id in your page.");
		return;
	}

	if (req)
	{
		// Synchronous request, wait till we have it all
		req.open('GET', url, false);
		req.send(null);
		element.innerHTML = req.responseText;
	}
	else
	{
		element.innerHTML =
			"Sorry, your browser does not support " +
			"XMLHTTPRequest objects. This page requires " +
			"Internet Explorer 5 or better for Windows, " +
			"or Firefox for any system, or Safari. Other " +
			"compatible browsers may also exist.";
	}
}

/*
 * This function submits the DHTML form to the appropriate page to be processed.
 */
function makeSubmitFeedbackRequest() 
{

	var feedbackText;
	var questionNumber;

	if (document.all)
	{
		feedbackText = document.all(CDC_FORM_FEEDBACK_TEXT_ID).innerHTML;
		questionNumber = document.all(CDC_FORM_QUESTION_NUMBER_ID).value;
	}
	else if (document.getElementById)
	{
		feedbackText = document.getElementById(CDC_FORM_FEEDBACK_TEXT_ID).innerHTML;
		questionNumber = document.getElementById(CDC_FORM_QUESTION_NUMBER_ID).value;
	}

	if (feedbackText && questionNumber)
	{
		var url = '/feedback.do?url=' + URLencode(window.location.href) + 
			'&questionNumber=' + questionNumber;
		http_request = false;
		if (window.XMLHttpRequest)
		{ // Mozilla, Safari,...
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType)
			{
				http_request.overrideMimeType('text/xml');
			}
		}
		else if (window.ActiveXObject)
		{ // IE
			try 
			{
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e)
			{
				try 
				{
					http_request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (e) {}
			}
		}
		if (!http_request)
		{
			return false;
		}	
		http_request.open('POST', url, false);
	
		// Indicate that the body of the request contains form data
		http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	
		// Send the data as name/value pairs
		http_request.send('feedbackText=' + URLencode(feedbackText) + 
			'&questionNumber=' + questionNumber +
			'&emailTitle=' + URLencode(window.document.title) +
			'&action=submit');
		
		if (http_request.status != 200)
		{
			alert('An error occurred while submitting your feedback!');
		}

	}
	else
	{
		alert('No response to question was provided.  Please try again.');
	}
	
}


/*
 * Function to create the DHTML Feedback form.
 */
function generateFeedbackForm()
{
	
	var feedbackForm = "<div id='" + CDC_FORM_ID + "' " +
		"style='width: " + CDC_FORM_WIDTH + "px; " + 
		"height: " + CDC_FORM_HEIGHT + "px; " + 
		"position: absolute; left:" + getFeedbackWindowLeft() + "px; " +
		"top:" + getFeedbackWindowTop() + "px; " +
		"z-index:1; display: none;";

	if (document.all && document.all(CDC_FORM_ID) && document.all(CDC_FORM_ID).filters)
		feedbackForm += " filter:revealTrans(Duration=0.5, Transition=23)";

	feedbackForm += "'>"
	
	feedbackForm += "<div id='" + CDC_FORM_TITLE_ID + "'>"
		+ CDC_TITLE_FEEDBACK
		+ "</div>"
		+ "<div id='" + CDC_FORM_QUESTION_ID + "'>"
		+ "   Are these search results helpful to you?  Why or why not?"
		+ "</div>"
		+ "<div style='height: 12px;'>"
		+ "   &nbsp;"
		+ "</div>"
		+ "<div id='" + CDC_FORM_TEXTAREA_ID + "' style='margin-top: 12px;'>"
		+ "	<label for='" + CDC_FORM_FEEDBACK_TEXT_ID + "' style='display: none'>Entry Field</label>"
		+ "	<textarea id='" + CDC_FORM_FEEDBACK_TEXT_ID + "' rows='5' cols='60' wrap='soft'></textarea>"
		+ "</div>"
		+ "<div id='" + CDC_FORM_COMPLETE_ID + "'>"
		+ CDC_LABEL_FEEDBACK_CONFIRM
		+ "</div>"
		+ "<div id='" + CDC_FORM_BUTTONS_ID + "'>"
		+ "	<input type='hidden' id='" + CDC_FORM_QUESTION_NUMBER_ID + "' value='' style='display: none;'></input>"
		+ "	<label for='" + CDC_SUBMIT_ID + "' style='display: none'>Submit Button</label>"
		+ "	<input type='button' id='" + CDC_SUBMIT_ID + "' value='" + CDC_TITLE_SUBMIT + "' "
		+ "     	onclick='submitFeedback()'></input>"
		+ "	<label for='" + CDC_CANCEL_ID + "' style='display: none'>Cancel Button</label>"
		+ "	<input type='button' id='" + CDC_CANCEL_ID + "' value='" + CDC_TITLE_CANCEL + "' "
		+ "		 onclick='hideWindow()'></input>"
		+ "	<label for='" + CDC_CLOSE_ID + "' style='display: none'>Close Button</label>"
		+ "	<input type='button' id='" + CDC_CLOSE_ID + "' value='" + CDC_TITLE_CLOSE + "' "
		+ "		 onclick='hideWindow()'></input>"
		+ "</div>"
		+ "</div>";
	
	document.write(feedbackForm);
}

// Call the function to generate the DHTML feedback form.
generateFeedbackForm();
