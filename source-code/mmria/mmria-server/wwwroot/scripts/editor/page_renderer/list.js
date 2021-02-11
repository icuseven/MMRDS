function list_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
    // data migration - start
    let data_migration_list = p_metadata.values;

    if(p_metadata.path_reference && p_metadata.path_reference != "")
    {
        data_migration_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

        if(data_migration_list == null)	
        {
            data_migration_list = p_metadata.values;
        }
    }

    if(Array.isArray(p_data))
    {
        for(let item_index = 0; item_index < p_data.length; item_index++)
        {
            let array_item = p_data[item_index];
            let is_found = false;

            for(let i = 0; i < data_migration_list.length; i++)
            {
                let item = data_migration_list[i];

                if(item.value == array_item)
                {
                    is_found = true;
                    break;
                }
            }

            if(!is_found)
            {
                for(let i = 0; i < data_migration_list.length; i++)
                {
                    let item = data_migration_list[i];
        
                    if(item.value == 9999 && array_item == null || array_item == "")
                    {
                        p_data[item_index] = item.value;
                        break;
                    }
                    if(item.display && item.display == array_item)
                    {
                        p_data[item_index] = item.value;
                        break;
                    }
                }   
            }
        }
    }
    else
    {
        let is_found = false;

        for(let i = 0; i < data_migration_list.length; i++)
        {
            let item = data_migration_list[i];

            if(item.value == p_data)
            {
                is_found = true;
                break;
            }
        }

        if(!is_found)
        {

            if(p_metadata.name.indexOf("pmss") > -1)
            {
                for(let i = 0; i < data_migration_list.length; i++)
                {
                    let item = data_migration_list[i];

                    if(item.value == 9999 && p_data == null || p_data == "")
                    {
                        p_data = item.value;
                        break;
                    }
                    else if(item.display && item.display == p_data)
                    {
                        p_data = item.value;
                        break;
                    }
                }   

            }
            else if(p_metadata.data_type == "string")
            {
                for(let i = 0; i < data_migration_list.length; i++)
                {
                    let item = data_migration_list[i];
                    let name_value = p_data.split("-");

                    if(name_value.lenght > 1)
                    {
                        
                        let value = name_value[0].trim();
                        let display = name_value[1].trim();                    
            
                        if(item.value == 9999 && p_data == null || p_data == "")
                        {
                            p_data = item.value;
                            break;
                        }
                        else if(display && display == item.display)
                        {
                            p_data = item.value;
                            break;
                        }
                    }
                    else if(item.value == 9999 && p_data == null || p_data == "")
                    {
                        p_data = item.value;
                        break;
                    }

                }   

            }
            else
            {
                for(let i = 0; i < data_migration_list.length; i++)
                {
                    let item = data_migration_list[i];
        
                    if(item.value == 9999 && p_data == null || p_data == "")
                    {
                        p_data = item.value;
                        break;
                    }
                    else if(item.display && item.display == p_data)
                    {
                        p_data = item.value;
                        break;
                    }
                }   
            }
        }
    }
    // data migration - end

    if(p_metadata.control_style && p_metadata.control_style.toLowerCase().indexOf("editable") > -1)
    {
        Array.prototype.push.apply(p_result, list_editable_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx));
        return;
    }
    else if
    (
        (p_metadata.is_multiselect && p_metadata.is_multiselect == true) ||
        (p_metadata.control_style && p_metadata.control_style.toLowerCase().indexOf("checkbox") > -1)
    )
    {
        Array.prototype.push.apply(p_result, list_checkbox_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx));
        return;
    }
    else if(p_metadata.control_style && p_metadata.control_style.toLowerCase().indexOf("radio") > -1) 
    {
        Array.prototype.push.apply(p_result, list_radio_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx));
        return;
    }

    p_result.push(`<div class="list" id="${convert_object_path_to_jquery_id(p_object_path)}" mpath="${p_metadata_path}">`);
    
    var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    p_result.push(`
        <label for="${convert_object_path_to_jquery_id(p_object_path)}_control"
               ${style_object && style_object.prompt ? `style="${get_style_string(style_object.prompt.style)}"` : ``}
               ${p_metadata.description && p_metadata.description.length > 0 ? `rel="tooltip" data-original-title="${p_metadata.description.replace(/'/g, "&#39;")}"` : ``}>
            ${p_metadata.prompt}
        </label>
    `);

    if(p_metadata.list_display_size && p_metadata.list_display_size!="")
    {
        p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control" size=`);
        p_result.push(p_metadata.list_display_size);
        p_result.push(" name='");
    }
    else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
    {
        
        if(p_metadata.values.length > 6)
        {
            p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control" size="6" name='`);
        }
        else
        {
            p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control" size=`);
            p_result.push(p_metadata.values.length);
            p_result.push(" name='");
        }
    }
    else
    {
        p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control" size=`);
        p_result.push(1);
        p_result.push(" name='");
      }
      
        p_result.push(p_metadata.name);
    p_result.push("'");

    if(style_object && style_object.control)
    {
        p_result.push(" style='");
          p_result.push(get_style_string(style_object.control.style));
        p_result.push("' ");
    }
    
    let disabled_html = "disabled='true' ";
    
	if(g_data_is_checked_out)
	{
		disabled_html = " ";
	}
    p_result.push(disabled_html);
    
    p_result.push(" dpath='")
    p_result.push(p_dictionary_path.substring(1, p_dictionary_path.length));
    p_result.push("' ");

    if
    (
        (
            p_metadata.is_read_only != null &&
            p_metadata.is_read_only == true
        ) ||
        p_metadata.mirror_reference
    )
    {
        p_result.push(" disabled=true ");
    }
    else
    {

        if (g_data_is_checked_out)
        {
            if (path_to_int_map[p_metadata_path])
            {

				f_name = "x" + path_to_int_map[p_metadata_path].toString(16) + "_och";
				if(path_to_onchange_map[p_metadata_path])
				{
					page_render_create_event(p_result, "onchange", p_metadata.onchange, p_metadata_path, p_object_path, p_dictionary_path, p_ctx)
				}
				

                page_render_create_onblur_event(p_result, p_metadata, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
            }
        }
    }

    if(p_metadata['is_multiselect'] && p_metadata.is_multiselect == true)
    {
        p_result.push(" multiple>");
        var metadata_value_list = p_metadata.values;

        if(p_metadata.path_reference && p_metadata.path_reference != "")
        {
            metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

            if(metadata_value_list == null)	
            {
                metadata_value_list = p_metadata.values;
            }
        }

        for(var i = 0; i < metadata_value_list.length; i++)
        {
            var item = metadata_value_list[i];

            if(p_data && p_data.indexOf(item.value) > -1)
            {
                    p_result.push("<option value='");
                    p_result.push(item.value.replace(/'/g, "&#39;"));
                    p_result.push("' selected ");
                    let disabled_option_html = "disabled";
                    if(g_data_is_checked_out || g_is_data_analyst_mode || (item.is_not_selectable!= null && item.is_not_selectable == true))
                    {
                        disabled_option_html = "";
                    }
                    p_result.push(disabled_option_html);
                    p_result.push(">");
                    if(item.display)
                    {
                        p_result.push(item.display);
                    }
                    else if(item.value == 9999)
                    {
                        p_result.push("(blank)");
                    }
                    else
                    {
                        p_result.push(item.value);
                    }
                    p_result.push("</option>");
            }
            else
            {
                    p_result.push("<option value='");
                    p_result.push(item.value.replace(/'/g, "&#39;"));
                    p_result.push("' ");
                    let disabled_option_html = "disabled";
                    if(g_data_is_checked_out || g_is_data_analyst_mode)
                    {
                        disabled_option_html = "";
                    }
                    p_result.push(disabled_option_html);
                    p_result.push(">");
                    if(item.displa)
                    {
                        p_result.push(item.display);
                    }
                    else if(item.value == 9999)
                    {
                        p_result.push("(blank)");
                    }
                    else
                    {
                        p_result.push(item.value);
                    }
                    p_result.push("</option>");
            }
        }
        p_result.push("</select>");
        
        p_result.push("</div>");
    }
    else
    {
        p_result.push(">");


        var metadata_value_list = p_metadata.values;

        if(p_metadata.path_reference && p_metadata.path_reference != "")
        {
            metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

            if(metadata_value_list == null)	
            {
                metadata_value_list = p_metadata.values;
            }
        }

        for(var i = 0; i < metadata_value_list.length; i++)
        {
            var item = metadata_value_list[i];

            if(p_data == item.value)
            {
                p_result.push("<option value='");
                p_result.push(item.value.replace(/'/g, "&#39;"));
                p_result.push("' selected ");
           
                if
                (
                    p_metadata.name=="overall_case_status" && 
                    item.value == 9999
                )
                {
                    p_result.push(" disabled ");
                }
                else if(item.is_not_selectable!= null && item.is_not_selectable == true)
                {
                    p_result.push(" disabled ");
                }

                p_result.push(">");
                if(item.display)
                {
                    p_result.push(item.display);
                }
                else if(item.value == 9999)
                {
                    p_result.push("(blank)");
                }
                else
                {
                    p_result.push(item.value);
                }
                p_result.push("</option>");
            }
            else
            {
                p_result.push("<option value='");
                p_result.push(item.value.replace(/'/g, "&#39;"));
                p_result.push("' ");

                if
                (
                    p_metadata.name=="overall_case_status" && 
                    item.value == 9999
                )
                {
                    p_result.push(" disabled ");
                }
                else if(item.is_not_selectable!= null && item.is_not_selectable == true)
                {
                    p_result.push(" disabled ");
                }
                
                p_result.push(">");
                if(item.display)
                {
                    p_result.push(item.display);
                }
                else if(item.value == 9999)
                {
                    p_result.push("(blank)");
                }
                else
                {
                    p_result.push(item.value);
                }
                p_result.push("</option>");
            }
        }
        p_result.push("</select>");
        
        p_result.push("</div>");
    }

}


function list_editable_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
    var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];

    p_result.push("<div class='list' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(">");
    p_result.push("<label for='");
    p_result.push(p_object_path.replace(/\//g, "--"));
    p_result.push("' style='");
      if(style_object && style_object.prompt)
      {
          p_result.push(get_style_string(style_object.prompt.style));
      }
    p_result.push("' ");

    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push(" rel='tooltip' data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "\\'"));
        p_result.push("'>");
    }
    else
    {
        p_result.push(">");
    }
    

    p_result.push(p_metadata.prompt);
    p_result.push("</label>");


    p_result.push("<div style='");
      if(style_object && style_object.prompt)
      {
        // p_result.push(get_only_size_and_position_string(style_object.control.style));
        p_result.push(get_style_string(style_object.control.style));
      }
    p_result.push("'>");

    if(p_metadata.list_display_size && p_metadata.list_display_size!= "")
    {
        p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class='form-control list-control-select 1' size=`);
        p_result.push(p_metadata.list_display_size);
        p_result.push(" name='");
    }
    else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
    {
        if(p_metadata.values.length > 6)
        {
            p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control list-control-select 2" size="6" name='`);
        }
        else
        {
            p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" size=`);
            p_result.push(p_metadata.values.length);
            p_result.push(" name='");
        }
    }
    else
    {
        p_result.push(`<select id="${convert_object_path_to_jquery_id(p_object_path)}_control" class="form-control list-control-select 3" size=`);
        p_result.push(1);
        p_result.push(" name='");
    }

    p_result.push(p_metadata.name);
    p_result.push("'");

    p_result.push(" dpath='")
    p_result.push(p_dictionary_path.substring(1, p_dictionary_path.length));
    p_result.push("' ");

    if
    (
        (
            p_metadata.is_read_only != null &&
            p_metadata.is_read_only == true
        ) ||
        p_metadata.mirror_reference
    )
    {
        p_result.push(" disabled=true ");
    }
    else
    {
        if(g_data_is_checked_out)
        {
            p_result.push("  onblur='g_set_data_object_from_path(\"");
            p_result.push(p_object_path);
            p_result.push("\",\"");
            p_result.push(p_metadata_path);
            p_result.push("\",\"");
            p_result.push(p_dictionary_path);
            p_result.push("\",this.value)'  ");
        }
        else
        {
            p_result.push(" disabled=true ");
        }
    }

    let d_path = p_dictionary_path.substring(1, p_dictionary_path.length) + "_other";

    if(g_data_is_checked_out)
    {
        p_result.push("  onchange='editable_list_onchange(this, \"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(d_path);
        p_result.push("\")' ");
    }

    if(p_metadata['is_multiselect'] && p_metadata.is_multiselect == true)
    {
        p_result.push(" multiple>");
        
        var metadata_value_list = p_metadata.values;

        if(p_metadata.path_reference && p_metadata.path_reference != "")
        {
            metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

            if(metadata_value_list == null)	
            {
                metadata_value_list = p_metadata.values;
            }
        }

        for(var i = 0; i < metadata_value_list.length; i++)
        {
            var item = metadata_value_list.values[i];

            if(p_data.indexOf(item.value) > -1)
            {
                p_result.push("<option value='");
                p_result.push(item.display.replace(/'/g, "&#39;"));
                p_result.push("' selected ");
                // let disabled_option_html = "disabled";
                // if(g_data_is_checked_out || g_is_data_analyst_mode)
                // {
                //     disabled_option_html = "";
                // }
                // p_result.push(disabled_option_html);
                p_result.push(">");
                    if(item.display)
                    {
                        p_result.push(item.display);
                    }
                    else if(item.value == 9999)
                    {
                        p_result.push("(blank)");
                    }
                    else
                    {
                        p_result.push(item.value);
                    }
                p_result.push("</option>");
            }
            else
            {
                p_result.push("<option value='");
                p_result.push(item.display.replace(/'/g, "&#39;"));
                p_result.push("' ");
                // let disabled_option_html = "disabled";
                // if(g_data_is_checked_out || g_is_data_analyst_mode)
                // {
                //     disabled_option_html = "";
                // }
                // p_result.push(disabled_option_html);
                p_result.push(">");
                    if(item.display)
                    {
                        p_result.push(item.display);
                    }
                    else if(item.value == 9999)
                    {
                        p_result.push("(blank)");
                    }
                    else
                    {
                        p_result.push(item.value);
                    }
                p_result.push("</option>");
            }
        }
        p_result.push("</select>");

        /*
        p_result.push("<label for='"+p_metadata.name+"' class='sr-only'>"+p_metadata.name+"</label>");
        
        p_result.push("<input id='"+p_metadata.name+"' class='list-control-input mt-1' placeholder='Specify Other' class='list' type='text3' name='");
        // p_result.push("<br/><label><input style='width:98%;height:49%;' placeholder='Specify Other' class='list' type='text3' name='");
        p_result.push(p_metadata.name);
        p_result.push("' value='");
        p_result.push(p_data);
        p_result.push("' ");

        if
        (
            (
                p_metadata.is_read_only != null &&
                p_metadata.is_read_only == true
            ) ||
            p_metadata.mirror_reference
        )
        {
            p_result.push(" readonly=true ");
        }
        else
        {
            p_result.push(" onblur='g_set_data_object_from_path(\"");
            p_result.push(p_object_path);
            p_result.push("\",\"");
            p_result.push(p_metadata_path);
            p_result.push("\",\"");
            p_result.push(p_dictionary_path);
            p_result.push("\",this.value)' />");
        }
        */

        p_result.push("</label> </div> ");
    }
    else
    {
        p_result.push(">");

        var metadata_value_list = p_metadata.values;

        if(p_metadata.path_reference && p_metadata.path_reference != "")
        {
            metadata_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

            if(metadata_value_list == null)	
            {
                metadata_value_list = p_metadata.values;
            }
        }

        for(var i = 0; i < metadata_value_list.length; i++)
        {
            var item = metadata_value_list[i];

            if(p_data == item.value)
            {
                p_result.push("<option value='");
                p_result.push(item.value.replace(/'/g, "&#39;"));
                p_result.push("' selected ");
                // let disabled_option_html = "disabled";
                // if(g_data_is_checked_out || g_is_data_analyst_mode)
                // {
                //     disabled_option_html = "";
                // }
                // p_result.push(disabled_option_html);
                p_result.push(">");
                if(item.display)
                {
                    p_result.push(item.display);
                }
                else  if(item.value == 9999)
                {
                    p_result.push("(blank)");
                }
                else
                {
                    p_result.push(item.value);
                }
                p_result.push("</option>");
            }
            else
            {
                p_result.push("<option value='");
                p_result.push(item.value.replace(/'/g, "&#39;"));
                p_result.push("' ");
                // let disabled_option_html = "disabled";
                // if(g_data_is_checked_out || g_is_data_analyst_mode)
                // {
                //     disabled_option_html = "";
                // }
                // p_result.push(disabled_option_html);
                p_result.push(">");
                if(item.display)
                {
                    p_result.push(item.display);
                }
                else if(item.value == 9999)
                {
                    p_result.push("(blank)");
                }
                else
                {
                    p_result.push(item.value);
                }
                p_result.push("</option>");
            }
        }
        p_result.push("</select> ");
        
        let d_path = p_dictionary_path.substring(1, p_dictionary_path.length) + "_other";
        
        p_post_html_render.push(" editable_list_set_visibility('" + p_data + "','" + p_object_path + "_other');");

    //if(p_metadata.list_display_size && p_metadata.list_display_size!="")
    //{
        // p_result.push("<label>");
        /*
        p_result.push("<label for='"+p_metadata.name+"' class='sr-only'>"+p_metadata.name+"</label>");
        p_result.push("<input placeholder='Specify Other' id='"+p_metadata.name+"' class='list-control-input mt-1' type='text3' name='");
        p_result.push(p_metadata.name);
        p_result.push("' value='");
        p_result.push(p_data);
        p_result.push("' ");

        if
        (
            (
                p_metadata.is_read_only != null &&
                p_metadata.is_read_only == true
            ) ||
            p_metadata.mirror_reference
        )
        {
            p_result.push(" readonly=true ");
        }
        else
        {
            p_result.push(" onblur='g_set_data_object_from_path(\"");
            p_result.push(p_object_path);
            p_result.push("\",\"");
            p_result.push(p_metadata_path);
            p_result.push("\",\"");
            p_result.push(p_dictionary_path);
            p_result.push("\",this.value)' /> ");
            // p_result.push("</label>");
        }*/
        p_result.push("</div>");
        
    //}
    }

    p_result.push(`${render_editable_list_confirm_modal(p_metadata, p_object_path)}`);
    p_result.push("</div>");
}

function editable_list_set_visibility(p_data, p_object_path)
{
    let query_path = convert_object_path_to_jquery_id(p_object_path);

    if
    (
        p_data == null || 
        p_data == ""  
    )
    {
        document.querySelector('div [id="' + query_path + '"]').style.visibility = "hidden";
    }
    else if(p_data.indexOf("Other") == 0)
    {
        document.querySelector('div [id="' + query_path + '"]').style.visibility = "";
    }  
    else
    {
        document.querySelector('div [id="' + query_path + '"]').style.visibility = "hidden";
    }  
}

function editable_list_onchange(p_select_list, p_object_path)
{
    let query_path = convert_object_path_to_jquery_id(p_object_path);
    let current_value = eval(p_object_path);
    let editable_list_other = $(`#${query_path}_other`);
    let control = editable_list_other.find('input')[0];
    let control_value = control.value; 

    if
    (
        current_value.indexOf("Other") == 0 &&
        p_select_list.value.indexOf("Other") != 0  &&
        (control_value!= null && control_value != "")
    )
    {
        editable_list_events(p_select_list, p_object_path, editable_list_other_callback);
    }
    else if(p_select_list.value.indexOf("Other") != 0)
    {
        document.querySelector('div [id="' + query_path + '_other"]').style.visibility = "hidden";
    }
    else
    {
        document.querySelector('div [id="' + query_path + '_other"]').style.visibility = "";
    }  
}

function editable_list_events(p_select_list, p_object_path)
{
    let selector = p_object_path.split('.').join('_').replace('[', '_').replace(']', '_') + '_modal';

    // Show the modal by default on function init
    // ex selector: g_data_autopsy_report_toxicology_0__substance_modal
    $('#' + selector).modal('show');
    $('#' + selector).show();
    
    // If clicked on confirm button
    $('#' + selector + ' .modal-confirm').on('click', function () {
        // console.log('confirmed');
        editable_list_other_callback(p_select_list, true, p_object_path);
    });

    // If clicked on cancel button
    $('#' + selector + ' .modal-cancel').on('click', function () {
        // console.log('canceled');
        editable_list_other_callback(p_select_list, false, p_object_path);
    });

    // If clicked on X button
    $('#' + selector + ' button.close').on('click', function () {
        // console.log('X canceled');
        editable_list_other_callback(p_select_list, false, p_object_path);
    });

    // If clicked anywhere on document
    /*
    $(document).on('click', function(event) {
        const container = $('#' + selector + ' .modal-content'); // find the modal content container

        // if clicked on anywhere outside container &&
        // container doesn't have a click event binded &&
        // modal is ACTIVE
        if
        (
            !container.is(event.target) &&
            container.has(event.target).length === 0 &&
            $('body').hasClass('modal-open')
        ){
            // console.log('clicked outside'); // X clicked

            editable_list_other_callback(false, p_object_path);
        }
    });
    */
}

// Callback that returns true or false
function editable_list_other_callback(p_select_list, confirm, p_object_path)
{
    let query_path = convert_object_path_to_jquery_id(p_object_path);
    let editable_list_other = $(`#${query_path}_other`);

    editable_list_other_hide_all_confirm(); // Hide all modals because regardless, we want to hide it

    if (confirm)
    {
        // console.log('true');
        let control = editable_list_other.find('input')[0];

        eval(p_object_path + '_other = ""');
        window.setTimeout(1000, ()=> { control.value = ""; control.onblur(); editable_list_other[0].style.visibility = 'hidden';});
        return true; // Returns true and does something unique
    }
    else
    {
        // console.log('false');
        editable_list_other.attr('style', 'visibility: visible'); // If user cancels, make it visible
        //editable_list_other.find('input').focus(); // Then focus on the input
        p_select_list.selectedIndex = p_select_list.options.length -1;
        //p_select_list.value = p_select_list.options[p_select_list.options.length -1];
        p_select_list.onblur();
        
        return false; // Returns false and does nothing
    }
}

// Function to simply hide and deactivate the modal
function editable_list_other_hide_all_confirm()
{
    $('.modal').modal('hide') // Closes all active modals showing
    $('.modal').hide() // Closes all active modals showing
    $('.modal-backdrop').remove() // Removes the modal backdrop/overlay
    $('body').removeClass('modal-open');
    $('body').removeAttr('style');
}

// Function to create and render the modal
// Gets populated with the correct information
// TODO: Make it singular and a global component we call/init. Not pretty and base case scenario but for now it works
function render_editable_list_confirm_modal(p_metadata, p_object_path) 
{
    const path = p_object_path.split('.').join('_').replace('[', '_').replace(']', '_');
    const modal_ui = [];

    // Get the current selected option
    const selected_option = $('#' + path).find('select').val();

    // Get the other text control's inner text value
    const label = $('#' + path + '_other label').text();
    
    modal_ui.push(`
        <div id="${path}_modal" class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title">Confirm ${p_metadata.prompt} Selection</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to change the <strong>${p_metadata.prompt}</strong> selection from <strong>Other</strong> to <strong>${selected_option}</strong>? The text in the <strong>${label}</strong> textbox will be cleared.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-cancel btn btn btn-outline-secondary flex-order-2 mr-0" data-dismiss="modal">Cancel</button>
                        <button type="button" class="modal-confirm btn btn-primary flex-order-1 ml-0 mr-2">Yes, change my selection</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    return modal_ui;
}


function list_radio_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
    var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];

    p_result.push("<div class='list' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(">");

    p_result.push("<fieldset id='");
    p_result.push(p_metadata.name);
    p_result.push("_id' class='radio-list' ");

    //var key = p_dictionary_path.substring(1);

    var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    
    if(style_object)
    {
        p_result.push(" style='");
          p_result.push(get_only_size_and_position_string(style_object.control.style));
        p_result.push("' ");
    }

    p_result.push(" >"); // close opening div
    p_result.push("<legend ");

    if(style_object && style_object.prompt)
    {
        p_result.push(" style='");
          p_result.push(get_only_font_style_string(style_object.prompt.style));
        p_result.push("'");
    }

    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push(" rel='tooltip' data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "&#39;"));
        p_result.push("' ");
    }

    p_result.push(">");
    p_result.push(p_metadata.prompt);
    p_result.push("</legend>");

    // Wrapper element that contains all radios
    p_result.push("<div class='pick-list'>");

        let data_value_list = p_metadata.values;

        if(p_metadata.path_reference && p_metadata.path_reference != "")
        {
            data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

            if(data_value_list == null)	
            {
                data_value_list = p_metadata.values;
            }
        }

        for(let i = 0; i < data_value_list.length; i++)
        {
            var item = data_value_list[i];
            let item_key = null;

            if(item.value == null | item.value == "")
            {
                item_key = p_dictionary_path.substring(1) + "/";
            }
            else
            {
                item_key = p_dictionary_path.substring(1) + "/" + item.value.replace(/ /g, "--").replace(/--/g, '/').replace(/'/g, "-");//.replace(/\//g, "--")
            }

            var item_style = g_default_ui_specification.form_design[item_key];
            var is_selected = "";

            if (item.value == p_data)
            {
                is_selected = " checked ";
            }

            var is_read_only = "";
            let onclick_text = "";

            if
            (
                (
                    p_metadata.is_read_only != null &&
                    p_metadata.is_read_only == true
                ) ||
                p_metadata.mirror_reference
            )
            {
                is_read_only= " disabled=true ";
            }
            else
            {
                onclick_text = `onclick='g_set_data_object_from_path("${p_object_path}","${p_metadata_path}","${p_dictionary_path}",this.value)'`;
            }

            let disabled_html = " disabled = 'disabled' ";
            if(g_data_is_checked_out)
            {
                disabled_html = " ";
            }
            
            let object_id = convert_object_path_to_jquery_id(p_object_path) + '_' +  item.value.replace(/\//g, "--").replace(/ /g, "--").replace(/'/g, "-");
            let input_html = 
                `<input 
                    id='${object_id}'
                    name='${convert_object_path_to_jquery_id(p_object_path)}' 
                    type='radio' 
                    value='${item.value}'
                    ${onclick_text}
                    ${is_selected}
                    ${is_read_only}
                    ${disabled_html}
                />`;

            if (item.display) 
            {
                p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class="choice-control" style="${get_style_string(item_style.prompt.style)}">${input_html}<span class="choice-control-info"> ${item.display}</span></label>`);
            }
            else if(item.value == 9999)
            {
                p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class="choice-control" style="${get_style_string(item_style.prompt.style)}">${input_html}<span class="choice-control-info"> (blank)</span></label>`);
            }
            else 
            {
                p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class="choice-control" style="${get_style_string(item_style.prompt.style)}">${input_html}<span class="choice-control-info"> ${item.value}</span></label>`);
            }
        }

    p_result.push("</div>");

    p_result.push("</fieldset>");

    p_result.push("</div>");
}

function list_checkbox_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{
    let style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];

    p_result.push("<div class='list' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(">");

    p_result.push("<fieldset id='");
    p_result.push(p_metadata.name);
    p_result.push("_id' class='checkbox' ");

    if(style_object)
    {
        p_result.push(" style='");
          p_result.push(get_only_size_and_position_string(style_object.control.style));
        p_result.push("' ");
    }

    p_result.push(">"); // close opening div
    p_result.push("<legend ");

    //var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    if(style_object && style_object.prompt)
    {
        p_result.push(" style='");
          p_result.push(get_only_font_style_string(style_object.prompt.style));
        p_result.push("'");
    }

    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push(" rel='tooltip' data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "&#39;"));
        p_result.push("' ");
    }

    p_result.push(">");
    p_result.push(p_metadata.prompt);
    p_result.push("</legend>");

    let data_value_list = p_metadata.values;

    if(p_metadata.path_reference && p_metadata.path_reference != "")
    {
        data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));

        if(data_value_list == null)	
        {
            data_value_list = p_metadata.values;
        }
    }

    for(let i = 0; i < data_value_list.length; i++)
    {
        var item = data_value_list[i];
        let item_key = null;

        if(item.value == null | item.value == "")
        {
            item_key = p_dictionary_path.substring(1) + "/";
        }
        else
        {
            item_key = p_dictionary_path.substring(1) + "/" + item.value.replace(/ /g, "--").replace(/--/g, '/').replace(/'/g, "-");
        }
        
        let item_style = g_default_ui_specification.form_design[item_key];
        let is_selected = "";

        if (p_data.indexOf(item.value) > -1)
        {
            is_selected = " checked ";
        }

        var is_read_only = "";

        if
        (
            (
                p_metadata.is_read_only != null &&
                p_metadata.is_read_only == true
            ) ||
            p_metadata.mirror_reference
        )
        {
            is_read_only= " disabled=true ";
        }

        //let object_id = ;
        let object_id = convert_object_path_to_jquery_id(p_object_path) + item.value.replace(/\//g, "--").replace(/ /g, "--").replace(/'/g, "-");

        if (item.display) 
        {
            p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class='choice-control' style="${get_style_string(item_style.prompt.style)}">`);
            list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected, is_read_only);
            if(item.value=="9999")
            {
                p_result.push("</label>");
            }
            else
            {
                p_result.push("<span class='choice-control-info'> " + item.display + "</span></label>");
            }
        }
        else if(item.value == 9999)
        {
            p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class='choice-control' style="${get_style_string(item_style.prompt.style)}">`);
            list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected, is_read_only);
            p_result.push("<span class='choice-control-info'> (blank)</span></label>");
        }
        else 
        {
            p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_${item.value}" class='choice-control' style="${get_style_string(item_style.prompt.style)}">`);
            list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected, is_read_only);
            p_result.push("<span class='choice-control-info'> " + item.value + "</span></label>");
        }
    }
    p_result.push("</fieldset>");

    p_result.push("</div>");
}

function list_checkbox_input_render(p_result, p_id,  p_item, p_object_path, p_metadata_path, p_dictionary_path, p_is_selected, p_is_read_only)
{
    p_result.push("<input id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path) + '_' + p_item.value);
    p_result.push("' type='checkbox' ");
    p_result.push(" value='");
    p_result.push(p_item.value);
    p_result.push("' ");

    let disabled_html = " disabled = 'disabled' ";
    if(g_data_is_checked_out)
    {
        
        if(p_item.is_not_selectable!= null && p_item.is_not_selectable == true)
        {
            p_result.push(" disabled ");
        }
        else disabled_html = " ";

    }
    p_result.push(disabled_html);

    if(p_item.value=="9999")
    {
        p_result.push(" disabled style='display:none;' ");
    }

    if(p_is_read_only == null || p_is_read_only == "")
    {
        p_result.push(" onclick=g_set_data_object_from_path(\'");
        p_result.push(p_object_path);
        p_result.push("\',\'");
        p_result.push(p_metadata_path);
        p_result.push("\',\'");
        p_result.push(p_dictionary_path);
        p_result.push("\',this.value) ");
    }

    p_result.push(p_is_selected);
    p_result.push(p_is_read_only);
    p_result.push("></input>");
}

function set_list_lookup(p_list_lookup, p_name_to_value_lookup, p_value_to_index_number_lookup, p_metadata, p_path)
{
    switch(p_metadata.type.toLowerCase())
    {
        case "app":
        case "form":
        case "group":
        case "grid":
            for(let i = 0; i < p_metadata.children.length; i++)
            {
                let child = p_metadata.children[i];
                set_list_lookup(p_list_lookup, p_name_to_value_lookup, p_value_to_index_number_lookup, child, p_path + "/" + child.name);
            }

            break;

        default:
            if(p_metadata.type.toLowerCase() == "list")
            {
                let data_value_list = p_metadata.values;

                if(p_metadata.path_reference && p_metadata.path_reference != "")
                {
                    data_value_list = eval(convert_dictionary_path_to_lookup_object(p_metadata.path_reference));
            
                    if(data_value_list == null)	
                    {
                        data_value_list = p_metadata.values;
                    }
                }
    
                p_list_lookup[p_path] = {};
                p_name_to_value_lookup[p_path] = {};
                p_value_to_index_number_lookup[p_path] = {};

                for(let i = 0; i < data_value_list.length; i++)
                {
                    let item = data_value_list[i];
                    p_list_lookup[p_path][item.display.toLowerCase()] = item.value;
                    p_name_to_value_lookup[p_path][item.value] = item.display.toLowerCase();
                    p_name_to_value_lookup[p_path][item.value] = i;
                }
            }
            break;
    }
}
