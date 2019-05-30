function search_text_change(p_form_control)
{
    var search_text = p_form_control.value;
    var form_container = document.getElementById("form");
    var form_tag = document.getElementById("form_tag");
    var form_dropdown = document.getElementById("selected_form");

    // if text isn't null and longer than 3
    if(search_text != null && search_text.length > 3)
    {
        form_tag.innerHTML = "Search results for field(s): <em>" + search_text + "</em>";
        form_dropdown.value = "";
        form_container.innerHTML = render_search_text(g_metadata, "", search_text).join("");
    }
    else
    {
        if(form_dropdown.value.length > 0)
        {

            form_selection_change(form_dropdown);
        }
        else
        {
            // document.getElementById("form").innerHTML = render(g_metadata, "", "home_record").join("");
            console.log('None!');
        }
    }
}

function render_search_text(p_metadata, p_path, p_search_text, p_is_grid)
{

    var result = [];

    switch(p_metadata.type.toLocaleLowerCase())
    {
        case "app":
            for(var i in p_metadata.children)
            {
                var child = p_metadata.children[i];
                Array.prototype.push.apply(result, render_search_text(child, p_path + "/" + child.name, p_search_text));
            }
            break;
        case "form":
            for(var i in p_metadata.children)
            {
                var child = p_metadata.children[i];
                Array.prototype.push.apply(result, render_search_text(child, p_path + "/" + child.name, p_search_text));
            }
            
            break;
        case "string":
        case "number":
        case "date":
        case "datetime":
        case "time":
            if(p_metadata.prompt.toLocaleLowerCase().search(p_search_text.toLocaleLowerCase()) > -1)
            {
                Array.prototype.push.apply(result, render_search_text_input_control(p_metadata, p_path, p_is_grid));
            }
            
            break;
        case "group":
            Array.prototype.push.apply(result, render_search_text_group_control(p_metadata, p_path, p_search_text, p_is_grid));    
           
            
        
        break;
        case "grid":
            Array.prototype.push.apply(result, render_search_text_grid_control(p_metadata, p_path, p_search_text));
            break;
        case "list":
            if(p_metadata.prompt.toLocaleLowerCase().search(p_search_text.toLocaleLowerCase()) > -1)
            {
                Array.prototype.push.apply(result, render_search_text_select_control(p_metadata, p_path, p_is_grid));    
            }
            break;
        case "textarea":
            if(p_metadata.prompt.toLocaleLowerCase().search(p_search_text.toLocaleLowerCase()) > -1)
            {
                Array.prototype.push.apply(result, render_search_text_textarea_control(p_metadata, p_path, p_is_grid));    
            }  
            break;
    }

    return result;

    console.log("started");

}

function render_search_text_input_control(p_metadata, p_path, p_search_text, p_is_grid)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
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
                result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
                result.push("'>");
                result.push(p_metadata.prompt);
                result.push("</label>");
            }
            result.push("<input id='");
            result.push(p_path.replace(/\//g, "--"));
            result.push("' type='text' style='");
            if(!p_is_grid)
                result.push(get_only_size_and_font_style_string(style_object.control.style));
            result.push("' />"); 


        result.push("</div><br/>");
    }

    return result;
}


function render_search_text_textarea_control(p_metadata, p_path, p_search_text, p_is_grid)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
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
                result.push(get_only_size_and_font_style_string(style_object.prompt.style)); 
                result.push("'>");
                result.push(p_metadata.prompt);
                result.push("</label><br/>");
            }
            result.push("<textarea id='");
            result.push(p_path.replace(/\//g, "--"));
            result.push("' type='text' style='");
            if(!p_is_grid)
                result.push(get_only_size_and_font_style_string(style_object.control.style));
            result.push("' />"); 

            result.push("</textarea>");
        result.push("</div><br/>");
    }

    return result;
}


function render_search_text_group_control(p_metadata, p_path, p_search_text)
{   
    var result = [];

    //var style_object = ui_specification.form_design[p_path.substring(1)];
    /*
        result.push("<fieldset metadata='");
        result.push(p_path);
        result.push("' style='");
        if(style_object.control)
        //result.push(get_only_size_and_position_string(style_object.control.style)); 
        result.push("'>");
        
            result.push("<legend style='");
            result.push(get_only_font_style_string(style_object.control.style));
            result.push("'>");
            result.push(p_metadata.prompt);
            result.push("</legend>");
    */
            for(var i in p_metadata.children)
            {
                var child = p_metadata.children[i];
                Array.prototype.push.apply(result, render_search_text(child, p_path + "/" + child.name, p_search_text));
            }

      //  result.push("</fieldset>");
    

    return result;
}

function render_search_text_grid_control(p_metadata, p_path, p_search_text)
{   
    var result = [];

    //var style_object = ui_specification.form_design[p_path.substring(1)];
    //if(style_object)
    //{
/*
        result.push("<table metadata='");
        result.push(p_path);
        result.push("' style='");
        //if(style_object.control)
        //result.push(get_only_size_and_position_string(style_object.control.style)); 
        result.push("' border=1>");

        result.push("<tr><th align=center colspan=");
        result.push(p_metadata.children.length);
        result.push(">");
        result.push(p_metadata.prompt);
        result.push("</th></tr>");
        result.push("<tr>");
        for(var i in p_metadata.children)
        {
            
            var child = p_metadata.children[i];
            result.push("<th>")
            result.push(child.prompt);
            result.push("</th>")

        }
        result.push("</tr>")

        result.push("<tr>");
        */
        for(var i in p_metadata.children)
        {
            var child = p_metadata.children[i];
            //result.push("<td>");
            Array.prototype.push.apply(result, render_search_text(child, p_path + "/" + child.name, p_search_text, false));
            //result.push("</td>");
        }
        /*
        result.push("</tr>");
        result.push("</table>");*/
    //}

    return result;
}

function render_search_text_select_control(p_metadata, p_path, p_is_grid)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
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
