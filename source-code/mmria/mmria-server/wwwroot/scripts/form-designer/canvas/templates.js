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
                        Current Specification: <strong>${uiSpecification.currentObject.name}</strong> 
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#specModal">
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
            return `<label for="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.prompt} - label</label>`;
        },
        controls: {
            string: function(formName, value) {
                return `<div id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.prompt}</div>`;
            },
            textarea: function (formName, value) {},
            list: function (formName, value) { },
            listOptions: function (formName, value) { },
            date: function (formName, value) { },
            number: function (formName, value) { },
            group: function (parentName, value) {
                let newGroupName = `${parentName}--${value.name}`;
                let groupFields = '';
                $.each(value.children, function(index, value) {
                    if(value.type === 'group') {
                        newSubGroupName = `${newGroupName}--${value.name}`;
                        groupFields += fdTemplates.formFields.controls.group(newSubGroupName, value);
                    }
                    groupFields += fdTemplates.formFields.prompt(newGroupName, value);
                    groupFields += fdTemplates.formFields.controls.string(newGroupName, value);
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