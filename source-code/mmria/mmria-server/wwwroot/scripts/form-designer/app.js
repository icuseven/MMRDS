/******************************************************
 * START properties
 *****************************************************/
var activeForm;
var formElements;
var uiSpecification = get_new_ui_specification("default"); 
var formDesign = {
  form_design: {}
};

/******************************************************
 * START logic
 *****************************************************/

writeFormSpecs();

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
	var prop = activeForm+'/'+formElement;
	if (prop in formDesign.form_design) {
		formDesign.form_design[prop][promptVcontrol] = {
			't': t,
			'l': l,
			'h': h,
			'w': w
		}
	} else {
		formDesign.form_design[prop] = new element(t,l,w,h,promptVcontrol);
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
		't': t,
		'l': l,
		'h': h,
		'w': w
	}
}

/**
 * Implements method to write form designer specs to screen for debugging
 */
function writeFormSpecs() {
	uiSpecification.form_design = formDesign.form_design;
	var html = JSON.stringify(uiSpecification, undefined, 1)
	$(".formDesignSpecsPre").html(html);
}

function toggleSideBar(arg) {
	if (arg === 'specs') {
		$('#formSelector').hide();
		$('#formDesignSpecs').show();
	} else {
		$('#formSelector').show();
		$('#formDesignSpecs').hide();
	}
}