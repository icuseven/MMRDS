function group_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div id='");
    p_result.push(p_metadata.name);
    p_result.push("_id' class='group' style='");

    /*
    if(p_metadata.grid_template && p_metadata.grid_template!= "")
    {
        p_result.push("display:grid;grid-template:");
        p_result.push(p_metadata.grid_template);
        p_result.push(";");


        if(p_metadata.grid_gap && p_metadata.grid_gap!= "")
        {
            p_result.push("grid-gap:");
            p_result.push(p_metadata.grid_gap);
            p_result.push(";");
        }
    
    
        if(p_metadata.grid_auto_flow && p_metadata.grid_auto_flow!= "")
        {
            p_result.push("grid-auto-flow:");
            p_result.push(p_metadata.grid_auto_flow);
            p_result.push(";");
        }


        if(p_metadata.grid_template_areas && p_metadata.grid_template_areas!= "")
        {
            p_result.push("grid-templ*ate-areas:");
            p_result.push(p_metadata.grid_auto_flow);
            p_result.push(";");
        }

    }




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
    */

    p_result.push("' >"); // close opening div
    p_result.push("<h4>");
    p_result.push(p_metadata.prompt);
    p_result.push("</h4>");



    for(var i = 0; i < p_metadata.children.length; i++)
    {
        var child = p_metadata.children[i];

        if(p_data[child.name] || p_data[child.name] == 0)
        {
            // do nothing 
        }
        else
        {
            p_data[child.name] = create_default_object(child, {})[child.name];
        }

        Array.prototype.push.apply(p_result, page_render(child, p_data[child.name], p_ui, p_metadata_path + '.children[' + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name, false, p_post_html_render));

    }
    p_result.push("</div>");


}