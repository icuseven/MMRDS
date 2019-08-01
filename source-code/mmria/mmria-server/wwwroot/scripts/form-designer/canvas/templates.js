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

            if 
            (
                (value.is_multiselect && value.is_multiselect == true) ||
                value.control_style && 
                (
                    value.control_style.indexOf("checkbox") > -1 ||
                    value.control_style.indexOf("radio") > -1
                )
            )
            {
                return '';
            } 
            else if (value.type.toLowerCase() === 'hidden' || value.type.toLowerCase() === 'button') 
            {
                return '';
            }
            else
            {
                return `<label for="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.prompt}</label>`;
            }
            
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
                let listOptions = fdTemplates.formFields.controls.listOptions(value, formName + "--" + value.name);
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


                if(value.control_style && value.control_style.indexOf("editable") > -1)
                {
                    listField = `
                                <div id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" ${list_display_size}>
                                <select style="width:98%;height:49%;">
                                    ${listOptions}
                                </select>
                                <br/>
                                <input value="editable list" style="width:98%;height:49%;"/>
                                </div>
                                
                                `;

                }
                else if
                (
                    (value.is_multiselect && value.is_multiselect == true) ||
                    value.control_style && 
                    (
                        value.control_style.indexOf("checkbox") > -1 ||
                        value.control_style.indexOf("radio") > -1
                    )
                )
                {

                    listField = `
                    <fieldset id="${formName}--${value.name}" class="resize-drag drag-drop yes-drop fd-path-object"> 
                        <legend>${value.prompt}</legend>
                            ${listOptions}
                        </fieldset>`;


                }
                else
                {
                    listField = `
                                <select id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" ${list_display_size} >
                                    ${listOptions}
                                </select>`;

                }
                //}
                return listField;
            },
            listOptions: function (data, formName) 
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
 
                if
                (
                    (data.control_style && data.control_style.indexOf("checkbox") > -1) ||
                    (data.is_multiselect && data.is_multiselect == true)
                )
                {
                    $.each
                    (
                        values,
                            function (index, value) 
                        {
                            
                            //markup += `<input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="checkbox" ></input>`;
                            if (value.description == null || value.description === '') 
                            {
                                if(value.value == null || value.value == '')
                                {
                                    markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="checkbox" /> (blank)</label>`;
                                }
                                else 
                                {
                                    markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="checkbox" /> ${value.value}</label>`;
                                }   
                                //markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object">${value.value}</label>`;
                            }
                            else 
                            {
                                markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="checkbox" /> ${value.description}</label>`;
                            }
                        }
                    );
                }
                else if(data.control_style && data.control_style.indexOf("radio") > -1)
                {
                    $.each
                    (
                        values,
                            function (index, value) 
                        {

                            //markup += `<input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" name="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="radio" ></input>`;
                            if (value.description == null || value.description === '') 
                            {
                                if(value.value == null || value.value == '')
                                {
                                    markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" name="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="radio" ></input> (blank)</label>`;
                                }
                                else 
                                {
                                    markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" name="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="radio" ></input> ${value.value}</label>`;
                                }
                                
                            }
                            else 
                            {
                                markup += `<label for="${formName}--${value.value.replace(/[\/ ]/g, "--")}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object"><input id="${formName}--${value.value.replace(/[\/ ]/g, "--")}" name="${formName}--${value.value.replace(/[\/ ]/g, "--")}" type="radio" ></input> ${value.description}</label>`;
                            }
                        }
                    );
                }
                else
                {
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
                }
 
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
            label: function (formName, value) 
            { 
                return `<div id="${formName}--${value.name}" class="form-field-item resize-drag drag-drop yes-drop item fd-path-object" type="text" >${value.prompt}</div>`;
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
                            else if (value.type.toLowerCase() === 'label') 
                            {
                                groupFields += fdTemplates.formFields.controls.label(newGroupName, value)
                            } 
                            else 
                            {
                                groupFields += fdTemplates.formFields.controls.string(newGroupName, value);
                            }
                        }
                        // groupFields += `</div>`;
                    }
                )
                
                let group = null;

                if(value.type.toLowerCase() == 'grid')
                {
                    group = `
                    <fieldset id="${newGroupName}" class="resize-drag drag-drop yes-drop fd-path-object"> 
                        <legend>${value.prompt} - 4 item(s)</legend>
                        <div style="overflow-y: scroll;height: 100%;">
                            <div class="grid-control-action-icn row no-gutters" style="padding:32px 12px 16px;">
                                <button type="button" class="grid-control-action-btn mr-1" title="delete">
                                <span class="x24 fill-p text-secondary cdc-icon-close"></span><span class="sr-only">Close</span></button><span> item 1 of 4</span>
                            </div> 
                        
                            ${groupFields}
                        
                        </div>
                        <button type="button" class="grid-control-btn btn btn-primary d-flex align-items-center">

                        <span class="x24 cdc-icon-plus"></span> Add Item</button>
                        </fieldset>`;
                }
                else
                {
                    group = `
                    <fieldset id="${newGroupName}" class="resize-drag drag-drop yes-drop fd-path-object"> 
                        <legend>${value.prompt}</legend>
                        ${groupFields}
                        </fieldset>`;

                }

                return group;
            }
        }
    }
}