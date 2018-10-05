/******************************************************
 * START properties
 *****************************************************/
var urlTestBase = 'http://test.mmria.org/api/';
var urlProdBase = location.protocol + '//' + location.host + '/api/';
var urlMetaData = urlProdBase + "metadata";


/******************************************************
 * START logic
 *****************************************************/
$.get(urlMetaData, function(data, status) {
    var metaDataForms = buildFormList(data);

    populateFormDesignerCanvas(metaDataForms);

});


/******************************************************
 * START methods
 *****************************************************/

/**
 * Implements method to build clickable form list based on meta data and returns elements specific to case form
 * @param {Array} data 
 */
function buildFormList(data) {
    var metaDataForms = $.grep(data.children, function (e) { return e.type === 'form'; });

    var inHTML = '';

    $.each(metaDataForms, function (index, value) {
        var newItem = "<li class=\"clickTrigger\" id=\"" + value.name + "\">" + value.prompt + "</li>";
        inHTML += newItem;
    });

    $("#repeatNavContainer").html(inHTML);

    return metaDataForms;
}

/**
 * Implements method to get form elements and group by field/control type
 * @param {Array} caseForm 
 */
function groupFormElementsByType(caseForm) {
    var elements = {
        'labels': $.grep(caseForm.children, function (e) { return e.type == 'label'; }),
        'strings': $.grep(caseForm.children, function (e) { return e.type == 'string'; })
    }
    return elements;
}

/**
 * Implements method to populate form designer canvas with form elements of chosen form
 * allowing user to set form elements prompt and control metadata via drag and drop
 * @param {Array} metaDataForms 
 */
function populateFormDesignerCanvas(metaDataForms) {
    $(".clickTrigger").click(function () {
        activeForm = this.id;
        var caseForm = metaDataForms.find(x => x.name === this.id);

        // Set what type of fields you would like
        formElements = groupFormElementsByType(caseForm);

        buildFormElementPromptControl(formElements);
    });
}

/**
 * Implements method to compile form element markup and inject into form designer canvas
 * @param {Array} fe 
 */
function buildFormElementPromptControl(fe) {
    var inHTML = '';

    $.each(fe.strings, function(index, value) {
        var newItem = `<div id="` + value.name + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
        newItem += `<div id="` + value.name + `-control" class="resize-drag drag-drop yes-drop"> <input type="text" placeholder="` + value.prompt + `"> </div>`;
        inHTML += newItem;
    });

    $.each(fe.labels, function (index, value) {
        var newItem = `<div id="` + value.name + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
        inHTML += newItem;
    });

    $(".form-designer-canvas").html(inHTML);

    styleElementsPerDefinition(fe.strings);
    styleElementsPerDefinition(fe.labels);
}

/**
 * Implements method to apply styles to form elements per saved form definitions
 * @param {Array} fe 
 */
function styleElementsPerDefinition(fe) {
    $.each(fe, function(index, value) {
        var tid = activeForm+'/'+value.name;
        if(tid in formDesign.form_design) {
            var el = formDesign.form_design[tid];
            if('prompt' in formDesign.form_design[tid]) {
                // set style for element prompt
                $('#' + value.name).css({"position": 'absolute', "top": el.prompt.t, "left": el.prompt.l, "width": el.prompt.w, "height": el.prompt.h});
            }
            if ('control' in formDesign.form_design[tid]) {
                // set style for element control
                $('#' + value.name + '-control').css({"position": 'absolute', "top": el.control.t, "left": el.control.l, "width": el.control.w, "height": el.control.h})
            }
        }
    });

}