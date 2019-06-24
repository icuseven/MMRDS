 /*
 * Javascript to be invoked after syndicated content.
 */
 
// Execute the methods here...
CDC.SyndicatedContent.mapUrls();
CDC.SyndicatedContent.addRegistrationIds();

// Turn the syndicated block of content back "on" (just in case it was turned off).
CDC.SyndicatedContent.showContent();

CDC.SyndicatedContent.showSurvey();