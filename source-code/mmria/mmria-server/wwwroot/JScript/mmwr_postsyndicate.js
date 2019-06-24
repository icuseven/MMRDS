/*
 * MMWR-specific javascript to be invoked after syndicated content.
 */

/*
 * A function to fix the anchor tags that reference javascript functions.
 */
function CDC_FixJavascriptAnchors() {	
	var d = document.getElementById(CDC_syndicatedBlockId);
	if (d) {
		var anchors_arr = d.getElementsByTagName('a');
		for (var j in anchors_arr) {
			if (anchors_arr[j].href) {
				var pos = anchors_arr[j].href.indexOf("javascript:");
				if (pos > -1)	{
					anchors_arr[j].href = anchors_arr[j].href.substring(pos);
					anchors_arr[j].target = "_self";
				}
			}
		}
	}
}

CDC_FixJavascriptAnchors();

// Turn the syndicated block on content back "on".
if (typeof CDC_syndicatedBlockId != "undefined" &&
		document.getElementById(CDC_syndicatedBlockId)) {
	document.getElementById(CDC_syndicatedBlockId).style.display = "block";
}
