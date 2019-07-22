let fdTemplates = {
    formListItem: function(value) 
    {
        return `<button id="${value.name}" type="button" class="btn btn-outline-primary btn-block form-list-item" onclick="javascript: formDesigner.canvasHandler.formFields.display(this.id);">${value.prompt}</button>`;
        //return `<div id="${value.name}" class="form-list-item" onclick="javascript: formDesigner.canvasHandler.formFields.display(this.id);">${value.prompt}</div>`;
    },
    uiSpecification: 
    {
        options: function(value) 
        {
            if(uiSpecification.currentID == value._id) 
            {
                return `<option value="${value._id}" selected="selected">${value.name}</option>`;
            } 
            else 
            {
                return `<option value="${value._id}">${value.name}</option>`;
            }
        },
        dashboard: 
        {
            info: function() 
            {
                return `<span>
                        <strong>Current Specification: ${uiSpecification.currentObject.name}</strong> 
                        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#specModal">
                            More Info
                        </button> 
                        <button type="button" class="btn btn-primary" onclick="javascript: formDesigner.uiSpecHandler.modifySpec()">
                            Save Specification
                        </button>
                        </span>`;
            },
            localRev: function() 
            {
                return `Local Revision # ${uiSpecification.localCount } 
                        <button type="button" class="btn btn-warning" onclick="javascript: formDesigner.fdObjectHandler.rollBackRevision()">
                            Undo
                        </button>`;
            }
        },
    },
    formFields: 
    {
        prompt: function(formName, value) 
        {
            /*
            if (value.type.toLowerCase() === 'list' && value.hasOwnProperty('is_multiselect')) 
            {
                return '';
            } 
            else */
            if (value.type.toLowerCase() === 'hidden' || value.type.toLowerCase() === 'button') 
            {
                return '';
            }
            return `<label for="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.prompt}</label>`;
        },
        controls: 
        {
            string: function(formName, value) 
            {
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },
            textarea: function (formName, value) 
            {
                return `<textarea id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" row="7" cols="80"></textarea>`;
            },
            button: function (formName, value) 
            {
                return `<button id="${formName}--${value.name}" type="button" class="btn btn-raised btn-primary form-field-item resize-drag drag-drop yes-drop item fd-path-object">
                            ${value.prompt}
                        </button>`
            },
            list: function (formName, value) 
            { 
                let listOptions = fdTemplates.formFields.controls.listOptions(value);
                let listField;

                /*
                if (value.hasOwnProperty('is_multiselect')) {
                    listField = `
                                <fieldset id="${formName}--${value.name}" class="resize-drag drag-drop yes-drop fd-path-object list-fieldset">
                                    <legend style="width:auto; padding: 8px">${value.prompt}</legend>
                                    ${listOptions}
                                </fieldset>`;
                } else {
                    */

                var list_display_size= '';
                if(value.list_display_size)
                {

                    list_display_size = ' size=' + value.list_display_size;
                }

                    listField = `
                                <select id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" ${list_display_size} >
                                    ${listOptions}
                                </select>`;
                //}
                return listField;
            },
            listOptions: function (data) 
            { 
                let values;
                if (data.path_reference !== undefined) 
                {

                    let p = data.path_reference.split("/")[1];
                    let apiOptionValues = $.grep
                    (
                        metaData.fullObject.lookup, 
                        function (e) 
                        {
                            return e.name == p;
                        }
                    );
                    values = apiOptionValues[0].values;
                } 
                else 
                {
                    values = data.values;
                }

                let markup = '';
                /*
                if(data.is_multiselect) {
                    $.each(values, function (index, value) {
                        if (value.value === '') {
                            return true;
                        }
                        markup += `
                                  <div class="form-check form-check-inline" style="width:45%">
                                    <input class="form-check-input" type="checkbox" id="${data.prompt}${index}" value="${value.value}">
                                    <label class="form-check-label" for="${data.prompt}${index}">${value.value}</label>
                                  </div>`;
                    })
                } else {
                    */


                    $.each
                    (
                        values,
                         function (index, value) 
                        {
                            if (value.value === '') 
                            {
                                markup += `<option selected>- select -</option>`;
                            }
                            else 
                            {
                                markup += `<option value="${value.value}">${value.value}</option>`;
                            }
                        }
                    );
                //}

                return markup;
            },
            date: function (formName, value) 
            { 
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },
            number: function (formName, value) 
            { 
                return `<input id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ></input>`;
            },

            chart: function (formName, value) 
            { 
                return `<div id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" ><p>chart</p><h3>${value.prompt}</h3></div>`;
            },
            group: function (parentName, value) 
            {
                let newGroupName = `${parentName}--${value.name}`;
                let groupFields = '';
                $.each
                (
                    value.children, 
                    function(index, value) 
                    {
                        if(value.type.toLowerCase() === 'group' || value.type.toLowerCase() == 'grid')
                        {
                            //let newSubGroupName = `${newGroupName}--${value.name}`;
                            groupFields += fdTemplates.formFields.controls.group(newGroupName, value);
                        }
                        else
                        {
                            groupFields += fdTemplates.formFields.prompt(newGroupName, value);
                            if(value.type.toLowerCase() === 'list') 
                            {
                                groupFields += fdTemplates.formFields.controls.list(newGroupName, value);
                            }
                            else if (value.type.toLowerCase() === 'hidden') 
                            {
                                return; // hide do nothing
                            }
                            else if (value.type.toLowerCase() === 'button') 
                            {
                                groupFields += fdTemplates.formFields.controls.button(newGroupName, value)
                            } 
                            else if (value.type.toLowerCase() === 'date') 
                            {
                                groupFields += fdTemplates.formFields.controls.date(newGroupName, value)
                            } 
                            else 
                            {
                                groupFields += fdTemplates.formFields.controls.string(newGroupName, value);
                            }
                        }
                        // groupFields += `</div>`;
                    }
                )
                
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