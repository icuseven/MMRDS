var jQueryScriptOutputted = ((typeof (jQueryScriptOutputted) == 'undefined') ? false : true);
var jQueryCookieScriptOutputted = ((typeof (jQueryCookieScriptOutputted) == 'undefined') ? false : true);
var homePageSurveyScriptOutputted = ((typeof (homePageSurveyScriptOutputted) == 'undefined') ? false : true);

function initJQuery() {
    if (typeof(jQuery) == 'undefined') {
	$.getScript('https://www.cdc.gov/TemplatePackage/js/B/jquery.js', function(data, textStatus){
	});
    }
}

function initJQueryWithSurvey() {
	if (typeof(jQuery) == 'undefined') {
		$.getScript('https://www.cdc.gov/TemplatePackage/js/B/jquery.js', function(data, textStatus){ });
	}
	if (typeof(jQuery.cookie) == 'undefined' || !jQueryCookieScriptOutputted) {
		$.getScript('https://www.cdc.gov/TemplatePackage/js/B/jquery/jquery.cookie.js', function(data, textStatus){ });
	}
	if (typeof(CDC) == 'undefined' ||
		typeof(CDC.Survey) == 'undefined' ||
		typeof(CDC.Survey.HomePage) == 'undefined') {
		$.getScript('/JScript/homePageSurvey.js', function(data, textStatus){ });
	}
	$(document).ready(function () {
		var homePageSurvey = new CDC.Survey.HomePage();
		if ($.browser.msie || homePageSurvey.TESTING) {
			var loyaltyFactor = 1;
			var samplingPercentage = 20.0;
			var pagesVisited = $.cookie(homePageSurvey.COOKIE_PAGE_VIEWS); // check counter cookie
			var alreadyShown = $.cookie(homePageSurvey.COOKIE_ALREADY_SHOWN); // check if we already have shown survey
			var pageCount;
			var randNum = Math.random() * 100.0;
			if (pagesVisited == null) {
				pageCount = 1;
				$.cookie(homePageSurvey.COOKIE_PAGE_VIEWS, pageCount);
				pagesVisited = $.cookie(homePageSurvey.COOKIE_PAGE_VIEWS);
			}
			if (pagesVisited != null || homePageSurvey.TESTING) {
				pageCount = pagesVisited;
				if (pageCount >= loyaltyFactor || homePageSurvey.TESTING) {
				    if (alreadyShown == null || homePageSurvey.TESTING) {
				        if (randNum <= samplingPercentage || homePageSurvey.TESTING) {
				        	homePageSurvey.showSurveyWindow();
				        }
				    }
				}
				pageCount++;
				$.cookie(homePageSurvey.COOKIE_PAGE_VIEWS, pageCount);
			}
		}
	});
}

initJQuery();
//initJQueryWithSurvey();

function DoBeacon(application, interaction) {
    $('body').append('<im' + 'g style=\"height:0px;width:0px;overflow:hidden;\" src=\"https://cdc.112.2o7.net/b/ss/devcdc/1/H.21--NS/0?cl=session&j=1.0&c41=' + application + '&c40=' + interaction + '&i=' + guid() + '\" />');
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}