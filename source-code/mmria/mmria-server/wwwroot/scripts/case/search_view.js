function get_seach_text_context(p_result, p_metadata, p_data, p_path, p_metadata_path, p_object_path, p_search_text)
{
    var result = {
        result : p_result,
        metadata:p_metadata, 
        
        data:p_data, 
        mmria_path:p_path,
        metadata_path:p_metadata_path,
        object_path:p_object_path,
        search_text:p_search_text
    };

    return result;
}

function search_text_change(p_form_control)
{
    var search_text = p_form_control.value;
    var record_index = g_ui.url_state.path_array[0];
    
    if(search_text != null && search_text.length > 3)
    {
        window.location.hash = "/" + record_index + "/field_search/" + search_text;
    }
}

function render_search_text(p_ctx)
{
    switch(p_ctx.metadata.type.toLocaleLowerCase())
    {
        case "app":
            for(var i in p_ctx.metadata.children)
            {
                var child = p_ctx.metadata.children[i];
                if(p_ctx.data)
                {
                    //p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name
                    let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                    render_search_text(new_context);
                    //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                }

            }
            break;
        case "form":
            for(var i in p_ctx.metadata.children)
            {
                var child = p_ctx.metadata.children[i];

                if(p_ctx.data)
                {
                    let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                    render_search_text(new_context);
                    //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                }
                
            }

            break;
        case "group":
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_group_control(p_ctx);    
            }
            else
            {
                for(var i in p_ctx.metadata.children)
                {
                    var child = p_ctx.metadata.children[i];
                    if(p_ctx.data)
                    {
                        let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                    }
                }
            }
        break;
        case "grid":
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_grid_control(p_ctx)
            }
            else
            {
                for(var i in p_ctx.metadata.children)
                {
                    var child = p_ctx.metadata.children[i];
                    if(p_ctx.data)
                    {
                        let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                    }
                }
            }
            break;
        case "string":
        case "number":
        case "date":
        case "datetime":
        case "time":
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_input_control(p_ctx);
            }
            break;
        case "list":
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_select_control(p_ctx);
            }
            break;
        case "textarea":
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_textarea_control(p_ctx);
            }  
            break;
    }
}

function render_search_text_input_control(p_ctx)
{   
    var result = p_ctx.result;

    var style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        result.push("<div id='");
        result.push(convert_object_path_to_jquery_id(p_ctx.object_path));
        result.push("' metadata='");
        result.push(p_ctx.mmria_path);
        result.push("'>");
        result.push("<p>");
        result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
        result.push("</p>");

        result.push("<label for='");
        result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        result.push("' style='");
        result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
        result.push("'>");
        result.push(p_ctx.metadata.prompt);
        result.push("</label>");
            
        result.push("<input id='");
        result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        result.push("' type='text' style='");

        result.push(get_only_size_and_font_style_string(style_object.control.style));
        result.push("' value='"); 
        result.push(p_ctx.data); 
        result.push("' "); 

		var f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_of";
		if(path_to_onfocus_map[p_ctx.metadata_path])
		{
			page_render_create_event(result, "onfocus", p_ctx.metadata.onfocus, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
		}

		f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_och";
		if(path_to_onchange_map[p_ctx.metadata_path])
		{
			page_render_create_event(result, "onchange", p_ctx.metadata.onchange, p_ctx.metadata_path, p_ctx.object_path, p_ctx.dictionmmria_pathary_path);
		}
		
		f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_ocl";
		if(path_to_onclick_map[p_ctx.metadata_path])
		{
			page_render_create_event(result, "onclick", p_ctx.metadata.onclick, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
		}
		
		page_render_create_onblur_event(result, p_ctx.metadata, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);

        result.push(" />"); 

        result.push("</div><br/>");
    }


}


function render_search_text_textarea_control(p_search_text_context)
{   
    var result = [];

    var style_object = g_default_ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {
        result.push("<div metadata='");
        result.push(p_path);
        result.push("'>");
        result.push("<p>");
        result.push(p_path.substring(1).replace(/\//g, " > "));
        result.push("</p>");

        result.push("<label for='");
        result.push(p_path.replace(/\//g, "--"));
        result.push("' style='");
        result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
        result.push("'>");
        result.push(p_search_text_context.metadata.prompt);
        result.push("</label><br/>");

        result.push("<textarea id='");
        result.push(p_path.replace(/\//g, "--"));
        result.push("' type='text' style='");
        
        result.push(get_only_size_and_font_style_string(style_object.control.style));
        result.push("' />"); 

        result.push("</textarea>");
        result.push("</div><br/>");
    }

    return result;
}


function render_search_text_group_control(p_search_text_context)
{   
    var result = [];

    for(var i in p_search_text_context.metadata.children)
    {
        var child = p_search_text_context.metadata.children[i];
        Array.prototype.push.apply(result, render_search_text(child, p_search_text_context.mmria_path+ "/" + child.name, p_search_text));
    }


    return result;
}

function render_search_text_grid_control(p_search_text_context)
{   
    var result = [];
    for(var i in p_search_text_context.metadata.children)
    {
        var child = p_search_text_context.metadata.children[i];
        Array.prototype.push.apply(result, render_search_text(child, p_search_text_context.mmria_path+ "/" + child.name, p_search_text, false));
    }


    return result;
}

function render_search_text_select_control(p_search_text_context)
{   
    var result = [];

    var style_object = g_default_ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {
        result.push("<div metadata='");
        result.push(p_path);
        result.push("'>");
        result.push("<p>");
        result.push(p_path.substring(1).replace(/\//g, " > "));
        result.push("</p>");
            if(!p_is_grid)
            {
                result.push("<label for='");
                result.push(p_path.replace(/\//g, "--"));
                result.push("' style='");
                //if(style_object.prompt)
                //result.push(get_style_string(style_object.prompt.style)); 
                result.push("'>");
                result.push(p_metadata.prompt);
                result.push("</label>");
            }
            result.push("<select id='");
            result.push(p_path);
            result.push("' type='text' style='");
            if(!p_is_grid)
            if(style_object.control)
            result.push(get_only_size_and_font_style_string(style_object.control.style));
            result.push("' "); 
            if(p_metadata.list_display_size != null)
            {
                result.push(" size='"); 
                result.push(p_metadata.list_display_size);
            }
            
            result.push("' >"); 

            if(p_metadata.path_reference && p_metadata.path_reference.length > 0)
            {
                for(var i in g_look_up[p_metadata.path_reference])
                {
                    var child = g_look_up[p_metadata.path_reference][i];
                    result.push("<option>");
                    if(child.description == null || child.description == "")
                    {
                        result.push(child.value);
                    }
                    else
                    {
                        result.push(child.description);
                    }
                    result.push("</option>");

                }
            }
            else
            {

                for(var i in p_metadata.values)
                {
                    var child = p_metadata.values[i];
                    result.push("<option>");
                    if(child.description == null || child.description == "")
                    {
                        result.push(child.value);
                    }
                    else
                    {
                        result.push(child.description);
                    }
                    result.push("</option>");

                }
            }

            result.push("</select>");
        result.push("</div><br/>");
    }

    return result;
}

function get_only_size_and_font_style_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');
    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {

            case "height":
            case "width":
                var value = pair[1].trim();
                if(/px$/.test(value))
                {
                    result.push(pair[0] + ":" + value);
                }
                else
                {
                    result.push(pair[0] + ":" + pair[1].trim() + "px");
                }
                break;
            case "font-size":
                var value = pair[1].trim();
                if(/px$/.test(value))
                {
                    result.push(pair[0] + ":" + value);
                }
                else
                {
                    result.push(pair[0] + ":" + pair[1].trim() + "px");
                }
                break;

            case "font-weight":
            case "color":
                result.push(pair.join(":"));
                break;
        }

    }

    return result.join(";");
}
