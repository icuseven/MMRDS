function user_jurisdiction_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{

    if(g_jurisdiction_list.length<=1)
    {
        //jurisdiction_label_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render);
        string_render(p_result, { name:"jurisdiction_id", prompt:"Jurisdiction Id", type:"string"}, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render);
    }
    else
    {

        p_result.push("<div class='label' id='");
        p_result.push(convert_object_path_to_jquery_id(p_object_path));
        p_result.push("'");
        p_result.push(" mpath='");
        p_result.push("/jurisdiction_id");
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
    

        p_result.push("<select name='");
        p_result.push(p_metadata.name);
        p_result.push("'  onchange='g_set_data_object_from_path(\"");
        p_result.push(p_object_path);
        p_result.push("\",\"");
        p_result.push(p_metadata_path);
        p_result.push("\",this.value)'  ");
        p_result.push(">");


        p_result.push("<option value=''></option>");
        
		for(var i = 0; i < g_jurisdiction_list.length; i++)
		{
			var child = g_jurisdiction_list[i];
            
            var item = metadata_value_list[i];
            if(p_data == child)
            {
                p_result.push("<option value='");
                p_result.push(child.replace(/'/g, "&#39;"));
                p_result.push("' selected>");
                p_result.push(child);
                p_result.push("</option>");
            }
            else
            {
                p_result.push("<option value='");
                p_result.push(child.replace(/'/g, "&#39;"));
                p_result.push("' >");
                p_result.push(child);
                p_result.push("</option>");
            }

			
		}

        p_result.push(p_metadata.prompt);
        p_result.push("</div>");


    }

	if( p_data._id)
	{

		result.push("<select id='selected_user_role_for_" + p_user_name + "_jurisdiction' size=1")
		result.push("><option></option>")
		p_level = 0;
	}




}

function jurisdiction_label_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div class='label' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    p_result.push("'");
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
    p_result.push("</div>");
}