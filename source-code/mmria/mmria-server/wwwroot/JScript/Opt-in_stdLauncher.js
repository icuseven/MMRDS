// Customer: 
// Version : DHTML Trigger 3.0
// ************ don't modify below this line *************

var popUpURL  = "//www.foreseeresults.com/survey/display"; // base URL to the survey 
var FSRImgURL = "//www.foreseeresults.com/survey/FSRImg";
var OTCImgURL = "//controller.foreseeresults.com/fsrSurvey/OTCImg";
var ckAlreadyShown = triggerParms["ascookie"]; // name of the persistent/session cookie
var ckLoyaltyCount = triggerParms["lfcookie"]; // name of the loyalty count cookie
var fullURL=null;
var myPopUp=null;
var fsr_aol=null;
var dcQString="";
var winOptions = "width= 1,height= 1,top= 4000,left= 4000,resizable=yes,scrollbars=yes";
var persistentExpires = new Date(); //persistent cookie expiration 
persistentExpires.setTime(persistentExpires.getTime() + (triggerParms["rw"]*60*1000));


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

function ForeCStdGetCookie (name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) {
			return ForeCStdGetCookieVal (j);
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) {
			break;
		}
	}
	return null;
}

function fsr_showWindow() {
	if(myPopUp != null && !myPopUp.closed && fsr_aol==false) {return;}
	if(document.all && document.all.fsr_window.filters) {
		eval("document.all.fsr_window").filters.revealTrans.transition = 23 ;
		eval("document.all.fsr_window").filters.revealTrans.Apply();
		eval("document.all.fsr_window").style.visibility = 'visible';
		eval("document.all.fsr_window").filters.revealTrans.Play();
	}
	else if(document.all) {document.all.fsr_window.style.visibility = 'visible';}	
	else if(document.getElementById) {document.getElementById("fsr_window").style.visibility = 'visible';}	
}
function fsr_hideWindow() {
	if(document.all && document.all.fsr_window.filters) {
		eval("document.all.fsr_window").filters.revealTrans.transition = 23;
		eval("document.all.fsr_window").filters.revealTrans.Apply();
		eval("document.all.fsr_window").style.visibility = 'hidden';
		eval("document.all.fsr_window").filters.revealTrans.Play();
	}
	else if(document.all) {document.all.fsr_window.style.visibility = 'hidden';}	
	else if(document.getElementById) {document.getElementById("fsr_window").style.visibility = 'hidden';}
}

function ForeCStdSetCookie (name, value) {
	var argv = ForeCStdSetCookie.arguments;
	var argc = ForeCStdSetCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	document.cookie = name + "=" + escape (value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == true) ? "; secure" : "");
}

function ForeCStdGetCookieVal(offset) {
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1) {
		endstr = document.cookie.length;
	}
	return unescape(document.cookie.substring(offset, endstr));
}

function specialEscape(str) {
	var translated = "";
	var i; 
	var found = 0;
	for(i = 0; (found = str.indexOf('+', found)) != -1; ) {
		translated += str.substring(i, found) + "%2B";
		i = found + 1;
		found++;
	}
	translated += str.substring(i, str.length);
	return translated;
}
function Pop(){
	myPopUp = window.open(fullURL, 'survey', winOptions);
	if (myPopUp!=null && !myPopUp.closed) {
		if (triggerParms["pu"] == 1){
			self.focus();
		} else {
			myPopUp.focus(); 							
		}
	}
}

function checkMAC(){
	if(navigator.platform.indexOf("Win32") >= 0){
		return false;
	} else {
		return true;
	}	
}

var detect = navigator.userAgent.toLowerCase();
function checkAOL(){
	if (detect.indexOf("aol") >=0){ return true; }
	return false;
}
function currentLocationExcluded() {	
	var parentURLPath = window.location.pathname;//location path
	for(key in excludeList) {
		if(parentURLPath.indexOf(excludeList[key]) != -1) {
			return true;
		}
	}
	return false;
}
var newDt;
var currTime;	// in millisecs
var OTCImg;
var FSRImg;
var surveyProcessCont = 1;
function stdImgProc() {
	if(triggerParms["compliant508"] == 1) { fsr_showWindow();}
	else { setTimeout ( "fsr_showWindow();", 1000, "JavaScript" );	}
}
function fsrShowSurvey(){
	if(dcQString == "") { stdImgProc(); }
	else {
		newDt   = new Date();
		currTime= newDt.getTime(); // in millisecs
		FSRImg = new Image();
		FSRImg.src = null;
		FSRImg.onerror = imgErrorProc;
		FSRImg.onload = imgOnloadProc;
		FSRImg.src = FSRImgURL + "?" + dcQString + "&uid="+ currTime;	//for NE/FF Cache Fix
	}
}
function imgOnloadProc() {
	if(surveyProcessCont == 1 && FSRImg.width == 3) { stdImgProc(); }
  	return true;
}
function imgErrorProc() {
	surveyProcessCont = 0;
	return true;
}
function otcOnloadProc() {
	if(surveyProcessCont == 1 && OTCImg.width == 3) { fsrShowSurvey(); }
	else { surveyProcessCont = 0; }
  	return true;
}
function otcErrorProc() {
	fsrShowSurvey();
	return true;
}

function optinPoll() { 

	if (triggerParms["rso"] == 1 && triggerParms["aro"] == 1) {
		triggerParms["sp"] = 100.0; // Update Ssample percentage
	}

	fsr_aol= checkAOL();
	var fsr_mac= checkMAC();					
	var fsr_browser="fsr_nn6";
	var ua = navigator.userAgent;
	var isFirefox = ( ua != null && ua.indexOf( "Firefox/" ) != -1 );
	var isNetscape = ( ua != null && ua.indexOf( "Netscape/" ) != -1 );
	if(document.all || document.getElementById){ 
		fsr_browser = "fsr_ie";
	}
	if(document.layers) {
		fsr_browser = "fsr_nn";
	}
	fullURL = popUpURL + "?" + "width=" + triggerParms["width"] +
	"&height=" + triggerParms["height"] +
	"&cid=" + specialEscape(escape(triggerParms["cid"])) + "&mid=" + specialEscape(escape(triggerParms["mid"]));
	if ((triggerParms["omb"] ) != null) {
		fullURL += "&omb=" + escape(triggerParms["omb"]);
	}
	if ((triggerParms["cmetrics"] ) != null) {
		fullURL += "&cmetrics=" + escape(triggerParms["cmetrics"]);
	}
	if (triggerParms["olpu"] == 1) {
		fullURL += "&olpu=1";
	}
	if ((triggerParms["dcUniqueId"]) != null) {
		fullURL += "&dcUniqueId=" + escape(triggerParms["dcUniqueId"]);
	}
	if (triggerParms["rso"] == 1) {
		fullURL += "&rso=1&rct=" + triggerParms["rct"] + "&rds=" + triggerParms["rds"] + "&mrd=" + triggerParms["mrd"] + "&rws=" + triggerParms["rw"];
	}
	if (triggerParms["capturePageView"] == 1) {
		triggerParms["cpp_2"] = "PageView:1"; // customer parameter 2 - Page View
	}
	if ((triggerParms["midexp"] ) != null) {
		fullURL += "&ndc=1&fsexp=5256000&midexp=" + triggerParms["midexp"];
	}
	triggerParms["cpp_3"] = "Browser:"+ cppUrlPatch (navigator.userAgent) + (fsr_browser == "fsr_nn6" ? ";normal" : ";dhtml");
	var customerParams = "";
	for(paramKey in triggerParms) {
		if(paramKey.substring(0,3) == "cpp"){
			fullURL += "&" + paramKey + "=" + escape(triggerParms[paramKey]);
		}
	}	
	// for AOL users - show DHTML (by default)
	if (fsr_aol==false) {

		myPopUp = window.open(fullURL, 'survey', winOptions);
	}
	if (!myPopUp && fsr_mac==false && (fsr_browser != "fsr_nn") && (triggerParms["dhtml"] == 1)) {

		var windowwidth;
		var windowheight;
		if (fsr_browser == "fsr_ie" && !isFirefox && !isNetscape)
		{
			windowwidth = document.documentElement.offsetWidth; 
			windowheight = document.documentElement.offsetHeight;
		}
		else if (isNetscape || isFirefox) 
		{ 
			windowwidth = window.innerWidth; 
			windowheight = window.innerHeight;
		} 
		else
		{ 
			windowwidth = document.body.clientWidth; 
			windowheight = document.body.clientHeight;
		} 

		fsr_left = (windowwidth - triggerParms["dhtmlWidth"])/2;
		fsr_top = Math.min((windowheight - triggerParms["dhtmlHeight"])/2,150);

		if(document.all)
		{
			document.all.cframe.src = triggerParms["dhtmlURL"] + "?fullURL=" + fullURL;
		}
		else if (document.getElementById)
		{
			document.getElementById("cframe").src = triggerParms["dhtmlURL"] + "?fullURL=" + fullURL;
		}
		fsr_showWindow();													

		//DC I/II verification
		if (triggerParms["rso"] == 1) {
			dcQString = "rso=1&rct=" + triggerParms["rct"] + "&rds=" + triggerParms["rds"] + "&mrd=" + triggerParms["mrd"] + "&rws=" + triggerParms["rw"];
			if(triggerParms["dcUniqueId"]!=null) { dcQString += "&dcUniqueId=" + specialEscape(escape(triggerParms["dcUniqueId"])); }
		}
		if ((triggerParms["midexp"] ) != null) {
			dcQString = "ndc=1&midexp=" + triggerParms["midexp"] + "&mid=" + specialEscape(escape(triggerParms["mid"]));
			if(triggerParms["dcUniqueId"]!=null) { dcQString += "&dcUniqueId=" + specialEscape(escape(triggerParms["dcUniqueId"])); }
		}						
		
		//Failover Check
		surveyProcessCont = 1;		
		newDt   = new Date();
		currTime= newDt.getTime(); // in millisecs
		OTCImg = new Image();
		OTCImg.src = null;
		OTCImg.onerror = otcErrorProc;
		OTCImg.onload = otcOnloadProc;
		OTCImg.src = OTCImgURL + "?protocol=" + window.location.protocol + "&uid="+ currTime;	//for NE/FF Cache Fix
	}

	if(myPopUp != null && !myPopUp.closed) {
		if (triggerParms["pu"] == 1){ self.focus(); }
		else { myPopUp.focus(); }
	}

	return cancel(this);
}
