/******************************************************
 * START properties
 *****************************************************/
var urlTestBase = 'http://test.mmria.org/api/';
var urlProdBase = location.protocol + '//' + location.host + '/api/';
var urlMetaData = urlProdBase + "metadata";
var activeSpec;


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
        // 'grids': $.grep(caseForm.children, function (e) { return e.type == 'Grid'; }),
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

        $('.resize-drag').on('mouseenter', function () {
            writeActionSpecs('in', this.id);
        });
        $(".resize-drag").on("mouseleave", function() {
          writeActionSpecs('out', this.id);
        });
    });
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
        var newItem = `<fieldset id="` + value.name + `" class="resize-drag drag-drop yes-drop fd-fieldset">`
        newItem += '<legend>' + value.prompt + '</legend>';
        var groupName = value.name;
        var stringSet = $.grep(value.children, function(e) {
          return e.type == "string";
        });

        if (stringSet.length > 0) {
            $.each(stringSet, function(index, value) {
                var eid = groupName + '__' + value.name;
                newItem += `<div id="` + eid + `" class="resize-drag drag-drop yes-drop">` + value.prompt + `</div>`;
                newItem += `<div id="` + eid + `-control" class="resize-drag drag-drop yes-drop"> <textarea type="text" rows="1" placeholder="` + value.prompt + `"></textarea></div>`;
            })
        }
        newItem += `</fieldset>`;
        inHTML += newItem;
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
    styleElementsPerDefinition(fe.strings, fe.groups);
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
                if(el.prompt) {
                    // set style for element prompt
                    $('#' + value.name).css({ "position": 'absolute', "top": el.prompt.x, "left": el.prompt.y, "width": el.prompt.width, "height": el.prompt.height });
                    $('#' + value.name).attr({ "data-t": el.prompt.x, "data-l": el.prompt.y, "data-w": el.prompt.width, "data-h": el.prompt.height });
                }
            }
            if ('control' in uiSpecification.form_design[tid]) {
                if (el.control) {
                    // set style for element control
                    $('#' + value.name + '-control').css({ "position": 'absolute', "top": el.control.x, "left": el.control.y, "width": el.control.width, "height": el.control.height });
                    $('#' + value.name + '-control').attr({ "data-t": el.control.x, "data-l": el.control.y, "data-w": el.control.width, "data-h": el.control.height });
                }
            }
        }
    });

    if (group) {
        console.log(group);
        $.each(group, function (index, value) {
            var tid = activeForm + '/' + value.name;
            var gn = value.name;
            if (tid in uiSpecification.form_design) {
                var el = uiSpecification.form_design[tid];
                if ('prompt' in uiSpecification.form_design[tid]) {
                    if (el.prompt) {
                        // set style for element prompt
                        $('#' + value.name).css({ "position": 'absolute', "top": el.prompt.x, "left": el.prompt.y, "width": el.prompt.width, "height": el.prompt.height });
                        $('#' + value.name).attr({ "data-t": el.prompt.x, "data-l": el.prompt.y, "data-w": el.prompt.width, "data-h": el.prompt.height });
                    }
                }
                if ('control' in uiSpecification.form_design[tid]) {
                    if (el.control) {
                        // set style for element control
                        $('#' + value.name + '-control').css({ "position": 'absolute', "top": el.control.x, "left": el.control.y, "width": el.control.width, "height": el.control.height });
                        $('#' + value.name + '-control').attr({ "data-t": el.control.x, "data-l": el.control.y, "data-w": el.control.width, "data-h": el.control.height });
                    }
                }
            }

            var stringSet = $.grep(value.children, function (e) {
                return e.type == "string";
            });

            if (stringSet.length > 0) {
                $.each(stringSet, function (index, value) {
                    var eid = tid + '/' + value.name;
                    var jeid = gn + '__' + value.name;
                    if (eid in uiSpecification.form_design) {
                        var el = uiSpecification.form_design[eid];
                        if ('prompt' in uiSpecification.form_design[eid]) {
                            if (el.prompt) {
                                // set style for element prompt
                                $('#' + jeid).css({ "position": 'absolute', "top": el.prompt.x, "left": el.prompt.y, "width": el.prompt.width, "height": el.prompt.height });
                                $('#' + jeid).attr({ "data-t": el.prompt.x, "data-l": el.prompt.y, "data-w": el.prompt.width, "data-h": el.prompt.height });
                            }
                        }
                        if ('control' in uiSpecification.form_design[eid]) {
                            if (el.control) {
                                // set style for element control
                                $('#' + jeid + '-control').css({ "position": 'absolute', "top": el.control.x, "left": el.control.y, "width": el.control.width, "height": el.control.height });
                                $('#' + jeid + '-control').attr({ "data-t": el.control.x, "data-l": el.control.y, "data-w": el.control.width, "data-h": el.control.height });
                            }
                        }
                    }
                })
            }
        });
    }

}
function writeActionSpecs(val, obj) {
    let prop;
    obj = obj.replace('__', '/');
    if(obj.includes('control')) {
        obj = obj.replace('-control', '');
        prop = activeForm + "/" + obj;
        activeSpec = uiSpecification.form_design[prop];
    } else {
        prop = activeForm + "/" + obj;
        activeSpec = uiSpecification.form_design[prop];
    }
    if(val === 'in') {
        if (activeSpec === undefined) {
            var html = "Default specifications";
        } else {
            var html = JSON.stringify(activeSpec, undefined, 4);
        }
        $(".liveSpecHeading").html(prop);
        $(".liveSpec").html(html);
        $('.liveSpec').show('slow');
    }
}