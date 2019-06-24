/*
 * Javascript to be invoked before syndicated content.
 */

// If the ID of the containing DIV block has not been defined then set it to the default value.
if (typeof CDC_syndicatedBlockId == "undefined") {
	var CDC_syndicatedBlockId = "cdc_syndicated";
}

var cdc_collection_arr = new Array();

function Mapping(oldUrl, newUrl, target) {
	this.oldUrl = oldUrl;
	this.newUrl = newUrl;
	this.target = target;
}

cdc_collection_arr[0] = new Mapping('https://emergency.cdc.gov/disasters/floods/cleanupwater.asp', 'http://www.odh.ohio.gov/alerts/floodclean.aspx', '_self');
cdc_collection_arr[1] = new Mapping('https://emergency.cdc.gov/disasters/floods/', 'http://www.odh.ohio.gov/alerts/floods.aspx', '_self');


/*
 Default campaign code for unregistered partners.
*/

var reg_camp_id = 'cs_000';

/* 
Default language reference for attribution text.
*/

var cdc_lang_ref = 'en';

// Turn "off" the display of the containing DIV block while processing takes place (it is turned back on in postsyndicate.js).
if (typeof CDC_syndicatedBlockId != "undefined" &&
		document.getElementById(CDC_syndicatedBlockId)) {
	document.getElementById(CDC_syndicatedBlockId).style.display = "none";
}
