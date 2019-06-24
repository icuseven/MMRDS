// Make sure the CDC and CDC.Metrics namespaces are defined.
if (typeof CDC == "undefined") var CDC = new Object();
if (typeof CDC.Metrics == "undefined") CDC.Metrics = new Object();

// Declare an object for handling Google Analytics methods/actions.
CDC.Metrics.GoogleAnalytics = function() {
	return {
		SetAccountNumber: function(account, domain) {
		}
	};
}();
