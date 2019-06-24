 /*
 * Javascript to be invoked after syndicated content.
 */
 
// Execute the methods here...
CDC.SyndicatedContent.moveAttribution();
CDC.SyndicatedContent.mapUrls();
CDC.SyndicatedContent.addCampaignIds();
CDC.SyndicatedContent.addNamespace();
CDC.SyndicatedContent.postpendOmniture();

// Turn the syndicated block of content back "on".
CDC.SyndicatedContent.showContent();
