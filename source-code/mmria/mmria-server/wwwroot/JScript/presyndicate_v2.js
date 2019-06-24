/*
 * Javascript to be invoked before syndicated content.
 */

// Make sure the CDC namespace is defined.
if (typeof CDC == "undefined") var CDC = new Object();

// Declare an object for handling syndicated content from CDC.
CDC.SyndicatedContent = function() {

	var DEFAULT_CAMPAIGN_ID = "cs_000"; 		// Default campaign code for unregistered partners.
	var DEFAULT_CONTENT_DIV_ID = "cdc_syndicated";	// Default ID for container DIV holding syndicated content.
	var DEFAULT_ATTRIBUTION_DIV_ID = "cdcAttribution";	// Default ID for container DIV holding attribution content.
	var DEFAULT_LANGUAGE_REFERENCE = "en"; // Default language reference for attribution text.

	// A variable to hold the ID of the syndicated content.
	var contentDivId = DEFAULT_CONTENT_DIV_ID;

	// A variable to hold the ID of the attribution content.
	var attributionDivId = DEFAULT_ATTRIBUTION_DIV_ID;

	// A variable to hold campaign ID for registered partners.
	var campaignId = DEFAULT_CAMPAIGN_ID;

	// A variable to hold language reference for attribution content.
	var languageReference = DEFAULT_LANGUAGE_REFERENCE;

	// Holds a collection of URL mappings.
	var urlMappings = new Array();

	// Holds a collection of errors that occured during the javascript processing of the synidcated content.
	var syndicationErrors = new Array();

	// A mapping class used to define a mapping from an old URL to a new URL with a specified target attribute.
	function Mapping(oldUrl, newUrl, target) {
		this.oldUrl = oldUrl;
		this.newUrl = newUrl;
		this.target = target;
	}

	return {

		setCampaignCode: function(code) {
			campaignId = code;
		},

		getCampaignCode: function() {
			return campaignId;
		},

		setContentDivId: function(id) {
			contentDivId = id;
			// Turn "off" the display of the containing DIV block while processing takes place (it is turned back on in postsyndicate_v2.js).
			this.hideContent();
		},

		getContentDivId: function() {
			return contentDivId;
		},

		setAttributionDivId: function(id) {
			attributionDivId = id;
		},

		getAttributionDivId: function() {
			return attributionDivId;
		},

		getErrors: function() {
			return syndicationErrors;
		},

		addMapping: function(oldUrl, newUrl, target) {
			urlMappings[urlMappings.length] = new Mapping(oldUrl, newUrl, target);
		},

		hideContent: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				var syndicatedElement = document.getElementById(contentDivId);
				if (syndicatedElement) {
					syndicatedElement.style.display = "none";
				}
		},

		showContent: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				var syndicatedElement = document.getElementById(contentDivId);
				if (syndicatedElement) {
					syndicatedElement.style.display = "block";
				}
		},

		/*
		 * A quick string manipulation method to move the attribution div to the bottom of the container from the top
		 * to be rewritten to manipulate the page DOM nodes
		 */
		moveAttribution: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				if (typeof attributionDivId == "undefined") {
					attributionDivId = DEFAULT_ATTRIBUTION_DIV_ID;
				}
				var attributionElement = document.getElementById(attributionDivId);
				var syndicatedElement = document.getElementById(contentDivId);
				if (attributionElement && syndicatedElement) {
					var attributionHtml = attributionElement.innerHTML;
					if (languageReference == "es") {
							attributionHtml = "Fuente del contenido: Centros para el Control y la Prevención de Enfermedades";
					}
					attributionElement.innerHTML = "";
					attributionElement.id = attributionDivId + "_Moved";
					syndicatedElement.innerHTML = syndicatedElement.innerHTML + "<div id='" + attributionDivId + "'>" + attributionHtml + "</div>";
				} else if (!syndicatedElement) {
//					syndicatedElement.innerHTML = syndicatedElement.innerHTML + "<div id='" + attributionDivId + "_Error'>There has been an error during the retrieval of content from the Centers for Disease Control and Prevetion (CDC).  Please check back later.</div>";
				}
		},

		/*
		 * A function that iterates through an array of URL mappings to replace URL and/or target attributes.
		 */
		mapUrls: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				if (urlMappings && urlMappings.length > 0) {
					var d = document.getElementById(contentDivId);
					if (d) {
						var anchors_arr = d.getElementsByTagName('a');
						var sourceLink;
						var destinationLink;
						var linkHolder;
						for (var i in urlMappings) {
							sourceLink = urlMappings[i].oldUrl;
							destinationLink = urlMappings[i].newUrl;
							destinationTarget = urlMappings[i].target;
							for (var j in anchors_arr) {
								if (anchors_arr[j].href == sourceLink) {
									anchors_arr[j].href = destinationLink;
									anchors_arr[j].target = destinationTarget;
								} // end if
							} // end for j
						} // end for i
					} // end if d
				} // end if url...
		},

		/*
		 * A function to add the omniture beacon image call
		 */
		postpendOmniture: function() {
			document.write('<im'+'g src="http://cdcgov.112.2O7.net/b/ss/cdcsynd/1/H.15.1--NS/0'
				+'?cl=Session&amp;pageName='+escape(document.title.toLowerCase())+'&amp;c8=Syndicate&amp;c16=' + location.hostname.toLowerCase() + location.pathname.toLowerCase()+'" height="1" width="1" border="0" alt="" id="omnitureImage" />');
		},

		/*
		 * A function to add the campaign code to all inbound links
		 */
		addCampaignIds: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				var d = document.getElementById(contentDivId);
				if (d) {
					var anchors_arr = d.getElementsByTagName('a');
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].href != "undefined"  && anchors_arr[j].href != "") {
							if (anchors_arr[j].href.indexOf("cdc.gov") > 0 ) {
								if (anchors_arr[j].href.indexOf("?") > 0 ) {
									anchors_arr[j].href = anchors_arr[j].href + "&s_cid=" + campaignId;
								} else {
									anchors_arr[j].href = anchors_arr[j].href + "?s_cid=" + campaignId;
								} // end if
							} // end if
						} // end if
					} // end for
				} // end if d
		},

		/*
		 * A function to add a "namespace" to the child elements with IDs.
		 */
		addNamespace: function() {
				if (typeof contentDivId == "undefined") {
					contentDivId = DEFAULT_CONTENT_DIV_ID;
				}
				var d = document.getElementById(contentDivId);
				if (d) {
					var anchors_arr = d.getElementsByTagName("a");
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].id != "undefined"  && anchors_arr[j].id != "") {
							anchors_arr[j].id = contentDivId + "-" + anchors_arr[j].id;
						} // end if
					} // end for
					anchors_arr = d.getElementsByTagName("div");
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].id != "undefined"  && anchors_arr[j].id != "") {
							anchors_arr[j].id = contentDivId + "-" + anchors_arr[j].id;
						} // end if
					} // end for
					anchors_arr = d.getElementsByTagName("ul");
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].id != "undefined"  && anchors_arr[j].id != "") {
							anchors_arr[j].id = contentDivId + "-" + anchors_arr[j].id;
						} // end if
					} // end for
					anchors_arr = d.getElementsByTagName("li");
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].id != "undefined"  && anchors_arr[j].id != "") {
							anchors_arr[j].id = contentDivId + "-" + anchors_arr[j].id;
						} // end if
					} // end for
					anchors_arr = d.getElementsByTagName("img");
					for (var j in anchors_arr) {
						if (typeof anchors_arr[j].id != "undefined"  && anchors_arr[j].id != "") {
							anchors_arr[j].id = contentDivId + "-" + anchors_arr[j].id;
						} // end if
					} // end for
				} // end if d
		}

	};	// end return

}();

// Set some default URL mappings here.  The partner can also add mappings in their local javascript using the same syntaxt.
CDC.SyndicatedContent.addMapping('https://emergency.cdc.gov/disasters/floods/cleanupwater.asp', 'http://www.odh.ohio.gov/alerts/floodclean.aspx', '_self');
CDC.SyndicatedContent.addMapping('https://emergency.cdc.gov/disasters/floods/', 'http://www.odh.ohio.gov/alerts/floods.aspx', '_self');
