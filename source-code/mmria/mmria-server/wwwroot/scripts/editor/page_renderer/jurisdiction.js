function user_jurisdiction_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div class='form-control1' id='" + convert_object_path_to_jquery_id(p_object_path) + "'");
    p_result.push(" mpath='" + p_metadata_path + "' style>");


    p_result.push("<span>Jurisdiction Id</span>");

    p_result.push("<select name='" + p_metadata.name + "'  onchange='g_set_data_object_from_path(\"");
    p_result.push(p_object_path);
    p_result.push("\",\"");
    p_result.push(p_metadata_path);
    p_result.push("\",this.value)'  ");
    p_result.push(">");

/*
    if(g_jurisdiction_list.length > 1)
    {
        p_result.push("<option value=''></option>");
    }
*/

    for(var i = 0; i < g_jurisdiction_list.length; i++)
    {
        var child = g_jurisdiction_list[i];
        
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
    p_result.push("</select></div>");

}
