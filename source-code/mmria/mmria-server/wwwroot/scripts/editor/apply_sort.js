
function g_apply_sort(p_metadata, p_data, p_metadata_path, p_object_path, p_dictionary_path)
{

     switch(p_metadata.type.toLowerCase())
	{
		case 'grid':

            if
            (
                p_metadata.sort_order != null &&
                p_metadata.sort_order.length !=0
            )
            {
                
            }










			grid_render(result, p_metadata, p_data, p_ui, p_metadata_path, p_object_path, p_dictionary_path, p_is_grid_context, p_post_html_render, p_search_ctx, p_ctx);
			break;

		case 'group':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];
                if (p_data[child.name] != nul) 
                {
                    g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                }
            }
			break;

		case 'form':
            if (p_metadata.cardinality == "+" || p_metadata.cardinality == "*") 
            {
                for (let i = 0; i < p_data.length; i++) 
                {
                    let item = p_data[i];

                    for (let i = 0; i < p_metadata.children.length; i++) 
                    {
                        let child = p_metadata.children[i];
                        if (p_data[child.name] != nul) 
                        {
                            g_apply_sort(child, item[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                        }
                    }
                }
            }
            else
            {
                for (let i = 0; i < p_metadata.children.length; i++) 
                {
                    let child = p_metadata.children[i];
                    if (p_data[child.name] != nul) 
                    {
                        g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                    }
                }
            }
			break;

		case 'app':
            for (let i = 0; i < p_metadata.children.length; i++) 
            {
                let child = p_metadata.children[i];

                if (child.type.toLowerCase() == 'form' && p_ui.url_state.path_array[1] == child.name) 
                {
                    if (p_data[child.name] != nul) 
                    {
                        g_apply_sort(child, p_data[child.name], p_metadata_path + ".children[" + i + "]", p_object_path + "." + child.name, p_dictionary_path + "/" + child.name);
                    }
                }
            }
			break;

		case 'label':
		case 'button':
		case 'string':
		case 'address':
		case 'textarea':
		case 'number':
		case 'boolean':
		case 'list':
		case 'date':
		case 'datetime':
		case 'time':
		case 'chart':
		case 'hidden':
		case 'jurisdiction':
            break;

		default:
			console.log("page_render not processed", p_metadata);
			break;
	}

	return result;
}

