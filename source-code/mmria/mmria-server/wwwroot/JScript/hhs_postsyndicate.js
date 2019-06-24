/*
 * HHS-specific javascript to be invoked after syndicated content.
 */

/*
 * A function for HHS to strip everything but the image from the content.
 */
function CDC_StripToImage() {	
	var syndicatedElement = $("#cdc_syndicated");
	if (syndicatedElement.length > 0) {

		// Turn it back on.
		syndicatedElement.css("display", "block");
				
		$(".syndicate").each(function() {
			$(this).prepend("<div class='widgetHeader'><img src='https://www.cdc.gov/images/WidgetHeader.jpg' alt='Salmonella Typhimurium Outbreak 2009' width='500' height='50' /></div>");
		});
		
		var footerDiv = $(document.createElement("div"));
		footerDiv.attr("class", "widgetFooter");

		var moreInfoLink = document.createElement("a");
		moreInfoLink.innerHTML = "CDC Outbreak Information";
		moreInfoLink.href = "https://www.cdc.gov/salmonella/typhimurium/?s_cid=cs_hhs1";
		moreInfoLink.className = "moreInfoLink";	
		var govLink = document.createElement("a");
		govLink.innerHTML = "FDA Outbreak Information";
		govLink.href = "http://www.fda.gov/oc/opacom/hottopics/salmonellatyph.html?s_cid=cs_hhs1";
		govLink.className = "govLink";
		var widgetLink = document.createElement("a");
		widgetLink.innerHTML = "Get This Widget";
		widgetLink.href = "https://www.cdc.gov/widgets/?s_cid=cs_hhs1";
		widgetLink.className = "widgetLink";

		footerDiv.append(moreInfoLink);
		footerDiv.append(govLink);
		footerDiv.append(widgetLink);

		$(".syndicate").each(function() {
			$(this).append(footerDiv);
		});

		document.write("<style type='text/css' media='all'>\n");
		document.write("#cdc_syndicated {\n");
		document.write("  background-color: #FBAF0F; height: 513px; width: 560px; padding: 6px 0px 0px 10px;\n");
		document.write("}\n");
		document.write("#cdc_syndicated * {\n");
		document.write("  display: none; margin: 0; padding: 0;\n");
		document.write("}\n");
		document.write("#cdc_syndicated .syndicate, #cdc_syndicated .syndicate .imgspot, #cdc_syndicated .syndicate .imgspot img \n");
		document.write("{\n");
		document.write("  display: block;\n");
		document.write("}\n");
		document.write("#cdc_syndicated .syndicate {\n");
		document.write("  margin: 0; padding: 0;\n");
		document.write("}\n");
		document.write("#cdc_syndicated .syndicate .imgspot {\n");
		document.write("  margin: 0; padding: 0; width: 500px;\n");
		document.write("}\n");
		document.write("#cdc_syndicated .syndicate .imgspot img {\n");
		document.write("  margin: 0; padding: 0; height: 413px; width: 550px;\n");
		document.write("}\n");
		document.write("#cdc_syndicated div.widgetHeader, #cdc_syndicated div.widgetHeader img {\n");
		document.write("  height: 50px; width: 550px; overflow: hidden; display: block;\n");
		document.write("  padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px;\n");
		document.write("}\n");
		document.write("#cdc_syndicated div.widgetFooter {\n");
		document.write("  background: transparent url('https://www.cdc.gov/images/WidgetFooter.jpg') top left;\n");
		document.write("  height: 50px; width: 550px; overflow: hidden;\n");
		document.write("  font-weight: bold; font: 12px Arial, \"Trebuchet MS\", Verdana, Geneva, Helvetica, sans-serif;\n");
		document.write("  padding: 0px; margin: 0px; margin-top: -4px; display: block;\n");
		document.write("}\n");
		document.write("#cdc_syndicated div.widgetFooter .moreInfoLink {\n");
		document.write("  padding-top: 30px;\n");
		document.write("  padding-left: 12px;\n");
		document.write("  display: block; width: 210px; float: left; clear: none;\n");
		document.write("  color: black; font-weight: bold; display: block;\n");
		document.write("}\n");
		document.write("#cdc_syndicated div.widgetFooter .govLink {\n");
		document.write("  padding-top: 30px;\n");
		document.write("  display: block; width: 180px; float: left; clear: none;\n");
		document.write("  color: black; font-weight: bold; display: block;\n");
		document.write("}\n");
		document.write("#cdc_syndicated div.widgetFooter .widgetLink {\n");
		document.write("  padding-top: 30px;\n");
		document.write("  padding-right: 12px;\n");
		document.write("  width: 120px; float: right; clear: none; text-align: right;\n");
		document.write("  color: black; font-weight: bold; display: block;\n");
		document.write("}\n");
		document.write("</style>\n");
		
	}
}

/*
 * A function to add omniture beacon image call
 */
function CDC_postpendOmniture() {
	document.write('<im'+'g src="http://cdcgov.112.2O7.net/b/ss/cdcsynd/1/H.15.1--NS/0'
		+'?cl=Session&amp;pageName='+escape(document.title)+'&amp;c8=Syndicate&amp;c16=' + location.hostname.toLowerCase() + location.pathname.toLowerCase()+'" height="1" width="1" border="0" alt="" id="omnitureImage" />');
}

CDC_StripToImage();

try {
	CDC_postpendOmniture();
} catch(err) {
	var omnitureError = 1; 
}
