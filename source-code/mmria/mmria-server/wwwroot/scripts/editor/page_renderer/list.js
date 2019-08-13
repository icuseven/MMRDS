
function list_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx)
{

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
        p_result.push("rel='tooltip'  data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "&#39;"));
        p_result.push("'>");
    }
    else
    {
        p_result.push(">");
    }
    
    p_result.push(p_metadata.prompt);
    p_result.push("</label> ");

    if(p_metadata.list_display_size && p_metadata.list_display_size!="")
    {
        p_result.push("<select size=");
        p_result.push(p_metadata.list_display_size);
        p_result.push(" name='");
    }
    else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
    {
        
        if(p_metadata.values.length > 6)
        {
            p_result.push("<select size='6' name='");
        }
        else
        {
            p_result.push("<select size=");
            p_result.push(p_metadata.values.length);
            p_result.push(" name='");
        }
        
    }
    else
    {
        p_result.push("<select size=");
        p_result.push(1);
        p_result.push(" name='");
    }

    p_result.push(p_metadata.name);

    if(style_object && style_object.control)
    {
        p_result.push("'  style='");
        p_result.push(get_style_string(style_object.control.style));
    }

    p_result.push("'  onblur='g_set_data_object_from_path(\"");
    p_result.push(p_object_path);
    p_result.push("\",\"");
    p_result.push(p_metadata_path);
    p_result.push("\",\"");
    p_result.push(p_dictionary_path);
    p_result.push("\",this.value)'  ");

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
                    p_result.push("' selected>");
                    if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                    {
                        p_result.push(item.description);
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
                    p_result.push("' >");
                    if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                    {
                        p_result.push(item.description);
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
                p_result.push("' selected>");
                if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                {
                    p_result.push(item.description);
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
                p_result.push("' >");
                if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                {
                    p_result.push(item.description);
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
        p_result.push("rel='tooltip'  data-original-title='");
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
        p_result.push(get_only_size_and_position_string(style_object.control.style));
    }

    p_result.push("'>");

    if(p_metadata.list_display_size && p_metadata.list_display_size!= "")
    {
        p_result.push("<select class='list-control-select 1' size=");
        p_result.push(p_metadata.list_display_size);
        p_result.push(" name='");
    }
    else if(p_metadata.is_multiselect && p_metadata.is_multiselect == true)
    {
        
        if(p_metadata.values.length > 6)
        {
            p_result.push("<select class='list-control-select 2' size='6' name='");
        }
        else
        {
            p_result.push(" <select size=");
            p_result.push(p_metadata.values.length);
            p_result.push(" name='");
        }
        
    }
    else
    {
        p_result.push("<select class='list-control-select 3' size=");
        p_result.push(1);
        p_result.push(" name='");
    }
    
    p_result.push(p_metadata.name);
    
    p_result.push("'");
    // p_result.push("' style='width:98%;height:49%;'");



    p_result.push("  onblur='g_set_data_object_from_path(\"");
    p_result.push(p_object_path);
    p_result.push("\",\"");
    p_result.push(p_metadata_path);
    p_result.push("\",\"");
    p_result.push(p_dictionary_path);
    p_result.push("\",this.value)'  ");

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
                    p_result.push(item.value.replace(/'/g, "&#39;"));
                    p_result.push("' selected>");
                    if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                    {
                        p_result.push(item.description);
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
                    p_result.push("' >");
                    if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                    {
                        p_result.push(item.description);
                    }
                    else
                    {
                        p_result.push(item.value);
                    }
                    p_result.push("</option>");
            }
        }
        p_result.push("</select>");

        p_result.push("<label for='"+p_metadata.name+"' class='sr-only'>"+p_metadata.name+"</label>");
        p_result.push("<input id='"+p_metadata.name+"' class='list-control-input mt-1' placeholder='Specify Other' class='list' type='text3' name='");
        // p_result.push("<br/><label><input style='width:98%;height:49%;' placeholder='Specify Other' class='list' type='text3' name='");
        p_result.push(p_metadata.name);
        p_result.push("' value='");
        p_result.push(p_data);
        p_result.push("' onblur='g_set_data_object_from_path(\"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(p_metadata_path);
        p_result.push("\",\"");
        p_result.push(p_dictionary_path);
        p_result.push("\",this.value)' />");

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
                p_result.push("' selected>");
                if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                {
                    p_result.push(item.description);
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
                p_result.push("' >");
                if(p_metadata.is_save_value_display_description && p_metadata.is_save_value_display_description == true)
                {
                    p_result.push(item.description);
                }
                else
                {
                    p_result.push(item.value);
                }
                p_result.push("</option>");
            }
        }
        p_result.push("</select> ");
        

    //if(p_metadata.list_display_size && p_metadata.list_display_size!="")
    //{
        // p_result.push("<label>");
        p_result.push("<label for='"+p_metadata.name+"' class='sr-only'>"+p_metadata.name+"</label>");
        p_result.push("<input placeholder='Specify Other' id='"+p_metadata.name+"' class='list-control-input mt-1' type='text3' name='");
        p_result.push(p_metadata.name);
        p_result.push("' value='");
        p_result.push(p_data);
        p_result.push("' onblur='g_set_data_object_from_path(\"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(p_metadata_path);
        p_result.push("\",\"");
        p_result.push(p_dictionary_path);
        p_result.push("\",this.value)' /> ");
        // p_result.push("</label>");
        p_result.push("</div>");
        
    //}


    }

    p_result.push("</div>");
    

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
        p_result.push(" rel='tooltip'  data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "&#39;"));
        p_result.push("' ");
    }

    p_result.push(">");
    p_result.push(p_metadata.prompt);
    p_result.push("</legend>");

    for(var i in p_metadata.values)
    {
        var item = p_metadata.values[i];

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


        let object_id = convert_object_path_to_jquery_id(p_object_path) + item.value.replace(/\//g, "--").replace(/ /g, "--").replace(/'/g, "-");
        let input_html = 
            `<input 
                id='${object_id}' name='${convert_object_path_to_jquery_id(p_object_path)}' 
                type='radio' 
                value='${item.value}'
                onclick='g_set_data_object_from_path("${p_object_path}","${p_metadata_path}","${p_dictionary_path}",this.value)'
                ${is_selected}
                
             />`;

        if (item.description == null || item.description === '') 
        {
            if(item.value == null || item.value == '')
            {
                p_result.push(`<label class="choice-control" style='${get_style_string(item_style.prompt.style)}' for="${object_id}">${input_html}<span class="choice-control-info"> (blank)</span></label>`);
            }
            else 
            {
                p_result.push(`<label class="choice-control" style='${get_style_string(item_style.prompt.style)}' for="${object_id}">${input_html}<span class="choice-control-info"> ${item.value}</span></label>`);
            }
            
        }
        else 
        {
            p_result.push(`<label class="choice-control" style='${get_style_string(item_style.prompt.style)}' for="${object_id}" >${input_html}<span class="choice-control-info"> ${item.description}</span></label>`);
        }
    }

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
        p_result.push(" rel='tooltip'  data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "&#39;"));
        p_result.push("' ");
    }

    p_result.push(">");
    p_result.push(p_metadata.prompt);
    p_result.push("</legend>");

    
    for(var i in p_metadata.values)
    {
        let item = p_metadata.values[i];

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

        //let object_id = ;
        let object_id = convert_object_path_to_jquery_id(p_object_path) + item.value.replace(/\//g, "--").replace(/ /g, "--").replace(/'/g, "-");

        if (item.description == null || item.description === '') 
        {
            if(item.value == null || item.value == '')
            {
                p_result.push("<label class='choice-control' style='" + get_style_string(item_style.prompt.style) + "' for='" + object_id + "'>");
                list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected);
                p_result.push("<span class='choice-control-info'> (blank)</span></label>");
            }
            else 
            {
                p_result.push("<label class='choice-control' style='" + get_style_string(item_style.prompt.style) + "' for='" + object_id + "'>");
                list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected);
                p_result.push("<span class='choice-control-info'> " + item.value + "</span></label>");
            }
            
        }
        else 
        {
            p_result.push("<label class='choice-control' style='" + get_style_string(item_style.prompt.style) + "' for='" + object_id + "'>");
            list_checkbox_input_render(p_result, object_id,  item, p_object_path, p_metadata_path, p_dictionary_path, is_selected);
            p_result.push("<span class='choice-control-info'> " + item.description + "</span></label>");
        }
    }
    p_result.push("</fieldset>");

    p_result.push("</div>");
    
}

function list_checkbox_input_render(p_result, p_id,  p_item, p_object_path, p_metadata_path, p_dictionary_path, p_is_selected)
{
    p_result.push("<input id='");
    p_result.push(p_id);
    p_result.push("' type='checkbox' ");
    p_result.push(" value='");
    p_result.push(p_item.value);
    p_result.push("' onclick=g_set_data_object_from_path(\'");
    p_result.push(p_object_path);
    p_result.push("\',\'");
    p_result.push(p_metadata_path);
    p_result.push("\',\'");
    p_result.push(p_dictionary_path);
    p_result.push("\',this.value) ");
    p_result.push(p_is_selected);
    p_result.push("></input>");
}
