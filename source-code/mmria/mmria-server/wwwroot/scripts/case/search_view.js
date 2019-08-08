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
            for(let i in p_ctx.metadata.children)
            {
                let child = p_ctx.metadata.children[i];
                if(p_ctx.data && child.type.toLocaleLowerCase() == "form")
                {
                    //p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name
                    let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                    render_search_text(new_context);
                    //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                }

            }
            break;
        case "form":
            if(p_ctx.metadata.cardinality == "1" || p_ctx.metadata.cardinality == "?")
            {
                for(let i in p_ctx.metadata.children)
                {
                    let child = p_ctx.metadata.children[i];

                    if(p_ctx.data)
                    {
                        let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                        //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                    }
                    
                }
            }
            else // multiform
            {

                for(let row in p_ctx.data)
                {
                    let row_data = p_ctx.data[row]
                    for(let i in p_ctx.metadata.children)
                    {
                        let child = p_ctx.metadata.children[i];
    
                        if(row_data)
                        {
                            let new_context = get_seach_text_context(p_ctx.result, child, row_data[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "[" + row + "]." + child.name, p_ctx.search_text);
                            new_context.multiform_index = row;
                            render_search_text(new_context);
                            //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                        }
                        
                    }
                }

            }

            break;
        case "group":
            /*
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_group_control(p_ctx);    
            }
            else
            {*/
                for(let i in p_ctx.metadata.children)
                {
                    let child = p_ctx.metadata.children[i];
                    if(p_ctx.data)
                    {
                        let new_context = get_seach_text_context(p_ctx.result, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                    }
                }
            //}
        break;
        case "grid":
            /*
            if(p_ctx.metadata.prompt.toLocaleLowerCase().search(p_ctx.search_text.toLocaleLowerCase()) > -1)
            {
                render_search_text_grid_control(p_ctx)
            }
            else
            {*/
                for(let i in p_ctx.data)
                {
                    let row_item = p_ctx.data[i];
                    
                    //let new_context = get_seach_text_context(p_ctx.result, p_ctx.metadata, child_data, p_ctx.mmria_path + "/" + i + "/", p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path, p_ctx.search_text);
                    //render_search_text(new_context);

                    for(let j in p_ctx.metadata.children)
                    {
                        let child = p_ctx.metadata.children[j];

                        
                        let new_context = get_seach_text_context(p_ctx.result, child, row_item[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" +j + "]", p_ctx.object_path + "." + ".children[" + j + "]" + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                        //Array.prototype.push.apply(result, render_search_text(child, ctx.mmria_path+ "/" + child.name, p_search_text));
                        
                        
                    }
                
                }
            //}
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
    if(style_object == null)
    {
        console.log(p_ctx.mmria_path.substring(1));
    }

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
		
		page_render_create_onblur_event(p_ctx.result, p_ctx.metadata, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);

        result.push(" />"); 

        result.push("</div><br/>");
    


}


function render_search_text_textarea_control(p_ctx)
{   
    var style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        p_ctx.result.push("<div metadata='");
        p_ctx.result.push(p_ctx.mmria_path);
        p_ctx.result.push("'>");
        p_ctx.result.push("<p>");
        p_ctx.result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
        p_ctx.result.push("</p>");

        p_ctx.result.push("<label for='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' style='");
        p_ctx.result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
        p_ctx.result.push("'>");
        p_ctx.result.push(p_ctx.metadata.prompt);
        p_ctx.result.push("</label><br/>");

        p_ctx.result.push("<textarea id='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' type='text' style='");
        
        p_ctx.result.push(get_only_size_and_font_style_string(style_object.control.style));
        p_ctx.result.push("' "); 

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
		
		page_render_create_onblur_event(p_ctx.result, p_ctx.metadata, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);



        p_ctx.result.push(">");
        p_ctx.result.push(p_ctx.data);
        p_ctx.result.push("</textarea>");
        p_ctx.result.push("</div><br/>");
    }

}


function render_search_text_group_control(p_ctx)
{   
    var result = [];

    for(var i in p_ctx.metadata.children)
    {
        var child = p_search_text_context.metadata.children[i];
        Array.prototype.push.apply(result, render_search_text(child, p_ctx.mmria_path+ "/" + child.name, p_search_text));
    }


    return result;
}

function render_search_text_grid_control(p_ctx)
{   
    var is_grid_context = null;
    p_ctx.result.push("<fieldset id='");
    
    p_ctx.result.push(p_ctx.metadata_path);
    p_ctx.result.push("' ");
    p_ctx.result.push(" mpath='" + p_ctx.metadata_path + "'");
    p_ctx.result.push(" class='grid2 grid-control' style='");
        var style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
        if(style_object)
        {
            p_ctx.result.push(get_only_size_and_position_string(style_object.control.style));
            is_grid_context = style_object;
        }
        p_ctx.result.push("' >"); // close opening div

        p_ctx.result.push("<legend class='grid-control-legend' style='");
        
        var style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
        if(style_object && style_object.prompt)
        {
            p_ctx.result.push(get_only_font_style_string(style_object.prompt.style));
        }
        p_ctx.result.push("'>");
        p_ctx.result.push(p_ctx.metadata.prompt);
        p_ctx.result.push(" - ");
        p_ctx.result.push(p_ctx.data.length)
        p_ctx.result.push(" item(s) </legend>");
        p_ctx.result.push("<div class='grid-control-items'>");
    for(var i in p_ctx.metadata.children)
    {
        var child = p_ctx.metadata.children[i];

        let new_context = get_seach_text_context(p_ctx.result, child.name, p_ctx.data[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path, p_ctx.search_text);
        render_search_text(new_context);

        //Array.prototype.push.apply(result, render_search_text(child, p_ctx.mmria_path+ "/" + child.name, p_search_text, false));
    }

    p_ctx.result.push("</div>");
    p_ctx.result.push("<button type='button'class='grid-control-btn btn btn-primary d-flex align-items-center' onclick='g_add_grid_item(\"");
        // p_result.push("<input type='button' style='width:90px'  class='btn btn-primary' value='Add Item' onclick='g_add_grid_item(\"");
        p_ctx.result.push(p_ctx.object_path);
        p_ctx.result.push("\", \"");
        p_ctx.result.push(p_ctx.metadata_path);
        p_ctx.result.push("\", \"");
        p_ctx.result.push(p_ctx.dictionary_path);    
        p_ctx.result.push("\")'><span class='x24 cdc-icon-plus'></span> Add Item");
        p_ctx.result.push("</button>");
        p_ctx.result.push("</fieldset>");    


    return result;
}

function render_search_text_select_control(p_ctx)
{   
    var style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        p_ctx.result.push("<div metadata='");
        p_ctx.result.push(p_ctx.mmria_path_path);
        p_ctx.result.push("'>");
        p_ctx.result.push("<p>");
        p_ctx.result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
        p_ctx.result.push("</p>");
            
        p_ctx.result.push("<label for='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' style='");
                //if(style_object.prompt)
                //result.push(get_style_string(style_object.prompt.style)); 
                p_ctx.result.push("'>");
                p_ctx.result.push(p_ctx.metadata.prompt);
                p_ctx.result.push("</label>");
            
                p_ctx.result.push("<select id='");
                p_ctx.result.push(p_ctx.mmria_path);
                p_ctx.result.push("' type='text' ");

            if(style_object.control)
            {
                p_ctx.result.push("style='")
                p_ctx.result.push(get_only_size_and_font_style_string(style_object.control.style));
                p_ctx.result.push("' "); 
            }
            


            p_ctx.result.push("  onchange='g_set_data_object_from_path(\"");
            p_ctx.result.push(p_ctx.object_path);
            p_ctx.result.push("\",\"");
            p_ctx.result.push(p_ctx.metadata_path);
            p_ctx.result.push("\",\"");
            p_ctx.result.push(p_ctx.dictionary_path);
            p_ctx.result.push("\",this.value)'  ");


            if(p_ctx.metadata.list_display_size != null)
            {
                p_ctx.result.push(" size='"); 
                p_ctx.result.push(p_ctx.metadata.list_display_size);
            }
            
            p_ctx.result.push("' >"); 

            if(p_ctx.metadata.path_reference && p_ctx.metadata.path_reference.length > 0)
            {
                for(var i in g_look_up[p_ctx.metadata.path_reference])
                {
                    var child = g_look_up[p_ctx.metadata.path_reference][i];
                    p_ctx.result.push("<option ");
                    if(child.description == null || child.description == "")
                    {
                        if(p_ctx.data == child.value)
                        {
                            p_ctx.result.push("selected ");
                        }
                        p_ctx.result.push(" value='");
                        p_ctx.result.push(child.value);
                        p_ctx.result.push("'>");
                        p_ctx.result.push(child.value);
                    }
                    else
                    {
                        if(p_ctx.data == child.value)
                        {
                            p_ctx.result.push("selected ");
                        }
                        p_ctx.result.push(" value='");
                        p_ctx.result.push(child.value);
                        p_ctx.result.push("'>");
                        p_ctx.result.push(child.description);
                    }
                    p_ctx.result.push("</option>");

                }
            }
            else
            {

                for(var i in p_ctx.metadata.values)
                {
                    var child = p_ctx.metadata.values[i];
                    p_ctx.result.push("<option>");
                    if(child.description == null || child.description == "")
                    {
                        p_ctx.result.push(child.value);
                    }
                    else
                    {
                        p_ctx.result.push(child.description);
                    }
                    p_ctx.result.push("</option>");

                }
            }

            p_ctx.result.push("</select>");
            p_ctx.result.push("</div><br/>");
    }
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
