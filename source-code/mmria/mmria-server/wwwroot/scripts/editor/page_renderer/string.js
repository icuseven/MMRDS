function string_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
{
    let styleObject = g_default_ui_specification.form_design[p_dictionary_path.substring(1)];
    let pDescription = p_metadata.description;
    let pValidationDescript = p_metadata.validation_description;

    let other_specify = g_other_specify_lookup[p_dictionary_path.substr(1)];

    let visibility_html = 'display:block;';

    if(other_specify!= null)
    {
        console.log("here");
        let object_path = `g_data.${other_specify.list.replace(/\//g,".")}`;
        let other_data = eval(object_path);

        if(Array.isArray(other_data))
        {
            if(other_data.indexOf(other_specify.value) > -1)
            {
                visibility_html = 'display:block;';
            }
            else
            {
                visibility_html = 'display:none;';
            }
        }
        else
        {
            if(other_specify.value == other_data)
            {
                visibility_html = 'display:block;';
            }
            else
            {
                visibility_html = 'display:none;';
            }
        }
    }/**/


    p_result.push(`<div id="${convert_object_path_to_jquery_id(p_object_path)}" class="form-control-outer" mpath="${p_metadata_path}" style="${visibility_html}">`);
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
