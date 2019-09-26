function get_seach_text_context(p_result, p_post_html_render, p_metadata, p_data, p_path, p_metadata_path, p_object_path, p_search_text, p_form_index, p_grid_index)
{
    let result = {
        result : p_result,
        post_html_render: p_post_html_render,
        metadata:p_metadata, 
        
        data:p_data, 
        mmria_path:p_path,
        metadata_path:p_metadata_path,
        object_path:p_object_path,
        search_text:p_search_text,
        form_index: p_form_index,
        grid_index: p_grid_index

    };

    return result;
}

function search_text_change(p_form_control)
{
    let search_text = p_form_control.value;
    let record_index = g_ui.url_state.path_array[0];
    
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
            for(let i = 0; i < p_ctx.metadata.children.length; i++)
            {
                let child = p_ctx.metadata.children[i];
                if(p_ctx.data && child.type.toLocaleLowerCase() == "form")
                {
                    let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                    render_search_text(new_context);
                }
            }
            break;
        case "form":
            if(p_ctx.metadata.cardinality == "1" || p_ctx.metadata.cardinality == "?")
            {
                for(let i = 0; i < p_ctx.metadata.children.length; i++)
                {
                    let child = p_ctx.metadata.children[i];

                    if(p_ctx.data)
                    {
                        let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text);
                        render_search_text(new_context);
                    }
                    
                }
            }
            else // multiform
            {

                for(let row = 0; row < p_ctx.data.length; row++)
                {
                    let row_data = p_ctx.data[row]
                    for(let i = 0; i < p_ctx.metadata.children.length; i++)
                    {
                        let child = p_ctx.metadata.children[i];
    
                        if(row_data)
                        {
                            let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child, row_data[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "[" + row + "]." + child.name, p_ctx.search_text, row);
                            new_context.multiform_index = row;
                            render_search_text(new_context);
                        }
                        
                    }
                }
            }
            break;
        case "group":
            for(let i = 0; i < p_ctx.metadata.children.length; i++)
            {
                let child = p_ctx.metadata.children[i];
                if(p_ctx.data)
                {
                    let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child, p_ctx.data[child.name], p_ctx.mmria_path+ "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path + "." + child.name, p_ctx.search_text, p_ctx.form_index, p_ctx.grid_index);
                    render_search_text(new_context);
                }
            }
            break;
        case "grid":
            for(let i = 0; i < p_ctx.data.length; i++)
            {
                let row_item = p_ctx.data[i];
                for(let j in p_ctx.metadata.children)
                {
                    let child = p_ctx.metadata.children[j];
                    
                    let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child, row_item[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" +j + "]", p_ctx.object_path + "[" + i + "]." + child.name, p_ctx.search_text, p_ctx.form_index, i);
                    render_search_text(new_context);
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
    let result = p_ctx.result;
    let style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    let style_string = get_only_size_and_font_style_string(style_object.prompt.style);
    let control_string = get_only_size_and_font_style_string(style_object.control.style);
    /*
    if(style_object == null)
    {
        console.log(p_ctx.mmria_path.substring(1));
    }*/

    result.push("<div id='");
    result.push(convert_object_path_to_jquery_id(p_ctx.object_path));
    result.push("' class='form-group mb-4' metadata='");
    result.push(p_ctx.mmria_path);
    result.push("'>");
    result.push("<p>");
    result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
    result.push("</p>");

    result.push("<label class='row no-gutters w-auto h-auto' for='");
    result.push(p_ctx.mmria_path.replace(/\//g, "--"));
    result.push("' style='");
    if
    (
        style_object &&
        style_object.prompt &&
        style_object.prompt.style
    )
    result.push(style_string); 
    result.push("'>");
    result.push(p_ctx.metadata.prompt);
    result.push("</label class='row no-gutters w-auto h-auto'>");
        
    result.push("<input id='");
    result.push(p_ctx.mmria_path.replace(/\//g, "--"));
    result.push("' class='form-control' type='text' style='");

    if
    (
        style_object &&
        style_object.control &&
        style_object.control.style
    )
    result.push(control_string);
    result.push("' value='"); 
    result.push(p_ctx.data); 
    result.push("' "); 

    switch (p_ctx.metadata.type.toLocaleLowerCase())
    {
        case "date":
            result.push(" class='date' ");
            break;
        case "datetime":
            result.push(" class='datetime' ");
            break;
        case "time":
            result.push(" class='time' ");
            break;

    }

    if
    (
        (
            p_ctx.metadata.is_read_only != null &&
            p_ctx.metadata.is_read_only == true
        ) ||
        p_ctx.metadata.mirror_reference
    )
    {
        result.push(" readonly=true ");
    }
    else
    {

        let f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_of";
        if(path_to_onfocus_map[p_ctx.metadata_path])
        {
            page_render_create_event(result, "onfocus", p_ctx.metadata.onfocus, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
        }

        f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_och";
        if(path_to_onchange_map[p_ctx.metadata_path])
        {
            page_render_create_event(result, "onchange", p_ctx.metadata.onchange, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
        }
        
        f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_ocl";
        if(path_to_onclick_map[p_ctx.metadata_path])
        {
            page_render_create_event(result, "onclick", p_ctx.metadata.onclick, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
        }
        
        page_render_create_onblur_event(result, p_ctx.metadata, p_ctx.metadata_path, p_ctx.object_path, p_ctx.mmria_path);
    }
    result.push(" />"); 

    result.push("</div>");

    // post html start
    
    switch (p_ctx.metadata.type.toLocaleLowerCase())
    {
        case "date":
            p_ctx.post_html_render.push(' flatpickr("#' + convert_object_path_to_jquery_id(p_ctx.object_path) + ' input.date", {');
            p_ctx.post_html_render.push('	utc: true,');
            p_ctx.post_html_render.push('	defaultDate: "');
            p_ctx.post_html_render.push(p_ctx.data);
            p_ctx.post_html_render.push('",');
            p_ctx.post_html_render.push('	enableTime: false,');
            p_ctx.post_html_render.push('  onClose: function(selectedDates, p_value, instance)  ');
            p_ctx.post_html_render.push('  {');
            p_ctx.post_html_render.push('              let elem = document.querySelector("#' + convert_object_path_to_jquery_id(p_ctx.object_path) + ' input.date "); elem.value = p_value;');
            p_ctx.post_html_render.push('              g_set_data_object_from_path("' + p_ctx.object_path + '", "' + p_ctx.metadata_path + '", "' + p_ctx.mmria_path + '", p_value);');
            p_ctx.post_html_render.push('  }');
            p_ctx.post_html_render.push('});');
            break;
        case "datetime":
            p_ctx.post_html_render.push('$("#' + convert_object_path_to_jquery_id(p_ctx.object_path) + ' input.datetime").datetimepicker({');
            p_ctx.post_html_render.push(' format: "Y-MM-D H:mm:ss", ');
            p_ctx.post_html_render.push(' defaultDate: "' + p_ctx.data + '",');
            p_ctx.post_html_render.push(' icons: { time: "x24 fill-p cdc-icon-clock_01", date: "x24 fill-p cdc-icon-calendar_01", up: "x28 fill-p cdc-icon-arrow-alt-circle-up-solid", down: "x28 fill-p cdc-icon-arrow-alt-circle-down-solid" }');
            p_ctx.post_html_render.push('});');
            break;
        case "time":
            p_ctx.post_html_render.push(' $("#' + convert_object_path_to_jquery_id(p_ctx.object_path) + ' .time" ).datetimepicker({format: "LT",  });');
            break;
    }
    
    // post html end
}

function render_search_text_textarea_control(p_ctx)
{   
    let style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        p_ctx.result.push("<div metadata='");
        p_ctx.result.push(p_ctx.mmria_path);
        p_ctx.result.push("' class='form-group mb-4'>");
        p_ctx.result.push("<p>");
        p_ctx.result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
        p_ctx.result.push("</p>");

        p_ctx.result.push("<label class='row no-gutters w-auto h-auto' for='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' style='");
        p_ctx.result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
        p_ctx.result.push("'>");
        p_ctx.result.push(p_ctx.metadata.prompt);
        p_ctx.result.push("</label>");

        p_ctx.result.push("<textarea id='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' class='form-control' style='");
        
        p_ctx.result.push(get_only_size_and_font_style_string(style_object.control.style));
        p_ctx.result.push("' "); 

        if
        (
            (
                p_ctx.metadata.is_read_only != null &&
                p_ctx.metadata.is_read_only == true
            ) ||
            p_ctx.metadata.mirror_reference
        )
        {
            p_ctx.result.push(" readonly=true ");
        }
        else
        {
            let f_name = "x" + path_to_int_map[p_ctx.metadata_path].toString(16) + "_of";
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
        }

        p_ctx.result.push(">");
        p_ctx.result.push(p_ctx.data);
        p_ctx.result.push("</textarea>");
        p_ctx.result.push("</div>");
    }
}

function render_search_text_group_control(p_ctx)
{   
    let result = [];

    for(let i = 0; i < p_ctx.metadata.children.length; i++)
    {
        let child = p_search_text_context.metadata.children[i];
        Array.prototype.push.apply(result, render_search_text(child, p_ctx.mmria_path+ "/" + child.name, p_search_text));
    }

    return result;
}

function render_search_text_grid_control(p_ctx)
{   
    p_ctx.result.push("<fieldset id='");
    
    p_ctx.result.push(p_ctx.metadata_path);
    p_ctx.result.push("' ");
    p_ctx.result.push(" mpath='" + p_ctx.metadata_path + "'");
    p_ctx.result.push(" class='grid2 grid-control' style='");
    let style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        p_ctx.result.push(get_only_size_and_position_string(style_object.control.style));
        is_grid_context = style_object;
    }
    p_ctx.result.push("' >"); // close opening div

    p_ctx.result.push("<legend class='grid-control-legend' style='");
    
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
    for(let i = 0; i < p_ctx.metadata.children.length; i++)
    {
        let child = p_ctx.metadata.children[i];

        let new_context = get_seach_text_context(p_ctx.result, p_ctx.post_html_render, child.name, p_ctx.data[child.name], p_ctx.mmria_path + "/" + child.name, p_ctx.metadata_path  + ".children[" + i + "]", p_ctx.object_path, p_ctx.search_text);
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
    let style_object = g_default_ui_specification.form_design[p_ctx.mmria_path.substring(1)];
    if(style_object)
    {
        p_ctx.result.push("<div metadata='");
        p_ctx.result.push(p_ctx.mmria_path_path);
        p_ctx.result.push("' class='form-group mb-4'>");
        p_ctx.result.push("<p>");
        p_ctx.result.push(p_ctx.mmria_path.substring(1).replace(/\//g, " > "));
        p_ctx.result.push("</p>");
            
        p_ctx.result.push("<label class='row no-gutters w-auto h-auto' for='");
        p_ctx.result.push(p_ctx.mmria_path.replace(/\//g, "--"));
        p_ctx.result.push("' style='");
                //if(style_object.prompt)
                //result.push(get_style_string(style_object.prompt.style)); 
                p_ctx.result.push("'>");
                p_ctx.result.push(p_ctx.metadata.prompt);
                p_ctx.result.push("</label>");
            
                p_ctx.result.push("<select id='");
                p_ctx.result.push(p_ctx.mmria_path);
                p_ctx.result.push("' class='custom-select' ");

            if(style_object.control)
            {
                p_ctx.result.push("style='")
                p_ctx.result.push(get_only_size_and_font_style_string(style_object.control.style));
                p_ctx.result.push("' "); 
            }

            if
            (
                (
                    p_ctx.metadata.is_read_only != null &&
                    p_ctx.metadata.is_read_only == true
                ) ||
                p_ctx.metadata.mirror_reference
            )
            {
                p_ctx.result.push(" readonly=true ");
            }
            else
            {
                p_ctx.result.push("  onchange='g_set_data_object_from_path(\"");
                p_ctx.result.push(p_ctx.object_path);
                p_ctx.result.push("\",\"");
                p_ctx.result.push(p_ctx.metadata_path);
                p_ctx.result.push("\",\"");
                p_ctx.result.push(p_ctx.dictionary_path);
                p_ctx.result.push("\",this.value)'  ");
            }

            if(p_ctx.metadata.list_display_size != null)
            {
                p_ctx.result.push(" size='"); 
                p_ctx.result.push(p_ctx.metadata.list_display_size);
            }
            
            p_ctx.result.push("' >"); 


            let data_value_list = p_ctx.metadata.values;

            if(p_ctx.metadata.path_reference && p_ctx.metadata.path_reference != "")
            {
                data_value_list = eval(convert_dictionary_path_to_lookup_object(p_ctx.metadata.path_reference));
        
                if(data_value_list == null)	
                {
                    data_value_list = p_ctx.metadata.values;
                }
            }

            for(let i = 0; i < data_value_list.length; i++)
            {
                let child = data_value_list[i];
                p_ctx.result.push("<option ");
                if(p_ctx.data == child.value)
                {
                    p_ctx.result.push("selected ");
                }
                p_ctx.result.push(" value='");
                p_ctx.result.push(child.value);
                p_ctx.result.push("'>");


                if(child.display)
                {

                    p_ctx.result.push(child.display);
                }
                else if(child.value == -9)
                {
                    p_ctx.result.push("(blank)");
                }
                else
                {
                    p_ctx.result.push(child.value);
                }
                p_ctx.result.push("</option>");

            }
            
            p_ctx.result.push("</select>");
            p_ctx.result.push("</div>");
    }
}

function get_only_size_and_font_style_string(p_specicification_style_string)
{

    let result = [];

    let properly_formated_style = p_specicification_style_string.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');
    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"
    let items = properly_formated_style.split(";")
    for(let i = 0; i < items.length; i++)
    {
        let pair = items[i].split(":");
        let value = null;
        switch(pair[0].toLocaleLowerCase())
        {

            case "height":
            case "width":
                value = pair[1].trim();
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
                value = pair[1].trim();
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
