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

        p_result.push(`<label for="${convert_object_path_to_jquery_id(p_object_path)}_control" `);
        if(p_metadata.description && p_metadata.description.length > 0)
        {
            p_result.push("rel='tooltip' data-original-title='");
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



        

        if(p_metadata.name == "case_opening_overview")
        {
            let crlf_regex = /\n/g;

            let new_text = p_data;
    
            if(p_data!= null)
            {
                new_text = p_data.replace(crlf_regex, "<br/>");
            }

            page_render_create_textarea(p_result, p_metadata, new_text, p_metadata_path, p_object_path, p_dictionary_path);

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
                },
                semantic: true
            }

            p_post_html_render.push(`$('#case_narrative_editor').trumbowyg(${JSON.stringify(opts)});`);
            
            p_post_html_render.push(`
                $('#case_narrative_editor')
                .trumbowyg()
                .on('tbwchange', function ()
                {
                    tbw_change_paste("${p_object_path}","${p_metadata_path}","${p_dictionary_path}");
                })
                .on('tbwpaste', function ()
                {
                    tbw_change_paste("${p_object_path}","${p_metadata_path}","${p_dictionary_path}");
                });
            `);

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
        else
        {
            page_render_create_textarea(p_result, p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path);
        }

        p_result.push("</div>");
    }
}



function tbw_change_paste(p_object_path, p_metadata_path, p_dictionary_path)
{
    let data = $('.trumbowyg-editor').html();

    let new_text = textarea_control_strip_html_attributes(data);

    if
    (
        new_text == null && data.length > 0 ||
        new_text.length == 0 && data.length != 0
    )
    {
        console.log("tbw_change_paste null error");
        new_text = data;
    }

    g_textarea_oninput(p_object_path, p_metadata_path,p_dictionary_path, new_text);
}


function textarea_control_replace_return_with_br(p_value)
{
    let crlf_regex = /\n/g;

    let result = p_value;

    if(p_value!= null)
    {
        result = p_value.replace(crlf_regex, "<br/>");
    }

    return result;
}

function textarea_control_strip_html_attributes(p_value)
{

    let CommentRegex = /<!--\[[^>]+>/gi;

    let node = document.createElement("body");
    node.innerHTML = p_value.replace(CommentRegex,"");

    DOMWalker(node);

    return node.innerHTML;
    
}

const AcceptableTag = {
    "body":true,
    //"#text",true
    "p":true,
    "em":true,
    "strong":true,
    "u":true,
    "ul":true,
    "ol":true,
    "li":true,
    "br":true,
    "del":true,
    "hr":true,
    "span":true
}

function DOMWalker(p_node)
{
    //console.log(`${p_node.nodeType} = ${p_node.nodeName}`);

    if
    (
        AcceptableTag[p_node.nodeName.toLowerCase()] == null
    )
    {
        if(p_node.nodeName.toLowerCase() != "#text")
            console.log(`${p_node.nodeType} = ${p_node.nodeName}`);
    }

    if(p_node.attributes != null)
    {
        let remove_list = [];

        for(let i = 0; i < p_node.attributes.length; i++)
        {
            let attr = p_node.attributes[i];
           
            if(attr.name != "style")
            {
                console.log(`${attr.name} = ${attr.value}`);
                remove_list.push(attr.name);
            }
        }

        remove_list.reverse ();
        for(let i = 0; i < remove_list.length; i++)
        {
            
            p_node.removeAttribute(remove_list[i]);
        }
    }

    for(let i = 0; i < p_node.childNodes.length; i++)
    {
        let child = p_node.childNodes[i];

        DOMWalker(child);
    }


}


function textarea_control_strip_html_attributes2(p_value)
{
    let AttributeRegEx = /[a-zA-Z]+='[^']+'|[a-zA-Z]+=\"[^\"]+\"/gi;
    

    let PseudoTagRegex = /<\/?[a-z]:[^>]+>/gi;

    let CommentRegex = /<!--\[[^>]+>/gi;


    //let StripTrailBlankSpaceExp = /(<\/?([ ])+[^>]+>)/gi;

    //let StripHTMLExp = /(<\/?[^>]+>)/gi;

    let StripTrailBlankSpaceExp = /<\/?[a-zA-Z]+([ ]+)[^>]+>/gi;

    let result = p_value.replace(AttributeRegEx,"").replace(PseudoTagRegex, "").replace(CommentRegex,"").replace(StripTrailBlankSpaceExp, "");

    return result;

}