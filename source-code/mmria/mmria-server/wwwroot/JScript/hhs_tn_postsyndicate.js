/*
 * A function for HHS to strip everything but the thumbnail image from the content.
 */
function CDC_StripToThumbnail() {	
	var syndicatedElement = $("#cdc_syndicated");
	if (syndicatedElement.length > 0) {

		$("#cdcAttribution").each(function() {
			$(this).css("display", "none");
  	});
		$("#cdc_syndicated .syndicate").each(function() {
			$(this).css("display", "none");
  	});
	
		$("#cdc_syndicated img").each(function() {
			var imageUrl = $(this).attr("src");
			var imageAlt = $(this).attr("alt");
			var re = new RegExp("https://www.cdc.gov/salmonella/images/maps/typhimurium/typhimurium_([0-9]{6})_tn.jpg");
			var m = re.exec(imageUrl);
			if (m != null) {
				if (!newThumbnailLink) {
					newThumbnailLink = "#";
				}
				document.write("<a href='" + newThumbnailLink + "'><img src='" + imageUrl + "' alt='" + imageAlt + "' border='0' /></a>");
			} else {
				$(this).css("display", "none");				
			}
  	});

		// Turn the main block back on.
		syndicatedElement.css("display", "block");

	}
}

CDC_StripToThumbnail();
