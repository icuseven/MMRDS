/*
 * Javascript to be invoked before syndicated content.
 */

// Make sure the CDC namespace is defined.
if (typeof CDC == "undefined") var CDC = new Object();

// Declare an object for handling syndicated content from CDC.
CDC.SyndicatedContent = function() {

    var DEFAULT_REGISTRATION_ID = "cs_000"; 		// Default registration ID for unregistered partners.
    var DEFAULT_CONTENT_DIV_ID = "cdc_syndicated"; // Default ID for container DIV holding syndicated content.

    // A variable to hold the registration ID for registered partners.
    var registrationId = DEFAULT_REGISTRATION_ID;

    // A variable to hold the ID of the syndicated content.
    var contentDivId = DEFAULT_CONTENT_DIV_ID;

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

        //
        // The set/getCampaignCode is being kept for backward compatibility with _v2.
        //
        setCampaignCode: function(code) {
            registrationId = code;
        },

        getCampaignCode: function() {
            return registrationId;
        },
        //
        //

        setRegistrationId: function(id) {
            registrationId = id;
        },

        getRegistrationId: function() {
            return registrationId;
        },

        setContentDivId: function(id) {
            contentDivId = id;
        },

        getContentDivId: function() {
            return contentDivId;
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
        * A function to add the registration ID to all inbound links
        */
        addRegistrationIds: function() {
            if (typeof contentDivId == "undefined") {
                contentDivId = DEFAULT_CONTENT_DIV_ID;
            }
            var d = document.getElementById(contentDivId);
            if (d) {
                var anchors_arr = d.getElementsByTagName('a');
                for (var j in anchors_arr) {
                    if (typeof anchors_arr[j].href != "undefined" && anchors_arr[j].href != "") {
                        if (anchors_arr[j].href.indexOf("cdc.gov") > 0 && anchors_arr[j].href.indexOf("#") < 0) {
                            if (anchors_arr[j].href.indexOf("s_cid=") < 0) {
                                if (anchors_arr[j].href.indexOf("?") > 0) {
                                    anchors_arr[j].href = anchors_arr[j].href + "&s_cid=" + registrationId;
                                } else {
                                    anchors_arr[j].href = anchors_arr[j].href + "?s_cid=" + registrationId;
                                } // end if
                            } else {
                                anchors_arr[j].href = anchors_arr[j].href.replace(/s_cid=.*/, "s_cid=" + registrationId);
                            } // end if
                        } // end if
                    } // end if
                } // end for
            } // end if d
        },

        /*
        * Decides whether to display ingested static content or use a real-time pull from CDC
        * Assumes jquery (with ajax) is available and an array called realTimeSyndicationPages is defined
        * which contains a list of URLs.
        */
        ConditionallyRetrieveContent: function(syndicationUrl, staticContentClass) {
            //Hide the cdc_syndicated div
            $('#' + DEFAULT_CONTENT_DIV_ID).hide();
            
            //Get the URL of the current page
            var currentUrl = window.location.toString().toLowerCase();

            //Checks the realTimeSyndicationPages array to see if current page’s URL exists there.
            $.each(realTimeSyndicationPages, function(index, value) { realTimeSyndicationPages[index] = value.toLowerCase(); });

            //If the current URL exists in realTimeSyndicationPages, inject the content syndication javascript and hide the static content block
            if ($.inArray(currentUrl, realTimeSyndicationPages) > -1) {
                //Remove the div containing the class name passed to this function. Also, prevent 
                //the removal of divs containing the same class name within the cdc_syndicated block.
                $(document).ready(function() {
                    $("div." + staticContentClass).remove();
                });
                
                //Inject the content via the syndication URL
                $.getScript(syndicationUrl);
            } else { //Remove the syndication block and show the static content div
                $(document).ready(function() {
                    $('#' + DEFAULT_CONTENT_DIV_ID).remove();
                    $('.' + staticContentClass).show();
                });
            }
        },

        /*
        * Decides whether to display ingested static content or use a real-time pull from CDC
        * Assumes jquery (with ajax) is available and an array called realTimeSyndicationPages is defined
        * which contains a list of URLs.
        */
        showSurvey: function () {

            function SurveySetting(KeynoteInviteId, Url, Likelihood, Delay) {
                //this.RegId = RegId;
                this.Url = Url;
                this.Likelihood = Likelihood;
                this.Delay = Delay;
		this.KeynoteInviteId = KeynoteInviteId;
            }

            var surveySettings = new Array();
	    //Oregon: B97B84A997D94DC38FD76233C992CED3
	    //Licking, OH: 10326FF82356451B84A207B02A241D40
	    //Marion, OH: B9EEFBFBC99D435C9848260A1C66DFDD
	    //Arkansas: E718C46728F34F31B80DF1313AB57535
	    //Darke: DE63D75090FF41DA9880526360F31A43
	    //Buncombe: 1D53F6BCF94E4656AD965EF0C8A33B8E
	    //Polk: FD1B3A116176480495A60DECBD8E01D2
	    
	    surveySettings[0] = new SurveySetting("0342E8DD7E9B4211823FDE76324F09D0", "http://www.marionpublichealth.org/links.html", 0.5, 10000); //Marion
	    surveySettings[1] = new SurveySetting("5B52891613524E158282D2C5A61E23D8", "http://www.lickingcohealth.org/nursing/flu.html", 0.5, 10000); //Licking Co.
	    surveySettings[2] = new SurveySetting("B97B84A997D94DC38FD76233C992CED3", "http://www.flu.oregon.gov/Pages/index.aspx", 0.5, 10000); //Oregon
	    surveySettings[3] = new SurveySetting("E718C46728F34F31B80DF1313AB57535", "http://www.healthy.arkansas.gov/programsServices/infectiousDisease/communicableDiseaseImmunizations/SeasonalFlu/Pages/KeyFacts.aspx", 0.5, 10000); //Arkansas
	    surveySettings[4] = new SurveySetting("DE63D75090FF41DA9880526360F31A43", "http://www.darkecountyhealth.org/NURSING/FLU/cdc/flu%20season%20is%20here.html", 0.5, 10000); //Darke
	    surveySettings[5] = new SurveySetting("DE63D75090FF41DA9880526360F31A43", "http://www.darkecountyhealth.org/NURSING/FLU/cdc/flu%20vaccine.html", 0.5, 10000); //Darke.
	    surveySettings[6] = new SurveySetting("DE63D75090FF41DA9880526360F31A43", "http://www.darkecountyhealth.org/NURSING/FLU/cdc/flu%20prevention.html", 0.5, 10000); //Darke
	    surveySettings[7] = new SurveySetting("DE63D75090FF41DA9880526360F31A43", "http://www.darkecountyhealth.org/NURSING/FLU/cdc/flu%20care.html", 0.5, 10000); //Darke
    	    surveySettings[8] = new SurveySetting("FD1B3A116176480495A60DECBD8E01D2", "http://www.polkcountyiowa.gov/Health/pages/diseaseprevention.aspx", 0.5, 10000); //Darke
	    surveySettings[9] = new SurveySetting("FD1B3A116176480495A60DECBD8E01D2", "http://www.polkcountyiowa.gov/Health/pages/cdc_whattodo.aspx", 0.5, 10000); //Darke
	    surveySettings[10] = new SurveySetting("FD1B3A116176480495A60DECBD8E01D2", "http://www.polkcountyiowa.gov/Health/pages/cdc_whatyoushouldknow.aspx", 0.5, 10000); //Darke
    	    surveySettings[11] = new SurveySetting("FD1B3A116176480495A60DECBD8E01D2", "http://www.polkcountyiowa.gov/Health/pages/cdc_symptoms.aspx", 0.5, 10000); //Darke
	    surveySettings[12] = new SurveySetting("FD1B3A116176480495A60DECBD8E01D2", "http://www.polkcountyiowa.gov/Health/pages/cdc_references.aspx", 0.5, 10000); //Darke
	    
	    surveySettings[13] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_map", 0.5, 10000); //Buncombe
	    surveySettings[14] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_know", 0.5, 10000); //Buncombe
	    surveySettings[15] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_h1n1", 0.5, 10000); //Buncombe
	    surveySettings[16] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=h1n1_videos", 0.5, 10000); //Buncombe
	    surveySettings[17] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_new", 0.5, 10000); //Buncombe
	    surveySettings[18] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_references", 0.5, 10000); //Buncombe
	    surveySettings[19] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_symptoms", 0.5, 10000); //Buncombe
    	    surveySettings[20] = new SurveySetting("1D53F6BCF94E4656AD965EF0C8A33B8E", "http://www.buncombecounty.org/governing/depts/Health/cdc/cdc_report.asp?title=flu_todo", 0.5, 10000); //Buncombe
	    var completeURL = window.location.href; 
	    var arrayUrl = completeURL.split("?");
	    var urlWithoutQuerystring = arrayUrl[0];

            var i = surveySettings.length;
            while (i--) {

                //if (urlWithoutQuerystring.toLowerCase() === surveySettings[i].Url.toLowerCase() && surveySettings[i].RegId.toLowerCase() === CDC.SyndicatedContent.getRegistrationId().toLowerCase()) {
		if (urlWithoutQuerystring.toLowerCase() === surveySettings[i].Url.toLowerCase()) {
		    var keynoteInterceptLikelihood = surveySettings[i].Likelihood;
                    var keynoteInterceptTaskKey = surveySettings[i].KeynoteInviteId;
                    var keynoteInterceptType = 'Layer';

                    setTimeout(function () {
                            try {
                                if (Math.random() >= (keynoteInterceptLikelihood * 5)) return;
                                var s = document.createElement('script');
                                s.src = 'http://webeffective.keynote.com/applications/intercept/filter_page.asp?inv=' + keynoteInterceptTaskKey + '&type=' + keynoteInterceptType + '&rate=' + keynoteInterceptLikelihood + '&max=5';

var ScrollTop = document.body.scrollTop;
if (ScrollTop == 0)
{
	if (window.pageYOffset)
		ScrollTop = window.pageYOffset;
	else
		ScrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
}
ScrollTop = ScrollTop + 100;
var styleTag = document.createElement('style');
styleTag.type = 'text/css';
var cssStr = '#KEYNMainDiv{top: ' + ScrollTop + 'px !important;}';

if(styleTag.styleSheet){// IE
	styleTag.styleSheet.cssText = cssStr;
} else {// w3c
var cssText = doc.createTextNode(cssStr);
	styleTag.appendChild(cssText);
}
document.body.appendChild(styleTag);
	
				document.body.insertBefore(s, document.body.firstChild);
                                window.keynoteConnectorWindow = 'primary';
                            }
                            catch (e) { }

                        }, surveySettings[i].Delay);

                    break;
                }
            }

        }

    }; // end return

} ();

// Set some default URL mappings here.  The partner can also add mappings in their local javascript using the same syntaxt.
CDC.SyndicatedContent.addMapping('https://emergency.cdc.gov/disasters/floods/cleanupwater.asp', 'http://www.odh.ohio.gov/alerts/floodclean.aspx', '_self');
CDC.SyndicatedContent.addMapping('https://emergency.cdc.gov/disasters/floods/', 'http://www.odh.ohio.gov/alerts/floods.aspx', '_self');
CDC.SyndicatedContent.addMapping('http://www.regulations.gov/search/regs/contentstreamer?objectid=0900006480ac184d&disposition=attachment&contenttype=html', 'http://www.regulations.gov/search/Regs/contentStreamer?objectId=0900006480ac184d&disposition=attachment&contentType=html', '_blank');
CDC.SyndicatedContent.addMapping('http://www.regulations.gov/search/regs/contentstreamer?objectid=0900006480ac1897&disposition=attachment&contenttype=pdf', 'http://www.regulations.gov/search/Regs/contentStreamer?objectId=0900006480ac1897&disposition=attachment&contentType=pdf', '_blank');
