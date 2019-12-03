function textarea_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    if
    (
        p_metadata.name == "notes_about_key_circumstances_surrounding_death" &&
        (
            p_data == null ||
            p_data == ""
        )
    )
    {
        // Do something
    }
    else if (p_metadata.name == 'case_opening_overview' && p_metadata.type == 'textarea')
    {
        let info = p_metadata.prompt.replace(/Case Narrative-/, ''); // Remove the 'Case Narrative-' string in the prompt

        p_result.push(`
            <label for="${p_metadata.name}" class="h3 font-weight-bold mb-2">Case Narrative</label>
            <div class="form-group">
                <p class="font-weight-bold">${info}</p>
                <textarea id="${p_metadata.name}" class="form-control" rows="15">${p_data}</textarea>
            </div>
        `)
    }
    else
    {

        p_result.push("<div class='textarea' id='");
        p_result.push(convert_object_path_to_jquery_id(p_object_path));
        p_result.push("'");
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
            if(style_object && p_metadata.name != "case_opening_overview")
            {
                p_result.push(" style='");
                p_result.push(get_style_string(style_object.prompt.style));
                p_result.push("'");
            }
            p_result.push(">");
                p_result.push(p_metadata.prompt);
            p_result.push("</label>");

            page_render_create_textarea(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);

        p_result.push("</div>");

    }
}