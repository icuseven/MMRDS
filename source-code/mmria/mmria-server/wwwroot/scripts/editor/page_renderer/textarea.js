function textarea_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx)
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

        if(p_metadata.name == "case_opening_overview")
        {
            let opts = {
                btns: [
                    ['viewHTML'],
                    ['undo', 'redo'],
                    ['strong', 'em', 'underline', 'del'],
                    ['fontsize'],
                    ['foreColor', 'backColor'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight'],
                    ['unorderedList', 'orderedList'],
                    ['horizontalRule'],
                    ['removeformat'],
                    ['fullscreen'],
                ],
                plugins: {
                    // Add font sizes manually
                    fontsize: {
                        sizeList: [
                            '14px',
                            '16px',
                            '18px',
                            '24px',
                            '32px',
                            '48px'
                        ],
                        allowCustomSize: false
                    },
                    // Add colors manually
                    // Currently utilizing all primary, secondary, tertiary colors in color wheel
                    colors: {
                        colorList: [
                            'FFFFFF',
                            'CCCCCC',
                            '777777',
                            '333333',
                            '000000',
                            'FF0000',
                            '00FF00',
                            '0000FF',
                            'FFFF00',
                            'FF00FF',
                            '00FFFF',
                            'FF7F00',
                            'FF007F',
                            '7FFF00',
                            '7F00FF',
                            '00FF7F',
                            '007FFF'
                        ]
                    }
                }
            }

            p_post_html_render.push(`$('#case_narrative_editor').trumbowyg(${JSON.stringify(opts)});`);
            
            p_post_html_render.push(`$('#case_narrative_editor').trumbowyg().on('tbwchange',function (){ let data = $('.trumbowyg-editor').html(); g_textarea_oninput("${p_object_path}","${p_metadata_path}","${p_dictionary_path}", data); } );`);

/*
            code_array.push("g_set_data_object_from_path(\"");
            code_array.push(p_object_path);
            code_array.push("\",\"");
            code_array.push(p_metadata_path);
            code_array.push("\",\"");
            code_array.push(p_dictionary_path);
            code_array.push("\",p_control.value, null");
            if(p_ctx!=null)
            {
                if(p_ctx.form_index != null)
                {
                    code_array.push(", ");
                    code_array.push(p_ctx.form_index);
                }
        
                if(p_ctx.grid_index != null)
                {
                    code_array.push(", ");
                    code_array.push(p_ctx.grid_index);
                }
            }
            code_array.push(");\n}).call(");
            code_array.push(p_object_path.substring(0, p_object_path.lastIndexOf(".")));
            code_array.push(", event.target);");
*/

        }

        p_result.push("</div>");
    }
}