 /*
 * Javascript to be invoked after syndicated content.
 */
 
// Execute the methods here...
CDC.SyndicatedContent.moveAttribution();
CDC.SyndicatedContent.mapUrls();
CDC.SyndicatedContent.addCampaignIds();

// Additional logic to fix the target attributes for anchors on the swine flu what's new page.
$("a[href*='https://www2c.cdc.gov/podcasts']").each(function() {
	$(this).attr("target", "_self");
});

// Turn the syndicated block of content back "on".
CDC.SyndicatedContent.showContent();
