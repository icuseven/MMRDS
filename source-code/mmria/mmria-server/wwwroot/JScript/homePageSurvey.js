if (typeof CDC == "undefined") var CDC = new Object();
if (typeof CDC.Survey == "undefined") CDC.Survey = new Object();
if (typeof CDC.Survey.HomePage == "undefined") CDC.Survey.HomePage = new Object();
CDC.Survey.HomePage = function() {
}
CDC.Survey.HomePage.prototype = {

	TESTING : false,
	SURVEY_URL : 'https://www.surveymonkey.com/s/JD6VZ5J',
	COOKIE_ALREADY_SHOWN : "homepageSurveyAlreadyShown", // name of the cookie to track whether or not the user has been shown the survey.
	COOKIE_PAGE_VIEWS : "homepageSurveyPageViews", // name of the cookie to track number of page loads.

	registerEventHandlers : function(t) {
		$('#feedbackModal .header .logos a').click(function(e) {
			$('#feedbackModal').modal('hide');
			e.preventDefault();
			return false;
		});
		$('#feedbackModal #submitButton').click(function(e) {
			$('#feedbackModal').modal('hide');
			$.cookie(t.COOKIE_ALREADY_SHOWN, 'true');
			var popupHomepageSurvey = window.open(t.SURVEY_URL, '', 'resizable=yes,menubar=no,scrollbars=yes,toolbar=no,height=550,width=750,left=' + (screen.availWidth / 2 - 375) + ',top=' + (screen.availHeight / 2 - 225));
			if (popupHomepageSurvey && !popupHomepageSurvey.opener) popupHomepageSurvey.opener = window;
			if (popupHomepageSurvey) popupHomepageSurvey.focus();
			e.preventDefault();
			return false;
		});
		$('#feedbackModal #cancelButton').click(function(e) {
			$('#feedbackModal').modal('hide');
			e.preventDefault();
			return false;
		});
	},

	showSurveyWindow : function() {
		if ($('#feedbackModal').length === 0) {
			var that = this;
			$.cookie(that.COOKIE_ALREADY_SHOWN, 'true');
			$.ajax({
				dataType: 'html',
				url: '/JScript/homePageSurvey.html',
				cache: false,
				context: document.body,
				success: function(data){
			  		$('<div class="wrapper" />').html(data).appendTo($('<div id="feedbackModal" class="survey-splash" />').appendTo($('div#contentArea')));
					$('#feedbackModal').modal();
					that.registerEventHandlers(that);
				}
			});
		} else {
			$('#feedbackModal').modal();
			that.registerEventHandlers(this);
		}
	},

	trigger: function() {
		var n = 100; /* One out of n visitors will be given survey */
		var random_num = random_num = Math.round(n * Math.random());
		//random_num = 1; // uncomment this line to debug, this will trigger the research everytime 
		if ((random_num <= 1) && (navigator.appName.indexOf('WebTV') == -1)) {
			if ($.cookie(this.COOKIE_ALREADY_SHOWN) != 'true' || this.TESTING) {
				//this.showSurveyWindow();
			}
		}
	}

};

$(function () {
	var survey = new CDC.Survey.HomePage();
	survey.trigger();
});
