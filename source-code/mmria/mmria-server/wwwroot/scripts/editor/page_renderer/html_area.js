function html_area_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{

    p_result.push("<div class='textarea' id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    p_result.push("'");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");
    p_result.push(">");

    p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_control" `);
    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push("rel='tooltip' data-original-title='");
        p_result.push(p_metadata.description.replace(/'/g, "\\'"));
        p_result.push("'");
    }

    var style_object = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];

    if(style_object)
    {
        p_result.push(" style='");
        p_result.push(get_style_string(style_object.prompt.style));
        p_result.push("'");
    }
    p_result.push(">");
        p_result.push(p_metadata.prompt);
    p_result.push("</label>");


    page_render_create_textarea(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
    
    const control_style = JSON.parse(style_object.control.style);

    control_style.top = control_style.top + control_style.height + 5;
    const validation_style = `position:absolute;top:${control_style.top}px;left:${control_style.left}px;height:${control_style.height}px;width:${control_style.width}px;font-weight:400;font-size:16px;font-style:normal;color:rgb(0, 0, 0)`;
    p_result.push(`
    <textarea id="ii-validation" style="${validation_style}" cols=40 rows=7 readonly>

    </textarea>
    
    
    
    
    </div>
    
    
    `);
    
}


