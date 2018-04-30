function grid_render(p_result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render)
{
    var is_grid_context = true;

    //p_result.push("<table style='grid-column:1/-1'  id='");
    p_result.push("<table id='");
    p_result.push(p_metadata_path);
    p_result.push("' class='grid'><tr><th colspan=");
    p_result.push(p_metadata.children.length + 1)
    p_result.push(">");
    p_result.push(p_metadata.prompt);
    p_result.push("</th></tr>");

    p_result.push('<tr>');
    for(var i = 0; i < p_metadata.children.length; i++)
    {
        var child = p_metadata.children[i];
        p_result.push('<th>');
        p_result.push(child.prompt);
        p_result.push('</th>')

    }
    p_result.push('<th>&nbsp;</th></tr>');

    for(var i = 0; i < p_data.length; i++)
    {
        p_result.push('<tr>');
        for(var j = 0; j < p_metadata.children.length; j++)
        {
            var child = p_metadata.children[j];
            p_result.push("<td>");
            if(p_data[i][child.name] || p_data[child.name] == 0)
            {
                // do nothing 
            }
            else
            {
                p_data[i][child.name] = create_default_object(child, {})[child.name];
            }
            Array.prototype.push.apply(p_result, page_render(child, p_data[i][child.name], p_ui, p_metadata_path + ".children[" + j + "]", p_object_path + "[" + i + "]." + child.name, p_dictionary_path + "/" + child.name, is_grid_context, p_post_html_render));
            p_result.push("</td>");
        }
        p_result.push('<td> <input type="button" class="btn btn-primary" value="delete" id="delete_');
        p_result.push(p_object_path.replace(/\./g,"_") + "[" + i + "]");
        p_result.push('" onclick="g_delete_grid_item(\'');
        p_result.push(p_object_path + "[" + i + "]");
        p_result.push("', '");
        p_result.push(p_metadata_path);
        p_result.push('\')" /></td></tr>');
    }
    p_result.push("<tr><td colspan=");
    p_result.push(p_metadata.children.length + 1);
    p_result.push(" align=right> <input type='button'  class='btn btn-primary' value='Add Item' onclick='g_add_grid_item(\"");
    p_result.push(p_object_path);
    p_result.push("\", \"");
    p_result.push(p_metadata_path);
    p_result.push("\")' /></td></tr>");

    p_result.push("</table>");
}