function date_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    p_result.push("<div id='");
    p_result.push(convert_object_path_to_jquery_id(p_object_path));
    
    p_result.push("' ");
    p_result.push(" mpath='");
    p_result.push(p_metadata_path);
    p_result.push("' ");

    p_result.push(">");
    p_result.push("<label ");
    if(p_metadata.description && p_metadata.description.length > 0)
    {
        p_result.push("rel='tooltip'  data-original-title='");
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

    p_result.push("</label> ");
    page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);

    
    p_result.push("</div>");

    p_post_html_render.push(' flatpickr("#' + convert_object_path_to_jquery_id(p_object_path) + ' input.date", {');
    p_post_html_render.push('	utc: true,');
    p_post_html_render.push('	defaultDate: "');
    p_post_html_render.push(p_data);
    p_post_html_render.push('",');
    p_post_html_render.push('	enableTime: false,');
    p_post_html_render.push('  onClose: function(selectedDates, p_value, instance)  ');
    p_post_html_render.push('  {');
    p_post_html_render.push('              var elem = document.querySelector("#' + convert_object_path_to_jquery_id(p_object_path) + ' input.date "); elem.value = p_value;');
    p_post_html_render.push('              g_set_data_object_from_path("' + p_object_path + '", "' + p_metadata_path + '", "' + p_dictionary_path + '", p_value);');
    p_post_html_render.push('  }');
    p_post_html_render.push('});');

}