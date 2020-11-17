function string_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
    var styleObject = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    var pDescription = p_metadata.description;
    var pValidationDescript = p_metadata.validation_description;

    p_result.push(`<div id="${convert_object_path_to_jquery_id(p_object_path)}" class="form-control-outer" mpath="${p_metadata_path}">`);
        p_result.push(`
            <label for="${convert_object_path_to_jquery_id(p_object_path)}_control"
                   ${styleObject ? `style="${get_style_string(styleObject.prompt.style)}"` : ''}
                   ${pDescription && pDescription.length > 0 ? `rel="tooltip" data-original-title="${pDescription.replace(/'/g, "\\'")}"` : ''}
                   ${pValidationDescript && pValidationDescript.length > 0 ? `validation-tooltip="${p_validation_description.replace(/'/g, "\\'")}"` : ''}>
                ${p_metadata.prompt}
            </label>
        `);

        //Renders input control on `page_renderer.js` file
        page_render_create_input(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path, p_ctx);
        
    p_result.push(`</div>`);
}
