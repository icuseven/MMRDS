function user_jurisdiction_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div class='form-control1' id='g_data_jurisdiction_id'");
    p_result.push(" mpath='g_metadata.children[0]' style>");


    p_result.push("<span>Jurisdiction Id</span>");

    p_result.push("<select name='jurisdiction_id'  onchange='g_set_data_object_from_path(\"");
    p_result.push("g_data.jurisdiction_id");
    p_result.push("\",\"");
    p_result.push("g_metadata.children[0]");
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
