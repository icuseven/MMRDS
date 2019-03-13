function number_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div class='number' ");
    p_result.push(" id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    p_result.push("'");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

/*
    p_result.push(" style='");

    var key = p_dictionary_path.substring(1);

    if
    (
        g_default_ui_specification && 
        g_default_ui_specification.form_design[key]  &&
        g_default_ui_specification.form_design[key].prompt &&
        g_default_ui_specification.form_design[key].prompt.style
    )
    {
        p_result.push(convert_ui_spec_style_to_css(g_default_ui_specification.form_design[key].prompt.style));
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
    p_result.push("' ");
    */

    p_result.push(">");
    p_result.push("<label ");
    p_result.push(" style='");

    var key = p_dictionary_path.substring(1);

    if
    (
        g_default_ui_specification && 
        g_default_ui_specification.form_design[key]  &&
        g_default_ui_specification.form_design[key].prompt &&
        g_default_ui_specification.form_design[key].prompt.style
    )
    {
        p_result.push(convert_ui_spec_style_to_css(g_default_ui_specification.form_design[key].prompt.style));
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
    
    if(p_is_grid_context && p_is_grid_context == true)
    {

    }
    else
    {
        p_result.push(p_metadata.prompt);
    }
    
    
    page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
    p_result.push("</label> ");
    p_result.push("</div>");
    
}