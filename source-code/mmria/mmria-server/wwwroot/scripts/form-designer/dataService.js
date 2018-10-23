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
        'strings': $.grep(caseForm.children, function (e) { return e.type == 'string'; }),
        'groups': $.grep(caseForm.children, function (e) { return e.type == 'group'; }),
        'grids': $.grep(caseForm.children, function (e) { return e.type == 'Grid'; }),
    }
    return elements;
}

/**
 * Implements method to populate form designer canvas with form elements of chosen form
 * allowing user to set form elements prompt and control metadata via drag and drop
 * @param {Array} metaDataForms 
 */
function populateFormDesignerCanvas(metaDataForms, revert = false) {
    if (revert) {
        var caseForm = metaDataForms.find(x => x.name === activeForm);

        // Set what type of fields you would like
        formElements = groupFormElementsByType(caseForm);

        buildFormElementPromptControl(formElements);
    } else {
       $(".clickTrigger").click(function () {
        activeForm = this.id;
        var caseForm = metaDataForms.find(x => x.name === this.id);

        // Set what type of fields you would like
        formElements = groupFormElementsByType(caseForm);

        buildFormElementPromptControl(formElements);
    }); 
    }
}

/**
 * Implements method to compile form element markup and inject into form designer canvas
 * @param {Array} fe 
 */
function buildFormElementPromptControl(fe) {
    var inHTML = '';

    // String fields
    $.each(fe.strings, function(index, value) {
        var newItem = `<div id="` + value.name + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
        newItem += `<div id="` + value.name + `-control" class="resize-drag drag-drop yes-drop"> <textarea type="text" rows="1" placeholder="` + value.prompt + `"></textarea></div>`;
        inHTML += newItem;
    });

    // Label fields
    $.each(fe.labels, function (index, value) {
        var newItem = `<div id="` + value.name + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
        inHTML += newItem;
    });

    // Field groups
    $.each(fe.groups, function(index, value) {
        var groupName = value.name;
        var stringSet = $.grep(value.children, function(e) {
          return e.type == "string";
        });

        if (stringSet.length > 0) {
            $.each(stringSet, function(index, value) {
                var eid = groupName + '__' + value.name;
                var newItem = `<div id="` + eid + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
                newItem += `<div id="` + eid + `-control" class="resize-drag drag-drop yes-drop"> <textarea type="text" rows="1" placeholder="` + value.prompt + `"></textarea></div>`;
                inHTML += newItem;
            })
        }
    });

    // Grids
    $.each(fe.grids, function (index, value) {
        var groupName = value.name;
        var stringSet = $.grep(value.children, function (e) {
            return e.type == "string";
        });

        if (stringSet.length > 0) {
            $.each(stringSet, function (index, value) {
                var eid = groupName + '__' + value.name;
                var newItem = `<div id="` + eid + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
                newItem += `<div id="` + eid + `-control" class="resize-drag drag-drop yes-drop"> <textarea type="text" rows="1" placeholder="` + value.prompt + `"></textarea></div>`;
                inHTML += newItem;
            })
        }
    });

    // Write elements to canvas
    $(".form-designer-canvas").html(inHTML);

    // Add style to written elements
    styleElementsPerDefinition(fe.strings);
}

/**
 * Implements method to apply styles to form elements per saved form definitions
 * @param {Array} fe 
 */
function styleElementsPerDefinition(fe, group = null) {
    $.each(fe, function (index, value) {
        var tid = activeForm + '/' + value.name;
        if (tid in uiSpecification.form_design) {
            var el = uiSpecification.form_design[tid];
            if ('prompt' in uiSpecification.form_design[tid]) {
                // set style for element prompt
                $('#' + value.name).css({ "position": 'absolute', "top": el.prompt.x, "left": el.prompt.y, "width": el.prompt.width, "height": el.prompt.height });
                $('#' + value.name).attr({ "data-t": el.prompt.x, "data-l": el.prompt.y, "data-w": el.prompt.width, "data-h": el.prompt.height });
            }
            if ('control' in uiSpecification.form_design[tid]) {
                // set style for element control
                $('#' + value.name + '-control').css({ "position": 'absolute', "top": el.control.x, "left": el.control.y, "width": el.control.width, "height": el.control.height });
                $('#' + value.name + '-control').attr({ "data-t": el.prompt.x, "data-l": el.prompt.y, "data-w": el.prompt.width, "data-h": el.prompt.height });
            }
        }
    });

}