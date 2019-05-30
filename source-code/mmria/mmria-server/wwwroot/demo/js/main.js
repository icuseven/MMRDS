var g_metadata = null;
var ui_specification = null;
var g_look_up = {};

function main()
{
        $.ajax
        ({
        url: location.protocol + '//' + location.host + '/api/ui_specification/default_ui_specification',
        }).done(function(response) 
    {
        ui_specification = response;
        get_metadata();
    });
}


function get_metadata()
{
    $.ajax
    ({
        url: location.protocol + '//' + location.host + '/api/metadata',
    }).done(function(response) 
    {
        g_metadata = response;

        for(var i in g_metadata.lookup)
        {
            var child = g_metadata.lookup[i];

            g_look_up["lookup/" + child.name] = child.values;
        }
        
        document.getElementById("selected_form").innerHTML = render_selected_form(g_metadata).join("");
        document.getElementById("form").innerHTML = render(g_metadata, "", "home_record").join("");

        // if 'form_nav' exists (not nullor undefined)
        if (!isNullOrUndefined(document.getElementById("form_nav"))) {
            document.getElementById("form_nav").innerHTML = render_app_nav_btns(g_metadata);
        }
    });
}

function form_selection_change(p_form_control)
{
    var selected_form = p_form_control.value;
    
    if(selected_form != null && selected_form.length > 0)
    {
        var form_tag = document.getElementById('form_tag');
        var form_select = $("#selected_form");
        var form_title_new = form_select.find(':selected')[0].innerText;
        document.getElementById("form").innerHTML = render(g_metadata, "", selected_form).join("");
        form_tag.innerHTML = form_title_new;
    }
}

function form_selection_click(p_form_control)
{
    var selected_form = p_form_control.getAttribute("data-value");
    var selected_title = p_form_control.innerText;
    document.getElementById("form").innerHTML = render(g_metadata, "", selected_form).join("");
    form_tag.innerHTML = selected_title;
}

function render(p_metadata, p_path, p_form, p_is_grid)
{

    var result = [];

    switch(p_metadata.type.toLocaleLowerCase())
    {
        case "app":
        for(var i in p_metadata.children)
        {
            var child = p_metadata.children[i];
            Array.prototype.push.apply(result, render(child, p_path + "/" + child.name, p_form));
        }
        break;
        case "form":

            if(p_metadata.name == p_form)
            {

                for(var i in p_metadata.children)
                {
                    var child = p_metadata.children[i];
                    Array.prototype.push.apply(result, render(child, p_path + "/" + child.name, p_form));
                }
            }
            break;
        case "string":
        case "number":
        case "date":
        case "datetime":
        case "time":
            Array.prototype.push.apply(result, render_input_control(p_metadata, p_path, p_is_grid));
            break;
        case "group":
            Array.prototype.push.apply(result, render_group_control(p_metadata, p_path, p_is_grid));
        
        break;
        case "grid":
            Array.prototype.push.apply(result, render_grid_control(p_metadata, p_path));
            break;
        case "list":
            Array.prototype.push.apply(result, render_select_control(p_metadata, p_path, p_is_grid));
        
        break;
        

    }

    return result;


    console.log("started");

}

function render_input_control(p_metadata, p_path, p_is_grid)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {
        result.push("<div metadata='");
        result.push(p_path);
        result.push("'>");
        
            if(!p_is_grid)
            {
                result.push("<label for='");
                result.push(p_path.replace(/\//g, "--"));
                result.push("' style='");
                result.push(get_style_string(style_object.prompt.style)); 
                result.push("'>");
                result.push(p_metadata.prompt);
                result.push("</label>");
            }
            result.push("<input id='");
            result.push(p_path.replace(/\//g, "--"));
            result.push("' type='text' style='");
            if(!p_is_grid)
            result.push(get_style_string(style_object.control.style));
            result.push("' />"); 


        result.push("</div>");
    }

    return result;
}

function render_group_control(p_metadata, p_path)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {

        result.push("<fieldset metadata='");
        result.push(p_path);
        result.push("' style='");
        if(style_object.control)
        result.push(get_only_size_and_position_string(style_object.control.style)); 
        result.push("'>");
        
            result.push("<legend style='");
            result.push(get_only_font_style_string(style_object.control.style));
            result.push("'>");
            result.push(p_metadata.prompt);
            result.push("</legend>");

            for(var i in p_metadata.children)
            {
                var child = p_metadata.children[i];
                Array.prototype.push.apply(result, render(child, p_path + "/" + child.name));
            }

        result.push("</fieldset>");
    }

    return result;
}

function render_grid_control(p_metadata, p_path)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {

        result.push("<table metadata='");
        result.push(p_path);
        result.push("' style='");
        if(style_object.control)
        result.push(get_only_size_and_position_string(style_object.control.style)); 
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
        for(var i in p_metadata.children)
        {
            var child = p_metadata.children[i];
            result.push("<td>");
            Array.prototype.push.apply(result, render(child, p_path + "/" + child.name, null, true));
            result.push("</td>");
        }
        result.push("</tr>");
        result.push("</table>");
    }

    return result;
}

function render_select_control(p_metadata, p_path, p_is_grid)
{   
    var result = [];

    var style_object = ui_specification.form_design[p_path.substring(1)];
    if(style_object)
    {
        result.push("<div metadata='");
        result.push(p_path);
        result.push("'>");
            if(!p_is_grid)
            {
                result.push("<label for='");
                result.push(p_path.replace(/\//g, "--"));
                result.push("' style='");
                if(style_object.prompt)
                result.push(get_style_string(style_object.prompt.style)); 
                result.push("'>");
                result.push(p_metadata.prompt);
                result.push("</label>");
            }
            result.push("<select id='");
            result.push(p_path.replace(/\//g, "--"));
            result.push("' type='text' style='");
            if(!p_is_grid)
            if(style_object.control)
            result.push(get_style_string(style_object.control.style));
            result.push("' "); 
            if(p_metadata.list_display_size != null)
            {
                result.push(" size='"); 
                result.push(p_metadata.list_display_size);
            }
            
            result.push("' >");
            result.push("<option>Select One</option>");

            if(p_metadata.path_reference && p_metadata.path_reference.length > 0)
            {
                for(var i in g_look_up[p_metadata.path_reference])
                {
                    var child = g_look_up[p_metadata.path_reference][i];

                    // Removes the empty option if child.description OR child.value is null/undefined
                    if (!isNullOrUndefined(child.description) || !isNullOrUndefined(child.value)) {
                        result.push("<option value='"+ child.value +"'>");
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
            }
            else
            {

                for(var i in p_metadata.values)
                {
                    var child = p_metadata.values[i];
                    
                    // Removes the empty option if child.description OR child.value is null/undefined
                    if (!isNullOrUndefined(child.description) || !isNullOrUndefined(child.value)) {
                        result.push("<option value='"+ child.value +"'>");
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
            }

            result.push("</select>");
        result.push("</div>");
    }

    return result;
}


function get_style_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');


    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"ui_specification
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {
            case "top":
            case "left":
            case "height":
            case "width":
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

            default:
                result.push(pair.join(":"));
                break;
        }

    }


    return result.join(";");
}


function get_only_size_and_position_string(p_specicification_style_string)
{

    var result = [];

    var properly_formated_style = p_specicification_style_string;
    properly_formated_style = properly_formated_style.replace(/[{}]/g, ""); 
    properly_formated_style = properly_formated_style.replace(/['"]+/g, '');
    properly_formated_style = properly_formated_style.replace(/[,]+/g, ';');


    properly_formated_style = properly_formated_style.replace(/(\d+); (\d+); (\d+)/g, '$1, $2, $3');
    //"position:absolute;top:4;left:13;height:46px;width:146.188px;font-weight:400;font-size:16px;font-style:normal;color:rgb(33; 37; 41)"ui_specification
    var items = properly_formated_style.split(";")
    for(var i in items)
    {
        var pair = items[i].split(":");
        switch(pair[0].toLocaleLowerCase())
        {
            case "top":
            case "left":
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
            case "position":
                result.push(pair.join(":"));
                break;
        }

    }


    return result.join(";");
}

function get_only_font_style_string(p_specicification_style_string)
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

function render_selected_form(p_metadata)
{
    var result = [];

    switch(p_metadata.type.toLocaleLowerCase())
    {
        case "app":
        // result.push("<option value=''>Select a form</option>");
        for(var i in p_metadata.children)
        {
            var child = p_metadata.children[i];
            Array.prototype.push.apply(result, render_selected_form(child));
        }
        break;
        case "form":
            result.push("<option value='");
            result.push(p_metadata.name);
            result.push("'>")
            result.push(p_metadata.prompt);
            result.push("</option>");
            break;
    }

    return result;
}

function render_app_nav_btns(p_metadata) {
    var items = p_metadata.children;
    var nav = '';
    for (var i = 0; i < items.length; i++) {
        if (items[i].type == 'form') {
            nav += '<li class="list-group-item nav-lvl2">'
                nav += '<a href="#" class="list-group-item-action" data-value="'+ items[i].name +'" onclick="form_selection_click(this);">'+ items[i].prompt +'</a>'
            nav += '</li>'
        }
    }
    return nav;
}

// Service func to help if a value is null, undefined, 0, ''(empty str), false or NaN
function isNullOrUndefined (val) {
    if (typeof val !== 'undefined' && val) {
        return false;
    } else {
        return true;
    }
}
