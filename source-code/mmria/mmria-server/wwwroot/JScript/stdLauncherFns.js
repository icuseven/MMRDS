var cdc_survey_arr = new Array();

function Mapping(searchTerm, surveyLink, surveyId, sampling) {
	this.searchTerm = searchTerm;
	this.surveyLink = surveyLink;
	if (surveyId) {
		this.surveyId = surveyId;
	} else {
		this.surveyId = "0000000";
	}
	if (sampling) {
		this.sampling = sampling;
	} else {
		this.sampling = 100;
	}
}

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
}

// This next little bit of code tests whether the user accepts cookies.
var WM_acceptsCookies = false;
if (document.cookie == "") {
	document.cookie = "WM_acceptsCookies=yes"; // Try to set a cookie.
	if (document.cookie.indexOf("WM_acceptsCookies=yes") != -1) {
		WM_acceptsCookies = true; 
	} // If it succeeds, set variable
} else { // there was already a cookie
	WM_acceptsCookies = true;
}

function WM_setCookie (name, value, path, domain, secure) {
	if (WM_acceptsCookies) { // Don't waste your time if the browser doesn't accept cookies.
		document.cookie = name + '=' + escape(value) + ((path)?';path=' + path:'') + ((domain)?';domain=' + domain:'') + ((secure && (secure == true))?'; secure':''); // Set the cookie, adding any parameters that were specified.
	}
} // WM_setCookie

function WM_readCookie(name) {
	if (document.cookie == "") { // there's no cookie, so go no further
		return false; 
	} else { // there is a cookie
		var firstChar, lastChar;
		var theBigCookie = document.cookie;
		firstChar = theBigCookie.indexOf(name); // find the start of 'name'
		var NN2Hack = firstChar + name.length;
		if ((firstChar != -1) && (theBigCookie.charAt(NN2Hack) == '=')) { // if you found the cookie
			firstChar += name.length + 1; // skip 'name' and '='
			lastChar = theBigCookie.indexOf(';', firstChar); // Find the end of the value string (i.e. the next ';').
			if (lastChar == -1) lastChar = theBigCookie.length;
			return unescape(theBigCookie.substring(firstChar, lastChar));
		} else { // If there was no cookie of that name, return false.
			return false;
		}
	} 
} // WM_readCookie

/*
 * Javascript function to be invoked for search surveys content.
 */
function CustomResearch(mapping, term) {
	// Find the entry in the mapping array
	var mappingItem;		
	for (var i = 0; i < mapping.length; i++) {
		if (mapping[i].searchTerm.toLowerCase() == term.toLowerCase()) {
			mappingItem = mapping[i];
			break;
		}
	}
	// If we found the entry then see if we should display the survey.
	if (mappingItem) {			
		var n = mappingItem.sampling; /* One out of n visitors will be given survey */
		var random_num = random_num = Math.round(n * Math.random());
		var cookiename = "NetRakerRID" + mappingItem.surveyId;		
		/*random_num = 1;*/ // uncomment this line to debug, this will trigger the research everytime 			
		if ((random_num == 1) && (navigator.appName.indexOf("WebTV") == -1)) {		
			if (!WM_readCookie(cookiename)) { 
				/* comment this to prompt until they complete the survey */ 
				WM_setCookie(cookiename, mappingItem.surveyId) 		
				window.open( 
					mappingItem.surveyLink, 
					"CustomResearchWindow",
					"width=518,height=413,scrollbars,resizable,status");
			}
		}			
	}	
}
