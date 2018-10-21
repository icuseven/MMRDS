/******************************************************
 * START properties
 *****************************************************/
var activeForm;
var formElements; 
var uiSpecification;
var specId = getUrlParam();

/******************************************************
 * START logic
 *****************************************************/

getSpecById(specId);

/******************************************************
 * START methods
 *****************************************************/

/**
 * Implements method to create or edit form specific elements/objects
 * @param {string} activeForm 
 * @param {Array} formElements 
 * @param {Float32Array} t 
 * @param {Float32Array} l
 * @param {Float32Array} w
 * @param {Float32Array} h
 * @param {string} promptVcontrol 
 */
function createOrUpdateFormElements(activeForm, formElement, t, l, w, h, promptVcontrol) {
	formElement = formElement.replace('__', '/');
	var prop = activeForm + '/' + formElement;
	if (prop in uiSpecification.form_design) {
		uiSpecification.form_design[prop][promptVcontrol] = {
			'x': t,
			'y': l,
			'height': h,
			'width': w
		}
	} else {
		uiSpecification.form_design[prop] = new element(t, l, w, h, promptVcontrol);
	}
}

/**
 * Implements constructor method to create prompt or control objects for form specific elements
 * @param {Float32Array} t 
 * @param {Float32Array} l 
 * @param {Float32Array} h 
 * @param {Float32Array} w 
 * @param {string} e 
 */
function element(t = null, l = null, h = null, w = null, e = 'prompt') {
	this[e] = {
		'x': t,
		'y': l,
		'height': h,
		'width': w
	}
}

/**
 * Implements method to write form designer specs to screen for debugging
 */
function writeFormSpecs(initial = false) {
	var html = JSON.stringify(uiSpecification, undefined, 4)
	$(".formDesignSpecsPre").html(html);
}


/**
 * Implements global method to get URL parameters variables
 */
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}


/**
 * Implements method to grab parameter (UI specification) value from URL
 * @param {String} parameter 
 */
function getUrlParam(parameter = "_id") {
	if (window.location.href.indexOf(parameter) > -1) {
		urlparameter = getUrlVars()[parameter];
	} else {
		urlparameter = 'default_ui_specification';
	}
	return urlparameter;
}

/**
 * Implements method to get UI Spec by id and set main var uiSpecification. Also write form design object.
 * @param {String} id 
 */
function getSpecById(id) {
	var url = location.protocol + "//" + location.host + "/api/ui_specification/" + id;
	$.get(url, function(data, status) {
		uiSpecification = data;
		writeFormSpecs();
		console.log(uiSpecification);
	})
}

function saveSpec() {
	$.ajax({
		url: location.protocol + "//" + location.host + "/api/ui_specification/" + specId,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(uiSpecification),
		type: "POST"
	}).done(function (response) {
		var response_obj = eval(response);
		if (response_obj.ok) {
			getSpecById(specId);
		}
	});
}

