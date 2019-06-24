if (typeof CDC == "undefined") var CDC = new Object();
if (typeof CDC.Survey == "undefined") CDC.Survey = new Object();
if (typeof CDC.Survey.HomePage == "undefined") CDC.Survey.HomePage = new Object();
if (typeof CDC.Survey.HomePage.Spanish == "undefined") CDC.Survey.HomePage.Spanish = new Object();
CDC.Survey.HomePage.Spanish = function() {}
CDC.Survey.HomePage.Spanish.prototype = {

	TESTING : false,
	SURVEY_URL : 'https://es.surveymonkey.com/s/3Y78829',
	COOKIE_ALREADY_SHOWN : "spanishHomepageSurveyAlreadyShown", // name of the cookie to track whether or not the user has been shown the survey.

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
				url: '/JScript/homePageSurvey-es.html',
				cache: false,
				context: document.body,
				success: function(data){
			  		$('<div class="wrapper" />').html(data).appendTo($('<div id="feedbackModal" class="survey-splash" />').appendTo($('div#contentArea')));
					$('#feedbackModal').modal();
					that.registerEventHandlers(that);
				}
			});
		}
	},

	trigger: function() {
		var n = 40;
		var min = 1;
		var max = 100;
		// Gets a random number between min and max (inclusive).
		var random_num = Math.floor(Math.random() * (max - min + 1)) + min;
		//random_num = n; // uncomment this line to debug, this will trigger the survey everytime 
		if (random_num <= n || this.TESTING) {
			if ($.cookie(this.COOKIE_ALREADY_SHOWN) != 'true' || this.TESTING) {
				this.showSurveyWindow();
			}
		}
	}

};

$(function () {
	var surveyShown = false;
	var doSurvey = function() {
		surveyShown = true;
		var survey = new CDC.Survey.HomePage.Spanish();
		survey.trigger();
	};
	var timer = setTimeout(doSurvey, 15000);
});
