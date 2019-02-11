let fdTemplates = {
    formListItem: function(value) {
        return `<div id="${value.name}" class="form-list-item" onclick="javascript: formDesigner.canvasHandler.formFields.display(this.id);">${value.prompt}</div>`;
    },
    uiSpecification: {
        options: function(value) {
            if(uiSpecification.currentID == value._id) {
                return `<option value="${value._id}" selected="selected">${value.name}</option>`;
            } else {
                return `<option value="${value._id}">${value.name}</option>`;
            }
        },
        dashboard: {
            info: function() {
                return `<span>
                        <strong>Current Specification: ${uiSpecification.currentObject.name}</strong> 
                        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#specModal">
                            More Info
                        </button> 
                        <button type="button" class="btn btn-primary" onclick="javascript: formDesigner.uiSpecHandler.modifySpec()">
                            Save Specification
                        </button>
                        </span>`;
            }
        },
    },
    formFields: {
        prompt: function(formName, value) {
            return `<label for="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.prompt}</label>`;
        },
        controls: {
            string: function(formName, value) {
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },
            textarea: function (formName, value) {
                return `<textarea id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" row="7" cols="80"></textarea>`;
            },
            list: function (formName, value) { 
                let listOptions = fdTemplates.formFields.controls.listOptions(value);
                let listField;
                if (value.hasOwnProperty('is_multiselect')) {
                    listField = `
                                <div id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${listOptions}</div>`;
                } else {
                    listField = `
                                <select id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">
                                    ${listOptions}
                                </select>`;
                }
                return listField;
            },
            listOptions: function (data) { 
                let values;
                if (data.path_reference !== undefined) {

                    let p = data.path_reference.split("/")[1];
                    let apiOptionValues = $.grep(metaData.fullObject.lookup, function (e) {
                        return e.name == p;
                    });
                    values = apiOptionValues[0].values;
                } else {
                    values = data.values;
                }

                let markup = '';
                if(data.is_multiselect) {
                    markup += `<div>`
                    $.each(values, function (index, value) {
                        markup += `<input type="checkbox" name="favorite_pet" value="${value.value}">${value.value}`
                    })
                    markup += `</div>`
                } else {
                    $.each(values, function (index, value) {
                        if (value.value === '') {
                            markup += `<option selected>- select -</option>`;
                        } else {
                            markup += `<option value="${value.value}">${value.value}</option>`;
                        }
                    });
                }

                return markup;
            },
            date: function (formName, value) { 
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },
            number: function (formName, value) { 
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },
            group: function (parentName, value) {
                let newGroupName = `${parentName}--${value.name}`;
                let groupFields = '';
                $.each(value.children, function(index, value) {
                    if(value.type.toLowerCase() === 'group') {
                        newSubGroupName = `${newGroupName}--${value.name}`;
                        groupFields += fdTemplates.formFields.controls.group(newSubGroupName, value);
                    }
                    // groupFields += `<div class="form-group form-group-wrapper form-field-item resize-drag drag-drop yes-drop item">`;
                    groupFields += fdTemplates.formFields.prompt(newGroupName, value);
                    if(value.type.toLowerCase() === 'list') {
                        groupFields += fdTemplates.formFields.controls.list(newGroupName, value);
                    } else {
                        groupFields += fdTemplates.formFields.controls.string(newGroupName, value);
                    }
                    // groupFields += `</div>`;
                })
                let group = `
                            <fieldset id="${newGroupName}" class="resize-drag drag-drop yes-drop fd-path-object"> 
                                <legend style="width:auto; padding: 8px">${value.prompt}</legend>
                                ${groupFields}
                            </fieldset>`;

                return group;
            }
        }
    }
}