function list_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    if(p_metadata.control_style && p_metadata.control_style.toLowerCase().indexOf("editable") > -1)
    {
        p_result.push("<div class='list' id='");
        p_result.push(convert_object_path_to_jquery_id(p_object_path));
        
        p_result.push("' ");
        p_result.push(" mpath='");
        p_result.push(p_metadata_path);
        p_result.push("' ");

        p_result.push(" style='");
        if(p_metadata.grid_row && p_metadata.grid_row!= "")
        {
            p_result.push("grid-row:");
            p_result.push(p_metadata.grid_row);
            p_result.push(";");
        }


        if(p_metadata.grid_column && p_metadata.grid_column!= "")
        {
            p_result.push("grid-column:");
            p_result.push(p_metadata.grid_column);
            p_result.push(";");
        }

        if(p_metadata.grid_area && p_metadata.grid_area!= "")
        {
            p_result.push("grid-area:");
            p_result.push(p_metadata.grid_area);
            p_result.push(";");
        }
        p_result.push("' ");

        p_result.push(">");
        p_result.push("<span ");

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
        
        if(p_is_grid_context && p_is_grid_context == true)
        {

        }
        else
        {
            p_result.push(p_metadata.prompt);
        }
        p_result.push("</span> <br/>");

        if(p_metadata.list_display_size && p_metadata.list_display_size!= "")
        {
            p_result.push(" <select size=");
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
                p_result.push(" <select size=");
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
        p_result.push("'  onchange='g_set_data_object_from_path(\"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(p_metadata_path);
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


        //if(p_metadata.list_display_size && p_metadata.list_display_size!="")
        //{
            p_result.push("<br/> <input placeholder='1Specify Other' class='list' type='text3' name='");
            p_result.push(p_metadata.name);
            p_result.push("' value='");
            p_result.push(p_data);
            p_result.push("' onblur='g_set_data_object_from_path(\"");
            p_result.push(p_object_path);
            p_result.push("\",\"");
            p_result.push(p_metadata_path);
            p_result.push("\",this.value)' /> <br/> ");
        //}

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
            p_result.push("<br/> <input placeholder='Specify Other' class='form-control1' type='text3' name='");
            p_result.push(p_metadata.name);
            p_result.push("' value='");
            p_result.push(p_data);
            p_result.push("' onblur='g_set_data_object_from_path(\"");
            p_result.push(p_object_path);
            p_result.push("\",\"");
            p_result.push(p_metadata_path);
            p_result.push("\",this.value)' /> ");
        //}


        }

        p_result.push("</div>");
    }
    else
    {
        p_result.push("<div class='list' id='");
        p_result.push(convert_object_path_to_jquery_id(p_object_path));
        
        p_result.push("' ");
        p_result.push(" mpath='");
        p_result.push(p_metadata_path);
        p_result.push("' ");

        p_result.push(" style='");
        if(p_metadata.grid_row && p_metadata.grid_row!= "")
        {
            p_result.push("grid-row:");
            p_result.push(p_metadata.grid_row);
            p_result.push(";");
        }


        if(p_metadata.grid_column && p_metadata.grid_column!= "")
        {
            p_result.push("grid-column:");
            p_result.push(p_metadata.grid_column);
            p_result.push(";");
        }

        if(p_metadata.grid_area && p_metadata.grid_area!= "")
        {
            p_result.push("grid-area:");
            p_result.push(p_metadata.grid_area);
            p_result.push(";");
        }
        p_result.push("' ");

        p_result.push(">");
        p_result.push("<span ");
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
        
        if(p_is_grid_context && p_is_grid_context == true)
        {

        }
        else
        {
            p_result.push(p_metadata.prompt);
        }
        p_result.push("</span> <br/> ");

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
        p_result.push("'  onchange='g_set_data_object_from_path(\"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(p_metadata_path);
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
            p_result.push("</select></div>");
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
            p_result.push("</select></div>");
        }
    }

}