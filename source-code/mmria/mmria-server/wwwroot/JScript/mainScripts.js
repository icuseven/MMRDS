// Javascript to detect window width and serve up a fixed-width CSS layout 
// Older browsers will safely ignore these layouts and render an unstyled layout

// This is for 800x600 users and below
var dirTest = document.URL.toLowerCase();
if ((screen.width <= 900) && (dirTest.indexOf("cdc.gov/about/") == -1)) {	

	if (document.styleSheets[0].cssRules) {
		ruleCounter = document.styleSheets[0].cssRules.length
	// Mozilla
	document.styleSheets[0].insertRule('@import url("https://www.cdc.gov/css/narrowView.css");}', ruleCounter)
	}
	else {
	//IE
	document.write('<style type="text/css" media="screen">@import url("https://www.cdc.gov/css/narrowView.css");</style>');
	//document.styleSheets[0].addRule("@", "@import url('/css/narrowView.css');}")
	// the addRule approach above locked up my system.  I believe if the "@" is changed to "*" it might work.  Need to test later.
	}
}

// Email/Print Script Here
var WindowObjectReference; // global variable

function openRequestedPopup()
{
               document.url = location.href;
               WindowObjectReference = window.open("https://www.cdc.gov/email.do?url=" +
                              escape(location.href), "_blank",
                              "height=320,width=576,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes," +
                              "resizable=yes");
}

//***********************************************************************
// onHover script for blocks
//***********************************************************************

function getElementsByClass(searchClass,node,tag) {
				var i,j;
				var classElements = new Array();
				if ( node == null )
					node = document;
				if ( tag == null )
					tag = '*';
				var els = node.getElementsByTagName(tag);
				var elsLen = els.length;
				var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
				for (i = 0, j = 0; i < elsLen; i++) {
					if ( pattern.test(els[i].className) ) {
						classElements[j] = els[i];
						j++;
					}
				}
				return classElements;
			}

function blocksHover (section) {
	var i;
	if (!document.getElementsByTagName) return false;
	var tags = getElementsByClass(section);
        for (i=0;i<tags.length;i++) {
	       tags[i].onmouseover=function() {this.className+=" blocksHover";}
		tags[i].onmouseout=function()
{this.className=this.className.replace(new RegExp(" blocksHover\\b"), "")}
		tags[i].onclick = function () {location.href = this.getElementsByTagName("a")[0].href}
	}		
}


	window.onload=function() {blocksHover('blocks')};
	




//***********************************************************************
// New windows to replace target=_blank
//***********************************************************************

/*
addEvent function from http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
*/
function addEvent( obj, type, fn )
{
	if (obj.addEventListener)
		obj.addEventListener( type, fn, false );
	else if (obj.attachEvent)
	{
		obj["e"+type+fn] = fn;
		obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
		obj.attachEvent( "on"+type, obj[type+fn] );
	}
}

function removeEvent( obj, type, fn )
{
	if (obj.removeEventListener)
		obj.removeEventListener( type, fn, false );
	else if (obj.detachEvent)
	{
		obj.detachEvent( "on"+type, obj[type+fn] );
		obj[type+fn] = null;
		obj["e"+type+fn] = null;
	}
}

/* Create the new window */
function openInNewWindow(e) {
	var event;
	if (!e) event = window.event;
	else event = e;
	// Abort if a modifier key is pressed
	if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
		return true;
	}
	else {
		// Change "_blank" to something like "newWindow" to load all links in the same new window
	    var newWindow = window.open(this.getAttribute('href'), '_blank');
		if (newWindow) {
			if (newWindow.focus) {
				newWindow.focus();
			}
			return false;
		}
		return true;
	}
}

/*
Add the openInNewWindow function to the onclick event of links with a class name of "new-window"
*/
function getNewWindowLinks() {
	// Check that the browser is DOM compliant
	if (document.getElementById && document.createElement && document.appendChild) {
		// Change this to the text you want to use to alert the user that a new window will be opened
		var strNewWindowAlert = "";
		// Find all links
		var links = document.getElementsByTagName('a');
		var objWarningText;
		var link;
		for (var i = 0; i < links.length; i++) {
			link = links[i];
			// Find all links with a class name of "new-window"
			if (/\bnew\-window\b/.test(link.className)) {
				// Create an em element containing the new window warning text and insert it after the link text
				objWarningText = document.createElement("em");
				objWarningText.appendChild(document.createTextNode(strNewWindowAlert));
				link.appendChild(objWarningText);
				link.onclick = openInNewWindow;
			}
		}
		objWarningText = null;
	}
}

addEvent(window, 'load', getNewWindowLinks);




//***********************************************************************
// Flash Embeddding script 
//***********************************************************************

/**
 * SWFObject v1.4.4: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2006 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * **SWFObject is the SWF embed script formerly known as FlashObject. The name was changed for
 *   legal reasons.
 */
 // undeclared variables from functions
 var c_start,spn,pn,__flash_unloadHandler, __flash_savedUnloadHandler;
if(typeof deconcept == "undefined") var deconcept = new Object();
if(typeof deconcept.util == "undefined") deconcept.util = new Object();
if(typeof deconcept.SWFObjectUtil == "undefined") deconcept.SWFObjectUtil = new Object();
deconcept.SWFObject = function(swf, id, w, h, ver, c, useExpressInstall, quality, xiRedirectUrl, redirectUrl, detectKey){
	if (!document.getElementById) { return; }
	this.DETECT_KEY = detectKey ? detectKey : 'detectflash';
	this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Array();
	if(swf) { this.setAttribute('swf', swf); }
	if(id) { this.setAttribute('id', id); }
	if(w) { this.setAttribute('width', w); }
	if(h) { this.setAttribute('height', h); }
	if(ver) { this.setAttribute('version', new deconcept.PlayerVersion(ver.toString().split("."))); }
	this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
	if(c) { this.addParam('bgcolor', c); }
	var q = quality ? quality : 'high';
	this.addParam('quality', q);
	this.setAttribute('useExpressInstall', useExpressInstall);
	this.setAttribute('doExpressInstall', false);
	var xir = (xiRedirectUrl) ? xiRedirectUrl : window.location;
	this.setAttribute('xiRedirectUrl', xir);
	this.setAttribute('redirectUrl', '');
	if(redirectUrl) { this.setAttribute('redirectUrl', redirectUrl); }
}
deconcept.SWFObject.prototype = {
	setAttribute: function(name, value){
		this.attributes[name] = value;
	},
	getAttribute: function(name){
		return this.attributes[name];
	},
	addParam: function(name, value){
		this.params[name] = value;
	},
	getParams: function(){
		return this.params;
	},
	addVariable: function(name, value){
		this.variables[name] = value;
	},
	getVariable: function(name){
		return this.variables[name];
	},
	getVariables: function(){
		return this.variables;
	},
	getVariablePairs: function(){
		var variablePairs = new Array();
		var key;
		var variables = this.getVariables();
		for(key in variables){
			variablePairs.push(key +"="+ variables[key]);
		}
		return variablePairs;
	},
	getSWFHTML: function() {
		var swfNode = "";
		if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { // netscape plugin architecture
			if (this.getAttribute("doExpressInstall")) { this.addVariable("MMplayerType", "PlugIn"); }
			swfNode = '<embed type="application/x-shockwave-flash" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
			swfNode += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
			var params = this.getParams();
			 for(var key in params){ swfNode += [key] +'="'+ params[key] +'" '; }
			var pairs = this.getVariablePairs().join("&");
			 if (pairs.length > 0){ swfNode += 'flashvars="'+ pairs +'"'; }
			swfNode += '/>';
		} else { // PC IE
			if (this.getAttribute("doExpressInstall")) { this.addVariable("MMplayerType", "ActiveX"); }
			swfNode = '<object id="'+ this.getAttribute('id') +'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
			swfNode += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
			var params = this.getParams();
			for(var key in params) {
			 swfNode += '<param name="'+ key +'" value="'+ params[key] +'" />';
			}
			var pairs = this.getVariablePairs().join("&");
			if(pairs.length > 0) {swfNode += '<param name="flashvars" value="'+ pairs +'" />';}
			swfNode += "</object>";
		}
		return swfNode;
	},
	write: function(elementId){
		if(this.getAttribute('useExpressInstall')) {
			// check to see if we need to do an express install
			var expressInstallReqVer = new deconcept.PlayerVersion([6,0,65]);
			if (this.installedVer.versionIsValid(expressInstallReqVer) && !this.installedVer.versionIsValid(this.getAttribute('version'))) {
				this.setAttribute('doExpressInstall', true);
				this.addVariable("MMredirectURL", escape(this.getAttribute('xiRedirectUrl')));
				document.title = document.title.slice(0, 47) + " - Flash Player Installation";
				this.addVariable("MMdoctitle", document.title);
			}
		}
		if(this.skipDetect || this.getAttribute('doExpressInstall') || this.installedVer.versionIsValid(this.getAttribute('version'))){
			var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
			n.innerHTML = this.getSWFHTML();
			return true;
		}else{
			if(this.getAttribute('redirectUrl') != "") {
				document.location.replace(this.getAttribute('redirectUrl'));
			}
		}
		return false;
	}
}

/* ---- detection functions ---- */
deconcept.SWFObjectUtil.getPlayerVersion = function(){
	var PlayerVersion = new deconcept.PlayerVersion([0,0,0]);
	if(navigator.plugins && navigator.mimeTypes.length){
		var x = navigator.plugins["Shockwave Flash"];
		if(x && x.description) {
			PlayerVersion = new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
		}
	}else{
		// do minor version lookup in IE, but avoid fp6 crashing issues
		// see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
		try{
			var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		}catch(e){
			try {
				var axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				PlayerVersion = new deconcept.PlayerVersion([6,0,21]);
				axo.AllowScriptAccess = "always"; // throws if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
			} catch(e) {
				if (PlayerVersion.major == 6) {
					return PlayerVersion;
				}
			}
			try {
				axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch(e) {}
		}
		if (axo != null) {
			PlayerVersion = new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
		}
	}
	return PlayerVersion;
}
deconcept.PlayerVersion = function(arrVersion){
	this.major = arrVersion[0] != null ? parseInt(arrVersion[0]) : 0;
	this.minor = arrVersion[1] != null ? parseInt(arrVersion[1]) : 0;
	this.rev = arrVersion[2] != null ? parseInt(arrVersion[2]) : 0;
}
deconcept.PlayerVersion.prototype.versionIsValid = function(fv){
	if(this.major < fv.major) return false;
	if(this.major > fv.major) return true;
	if(this.minor < fv.minor) return false;
	if(this.minor > fv.minor) return true;
	if(this.rev < fv.rev) return false;
	return true;
}
/* ---- get value of query string param ---- */
deconcept.util = {
	getRequestParameter: function(param) {
		var q = document.location.search || document.location.hash;
		if(q) {
			var pairs = q.substring(1).split("&");
			for (var i=0; i < pairs.length; i++) {
				if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
					return pairs[i].substring((pairs[i].indexOf("=")+1));
				}
			}
		}
		return "";
	}
}
/* fix for video streaming bug */
deconcept.SWFObjectUtil.cleanupSWFs = function() {
	if (window.opera || !document.all) return;
	var objects = document.getElementsByTagName("OBJECT");
	for (var i=0; i < objects.length; i++) {
		objects[i].style.display = 'none';
		for (var x in objects[i]) {
			if (typeof objects[i][x] == 'function') {
				objects[i][x] = function(){};
			}
		}
	}
}
// fixes bug in fp9 see http://blog.deconcept.com/2006/07/28/swfobject-143-released/
deconcept.SWFObjectUtil.prepUnload = function() {
	__flash_unloadHandler = function(){};
	__flash_savedUnloadHandler = function(){};
	if (typeof window.onunload == 'function') {
		var oldUnload = window.onunload;
		window.onunload = function() {
			deconcept.SWFObjectUtil.cleanupSWFs();
			oldUnload();
		}
	} else {
		window.onunload = deconcept.SWFObjectUtil.cleanupSWFs;
	}
}
if (typeof window.onbeforeunload == 'function') {
	var oldBeforeUnload = window.onbeforeunload;
	window.onbeforeunload = function() {
		deconcept.SWFObjectUtil.prepUnload();
		oldBeforeUnload();
	}
} else {
	window.onbeforeunload = deconcept.SWFObjectUtil.prepUnload;
}
/* add Array.push if needed (ie5) */
if (Array.prototype.push == null) { Array.prototype.push = function(item) { this[this.length] = item; return this.length; }}

/* add some aliases for ease of use/backwards compatibility */
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject; // for legacy support
var SWFObject = deconcept.SWFObject;



//***************************************************//
//         Text sizing version .9                    //
//***************************************************//

var sizesArray = new Array("95%", "96%", "97%", "98%", "100%", "102%", "103%", "104%", "105%")
var sizePointer
var ruleCounter
// ruleCounter is used for Mozilla due to the necessity to write the new CSS rule in the last position so that it is applied.


if (getCookie("sizePref") != "") {
	sizePointer = Number(getCookie("sizePref"))
	// now apply the font
	if (document.styleSheets[0].cssRules) {
		ruleCounter = document.styleSheets[0].cssRules.length
	// Mozilla
	document.styleSheets[0].insertRule("* {font-size: " + sizesArray[sizePointer] + ";}", ruleCounter)
		//ruleCounter = ruleCounter + 1
	}
	else {
	//IE
	document.styleSheets[0].addRule("*", "{font-size: " + sizesArray[sizePointer] + ";}")
	}
}
else {
	sizePointer = 4
}



function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}


function largerFont () {
	
	if (document.styleSheets[0].cssRules) {
	// Mozilla
		if (document.styleSheets[0].cssRules[0]) {
			if (sizePointer != 8) {
				ruleCounter = document.styleSheets[0].cssRules.length
				sizePointer = sizePointer + 1
				document.styleSheets[0].insertRule("* {font-size: " + sizesArray[sizePointer] + ";}", ruleCounter)
				//document.write('<style>* {font-size: ' + sizesArray[sizePointer] + ';}</style>');
				document.cookie = 'sizePref='+ sizePointer + '; path=/; domain=.cdc.gov';
			}
		}	
	}
	
	else if (document.styleSheets[0].rules) {
	// IE
		if (sizePointer < 8) {
			sizePointer = sizePointer + 1
			document.cookie = 'sizePref='+ sizePointer + '; path=/; domain=.cdc.gov';
			document.styleSheets[0].addRule("*", "{font-size: " + sizesArray[sizePointer] + ";}")
			}
		}
	}

function smallerFont () {
	
	if (document.styleSheets[0].cssRules) {
	// Mozilla
		if (document.styleSheets[0].cssRules[0]) {	
			if (sizePointer != 0) {
				sizePointer = sizePointer - 1
				ruleCounter = document.styleSheets[0].cssRules.length
				document.styleSheets[0].insertRule("* {font-size: " + sizesArray[sizePointer] + ";}", ruleCounter)
				document.cookie = 'sizePref='+ sizePointer + '; path=/; domain=.cdc.gov';
			}
		}	
	}
	
	else if (document.styleSheets[0].rules) {
	// IE
		if (sizePointer > 0) {
			sizePointer = sizePointer - 1
			document.cookie = 'sizePref='+ sizePointer + '; path=/; domain=.cdc.gov';
			document.styleSheets[0].addRule("*", "{font-size: " + sizesArray[sizePointer] + ";}")
		}
	}
}