/*
 * Javascript to be invoked after syndicated content.
 */

/*
 * A quick string manipulation method to move the attribution div to the bottom of the container from the top
 * to be rewritten to manipulate the page DOM nodes
 */
function CDC_moveAttribution() {
	var attributionElement = document.getElementById("cdcAttribution");
	var syndicatedElement = document.getElementById(CDC_syndicatedBlockId);
	if (attributionElement && syndicatedElement) {
		var attributionHtml = attributionElement.innerHTML;
		if (cdc_lang_ref == 'es') {
		    attributionHtml = 'Fuente del contenido: Centros para el Control y la Prevención de Enfermedades';
		}
		attributionElement.innerHTML = "";
		attributionElement.id = "attributionMoved";
		document.write("<div id='cdcAttribution'>" + attributionHtml + "</div>");
	} else if (syndicatedElement && !attributionElement) {
//		syndicatedElement.innerHTML = syndicatedElement.innerHTML + "<div id='cdcError'>There has been an error during the retrieval of content from the Centers for Disease Control and Prevetion (CDC).  Please check back later.</div>";
	}
 }

/*
 * A function that iterates through an array of URL mappings to replace URL and/or target attributes.
 */
function CDC_collection() {
	if (cdc_collection_arr && cdc_collection_arr.length > 0) {
		var d = document.getElementById(CDC_syndicatedBlockId);
		if (d) {
			var anchors_arr = d.getElementsByTagName('a');
			var sourceLink;
			var destinationLink;
			var linkHolder;
			for (i in cdc_collection_arr) {
				sourceLink = cdc_collection_arr[i].oldUrl;
				destinationLink = cdc_collection_arr[i].newUrl;
				destinationTarget = cdc_collection_arr[i].target;

				for(j in anchors_arr) {
					if (anchors_arr[j].href == sourceLink)	{
						anchors_arr[j].href = destinationLink;
						anchors_arr[j].target = destinationTarget;
					}
				}
			}
		}
	}
 }

 /*
  * A function to add the campaign code to all inbound links
  */
function CDC_campaign() {
		var d = document.getElementById(CDC_syndicatedBlockId);
		if (d) {
			var anchors_arr = d.getElementsByTagName('a');
				for(j in anchors_arr) {
					if (anchors_arr[j].href != "" && anchors_arr[j].href != undefined)	{
						if (anchors_arr[j].href.indexOf("cdc.gov") > 0 ) {
							if (anchors_arr[j].href.indexOf("?") > 0 ) {
								anchors_arr[j].href = anchors_arr[j].href + "&s_cid=" + reg_camp_id;
							} else {
								anchors_arr[j].href = anchors_arr[j].href + "?s_cid=" + reg_camp_id;
							}
						}
					}
				}
		}
 }

/*
 * A function to add the omniture beacon image call
 */
function CDC_postpendOmniture() {
	document.write('<im'+'g src="http://cdcgov.112.2O7.net/b/ss/cdcsynd/1/H.15.1--NS/0'
		+'?cl=Session&amp;pageName='+escape(document.title.toLowerCase())+'&amp;c8=Syndicate&amp;c16=' + location.hostname.toLowerCase() + location.pathname.toLowerCase()+'" height="1" width="1" border="0" alt="" id="omnitureImage" />');
}

// Execute the methods here...
try {
	CDC_moveAttribution();
} catch(err) {
	var moveError = 1;
}

try {
	CDC_postpendOmniture();
} catch(err) {
	var omnitureError = 1;
}

try {
	CDC_collection();
} catch(err) {
	var collectionError = 1;
}

try {
	CDC_campaign();
} catch(err) {
	var collectionError = 1;
}

// Turn the syndicated block of content back "on".
if (typeof CDC_syndicatedBlockId != "undefined" &&
		document.getElementById(CDC_syndicatedBlockId)) {
	document.getElementById(CDC_syndicatedBlockId).style.display = "block";
}
