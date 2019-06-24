// Add the click handlers to track specific events in GA.
$(document).ready(function() {

    // ***************************************************************
    // Search form update for DigitalGov Search
    // ***************************************************************

    // Check for 3x Template Package
    var blnIs3x = $('#searchArea').length > 0;

    // (Temporary - to be refactoered) 1x & 2x TEMPLATE VERSIONS, normalize form styles / append to the head
    if (!blnIs3x) {
        var formStyle = '<style>.search-form-checkbox { display: none; } .searchRadio { display: none; } div[id^="searchForm"] #query{float: left; margin:0; padding:0; border:1px solid #525967; font-size:1.2em; color:#036; height:19px; width:230px; } div[id^="searchForm"] #query.small{margin:0; padding:0; border:1px solid #525967; font-size:1.2em; color:#036; height:19px; width:120px;} div[id^="searchForm"] #query:focus, div[id^="searchForm"] textarea:focus {background-color:yellow;}</style>';
        $('head').append(formStyle);
    }

    var aryPathsToIgnore = [
            // No ignores at current, this was for pilot testing
            //'/vhf/ebola/',
            //'/enes/vhf/ebola/'
        ],
        // Local Search Exception Sites (Use All Lower Case Urls!)
        aryLocalSearchWhiteList = [{
            site: "atsdr_prod",
            localDisplayLabel: "ATSDR",
            locationMatch: "atsdr.cdc.gov",
            siteLimit: ["www.atsdr.cdc.gov"],
            autoComplete: true
        }, {
            site: "atsdr_dev",
            localDisplayLabel: "ATSDR",
            locationMatch: "atsdr-dev.cdc.gov",
            siteLimit: ["www.atsdr.cdc.gov"],
            autoComplete: true
        }, {
            site: "pcd",
            localDisplayLabel: "PCD",
            locationMatch: ".cdc.gov/pcd/",
            siteLimit: ["www.cdc.gov/pcd/"],
            autoComplete: true
        }, {
            site: "mmwr",
            localDisplayLabel: "MMWR",
            locationMatch: ".cdc.gov/mmwr/",
            siteLimit: ["www.cdc.gov/mmwr/"],
            autoComplete: true
        }, {
            site: "travelers_health",
            localDisplayLabel: "Traveler's Health",
            locationMatch: ".cdc.gov/travel/",
            siteLimit: ["wwwnc.cdc.gov/travel/"],
            autoComplete: true
        }, {
            site: "nhsn",
            localDisplayLabel: "NHSN",
            locationMatch: ".cdc.gov/nhsn/",
            siteLimit: ["www.cdc.gov/nhsn/"],
            autoComplete: true
        }, {
            site: "vaccines",
            localDisplayLabel: "Vaccines and Immunizations",
            locationMatch: ".cdc.gov/vaccines/",
            siteLimit: ["www.cdc.gov/vaccines/"],
            autoComplete: true
        }, {
            site: "niosh",
            localDisplayLabel: "NIOSH",
            locationMatch: ".cdc.gov/niosh/",
            siteLimit: ["www.cdc.gov/niosh", "blogs.cdc.gov/niosh-science-blog/"],
            autoComplete: true
        }, {
            site: "eid",
            localDisplayLabel: "EID Only",
            locationMatch: ".cdc.gov/eid/",
            siteLimit: ["wwwnc.cdc.gov/eid/"],
            autoComplete: true
        }, {
            site: "nchs",
            localDisplayLabel: "NCHS",
            locationMatch: ".cdc.gov/nchs/",
            siteLimit: ["www.cdc.gov/nchs/"],
            autoComplete: true
        }, {
            site: "csels",
            localDisplayLabel: "Science Clips",
            locationMatch: ".cdc.gov/library/sciclips/",
            siteLimit: ["www.cdc.gov/library/sciclips/"],
            autoComplete: false
        }],
        // The search form
        jqSearchForm = $('form[id^="searchCDC"], form[id^="searchForm"], form.searchForm'),
        // The search input field
        jqSearchInput = jqSearchForm.find('input[type="text"]'),
        // Selector for the local/global search options
        strLocalSearchOptSelector = '.searchRadio,.search-form-checkbox,table.hidden-two.hidden-four,td.hidden-three.hidden-one',
        // Selector for local search skipNav Link
        strLocalSearchSkipNavSelector = '.skippy[href="#searchBoxLocal"]',
        // 2.x small search box
        strSmallClass = jqSearchInput.is('#searchBoxSmall') ? 'small' : '',
        // Does the page have an esp class in the html or body tag?
        blnSpanishPage = $('html.esp, body.esp').length,
        // The DigitalGov site handle used for search results
        strAffiliate = blnSpanishPage ? 'cdc-es' : 'cdc-main',
        // The DigitialGov site key
        strUtf8 = '&#x2713;',
        // The DigitialGov form action
        strFormAction = window.location.protocol + '//search.cdc.gov/search',
        // The DigitalGov autocomplete class
        strAutoCompleteClass = 'usagov-search-autocomplete',
        // Label (watermark) that appears in the search box
        strSearchLabel = blnSpanishPage ? 'BUSCAR' : 'SEARCH',
        // Clear anyCheck for utf8 input
        jqInputUtf8 = $('input[name="utf8"]'),
        // Check for affiliate input
        jqInputAffiliate = $('input[name="affiliate"]'),
        strHost = window.location.host,
        strPath = window.location.pathname,
        strHref = window.location.href.toLowerCase(),
        blnWhiteListedDomain = false,
        blnAutoComplete = false,
        arySiteLimit = [];

    // don't continue if the host & path match is in the sites to ignore
    for (var i = 0, len = aryPathsToIgnore.length; i < len; i++) {
        if (strPath.indexOf(aryPathsToIgnore[i]) === 0) {
            return;
        }
    }

    // Check for local search exceptions (LSE) via locationMatch
    for (var i = aryLocalSearchWhiteList.length - 1; i >= 0; i--) {
        var objCurrLse = aryLocalSearchWhiteList[i];

        // Did we find a match?
        if (objCurrLse && objCurrLse.locationMatch && strHref.indexOf(objCurrLse.locationMatch) > -1) {
            // Flag & exit loop
            blnWhiteListedDomain = true;
            blnAutoComplete = objCurrLse.autoComplete;
            arySiteLimit = objCurrLse.siteLimit;
            break;
        }
    };

    // change the id and name of the search input, and add the "small" class if it's needed
    jqSearchInput.attr({
        id: 'query',
        name: 'query'
    }).addClass(strSmallClass);

    // if AutoComplete is enabled, use it
    if (!!blnAutoComplete) {
        jqSearchInput.addClass(strAutoCompleteClass);
    }

    // if the watermark library is available, set the watermark or change it's text
    if ($.watermark) {
        jqSearchInput.watermark({
            html: strSearchLabel
        });
        $('.wm-label').text(strSearchLabel); // If the watermark is already set, override the text
    }

    // change the attributes on the search form
    jqSearchForm.attr({
        'accept-charset': 'UTF-8',
        action: strFormAction,
        method: 'get'
    });

    // Clear Existing and Append Formatted UTF8 Field
    $('input[name="utf8"]', jqSearchForm).remove();
    jqSearchForm.append('<input type="hidden" name="utf8" id="utf8" value="' + strUtf8 + '" />');

    // Clear Existing and Append Formatted Affiliate Field
    $('input[name="affiliate"]', jqSearchForm).remove();
    jqSearchForm.append('<input type="hidden" name="affiliate" id="affiliate" value="' + strAffiliate + '" />');

    // Update Submit Function to Add SiteLimit if selected option is local
    jqSearchForm.submit(function(e) {

        var jqLocalSearchInput = $('input[name="subset"]:checked, input[name="sitelimit"]:checked', $(this)),
            blnLocalSearchChecked = (jqLocalSearchInput.length === 1);

        if (blnWhiteListedDomain === true && jqLocalSearchInput.length > 0) {

            // IS THIS SELECTION FIELD THE SITELIMIT FIELD?
            if (jqLocalSearchInput.attr('name') === "sitelimit") {

                // UPDATE THE VALUE
                jqLocalSearchInput.val(arySiteLimit.join(' | '));

            } else {

                // SITELIMIT IS NOT THE RADIO OR CHECKBOX
                // CLEAR ANY PRE-EXISTING FIELD
                $('input[name="sitelimit"]', jqSearchForm).remove();

                var strSiteLimit;
                // HAS A SEARCH SELECT (SITELIMIT HAS BEEN SELECTED - IS THE VALUE NOT EMPTY STRING)
                if (blnLocalSearchChecked) {
                    // USE THE PRE-DEFINED SITE LIMIT
                    strSiteLimit = arySiteLimit.join(' | ');
                } else {
                    // ELSE SET SITE LIMIT TO EMPTY STRING
                    strSiteLimit = "";
                }

                // APPEND A FRESH COPY
                jqSearchForm.append('<input type="hidden" name="sitelimit" id="sitelimit" value="' + strSiteLimit + '" />');
            }

        }
        return true;
    });

    // Is this a whitelisted domain?
    if (blnWhiteListedDomain) {
        // Show the search options
        window.setTimeout(function() {
            /*
            // 3X FIX FOR DESCREPANCIES IN INCLUDE IMPLEMENTATION
            // GET LOCAL SEARCH SELECTION(S)
            var jqSubsetLabel = $('label.subset', jqSearchForm);

            // GET LABEL(S)
            var jqSubsetInput = $('input[name="subset"]', jqSubsetLabel);

            // ENSURE WE ARE IN 3X (SUBSET IS A CHECKBOX IN 3X)
            if (jqSubsetInput.length <= 2 && jqSubsetInput.attr('type') == 'checkbox') {

                // CHECK IF THE SUBSET INPUT HAS NO VALUE
                if (!jqSubsetInput.val().length) {

                    // DEFAULT IT
                    jqSubsetInput.val(objCurrLse.site);
                }

                // RECONSTRUCT THE INPUT - LABEL (AS CHECKBOX -> TEXT)
                if (jqSubsetLabel.length <= 2) {
                    jqSubsetLabel.html("");
                    jqSubsetLabel.append(jqSubsetInput[0]);
                    jqSubsetLabel.append(objCurrLse.localDisplayLabel);
                }
            }
            */
            // SHOW LOCAL SEARCH ITEMS
            $(strLocalSearchOptSelector).show();
        }, 0);
     } else {
        // FIND LOCAL SEARCH ELEMENTS
        var jqLocalSearchElements = $(strLocalSearchOptSelector, jqSearchForm);
        // Remove the search options from search form
        jqLocalSearchElements.remove();
        // Remove the skipNav Link to Local Search
        $(strLocalSearchSkipNavSelector).remove();
    }

    // BEGIN: DigitalGov AutoComplete / TypeAhead Functionality
    window.usasearch_config = {
        siteHandle: strAffiliate
    };

    var script;
    // Create Script Tag
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//search.usa.gov/javascripts/remote.loader.js";

    // Append to Head
    document.getElementsByTagName("head")[0].appendChild(script);

    // END: DigitalGov AutoComplete / TypeAhead Functionality
});
